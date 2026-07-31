/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: بحث و تحميل كتب من wattpad
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const API_BASE = 'https://engez.a7a.online/api/v1'
const DEFAULT_IMAGE = 'https://img.wattpad.com/cover/default-cover-256-k.jpg'

async function searchStories(query) {
    try {
        const params = new URLSearchParams()
        params.append('action', 'بحث')
        params.append('q', query)

        const response = await axios.get(`${API_BASE}/reading/wattpad?${params.toString()}`, {
            timeout: 30000
        })

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل البحث')
        }

        return response.data.results || []
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال')
    }
}

async function getStoryDetails(storyId) {
    try {
        const params = new URLSearchParams()
        params.append('action', 'تفاصيل')
        params.append('id', storyId)

        const response = await axios.get(`${API_BASE}/reading/wattpad?${params.toString()}`, {
            timeout: 30000
        })

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل جلب التفاصيل')
        }

        return response.data
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال')
    }
}

async function getChapterContent(chapterId) {
    try {
        const params = new URLSearchParams()
        params.append('action', 'فصل')
        params.append('id', chapterId)

        const response = await axios.get(`${API_BASE}/reading/wattpad?${params.toString()}`, {
            timeout: 30000
        })

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل جلب الفصل')
        }

        return response.data.content
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال')
    }
}

function formatNumber(num) {
    if (!num) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (command === 'واتباد' || command === 'wattpad') {
        if (!text) {
            return m.reply(
                '📚 *البحث في Wattpad*\n\n' +
                '📌 *الاستخدام:*\n' +
                `• ${usedPrefix}واتباد ارض زيكولا\n\n` +
                '📌 *مثال:*\n' +
                `${usedPrefix}واتباد رومانسية`
            )
        }

        await m.react('🔍')

        try {
            const results = await searchStories(text)
            if (results.length === 0) {
                throw new Error('لا توجد نتائج')
            }

            const rows = results.slice(0, 10).map((story) => ({
                header: `📊 ${formatNumber(story.readCount)} قراءة | ⭐ ${formatNumber(story.voteCount)}`,
                title: story.title.substring(0, 50),
                description: `✍️ ${story.author} | 📄 ${story.parts || 0} جزء | ${story.completed ? '✅ مكتملة' : '⏳ مستمرة'}`,
                id: `${usedPrefix}تفاصيل-قصة ${story.id}`
            }))

            const caption = `📚 *نتائج البحث عن:* ${text}\n📊 *عدد النتائج:* ${results.length}\n\n👇 اختر القصة:`

            const defaultThumb = results[0]?.cover || DEFAULT_IMAGE
            const mediaMessage = await prepareWAMessageMedia(
                { image: { url: defaultThumb } },
                { upload: conn.waUploadToServer }
            )

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: caption },
                            footer: { text: '📚 Wattpad Reader' },
                            header: {
                                hasMediaAttachment: true,
                                imageMessage: mediaMessage.imageMessage
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '📋 اختر قصة',
                                        sections: [{
                                            title: '📚 النتائج',
                                            rows
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            }, { userJid: conn.user.jid, quoted: m })

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
            await m.react('✅')

        } catch (error) {
            await m.react('❌')
            return m.reply(`❌ *خطأ:* ${error.message}`)
        }
        return
    }

    if (command === 'تفاصيل-قصة') {
        if (!text) return
        const storyId = text.trim()

        await m.react('⏳')

        try {
            const data = await getStoryDetails(storyId)

            const caption = 
                `📖 *${data.title}*\n\n` +
                `✍️ *الكاتب:* ${data.author}\n` +
                `📄 *الأجزاء:* ${data.parts || 0}\n` +
                `📊 *الحالة:* ${data.completed ? '✅ مكتملة' : '⏳ مستمرة'}\n` +
                `👁️ *القراءات:* ${formatNumber(data.readCount)}\n` +
                `⭐ *الأصوات:* ${formatNumber(data.voteCount)}\n` +
                `💬 *التعليقات:* ${formatNumber(data.commentCount)}\n\n` +
                `📝 *الوصف:*\n${data.description?.substring(0, 200) || 'لا يوجد وصف'}...`

            if (data.cover) {
                await conn.sendMessage(m.chat, {
                    image: { url: data.cover },
                    caption: caption
                }, { quoted: m })
            } else {
                await m.reply(caption)
            }

            if (data.chapters && data.chapters.length > 0) {
                const rows = data.chapters.map((chapter, index) => ({
                    header: `📖 فصل ${index + 1}`,
                    title: chapter.title.substring(0, 40),
                    description: `🔗 اضغط للقراءة`,
                    id: `${usedPrefix}قراءة-فصل ${chapter.id}`
                }))

                const msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: { text: `📖 *فصول ${data.title}*\n📊 *عدد الفصول:* ${data.chapters.length}\n\n👇 اختر فصل للقراءة:` },
                                footer: { text: '📚 Wattpad Reader' },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: '📋 اختر فصل',
                                            sections: [{
                                                title: '📖 الفصول',
                                                rows
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                }, { userJid: conn.user.jid, quoted: m })

                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
            }

            await m.react('✅')

        } catch (error) {
            await m.react('❌')
            return m.reply(`❌ *خطأ:* ${error.message}`)
        }
        return
    }

    if (command === 'قراءة-فصل') {
        if (!text) return
        const chapterId = text.trim()

        await m.react('📖')

        try {
            const content = await getChapterContent(chapterId)

            if (!content) {
                throw new Error('لا يوجد محتوى لهذا الفصل')
            }

            const maxLength = 4000
            const parts = []

            for (let i = 0; i < content.length; i += maxLength) {
                parts.push(content.substring(i, i + maxLength))
            }

            for (let i = 0; i < parts.length; i++) {
                const prefix = parts.length > 1 ? `📖 *الجزء ${i + 1}/${parts.length}*\n\n` : ''
                await m.reply(`${prefix}${parts[i]}`)
            }

            await m.react('✅')

        } catch (error) {
            await m.react('❌')
            return m.reply(`❌ *خطأ:* ${error.message}`)
        }
        return
    }
}

handler.command = ['واتباد', 'wattpad', 'تفاصيل-قصة', 'قراءة-فصل']
handler.help = ['واتباد <بحث>', 'تفاصيل-قصة <id>', 'قراءة-فصل <id>']
handler.tags = ['reading']

export default handler