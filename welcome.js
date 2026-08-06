// plugins/welcome.js
// 𝙎𝙃𝘼𝙉𝙆𝙎 - الترحيب والمغادرة 👋

import fetch from 'node-fetch';

const defaultImage = 'https://files.catbox.moe/f92wmw.jpg'

const handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('🔒 هذا الأمر مخصص للجروبات فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (type !== 'welcome') {
    return m.reply(`╭━━ 🌟 *أمـر الـتـرحـيـب* ━━⃝💙
│
│ 🔹 *.on welcome* / *.off welcome*
│
╰━━━━━━━━━━━━━⃝💙`)
  }

  if (!(isAdmin || isOwner)) return m.reply('❌ هذا الأمر للمشرفين فقط.')

  chat.welcome = enable
  return m.reply(`✅ *الترحيب* ${enable ? 'تم التفعيل' : 'تم التعطيل'} بنجاح.`)
}

handler.command = ['on', 'off']
handler.group = true
handler.register = true

handler.before = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  // ========== WELCOME / BYE ==========
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    const groupDescription = groupMetadata.desc || "لا يوجد وصف متاح";
    let profilePic

    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      profilePic = defaultImage
    }

    // ========== صورة الترحيب ==========
    const welcomeImage = 'https://file.garden/aauvg01sjleV_ic1/6942e8a534efddc7cc5a56d5671e78e7%20(1).jpg'
    
    // ========== صورة المغادرة ==========
    const goodbyeImage = 'https://file.garden/aauvg01sjleV_ic1/f9fb15020c2d83e2946d37df1605c782.jpg'
    
    // ========== رابط الصوت ==========
    const audioUrl = 'https://file.garden/aauvg01sjleV_ic1/%D8%AA%D8%B1%D8%AD%D9%8A%D8%A8.opus'

    // ========== ترحيب ==========
    if (m.messageStubType === 27) {
      const txtwelcome = `╭━━ 👋 *تـرحـيـب* ━━⃝💙
│
│ ✨ *مـنـور الـمـجـمـوعـة* ✨
│
│ 👤 *العضو:* ${userMention}
│ 📍 *المجموعة:* ${groupMetadata.subject}
│ 👥 *الأعضاء:* ${groupSize}
│
│ 📝 *الوصف:*
│ ${groupDescription.substring(0, 100)}
│
╰━━━━━━━━━━━━━⃝💙`

      // إرسال الصورة
      await conn.sendMessage(m.chat, {
        image: { url: welcomeImage },
        caption: txtwelcome,
        contextInfo: { mentionedJid: [userId] }
      })

      // إرسال الصوت
      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      })
    }

    // ========== مغادرة ==========
    if (m.messageStubType === 28 || m.messageStubType === 32) {
      const txtBye = `╭━━ 😢 *وداعـاً* ━━⃝💙
│
│ 👤 *العضو:* ${userMention}
│ 📍 *المجموعة:* ${groupMetadata.subject}
│ 👥 *الأعضاء:* ${groupSize}
│
│ 💔 *نتمنى رؤيتك مرة أخرى*
│
╰━━━━━━━━━━━━━⃝💙`

      await conn.sendMessage(m.chat, {
        image: { url: goodbyeImage },
        caption: txtBye,
        contextInfo: { mentionedJid: [userId] }
      })
    }
  }
}

export default handler