/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: يكتم الاعضاء و يفك كتم الاعضاء بي الريبلاي و الرقم و بيعرض قائمه المكتومين و كذا
╰━━━━━━━━━━━━━━━━━━╯
*/

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

function isSenderGroupAdmin(m, isAdmin, participants) {
    if (isAdmin) return true
    const adminIdSet = new Set()
    ;(participants || []).forEach(p => {
        if (!p.admin) return
        addAllVariants(adminIdSet, p.id)
        addAllVariants(adminIdSet, p.lid)
        addAllVariants(adminIdSet, p.jid)
    })
    const senderCandidates = [
        m.key?.participant,
        m.key?.participantAlt,
        m.key?.participantPn,
        m.sender
    ].filter(Boolean)
    return senderCandidates.some(c => hasAnyVariant(adminIdSet, c))
}

function getTargetId(m, args) {
    if (m.quoted?.sender) return m.quoted.sender
    if (m.quoted?.participant) return m.quoted.participant
    const digits = (args?.[0] || '').replace(/[^0-9]/g, '')
    if (digits.length >= 8) return `${digits}@s.whatsapp.net`
    return null
}

const identityMapCache = new Map()
const IDENTITY_CACHE_TTL_MS = 5 * 60 * 1000

async function getIdentityMap(conn, chatId) {
    const cached = identityMapCache.get(chatId)
    if (cached && (Date.now() - cached.timestamp) < IDENTITY_CACHE_TTL_MS) return cached.map

    let participants = []
    try {
        const metadata = await conn.groupMetadata(chatId)
        participants = metadata.participants || []
    } catch {
        return cached?.map || new Map()
    }

    const map = new Map()
    for (const p of participants) {
        const variants = new Set()
        addAllVariants(variants, p.id)
        addAllVariants(variants, p.lid)
        addAllVariants(variants, p.jid)
        for (const v of variants) map.set(v, variants)
    }

    identityMapCache.set(chatId, { timestamp: Date.now(), map })
    return map
}

function expandVariants(id, identityMap) {
    const result = new Set()
    addAllVariants(result, id)
    if (!id) return result
    const bare = id.split('@')[0]
    const known = identityMap.get(id) || (bare && identityMap.get(bare))
    if (known) known.forEach(v => result.add(v))
    return result
}

function pickDisplayVariant(id, identityMap) {
    const variants = expandVariants(id, identityMap)
    const nice = [...variants].find(v => v.endsWith('@s.whatsapp.net'))
    return nice || id
}

async function deleteIfMuted(conn, chatId, key) {
    if (!key || key.fromMe) return
    const chat = global.db.data.chats[chatId]
    if (!chat || !Array.isArray(chat.mutedUsers) || chat.mutedUsers.length === 0) return

    const identityMap = await getIdentityMap(conn, chatId)
    const senderVariants = expandVariants(key.participant, identityMap)

    const isMuted = chat.mutedUsers.some(mutedId => {
        const mutedVariants = expandVariants(mutedId, identityMap)
        for (const v of senderVariants) {
            if (mutedVariants.has(v)) return true
        }
        return false
    })

    if (!isMuted) return

    try {
        await conn.sendMessage(chatId, {
            delete: { remoteJid: chatId, fromMe: false, id: key.id, participant: key.participant }
        })
    } catch (e) {
        console.error('[MUTE-DELETE-ERROR]', e)
    }
}

const subscribedConns = new WeakSet()

function attachMuteListener(conn) {
    if (!conn?.ev || subscribedConns.has(conn)) return
    subscribedConns.add(conn)

    conn.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages?.[0]
            if (!msg?.key?.remoteJid?.endsWith('@g.us')) return
            await deleteIfMuted(conn, msg.key.remoteJid, msg.key)
        } catch (e) {
            console.error('[MUTE-LISTENER-ERROR]', e)
        }
    })
}

const MUTE_COMMANDS = ['كتم', 'mute']
const UNMUTE_COMMANDS = ['رفع_كتم', 'الغاء_كتم', 'إلغاء_كتم', 'unmute']
const LIST_COMMANDS = ['المكتومين', 'مكتومين']

