/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: بحث روايات و تحميل
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import fs from 'fs';
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

const API_BASE = 'https://engez.a7a.online/api/v1/reading/sunovels';
const FALLBACK_IMAGE = 'https://files.catbox.moe/z5zh28.jpg';

global.sunovelsSessions = global.sunovelsSessions || {};

const getSession = (sender) => {
  if (!global.sunovelsSessions[sender]) {
    global.sunovelsSessions[sender] = {
      results: [],
      novel: null,
      totalPages: 0,
      page: 1,
      chapters: []
    };
  }
  return global.sunovelsSessions[sender];
};

const apiGet = async (params) => {
  const url = `${API_BASE}?${new URLSearchParams(params).toString()}`;
  const { data } = await axios.get(url, { timeout: 30000 });
  return data;
};

const searchNovels = async (q) => {
  try {
    const res = await apiGet({ action: 'search', q });
    if (res?.success && Array.isArray(res?.response)) {
      return res.response;
    }
    return [];
  } catch (error) {
    throw new Error(`فشل البحث: ${error.message}`);
  }
};

const getChaptersPage = async (url, page) => {
  try {
    const res = await apiGet({ action: 'chapters', url, page: String(page) });
    if (res?.success && res?.response) {
      return {
        chapters: Array.isArray(res.response.chapters) ? res.response.chapters : [],
        totalPages: res.response.totalPages || 0
      };
    }
    return { chapters: [], totalPages: 0 };
  } catch (error) {
    throw new Error(`فشل جلب الفصول: ${error.message}`);
  }
};

const getContent = async (url) => {
  try {
    const res = await apiGet({ action: 'content', url });
    if (res?.success && res?.response) {
      return res.response || { text: '', novelTitle: '', chapterTitle: '' };
    }
    return { text: '', novelTitle: '', chapterTitle: '' };
  } catch (error) {
    throw new Error(`فشل جلب المحتوى: ${error.message}`);
  }
};

const makeInteractiveList = async (conn, m, title, body, footer, imageUrl, sections) => {
  try {
    const mediaMessage = await prepareWAMessageMedia(
      { image: { url: imageUrl } },
      { upload: conn.waUploadToServer }
    );

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: body },
              footer: { text: footer },
              header: {
                hasMediaAttachment: true,
                imageMessage: mediaMessage.imageMessage
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                      title,
                      sections
                    })
                  }
                ]
              }
            }
          }
        }
      },
      { userJid: conn.user.jid, quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    return true;
  } catch (error) {
    return false;
  }
};

const sendText = async (conn, m, text) => {
  return conn.sendMessage(m.chat, { text }, { quoted: m });
};

const buildNovelSections = (results, usedPrefix) => {
  return [
    {
      title: 'نتائج البحث',
      highlight_label: 'اختر رواية',
      rows: results.slice(0, 10).map((item, index) => ({
        header: `📖 ${item.title}`,
        title: item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title,
        description: item.author ? `✍️ ${item.author}` : 'اختيار الرواية',
        id: `${usedPrefix}رواية-اختيار ${index + 1}`
      }))
    }
  ];
};

const buildPageSections = (totalPages, usedPrefix) => {
  const sections = [];
  const step = 10;
  const pages = Math.min(totalPages, 47);

  for (let start = 1; start <= pages; start += step) {
    const end = Math.min(start + step - 1, pages);
    const rows = [];

    for (let p = start; p <= end; p++) {
      rows.push({
        header: `📄 صفحة ${p}`,
        title: `صفحة ${p}`,
        description: 'عرض فصول هذه الصفحة',
        id: `${usedPrefix}رواية-صفحة ${p}`
      });
    }

    sections.push({
      title: `الصفحات ${start}-${end}`,
      highlight_label: 'اختر صفحة',
      rows
    });
  }

  return sections;
};

const buildChapterSections = (chapters, usedPrefix) => {
  const sections = [];
  const step = 10;

  const sortedChapters = [...chapters].sort((a, b) => {
    const numA = parseInt(a.title);
    const numB = parseInt(b.title);
    return numA - numB;
  });

  for (let start = 0; start < sortedChapters.length; start += step) {
    const end = Math.min(start + step, sortedChapters.length);
    const rows = [];

    for (let i = start; i < end; i++) {
      const ch = sortedChapters[i];
      const chapterNum = i + 1;
      rows.push({
        header: `📖 فصل ${chapterNum}`,
        title: ch?.title ? String(ch.title).slice(0, 40) : `فصل ${chapterNum}`,
        description: 'تحميل TXT',
        id: `${usedPrefix}رواية-فصل ${chapterNum}`
      });
    }

    sections.push({
      title: `الفصول ${start + 1}-${end}`,
      highlight_label: 'اختر فصل',
      rows
    });
  }

  return sections;
};

