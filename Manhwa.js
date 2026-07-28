/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'

const API_BASE = 'https://engez.a7a.online/api/v1'
const MANHWA_ENDPOINT = `${API_BASE}/anime/manhwa`
const SELECT_SEPARATOR = '|'
const CACHE_TTL_MS = 3 * 60 * 1000
const DEFAULT_IMAGE = 'https://i.postimg.cc/bS01zQwK/upload-1767808833485.jpg'
const MAX_CHAPTERS_PER_MERGE = 15

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

function cleanText(text = '') {
  return String(text)
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

function genreNames(genres = []) {
  return genres.map((g) => g.name).filter(Boolean).join('، ')
}

function describeSeriesItem(item, index) {
  const title = cleanText(item.title || 'بدون عنوان')
  const status = item.status || 'غير معروف'
  const rating = item.rating != null ? Number(item.rating).toFixed(1) : 'غير معروف'
  return {
    header: `مانهوا #${index + 1}`,
    title,
    description: `الحالة: ${status} • التقييم: ${rating}`
  }
}

function describeChapterItem(item, index) {
  const chapterNum = item.chapter || String(index + 1)
  const title = cleanText(item.title || `الفصل ${chapterNum}`)
  return {
    header: `فصل #${chapterNum}`,
    title,
    description: `👁️ ${item.views || 0} مشاهدة`
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
                  title: '🔏 مانهوا 🔏',
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
  } catch (e) {
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

  const apiUrl = `${MANHWA_ENDPOINT}?action=${encodeURIComponent('بحث')}&q=${encodeURIComponent(query)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('لم يتم العثور على نتائج لهذا البحث')
  }

  const results = data.response?.results
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('لا توجد نتائج مطابقة')
  }

  return results
}

async function fetchChapters(seriesId) {
  clearStaleContexts()

  const apiUrl = `${MANHWA_ENDPOINT}?action=${encodeURIComponent('فصول')}&id=${encodeURIComponent(seriesId)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true) {
    throw new Error('لم يتم العثور على فصول لهذه المانهوا')
  }

  const results = data.response?.results
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('لا توجد فصول متاحة لهذه المانهوا')
  }

  return results
}

async function fetchChapterFull(chapterId) {
  const apiUrl = `${MANHWA_ENDPOINT}?action=${encodeURIComponent('فصل')}&id=${encodeURIComponent(chapterId)}`
  const { data } = await axios.get(apiUrl, { timeout: 30000 })

  if (!data || data.success !== true || !data.response) {
    throw new Error('لم يتم العثور على هذا الفصل')
  }

  const chapter = data.response
  if (!Array.isArray(chapter.images) || chapter.images.length === 0) {
    throw new Error('لا توجد صور في هذا الفصل')
  }

  return chapter
}

async function createChaptersPDF(chapters, outputPath) {
  const doc = new PDFDocument({ autoFirstPage: false, margin: 0 })
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)
  let addedPages = 0

  for (const chap of chapters) {
    const sortedImages = [...(chap.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

    for (const img of sortedImages) {
      try {
        const res = await axios.get(img.image, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        const buffer = await sharp(Buffer.from(res.data))
          .jpeg({ quality: 45, mozjpeg: true })
          .toBuffer()
        const meta = await sharp(buffer).metadata()
        if (!meta.width || !meta.height) continue
        doc.addPage({ size: [meta.width, meta.height] })
        doc.image(buffer, 0, 0, { width: meta.width, height: meta.height })
        addedPages++
      } catch (e) {
        console.error(`Skipping image: ${img.image}`, e.message)
      }
    }
  }

  if (addedPages === 0) {
    doc.destroy()
    throw new Error('لم يتم إضافة أي صفحات للـ PDF، فشل تحميل كل الصور.')
  }
  doc.end()
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

async function sendSearchResults(conn, m, usedPrefix, query, results) {
  const token = setContext({ type: 'search', query, results })

  const rows = results.slice(0, 20).map((item, index) => {
    const info = describeSeriesItem(item, index)
    return {
      header: info.header,
      title: info.title,
      description: info.description,
      id: `${usedPrefix}مانهوا search${SELECT_SEPARATOR}${token}${SELECT_SEPARATOR}${index}`
    }
  })

  const posterUrl = results[0]?.poster?.medium || results[0]?.poster?.thumbnail || DEFAULT_IMAGE

  await sendSelectList(conn, m.chat, m, {
    title: `*🔎 نتائج البحث عن:* ${query}`,
    footer: 'اختر المانهوا المطلوبة من القائمة:',
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

async function sendChaptersList(conn, m, usedPrefix, seriesTitle, chapters, seriesId, posterUrl) {
  const token = setContext({
    type: 'chapters',
    seriesTitle,
    seriesId,
    chapters
  })

  const rows = chapters.slice(0, 30).map((item, index) => {
    const info = describeChapterItem(item, index)
    return {
      header: info.header,
      title: info.title,
      description: info.description,
      id: `${usedPrefix}مانهوا chapter${SELECT_SEPARATOR}${token}${SELECT_SEPARATOR}${index}`
    }
  })

  await sendSelectList(conn, m.chat, m, {
    title: `*📖 المانهوا:* ${seriesTitle}\n*📚 عدد الفصول:* ${chapters.length}`,
    footer: 'اختر الفصل المطلوب من القائمة:',
    posterUrl,
    sections: [
      {
        title: '📥 الفصول المتاحة',
        highlight_label: `📥 ${rows.length} فصل`,
        rows
      }
    ]
  })
}

async function sendChapterPDF(conn, chat, quoted, { chapter, seriesTitle, usedPrefix }) {
  const pdfPath = path.join(os.tmpdir(), `manhwa_${Date.now()}.pdf`)
  try {
    await createChaptersPDF([chapter], pdfPath)
  } catch (e) {
    throw new Error(`فشل إنشاء PDF: ${e.message}`)
  }

  const chapterLabel = cleanText(chapter.title || `الفصل ${chapter.chapter}`)
  const { documentMessage } = await prepareWAMessageMedia(
    {
      document: { url: pdfPath },
      mimetype: 'application/pdf',
      fileName: `${safeFileName(seriesTitle)} - ${safeFileName(chapterLabel)}.pdf`
    },
    { upload: conn.waUploadToServer }
  )

  const buttons = []
  if (chapter.navigation?.prev) {
    buttons.push({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: '⬅️ الفصل السابق',
        id: `${usedPrefix}مانهوا chapterid${SELECT_SEPARATOR}${chapter.navigation.prev}`
      })
    })
  }
  if (chapter.navigation?.next) {
    buttons.push({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: 'الفصل التالي ➡️',
        id: `${usedPrefix}مانهوا chapterid${SELECT_SEPARATOR}${chapter.navigation.next}`
      })
    })
  }

  const msgContent = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: `📖 مانهوا: *${seriesTitle}*\n🔖 الفصل: *${chapterLabel}*\n👁️ المشاهدات: ${chapter.views || 0}\n🖼️ عدد الصور: ${chapter.images.length}`
          },
          footer: { text: '🔏 AppSwat Manhwa 🔏' },
          header: { hasMediaAttachment: true, documentMessage },
          nativeFlowMessage: { buttons }
        }
      }
    }
  }
  const waMsg = generateWAMessageFromContent(chat, msgContent, { userJid: conn.user.jid, quoted })
  await conn.relayMessage(chat, waMsg.message, { messageId: waMsg.key.id })

  fs.unlink(pdfPath, () => {})
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const rawInput = args.join(' ').trim()

  if (!rawInput) {
    return conn.sendMessage(
      m.chat,
      {
        text: `╭─❖ *بحث وفصول المانهوا* ❖─╮\n│\n│ أرسل اسم المانهوا للبحث:\n│ ${usedPrefix}${command} solo leveling\n│\n│ أو اختر من القوائم بعد البحث.\n│\n╰────────────────╯`
      },
      { quoted: m }
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
        return conn.sendMessage(
          m.chat,
          { text: '❌ انتهت جلسة البحث، أعد إرسال اسم المانهوا.' },
          { quoted: m }
        )
      }

      const selected = ctx.results[index]
      if (!selected) {
        return conn.sendMessage(
          m.chat,
          { text: '❌ الاختيار غير موجود، أعد المحاولة.' },
          { quoted: m }
        )
      }

      await conn.sendMessage(m.chat, { text: '⏳ جاري جلب الفصول...' }, { quoted: m })

      const seriesId = selected.id
      const seriesTitle = cleanText(selected.title || 'بدون عنوان')
      const posterUrl = selected.poster?.medium || selected.poster?.thumbnail || DEFAULT_IMAGE
      const chapters = await fetchChapters(seriesId)
      await sendChaptersList(conn, m, usedPrefix, seriesTitle, chapters, seriesId, posterUrl)
      return
    }

    if (action === 'chapter') {
      const token = parts[1]
      const index = parseInt(parts[2], 10)

      const ctx = getContext(token)
      if (!ctx || ctx.type !== 'chapters') {
        return conn.sendMessage(
          m.chat,
          { text: '❌ انتهت جلسة الفصول، أعد اختيار المانهوا.' },
          { quoted: m }
        )
      }

      const chapterMeta = ctx.chapters[index]
      if (!chapterMeta) {
        return conn.sendMessage(
          m.chat,
          { text: '❌ الفصل غير موجود، أعد المحاولة.' },
          { quoted: m }
        )
      }

      await conn.sendMessage(m.chat, { text: '⏳ جاري تحميل صور الفصل وتجهيز PDF...' }, { quoted: m })

      const chapter = await fetchChapterFull(chapterMeta.id)
      await sendChapterPDF(conn, m.chat, m, {
        chapter,
        seriesTitle: cleanText(ctx.seriesTitle || 'بدون عنوان'),
        usedPrefix
      })
      return
    }

    if (action === 'chapterid') {
      const chapterId = parts[1]
      if (!chapterId) {
        return conn.sendMessage(
          m.chat,
          { text: '❌ رقم الفصل غير صالح.' },
          { quoted: m }
        )
      }

      await conn.sendMessage(m.chat, { text: '⏳ جاري تحميل صور الفصل وتجهيز PDF...' }, { quoted: m })

      const chapter = await fetchChapterFull(chapterId)
      const seriesTitle = cleanText(chapter.serie?.title || 'بدون عنوان')
      await sendChapterPDF(conn, m.chat, m, { chapter, seriesTitle, usedPrefix })
      return
    }

    await conn.sendMessage(m.chat, { text: '⏳ جاري البحث عن المانهوا...' }, { quoted: m })

    const results = await fetchSearchResults(rawInput)
    await sendSearchResults(conn, m, usedPrefix, rawInput, results)
  } catch (e) {
    console.error('manhwa handler error:', e)
    const msg = e?.response?.data?.error || e?.message || 'حدث خطأ غير متوقع'
    await conn.sendMessage(
      m.chat,
      { text: `❌ ${msg}\n\nتأكد من الاسم وحاول مرة أخرى.` },
      { quoted: m }
    )
  }
}

handler.command = /^(مانهوا|manhwa|بحث_مانهوا|فصول_مانهوا)$/i
handler.help = ['مانهوا <اسم>']
handler.tags = ['downloader']

export default handler