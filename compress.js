/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: تحويل تنسيق الصور و تقليل حجم الصوره
╰━━━━━━━━━━━━━━━━━━╯
*/

import sharp from 'sharp';

const SUPPORTED = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'tiff', 'gif'];
const MIME = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif',
    tiff: 'image/tiff',
    gif: 'image/gif'
};
const MAX_SIZE = 20 * 1024 * 1024; 

function fmtSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function convertTo(buffer, target) {
    const img = sharp(buffer, { failOn: 'none' });
    switch (target) {
        case 'jpg':
        case 'jpeg':
            return img.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
        case 'png':
            return img.png({ compressionLevel: 9 }).toBuffer();
        case 'webp':
            return img.webp({ quality: 92 }).toBuffer();
        case 'avif':
            return img.avif({ quality: 70 }).toBuffer();
        case 'tiff':
            return img.tiff().toBuffer();
        case 'gif':
            return img.gif().toBuffer();
        default:
            throw new Error('صيغة غير مدعومة');
    }
}

const handler = async (m, { conn, args, command }) => {
    if (!m.quoted) {
        return m.reply(
            '❌ اعمل ريبلاي على صورة أو استيكر، وبعدين:\n\n' +
            `» *.convert ${SUPPORTED.join('/')}*\n` +
            '» *.compress [جودة من 10 لـ 95، افتراضي 50]*'
        );
    }

    const mtype = m.quoted.mtype;
    const isImageLike = ['imageMessage', 'stickerMessage', 'documentMessage'].includes(mtype);
    if (!isImageLike) {
        return m.reply('❌ الرسالة اللي عملت عليها ريبلاي مش صورة/استيكر.');
    }

    let buffer;
    try {
        buffer = await m.quoted.download();
    } catch (e) {
        return m.reply('❌ فشل تحميل الصورة من الرسالة.');
    }

    if (!buffer || !buffer.length) {
        return m.reply('❌ مقدرتش أقرأ محتوى الصورة.');
    }
    if (buffer.length > MAX_SIZE) {
        return m.reply(`❌ الصورة أكبر من الحد المسموح (${fmtSize(MAX_SIZE)}).`);
    }

    const isCompress = ['compress', 'ضغط'].includes(command);

    await m.react('⏳');

    try {
        const before = buffer.length;

        if (isCompress) {
            let quality = parseInt(args[0]);
            if (!Number.isFinite(quality)) quality = 50;
            quality = Math.min(95, Math.max(10, quality));

            const output = await sharp(buffer, { failOn: 'none' })
                .jpeg({ quality, mozjpeg: true })
                .toBuffer();

            const after = output.length;
            const saved = before > 0 ? (100 - (after / before) * 100).toFixed(1) : '0';

            await conn.sendMessage(
                m.chat,
                {
                    image: output,
                    caption:
                        `✅ *اتضغطت الصورة*\n\n` +
                        `📦 الحجم قبل: ${fmtSize(before)}\n` +
                        `📦 الحجم بعد: ${fmtSize(after)}\n` +
                        `📉 نسبة التقليل: ${saved}%\n` +
                        `🎚️ الجودة: ${quality}`
                },
                { quoted: m }
            );
            await m.react('✅');
            return;
        }


        const target = (args[0] || '').toLowerCase().replace(/^\./, '');
        if (!target || !SUPPORTED.includes(target)) {
            await m.react('❌');
            return m.reply(`❌ حدد صيغة صحيحة من: ${SUPPORTED.join(', ')}\nمثال: *.convert png*`);
        }

        const output = await convertTo(buffer, target);
        const after = output.length;

        const caption =
            `✅ *اتحولت للصيغة ${target.toUpperCase()}*\n\n` +
            `📦 الحجم قبل: ${fmtSize(before)}\n` +
            `📦 الحجم بعد: ${fmtSize(after)}`;

      
        await conn.sendMessage(
            m.chat,
            { document: output, fileName: `converted.${target}`, mimetype: MIME[target], caption },
            { quoted: m }
        );

      
        if (target === 'png' || target === 'jpg' || target === 'jpeg') {
            await conn.sendMessage(m.chat, { image: output }, { quoted: m }).catch(() => {});
        }

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        await m.reply(`❌ *حصل خطأ:*\n\n\`\`\`\n${e.message || e}\n\`\`\``);
    }
};

handler.help = ['convert <format>', 'compress [quality]'];
handler.tags = ['tools'];
handler.command = ['convert', 'تحويل', 'compress', 'ضغط'];

export default handler;