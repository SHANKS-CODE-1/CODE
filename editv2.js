/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
الوظيفه: بحث تيك توك و إرساله كاروسيل 
حقوق ال Api: بروتوتايب
*/

import axios from 'axios'
import {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
} from "@whiskeysockets/baileys"

const API_URL = 'https://2b.hidenfree.com'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const chat = m.chat

  if (!args[0]) {
    await conn.sendMessage(chat, { react: { text: "❌", key: m.key } })
    return m.reply(`*🎬 بـحـث الاديـتـات (𝚂𝙷𝙰𝙽𝙺𝚂 𝙱𝙾𝚃 )*\n\n📌 *الاستخدام:* ${usedPrefix}${command} <اسم الشخصية>\nمثال:\n• ${usedPrefix}${command} ناروتو\n• ${usedPrefix}${command} gojo\n• ${usedPrefix}${command} itachi`)
  }

  const characterName = args.join(" ")
  const searchQuery = `${characterName} edit`

  await conn.sendMessage(chat, { react: { text: "🔍", key: m.key } })

  try {

    const { data } = await axios.get(`${API_URL}/api/pinterest/search`, {
      params: { q: searchQuery, type: 'video', limit: 5 },
      timeout: 30000,
      validateStatus: () => true
    })

    const videos = data?.results || []

    if (!videos.length) {
      await conn.sendMessage(chat, { react: { text: "❌", key: m.key } })
      return m.reply(`❌ لم يتم العثور على أيديتات لـ: ${characterName}`)
    }


    const validVideos = []
    
    for (const v of videos) {
      try {
        const dlRes = await axios.get(`${API_URL}/api/pinterest/public`, {
          params: { api_key: 'free_key', url: v.url, type: 'video' },
          timeout: 300000,
          validateStatus: () => true
        })

        if (dlRes.data?.success && dlRes.data?.fileKey) {
          const fileRes = await axios.get(`${API_URL}/api/pinterest/download?file=${dlRes.data.fileKey}`, {
            responseType: 'arraybuffer',
            timeout: 300000,
            validateStatus: () => true
          })

          const buffer = Buffer.from(fileRes.data)
          
          if (buffer.length > 1000) {
            validVideos.push({
              title: v.title || `${characterName} Edit 🎬`,
              videoBuffer: buffer,
              author: v.channel || v.author || 'غير معروف'
            })
          }
        }
      } catch (e) {
        console.error("خطأ أثناء معالجة فيديو فردي:", e.message)
      }
    }

    if (!validVideos.length) throw new Error('تعذر تحميل أي من الفيديوهات المستخرجة.')


    await sendCarousel(conn, chat, m, characterName, validVideos)

    await conn.sendMessage(chat, { react: { text: "✅", key: m.key } })
  } catch (err) {
    console.error("❌ SHANKS Edit Error:", err)
    await conn.sendMessage(chat, { react: { text: "❌", key: m.key } })
    m.reply(`❌ حدث خطأ: ${err.message}`)
  }
}

async function sendCarousel(conn, chat, m, characterName, videos) {
  const cards = []

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i]
    try {
      const { videoMessage } = await generateWAMessageContent(
        { video: video.videoBuffer },
        { upload: conn.waUploadToServer }
      )

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `👤 ${video.author}`,
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '❄️ SHANKS BOT',
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: video.title.length > 50 ? video.title.substring(0, 47) + "..." : video.title,
          hasMediaAttachment: true,
          videoMessage: videoMessage,
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [],
        }),
      })
    } catch (err) {
      console.log("Card error:", err.message)
    }
  }

  if (cards.length === 0) throw new Error("لم يتم إنشاء أية كروت بنجاح")

  const headerText = `
 ─── ✧  *SHANKS BOT*  ✧ ───

       ♡ | 🎬 **اديتات: ${characterName}**
       ⚡ | 📹 **فيديوهات: ${cards.length}**

 ─── ✧ ❄️ *SHANKS SYSTEM* 🍷 ───
`.trim()

  const msg = generateWAMessageFromContent(chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: headerText,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '🍷 SHANKS BOT SYSTEM',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false,
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards,
          }),
        }),
      },
    },
  }, { quoted: m })

  await conn.relayMessage(chat, msg.message, { messageId: msg.key.id })
}

handler.help = ["ايديت <اسم>"]
handler.tags = ["downloader", 'anime']
handler.command = /^(ايديت|edit|ايديتت|edits)$/i

export default handler