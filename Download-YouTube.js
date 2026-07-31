/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: تحميل فيديوهات من اليوتيوب
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { spawn } from 'child_process'
import { pipeline } from 'stream/promises'

const NEW_API_BASE = 'https://engez.a7a.online/api/v1/download/ytdl'
const OLD_API_BASE = 'https://engez.a7a.online/api/v1/download/youtube'
const SELECT_SEPARATOR = '|'

const DOWNLOAD_TIMEOUT_MS = 120 * 1000
const TITLE_TIMEOUT_MS = 8 * 1000

const VIDEO_QUALITIES = ['144', '240', '360', '480', '720', '1080']
const AUDIO_QUALITIES = ['128', '320']

function addProtocol(url) {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

function extractTargetUrl(input) {
  try {
    const normalized = addProtocol(input)
    const parsed = new URL(normalized)
    const host = parsed.hostname.replace(/^www\./i, '').replace(/^m\./i, '')

    if (host === 'engez.a7a.online' && (parsed.pathname.includes('/api/v1/download/youtube') || parsed.pathname.includes('/api/v1/download/ytdl'))) {
      const innerUrl = parsed.searchParams.get('url')
      if (innerUrl) return decodeURIComponent(innerUrl)
    }
  } catch {}

  return input
}

function isYouTubeUrl(input) {
  try {
    const normalized = addProtocol(input)
    const parsed = new URL(normalized)
    const host = parsed.hostname.replace(/^www\./i, '').replace(/^m\./i, '')

    return (
      host === 'youtu.be' ||
      host === 'youtube.com' ||
      host.endsWith('.youtube.com')
    )
  } catch {
    return false
  }
}

function buildNewApiUrl(url, type, quality) {
  const params = new URLSearchParams({ url })
  if (type) params.set('type', type)
  if (quality) params.set('quality', quality)
  return `${NEW_API_BASE}?${params.toString()}`
}

function buildOldApiUrl(url, type, quality) {
  const params = new URLSearchParams({ url })
  if (type) params.set('type', type)
  if (quality) params.set('quality', quality)
  return `${OLD_API_BASE}?${params.toString()}`
}

async function fetchTitleSafely(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const { data } = await axios.get(oembedUrl, { timeout: TITLE_TIMEOUT_MS })
    return data?.title || null
  } catch (e) {
    return null
  }
}

async function fetchFromNewApi(url, type, quality) {
  const { data } = await axios.get(buildNewApiUrl(url, type, quality), {
    timeout: DOWNLOAD_TIMEOUT_MS
  })

  if (!data || data.success !== true || !data.response) {
    throw new Error(data?.error || 'تعذر تحميل هذا الاختيار من المصدر الرئيسي')
  }

  const r = data.response
  return {
    title: r.title || null,
    thumbnail: r.thumbnail || null,
    download_url: r.download_url,
    type: r.type === 'audio' ? 'audio' : 'mp4',
    requested_quality: r.requested_quality || quality || null,
    file_size_bytes: r.file_size_bytes || null,
    source_used: 'سيرفر رئيسي'
  }
}

async function fetchFromOldApi(url, type, quality) {
  const { data } = await axios.get(buildOldApiUrl(url, type, quality), {
    timeout: DOWNLOAD_TIMEOUT_MS
  })

  if (!data || data.success !== true) {
    throw new Error(data?.error || 'تعذر تحميل هذا الاختيار من المصدر الاحتياطي')
  }

  const d = data.data
  return {
    title: d.title || null,
    thumbnail: d.thumbnail || null,
    download_url: d.download_url,
    type: d.type === 'mp3' || d.type === 'audio' ? 'audio' : 'mp4',
    requested_quality: d.requested_quality || quality || null,
    file_size_bytes: d.file_size_bytes || null,
    source_used: 'سيرفر احتياطي',
    is_fallback: true
  }
}

async function fetchDownload(url, type, quality) {
  try {
    return await fetchFromNewApi(url, type, quality)
  } catch (e) {
    console.error('[YTDL] السيرفر الرئيسي فشل، جاري المحاولة من السيرفر الاحتياطي:', e?.message || e)
    return await fetchFromOldApi(url, type, quality)
  }
}

