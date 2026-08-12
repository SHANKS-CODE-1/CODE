/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎 〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: كود يطلع FEN الشطرنج
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from 'node-fetch';

const API_BASE = 'https://engez.a7a.online/api/v1';

async function uploadToCatbox(buffer) {
    const { FormData, Blob } = await import('node-fetch');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', new Blob([buffer], { type: 'image/png' }), 'board.png');

    const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
    });
    return await res.text();
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`⚡ يرجى الرد على صورة رقعة الشطرنج لاستخراج كود الـ FEN منها باستخدام الأمر:\n*${usedPrefix + command}*`);
    }

    await conn.sendMessage(m.chat, { react: { text: '♟️', key: m.key } });

    try {
        let media = await q.download();
        if (!media) throw new Error('فشل تحميل الصورة');

        let imageUrl = await uploadToCatbox(media);
        if (!imageUrl || !imageUrl.startsWith('http')) {
            throw new Error('فشل رفع الصورة للسيرفر');
        }

        const promptInstruction = "Analyze this chessboard image carefully and generate the exact FEN (Forsyth-Edwards Notation) string representing the current board state. Output ONLY the raw FEN string (e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1) without any explanation, markdown, or extra text.";

        const apiUrl = `${API_BASE}/ai/image2prompt?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(promptInstruction)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        let fenResult = data.result || data.prompt || data.response || data.data || data.message;

        if (typeof fenResult === 'object') {
            fenResult = JSON.stringify(fenResult);
        }

        if (!fenResult) throw new Error("لم يتم تلقي استجابة صالحة من الـ API");

        fenResult = fenResult.replace(/```[a-z]*/gi, '').replace(/```/g, '').trim();

        const replyMessage = `♟️ *كود FEN لرقعة الشطرنج:*\n\n\`\`\`${fenResult}\`\`\`\n\n📌 يمكنك استخدام الكود في محركات الشطرنج مثل Lichess أو Stockfish.`;

        await m.reply(replyMessage);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`❌ حدث خطأ أثناء تحليل رقعة الشطرنج:\n${e.message}`);
    }
};

handler.help = ['fen', 'شطرنج'];
handler.tags = ['tools', 'ai'];
handler.command = /^(fen|فن|شطرنج|فحص_شطرنج)$/i;

export default handler;
