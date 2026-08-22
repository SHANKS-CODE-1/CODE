/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: يعمل منشن للكل مخفي لي الادمن و المتصلين و الكل و الكل ما عادا الادمن
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const pendingTags = new Map()
const groupAdminCache = new Map()
const presenceCache = new Map()
const activityCache = new Map()
const subscribedConns = new WeakSet()
const CACHE_TTL_MS = 5 * 60 * 1000
const ONLINE_PRESENCE_WINDOW_MS = 60 * 1000
const ONLINE_ACTIVITY_WINDOW_MS = 15 * 60 * 1000
const PRESENCE_WAIT_MS = 2500

function addAllVariants(set, id) {
    if (!id) return
    set.add(id)
    const bare = id.split('@')[0]
    if (bare) set.add(bare)
}

function hasAnyVariant(set, id) {
    if (!id) return false
    if (set.has(id)) return true
    const bare = id.split('@')[0]
    return bare ? set.has(bare) : false
}

function getStoreActivity(conn, chatId) {
    const messages = conn.chats?.[chatId]?.messages || {}
    const result = new Map()

    for (const item of Object.values(messages)) {
        const participant = item?.key?.participant
        if (!participant) continue

        let timestamp = 0
        const rawTs = item.messageTimestamp
        if (typeof rawTs === 'number') {
            timestamp = rawTs * 1000
        } else if (rawTs && typeof rawTs.toNumber === 'function') {
            timestamp = rawTs.toNumber() * 1000
        } else if (rawTs && typeof rawTs.low === 'number') {
            timestamp = rawTs.low * 1000
        }

        const existing = result.get(participant) || 0
        if (timestamp >= existing) result.set(participant, timestamp)
    }

    return result
}

function recordActivity(m) {
    if (!m.isGroup || !m.chat) return
    let chatActivity = activityCache.get(m.chat)
    if (!chatActivity) {
        chatActivity = new Map()
        activityCache.set(m.chat, chatActivity)
    }
    const now = Date.now()
    const senderCandidates = [m.key?.participant, m.sender].filter(Boolean)
    senderCandidates.forEach(id => chatActivity.set(id, now))
}

function attachPresenceListener(conn) {
    if (subscribedConns.has(conn)) return
    subscribedConns.add(conn)

    conn.ev.on('presence.update', ({ id, presences }) => {
        if (!id || !presences) return
        let chatCache = presenceCache.get(id)
        if (!chatCache) {
            chatCache = new Map()
            presenceCache.set(id, chatCache)
        }
        for (const [participantId, info] of Object.entries(presences)) {
            chatCache.set(participantId, {
                status: info?.lastKnownPresence,
                timestamp: Date.now()
            })
        }
    })
}

async function getGroupAdmins(conn, chatId, forceRefresh = false) {
    const cached = groupAdminCache.get(chatId)
    if (!forceRefresh && cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
        return cached
    }

    const metadata = await conn.groupMetadata(chatId)
    const participants = metadata.participants || []
    const admins = new Set()

    for (const p of participants) {
        if (!p.admin) continue
        addAllVariants(admins, p.id)
        addAllVariants(admins, p.lid)
        addAllVariants(admins, p.jid)
    }

    const data = { timestamp: Date.now(), admins, participants }
    groupAdminCache.set(chatId, data)
    return data
}

function isSenderAdmin(m, adminData) {
    const candidates = [
        m.key?.participant,
        m.key?.participantAlt,
        m.key?.participantPn,
        m.participant,
        m.sender
    ].filter(Boolean)

    return candidates.some(c => hasAnyVariant(adminData.admins, c))
}

