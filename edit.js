/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه:جلب ايديت من التيك توك و اليوتيوب و بنتيرست
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import axios from 'axios';
import sharp from 'sharp';

const API_BASE = 'https://engez.a7a.online/api/v1';
const FOOTER = '𝚂𝙷𝙰𝙽𝙺𝚂🍷 𝙱𝙾𝚃';

const EDIT_IMAGE = 'https://files.catbox.moe/4yvat4.jpg';

const YT_SEARCH = `${API_BASE}/search/youtube`;
const YT_DOWNLOAD_V2 = `${API_BASE}/download/youtubev2`;
const YT_DOWNLOAD_NEW = `${API_BASE}/download/ytdl`;
const YT_DOWNLOAD_OLD = `${API_BASE}/download/youtube`;

function normalizeDownloadUrl(value) {
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();

    if (!trimmed) return null;

    return /^https?:\/\//i.test(trimmed)
        ? trimmed
        : null;
}

function normalizeYtPayload(payload) {
    return {
        title: payload?.title || null,

        download_url: normalizeDownloadUrl(
            payload?.download_url || payload?.downloadUrl
        ),

        type:
            payload?.type === 'audio' ||
            payload?.type === 'mp3'
                ? 'audio'
                : 'mp4',

        source_used:
            payload?.source_used ||
            payload?.source ||
            'unknown',

        is_fallback: Boolean(payload?.is_fallback)
    };
}

async function searchYouTubeFirst(query) {
    const params = new URLSearchParams({
        q: query
    });

    const { data } = await axios.get(
        `${YT_SEARCH}?${params.toString()}`,
        {
            timeout: 30000
        }
    );

    if (!data?.success) {
        throw new Error(
            data?.error ||
            'فشل البحث في يوتيوب'
        );
    }

    const results = data.results || [];

    if (results.length === 0) {
        throw new Error('لا توجد نتائج');
    }

    return results[0];
}

async function fetchYtFromV2(url, type = 'video') {
    const params = new URLSearchParams({
        url,
        type
    });

    const { data } = await axios.get(
        `${YT_DOWNLOAD_V2}?${params.toString()}`,
        {
            timeout: 120000
        }
    );

    if (!data?.success || !data.response) {
        throw new Error(
            data?.error ||
            'تعذر التحميل السريع'
        );
    }

    const r = data.response;

    const payload = normalizeYtPayload({
        title: r.title,

        download_url:
            r.download_url ||
            r.downloadUrl,

        type: r.type,

        source_used:
            r.source ||
            'youtubev2'
    });

    if (!payload.download_url) {
        throw new Error(
            'API لم ترجع رابط تحميل صالح'
        );
    }

    return payload;
}

async function fetchYtFromNewApi(url, type = 'video') {
    const params = new URLSearchParams({
        url,
        type
    });

    const { data } = await axios.get(
        `${YT_DOWNLOAD_NEW}?${params.toString()}`,
        {
            timeout: 120000
        }
    );

    if (!data?.success || !data.response) {
        throw new Error(
            data?.error ||
            'تعذر التحميل من المصدر الرئيسي'
        );
    }

    const r = data.response;

    const payload = normalizeYtPayload({
        title: r.title,

        download_url:
            r.download_url ||
            r.downloadUrl,

        type: r.type,

        source_used:
            r.source ||
            'ytdl'
    });

    if (!payload.download_url) {
        throw new Error(
            'المصدر الرئيسي لم يرجع رابط تحميل صالح'
        );
    }

    return payload;
}

async function fetchYtFromOldApi(url, type = 'video') {
    const params = new URLSearchParams({
        url,
        type
    });

    const { data } = await axios.get(
        `${YT_DOWNLOAD_OLD}?${params.toString()}`,
        {
            timeout: 120000
        }
    );

    if (!data?.success) {
        throw new Error(
            data?.error ||
            'تعذر التحميل من المصدر الاحتياطي'
        );
    }

    const d =
        data.data ||
        data.response ||
        {};

    const payload = normalizeYtPayload({
        title: d.title,

        download_url:
            d.download_url ||
            d.downloadUrl,

        type: d.type,

        source_used:
            d.source ||
            'youtube',

        is_fallback: true
    });

    if (!payload.download_url) {
        throw new Error(
            'المصدر الاحتياطي لم يرجع رابط تحميل صالح'
        );
    }

    return payload;
}

async function fetchYtWithFallback(
    url,
    type = 'video'
) {
    try {
        return await fetchYtFromV2(
            url,
            type
        );
    } catch (e) {
    }

    try {
        return await fetchYtFromNewApi(
            url,
            type
        );
    } catch (e) {
        return await fetchYtFromOldApi(
            url,
            type
        );
    }
}