let handler = async (m, { conn, args, command, usedPrefix, isGroup, isAdmin, participants }) => {
    attachMuteListener(conn)

    const chatIsGroup = isGroup ?? m.chat?.endsWith('@g.us')
    if (!chatIsGroup) return m.reply('❌ *هذا الأمر يعمل داخل المجموعات فقط!*')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    if (!Array.isArray(chat.mutedUsers)) chat.mutedUsers = []

    const cmd = (command || '').toLowerCase()

    if (LIST_COMMANDS.includes(cmd)) {
        if (!chat.mutedUsers.length) return m.reply('❍ مفيش حد مكتوم دلوقتي في الجروب ده.')
        const identityMap = await getIdentityMap(conn, m.chat)
        const displayIds = chat.mutedUsers.map(id => pickDisplayVariant(id, identityMap))
        const listText = displayIds.map((id, i) => `${i + 1}- @${id.split('@')[0]}`).join('\n')
        return conn.sendMessage(m.chat, {
            text: `*🔇 المكتومين في الجروب:*\n\n${listText}\n\nلفك كتم حد، استخدم:\n${usedPrefix}الغاء_كتم <رقمه في القائمة>`,
            contextInfo: { mentionedJid: displayIds }
        }, { quoted: m })
    }

    const senderIsAdmin = isSenderGroupAdmin(m, isAdmin, participants)
    if (!senderIsAdmin) return m.reply('❌ *هذا الأمر مخصص للأدمن فقط!*')

    if (MUTE_COMMANDS.includes(cmd)) {
        const targetId = getTargetId(m, args)
        if (!targetId) {
            return m.reply('📌 *حدد الشخص اللي عايز تكتمه.*\nرد على رسالته مع الأمر، أو اكتب رقمه بعد الأمر مباشرة.\nمثال: .كتم 2010*******')
        }

        const identityMap = await getIdentityMap(conn, m.chat)
        const targetVariants = expandVariants(targetId, identityMap)
        const displayId = pickDisplayVariant(targetId, identityMap)

        const alreadyMuted = chat.mutedUsers.some(id => targetVariants.has(id) || expandVariants(id, identityMap).has(targetId))
        if (!alreadyMuted) chat.mutedUsers.push(targetId)
        return conn.sendMessage(m.chat, {
            text: `🔇 تم كتم @${displayId.split('@')[0]}، أي رسالة يبعتها هتتحذف تلقائيًا لحد ما يترفع عنه الكتم.`,
            contextInfo: { mentionedJid: [displayId] }
        }, { quoted: m })
    }

    if (UNMUTE_COMMANDS.includes(cmd)) {
        const indexArg = (args?.[0] || '').trim()
        const asIndex = /^\d{1,3}$/.test(indexArg) ? parseInt(indexArg, 10) : null

        let targetId = null
        if (asIndex && asIndex >= 1 && asIndex <= chat.mutedUsers.length) {
            targetId = chat.mutedUsers[asIndex - 1]
        } else {
            targetId = getTargetId(m, args)
        }

        if (!targetId) {
            return m.reply(`📌 *حدد الشخص اللي عايز تفك كتمه.*\nرد على رسالته، أو اكتب رقمه، أو رقمه في *${usedPrefix}المكتومين*.\nمثال: ${usedPrefix}الغاء_كتم 2`)
        }

        const identityMap = await getIdentityMap(conn, m.chat)
        const targetVariants = expandVariants(targetId, identityMap)
        const displayId = pickDisplayVariant(targetId, identityMap)

        const before = chat.mutedUsers.length
        chat.mutedUsers = chat.mutedUsers.filter(id => {
            const idVariants = expandVariants(id, identityMap)
            for (const v of targetVariants) if (idVariants.has(v)) return false
            return true
        })
        if (chat.mutedUsers.length === before) {
            return conn.sendMessage(m.chat, {
                text: `⚠️ @${displayId.split('@')[0]} مش مكتوم أصلاً.`,
                contextInfo: { mentionedJid: [displayId] }
            }, { quoted: m })
        }
        return conn.sendMessage(m.chat, {
            text: `🔊 تم رفع الكتم عن @${displayId.split('@')[0]}.`,
            contextInfo: { mentionedJid: [displayId] }
        }, { quoted: m })
    }
}

export async function before(m, { conn }) {
    attachMuteListener(conn)
    if (!m.isGroup) return
    await deleteIfMuted(conn, m.chat, m.key)
}

handler.command = /^(كتم|mute|رفع_كتم|الغاء_كتم|إلغاء_كتم|unmute|المكتومين|مكتومين)$/i
handler.tags = ['group']
handler.group = true

export default handler