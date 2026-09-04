اول حاجه ضيف ده داخل ملف plugins بي اسم اي حاجه مش هتفرق الي انت عايزو 



/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/

'use strict';

import { randomUUID } from 'crypto';
import yts from 'yt-search';
import YTMusic from 'ytmusic-api';
import { FFMPEG_CONFIG } from '../lib/config.js';
import { getLRCLyrics, parseSyncedLyrics, plainLyricsToSynced } from '../lib/lrclib.js';
import { savetubeRetry } from '../lib/savetube.js';
import { downloadAudioBuffer, compressAudio } from '../lib/ffmpeg.js';
import { getThumb, createHighQualityThumbnail, createMusicPlayer } from '../lib/player.js';

let ytMusicInstance = null;
async function getYTMusic() {
  if (!ytMusicInstance) {
    ytMusicInstance = new YTMusic();
    await ytMusicInstance.initialize();
  }
  return ytMusicInstance;
}

function secondsFromTimestamp(timestamp = '') {
  const parts = String(timestamp).split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatDuration(seconds = 0) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

async function sendMusicPlayer(conn, m, html) {
  const responseId = randomUUID();
  await conn.relayMessage(m.chat, {
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, botMetadata: { botResponseId: responseId } },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [{ messageType: 2, messageText: 'Music Player' }],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              response_id: responseId,
              sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload: html, trusted_sources: [] }, __typename: 'GenAISingleLayoutViewModel' } }]
            })).toString('base64')
          },
          contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 }
        }
      }
    }
  }, { messageId: responseId });
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} chase atlantic`;
  
  await m.react('🎧');
  
  try {
    let ytUrl = text.trim();
    let title = 'Unknown', artist = 'Unknown Artist', duration = '0:00', durationSec = 0, thumbUrl = '', trackIdForLyrics = null, album = '';

    if (!/youtube\.com|youtu\.be/i.test(text)) {
      const ytm = await getYTMusic();
      const songs = await ytm.search(text);
      const track = songs.find(s => s.type === 'SONG') || songs[0];
      if (!track || !track.videoId) throw new Error('Lagu tidak ditemukan');
      
      trackIdForLyrics = track.videoId;
      ytUrl = `https://www.youtube.com/watch?v=${track.videoId}`;
      title = track.name || track.title || 'Unknown';
      artist = track.artists?.map(a => a.name).join(', ') || track.artist?.name || 'Unknown Artist';
      durationSec = Number(track.duration || 0);
      duration = formatDuration(durationSec);
      thumbUrl = track.thumbnails?.[track.thumbnails.length - 1]?.url || '';
      album = track.album?.name || '';
    } else {
      const detail = await yts(ytUrl);
      const vid = detail?.videos?.[0];
      if (!vid) throw new Error('Video tidak ditemukan');
      
      title = vid.title || 'Unknown';
      artist = vid.author?.name || 'YouTube';
      duration = vid.timestamp || '0:00';
      durationSec = secondsFromTimestamp(duration);
      thumbUrl = vid.thumbnail;
      const match = ytUrl.match(/(?:v=|shorts\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (match) trackIdForLyrics = match[1];
    }

    let syncedLyrics = [];
    const lrclib = await getLRCLyrics({ title, artist, duration: durationSec, album });
    if (lrclib?.syncedLyrics) syncedLyrics = parseSyncedLyrics(lrclib.syncedLyrics);

    if (!syncedLyrics.length && trackIdForLyrics) {
      try {
        const ytm = await getYTMusic();
        const lyricsData = await ytm.getLyrics(trackIdForLyrics);
        const fallbackLyrics = typeof lyricsData === 'string' ? lyricsData : lyricsData?.lyrics || '';
        if (fallbackLyrics) syncedLyrics = parseSyncedLyrics(fallbackLyrics) || plainLyricsToSynced(fallbackLyrics);
      } catch {}
    }

    const thumb = await getThumb(thumbUrl);
    await createHighQualityThumbnail(conn, thumb);
    const imageSrc = thumb?.length ? `data:image/jpeg;base64,${thumb.toString('base64')}` : '';

    const audio = await savetubeRetry(ytUrl, { downloadType: 'audio', quality: '128kbps' });
    if (!audio?.url) throw new Error('URL audio tidak tersedia');

    const originalBuffer = await downloadAudioBuffer(audio.url);
    const compressedBuffer = await compressAudio(originalBuffer);
    const audioSrc = `data:audio/ogg;base64,${compressedBuffer.toString('base64')}`;

    const html = createMusicPlayer({ title, artist, duration, audioSrc, imageSrc, lyrics: syncedLyrics });
    await sendMusicPlayer(conn, m, html);
    await m.react('✅');

  } catch (error) {
    console.error('[PLAY2 ERROR]', error);
    await m.react('❌');
    await conn.sendMessage(m.chat, { text: `❌ Gagal memproses lagu.\n\n> ${error?.message || 'Unknown error'}` }, { quoted: m });
  }
};