async function downloadYtBuffer(fileUrl) {
    const safeUrl =
        normalizeDownloadUrl(fileUrl);

    if (!safeUrl) {
        throw new Error(
            'ERR_INVALID_URL'
        );
    }

    const { data } = await axios.get(
        safeUrl,
        {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxRedirects: 5,

            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',

                Accept: '*/*',

                'Accept-Language':
                    'en-US,en;q=0.9'
            }
        }
    );

    return Buffer.from(data);
}

async function runYoutubeEdit(
    m,
    conn,
    input
) {
    await conn.sendMessage(
        m.chat,
        {
            text:
                `🔍 جاري البحث عن: ${input}`
        },
        {
            quoted: m
        }
    );

    const isUrl =
        /(?:youtube\.com|youtu\.be|m\.youtube\.com)/i
            .test(input);

    let videoUrl;
    let displayTitle;

    if (isUrl) {
        videoUrl = input;
    } else {
        const first =
            await searchYouTubeFirst(
                input
            );

        videoUrl =
            `https://youtube.com/watch?v=${first.id}`;

        displayTitle =
            first.title;
    }

    await conn.sendMessage(
        m.chat,
        {
            text: '⏳ جاري التحميل...'
        },
        {
            quoted: m
        }
    );

    const payload =
        await fetchYtWithFallback(
            videoUrl,
            'video'
        );

    const buffer =
        await downloadYtBuffer(
            payload.download_url
        );

    const title =
        displayTitle ||
        payload.title ||
        'بدون عنوان';

    const fallbackNote =
        payload.is_fallback
            ? '\nملحوظة: تم استخدام مصدر بديل'
            : '';

    await conn.sendMessage(
        m.chat,
        {
            video: buffer,

            mimetype:
                'video/mp4',

            caption:
                `🍷 *ايديت 4k من يوتيوب*\n` +
                `العنوان: ${title}\n` +
                `المصدر: ${payload.source_used}` +
                `${fallbackNote}\n\n` +
                `${FOOTER}`
        },
        {
            quoted: m
        }
    );
}

const TT_HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',

    Referer:
        'https://www.tiktok.com/',

    Accept: '*/*',

    'Accept-Encoding':
        'identity;q=1, *;q=0',

    Range:
        'bytes=0-'
};

async function fetchTikTokBuffer(url) {
    try {
        const response =
            await axios.get(
                url,
                {
                    headers:
                        TT_HEADERS,

                    responseType:
                        'arraybuffer',

                    timeout:
                        60000,

                    maxRedirects:
                        5,

                    validateStatus:
                        (status) =>
                            status >= 200 &&
                            status < 400
                }
            );

        const buffer =
            Buffer.from(
                response.data
            );

        if (
            !buffer ||
            buffer.length < 1024
        ) {
            throw new Error(
                'الملف الراجع من CDN فارغ أو تالف'
            );
        }

        return buffer;

    } catch (error) {

        if (error.response) {
            throw new Error(
                `انتهت صلاحية رابط الفيديو أو تم رفضه من تيك توك (${error.response.status})`
            );
        }

        if (
            error.code ===
            'ECONNABORTED'
        ) {
            throw new Error(
                'انتهت مهلة تحميل الفيديو من CDN تيك توك'
            );
        }

        throw new Error(
            `فشل تحميل الفيديو من CDN: ${error.message}`
        );
    }
}

async function searchTikTokFirst(query) {
    const params =
        new URLSearchParams();

    params.append(
        'q',
        query
    );

    params.append(
        'type',
        'videos'
    );

    const { data } =
        await axios.get(
            `${API_BASE}/search/tiktok?${params.toString()}`,
            {
                timeout: 30000
            }
        );

    if (!data?.success) {
        throw new Error(
            data?.error ||
            'فشل البحث في تيك توك'
        );
    }

    const videos =
        data.results ||
        data.videos ||
        [];

    if (
        videos.length === 0
    ) {
        throw new Error(
            'لم يتم العثور على فيديوهات. جرب كلمة بحث مختلفة.'
        );
    }

    return videos[0];
}

async function downloadTikTokInfo(url) {
    const params =
        new URLSearchParams();

    params.append(
        'url',
        url
    );

    const { data } =
        await axios.get(
            `${API_BASE}/download/tiktok?${params.toString()}`,
            {
                timeout: 60000
            }
        );

    if (!data?.success) {
        throw new Error(
            data?.error ||
            'فشل تحميل الفيديو'
        );
    }

    return data;
}

