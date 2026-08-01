/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const uploadToUguu = async (buffer, ext) => {
  const form = new FormData()
  form.append('files[]', buffer, `file.${ext}`)

  try {
    const response = await fetch('https://uguu.se/upload.php', {
      method: 'POST',
      body: form
    })
    const result = await response.json()

    if (!result.files || result.files.length === 0) {
      throw new Error('فشل في رفع الملف إلى Uguu.se')
    }

    return result.files[0].url
  } catch (error) {
    throw new Error(`فشل في رفع الملف: ${error.message}`)
  }
}

const editImageWithAPI = async (imageUrl, prompt) => {
  try {
    const response = await axios.get(
      `https://engez.a7a.online/api/v1/ai/ai/imgedit`,
      {
        params: {
          image_url: imageUrl,
          prompt: prompt
        },
        timeout: 120000
      }
    )

    if (response.data?.success && response.data?.response?.image) {
      return {
        success: true,
        originalImage: response.data.response.source_image,
        editedImage: response.data.response.image,
        images: response.data.response.images,
        serial_no: response.data.response.serial_no,
        prompt: response.data.response.prompt
      }
    } else {
      throw new Error(JSON.stringify(response.data || 'فشل في تعديل الصورة'))
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`)
    }
    throw new Error(`فشل في تعديل الصورة: ${error.message}`)
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!/image/.test(mime)) {
    return m.reply(
      `🎨 *تعديل الصورة بالذكاء الاصطناعي | 𝙎𝙃𝘼𝙉𝙆𝙎*\n\n` +
      `⚙️ *الاستخدام:*\n` +
      `رد على صورة واكتب:\n` +
      `\`${usedPrefix + command} [وصف التعديل]\`\n\n` +
      `📌 *مثال:*\n` +
      `\`${usedPrefix + command} خلي شعرها اسود\`\n` +
      `\`${usedPrefix + command} حط نظارة شمسية\`\n\n` +
      `⏱️ المدة المتوقعة: 30-60 ثانية`
    )
  }

  const prompt = text?.trim()
  if (!prompt) {
    return m.reply(
      `❌ *يرجى كتابة وصف التعديل*\n\n` +
      `📌 *مثال:* \`${usedPrefix + command} خلي شعرها اسود\``
    )
  }

  const waitMsg = await m.reply(
    `⏳ *جاري معالجة الصورة...*\n\n` +
    `📤 رفع الصورة إلى الخادم...\n` +
    `✏️ التعديل: *${prompt}*`
  )

  try {
    const mediaBuffer = await q.download()
    if (!mediaBuffer || mediaBuffer.length === 0) {
      throw new Error('فشل تحميل الصورة')
    }

    const { ext } = await fileTypeFromBuffer(mediaBuffer)

    await conn.sendMessage(m.chat, {
      text: `⏳ *جارٍ رفع الصورة إلى الخادم...*`,
      edit: waitMsg.key
    }).catch(() => {})

    const imageUrl = await uploadToUguu(mediaBuffer, ext || 'jpg')

    if (!imageUrl) {
      throw new Error('فشل رفع الصورة')
    }

    await conn.sendMessage(m.chat, {
      text: `⏳ *جارٍ تعديل الصورة...*\n✏️ التعديل: *${prompt}*\n⏱️ قد يستغرق 30-60 ثانية`,
      edit: waitMsg.key
    }).catch(() => {})

    const result = await editImageWithAPI(imageUrl, prompt)

    await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {})

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.editedImage },
        caption: 
          `✅ *تم تعديل الصورة بنجاح*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n` +
          `✏️ *التعديل:* ${result.prompt}\n` +
          `🔢 *رقم المهمة:* ${result.serial_no}\n\n` +
          `© ʙʏ 𝙎𝙃𝘼𝙉𝙆𝙎`
      },
      { quoted: m }
    )

  } catch (error) {
    await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {})

    let errorMsg = error.message
    try {
      const parsed = JSON.parse(error.message)
      errorMsg = JSON.stringify(parsed, null, 2)
    } catch {}

    if (errorMsg.length > 4000) {
      errorMsg = errorMsg.slice(0, 4000) + '\n\n... (تم اختصار الرسالة)'
    }

    m.reply(
      `❌ *فشل تعديل الصورة*\n\n` +
      `🔧 *الخطأ:* ${errorMsg}\n\n` +
      `💡 *اقتراحات:*\n` +
      `• تأكد من صحة الوصف\n` +
      `• جرب صورة أصغر حجماً\n` +
      `• انتظر دقيقة وحاول مجدداً\n` +
      `• جرب وصف بالانجليزية: "make hair black"`
    )
  }
}

handler.help = ['تعديل <وصف>']
handler.tags = ['ai', 'image']
handler.command = ['تعديل', 'عدل', 'نانو']

export default handler
