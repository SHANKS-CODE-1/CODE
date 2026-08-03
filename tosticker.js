/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تحويل الصور و الفيديوهات لي ملصقات و العكس
╰━━━━━━━━━━━━━━━━━━╯
*/

import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) {
        return m.reply(`⚡ *طريقة الاستخدام:*\n\n1️⃣ **تحويل صورة/فيديو لملصق:** رد على صورة أو فيديو بالأمر \`${usedPrefix + command}\`\n2️⃣ **تحويل ملصق لصورة/فيديو:** رد على أي ملصق بنفس الأمر.`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        let media = await q.download()
        if (!media) throw new Error('فشل تحميل الملف')

        if (/webp/.test(mime)) {
            let isAnimated = q.isAnimated || (q.msg && q.msg.isAnimated)

            if (isAnimated) {
                await conn.sendMessage(m.chat, { 
                    video: media, 
                    caption: '✨ تم تحويل الملصق المتحرك إلى فيديو بنجاح' 
                }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, { 
                    image: media, 
                    caption: '✨ تم تحويل الملصق إلى صورة بنجاح' 
                }, { quoted: m })
            }
            return await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        }

        if (/image\/(jpe?g|png)|video\/mp4/.test(mime)) {
            let packname = '𝙎𝙃𝘼𝙉𝙆𝙎'
            let author = '𝙎𝙃𝘼𝙉𝙆𝙎'

            let stiker = await sticker(media, false, packname, author)

            if (!stiker && /video\/mp4/.test(mime)) {
                stiker = await sticker(media, true, packname, author)
            }

            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            } else {
                throw new Error('فشل إنشاء الملصق')
            }
            return
        }

        return m.reply('❌ نوع الملف غير مدعوم! يرجى الرد على صورة، فيديو، أو ملصق.')

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await m.reply('❌ حدث خطأ أثناء المعالجة، تأكد من صحة الملف وحاول مجدداً.')
    }
}

handler.help = ['ستكر', 'صورة', 'فيديو']
handler.tags = ['tools']
handler.command = /^(ستكر|ملصق|sticker|s|لصوره|لفيديو|لصورة|tomp4)$/i

export default handler