/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: بحث و تحميل انمي
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import axios from 'axios'
import crypto from 'crypto'

const API_BASE = 'https://engez.a7a.online/api/v1'
const SEARCH_ENDPOINT = `${API_BASE}/anime/animev2`
const DOWNLOADER_ENDPOINT = `${API_BASE}/download/downloader`
const SELECT_SEPARATOR = '|'
const CACHE_TTL_MS = 3 * 60 * 1000
const DEFAULT_IMAGE = 'https://i.postimg.cc/bS01zQwK/upload-1767808833485.jpg'

const contextCache = new Map()

function makeToken() {
  return crypto.randomBytes(8).toString('hex')
}

function now() {
  return Date.now()
}

function isExpired(entry) {
  return !entry || (now() - entry.timestamp) > CACHE_TTL_MS
}

function setContext(data) {
  const token = makeToken()
  contextCache.set(token, { ...data, timestamp: now() })
  return token
}

function getContext(token) {
  const entry = contextCache.get(token)
  if (isExpired(entry)) {
    contextCache.delete(token)
    return null
  }
  return entry
}

function clearStaleContexts() {
  const ts = now()
  for (const [token, entry] of contextCache.entries()) {
    if (!entry || (ts - entry.timestamp) > CACHE_TTL_MS) {
      contextCache.delete(token)
    }
  }
}

function isYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)\//i.test(url)
}

function cleanText(text = '') {
  return String(text)
    .replace(/\[?\s*witanime(?:\.com)?\s*\]?/ig, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*[-–—:|]+\s*$/g, '')
    .replace(/^\s*[-–—:|]+\s*/g, '')
    .trim()
}

function safeFileName(text = '') {
  return cleanText(text)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeB64(value) {
  if (!value) return ''
  try {
    return Buffer.from(String(value), 'base64').toString('utf-8')
  } catch {
    return String(value)
  }
}

function describeAnimeItem(item, index) {
  const title = cleanText(item.title || 'بدون عنوان')
  const type = item.type || 'غير معروف'
  const rating = item.rating != null ? Number(item.rating).toFixed(1) : 'غير معروف'
  return {
    header: `أنمي #${index + 1}`,
    title,
    description: `النوع: ${type} • التقييم: ${rating}`
  }
}

function describeEpisodeItem(item, index) {
  const number = item.number || String(index + 1)
  const title = cleanText(item.title || `الحلقة ${number}`)
  return {
    header: `حلقة #${number}`,
    title,
    description: `رقم الحلقة: ${number}`
  }
}

function describeLinkItem(item, index) {
  const server = item.server || 'غير معروف'
  const quality = item.quality || 'غير معروف'
  return {
    header: `رابط #${index + 1}`,
    title: `${server} • ${quality}`,
    description: `تحميل من ${server} بجودة ${quality}`
  }
}

async function sendSelectList(conn, chat, quoted, { title, footer, sections, posterUrl }) {
  let mediaMessage = null
  try {
    mediaMessage = await prepareWAMessageMedia(
      { image: { url: posterUrl || DEFAULT_IMAGE } },
      { upload: conn.waUploadToServer }
    )
  } catch {
    try {
      mediaMessage = await prepareWAMessageMedia(
        { image: { url: DEFAULT_IMAGE } },
        { upload: conn.waUploadToServer }
      )
    } catch {
      mediaMessage = null
    }
  }

  try {
    const msgContent = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: title },
            footer: { text: footer },
            header: mediaMessage ? {
              hasMediaAttachment: true,
              imageMessage: mediaMessage.imageMessage
            } : { hasMediaAttachment: false, title },
            nativeFlowMessage: {
              buttons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: '◜⏤͟͞͞ أنمي ˖࣪⃟❄️◞•',
                  sections
                })
              }]
            }
          }
        }
      }
    }
    const waMsg = generateWAMessageFromContent(chat, msgContent, { userJid: conn.user.jid, quoted })
    await conn.relayMessage(chat, waMsg.message, { messageId: waMsg.key.id })
  } catch {
    let txt = `${title}\n\n`
    for (const section of sections) {
      for (const row of section.rows) {
        txt += `${row.header}\n${row.title}\n${row.id}\n\n`
      }
    }
    await conn.sendMessage(chat, { text: txt }, { quoted })
  }
}