async function runTikTokEdit(
    m,
    conn,
    input
) {
    await conn.sendMessage(
        m.chat,
        {
            text:
                `🔍 جاري البحث عن: ${input}`
        },
        {
            quoted: m
        }
    );

    const isUrl =
        input.includes('tiktok.com') ||
        input.includes('vt.tiktok');

    let videoUrl;
    let desc;
    let author;

    if (isUrl) {

        const info =
            await downloadTikTokInfo(
                input
            );

        videoUrl =
            info.videoUrl;

        desc =
            info.info?.desc;

        author =
            info.author?.nickname ||
            info.info?.author?.username;

    } else {

        const first =
            await searchTikTokFirst(
                input
            );

        videoUrl =
            first.videoUrl;

        desc =
            first.desc;

        author =
            first.author?.nickname;
    }

    if (!videoUrl) {
        throw new Error(
            'تعذر الحصول على رابط الفيديو'
        );
    }

    await conn.sendMessage(
        m.chat,
        {
            text:
                '⏳ جاري التحميل...'
        },
        {
            quoted: m
        }
    );

    const buffer =
        await fetchTikTokBuffer(
            videoUrl
        );

    await conn.sendMessage(
        m.chat,
        {
            video: buffer,

            caption:
                `🖋️ *ايديت من تيك توك*\n` +
                `${
                    desc
                        ? `الوصف: ${desc.slice(0, 100)}\n`
                        : ''
                }` +
                `${
                    author
                        ? `👤 ${author}\n`
                        : ''
                }\n` +
                `${FOOTER}`
        },
        {
            quoted: m
        }
    );
}

const PINTEREST_ENDPOINT =
    `${API_BASE}/search/pinterest`;

const PIN_UA =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/139.0.0.0 Mobile Safari/537.36';

function shuffleArray(a) {
    for (
        let i = a.length - 1;
        i > 0;
        i--
    ) {
        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            a[i],
            a[j]
        ] = [
            a[j],
            a[i]
        ];
    }

    return a;
}

async function searchPins(query) {
    const apiUrl =
        `${PINTEREST_ENDPOINT}?action=` +
        `${encodeURIComponent('بحث')}` +
        `&q=${encodeURIComponent(query)}`;

    const { data } =
        await axios.get(
            apiUrl,
            {
                timeout: 30000
            }
        );

    if (
        !data ||
        data.success !== true
    ) {
        throw new Error(
            'فشل البحث في Pinterest'
        );
    }

    const results =
        data.response?.results;

    if (
        !Array.isArray(results) ||
        results.length === 0
    ) {
        throw new Error(
            'لا توجد نتائج فيديو لهذا البحث'
        );
    }

    return results;
}

async function resolvePinDownloadUrl(
    pin
) {
    const params =
        new URLSearchParams({
            action: 'تحميل',
            pinUrl: pin.pin_url
        });

    if (pin.video_url) {
        params.set(
            'videoUrl',
            pin.video_url
        );
    }

    if (pin.hls_url) {
        params.set(
            'hlsUrl',
            pin.hls_url
        );
    }

    if (pin.video_signature) {
        params.set(
            'videoSignature',
            pin.video_signature
        );
    }

    const apiUrl =
        `${PINTEREST_ENDPOINT}?${params.toString()}`;

    const { data } =
        await axios.get(
            apiUrl,
            {
                timeout: 30000
            }
        );

    if (
        !data ||
        data.success !== true ||
        !data.response?.downloadUrl
    ) {
        throw new Error(
            data?.error ||
            'فشل الحصول على رابط التحميل المباشر'
        );
    }

    return data.response.downloadUrl;
}

async function downloadPinBuffer(
    url
) {
    const res =
        await axios.get(
            url,
            {
                responseType:
                    'arraybuffer',

                headers: {
                    'user-agent':
                        PIN_UA
                },

                timeout:
                    60000,

                maxRedirects:
                    5
            }
        );

    return Buffer.from(
        res.data
    );
}

async function runPinterestEdit(
    m,
    conn,
    input
) {
    await conn.sendMessage(
        m.chat,
        {
            text:
                `🔍 جاري البحث عن: ${input}`
        },
        {
            quoted: m
        }
    );

    const pins =
        shuffleArray(
            await searchPins(input)
        );

    let lastError = null;

    for (
        const pin of pins.slice(0, 10)
    ) {

        try {

            const downloadUrl =
                await resolvePinDownloadUrl(
                    pin
                );

            const buffer =
                await downloadPinBuffer(
                    downloadUrl
                );

            if (
                !buffer ||
                buffer.length < 50000
            ) {
                continue;
            }

            const title =
                (
                    pin.title ||
                    'بدون عنوان'
                ).slice(0, 80);

            await conn.sendMessage(
                m.chat,
                {
                    text:
                        '⏳ جاري التحميل...'
                },
                {
                    quoted: m
                }
            );

            await conn.sendMessage(
                m.chat,
                {
                    video: buffer,

                    mimetype:
                        'video/mp4',

                    caption:
                        `🎨 *ايديت من بينتريست*\n` +
                        `العنوان: ${title}\n\n` +
                        `${FOOTER}`
                },
                {
                    quoted: m
                }
            );

            return;

        } catch (e) {

            lastError = e;
        }
    }

    throw new Error(
        lastError?.message ||
        'لم أتمكن من تحميل أي فيديو، جرب كلمة أخرى.'
    );
}