handler.help = ['play2'];
handler.tags = ['downloader'];
handler.command = /^play2$/i;
handler.limit = true;

export default handler;


تاني ملف هتعمل ملف داخل lib/
و هتسميه ffmpeg.js لازم لازم الاسم ده 

/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import { spawn } from 'child_process';
import { FFMPEG_CONFIG, LIMITS } from './config.js';

export async function downloadAudioBuffer(url) {
  if (!url) throw new Error('URL audio kosong');
  
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Download audio gagal (${res.status})`);

  const contentLength = Number(res.headers.get('content-length') || 0);
  if (contentLength > LIMITS.maxOriginalAudioSize) throw new Error('Audio terlalu besar');

  const buffer = Buffer.from(await res.arrayBuffer());
  if (!buffer.length || buffer.length > LIMITS.maxOriginalAudioSize) throw new Error('Buffer audio bermasalah');

  return buffer;
}

export async function compressAudio(inputBuffer) {
  if (!Buffer.isBuffer(inputBuffer) || !inputBuffer.length) throw new Error('Input buffer kosong');

  return new Promise((resolve, reject) => {
    let ffmpeg;
    try {
      ffmpeg = spawn('ffmpeg', [
        '-hide_banner', '-loglevel', 'error',
        '-i', 'pipe:0', '-vn',
        '-c:a', FFMPEG_CONFIG.codec,
        '-b:a', FFMPEG_CONFIG.bitrate,
        '-ar', FFMPEG_CONFIG.sampleRate,
        '-ac', FFMPEG_CONFIG.channels,
        '-application', 'audio',
        '-f', FFMPEG_CONFIG.format,
        'pipe:1'
      ], { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (error) {
      return reject(error);
    }

    const chunks = [];
    const errors = [];
    let outputSize = 0;
    let finished = false;

    const fail = (error) => {
      if (finished) return;
      finished = true;
      try { ffmpeg.kill('SIGKILL'); } catch {}
      reject(error);
    };

    ffmpeg.stdout.on('data', chunk => {
      outputSize += chunk.length;
      if (outputSize > LIMITS.maxCompressedAudioSize) return fail(new Error('Audio compress terlalu besar'));
      chunks.push(chunk);
    });

    ffmpeg.stderr.on('data', chunk => errors.push(chunk.toString()));
    ffmpeg.on('error', error => fail(error?.code === 'ENOENT' ? new Error('FFmpeg tidak ditemukan.') : error));

    ffmpeg.on('close', code => {
      if (finished) return;
      if (code !== 0) return fail(new Error(`FFmpeg gagal (${code}): ${errors.join('').trim()}`));
      const output = Buffer.concat(chunks);
      if (!output.length) return fail(new Error('FFmpeg menghasilkan audio kosong'));
      
      finished = true;
      resolve(output);
    });

    ffmpeg.stdin.on('error', error => {
      if (error?.code !== 'EPIPE') fail(error);
    });

    ffmpeg.stdin.end(inputBuffer);
  });
}



تالت ملف برضو داخل lib/
لازم تسميه savetube.js عشان المسارات متجيش تقول لي مش شغال 

/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import { createDecipheriv } from 'crypto';
import { METADATA_DECRYPTION_KEY, HEADERS } from './config.js';

export async function savetube(url, { downloadType = 'audio', quality = '128kbps' } = {}) {
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
  if (!idMatch) throw new Error('URL YouTube tidak valid');
  const videoId = idMatch[1];

  const cdnRes = await fetch('https://media.savetube.vip/api/random-cdn', { headers: HEADERS })
    .then(v => v.json())
    .catch(() => null);
    
  if (!cdnRes?.cdn) throw new Error('CDN tidak tersedia');
  const cdn = cdnRes.cdn;

  const info = await fetch(`https://${cdn}/v2/info`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` })
  }).then(v => v.json()).catch(() => null);

  if (!info?.data) throw new Error('Metadata kosong');

  let metadata;
  try {
    const encrypted = Buffer.from(info.data, 'base64');
    const decipher = createDecipheriv('aes-128-cbc', METADATA_DECRYPTION_KEY, encrypted.subarray(0, 16));
    const decrypted = Buffer.concat([decipher.update(encrypted.subarray(16)), decipher.final()]);
    metadata = JSON.parse(decrypted.toString('utf8'));
  } catch {
    throw new Error('Decrypt metadata gagal');
  }

  if (!metadata?.key) throw new Error('Key download tidak ditemukan');

  const dl = await fetch(`https://${cdn}/download`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ id: videoId, downloadType, quality, key: metadata.key })
  }).then(v => v.json()).catch(() => null);

  if (!dl?.data?.downloadUrl) throw new Error(dl?.message || 'Download gagal');

  return {
    title: metadata.title,
    duration: metadata.durationLabel,
    thumbnail: metadata.thumbnail,
    url: dl.data.downloadUrl
  };
}

