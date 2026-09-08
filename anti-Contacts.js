/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لما تشغله و ترفعه ادمن اي جهات اتصال هتتبعت هتتحذف وقتي و يقفل الجروب و يدي انذار لي الادمن و يقفل الجروب
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs'
import path from 'path'

class AntiContactGuard {
   constructor() {
      this.dbPath = path.join(process.cwd(), 'porn.json')
      this.initDatabase()
   }

   initDatabase() {
      if (!fs.existsSync(this.dbPath)) {
         const initial = { antiContact: {} }
         fs.writeFileSync(this.dbPath, JSON.stringify(initial, null, 2), 'utf-8')
      }
   }

   getDb() {
      try {
         const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'))
         if (!data.antiContact) data.antiContact = {}
         return data
      } catch {
         return { antiContact: {} }
      }
   }

   saveDb(data) {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8')
   }

   
   extractContactCard(m) {
      const rawMessage =
         m.message?.ephemeralMessage?.message ||
         m.message?.viewOnceMessage?.message ||
         m.message

      return (
         rawMessage?.contactMessage ||
         rawMessage?.contactsArrayMessage ||
         rawMessage?.messageContextInfo?.quotedMessage?.contactMessage ||
         rawMessage?.messageContextInfo?.quotedMessage?.contactsArrayMessage ||
         m.mtype === 'contactMessage' ||
         m.mtype === 'contactsArrayMessage'
      )
   }

   
   async processEvent(m, conn) {
      if (!m.isGroup) return

      const db = this.getDb()
      if (!db.antiContact[m.chat]) return 

      const isContactCard = this.extractContactCard(m)
      if (!isContactCard) return

      console.log(`[AntiContact Guard] 🚨 تم اكتشاف كارت جهة اتصال في الجروب: ${m.chat}`)

      try {
         const groupMetadata = await conn.groupMetadata(m.chat)
         const admins = groupMetadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id)

         
         await conn.sendMessage(m.chat, { delete: m.key })

         
         if (admins.length > 0) {
            let caption = 'تم حذف كارت جهة اتصال تلقائياً الكلب يبي يحظر الجروب. تم قفل الجروب'
            let mentionText = admins.map(v => `@${v.split('@')[0]}`).join(' ')

            await conn.sendMessage(m.chat, {
               text: `${mentionText}\n\n${caption}`,
               mentions: admins
            })
         }

         
         await conn.groupSettingUpdate(m.chat, 'announcement')
         console.log('[AntiContact Guard] 🔒 تم قفل الجروب بنجاح.')

      } catch (e) {
         console.error('⚠️ [AntiContact Error]:', e.message)
      }
   }
}

const guard = new AntiContactGuard()


let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
   if (!m.isGroup) return m.reply('❌ هذا الأمر يشتغل في المجموعات فقط.')
   if (!isAdmin && !isOwner) return m.reply('❌ هذا الأمر مخصص للأدمن فقط.')

   const db = guard.getDb()
   const state = (args[0] || '').toLowerCase().trim()

   if (['on', 'تشغيل', 'تفعيل'].includes(state)) {
      db.antiContact[m.chat] = true
      guard.saveDb(db)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return m.reply('✅ تم تفعيل حماية جهات الاتصال وقفل الجروب التلقائي.\n\n> 𝙎𝙃𝘼𝙉𝙆𝙎 ❄️')
   }

   if (['off', 'إيقاف', 'ايقاف', 'تعطيل'].includes(state)) {
      db.antiContact[m.chat] = false
      guard.saveDb(db)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return m.reply('🚫 تم إيقاف حماية جهات الاتصال في هذه المجموعة.\n\n> 𝙎𝙃𝘼𝙉𝙆𝙎 ❄️')
   }

   const status = db.antiContact[m.chat] ? 'مفعل ✅' : 'معطل ❌'
   return m.reply(
      `🛡️ *نظام حماية الجروب من كروت الحظر*\n\n` +
      `📊 *الحالة الحالية:* ${status}\n\n` +
      `⚙️ *طريقة الاستخدام:*\n` +
      `▸ *${usedPrefix + command} on* — لتشغيل النظام\n` +
      `▸ *${usedPrefix + command} off* — لإيقاف النظام\n\n` +
      `> 𝙎𝙃𝘼𝙉𝙆𝙎 ❄️`
   )
}


handler.before = async function (m, { conn }) {
   await guard.processEvent(m, conn)
}

handler.command = /^(مضاد_الجهات|مضاد_جهات|anticontact|anti-contact)$/i

export default handler