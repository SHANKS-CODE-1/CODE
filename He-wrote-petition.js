/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: كتابه عريضه
╰━━━━━━━━━━━━━━━━━━╯
*/

process.env.NEWSLETTER_ID = "120363426042842162@newsletter"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const query = text?.trim()

    if (!query) {
        return await m.reply(`> ❄️ *طريقة الاستخدام:*\n> اكتب الأمر ومعه الكلمة التي تريد تضخيمها.\n\n📌 *مثال:* \n\`${usedPrefix + command} SHANKS\`\n\n𝙎𝙃𝘼𝙉𝙆𝙎 𝐁𝐎𝐓 🪶`)
    }

    const botJid = conn.user?.id || conn.user?.jid || '0@bot'

    const contextInfo = {
        mentionedJid: [],
        groupMentions: [],
        statusAttributions: [],
        stanzaId: m.key?.id,
        participant: m.sender,
        remoteJid: m.chat,
        forwardingScore: 1,
        isForwarded: true,
        forwardedAiBotMessageInfo: { botJid },
        forwardOrigin: 4
    }

    const single = (primitive) => ({
        view_model: { primitive, __typename: 'GenAISingleLayoutViewModel' }
    })

    const sections = [
        single({
            text: `# ${query}`,
            __typename: 'GenAIMarkdownTextUXPrimitive'
        })
    ]

    await conn.relayMessage(m.chat, {
        messageContextInfo: {
            deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
            deviceListMetadataVersion: 2,
            botMetadata: {
                messageDisclaimerText: '',
                richResponseSourcesMetadata: { sources: [] }
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [{ messageType: 2, messageText: query }],
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify({
                            response_id: `bold-${Date.now()}`,
                            sections
                        })).toString('base64')
                    },
                    contextInfo
                }
            }
        }
    }, {})
}

handler.help = ['عريض'].map(v => v + ' <النص>')
handler.tags = ['tools']
handler.command = /^(عريض|ضخم|big|heading)$/i

export default handler