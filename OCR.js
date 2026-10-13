/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/
/*╭━━━〔 OCR — قراءة النص من الصور (عن طريق OCR.space API) 〕━━━╮
│ .ocr               - ريبلاي على صورة → بيقرا عربي، ولو مفيش نتيجة كويسة يجرب إنجليزي
│ .ocr ara           - عربي بس
│ .ocr eng           - إنجليزي بس
│ .ocr <كود لغة>     - أي لغة تانية OCR.space بيدعمها
│
│ محتاج: سجّل مفتاح مجاني من https://ocr.space/ocrapi وحطه تحت
│ مفيش أي تثبيت إضافي (fetch/FormData متوفرين في Node أصلاً)
╰━━━━━━━━━━━━━━━━━━╯
*/
const OCR_SPACE_API_KEY = 'K87676176388957';

let sharp = null;
try {
    sharp = (await import('sharp')).default;
} catch {
    sharp = null; 
}

function withTimeout(promise, ms, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}


async function prepareForApi(buffer) {
    if (!sharp) return buffer;
    try {
        let out = await sharp(buffer).resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
        
        if (out.length > 1_000_000) {
            out = await sharp(buffer).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
        }
        return out;
    } catch {
        return buffer;
    }
}


async function ocrSpaceRequest(buffer, lang) {
    const form = new FormData();
    form.append('apikey', OCR_SPACE_API_KEY);
    form.append('language', lang);
    form.append('scale', 'true');
    form.append('isTable', 'false');
    form.append('file', new Blob([buffer]), 'image.jpg');

    const res = await withTimeout(
        fetch('https://api.ocr.space/parse/image', { method: 'POST', body: form }),
        30000,
        'الـ API استغرق وقت طويل جداً (أكتر من 30 ثانية).'
    );

    if (!res.ok) throw new Error(`فشل الاتصال بالـ API (HTTP ${res.status})`);

    const data = await res.json();

    if (data.IsErroredOnProcessing) {
        const msg = Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(', ') : (data.ErrorMessage || 'فشل غير معروف');
        throw new Error(msg);
    }

    const text = (data.ParsedResults?.[0]?.ParsedText || '').trim();
    return text;
}

const LANG_ALIASES = {
    ar: 'ara', arabic: 'ara', 'عربي': 'ara', 'عربى': 'ara',
    en: 'eng', english: 'eng', 'انجليزي': 'eng', 'انجليزى': 'eng', 'إنجليزي': 'eng'
};

function resolveLang(input) {
    const clean = (input || '').toLowerCase().trim();
    if (!clean) return null; 
    return LANG_ALIASES[clean] || clean;
}

const handler = async (m, { args, conn }) => {
    const target = m.quoted && ['imageMessage', 'stickerMessage'].includes(m.quoted.mtype)
        ? m.quoted
        : ['imageMessage', 'stickerMessage'].includes(m.mtype)
            ? m
            : null;

    if (!target) {
        return m.reply(
            '❌ اعمل ريبلاي على صورة (أو ابعتها مع الأمر كابشن)، وبعدين:\n\n' +
            '» *.ocr* (افتراضي: يجرب عربي وإنجليزي)\n' +
            '» *.ocr ara* (عربي بس)\n' +
            '» *.ocr eng* (إنجليزي بس)'
        );
    }

    const lang = resolveLang(args[0]);

    await m.react('⏳');

    let buf;
    try {
        buf = await target.download();
    } catch (e) {
        await m.react('❌');
        return m.reply(`❌ فشل تحميل الصورة:\n${e?.message || e}`);
    }

    if (!Buffer.isBuffer(buf) || !buf.length) {
        await m.react('❌');
        return m.reply('❌ الصورة فاضية أو فشل تحميلها.');
    }

    try {
        const prepared = await prepareForApi(buf);

        let text = '';
        let usedLang = lang;

        if (lang) {
            text = await ocrSpaceRequest(prepared, lang);
        } else {
            
            const [arResult, enResult] = await Promise.allSettled([
                ocrSpaceRequest(prepared, 'ara'),
                ocrSpaceRequest(prepared, 'eng')
            ]);

            const arText = arResult.status === 'fulfilled' ? arResult.value : '';
            const enText = enResult.status === 'fulfilled' ? enResult.value : '';

            if (arText.length >= enText.length) {
                text = arText;
                usedLang = 'ara';
            } else {
                text = enText;
                usedLang = 'eng';
            }

            if (!text && arResult.status === 'rejected' && enResult.status === 'rejected') {
                throw new Error(arResult.reason?.message || enResult.reason?.message || 'فشلت كل المحاولات');
            }
        }

        if (!text.trim()) {
            await m.react('❌');
            return m.reply('📭 مقدرتش ألاقي أي نص واضح في الصورة دي.');
        }

        await m.reply(`📝 *النص المستخرج* (${usedLang}):\n\n${text.trim()}`);
        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        await m.reply(`❌ فشلت عملية القراءة:\n${e?.message || e}`);
    }
};

handler.help = ['ocr [لغة]'];
handler.tags = ['tools'];
handler.command = ['ocr', 'اقرأ', 'قراءة_صورة'];

export default handler;