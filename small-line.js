/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تصغير الخط مثل ميتا بظبط 
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
   
    let targetText = text || m.quoted?.text

    if (!targetText) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        return m.reply(`📌 *يرجى كتابة النص المراد تصغيره أو الرد على رسالة!*\n\nمثال:\n• ${usedPrefix + command} هذا النص سيظهر بحجم صغير جداً`)
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

        
        await conn.relayMessage(
            m.chat,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    messageSecret: "pWXmjE+HcKS+Ry7gzEVzCWet/ZzDrcegs3RhuoFgE0Q=",
                    botMetadata: {
                        messageDisclaimerText: "",
                        capabilityMetadata: {
                            capabilities: [61]
                        },
                        richResponseSourcesMetadata: {}
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: targetText
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": conn.generateMessageTag(),
                                    "sections": [
                                        {
                                            "view_model": {
                                                "__typename": "GenAISingleLayoutViewModel",
                                                "primitive": {
                                                    "__typename": "GenAIMetaSubsQuotaUpsellPrimitive",
                                                    "title": targetText
                                                }
                                            }
                                        }
                                    ]
                                })).toString('base64')
                            },
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: "0@bot"
                                },
                                forwardOrigin: 4
                            }
                        }
                    }
                }
            },
            { messageId: conn.generateMessageTag() }
        )

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (err) {
        console.error('[TINY-TEXT-ERROR]', err)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply(`❌ حدث خطأ أثناء تصغير النص: ${err.message}`)
    }
}

handler.command = /^(تصغير|نص_صغير|صغر|tinytext)$/i
handler.tags = ['tools']
handler.help = ['تصغير <النص>']

export default handler