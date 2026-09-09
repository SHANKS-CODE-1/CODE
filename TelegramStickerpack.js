/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: جلب حزمه الاستكرات من تلجرام عبر الرابط و تقسيمها الي حزم 60×60
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import crypto from 'crypto';
import https from 'https';
import JSZip from 'jszip';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync, readFileSync, mkdirSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import TGS from 'tgs-to';

const TELEGRAM_TOKEN = '8934387851:AAGNkxRA-4ex3MYnRaThxWlNAdN8Z8862lU';
const TELEGRAM_BOT_USERNAME = '@SHANKS_BOT_sticker_bot';
const TMP_DIR = path.join(process.cwd(), 'tmp');

if (!existsSync(TMP_DIR)) {
    mkdirSync(TMP_DIR, { recursive: true });
}

async function toStaticWebp(buffer) {
    return sharp(buffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp()
        .toBuffer();
}

function toAnimatedWebp(buffer, id) {
    const inputPath = path.join(TMP_DIR, `anim_${id}_${Date.now()}.webm`);
    const outputPath = path.join(TMP_DIR, `anim_${id}_${Date.now()}.webp`);
    try {
        writeFileSync(inputPath, buffer);
        execSync(`ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15" -loop 0 -q:v 80 -preset default -an "${outputPath}"`, { stdio: 'pipe' });
        const result = readFileSync(outputPath);
        return result;
    } catch {
        return null;
    } finally {
        try { if (existsSync(inputPath)) unlinkSync(inputPath); } catch {}
        try { if (existsSync(outputPath)) unlinkSync(outputPath); } catch {}
    }
}

async function toAnimatedWebpFromLottie(buffer, id) {
    const tgsPath = path.join(TMP_DIR, `lottie_${id}_${Date.now()}.tgs`);
    const webpPath = path.join(TMP_DIR, `lottie_${id}_${Date.now()}.webp`);
    try {
        writeFileSync(tgsPath, buffer);

        const tgs = new TGS(tgsPath);
        await tgs.convertToWebp(webpPath);

        const result = readFileSync(webpPath);
        return { buffer: result, error: null };
    } catch (e) {
        console.error('فشل تحويل Lottie:', e);
        return { buffer: null, error: e.message || String(e) };
    } finally {
        try { if (existsSync(tgsPath)) unlinkSync(tgsPath); } catch {}
        try { if (existsSync(webpPath)) unlinkSync(webpPath); } catch {}
    }
}

function sha256(buffer) { 
    return crypto.createHash('sha256').update(buffer).digest(); 
}

function toB64Url(buffer) { 
    return Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); 
}

async function makeTrayWebp(buffer) {
    return await sharp(buffer, { animated: false }).resize(252, 252, { fit: 'cover' }).webp().toBuffer();
}

async function makeThumbnailJpeg(buffer) {
    return await sharp(buffer, { animated: false }).resize(252, 252, { fit: 'cover' }).jpeg().toBuffer();
}

async function uploadToServer(conn, buffer, { hkdf, mediaPath, mediaKey = crypto.randomBytes(32) }) {
    const expanded = Buffer.from(crypto.hkdfSync('sha256', mediaKey, Buffer.alloc(32), Buffer.from(hkdf), 112));
    const iv = expanded.subarray(0, 16);
    const cipherKey = expanded.subarray(16, 48);
    const macKey = expanded.subarray(48, 80);

    const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    const mac = crypto.createHmac('sha256', macKey).update(iv).update(encrypted).digest().subarray(0, 10);
    const encBuffer = Buffer.concat([encrypted, mac]);
    const fileEncSha256 = sha256(encBuffer);

    const iq = await conn.query({
        tag: 'iq',
        attrs: { to: 's.whatsapp.net', type: 'set', xmlns: 'w:m' },
        content: [{ tag: 'media_conn', attrs: {} }],
    });

    const mediaConn = iq.content?.find(v => v.tag === 'media_conn');
    if (!mediaConn) throw new Error('فشل الحصول على اتصال ميديا واتساب');

    const auth = mediaConn.attrs?.auth;
    const hosts = (mediaConn.content || []).filter(v => v.tag === 'host').map(v => v.attrs?.hostname).filter(Boolean);
    if (!hosts.length) throw new Error('لم يتم العثور على خوادم للرفع');

    const token = encodeURIComponent(fileEncSha256.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''));

    for (const host of hosts) {
        try {
            const json = await new Promise((resolve, reject) => {
                const url = new URL(`https://${host}${mediaPath}/${token}?auth=${encodeURIComponent(auth)}&token=${token}`);
                const req = https.request({
                    hostname: url.hostname,
                    port: 443,
                    path: url.pathname + url.search,
                    method: 'POST',
                    headers: {
                        Origin: 'https://web.whatsapp.com',
                        Referer: 'https://web.whatsapp.com/',
                        'Content-Type': 'application/octet-stream',
                        'Content-Length': encBuffer.length,
                    },
                }, (res) => {
                    let body = '';
                    res.on('data', c => body += c);
                    res.on('end', () => {
                        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error('فشل الرفع'));
                        resolve(JSON.parse(body));
                    });
                });
                req.on('error', reject);
                req.write(encBuffer);
                req.end();
            });

            const directPath = json.direct_path ?? json.directPath ?? json.url ?? json.path;
            if (directPath) return { mediaKey, fileLength: buffer.length, fileSha256: sha256(buffer), fileEncSha256, directPath, ...json };
        } catch {}
    }
    throw new Error('جميع محاولات الرفع للسيرفر فشلت');
}

