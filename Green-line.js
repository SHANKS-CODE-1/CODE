/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه:: تحويل الخط لي لون اخضر و صغير مثل ميتا 
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let targetText = text || m.quoted?.text

    if (!targetText) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        return m.reply(`📌 *يرجى كتابة النص أو الرد على رسالة!*\n\nمثال:\n• ${usedPrefix + command} هذا النص سيظهر أخضر وصغير جداً`)
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🟢', key: m.key } })

       
        const toSmallText = (str) => {
            const smallMap = {
                'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
                'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
                'q': '𐞥', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ',
                'y': 'ʸ', 'z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
                '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
            }
            return str.split('').map(c => smallMap[c.toLowerCase()] || c).join('')
        }

        const formattedText = toSmallText(targetText)

        await conn.relayMessage(
            m.chat,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    messageSecret: "XsXIg+A4EYkjyxaQUU6cAWSIpdUSFwOJfcgXZiuO5Sw=",
                    botMetadata: {
                        messageDisclaimerText: "",
                        capabilityMetadata: {
                            capabilities: [61]
                        },
                        richResponseSourcesMetadata: {},
                        botResponseId: conn.generateMessageTag()
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: "l"
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
                                                    "buttons": [
                                                        {
                                                            "action": "OPEN_DEEPLINK",
                                                            "deeplink": "https://github.com/SHANKS-CODE-1/CODE",
                                                            "label": formattedText
                                                        }
                                                    ],
                                                    "title": "l"
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
        console.error('[GREEN-TEXT-ERROR]', err)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply(`❌ حدث خطأ: ${err.message}`)
    }
}

handler.command = /^(اخضر|أخضر|نص_اخضر|greentext)$/i
handler.tags = ['tools']
handler.help = ['اخضر <النص>']

export default handler