async function downloadToFile(fileUrl, filePath) {
  const response = await axios.get(fileUrl, {
    responseType: 'stream',
    timeout: 120000,
    maxRedirects: 5,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  })

  await pipeline(response.data, createWriteStream(filePath))
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''

    ff.stderr.on('data', (chunk) => {
      err += chunk.toString()
    })

    ff.on('error', reject)

    ff.on('close', (code) => {
      if (code === 0) return resolve()
      reject(new Error(`ffmpeg exited with code ${code}\n${err}`))
    })
  })
}

async function repairVideoWithFfmpeg(inputPath, outputPath) {
  try {
    await runFfmpeg([
      '-y',
      '-i', inputPath,
      '-fflags', '+genpts',
      '-movflags', '+faststart',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-pix_fmt', 'yuv420p',
      outputPath
    ])
    return outputPath
  } catch (e) {
    try {
      await runFfmpeg(['-y', '-i', inputPath, '-c', 'copy', '-movflags', '+faststart', outputPath])
      return outputPath
    } catch (err) {
      throw e
    }
  }
}

async function convertAudioWithFfmpeg(inputPath, outputPath) {
  try {
    await runFfmpeg(['-y', '-i', inputPath, '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', outputPath])
    return outputPath
  } catch (e) {
    try {
      await runFfmpeg(['-y', '-i', inputPath, '-vn', '-c:a', 'aac', '-b:a', '128k', outputPath])
      return outputPath
    } catch (err) {
      throw e
    }
  }
}

async function prepareMediaFile(payload) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ytdl-'))
  const id = crypto.randomBytes(6).toString('hex')

  const srcPath = path.join(tmpDir, `source-${id}.bin`)
  const videoPath = path.join(tmpDir, `video-${id}.mp4`)
  const audioPath = path.join(tmpDir, `audio-${id}.mp3`)

  await downloadToFile(payload.download_url, srcPath)

  if (payload.type === 'mp4') {
    try {
      await repairVideoWithFfmpeg(srcPath, videoPath)
      return { filePath: videoPath, tmpDir, mimetype: 'video/mp4' }
    } catch (e) {
      console.error('[YTDL] Ffmpeg failed or not found, using raw video buffer')
      return { filePath: srcPath, tmpDir, mimetype: 'video/mp4' }
    }
  }

  try {
    await convertAudioWithFfmpeg(srcPath, audioPath)
    return { filePath: audioPath, tmpDir, mimetype: 'audio/mpeg' }
  } catch (e) {
    console.error('[YTDL] Ffmpeg failed or not found, using raw audio buffer')
    return { filePath: srcPath, tmpDir, mimetype: 'audio/mpeg' }
  }
}

async function sendDownloadedMedia(conn, chat, payload, quoted) {
  const isVideo = payload.type === 'mp4'
  const fallbackNote = payload.is_fallback ? '\n💡 *ملاحظة:* تم استخدام السيرفر الاحتياطي' : ''
  const title = payload.title || 'فيديو يوتيوب'

  let prepared
  try {
    prepared = await prepareMediaFile(payload)
    const buffer = await fs.readFile(prepared.filePath)

    if (isVideo) {
      await conn.sendMessage(
        chat,
        {
          video: buffer,
          mimetype: 'video/mp4',
          caption: `🎬 *${title}*\n\n📌 *الجودة:* ${payload.requested_quality || 'تلقائية'}\n🌐 *المصدر:* ${payload.source_used}${fallbackNote}`
        },
        { quoted }
      )
    } else {
      await conn.sendMessage(
        chat,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          ptt: false
        },
        { quoted }
      )

      await conn.sendMessage(
        chat,
        {
          text: `🎵 *${title}*\n\n📌 *الجودة:* ${payload.requested_quality || 'تلقائية'}\n🌐 *المصدر:* ${payload.source_used}${fallbackNote}`
        },
        { quoted }
      )
    }
  } catch (e) {
    console.error('sendDownloadedMedia error:', e)
    await conn.sendMessage(
      chat,
      { text: `❌ فشل تحميل وتجهيز الملف.\n\nالسبب: ${e?.message || 'خطأ غير معروف'}` },
      { quoted }
    )
  } finally {
    if (prepared?.tmpDir) {
      await fs.rm(prepared.tmpDir, { recursive: true, force: true }).catch(() => {})
    }
  }
}