async function fetchSearchResults(query) {
  clearStaleContexts()

  const apiUrl = `${SEARCH_ENDPOINT}?action=${encodeURIComponent('بحث')}&q=${encodeURIComponent(query)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('لم يتم العثور على نتائج لهذا البحث')
  }

  if (!Array.isArray(data.response) || data.response.length === 0) {
    throw new Error('لا توجد نتائج مطابقة')
  }

  return data.response
}

async function fetchEpisodes(animeId) {
  clearStaleContexts()

  const apiUrl = `${SEARCH_ENDPOINT}?action=${encodeURIComponent('حلقات')}&id=${encodeURIComponent(animeId)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('لم يتم العثور على حلقات لهذا الأنمي')
  }

  const response = data.response
  if (!response || !Array.isArray(response.episodes) || response.episodes.length === 0) {
    throw new Error('لا توجد حلقات متاحة لهذا الأنمي')
  }

  return {
    animeTitle: cleanText(response.animeTitle || 'بدون عنوان'),
    totalEpisodes: response.totalEpisodes || response.episodes.length,
    episodes: response.episodes
  }
}

function isPixeldrainLink(item) {
  const server = String(item?.server || '').toLowerCase()
  const tag = String(item?.tag || '').toLowerCase()
  const decodedLink = String(decodeB64(item?.link) || item?.link || '').toLowerCase()
  return (
    server === 'pd' ||
    tag === 'pd' ||
    server.includes('pixeldrain') ||
    tag.includes('pixeldrain') ||
    decodedLink.includes('pixeldrain.com')
  )
}

async function fetchEpisodeLinks(episodeId) {
  clearStaleContexts()

  const apiUrl = `${SEARCH_ENDPOINT}?action=${encodeURIComponent('روابط')}&id=${encodeURIComponent(episodeId)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('لم يتم العثور على روابط لهذه الحلقة')
  }

  const links = data?.response?.links
  if (!Array.isArray(links) || links.length === 0) {
    throw new Error('لا توجد روابط متاحة لهذه الحلقة')
  }

  const pdLinks = links.filter(isPixeldrainLink)
  if (pdLinks.length === 0) {
    throw new Error('لا توجد روابط Pixeldrain متاحة لهذه الحلقة')
  }

  return pdLinks
}

async function resolveDownloadUrl(encodedOrRawLink) {
  let target = encodedOrRawLink
  if (!/^https?:\/\//i.test(target)) {
    target = decodeB64(target)
  }

  if (!/pixeldrain\.com/i.test(target)) {
    throw new Error('التحميل مقتصر على Pixeldrain فقط، هذا الرابط من مصدر آخر')
  }

  const apiUrl = `${DOWNLOADER_ENDPOINT}?url=${encodeURIComponent(target)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true || !data.response?.downloadUrl) {
    throw new Error('لم يتم الحصول على رابط التحميل المباشر')
  }

  return data.response
}

function extractPixeldrainId(url) {
  const patterns = [
    /pixeldrain\.com\/u\/([a-zA-Z0-9]+)/,
    /pixeldrain\.com\/api\/file\/([a-zA-Z0-9]+)/,
    /^([a-zA-Z0-9]{8})$/
  ]
  for (const pattern of patterns) {
    const match = String(url).trim().match(pattern)
    if (match) return match[1]
  }
  return null
}

async function downloadDirectFile(url) {
  const pdFileId = extractPixeldrainId(url)

  const headers = pdFileId
    ? {
        Accept: '*/*',
        'Accept-Encoding': 'identity',
        Referer: `https://pixeldrain.com/u/${pdFileId}`,
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'empty',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    : {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9'
      }

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 60000,
    maxRedirects: 5,
    headers
  })

  const contentType = String(response.headers?.['content-type'] || '').toLowerCase()

  if (contentType.includes('text/html')) {
    throw new Error('الرابط المباشر رجّع صفحة خطأ بدل الملف، حاول مرة أخرى لاحقاً.')
  }

  if (contentType.includes('application/json') || contentType.includes('text/plain')) {
    let bodyText = ''
    try {
      bodyText = Buffer.from(response.data).toString('utf-8')
    } catch {
      bodyText = ''
    }
    if (/hotlink_detected|"success"\s*:\s*false/i.test(bodyText)) {
      throw new Error('رفض السيرفر التحميل المباشر بسبب حماية Hotlink.')
    }
  }

  return {
    buffer: Buffer.from(response.data),
    headers: response.headers || {},
    contentType: response.headers?.['content-type'] || ''
  }
}

