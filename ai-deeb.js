/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const API_BASE = 'https://engez.a7a.online/api/v1/ai/deepseek';

async function uploadToUguu(buffer, ext) {
    const form = new FormData();
    form.append('files[]', buffer, `file.${ext}`);

    try {
        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 30000
        });

        if (!response.data?.files?.[0]?.url) {
            throw new Error('فشل في رفع الملف إلى Uguu.se');
        }

        return response.data.files[0].url;
    } catch (error) {
        throw new Error(`فشل رفع الملف: ${error.message}`);
    }
}

async function callDeepSeekAPI({ query, search = false, thinking = false, fileUrl = null }) {
    try {
        const params = new URLSearchParams();
        params.append('q', query);
        if (search) params.append('search', 'true');
        if (thinking) params.append('thinking', 'true');
        if (fileUrl) params.append('fileUrl', fileUrl);

        const response = await axios.get(`${API_BASE}?${params.toString()}`, {
            timeout: 120000
        });

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل الاتصال بـ API');
        }

        return response.data.response;
    } catch (error) {
        if (error.response) {
            throw new Error(`خطأ من السيرفر: ${error.response.status}`);
        }
        throw new Error(error.message || 'فشل الاتصال بـ DeepSeek API');
    }
}

function buildReply(reply, thinkText) {
    let out = '';
    if (thinkText) {
        const quoted = thinkText
            .split('\n')
            .map(line => line.trim() === '' ? '' : `> ${line}`)
            .join('\n');
        out += quoted + '\n\n';
    }
    out += reply;
    return out;
}

async function runDeepSeek(m, { prompt, thinking, search }) {
    const mediaMsg = (m.mimetype ? m : null) || (m.quoted?.mimetype ? m.quoted : null);

    if (!prompt && !mediaMsg) {
        return m.reply(
            '❌ ادخل سؤالك\n\n' +
            'مثال: .ديب-تفكير اشرح النسبية\n' +
            'بحث: .ديب-بحث آخر أخبار AI\n' +
            'بحث+تفكير: .ديب-ts قارن بين كذا وكذا\n' +
            'رد على صورة/ملف: .ديب-تفكير اشرح محتوى الصورة'
        );
    }

    await m.react('🤖');

    try {
        let fileUrl = null;

        if (mediaMsg) {
            await m.react('📎');

            try {
                const mediaBuffer = await mediaMsg.download();
                if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer) || mediaBuffer.length === 0) {
                    throw new Error('تعذر تحميل الميديا (الملف منتهي الصلاحية أو غير متاح)');
                }

                const fileInfo = await fileTypeFromBuffer(mediaBuffer);
                const ext = fileInfo?.ext || 'bin';

                await m.react('⏫');
                fileUrl = await uploadToUguu(mediaBuffer, ext);

                if (!fileUrl) {
                    throw new Error('فشل الحصول على رابط الملف');
                }

                await m.react('✅');
            } catch (uploadError) {
                throw new Error(`فشل رفع الملف: ${uploadError.message}`);
            }
        }

        const result = await callDeepSeekAPI({
            query: prompt || 'اشرح محتوى الملف',
            search,
            thinking,
            fileUrl
        });

        if (!result?.reply) {
            return m.reply('❌ ما جاش رد من DeepSeek');
        }

        const replyText = buildReply(result.reply, result.thinking);
        await m.reply(replyText);
        await m.react('✅');

    } catch (e) {
        await m.react('❌');
        return m.reply(`❌ خطأ: ${e.message}`);
    }
}

const handler = async (m, { conn, text, command }) => {
    const prompt = text?.trim();

    if (command === 'ديب-تفكير') {
        return runDeepSeek(m, { prompt, thinking: true, search: false });
    }
    if (command === 'ديب-بحث') {
        return runDeepSeek(m, { prompt, thinking: false, search: true });
    }
    if (command === 'ديب-ts') {
        return runDeepSeek(m, { prompt, thinking: true, search: true });
    }

    return runDeepSeek(m, { prompt, thinking: false, search: false });
};

handler.command = /^(ديب|deep|ديب-تفكير|ديب-بحث|ديب-ts)$/i;
handler.help = ['ديب', 'ديب-تفكير', 'ديب-بحث', 'ديب-ts'];
handler.tags = ['ai'];

export default handler;