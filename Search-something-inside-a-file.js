/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: بحث عن شي او كلمه داخل ملف معين شكل ميتا
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs'
import path from 'path'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

function normalizeText(text) {
    return text.toLowerCase().replace(/['"`’‘]/g, '').replace(/\s+/g, ' ').trim()
}

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    if (!isOwner) return m.reply('❌ هذا الأمر مخصص لمطور البوت فقط!')
    
    if (!text) return m.reply(`💡 *طريقة الاستخدام:*\n${usedPrefix}${command} اسم_الملف|الكلمة_المراد_البحث_عنها\n\n📌 *مثال:* ${usedPrefix}${command}instagram|im back`)

    let [rawFileName, keyword] = text.split('|').map(v => v ? v.trim() : '')
    if (!rawFileName || !keyword) return m.reply('❌ يرجى كتابة اسم الملف والكلمة بشكل صحيح وفصلهم بعلامة |')

    let fileName = rawFileName.endsWith('.js') ? rawFileName : `${rawFileName}.js`

    let filePath = path.join(process.cwd(), 'plugins', fileName)
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), fileName) 
        if (!fs.existsSync(filePath)) return m.reply(`❌ لم يتم العثور على الملف: ${fileName}`)
    }

    try {
        let fileContent = fs.readFileSync(filePath, 'utf8')
        let lines = fileContent.split('\n')
        
        let normalizedKeyword = normalizeText(keyword)

        let matches = []
        lines.forEach((line, index) => {
            let normalizedLine = normalizeText(line)
            if (normalizedLine.includes(normalizedKeyword)) {
                matches.push({
                    lineNum: index + 1,
                    text: line.trim()
                })
            }
        })

        if (matches.length === 0) return m.reply(`🔍 لم يتم العثور على أي تطابق للكلمة "${keyword}" داخل الملف.`)

        let tableRows = []
        let submessages = [
            {
                messageType: 2,
                messageText: `Search Results for "${keyword}"`
            },
            {
                messageType: 2,
                messageText: `File: ${fileName}`
            }
        ]

        matches.forEach(match => {
            let shortText = match.text.length > 50 ? match.text.substring(0, 50) + '...' : match.text
            tableRows.push({
                items: [`Line ${match.lineNum}`, shortText],
                isHeading: false
            })
        })

        submessages.push({
            messageType: 4,
            tableMetadata: {
                rows: tableRows,
                title: ""
            }
        })

        submessages.push({
            messageType: 2,
            messageText: `Total matches: ${matches.length}`
        })

        let maxCodeBlocks = Math.min(matches.length, 3) 
        for (let i = 0; i < maxCodeBlocks; i++) {
            submessages.push({
                messageType: 2,
                messageText: `From ${fileName} (Line ${matches[i].lineNum})`
            })
            
            submessages.push({
                messageType: 5,
                codeMetadata: {
                    codeLanguage: "javascript",
                    codeBlocks: [
                        {
                            highlightType: 0,
                            codeContent: matches[i].text
                        }
                    ]
                }
            })
        }

        submessages.push({
            messageType: 2,
            messageText: `Total files: 1 | Total matches: ${matches.length}`
        })

        let richMsg = generateWAMessageFromContent(
            m.chat,
            {
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: submessages,
                            contextInfo: {
                                forwardingScore: 99999,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: conn.user.id.split(':')[0] + '@bot'
                                },
                                forwardOrigin: 4
                            }
                        }
                    }
                }
            },
            {}
        )

        await conn.relayMessage(
            m.chat,
            richMsg.message,
            {
                messageId: richMsg.key.id,
                additionalNodes: [
                    {
                        tag: "biz",
                        attrs: {},
                        content: [
                            {
                                tag: "interactive",
                                attrs: { type: "native_flow", v: "1" },
                                content: [
                                    {
                                        tag: "native_flow",
                                        attrs: { v: "9", name: "mixed" }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )

    } catch (e) {
        console.error(e)
        m.reply(`❌ حدث خطأ أثناء قراءة الملف أو إرسال البيانات:\n${e}`)
    }
}

handler.help = ['بحث_ملف']
handler.tags = ['owner']
handler.command = /^(كشف|src)$/i
handler.owner = true

export default handler