export async function savetubeRetry(url, opts, retry = 3) {
  let lastErr;
  for (let i = 0; i < retry; i++) {
    try {
      return await savetube(url, opts);
    } catch (e) {
      lastErr = e;
      if (i < retry - 1) await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw lastErr;
}


رابع ملف برضو داخل lib/ 
و طبعا طبعا لازم تسميه lrclib.js و هتحط فيه ذا 

/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import { LRCLIB_CONFIG } from './config.js';

export async function getLRCLyrics({ title, artist, duration = 0, album = '' }) {
  try {
    if (!title || !artist) return null;

    const params = new URLSearchParams();
    params.set('track_name', title);
    params.set('artist_name', artist);
    if (album) params.set('album_name', album);

    if (Number.isFinite(Number(duration)) && Number(duration) >= 1 && Number(duration) <= 3600) {
      params.set('duration', Math.round(Number(duration)));
    }

    const url = `${LRCLIB_CONFIG.api}/get?${params.toString()}`;
    console.log('[LRCLIB] Request:', url);

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': LRCLIB_CONFIG.userAgent
      }
    });

    if (res.status === 404 || res.status === 429 || !res.ok) return null;

    const data = await res.json();
    return data ? {
      id: data.id || null,
      trackName: data.trackName || title,
      artistName: data.artistName || artist,
      albumName: data.albumName || '',
      duration: Number(data.duration || duration || 0),
      instrumental: Boolean(data.instrumental),
      plainLyrics: data.plainLyrics || '',
      syncedLyrics: data.syncedLyrics || ''
    } : null;
  } catch (error) {
    console.log('[LRCLIB ERROR]', error?.message || error);
    return null;
  }
}

