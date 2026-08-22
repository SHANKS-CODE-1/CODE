/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: اظهار فيديوهات و الميديا المره واحده
╰━━━━━━━━━━━━━━━━━━╯
*/

import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {

  if (!m.quoted) {
    return conn.sendMessage(m.chat, { 
      text: '*───  𝑺𝑯𝑨𝑵𝑲𝑺  ───*\n\n📌 *يرجى الرد (الريبلاي) على صورة أو فيديو ViewOnce!*' 
    }, { quoted: m });
  }


  const quotedMsg = m.quoted.message || m.quoted.mediaMessage;
  if (!quotedMsg) {
    return conn.sendMessage(m.chat, { 
      text: '❌ *الرسالة المقتبسة لا تحتوي على ميديا!*' 
    }, { quoted: m });
  }

 
  const viewOnceMsg = quotedMsg.viewOnceMessage?.message || 
                      quotedMsg.viewOnceMessageV2?.message || 
                      quotedMsg.viewOnceMessageV2Extension?.message || 
                      quotedMsg;

  const imageMsg = viewOnceMsg.imageMessage;
  const videoMsg = viewOnceMsg.videoMessage;

  if (!imageMsg && !videoMsg) {
    return conn.sendMessage(m.chat, { 
      text: '❌ *هذه الرسالة ليست صورة أو فيديو ViewOnce!*' 
    }, { quoted: m });
  }

  
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const isImage = !!imageMsg;
    const mediaMsg = isImage ? imageMsg : videoMsg;
    const mediaType = isImage ? 'image' : 'video';


    const stream = await downloadContentFromMessage(mediaMsg, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const captionText = `*───  𝑺𝑯𝑨𝑵𝑲𝑺  ───*\n\n🔓 *تم إظهار الـ ViewOnce بنجاح!*`;

 
    if (isImage) {
      await conn.sendMessage(m.chat, {
        image: buffer,
        caption: captionText
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: buffer,
        caption: captionText,
        mimetype: 'video/mp4'
      }, { quoted: m });
    }

    
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error in ViewOnce handler:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, { 
      text: '❌ *فشل استخراج الميديا، قد تكون منتهية الصلاحية أو ممسوحة!*' 
    }, { quoted: m });
  }
};


handler.help = ['ع'];
handler.tags = ['tools'];
handler.command = ['ع', 'vv', 'viewonce', 'اظهار'];

export default handler;