let handler = async (m, { conn, text, usedPrefix, command, isGroup }) => {
    const chatIsGroup = isGroup ?? m.chat?.endsWith('@g.us')
    if (!chatIsGroup) return m.reply('❌ *هذا الأمر يعمل داخل المجموعات فقط!*')
    if (!text) return m.reply(`📌 *يرجى كتابة النص المراد إرساله مع المنشن!*\nمثال:\n• ${usedPrefix + command} اجتماع هام يا شباب`)

    const tagText = text.trim()
    pendingTags.set(m.chat, tagText)

    const buttons = [
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: '📢 منشن للكل',
                id: '.exec_tag_all'
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: '👑 منشن الأدمن',
                id: '.exec_tag_admins'
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: '🟢 منشن المتصلين',
                id: '.exec_tag_online'
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: '👥 منشن الاعضاء (غير الادمن)',
                id: '.exec_tag_members'
            })
        }
    ]

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `💬 *النص المحدد:* "${tagText}"\n\n👇 *اختر نوع المنشن المطلوب للارسال:*`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: '⚡ 𝚂𝙷𝙰𝙽𝙺𝚂 𝙱𝙾𝚃 𝚂𝚈𝚂𝚃𝙴𝙼'
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: buttons
                    })
                })
            }
        }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.all = async function (m) {
    recordActivity(m)

    if (!m.isGroup || !m.text) return

    const cmd = m.text.trim()
    if (!['.exec_tag_all', '.exec_tag_admins', '.exec_tag_online', '.exec_tag_members'].includes(cmd)) return

    attachPresenceListener(this)

    let groupMetadata
    try {
        groupMetadata = await this.groupMetadata(m.chat)
    } catch {
        return
    }

    const participants = groupMetadata.participants || []

    let adminData = await getGroupAdmins(this, m.chat)
    let clickerIsAdmin = isSenderAdmin(m, adminData)

    if (!clickerIsAdmin) {
        adminData = await getGroupAdmins(this, m.chat, true)
        clickerIsAdmin = isSenderAdmin(m, adminData)
    }

    if (!clickerIsAdmin) {
        return this.sendMessage(m.chat, {
            text: '❌ *هذا الخيار متاح فقط لمشرفي المجموعة.*'
        }, { quoted: m })
    }

    const storedText = pendingTags.get(m.chat) || 'تنبيه من إدارة المجموعة ⚡'
    const freshParticipants = adminData.participants || participants
    let targetMentions = []

    if (cmd === '.exec_tag_all') {
        targetMentions = freshParticipants.map(p => p.id)
    } else if (cmd === '.exec_tag_admins') {
        targetMentions = freshParticipants.filter(p => p.admin).map(p => p.id)
    } else if (cmd === '.exec_tag_online') {
        try {
            await this.presenceSubscribe(m.chat)
        } catch {}

        await new Promise(resolve => setTimeout(resolve, PRESENCE_WAIT_MS))

        const now = Date.now()
        const onlineIds = new Set()

        const chatActivity = activityCache.get(m.chat) || new Map()
        for (const [id, timestamp] of chatActivity.entries()) {
            if ((now - timestamp) < ONLINE_ACTIVITY_WINDOW_MS) addAllVariants(onlineIds, id)
        }

        const storeActivity = getStoreActivity(this, m.chat)
        for (const id of storeActivity.keys()) {
            addAllVariants(onlineIds, id)
        }

        const chatPresence = presenceCache.get(m.chat) || new Map()
        for (const [id, info] of chatPresence.entries()) {
            const isActiveStatus = ['available', 'composing', 'recording'].includes(info.status)
            const isFresh = (now - info.timestamp) < ONLINE_PRESENCE_WINDOW_MS
            if (isActiveStatus && isFresh) addAllVariants(onlineIds, id)
        }

        const senderCandidates = [m.key?.participant, m.sender].filter(Boolean)
        senderCandidates.forEach(c => addAllVariants(onlineIds, c))

        targetMentions = freshParticipants
            .filter(p => hasAnyVariant(onlineIds, p.id) || hasAnyVariant(onlineIds, p.lid))
            .map(p => p.id)

        if (!targetMentions.length) {
            pendingTags.delete(m.chat)
            return this.sendMessage(m.chat, {
                text: '⚠️ *لا تتوفر بيانات نشاط كافية بعد لمعرفة المتصلين، حاول تاني بعد شوية من نشاط الأعضاء في الجروب.*'
            }, { quoted: m })
        }

        pendingTags.delete(m.chat)

        const listText = targetMentions
            .map(id => `*●* @${id.split('@')[0]}`)
            .join('\n')

        const pp = await this.profilePictureUrl(m.chat, 'image')
            .catch(() => 'https://files.catbox.moe/4yvat4.jpg')

        try {
            await this.sendMessage(m.chat, { delete: m.key })
        } catch {}

        await this.sendMessage(m.chat, {
            image: { url: pp },
            caption: `*♲︎ قائمة المستخدمين المتصلين:*\n\n${listText}\n\n> © 𝙨𝙝𝙖𝙣𝙠𝙨`,
            contextInfo: { mentionedJid: targetMentions }
        }, { quoted: m })

        return
    } else if (cmd === '.exec_tag_members') {
        targetMentions = freshParticipants.filter(p => !p.admin).map(p => p.id)
    }

    pendingTags.delete(m.chat)

    if (targetMentions.length === 0) return

    try {
        await this.sendMessage(m.chat, { delete: m.key })
    } catch {}

    await this.sendMessage(m.chat, {
        text: storedText,
        contextInfo: { mentionedJid: targetMentions }
    })
}

handler.command = /^(مخفي|tag|nots)$/i
handler.tags = ['group']
handler.admin = true
handler.group = true

export default handler