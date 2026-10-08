/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه::╭━━━〔 أدوات PDF — تحويل صور / إعادة تسمية / استخراج صور 〕━━━╮
│ .topdf <اسم الملف>   - يبدأ جمع صور، ابعتها واحدة واحدة، وبعدين .topdf done
│ .topdf done          - يخلّص الجمع ويطلّع PDF باسمك
│ .topdf cancel        - يلغي الجمع
│ .rename <اسم جديد>   - ريبلاي على ملف PDF عشان تغيّر اسمه (بدون فتح أو تعديل الملف نفسه)
│ .pdfimages           - ريبلاي على ملف PDF عشان يطلّعلك الصور اللي جواه
│
│ محتاج: npm install pdf-lib pngjs
╰━━━━━━━━━━━
╰━━━━━━━━━━━━━━━━━━╯
*/

import { PDFDocument, PDFName, PDFRawStream, PDFArray } from 'pdf-lib';
import { PNG } from 'pngjs';
import zlib from 'zlib';

const SESSION_TIMEOUT = 5 * 60 * 1000;
const sessions = new Map();

function safeFileName(name) {
    return (name || 'file').replace(/[\\/:*?"<>|]/g, '_').trim() || 'file';
}


async function imagesToPdf(buffers) {
    const skipped = [];
    const pdf = await PDFDocument.create();

    for (let index = 0; index < buffers.length; index++) {
        const buffer = buffers[index];
        const imageNumber = index + 1;

        try {
            if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
                skipped.push(`الصورة رقم ${imageNumber}: البيانات فارغة أو غير صالحة.`);
                continue;
            }

            let image;

            try {
                image = await pdf.embedJpg(buffer);
            } catch (jpgError) {
                try {
                    image = await pdf.embedPng(buffer);
                } catch (pngError) {
                    skipped.push(
                        `الصورة رقم ${imageNumber}: صيغة غير مدعومة أو الصورة تالفة. ` +
                        `JPG: ${jpgError?.message ?? jpgError} | ` +
                        `PNG: ${pngError?.message ?? pngError}`
                    );
                    continue;
                }
            }

            const maxDimension = 1000;
            const scale = Math.min(
                1,
                maxDimension / Math.max(image.width, image.height)
            );

            const width = image.width * scale;
            const height = image.height * scale;

            const page = pdf.addPage([width, height]);

            page.drawImage(image, {
                x: 0,
                y: 0,
                width,
                height
            });
        } catch (error) {
            skipped.push(
                `الصورة رقم ${imageNumber}: ${error?.message ?? String(error)}`
            );
        }
    }

    const pageCount = pdf.getPageCount();

    if (pageCount === 0) {
        return {
            bytes: null,
            skipped,
            pageCount: 0
        };
    }

    const bytes = await pdf.save();

    return {
        bytes: Buffer.from(bytes),
        skipped,
        pageCount
    };
}

async function extractImagesFromPdf(pdfBytes) {
    let pdfDoc;
    try {
        pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    } catch (e) {
        throw new Error(`فشل قراءة وقوالب ملف الـ PDF (قد يكون الملف مشفر أو تالف): ${e?.message || String(e)}`);
    }

    const results = [];
    const unsupported = [];
    const seen = new Set();
    let imgCounter = 0;

    const pages = pdfDoc.getPages();
    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        const page = pages[pageIdx];
        const resources = page.node.Resources && page.node.Resources();
        if (!resources) continue;

        const xObjects = resources.lookup(PDFName.of('XObject'));
        if (!xObjects || typeof xObjects.entries !== 'function') continue;

        for (const [, ref] of xObjects.entries()) {
            const refKey = ref?.toString ? ref.toString() : String(Math.random());
            if (seen.has(refKey)) continue;
            seen.add(refKey);

            const obj = pdfDoc.context.lookup(ref);
            if (!(obj instanceof PDFRawStream)) continue;

            const dict = obj.dict;
            const subtype = dict.get(PDFName.of('Subtype'));
            if (!subtype || (subtype?.toString && subtype.toString() !== '/Image')) continue;

            imgCounter++;
            const filterEntry = dict.get(PDFName.of('Filter'));


            const parseFilterStr = (f) => (f && typeof f.toString === 'function' ? f.toString() : String(f || ''));
            const filters = !filterEntry
                ? []
                : filterEntry instanceof PDFArray
                    ? filterEntry.asArray().map(parseFilterStr)
                    : [parseFilterStr(filterEntry)];

            try {
                if (filters.includes('/DCTDecode')) {
                    results.push({ buffer: Buffer.from(obj.contents), ext: 'jpg' });
                    continue;
                }

                if (filters.length === 0 || filters.includes('/FlateDecode')) {
                    const widthObj = dict.get(PDFName.of('Width'));
                    const heightObj = dict.get(PDFName.of('Height'));
                    const bpcObj = dict.get(PDFName.of('BitsPerComponent'));
                    const csObj = dict.get(PDFName.of('ColorSpace'));

                    const width = widthObj?.asNumber?.();
                    const height = heightObj?.asNumber?.();
                    const bpc = bpcObj?.asNumber?.() ?? 8;


                    const cs = csObj && typeof csObj.toString === 'function' ? csObj.toString() : String(csObj || '');

                    if (!width || !height) {
                        unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: العرض أو الارتفاع غير متاح في خصائص الصورة.`);
                        continue;
                    }
                    if (bpc !== 8) {
                        unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: عمق البت (${bpc}) غير مدعوم، المدعوم هو 8-bit.`);
                        continue;
                    }
                    if (!(cs === '/DeviceRGB' || cs === '/DeviceGray')) {
                        unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: نظام الألوان (${cs || 'غير محدد'}) غير مدعوم (يدعم فقط RGB و Gray).`);
                        continue;
                    }

                    let raw;
                    try {
                        raw = filters.includes('/FlateDecode')
                            ? zlib.inflateSync(Buffer.from(obj.contents))
                            : Buffer.from(obj.contents);
                    } catch (zlibErr) {
                        unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: فشل فك ضغط FlateDecode (${zlibErr?.message || String(zlibErr)}).`);
                        continue;
                    }

                    const channels = cs === '/DeviceRGB' ? 3 : 1;
                    const png = new PNG({ width, height });

                    for (let i = 0; i < width * height; i++) {
                        const srcOff = i * channels;
                        const dstOff = i * 4;
                        if (channels === 3) {
                            png.data[dstOff] = raw[srcOff];
                            png.data[dstOff + 1] = raw[srcOff + 1];
                            png.data[dstOff + 2] = raw[srcOff + 2];
                        } else {
                            png.data[dstOff] = raw[srcOff];
                            png.data[dstOff + 1] = raw[srcOff];
                            png.data[dstOff + 2] = raw[srcOff];
                        }
                        png.data[dstOff + 3] = 255;
                    }

                    results.push({ buffer: PNG.sync.write(png), ext: 'png' });
                    continue;
                }

                unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: تستخدم فلتر تشفير غير مدعوم (${filters.join(', ') || 'لاشيء'}).`);
            } catch (e) {
                unsupported.push(`الصورة رقم ${imgCounter} في الصفحة ${pageIdx + 1}: حدث خطأ غير متوقع أثناء الاستخراج (${e?.message || String(e)})`);
            }
        }
    }

    return { results, unsupported };
}

const handler = async (m, { conn, args, text, command }) => {
    const key = `${m.chat}:${m.sender}`;


    if (command === 'topdf' || command === 'الى_pdf') {
        const sub = (args[0] || '').toLowerCase();

        if (sub === 'done' || sub === 'تم') {
            const session = sessions.get(key);
            if (!session || !session.images.length) {
                sessions.delete(key);
                return m.reply('❌ مفيش جلسة نشطة أو مفيش صور اتجمعت. ابدأ بـ *.topdf <اسم الملف>*');
            }

            await m.react('⏳');
            try {
                const { bytes, skipped, pageCount } = await imagesToPdf(session.images);
                sessions.delete(key);

                if (!pageCount) {
                    await m.react('❌');
                    let errMsg = '❌ فشل إنشاء ملف الـ PDF بالكامل لأسباب متعددة:\n';
                    skipped.forEach(err => errMsg += `• ${err}\n`);
                    return m.reply(errMsg);
                }

                let replyMsg = `✅ تم إنشاء الـ PDF بنجاح (${pageCount} صفحة).`;
                if (skipped.length) {
                    replyMsg += `\n\n⚠️ تفاصيل الصور التي تم تخطيها (${skipped.length}):\n` + skipped.map(s => `• ${s}`).join('\n');
                }

                await conn.sendMessage(
                    m.chat,
                    {
                        document: bytes,
                        fileName: `${safeFileName(session.filename)}.pdf`,
                        mimetype: 'application/pdf',
                        caption: replyMsg
                    },
                    { quoted: m }
                );
                await m.react('✅');
            } catch (e) {
                sessions.delete(key);
                await m.react('❌');
                await m.reply(`❌ حدث خطأ أثناء تنفيذ عملية الـ PDF:\nالسبب: ${e?.message || String(e)}`);
            }
            return;
        }

        if (sub === 'cancel' || sub === 'الغاء' || sub === 'إلغاء') {
            sessions.delete(key);
            return m.reply('🗑️ تم إلغاء الجلسة بنجاح.');
        }


        const filename = args.join(' ').trim();
        if (!filename) {
            return m.reply('❌ يرجى تحديد اسم للملف. مثال: *.topdf اسم_الملف*');
        }

        const session = { filename, images: [], lastActivity: Date.now() };


        if (m.mtype === 'imageMessage') {
            try {
                const buf = await m.download();
                if (Buffer.isBuffer(buf) && buf.length) {
                    session.images.push(buf);
                } else {
                    await m.reply('⚠️ تحذير: تعذر تنزيل الصورة المرفقة مع الأمر الأول (البيانات فارغة).');
                }
            } catch (e) {
                await m.reply(`⚠️ تحذير: فشل تنزيل الصورة المرفقة مع الأمر الأول.\nالسبب: ${e?.message || String(e)}`);
            }
        }

        sessions.set(key, session);
        return m.reply(
            `📥 بدأت الجلسة باسم *${safeFileName(filename)}.pdf*\n` +
            `ابعت الصور واحدة واحدة (هرد ✅ على كل صورة بتتضاف)، وأول ما تخلص اكتب:\n*.topdf done*\n` +
            `أو *.topdf cancel* للإلغاء.\n\n⏱️ الجلسة بتتلغي تلقائي بعد 5 دقايق بدون نشاط.`
        );
    }


    
    
    
    if (command === 'rename' || command === 'اعادة_تسمية' || command === 'تسمية') {
        if (!m.quoted || m.quoted.mtype !== 'documentMessage') {
            return m.reply('❌ يرجى الرد (Reply) على ملف PDF باسم جديد. مثال: *.rename الاسم_الجديد*');
        }
        const newName = text.trim();
        if (!newName) return m.reply('❌ يرجى كتابة الاسم الجديد. مثال: *.rename اسم_جديد*');

        await m.react('⏳');
        let buf;
        try {
            buf = await m.quoted.download();
        } catch (e) {
            await m.react('❌');
            return m.reply(`❌ فشل تنزيل ملف الـ PDF من الرسالة:\nالسبب: ${e?.message || String(e)}`);
        }

        if (!Buffer.isBuffer(buf) || !buf.length) {
            await m.react('❌');
            return m.reply('❌ الملف اللي اتحمّل فاضي أو تالف.');
        }

        try {
            await conn.sendMessage(
                m.chat,
                { document: buf, fileName: `${safeFileName(newName)}.pdf`, mimetype: 'application/pdf' },
                { quoted: m }
            );
            await m.react('✅');
        } catch (e) {
            await m.react('❌');
            await m.reply(`❌ فشل إرسال الملف بالاسم الجديد:\nالسبب: ${e?.message || String(e)}`);
        }
        return;
    }


    if (command === 'pdfimages' || command === 'صور_pdf') {
        if (!m.quoted || m.quoted.mtype !== 'documentMessage') {
            return m.reply('❌ يرجى الرد (Reply) على ملف PDF ثم كتابة الأمر *.pdfimages*');
        }

        await m.react('⏳');
        let buf;
        try {
            buf = await m.quoted.download();
        } catch (e) {
            await m.react('❌');
            return m.reply(`❌ فشل تنزيل ملف الـ PDF من الرسالة:\nالسبب: ${e?.message || String(e)}`);
        }

        try {
            const { results, unsupported } = await extractImagesFromPdf(buf);

            if (!results.length) {
                await m.react('❌');
                let failMsg = '📭 لم يتم العثور على صور قابلة للاستخراج في هذا الملف.';
                if (unsupported.length) {
                    failMsg += `\n\n⚠️ تفاصيل الأسباب التي منعت الاستخراج (${unsupported.length}):\n` + unsupported.map(u => `• ${u}`).join('\n');
                }
                return m.reply(failMsg);
            }

            for (let i = 0; i < results.length; i++) {
                await conn.sendMessage(
                    m.chat,
                    { image: results[i].buffer, caption: i === 0 ? `🖼️ تم استخراج ${results.length} صورة بنجاح.` : undefined },
                    { quoted: m }
                );
            }

            if (unsupported.length) {
                const warnMsg = `⚠️ ملاحظة: تم تخطي (${unsupported.length}) عنصر للأسباب التالية:\n` + unsupported.map(u => `• ${u}`).join('\n');
                await m.reply(warnMsg);
            }
            await m.react('✅');
        } catch (e) {
            await m.react('❌');
            await m.reply(`❌ فشل في استخراج الصور من الـ PDF:\nالسبب: ${e?.message || String(e)}`);
        }
        return;
    }
};

handler.help = ['topdf <name>', 'topdf done', 'rename <name>', 'pdfimages'];
handler.tags = ['tools'];
handler.command = ['topdf', 'الى_pdf', 'rename', 'اعادة_تسمية', 'تسمية', 'pdfimages', 'صور_pdf'];


handler.all = async function (m) {
    if (m.mtype !== 'imageMessage') return;
    if (m.isCommand) return;

    const key = `${m.chat}:${m.sender}`;
    const session = sessions.get(key);
    if (!session) return;

    if (Date.now() - session.lastActivity > SESSION_TIMEOUT) {
        sessions.delete(key);
        return;
    }

    try {
        const buf = await m.download();
        if (!Buffer.isBuffer(buf) || !buf.length) {
            await m.react('❌');
            await m.reply('❌ فشل إضافة الصورة للجلسة: الملف المستلم فارغ أو تالف.');
            return;
        }
        session.images.push(buf);
        session.lastActivity = Date.now();
        await m.react('✅');
    } catch (e) {
        console.error('[PdfTools] فشل تحميل صورة في الجلسة:', e);
        await m.react('❌').catch(() => {});
        await m.reply(`❌ فشل إضافة الصورة للجلسة:\nالسبب: ${e?.message || String(e)}`);
    }
};

export default handler;