async function sendDownloadedMedia(conn, chat, quoted, {
  directUrl,
  sourceLabel,
  quality,
  animeTitle,
  episodeTitle,
  episodeNumber,
  fileNameFromApi
}) {
  const { buffer, contentType } = await downloadDirectFile(directUrl)
  const mime = String(contentType).toLowerCase()

  const cleanAnime = safeFileName(animeTitle || 'Anime')
  const cleanEpisode = safeFileName(episodeTitle || `الحلقة ${episodeNumber || ''}`.trim())
  const cleanQuality = quality ? safeFileName(quality) : ''
  const cleanSource = sourceLabel ? safeFileName(sourceLabel) : ''

  const baseName = [cleanAnime, cleanEpisode, cleanQuality, cleanSource]
    .filter(Boolean)
    .join(' - ')

  const apiExt = fileNameFromApi?.includes('.') ? fileNameFromApi.split('.').pop() : ''
  const finalExt = (apiExt || 'mp4').replace(/^\./, '')
  const finalFileName = safeFileName(baseName) + '.' + finalExt

  const captionText = 
    `✅ *تم التحميل بنجاح*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📌 *الأنمي:* ${cleanAnime}\n` +
    `📺 *الحلقة:* ${cleanEpisode}\n` +
    `⚙️ *الجودة:* ${quality || 'غير معروف'}\n` +
    `🌐 *السيرفر:* ${sourceLabel || 'غير معروف'}`

  if (mime.startsWith('video/')) {
    await conn.sendMessage(
      chat,
      {
        video: buffer,
        mimetype: contentType || 'video/mp4',
        caption: captionText
      },
      { quoted }
    )
    return
  }

  if (mime.startsWith('audio/')) {
    await conn.sendMessage(
      chat,
      {
        audio: buffer,
        mimetype: contentType || 'audio/mpeg',
        ptt: false
      },
      { quoted }
    )
    await conn.sendMessage(
      chat,
      { text: captionText },
      { quoted }
    )
    return
  }

  await conn.sendMessage(
    chat,
    {
      document: buffer,
      mimetype: contentType || 'application/octet-stream',
      fileName: finalFileName
    },
    { quoted }
  )
}

async function sendSearchResults(conn, m, usedPrefix, query, results) {
  const token = setContext({ type: 'search', query, results })

  const rows = results.slice(0, 20).map((item, index) => {
    const info = describeAnimeItem(item, index)
    return {
      header: info.header,
      title: info.title,
      description: info.description,
      id: `${usedPrefix}انمي search${SELECT_SEPARATOR}${token}${SELECT_SEPARATOR}${index}`
    }
  })

  const posterUrl = decodeB64(results[0]?.poster)

  await sendSelectList(conn, m.chat, m, {
    title: `🔍 *نتائج البحث عن:* ${query}`,
    footer: 'اختر الأنمي المطلوب من القائمة:',
    posterUrl,
    sections: [
      {
        title: '📥 نتائج البحث',
        highlight_label: `📥 ${rows.length} نتيجة`,
        rows
      }
    ]
  })
}

async function sendEpisodesList(conn, m, usedPrefix, animeTitle, episodes, animeId, posterUrl) {
  const token = setContext({
    type: 'episodes',
    animeTitle,
    animeId,
    episodes
  })

  const rows = episodes.slice(0, 30).map((item, index) => {
    const info = describeEpisodeItem(item, index)
    return {
      header: info.header,
      title: info.title,
      description: info.description,
      id: `${usedPrefix}انمي episode${SELECT_SEPARATOR}${token}${SELECT_SEPARATOR}${index}`
    }
  })

  await sendSelectList(conn, m.chat, m, {
    title: `📺 *الأنمي:* ${animeTitle}\n🎬 *عدد الحلقات:* ${episodes.length}`,
    footer: 'اختر الحلقة المطلوبة من القائمة:',
    posterUrl,
    sections: [
      {
        title: '📥 الحلقات المتاحة',
        highlight_label: `📥 ${rows.length} حلقة`,
        rows
      }
    ]
  })
}

