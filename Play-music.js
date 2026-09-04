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


و بعد كده اعمل أمر .افحصهم و شوف المكاتب الناقصه و حملها و اعمل ريستارت و مبروك عليك 


▛▀▀〔  𝚃𝚀𝙳𝚁 𝚃𝚉𝚆𝚁 𝚁𝙴𝙿𝙾 𝙱𝙰𝚀𝚈 𝙰𝙻 𝙰𝙺𝚆𝙰𝙳 〕▀▀▜
تقدر دلوقتي تزور ريبو باقي الاكواد عشان تستفاد
https://github.com/SHANKS-CODE-1/CODE

▛▀▀〔  𝚃𝚀𝙳𝚁 𝚃𝚉𝚆𝚁 𝚀𝙽𝙰𝚃 𝙰𝙻 𝚆𝙰𝚃𝚂𝙰𝙱 〕▀▀▜
تقدر تزور قناة الوتساب عشان تستفاد من الشرح
https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y


ادعيلي عشان بتعب عشانكم 