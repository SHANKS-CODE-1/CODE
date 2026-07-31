/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: رساله متطوره كده ++تقدر تغير الروابط بي الصوره الي عايزها و اسم الشخصية و عدد الاعاده و زياده عدد الصور
╰━━━━━━━━━━━━━━━━━━╯
*/

import { prepareWAMessageMedia } from '@whiskeysockets/baileys'
import sharp from 'sharp'
import fetch from 'node-fetch'

const urls = [
  'https://files.catbox.moe/onb80l.jpg',
  'https://files.catbox.moe/gnqo59.jpg',
  'https://files.catbox.moe/l4tul0.jpg',
  'https://files.catbox.moe/4we9pq.jpg',
  'https://files.catbox.moe/cmryvk.jpg',
  'https://files.catbox.moe/tht0ql.jpg',
  'https://files.catbox.moe/ltb269.jpg',
  'https://files.catbox.moe/7fccmi.jpg',
  'https://files.catbox.moe/4aykmk.jpg'
]

const link = 'https://SHANKS.bot'
const title = '𝙎𝙃𝘼𝙉𝙆𝙎'
const description = '© ʙʏ ѕʜᴀɴᴋѕ'
const text = '𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙤𝙩'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchImageThumbnail(url) {
  const buffer = await fetch(url).then(res => res.buffer())
  return await sharp(buffer)
    .resize(300, 300, { fit: 'cover' })
    .jpeg()
    .toBuffer()
}

let handler = async (m, { conn, command }) => {
  if (command === 'تشيكا' || command === 'chika') {
    const { key } = await conn.sendMessage(m.chat, { text: '⏳ Loading...' }, { quoted: m })

    const thumbs = await Promise.all(urls.map(fetchImageThumbnail))

    for (let i = 0; i < 5; i++) {
      for (const jpegThumbnail of thumbs) {
        await conn.sendMessage(m.chat, {
          edit: key,
          text: text.includes(link) ? text : `${link}\n${text}`,
          linkPreview: {
            'matched-text': link,
            title,
            description,
            jpegThumbnail
          }
        })
        await delay(1500)
      }
    }
    return
  }

  if (command === 'تشيكا2' || command === 'chika2') {
    const { key } = await m.reply('Loading...')

    const medias = await Promise.all(
      urls.map(async url => {
        const { imageMessage } = await prepareWAMessageMedia(
          { image: { url } },
          { upload: conn.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        )
        return imageMessage
      })
    )

    for (let i = 0; i < 5; i++) {
      for (const image of medias) {
        await conn.sendMessage(m.chat, {
          edit: key,
          text: text.includes(link) ? text : `${link}\n${text}`,
          linkPreview: {
            'matched-text': link,
            title,
            description,
            jpegThumbnail: image.jpegThumbnail,
            highQualityThumbnail: image
          }
        })
        await delay(2000)
      }
    }
  }
}

handler.help = ['تشيكا','تشيكا2']
handler.tags = ['tools']
handler.command = ['تشيكا2', 'تشيكا', 'chika','chika2']

export default handler