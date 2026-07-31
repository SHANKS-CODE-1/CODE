/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: ضرب بلاغات علي صوره بروفايل 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    if (!isOwner) return m.reply('❌ هذا الأمر مخصص للمطور فقط!')

    if (!text) return m.reply(`💡 *طريقة الاستخدام:*\n${usedPrefix}${command} 201009999000`)

    let number = text.replace(/[^0-9]/g, '')
    if (!number) return m.reply('❌ يرجى كتابة رقم الهاتف بصيغة صحيحة بدون رموز!')

    let jid = `${number}@s.whatsapp.net`

    try {
        await m.react('⏳')

        let [onWa] = await conn.onWhatsApp(jid)
        if (!onWa || !onWa.exists) {
            await m.react('❌')
            return m.reply('❌ هذا الرقم غير مسجل على الواتساب!')
        }

        let targetLid = onWa.lid || null

        if (!targetLid) {
            let userStats = await conn.fetchStatus(onWa.jid).catch(() => null)
            targetLid = onWa.jid
        }

        let reportQuery = {
            tag: 'iq',
            attrs: {
                id: conn.generateMessageTag(),
                type: 'set',
                to: '@s.whatsapp.net',
                xmlns: 'spam'
            },
            content: [
                {
                    tag: 'spam_list',
                    attrs: {
                        jid: targetLid,
                        spam_flow: 'account_info_report'
                    }
                }
            ]
        }

        await conn.query(reportQuery)

        await m.react('🚀')
        return m.reply(`✅ *تم إرسال بلاغ عن البروفايل بنجاح!*\n\n📱 *الرقم:* ${number}\n🆔 *LID:* ${targetLid}`)

    } catch (e) {
        console.error(e)
        await m.react('❌')
        return m.reply(`❌ حدث خطأ أثناء إرسال البلاغ:\n${e.message || e}`)
    }
}

handler.help = ['بلاغ-برو']
handler.tags = ['owner']
handler.command = /^(بلاغ-برو|بلاغ_برو|reportpro)$/i
handler.owner = true

export default handler