/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تحميل افلام و مسلسلات عربي و انجليزي بس جوده عاليه بس اهم شي قبل التنزيل تعمل ريستارت لي بوتك عشان الملفات بتبقي كبيره ده لو سرفرك ضعيف
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const API_BASE = 'https://engez.a7a.online/api/v1';

async function searchMovie(query) {
    try {
        const params = new URLSearchParams();
        params.append('action', 'بحث');
        params.append('q', query);

        const response = await axios.get(`${API_BASE}/download/moviebox?${params.toString()}`, {
            timeout: 30000
        });

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل البحث');
        }

        return response.data;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال');
    }
}

async function getEpisodes(subjectId, subjectType) {
    try {
        const params = new URLSearchParams();
        params.append('action', 'حلقات');
        params.append('subjectId', subjectId);
        params.append('subjectType', subjectType);

        const response = await axios.get(`${API_BASE}/download/moviebox?${params.toString()}`, {
            timeout: 30000
        });

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل جلب الحلقات');
        }

        return response.data;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال');
    }
}

async function downloadEpisode(subjectId, subjectType, episode) {
    try {
        const params = new URLSearchParams();
        params.append('action', 'تحميل');
        params.append('subjectId', subjectId);
        params.append('subjectType', subjectType);
        params.append('episode', episode);

        const response = await axios.get(`${API_BASE}/download/moviebox?${params.toString()}`, {
            timeout: 30000
        });

        if (!response.data?.success || !response.data?.url) {
            throw new Error(response.data?.error || 'فشل التحميل');
        }

        return response.data;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال');
    }
}

function formatDuration(seconds) {
    if (!seconds) return '0 د';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} د`;
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return `${hours}س ${remaining}د`;
}

const sendList = async (m, conn, { body, footer, buttonText, sections }) => {
    try {
        const interactiveMessage = {
            body: { text: body },
            footer: { text: footer || '👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏' },
            nativeFlowMessage: {
                buttons: [{
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: buttonText,
                        sections
                    })
                }]
            }
        };

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
                }
            }
        }, { userJid: conn.user.jid, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.error('sendList error:', e);
        await conn.reply(m.chat, body, m);
    }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text && (command === 'فيلم' || command === 'movie')) {
        return conn.reply(
            m.chat,
            '⚠️ ┊ *يرجى إدخال اسم الفيلم أو المسلسل*\n\n📌 *مثال:*\n' + `• ${usedPrefix}${command} عسل اسود`,
            m
        );
    }

    await m.react('⏳');

    try {
        if (command === 'فيلم' || command === 'movie') {
            const searchResult = await searchMovie(text);
            const results = searchResult.results || [];

            if (results.length === 0) {
                throw new Error('لم يتم العثور على أي نتائج!');
            }

            const sections = [{
                title: '🎬 نتائج البحث المتاحة',
                rows: results.slice(0, 10).map(item => ({
                    title: item.title.substring(0, 30),
                    description: `⭐ ${item.rating || 'N/A'} | 🎭 ${item.type || 'غير معروف'}`,
                    id: `${usedPrefix}حلقات ${item.id}|${item.typeId}|${encodeURIComponent(item.title)}`
                }))
            }];

            await sendList(m, conn, {
                body: `╭━━━〔 🎬 *بـحـث الأفـلام والـمـسـلـسـلات* 🎬 〕━━━╮\n│\n│ 🔍 ┊ *الـبـحـث:* ${text}\n│ 📊 ┊ *عـدد الـنـتـائـج:* ${results.length}\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n👇 *اختر العرض المطلوب من القائمة بالأسفل:*`,
                footer: '👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏 ',
                buttonText: '▻ إضغـط لـلاخـتـيـار ⚡',
                sections
            });

            await m.react('✅');
        }

        if (command === 'حلقات') {
            const [subjectId, subjectType, rawTitle] = text.split('|');
            const title = decodeURIComponent(rawTitle);

            const episodesData = await getEpisodes(subjectId, subjectType);
            const episodes = episodesData.results || [];

            if (episodes.length === 0) {
                throw new Error('لا توجد حلقات متاحة لهذا العرض!');
            }

            const sections = [{
                title: `📺 ${title}`,
                rows: episodes.slice(0, 20).map(ep => ({
                    title: `الحلقة ${ep.episode}`,
                    description: `⏱️ المدة: ${formatDuration(ep.duration)}`,
                    id: `${usedPrefix}تحميل ${subjectId}|${subjectType}|${ep.episode}|${encodeURIComponent(title)}`
                }))
            }];

            await sendList(m, conn, {
                body: `╭━━━〔 📺 *قـائـمـة الـحـلـقـات* 📺 〕━━━╮\n│\n│ 🎭 ┊ *العنوان:* ${title}\n│ 📊 ┊ *عدد الحلقات:* ${episodes.length}\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n👇 *اختر الحلقة المراد تحميلها:*`,
                footer: '👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏 ',
                buttonText: '▻ إضغـط لـلاخـتـيـار ⚡',
                sections
            });

            await m.react('✅');
        }

        if (command === 'تحميل') {
            const [subjectId, subjectType, episode, rawTitle] = text.split('|');
            const title = decodeURIComponent(rawTitle);

            await conn.reply(m.chat, `🚀 ┊ *جاري جلب وتحميل ${title} (الحلقة ${episode})...*`, m);

            const downloadData = await downloadEpisode(subjectId, subjectType, episode);

            if (downloadData.url) {
 
                try {
                    await conn.sendMessage(m.chat, {
                        video: { url: downloadData.url },
                        caption: `✨ ━━━〔 *تم التحميل بنجاح* 🎬 〕━━━ ✨\n\n📺 ┊ *العنوان:* ${title}\n📌 ┊ *الحلقة:* ${episode}\n\n👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏`
                    }, { quoted: m });
                } catch (err) {
                    await conn.sendMessage(m.chat, {
                        document: { url: downloadData.url },
                        mimetype: 'video/mp4',
                        fileName: `${title}_EP${episode}.mp4`,
                        caption: `✨ ━━━〔 *تم التحميل كملف* 🎬 〕━━━ ✨\n\n📺 ┊ *العنوان:* ${title}\n📌 ┊ *الحلقة:* ${episode}\n\n👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏`
                    }, { quoted: m });
                }

                await m.react('✅');
            } else {
                throw new Error('فشل الحصول على رابط التحميل المباشر!');
            }
        }

    } catch (error) {
        await m.react('❌');
        return conn.reply(m.chat, `❌ ┊ *خطأ:* ${error.message}`, m);
    }
};

handler.help = ['فيلم'];
handler.tags = ['downloader'];
handler.command = ['فيلم', 'movie', 'حلقات', 'تحميل'];

export default handler;