const showNovelResults = async (conn, m, text, results, usedPrefix) => {
  const firstImage = results[0]?.img || FALLBACK_IMAGE;
  const body = `📚 نتائج البحث عن: ${text}\n\nاختر رواية من الأزرار`;
  const ok = await makeInteractiveList(
    conn,
    m,
    'نتائج البحث',
    body,
    'روايات',
    firstImage,
    buildNovelSections(results, usedPrefix)
  );

  if (!ok) {
    let fallback = `📚 نتائج البحث عن: ${text}\n\n`;
    results.slice(0, 10).forEach((r, i) => {
      fallback += `${i + 1}. ${r.title}\n`;
    });
    fallback += `\nاستخدم: ${usedPrefix}رواية-اختيار <رقم>`;
    await sendText(conn, m, fallback);
  }
};

const showPages = async (conn, m, novel, totalPages, usedPrefix) => {
  const image = novel.img || FALLBACK_IMAGE;
  const body = `📖 ${novel.title}\n\nاختر صفحة الفصول من الأزرار`;
  const ok = await makeInteractiveList(
    conn,
    m,
    'صفحات الفصول',
    body,
    'اختيار الصفحة',
    image,
    buildPageSections(totalPages || 1, usedPrefix)
  );

  if (!ok) {
    let fallback = `📖 ${novel.title}\nعدد صفحات الفصول: ${totalPages}\n\n`;
    const pages = Math.min(totalPages, 47);
    for (let i = 1; i <= pages; i++) {
      fallback += `${i}. ${usedPrefix}رواية-صفحة ${i}\n`;
    }
    await sendText(conn, m, fallback);
  }
};

const showChapters = async (conn, m, novel, pageNumber, totalPages, chapters, usedPrefix) => {
  const image = novel.img || FALLBACK_IMAGE;
  const body = `📖 ${novel.title}\n📄 الصفحة ${pageNumber} / ${totalPages}\n\nاختر فصل من الأزرار`;

  const ok = await makeInteractiveList(
    conn,
    m,
    'الفصول',
    body,
    'اختيار الفصل',
    image,
    buildChapterSections(chapters, usedPrefix)
  );

  if (!ok) {
    const sortedChapters = [...chapters].sort((a, b) => {
      const numA = parseInt(a.title);
      const numB = parseInt(b.title);
      return numA - numB;
    });

    let fallback = `📖 ${novel.title}\n📄 الصفحة ${pageNumber} / ${totalPages}\n\n`;
    sortedChapters.slice(0, 50).forEach((ch, i) => {
      const num = i + 1;
      fallback += `${num}. ${ch.title}\n`;
    });
    fallback += `\nاستخدم: ${usedPrefix}رواية-فصل <رقم>`;
    await sendText(conn, m, fallback);
  }
};

