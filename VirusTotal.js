/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: فحص الملفات و الروابط باستخدام 90 نظام امان معتمد عالميه
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import FormData from 'form-data';
import crypto from 'crypto';
import { delay, prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const API_KEYS = [
    '8af7796c189470de4840d850aca161f78de1a7e5dcae3ffaf6feacd92712f231',
    '374ea5d8a55e4f3ffd1504e382d94e8578bfa81393a75b41d4ba932f8144bea1',
    'a06504bc558db84d937e164f701fed920c3a6f66ac1f20af128daecc5fc250dc',
    '2e9fee85718310fcb77a16bcab4e1897ad6915d97aa833d68321785725bb0b84'
];

let currentKeyIndex = 0;

async function fetchVirusTotal(url, options = {}) {
    let attempts = 0;
    while (attempts < API_KEYS.length) {
        const apiKey = API_KEYS[currentKeyIndex];
        try {
            const response = await axios({
                ...options,
                url,
                headers: {
                    ...options.headers,
                    'x-apikey': apiKey
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                attempts++;
            } else {
                throw error;
            }
        }
    }
    throw new Error('جميع مفاتيح API وصلت للحد الأقصى، يرجى المحاولة لاحقاً.');
}

async function pollAnalysis(analysisId, { maxAttempts = 15, intervalMs = 4000 } = {}) {
    for (let i = 0; i < maxAttempts; i++) {
        const res = await fetchVirusTotal(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            { method: 'GET' }
        );

        const status = res?.data?.attributes?.status;
        const stats = res?.data?.attributes?.stats;

        if (status === 'completed' && stats) {
            return stats;
        }

        await delay(intervalMs);
    }
    return null;
}

let handler = async (m, { conn, args, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    await m.reply('⏳ جاري الرفع والفحص عبر VirusTotal...');

    try {
        if (mime) {
            let media = await q.download();

            if (!media || !Buffer.isBuffer(media) || media.length === 0) {
                return m.reply('❌ فشل تحميل الملف من واتساب (وصل فاضي)، جرب ترسله تاني.');
            }

            let fileHash = crypto.createHash('sha256').update(media).digest('hex');

            try {
                let fileReport = await fetchVirusTotal(
                    `https://www.virustotal.com/api/v3/files/${fileHash}`,
                    { method: 'GET' }
                );
                let stats = fileReport?.data?.attributes?.last_analysis_stats;
                let totalVotes = stats
                    ? (stats.harmless ?? 0) + (stats.malicious ?? 0) + (stats.suspicious ?? 0) + (stats.undetected ?? 0)
                    : 0;

                if (stats && totalVotes > 0) {
                    return sendResult(conn, m.chat, stats, 'الملف');
                }
            } catch (err) {
            }

            let form = new FormData();
            form.append('file', media, {
                filename: q.filename || 'file',
                contentType: mime || 'application/octet-stream'
            });

            let uploadRes = await fetchVirusTotal('https://www.virustotal.com/api/v3/files', {
                method: 'POST',
                data: form,
                headers: form.getHeaders()
            });

            let analysisId = uploadRes?.data?.id;
            if (!analysisId) {
                return m.reply('❌ فشل رفع الملف إلى VirusTotal.');
            }

            let stats = await pollAnalysis(analysisId);

            if (!stats) {
                return m.reply('⌛ التحليل لسه شغال وطول عن المتوقع، جرب تاني بعد شوية.');
            }

            return sendResult(conn, m.chat, stats, 'الملف');

        } else if (text || args[0]) {
            let targetUrl = text.trim();

            try {
                let urlId = Buffer.from(targetUrl).toString('base64').replace(/=+$/, '');
                let urlReport = await fetchVirusTotal(
                    `https://www.virustotal.com/api/v3/urls/${urlId}`,
                    { method: 'GET' }
                );
                let stats = urlReport?.data?.attributes?.last_analysis_stats;
                let totalVotes = stats
                    ? (stats.harmless ?? 0) + (stats.malicious ?? 0) + (stats.suspicious ?? 0) + (stats.undetected ?? 0)
                    : 0;

                if (stats && totalVotes > 0) {
                    return sendResult(conn, m.chat, stats, 'الرابط', targetUrl);
                }
            } catch (err) {
            }

            let urlForm = new URLSearchParams({ url: targetUrl });

            let uploadRes = await fetchVirusTotal('https://www.virustotal.com/api/v3/urls', {
                method: 'POST',
                data: urlForm,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            let analysisId = uploadRes?.data?.id;
            if (!analysisId) {
                return m.reply('❌ فشل إرسال الرابط إلى VirusTotal.');
            }

            let stats = await pollAnalysis(analysisId, { maxAttempts: 10, intervalMs: 3000 });

            if (!stats) {
                return m.reply('⌛ التحليل لسه شغال وطول عن المتوقع، جرب تاني بعد شوية.');
            }

            return sendResult(conn, m.chat, stats, 'الرابط', targetUrl);

        } else {
            return m.reply('❌ يرجى إرسال رابط مع الأمر أو الرد على ملف لفحصه.');
        }
    } catch (e) {
        console.error(e);
        return m.reply(`❌ حدث خطأ أثناء الفحص: ${e.message}`);
    }
};

async function sendResult(conn, jid, stats, type, targetUrl = null) {
    if (!stats) {
        return conn.sendMessage(jid, { text: '❌ تعذر الحصول على نتائج الفحص حالياً، حاول مجدداً.' });
    }

    let caption = `🛡️ *نتائج فحص ${type}*\n\n` +
                  (targetUrl ? `🔗 الرابط: ${targetUrl}\n\n` : '') +
                  `🚨 ضار (Malicious): ${stats.malicious ?? 0}\n` +
                  `⚠️ مشبوه (Suspicious): ${stats.suspicious ?? 0}\n` +
                  `✅ سليم (Harmless): ${stats.harmless ?? 0}\n` +
                  `❓ غير معروف (Undetected): ${stats.undetected ?? 0}`;

    try {
        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: caption },
                        footer: { text: 'BY: 𝙎𝙃𝘼𝙉𝙆𝙎' },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: '🌾 زيارة القناة',
                                        url: 'https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y'
                                    })
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: '⚡ ريبو باقي الأكواد',
                                        url: 'https://github.com/SHANKS-CODE-1/CODE'
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        }, {});

        return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error('فشل إرسال الأزرار، يتم الإرسال كنص عادي:', e.message);
        return conn.sendMessage(jid, {
            text: `${caption}\n\n🌾 زيارة القناة:\nhttps://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y\n\n⚡ ريبو باقي الأكواد:\nhttps://github.com/SHANKS-CODE-1/CODE`
        });
    }
}

handler.command = ['فحص', 'vt', 'virustotal'];
export default handler;