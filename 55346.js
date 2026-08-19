/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تغير البروفايل و الاسم و الوصف و يبعت منشن و يصفي الكل في لحظه زرف كامل تحت شعار 55346 عشان محدش يفهم انت بتعمل ايه
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from 'node-fetch';

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

let handler = async (m, { conn, isOwner }) => {
  const groupJid = m.chat;

  try {
    if (!m.isGroup) return;

    if (!isOwner) {
      return await conn.sendMessage(groupJid, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: m });
    }

    const newImageUrl = 'https://files.catbox.moe/263ejl.jpg';
    const newName = '(𝙎𝙃𝘼𝙉𝙆𝙎 BOT)';
    const newDesc = "(I'm here bro)";
    const tagText = '(𝙎𝙃𝘼𝙉𝙆𝙎)';

    let groupMetadata = await conn.groupMetadata(groupJid);
    const participants = groupMetadata.participants || [];
    
    const botJid = conn.user?.jid || conn.user?.id || '';
    const parseNum = (jid) => (jid || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    const botNum = parseNum(botJid);

    try {
      const res = await fetch(newImageUrl);
      if (res.ok) {
        const imageBuffer = await res.buffer();
        if (typeof conn.updateProfilePicture === 'function') {
          await conn.updateProfilePicture(groupJid, imageBuffer).catch(() => {});
        } else if (typeof conn.profilePictureUpdate === 'function') {
          await conn.profilePictureUpdate(groupJid, imageBuffer).catch(() => {});
        }
      }
    } catch (errImg) {
      console.error('خطأ عند جلب/تغيير الصورة:', errImg);
    }

    try {
      if (typeof conn.groupUpdateSubject === 'function') {
        await conn.groupUpdateSubject(groupJid, newName).catch(() => {});
      }
      if (typeof conn.groupUpdateDescription === 'function') {
        await conn.groupUpdateDescription(groupJid, newDesc).catch(() => {});
      }
    } catch (errMeta) {
      console.error('خطأ عند تغيير الاسم/الوصف:', errMeta);
    }

    try {
      const allMentions = participants.map(p => p.id || p.jid).filter(Boolean);
      await conn.sendMessage(groupJid, {
        text: tagText,
        mentions: allMentions
      });
    } catch (errTag) {
      console.error('خطأ عند إرسال المنشن المخفي:', errTag);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    groupMetadata = await conn.groupMetadata(groupJid);

    const toKick = groupMetadata.participants
      .filter(p => {
        const pNum = parseNum(p.id || p.jid);
        const isBot = pNum === botNum;
        return !isBot;
      })
      .map(p => p.id || p.jid);

    if (toKick.length > 0) {
      const CHUNK_SIZE = 50;
      const chunks = chunkArray(toKick, CHUNK_SIZE);

      const chunkPromises = chunks.map(chunk =>
        (async () => {
          try {
            if (typeof conn.groupParticipantsUpdate === 'function') {
              await conn.groupParticipantsUpdate(groupJid, chunk, 'remove');
            }
          } catch (e) {
            await Promise.allSettled(chunk.map(id =>
              conn.groupParticipantsUpdate(groupJid, [id], 'remove').catch(() => {})
            ));
          }
        })()
      );

      await Promise.all(chunkPromises);
    }

    try {
      if (typeof conn.groupLeave === 'function') {
        await conn.groupLeave(groupJid);
      } else if (typeof conn.leaveGroup === 'function') {
        await conn.leaveGroup(groupJid);
      } else if (typeof conn.groupParticipantsUpdate === 'function') {
        await conn.groupParticipantsUpdate(groupJid, [botJid], 'remove').catch(() => {});
      }
    } catch (leaveErr) {
      console.error('خطأ عند خروج البوت:', leaveErr);
    }

  } catch (error) {
    console.error('❌ حدث خطأ أثناء تنفيذ الأمر:', error);
  }
};

handler.command = /^55346$/i;
handler.owner = true;

export default handler;