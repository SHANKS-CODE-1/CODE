/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: كود تشفير معقد و صعب الفك
╰━━━━━━━━━━━━━━━━━━╯
*/

import JavaScriptObfuscator from 'javascript-obfuscator';
import syntaxerror from 'syntax-error';

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ هذا الأمر للمطور فقط! ');

    let q = m.quoted ? m.quoted : m;
    let inputData = q.text || q.body;

    if (!inputData) {
        return m.reply('⚠️ قم بعمل ريبلاي (Reply) على الكود أو الكلام الذي تريد تشفيره!');
    }

    await m.reply('🔐 جاري فحص البيانات وتشفيرها...');

    let encryptedCode = '';
    let isCodeIncomplete = false;
    let syntaxErrorMessage = '';

    try {
        const err = syntaxerror(inputData, 'inputData', {
            sourceType: 'module',
            allowAwaitOutsideFunction: true
        });

        if (err) {
            isCodeIncomplete = true;
            syntaxErrorMessage = err.toString();
        }

        if (isCodeIncomplete) {
            const safeText = `console.log(${JSON.stringify(inputData)});`;
            const obfuscationResult = JavaScriptObfuscator.obfuscate(safeText, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1.0,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1.0,
                debugProtection: true,
                disableConsoleOutput: false,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: ['base64', 'rc4'],
                stringArrayThreshold: 1.0,
                transformObjectKeys: true,
                unicodeEscapeSequence: true,
                identifierNamesGenerator: 'hexadecimal'
            });
            encryptedCode = obfuscationResult.getObfuscatedCode();
        } else {
            const obfuscationResult = JavaScriptObfuscator.obfuscate(inputData, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1.0,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1.0,
                debugProtection: true,
                disableConsoleOutput: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: ['base64', 'rc4'],
                stringArrayThreshold: 1.0,
                transformObjectKeys: true,
                unicodeEscapeSequence: true,
                identifierNamesGenerator: 'hexadecimal'
            });
            encryptedCode = obfuscationResult.getObfuscatedCode();
        }

        let captionText = '';
        if (isCodeIncomplete) {
            captionText = `⚠️ *تنبيه لـ 𝙎𝙃𝘼𝙉𝙆𝙎: المحتوى ليس كوداً كاملاً أو يحتوي أخطاء!*\n\n❌ *تفاصيل الأخطاء المكتشفة:*\n\`\`\`${syntaxErrorMessage}\`\`\`\n\n🔒 *تم معالجة المحتوى وتشفيره كنص محمي بأمان عالي لمنع قراءته!*`;
        } else {
            captionText = `✅ *تم التشفير والتعمية الكاملة لـ 𝙎𝙃𝘼𝙉𝙆𝙎 بنجاح! *\n\n🔒 *مميزات التشفير الحالي:*\n• تشفير مزدوج Base64 / RC4 لجميع النصوص.\n• تحويل المتغيرات إلى Hexadecimal.\n• إخفاء كامل لجميع النصوص والروابط والرموز.\n• دفاع ذاتي ضد الهندسة العكسية وفك التكويد.`;
        }

        await conn.sendMessage(m.chat, {
            document: Buffer.from(encryptedCode, 'utf-8'),
            mimetype: 'application/javascript',
            fileName: isCodeIncomplete ? 'shanks_text_encrypted.js' : 'shanks_encrypted.js',
            caption: captionText
        }, { quoted: m });

        const buttonMessage = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: "📋 *نـسـخ الـكـود الـمـشـفـر بـضـغـطـة واحـدة*",
                            hasMediaAttachment: false
                        },
                        body: {
                            text: "اضغط على الزر بالأسفل لنسخ كودك المتشفر مباشرة إلى الحافظة  !"
                        },
                        footer: {
                            text: "👑 مطور البوت: 𝙎𝙃𝘼𝙉𝙆𝙎"
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "نسخ الكود المشفر 📋",
                                        id: "copy_code_btn",
                                        copy_code: encryptedCode
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        };

        await conn.relayMessage(m.chat, buttonMessage, {});

    } catch (error) {
        console.error(error);
        m.reply(`❌ حدث خطأ غير متوقع أثناء معالجة البيانات.\nالخطأ: ${error.message}`);
    }
};

handler.help = ['تشفير', 'obfuscate'];
handler.tags = ['owner'];
handler.command = /^(تشفير|obf|obfuscate)$/i;
handler.owner = true;

export default handler;