export function parseSyncedLyrics(lrc = '') {
  if (!lrc || typeof lrc !== 'string') return [];

  const result = [];
  const lines = lrc.split(/\r?\n/);

  for (const rawLine of lines) {
    const matches = [...rawLine.matchAll(/\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
    if (!matches.length) continue;

    const text = rawLine.replace(/\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g, '').trim();

    for (const match of matches) {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      let fraction = Number(match[3] || 0);

      if (String(match[3] || '').length === 1) fraction *= 100;
      else if (String(match[3] || '').length === 2) fraction *= 10;

      const time = minutes * 60 + seconds + fraction / 1000;
      result.push({ time, text });
    }
  }

  result.sort((a, b) => a.time - b.time);
  const cleaned = [];
  for (const item of result) {
    const last = cleaned[cleaned.length - 1];
    if (last && Math.abs(last.time - item.time) < 0.001 && last.text === item.text) continue;
    cleaned.push(item);
  }

  return cleaned;
}

export function plainLyricsToSynced(lyrics = '') {
  if (!lyrics) return [];
  return lyrics.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map((text, index) => ({ time: index * 5, text }));
}



خامس ملف برضو داخل lib/ و لازم تسميه config.js و ده اخر ملف الحمد لله 

هتحط فيه ده 


/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import { Buffer } from 'buffer';

export const METADATA_DECRYPTION_KEY = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');

export const HEADERS = {
  'Content-Type': 'application/json',
  'Origin': 'https://yt.savetube.me',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'
};

export const FFMPEG_CONFIG = {
  bitrate: '16k',
  sampleRate: '24000',
  channels: '1',
  codec: 'libopus',
  format: 'ogg'
};

export const LIMITS = {
  maxOriginalAudioMb: 25,
  maxOriginalAudioSize: 25 * 1024 * 1024,
  maxCompressedAudioMb: 6,
  maxCompressedAudioSize: 6 * 1024 * 1024
};

export const LRCLIB_CONFIG = {
  api: 'https://lrclib.net/api',
  userAgent: 'AnyaMD-Play2/1.0 (https://github.com/)'
};



نسيت الملف ده و يعتبر أهم واحد 
هتسميه player.js داخل lib/ طبعا

/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
'use strict';

import sharp from 'sharp';

export function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function getThumb(url) {
  try {
    if (!url) return Buffer.alloc(0);
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    
    const raw = Buffer.from(await res.arrayBuffer());
    return await sharp(raw)
      .resize(250, 250, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 50 })
      .toBuffer();
  } catch {
    return Buffer.alloc(0);
  }
}

export async function createHighQualityThumbnail(conn, thumb) {
  return null;
}

export function createMusicPlayer({ title, artist, duration, audioSrc, imageSrc, lyrics }) {
  const safeTitle = escapeHtml(title);
  const safeArtist = escapeHtml(artist);
  const safeDuration = escapeHtml(duration || '0:00');
  const safeImage = imageSrc || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMGQxmatePC9zdmc+';
  const lyricsJson = Buffer.from(JSON.stringify(lyrics || []), 'utf8').toString('base64');

  return `
<style>
  :root { --ink: #ffffff; --muted: #b9b1b6; --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { background: transparent; color: var(--ink); font-family: var(--sys); min-height: 100vh; }
  .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px 12px; }
  .player { position: relative; width: 100%; max-width: 330px; border-radius: 18px; overflow: hidden; background: #1a0d12; box-shadow: 0 18px 40px rgba(0,0,0,.5); }
  .bg { position: absolute; inset: -30%; width: 160%; height: 160%; object-fit: cover; filter: blur(38px) saturate(1.5); opacity: .85; z-index: 0; }
  .veil { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(20,8,12,.55) 0%, rgba(20,8,12,.72) 45%, rgba(12,5,8,.94) 100%); }
  .content { position: relative; z-index: 2; padding: 16px 18px 20px; }
  .lyrics-panel { position: absolute; inset: 0; z-index: 10; background: rgba(12,5,8,.96); backdrop-filter: blur(18px); display: flex; flex-direction: column; padding: 20px; transform: translateY(100%); transition: transform .35s cubic-bezier(.4,0,.2,1); }
  .lyrics-panel.is-open { transform: translateY(0); }
  .lyrics-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-weight: 600; font-size: 14px; letter-spacing: 1px; }
  .lyrics-status { font-size: 9px; color: var(--muted); margin-top: 4px; }
  .lyrics-close { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; }
  .lyrics-text { flex: 1; overflow-y: auto; font-size: 15px; line-height: 1.35; text-align: center; padding: 35vh 5px 35vh; scroll-behavior: smooth; }
  .lyric-line { display: block; color: rgba(255,255,255,.32); font-size: 15px; font-weight: 500; line-height: 1.5; padding: 7px 4px; margin: 2px 0; opacity: .65; transition: all .25s ease; }
  .lyric-line.is-past { color: rgba(255,255,255,.55); opacity: .72; }
  .lyric-line.is-active { color: #ffffff; opacity: 1; transform: scale(1.06); font-weight: 700; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
  .head__mid { text-align: center; flex: 1; min-width: 0; }
  .head__from { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .head__album { font-size: 12px; font-weight: 600; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .poster { width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: rgba(255,255,255,.06); box-shadow: 0 12px 26px rgba(0,0,0,.45); margin-bottom: 18px; }
  .poster img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .info { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
  .info__title { font-size: 17px; font-weight: 600; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .info__artist { font-size: 12px; color: var(--muted); margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .info__heart { width: 34px; height: 34px; background: none; border: none; color: var(--muted); cursor: pointer; }
  .info__heart.is-on { color: #ff5c8a; }
  .bar { position: relative; height: 6px; border-radius: 4px; background: rgba(255,255,255,.22); cursor: pointer; margin-bottom: 7px; padding: 4px 0; }
  .bar-inner { position: relative; width: 100%; height: 100%; background: rgba(255,255,255,.22); border-radius: 4px; }
  .bar__fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 4px; background: #fff; }
  .bar__dot { position: absolute; top: 50%; left: 0; width: 11px; height: 11px; border-radius: 50%; background: #fff; transform: translate(-50%,-50%); }
  .time { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 14px; }
  .controls { display: flex; align-items: center; justify-content: space-between; }
  .ctrl { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: var(--ink); background: none; border: none; cursor: pointer; }
  .ctrl.is-off { opacity: .32; cursor: default; }
  .play { width: 56px; height: 56px; border-radius: 50%; background: #fff; color: #12070b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0,0,0,.4); }
  .note { margin-top: 14px; text-align: center; font-size: 10px; color: var(--muted); }
</style>

<div class="wrap">
  <div class="player">
    <img class="bg" src="${safeImage}" alt="">
    <div class="veil"></div>
    <div class="lyrics-panel" id="lyrics-panel">
      <div class="lyrics-head">
        <div><div>LYRICS</div><div class="lyrics-status" id="lyrics-status">Synced lyrics</div></div>
        <div class="lyrics-close" id="btn-close-lyrics">✕</div>
      </div>
      <div class="lyrics-text" id="lyrics-text"></div>
    </div>
    <div class="content">
      <div class="head">
        <div class="head__mid"><div class="head__from">YT Music Audio</div><div class="head__album">${safeArtist}</div></div>
      </div>
      <div class="poster"><img src="${safeImage}" alt="${safeTitle}"></div>
      <div class="info">
        <div class="info__names"><div class="info__title">${safeTitle}</div><div class="info__artist">${safeArtist}</div></div>
        <button class="info__heart" id="heart">♥</button>
      </div>
      <div class="bar" id="bar">
        <div class="bar-inner">
          <div class="bar__fill" id="fill"></div>
          <div class="bar__dot" id="dot"></div>
        </div>
      </div>
      <div class="time"><span id="cur">0:00</span><span id="dur">${safeDuration}</span></div>
      <div class="controls">
        <button class="ctrl" id="btn-lyrics">🎤</button>
        <button class="ctrl is-off" disabled>⏮</button>
        <button class="play" id="play"><span id="icon-play">▶</span><span id="icon-pause" style="display:none">⏸</span></button>
        <button class="ctrl is-off" disabled>⏭</button>
        <button class="ctrl is-off" disabled>🔁</button>
      </div>
      <div class="note">𝙎𝙃𝘼𝙉𝙆𝙎</div>
    </div>
  </div>
</div>
<audio id="audio" preload="metadata" src="${audioSrc}"></audio>
<script>
(function() {
  const audio = document.getElementById('audio'), play = document.getElementById('play'), bar = document.getElementById('bar'), fill = document.getElementById('fill'), dot = document.getElementById('dot'), cur = document.getElementById('cur'), dur = document.getElementById('dur'), heart = document.getElementById('heart'), iconPlay = document.getElementById('icon-play'), iconPause = document.getElementById('icon-pause'), btnLyrics = document.getElementById('btn-lyrics'), btnCloseLyrics = document.getElementById('btn-close-lyrics'), lyricsPanel = document.getElementById('lyrics-panel'), lyricsText = document.getElementById('lyrics-text');
  let lyrics = [];
  try { lyrics = JSON.parse(decodeURIComponent(escape(atob('${lyricsJson}')))); } catch(e) {}
  let lyricElements = [], activeIndex = -1;
  let autoOpenTriggered = false;
  
  function renderLyrics() {
    lyricsText.innerHTML = '';
    if (!lyrics.length) { lyricsText.innerHTML = 'Lirik tidak tersedia'; return; }
    const frag = document.createDocumentFragment();
    lyrics.forEach((l, i) => {
      const el = document.createElement('div');
      el.className = 'lyric-line'; el.textContent = l.text || '♪';
      frag.appendChild(el); lyricElements.push(el);
    });
    lyricsText.appendChild(frag);
  }
  renderLyrics();

  function updateLyrics(time) {
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) { if (time >= Number(lyrics[i].time || 0)) idx = i; else break; }
    
    if (idx !== -1 && !autoOpenTriggered && lyrics.length > 0) {
      autoOpenTriggered = true;
      lyricsPanel.classList.add('is-open');
    }

    if (idx === -1 || idx === activeIndex) return;
    activeIndex = idx;
    lyricElements.forEach((el, i) => { el.classList.toggle('is-active', i === idx); el.classList.toggle('is-past', i < idx); });
    if (lyricElements[idx]) lyricElements[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  btnLyrics.onclick = () => lyricsPanel.classList.add('is-open');
  btnCloseLyrics.onclick = () => lyricsPanel.classList.remove('is-open');
  heart.onclick = () => heart.classList.toggle('is-on');
  
  play.onclick = async () => {
    if (audio.paused) { await audio.play(); iconPlay.style.display = 'none'; iconPause.style.display = 'block'; }
    else { audio.pause(); iconPlay.style.display = 'block'; iconPause.style.display = 'none'; }
  };

  bar.onclick = (e) => {
    if (!audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pos * audio.duration;
  };

  audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const p = (audio.currentTime / audio.duration) * 100;
    fill.style.width = p + '%'; dot.style.left = p + '%';
    const m = Math.floor(audio.currentTime / 60), s = Math.floor(audio.currentTime % 60);
    cur.textContent = m + ':' + String(s).padStart(2, '0');
    updateLyrics(audio.currentTime);
  };

  audio.onloadedmetadata = () => {
    const m = Math.floor(audio.duration / 60), s = Math.floor(audio.duration % 60);
    dur.textContent = m + ':' + String(s).padStart(2, '0');
  };
})();
</script>
`;
}

و بعد كده اعمل أمر .افحصهم و شوف المكاتب الناقصه و حملها و اعمل ريستارت و مبروك عليك 


▛▀▀〔  𝚃𝚀𝙳𝚁 𝚃𝚉𝚆𝚁 𝚁𝙴𝙿𝙾 𝙱𝙰𝚀𝚈 𝙰𝙻 𝙰𝙺𝚆𝙰𝙳 〕▀▀▜
تقدر دلوقتي تزور ريبو باقي الاكواد عشان تستفاد
https://github.com/SHANKS-CODE-1/CODE

▛▀▀〔  𝚃𝚀𝙳𝚁 𝚃𝚉𝚆𝚁 𝚀𝙽𝙰𝚃 𝙰𝙻 𝚆𝙰𝚃𝚂𝙰𝙱 〕▀▀▜
تقدر تزور قناة الوتساب عشان تستفاد من الشرح
https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y


ادعيلي عشان بتعب عشانكم 