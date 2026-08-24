/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: رفع الملفات و الصور و الفيديوهات علي كات بوكس
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from "node-fetch";
import FormData from "form-data";
import { generateWAMessageFromContent, prepareWAMessageMedia } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime) {
      await m.react('⚡');
      return conn.reply(m.chat, "⚠️ رد على صورة / فيديو / ملف  Catbox", m);
    }

    await m.react('⏳');

    let media = await q.download();
    if (!media || !Buffer.isBuffer(media)) throw "فشل تحميل الميديا من واتساب";

    let link = await shanksCatboxUpload(media, mime);

    let caption = `👑 *𝐒𝐇𝐀𝐍𝐊𝐒 𝐂𝐀𝐓𝐁𝐎𝐗 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑* 👑\n\n` +
                  `🔗 *الرابط:* ${link}\n` +
                  `📦 *الحجم:* ${formatBytes(media.length)}\n` +
                  `☁️ *السيرفر:*  Catbox Cloud`;

    let mediaMsg = {};
    if (/image/.test(mime)) mediaMsg = { image: media };
    else if (/video/.test(mime)) mediaMsg = { video: media };
    else mediaMsg = { image: { url: 'https://files.catbox.moe/7h727z.mp4' } };

    const preparedMedia = await prepareWAMessageMedia(mediaMsg, { upload: conn.waUploadToServer });

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "📤 تم الرفع بنجاح",
              hasMediaAttachment: true,
              ...(mediaMsg.image
                ? { imageMessage: preparedMedia.imageMessage }
                : { videoMessage: preparedMedia.videoMessage })
            },
            body: { text: caption },
            footer: { text: "𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏 🇵🇸‍🍷" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📎 نسخ الرابط",
                    copy_code: link,
                  }),
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🌐 فتح الرابط",
                    url: link,
                    merchant_url: link
                  }),
                }
              ],
            },
          },
        },
      },
    }, { userJid: conn.user.id, quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `❌ خطأ في سيرفر الرفع: ${e}`, m);
  }
};

handler.help = ['رابط'];
handler.tags = ['tools'];
handler.command = /^(رابط|ارفع)$/i;

export default handler;

async function shanksCatboxUpload(buffer, mime) {
  try {
    let ext = mime.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("userhash", "f1e9fd1e581b10979d1d8c1a0"); //  بدله بي يوزر هاش بتاعك
    form.append("fileToUpload", buffer, {
      filename: `shanks_${Date.now()}.${ext}`,
      contentType: mime
    });

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
      headers: {
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) throw `HTTP STATUS ${res.status}`;

    const link = await res.text();
    if (!link || !link.startsWith("http")) {
      throw `استجابة غير صالحة: ${link}`;
    }

    return link.trim();

  } catch (err) {
    console.error("CATBOX PRO UPLOAD ERROR:", err);
    throw "فشل الرفع، تأكد من اتصال السيرفر أو صلاحية الـ الرمز الخاص بك";
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}