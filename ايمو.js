/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
الوظيفه: تحويل الايموجي لي ملصق متحرك
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from 'node-fetch'

function emojiToUnicode(emoji) {
    if (!emoji) return null
    return Array.from(emoji)
        .map(char => char.codePointAt(0).toString(16))
        .filter(hex => hex !== 'fe0f')
        .join('_')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
    }

    if (!text) {
        await react("⚠️")
        return m.reply(
            `*───  𝑺𝑯𝑨𝑵𝑲𝑺  ───*\n\n` +
            `📌 *الاستخدام:* ${usedPrefix}${command} <الإيموجي>\n` +
            `💡 *مثال:* ${usedPrefix}${command} 😳`
        )
    }

    const emoji = text.trim().split(' ')[0]
    await react("⏳")

    try {
        const unicode = emojiToUnicode(emoji)

        if (!unicode) {
            await react("❌")
            return m.reply('❌ *يرجى إرسال إيموجي صحيح.*')
        }

        const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${unicode}/512.webp`
        const res = await fetch(url)

        if (!res.ok) {
            await react("❌")
            return m.reply('❌ *فشل جلب الإيموجي من السيرفر، جرب إيموجي آخر.*')
        }

        const buffer = Buffer.from(await res.arrayBuffer())

        if (typeof conn.sendFile === 'function') {
            await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, true, {
                packname: global.packname || '𝑺𝑯𝑨𝑵𝑲𝑺',
                author: global.author || '𝚂𝙷𝙰𝙽𝙺𝚂-𝙱𝙾𝚃'
            })
        } else {
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        }

        await react("✅")

    } catch (error) {
        await react("❌")
        return m.reply(`❌ *خطأ:* ${error.message}`)
    }
}

handler.help = ['ايموجي <ايموجي>']
handler.tags = ['sticker', 'tools']
handler.command = /^(ايموجي|ايمو|emoji)$/i

export default handler