async function getEditThumbnail() {

    try {

        const response =
            await axios.get(
                EDIT_IMAGE,
                {
                    responseType:
                        'arraybuffer',

                    timeout:
                        30000,

                    maxRedirects:
                        5
                }
            );

        const imageBuffer =
            Buffer.from(
                response.data
            );

        if (
            !imageBuffer ||
            imageBuffer.length === 0
        ) {
            throw new Error(
                'الصورة فارغة'
            );
        }

        const thumbnail =
            await sharp(
                imageBuffer
            )
                .resize(
                    100,
                    100,
                    {
                        fit: 'cover',
                        position: 'center'
                    }
                )
                .jpeg({
                    quality: 75
                })
                .toBuffer();

        return thumbnail;

    } catch (error) {

        return null;
    }
}

async function sendEditButtons(
    m,
    conn,
    usedPrefix,
    input
) {

    const thumbnail =
        await getEditThumbnail();

    const locationMessage = {
        degreesLatitude: 0,
        degreesLongitude: 0,

        name:
            '⚡ SHANKS Bot',

        address:
            'اختر نوع الإيديت',

        ...(thumbnail
            ? {
                jpegThumbnail:
                    thumbnail
            }
            : {})
    };

    const contentMsg = {

        locationMessage,

        contentText:
            `*اختر نوع الإيديت للنص:* _${input}_`,

        footerText:
            '❖ اختر نوع الإيديت المطلوب:',

        buttons: [

            {
                buttonId:
                    `${usedPrefix}ايديت-بينتر ${input}`,

                buttonText: {
                    displayText:
                        '🎨 ايديت من بينتريست'
                },

                type: 1
            },

            {
                buttonId:
                    `${usedPrefix}ايديت-تيك ${input}`,

                buttonText: {
                    displayText:
                        '🖋️ ايديت من تيك توك'
                },

                type: 1
            },

            {
                buttonId:
                    `${usedPrefix}ايديت-يوت ${input}`,

                buttonText: {
                    displayText:
                        '🍷 ايديت 4k من يوتيوب'
                },

                type: 1
            }

        ],

        headerType: 6
    };

    const waMsg =
        generateWAMessageFromContent(
            m.chat,
            {
                buttonsMessage:
                    contentMsg
            },
            {}
        );

    await conn.relayMessage(
        m.chat,
        waMsg.message,
        {
            messageId:
                waMsg.key.id
        }
    );
}

let handler = async (
    m,
    {
        conn,
        args,
        usedPrefix,
        command
    }
) => {

    const input =
        args.join(' ')
            .trim();

    if (
        command === 'ايديت'
    ) {

        if (!input) {

            return conn.sendMessage(
                m.chat,
                {
                    text:
                        `✧ اكتب مثلًا:\n` +
                        `${usedPrefix}ايديت شانكس`
                },
                {
                    quoted: m
                }
            );
        }

        try {

            await sendEditButtons(
                m,
                conn,
                usedPrefix,
                input
            );

        } catch (e) {

            await conn.sendMessage(
                m.chat,
                {
                    text:
                        '❌ حدث خطأ أثناء إنشاء رسالة الإيديت.'
                },
                {
                    quoted: m
                }
            );
        }

        return;
    }

    if (!input) {

        return conn.sendMessage(
            m.chat,
            {
                text:
                    '❌ اكتب اسم الفيديو أو الرابط.'
            },
            {
                quoted: m
            }
        );
    }

    try {

        if (
            command === 'ايديت-يوت'
        ) {

            await runYoutubeEdit(
                m,
                conn,
                input
            );

        } else if (
            command === 'ايديت-تيك'
        ) {

            await runTikTokEdit(
                m,
                conn,
                input
            );

        } else if (
            command === 'ايديت-بينتر'
        ) {

            await runPinterestEdit(
                m,
                conn,
                input
            );
        }

    } catch (e) {

        await conn.sendMessage(
            m.chat,
            {
                text:
                    `❌ فشل التحميل: ${e.message}`
            },
            {
                quoted: m
            }
        );
    }
};

handler.command =
    /^(ايديت|ايديت-يوت|ايديت-تيك|ايديت-بينتر)$/i;

handler.help = [
    'ايديت <نص>'
];

handler.tags = [
    'downloader'
];

export default handler;