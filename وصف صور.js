/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
الوظيفه: وصف صور
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

const API_BASE = 'https://engez.a7a.online/api/v1'


async function uploadToUguu(buffer, ext) {
    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('files[]', buffer, `file.${ext}`)

    try {
        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 30000
        })

        if (!response.data?.files?.[0]?.url) {
            throw new Error('فشل في رفع الملف')
        }

        return response.data.files[0].url
    } catch (error) {
        throw new Error(`فشل رفع الملف: ${error.message}`)
    }
}


async function generatePrompt(imageUrl) {
    try {
        const params = new URLSearchParams()
        params.append('imageUrl', imageUrl)

        const response = await axios.get(`${API_BASE}/tools/img2prompt?${params.toString()}`, {
            timeout: 60000
        })

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل توليد الوصف')
        }

        return response.data.response
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال بالخادم')
    }
}

const handler = async (m, { conn }) => {
    
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!mime || !mime.startsWith('image/')) {
        return conn.sendMessage(
            m.chat,
            {
                text: '🖼️ *وصف الصورة - img2prompt*\n\n' +
                      '📌 *الاستخدام:*\n' +
                      '• أرسل صورة أو قم بالرد عليها بالمر: `.وصف`'
            },
            { quoted: m }
        )
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        
        const buffer = await q.download()
        if (!buffer || buffer.length === 0) {
            throw new Error('فشل تحميل الصورة من الرسالة')
        }

     
        const fileInfo = await fileTypeFromBuffer(buffer)
        const ext = fileInfo?.ext || 'jpg'

        await conn.sendMessage(m.chat, { react: { text: '📤', key: m.key } })

        
        const imageUrl = await uploadToUguu(buffer, ext)
        if (!imageUrl) {
            throw new Error('فشل رفع الصورة')
        }

        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

      
        const result = await generatePrompt(imageUrl)

        if (result?.arabic) {
            
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: `📝 *وصف الصورة:*\n\n${result.arabic}`
            }, { quoted: m })

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
            throw new Error('لم يتم العثور على وصف مناسب للصورة')
        }

    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await conn.sendMessage(
            m.chat,
            { text: `❌ *خطأ:* ${error.message || 'حدث خطأ غير متوقع'}` },
            { quoted: m }
        )
    }
}

handler.command = ['وصف', 'img2prompt', 'وصف-صورة']
handler.help = ['وصف <رد على صورة>']
handler.tags = ['tools']

export default handler