const handler = async (m, { conn, text, command, usedPrefix }) => {
  const session = getSession(m.sender);

  try {
    if (command === 'رواية' || command === 'روايه' || command === 'anovel') {
      if (!text) {
        return await sendText(conn, m, "📚 اكتب اسم الرواية\nمثال: رواية القس المجنون");
      }

      await sendText(conn, m, `⏳ جاري البحث عن: ${text}...`);

      const results = await searchNovels(text);
      if (!results.length) {
        return await sendText(conn, m, `❌ لم أجد روايات باسم: ${text}`);
      }

      session.results = results;
      session.novel = null;
      session.totalPages = 0;
      session.page = 1;
      session.chapters = [];

      await showNovelResults(conn, m, text, results, usedPrefix);
      return;
    }

    if (command === 'رواية-اختيار' || command === 'روايه-اختيار') {
      const idx = parseInt(text);
      if (!idx || idx < 1 || idx > session.results.length) {
        return await sendText(conn, m, `❌ اكتب رقم صحيح من 1 إلى ${session.results.length}`);
      }

      const novel = session.results[idx - 1];
      if (!novel?.url) {
        return await sendText(conn, m, `❌ تعذر تحديد الرواية`);
      }

      await sendText(conn, m, `⏳ جاري تحميل فصول: ${novel.title}...`);

      const firstPage = await getChaptersPage(novel.url, 0);

      session.novel = novel;
      session.totalPages = Number(firstPage.totalPages || 1);
      session.page = 1;
      session.chapters = Array.isArray(firstPage.chapters) ? firstPage.chapters : [];

      await showPages(conn, m, novel, session.totalPages, usedPrefix);
      return;
    }

    if (command === 'رواية-صفحة' || command === 'روايه-صفحة') {
      if (!session.novel) {
        return await sendText(conn, m, "❌ اختر رواية أولاً باستخدام: رواية-اختيار <رقم>");
      }

      const pageNumber = parseInt(text);
      const maxPages = Math.min(session.totalPages, 47);
      if (!pageNumber || pageNumber < 1 || pageNumber > maxPages) {
        return await sendText(conn, m, `❌ رقم الصفحة غير صحيح (1 - ${maxPages})`);
      }

      await sendText(conn, m, `⏳ جاري تحميل الصفحة ${pageNumber}...`);

      const pageData = await getChaptersPage(session.novel.url, pageNumber - 1);
      const chapters = Array.isArray(pageData.chapters) ? pageData.chapters : [];

      if (!chapters.length) {
        return await sendText(conn, m, `❌ لا توجد فصول في هذه الصفحة`);
      }

      session.page = pageNumber;
      session.chapters = chapters;

      await showChapters(conn, m, session.novel, pageNumber, session.totalPages, chapters, usedPrefix);
      return;
    }

    if (command === 'رواية-فصل' || command === 'روايه-فصل') {
      if (!session.novel) {
        return await sendText(conn, m, "❌ اختر رواية أولاً باستخدام: رواية-اختيار <رقم>");
      }

      const sortedChapters = [...session.chapters].sort((a, b) => {
        const numA = parseInt(a.title);
        const numB = parseInt(b.title);
        return numA - numB;
      });

      const num = parseInt(text);
      if (!num || num < 1 || num > sortedChapters.length) {
        return await sendText(conn, m, `❌ رقم الفصل غير صحيح (1 - ${sortedChapters.length})`);
      }

      const chapter = sortedChapters[num - 1];
      if (!chapter?.url) {
        return await sendText(conn, m, `❌ لم أجد هذا الفصل`);
      }

      await sendText(conn, m, `⏳ جاري تحميل الفصل ${num}...`);

      const content = await getContent(chapter.url);
      if (!content?.text) {
        return await sendText(conn, m, `❌ تعذر جلب نص الفصل`);
      }

      const fileName = `${(content.novelTitle || session.novel.title || 'novel')
        .replace(/[\/\\:*?"<>|]/g, '_')
        .slice(0, 60)}_${(content.chapterTitle || chapter.title || `chapter_${num}`)
        .replace(/[\/\\:*?"<>|]/g, '_')
        .slice(0, 60)}.txt`;

      const filePath = `/tmp/${Date.now()}.txt`;
      fs.writeFileSync(filePath, content.text, 'utf8');

      await conn.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(filePath),
          mimetype: 'text/plain',
          fileName
        },
        { quoted: m }
      );

      fs.unlinkSync(filePath);
      return;
    }

    if (command === 'رواية-الصفحات' || command === 'روايه-الصفحات') {
      if (!session.novel) {
        return await sendText(conn, m, "❌ اختر رواية أولاً باستخدام: رواية-اختيار <رقم>");
      }

      await showPages(conn, m, session.novel, session.totalPages || 1, usedPrefix);
      return;
    }

    if (command === 'رواية-تحديث' || command === 'روايه-تحديث') {
      if (!session.novel) {
        return await sendText(conn, m, "❌ اختر رواية أولاً باستخدام: رواية-اختيار <رقم>");
      }

      await sendText(conn, m, `⏳ جاري تحديث الفصول...`);

      const pageData = await getChaptersPage(session.novel.url, Math.max(0, (session.page || 1) - 1));
      const chapters = Array.isArray(pageData.chapters) ? pageData.chapters : [];
      session.chapters = chapters;
      await showChapters(conn, m, session.novel, session.page || 1, session.totalPages || 1, chapters, usedPrefix);
      return;
    }
  } catch (error) {
    console.error('❌ Handler error:', error);
    await sendText(conn, m, `❌ حدث خطأ: ${error.message || 'خطأ غير معروف'}`);
  }
};

handler.help = [
  'رواية <اسم> - البحث عن رواية',
  'رواية-اختيار <رقم> - اختيار رواية من النتائج',
  'رواية-صفحة <رقم> - عرض فصول صفحة معينة',
  'رواية-فصل <رقم> - تحميل فصل معين',
  'رواية-الصفحات - عرض صفحات الفصول',
  'رواية-تحديث - تحديث قائمة الفصول'
];

handler.tags = ['internet'];
handler.command = [
  'رواية',
  'روايه',
  'anovel',
  'رواية-اختيار',
  'روايه-اختيار',
  'رواية-صفحة',
  'روايه-صفحة',
  'رواية-فصل',
  'روايه-فصل',
  'رواية-الصفحات',
  'روايه-الصفحات',
  'رواية-تحديث',
  'روايه-تحديث'
];

export default handler;