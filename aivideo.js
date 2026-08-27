/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: صنع فيديوهات بي الذكاء الاصطناعي و ازرار اختيار بي صوت او لا
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';

const API_URL = 'https://2b.hidenfree.com';

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(`🎬 ───〔 *SORA AI VIDEO* 〕─── 🎬\n\n📌 *الطريقة:* .فيديو <وصف الفيديو>\n⏳ *ملاحظة:* التوليد بيأخد شوية وقت يا مز ✨`);
    }

    let prompt = text;

    await m.react('🎬');
    let statusMsg = await conn.sendMessage(m.chat, { 
        text: '⏳ ───〔 *جاري إنشاء الفيديو بواسطة 𝙎𝙃𝘼𝙉𝙆𝙎* 〕─── ⏳\n\nيرجى الانتظار...' 
    }, { quoted: m });

    try {
        const result = await axios.get(`${API_URL}/api/aivideo2/public`, {
            params: { api_key: 'free_key', prompt },
            timeout: 300000,
            validateStatus: () => true
        });

        const data = result.data;

        if (!data?.success || !data?.fileKey) {
            throw new Error(data?.error || 'فشل توليد الفيديو من السيرفر');
        }

        const videoRes = await axios.get(`${API_URL}/api/aivideo2/download?file=${data.fileKey}`, {
            responseType: 'arraybuffer',
            timeout: 300000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: () => true
        });

        if (videoRes.status !== 200 || !videoRes.data || videoRes.data.length < 10000) {
            throw new Error('الملف المستلم غير صالحة أو تالف');
        }

        const videoBuffer = Buffer.from(videoRes.data);
        const sizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);

        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch {}

        const captionText = 
`✨ ───〔 *تم التوليد بنجاح* 〕─── ✨
📜 *الوصف:* ${prompt}
📦 *الحجم:* ${sizeMB} MB
👑 *بواسطة:* 𝙎𝙃𝘼𝙉𝙆𝙎 ⚡

اختر كيفية التعديل أو التشغيل من الأزرار أدناه 👇`;

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: captionText,
            footer: '👑 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏 👑',
            buttons: [
                {
                    buttonId: `.فيديو ${prompt} بصوت`,
                    buttonText: { displayText: '🔊 فيديو بصوت' },
                    type: 1
                },
                {
                    buttonId: `.فيديو ${prompt} بدون صوت`,
                    buttonText: { displayText: '🔇 فيديو بدون صوت' },
                    type: 1
                }
            ],
            headerType: 4
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[Sora AI]', e.message);
        try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch {}
        await m.react('❌');
        m.reply(`⚠️ ───〔 *حدث خطأ* 〕─── ⚠️\n\n❌ ${e.message || 'فشل في عملية التوليد'}`);
    }
};

handler.command = /^(فيديو|sora|فيديوذكاء|aivideo2)$/i;
handler.tags = ['ai'];
export default handler;