async function sendQualityList(conn, chat, quoted, usedPrefix, command, url, title) {
  const titleLine = title ? `\n\n📌 *العنوان:* ${title}` : ''

  const quickRow = [
    {
      title: '⚡ تحميل سريع (تلقائي)',
      description: 'اختيار أسرع جودة ومصدر متاح فوراً',
      id: `${usedPrefix}${command} ${url}${SELECT_SEPARATOR}auto${SELECT_SEPARATOR}auto`
    }
  ]

  const videoRows = VIDEO_QUALITIES.map((q) => ({
    title: `🎬 فيديو ${q}p`,
    description: `تحميل الفيديو بجودة ${q}p`,
    id: `${usedPrefix}${command} ${url}${SELECT_SEPARATOR}video${SELECT_SEPARATOR}${q}`
  }))

  const audioRows = AUDIO_QUALITIES.map((q) => ({
    title: `🎵 صوت ${q}kbps`,
    description: `تحميل مقطع الصوت بجودة ${q}kbps`,
    id: `${usedPrefix}${command} ${url}${SELECT_SEPARATOR}audio${SELECT_SEPARATOR}${q}`
  }))

  const interactiveMessage = {
    body: { text: `اختر جودة ونوع التحميل المناسب لـ يوتيوب:${titleLine}` },
    footer: { text: '© SHANKS BOT' },
    header: { title: '⟬ 𝙎𝙃𝘼𝙉𝙆𝙎 ⫷⌬⫸ 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 ⟭', hasMediaAttachment: false },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'قائمة الجودات 📥',
            sections: [
              { title: 'تحميل سريع', rows: quickRow },
              { title: 'جودات الفيديو', rows: videoRows },
              { title: 'جودات الصوت', rows: audioRows }
            ]
          })
        }
      ]
    }
  }

  try {
    const msg = generateWAMessageFromContent(chat, { interactiveMessage }, { quoted })
    await conn.relayMessage(chat, msg.message, {
      messageId: msg.key.id,
      additionalNodes: [
        {
          tag: 'biz',
          attrs: {},
          content: [
            {
              tag: 'interactive',
              attrs: { type: 'native_flow', v: '1' },
              content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
            }
          ]
        }
      ]
    })
  } catch (err) {
    // Fallback في حالة فشل القائمة التفاعلية: البدء في التحميل التلقائي مباشر
    await conn.sendMessage(chat, { text: '⏳ جاري التحميل التلقائي بأعلى جودة...' }, { quoted })
    const payload = await fetchDownload(url, null, null)
    await sendDownloadedMedia(conn, chat, payload, quoted)
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const rawInput = args.join(' ').trim()

  if (!rawInput) {
    return conn.sendMessage(
      m.chat,
      {
        text: `📥 *تحميل من يوتيوب*\n\n📌 *الاستخدام:*\n${usedPrefix}${command} <رابط يوتيوب>\n\n📌 *مثال:*\n${usedPrefix}${command} https://www.youtube.com/watch?v=xxxx`
      },
      { quoted: m }
    )
  }

  const selectedInput = extractTargetUrl(rawInput)
  const parts = selectedInput.split(SELECT_SEPARATOR)
  const isSelection = parts.length === 3

  const url = isSelection ? parts[0].trim() : selectedInput
  const selectedType = isSelection ? parts[1].trim() : null
  const selectedQuality = isSelection ? parts[2].trim() : null
  const isAuto = selectedType === 'auto'

  if (!isYouTubeUrl(url)) {
    return conn.sendMessage(
      m.chat,
      { text: '❌ الرابط المدخل ليس رابط يوتيوب صحيح.' },
      { quoted: m }
    )
  }

  try {
    if (isSelection) {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

      const payload = await fetchDownload(url, isAuto ? null : selectedType, isAuto ? null : selectedQuality)
      await sendDownloadedMedia(conn, m.chat, payload, m)

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    const title = await fetchTitleSafely(url)
    await sendQualityList(conn, m.chat, m, usedPrefix, command, url, title)
  } catch (e) {
    console.error('[YTDL Handler Error]:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(
      m.chat,
      { text: `❌ حدث خطأ أثناء جلب البيانات:\n${e?.message || 'خطأ غير معروف'}` },
      { quoted: m }
    )
  }
}

handler.command = /^(يوتيوب|ytdl|يوت|yt)$/i
handler.help = ['يوتيوب <رابط>']
handler.tags = ['downloader']

export default handler