function normalizeOwnerId(owner) {
    const raw = Array.isArray(owner) ? owner[0] : owner
    return String(raw ?? '').replace(/[^0-9]/g, '')
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const ownerList = Array.isArray(global.owner) ? global.owner : []
        const allowed = [
            ...ownerList
                .map(normalizeOwnerId)
                .filter(Boolean)
                .map(num => num + '@s.whatsapp.net'),
            '96879361317@s.whatsapp.net'
        ];

        if (!allowed.includes(m.sender)) {
            return conn.sendMessage(m.chat, { text: '🦋 ❌ هذا الأمر للمطور فقط.' }, { quoted: m });
        }

        if (!args[0]) {
            return m.reply(`🦋 *يرجى إدخال رابط حزمة تيليجرام.*\n*مثال:* ${usedPrefix + command} https://t.me/addstickers/xxxxx`);
        }

        const url = args[0].trim();
        const packMatch = url.match(/addstickers\/(.+)/);
        if (!packMatch) return m.reply('🦋 ❌ رابط غير صالح.');

        const tgPackName = packMatch[1];
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const { data } = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getStickerSet?name=${tgPackName}`);
        if (!data.ok || !data.result?.stickers) return m.reply('🦋 ❌ حزمة غير موجودة.');

        const stickers = data.result.stickers;
        const totalStickers = stickers.length;
        if (totalStickers === 0) return m.reply('🦋 ❌ لا توجد ملصقات في هذه الحزمة.');

        const packNameBase = data.result.title || '𝙎𝙃𝘼𝙉𝙆𝙎';
        const publisherName = '𝑺𝑯𝑨𝑵𝑲𝑺';
        const chunkSize = 60;
        const totalParts = Math.ceil(totalStickers / chunkSize);

        const statusKey = (await conn.sendMessage(m.chat, {
            text: `🦋 *تم العثور على ${totalStickers} ملصق.*\n📦 سيتم تقسيمها إلى ${totalParts} حزمة (كل ${chunkSize} ملصق). جاري المعالجة...`
        }, { quoted: m })).key;

        const partLines = [];

        const renderStatus = (extra) => {
            const header = `🦋 *تحويل حزمة: ${packNameBase}*\n📦 ${totalStickers} ملصق · ${totalParts} حزمة\n`;
            const body = partLines.join('\n');
            return header + (body ? `\n${body}` : '') + (extra ? `\n\n${extra}` : '');
        };

        const updateStatus = async (extra) => {
            await conn.sendMessage(m.chat, { text: renderStatus(extra), edit: statusKey }).catch(() => {});
        };

        for (let i = 0; i < totalStickers; i += chunkSize) {
            const chunk = stickers.slice(i, i + chunkSize);
            const partNumber = Math.floor(i / chunkSize) + 1;

            const currentPackName = totalParts > 1 ? `${packNameBase} (الجزء ${partNumber})` : packNameBase;

            await updateStatus(`⏳ جاري تجهيز الجزء ${partNumber} من ${totalParts}...`);

            const zip = new JSZip();
            let stickersMetadata = [];
            let skippedLottie = 0;
            let failedOther = 0;
            let firstLottieError = null;

            for (let j = 0; j < chunk.length; j++) {
                const s = chunk[j];

                try {
                    const fileRes = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${s.file_id}`);
                    if (!fileRes.data.ok) { failedOther++; continue; }

                    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileRes.data.result.file_path}`;
                    const imgRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
                    let buffer = Buffer.from(imgRes.data);

                    let stickerBuffer = null;
                    let isAnimated = false;

                    if (s.is_video) {
                        stickerBuffer = toAnimatedWebp(buffer, `${i}_${j}`);
                        if (stickerBuffer) isAnimated = true;
                    } else if (s.is_animated) {
                        const lottieResult = await toAnimatedWebpFromLottie(buffer, `${i}_${j}`);
                        stickerBuffer = lottieResult.buffer;
                        if (stickerBuffer) isAnimated = true;
                        if (!stickerBuffer) {
                            skippedLottie++;
                            if (!firstLottieError) firstLottieError = lottieResult.error;
                            continue;
                        }
                    } else {
                        stickerBuffer = await toStaticWebp(buffer);
                    }

                    if (!stickerBuffer) { failedOther++; continue; }

                    const fileName = `${toB64Url(sha256(stickerBuffer))}.webp`;
                    zip.file(fileName, stickerBuffer);

                    stickersMetadata.push({
                        fileName,
                        isAnimated,
                        emojis: [s.emoji || '✨'],
                        accessibilityLabel: '',
                        isLottie: false,
                        mimetype: 'image/webp',
                    });

                } catch (e) {
                    failedOther++;
                    console.error(`فشل الملصق ${j} في الدفعة ${partNumber}:`, e.message);
                }
            }

            if (stickersMetadata.length === 0) {
                let reason = [];
                if (skippedLottie > 0) reason.push(`${skippedLottie} Lottie فشل`);
                if (failedOther > 0) reason.push(`${failedOther} فشل آخر`);
                let line = `⚠️ الجزء ${partNumber}: فشل بالكامل (${reason.join(' · ') || 'لا صيغ مدعومة'})`;
                if (firstLottieError) line += `\n   ↳ ${firstLottieError}`;
                partLines.push(line);
                await updateStatus();
                continue;
            }

            try {
                let firstStickerBuffer = await zip.file(stickersMetadata[0].fileName).async('nodebuffer');
                let trayBuffer = await makeTrayWebp(firstStickerBuffer);
                zip.file('tray_icon.webp', trayBuffer);

                const archive = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });
                const packUpload = await uploadToServer(conn, archive, {
                    hkdf: 'WhatsApp Sticker Pack Keys',
                    mediaPath: '/mms/sticker-pack',
                });

                const thumbnailBuffer = await makeThumbnailJpeg(trayBuffer);
                const thumbUpload = await uploadToServer(conn, thumbnailBuffer, {
                    hkdf: 'WhatsApp Sticker Pack Thumbnail Keys',
                    mediaPath: '/mms/thumbnail-sticker-pack',
                    mediaKey: packUpload.mediaKey,
                });

                await conn.relayMessage(m.chat, {
                    messageContextInfo: { messageSecret: crypto.randomBytes(32) },
                    stickerPackMessage: {
                        stickerPackId: 'SHANKS_' + crypto.randomBytes(8).toString('hex'),
                        name: currentPackName,
                        publisher: publisherName,
                        packDescription: `حزمة تيليجرام المحولة بواسطة ${TELEGRAM_BOT_USERNAME}`,
                        stickers: stickersMetadata,
                        fileLength: packUpload.fileLength,
                        fileSha256: packUpload.fileSha256,
                        fileEncSha256: packUpload.fileEncSha256,
                        mediaKey: packUpload.mediaKey,
                        directPath: packUpload.directPath,
                        mediaKeyTimestamp: Math.floor(Date.now() / 1000),
                        stickerPackSize: packUpload.fileLength,
                        stickerPackOrigin: 2,
                        trayIconFileName: 'tray_icon.webp',
                        thumbnailDirectPath: thumbUpload.directPath,
                        thumbnailSha256: thumbUpload.fileSha256,
                        thumbnailEncSha256: thumbUpload.fileEncSha256,
                        thumbnailHeight: 252,
                        thumbnailWidth: 252,
                        imageDataHash: thumbUpload.fileSha256.toString('base64'),
                    },
                }, { quoted: m });

                let line = `✅ الجزء ${partNumber}: ${stickersMetadata.length} ملصق`;
                if (skippedLottie > 0) line += ` (تخطي ${skippedLottie} Lottie)`;
                partLines.push(line);
                await updateStatus();

                if (partNumber < totalParts) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

            } catch (err) {
                console.error(`خطأ أثناء رفع حزمة الجزء ${partNumber}:`, err);
                partLines.push(`❌ الجزء ${partNumber}: خطأ أثناء الإرسال`);
                await updateStatus();
            }
        }

        await updateStatus('🏁 *اكتملت المعالجة.*');
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await m.reply(`❄️ ❌ خطأ: ${e.message}`);
    }
};

handler.command = ['حزمة-تيلي', 'حزمه-تيلي'];
handler.tags = ['owner'];
handler.help = ['حزمة-تيلي <رابط>'];

export default handler;