/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: بيجيب رابط القناه و الجروبات و يجيب رابط القناه من ال lid حقها بي ازرار و فيديو gif 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

const HEADER_GIF_URL = 'https://files.catbox.moe/o32a65.mp4'
let cachedHeaderMedia = null

async function getHeaderMedia(conn) {
    if (cachedHeaderMedia) return cachedHeaderMedia
    const media = await prepareWAMessageMedia(
        { video: { url: HEADER_GIF_URL }, gifPlayback: true },
        { upload: conn.waUploadToServer }
    )
    cachedHeaderMedia = media
    return media
}

async function sendLinkButtons(conn, m, link, title) {
    const buttons = [
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '📋 نسخ الرابط',
                id: 'copy_link',
                copy_code: link
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '➡️ الدخول',
                url: link,
                merchant_url: link
            })
        }
    ]

    let headerMedia = {}
    try {
        headerMedia = await getHeaderMedia(conn)
    } catch (e) {
        console.error('[LINK-GIF-ERROR]', e)
    }

    const header = Object.keys(headerMedia).length
        ? proto.Message.InteractiveMessage.Header.create({
              ...headerMedia,
              hasMediaAttachment: true
          })
        : proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false })

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `🔗 *${title}*\n\n${link}`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: '⚡ 𝚂𝙷𝙰𝙽𝙺𝚂 𝙱𝙾𝚃 𝚂𝚈𝚂𝚃𝙴𝙼'
                    }),
                    header,
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons
                    })
                })
            }
        }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

async function resolveChannelLink(conn, raw) {
    const linkMatch = raw.match(/whatsapp\.com\/channel\/([0-9A-Za-z]+)/i)
    if (linkMatch) return `https://whatsapp.com/channel/${linkMatch[1]}`

    let jid = raw
    const digits = raw.replace(/[^0-9]/g, '')
    if (digits) jid = `${digits}@newsletter`

    if (!jid.endsWith('@newsletter')) return null

    const metadata = await conn.newsletterMetadata('jid', jid)
    const inviteCode = metadata?.invite || metadata?.inviteCode || metadata?.thread_metadata?.invite
    if (!inviteCode) return null

    return `https://whatsapp.com/channel/${inviteCode}`
}

let handler = async (m, { conn, args, isGroup }) => {
    const target = (args?.[0] || '').trim()

    if (target) {
        try {
            const link = await resolveChannelLink(conn, target)
            if (!link) return m.reply('⚠️ *مش قادر أجيب رابط القناة.*\nتأكد إنك بعت LID أو رقم القناة صحيح.')
            return sendLinkButtons(conn, m, link, 'رابط القناة')
        } catch (e) {
            console.error('[LINK-CHANNEL-ERROR]', e)
            return m.reply('⚠️ *حصل خطأ وأنا بجيب رابط القناة.*')
        }
    }

    if (m.chat.endsWith('@newsletter')) {
        try {
            const link = await resolveChannelLink(conn, m.chat)
            if (!link) return m.reply('⚠️ *مش قادر أجيب رابط القناة دي.*')
            return sendLinkButtons(conn, m, link, 'رابط القناة')
        } catch (e) {
            console.error('[LINK-CHANNEL-ERROR]', e)
            return m.reply('⚠️ *حصل خطأ وأنا بجيب رابط القناة.*')
        }
    }

    const chatIsGroup = isGroup ?? m.chat?.endsWith('@g.us')
    if (!chatIsGroup) return m.reply('❌ *هذا الأمر يعمل داخل المجموعات أو القنوات فقط!*')

    try {
        const code = await conn.groupInviteCode(m.chat)
        const link = `https://chat.whatsapp.com/${code}`
        return sendLinkButtons(conn, m, link, 'رابط الجروب')
    } catch (e) {
        console.error('[LINK-GROUP-ERROR]', e)
        return m.reply('⚠️ *مش قادر أجيب رابط الجروب.*\nتأكد إني أدمن في الجروب.')
    }
}

handler.command = /^(لنك|link)$/i
handler.tags = ['group']

export default handler