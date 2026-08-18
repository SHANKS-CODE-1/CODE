/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تبديل كامل في ملفات البوت إذا كان حقوق بقي أو روابط أو اي حاجه بي امان تام هو بيطول شويه  عشان بيفحص اي كود بيلاقي فيه حقوق عشان يتأكد إذا كان امان يتغير أو لا
╰━━━━━━━━━━━━━━━━━━╯
*/

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import path, { join, extname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.join(__dirname, '../');

const IGNORE_FILES = [
  'node_modules', '.git', 'package.json', 'package-lock.json', 
  '.npm', 'session', 'auth_info_baileys', 'Session', 'SubBot'
];

global.pendingReplacements = global.pendingReplacements || {};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findMatchesInFile(filePath, oldText) {
  const validExtensions = ['.js', '.json', '.txt', '.cjs', '.mjs'];
  if (!validExtensions.includes(extname(filePath))) return null;
  let content = readFileSync(filePath, 'utf8');
  if (!content.includes(oldText)) return null;
  const lines = content.split('\n');
  const matchedLines = lines.filter(line => line.includes(oldText)).map(l => l.trim());
  return { filePath, matchedLines };
}

function walkAndFind(dir, oldText, matchedFiles = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return matchedFiles; }
  for (const entry of entries) {
    if (IGNORE_FILES.includes(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkAndFind(fullPath, oldText, matchedFiles);
    } else {
      const matchData = findMatchesInFile(fullPath, oldText);
      if (matchData) matchedFiles.push(matchData);
    }
  }
  return matchedFiles;
}

async function checkFileSafetyWithAI(fileRelativePath, lines) {
  try {
    const prompt = `الملف: ${fileRelativePath}\nالأسطر:\n${lines.join('\n')}\nأجب بكلمتين فقط: هل الاستبدال هنا (آمن ✅) أم (خطر ⚠️) ولماذا باختصار؟`;
    const res = await fetch(`https://engez.a7a.online/api/v1/ai/gpt?q=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    let text = data.result?.message || data.result || data.message || 'آمن ✅';
    text = String(text).replace(/\n/g, ' ').trim().substring(0, 40);
    const isSafe = !text.includes('خطر') && !text.includes('⚠️');
    return { verdict: text, isSafe };
  } catch {
    return { verdict: 'لم يفحص ⚠️', isSafe: false };
  }
}

function executeReplacement(matchedFiles, oldText, newText) {
  let count = 0;
  for (const fileData of matchedFiles) {
    let content = readFileSync(fileData.filePath, 'utf8');
    const regex = new RegExp(escapeRegExp(oldText), 'g');
    const updatedContent = content.replace(regex, newText);
    writeFileSync(fileData.filePath, updatedContent, 'utf8');
    count++;
  }
  return count;
}

let handler = async (m, { conn, isOwner, command, text }) => {
  if (!isOwner) return m.reply('❌ هذا الأمر للمطور شانكس فقط!');

  const cmd = command.toLowerCase().replace(/^\./, '');

  if (cmd === 'تأكيد_الاستبدال' || cmd === 'تاكيد_الاستبدال') {
    const pending = global.pendingReplacements[m.sender];
    if (!pending) return m.reply('❌ لا توجد عملية استبدال معلقة حالياً!');
    const changedCount = executeReplacement(pending.matchedFiles, pending.oldText, pending.newText);
    delete global.pendingReplacements[m.sender];
    return m.reply(`✅ *تم الاستبدال الشامل بنجاح يا مطوري شانكس!* ❄️\n\n⚙️ تم التغيير في عدد ( *${changedCount}* ) ملف.`);
  }

  if (cmd === 'تبديل_الامن' || cmd === 'تبديل_الأمن') {
    const pending = global.pendingReplacements[m.sender];
    if (!pending) return m.reply('❌ لا توجد عملية استبدال معلقة حالياً!');
    const safeFiles = pending.matchedFiles.filter(f => f.isSafe);
    if (safeFiles.length === 0) {
      delete global.pendingReplacements[m.sender];
      return m.reply('⚠️ لم يتم العثور على أي ملفات آمنة.');
    }
    const changedCount = executeReplacement(safeFiles, pending.oldText, pending.newText);
    delete global.pendingReplacements[m.sender];
    return m.reply(`🛡️ *تم التبديل الآمن بنجاح يا مطوري شانكس!* ❄️\n\n⚙️ تم التغيير في ( *${changedCount}* ) ملف آمن.`);
  }

  if (cmd === 'إلغاء_الاستبدال' || cmd === 'الغاء_الاستبدال') {
    if (global.pendingReplacements[m.sender]) {
      delete global.pendingReplacements[m.sender];
      return m.reply('❌ تم إلغاء العملية.');
    }
    return m.reply('⚠️ لا توجد عملية معلقة.');
  }

  if (!text || !text.includes('|')) return m.reply('⚠️ *الاستخدام:* `.تبديل الكلمةالقديمة|الكلمةالجديدة`');

  let [oldText, newText] = text.split('|').map(str => str.trim());
  if (!oldText || !newText || oldText.length < 3) return m.reply('❌ تأكد من صحة المدخلات.');

  await m.reply(`⏳ جاري فحص الملفات...`);
  const matchedFiles = walkAndFind(TARGET_DIR, oldText, []);
  if (matchedFiles.length === 0) return m.reply(`⚠️ لم يتم العثور على: *${oldText}*`);

  let report = `🔎 *نتائج الفحص ( 𝑺𝑯𝑨𝑵𝑲𝑺 ):*\n\n🔍 *القديم:* ${oldText}\n✨ *الجديد:* ${newText}\n\n📁 *الملفات المكتشفة:* \n`;
  let processedFiles = [];
  for (let idx = 0; idx < matchedFiles.length; idx++) {
    const fileData = matchedFiles[idx];
    const relPath = path.relative(TARGET_DIR, fileData.filePath);
    const aiResult = await checkFileSafetyWithAI(relPath, fileData.matchedLines.slice(0, 3));
    processedFiles.push({ ...fileData, isSafe: aiResult.isSafe });
    report += `├ ${idx + 1}. \`${relPath}\` ↜ *${aiResult.verdict}*\n`;
  }

  global.pendingReplacements[m.sender] = { matchedFiles: processedFiles, oldText, newText };

  try {
    const buttons = [
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛡️ تبديل الآمن", id: ".تبديل_الامن" }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "✅ تأكيد الكل", id: ".تأكيد_الاستبدال" }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "❌ إلغاء", id: ".إلغاء_الاستبدال" }) }
    ];

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: report }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "𝙎𝙃𝘼𝙉𝙆𝙎 ⚡" }),
              header: proto.Message.InteractiveMessage.Header.create({ title: "⚡ نظام التبديل", hasMediaAttachment: false }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
            })
          }
        }
      },
      { userJid: conn.user.jid, quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (e) {
    await m.reply(String(e.stack || e));
  }
};

handler.help = ['تبديل'];
handler.tags = ['owner'];
handler.command = /^(تبديل|تغيير|\.?تأكيد_الاستبدال|\.?تاكيد_الاستبدال|\.?تبديل_الامن|\.?تبديل_الأمن|\.?إلغاء_الاستبدال|\.?الغاء_الاستبدال)$/i;
handler.owner = true;

export default handler;