async function sendLinksList(conn, m, usedPrefix, animeTitle, episodeTitle, episodeNumber, links, episodeId, posterUrl) {
  const token = setContext({
    type: 'links',
    animeTitle,
    episodeTitle,
    episodeNumber,
    episodeId,
    links
  })

  const rows = links.slice(0, 20).map((item, index) => {
    const info = describeLinkItem(item, index)
    return {
      header: info.header,
      title: info.title,
      description: info.description,
      id: `${usedPrefix}انمي link${SELECT_SEPARATOR}${token}${SELECT_SEPARATOR}${index}`
    }
  })

  await sendSelectList(conn, m.chat, m, {
    title: `📺 *${animeTitle}*\n🧩 *${episodeTitle || `الحلقة ${episodeNumber}`}*`,
    footer: 'اختر الجودة أو السيرفر للتحميل:',
    posterUrl,
    sections: [
      {
        title: '📥 روابط التحميل',
        highlight_label: `📥 ${rows.length} رابط`,
        rows
      }
    ]
  })
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const react = async (emoji) => {
    try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
  }

  const rawInput = args.join(' ').trim()

  if (!rawInput) {
    await react("⚠️")
    return m.reply(
      `📌 *بحث وتحميل الحلقات*\n\n` +
      `💡 *الاستخدام:* ${usedPrefix}${command} <اسم الأنمي>\n` +
      `مثال: \`${usedPrefix}${command} Solo Leveling\``
    )
  }

  const parts = rawInput.split(SELECT_SEPARATOR)
  const action = parts[0]?.trim()?.toLowerCase()

  try {
    if (action === 'search') {
      const token = parts[1]
      const index = parseInt(parts[2], 10)

      const ctx = getContext(token)
      if (!ctx || ctx.type !== 'search') {
        await react("❌")
        return m.reply('❌ *انتهت جلسة البحث، يرجى إعادة إرسال اسم الأنمي.*')
      }

      const selected = ctx.results[index]
      if (!selected) {
        await react("❌")
        return m.reply('❌ *الاختيار غير موجود، حاول مرة أخرى.*')
      }

      await react("⏳")

      const animeId = selected.id
      const animeTitle = cleanText(selected.title || 'بدون عنوان')
      const posterUrl = decodeB64(selected.poster)
      const { episodes } = await fetchEpisodes(animeId)
      await sendEpisodesList(conn, m, usedPrefix, animeTitle, episodes, animeId, posterUrl)
      return
    }

    if (action === 'episode') {
      const token = parts[1]
      const index = parseInt(parts[2], 10)

      const ctx = getContext(token)
      if (!ctx || ctx.type !== 'episodes') {
        await react("❌")
        return m.reply('❌ *انتهت جلسة الحلقات، يرجى إعادة اختيار الأنمي.*')
      }

      const episode = ctx.episodes[index]
      if (!episode) {
        await react("❌")
        return m.reply('❌ *الحلقة غير موجودة، حاول مرة أخرى.*')
      }

      await react("⏳")

      const animeTitle = cleanText(ctx.animeTitle || 'بدون عنوان')
      const episodeTitle = cleanText(episode.title || `الحلقة ${episode.number || index + 1}`)
      const episodeNumber = episode.number || String(index + 1)
      const episodePoster = decodeB64(episode.thumb)
      const links = await fetchEpisodeLinks(episode.id)

      if (links.length === 1) {
        const link = links[0]
        const resolved = await resolveDownloadUrl(link.link)

        await sendDownloadedMedia(conn, m.chat, m, {
          directUrl: resolved.downloadUrl,
          sourceLabel: link.server || resolved.provider,
          quality: link.quality || '',
          animeTitle,
          episodeTitle,
          episodeNumber,
          fileNameFromApi: resolved.fileName
        })
        await react("✅")
        return
      }

      await sendLinksList(conn, m, usedPrefix, animeTitle, episodeTitle, episodeNumber, links, episode.id, episodePoster)
      return
    }

    if (action === 'link') {
      const token = parts[1]
      const index = parseInt(parts[2], 10)

      const ctx = getContext(token)
      if (!ctx || ctx.type !== 'links') {
        await react("❌")
        return m.reply('❌ *انتهت جلسة الروابط، يرجى إعادة اختيار الحلقة.*')
      }

      const linkItem = ctx.links[index]
      if (!linkItem) {
        await react("❌")
        return m.reply('❌ *الرابط غير موجود، حاول مرة أخرى.*')
      }

      await react("⏳")

      const animeTitle = cleanText(ctx.animeTitle || 'بدون عنوان')
      const episodeTitle = cleanText(ctx.episodeTitle || `الحلقة ${ctx.episodeNumber || ''}`.trim())
      const episodeNumber = ctx.episodeNumber || ''

      const resolved = await resolveDownloadUrl(linkItem.link)

      await sendDownloadedMedia(conn, m.chat, m, {
        directUrl: resolved.downloadUrl,
        sourceLabel: linkItem.server || resolved.provider,
        quality: linkItem.quality || '',
        animeTitle,
        episodeTitle,
        episodeNumber,
        fileNameFromApi: resolved.fileName
      })
      await react("✅")
      return
    }

    if (isYouTubeUrl(rawInput)) {
      await react("❌")
      return m.reply('❌ *روابط يوتيوب غير مدعومة هنا.*')
    }

    await react("⏳")

    const results = await fetchSearchResults(rawInput)
    await sendSearchResults(conn, m, usedPrefix, rawInput, results)
  } catch (e) {
    await react("❌")
    const msg = e?.response?.data?.error || e?.message || 'حدث خطأ غير متوقع'
    return m.reply(`❌ *خطأ:* ${msg}`)
  }
}

handler.command = /^(انمي|anime|بحث_انمي|حلقات_انمي|تحميل_انمي)$/i
handler.help = ['انمي <اسم>']
handler.tags = ['downloader', 'anime']

export default handler