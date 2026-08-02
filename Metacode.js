/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: يعرض الملفات علي شكل مكعب ميتا و يضيف و يمسح:
الأوامر:
بلوقن لست:عرض قائمه الأوامر
بلوقن عرض: عرض كود معين داخل البوت
بلوقن اضف:اضافه كود جديد بي اسم بعد الأمر و الريبلاي
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { downloadContentFromMessage, generateWAMessageFromContent, proto, generateMessageIDV2 } from "@whiskeysockets/baileys";
import { theme } from '../lib/theme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args, usedPrefix }) => {

    const react = async (e) => {
        try { await conn.sendMessage(m.chat, { react: { text: e, key: m.key } }); } catch {}
    };

    const pluginsDir = __dirname;
    const currentFile = path.basename(__filename);
    const getPlugins = () => fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js") && f !== currentFile);

    const findPlugin = (name) => {
        let searchName = name.replace(/\.js$/i, "").trim().toLowerCase();
        searchName = searchName.replace(/\s+/g, '-');
        const allFiles = getPlugins();
        
        let found = allFiles.find(f => f.toLowerCase() === searchName + ".js");
        if (found) return found;
        
        found = allFiles.find(f => f.replace(/-/g, '_').toLowerCase() === searchName.replace(/-/g, '_') + ".js");
        if (found) return found;
        
        found = allFiles.find(f => f.toLowerCase().includes(searchName));
        if (found) return found;
        
        found = allFiles.find(f => searchName.includes(f.replace(".js", "").toLowerCase()));
        if (found) return found;
        
        return null;
    };

    const action = (args[0] || "").toLowerCase();

    if (/^(عرض|show|get)$/i.test(action)) {
        const nameArg = args.slice(1).join(" ").trim();
        if (!nameArg) return m.reply(theme.build([
            { type: 'title', text: '📄 عـرض بـلـوقـن' },
            { type: 'info', label: '📌 الاستخدام', value: `${usedPrefix}بلوقن عرض <اسم>` }
        ]));

        const foundFile = findPlugin(nameArg);
        if (!foundFile) {
            await react("❌");
            return m.reply(theme.build([
                { type: 'title', text: '❌ خـطـأ' },
                { type: 'error', text: `الملف "${nameArg}" غير موجود` },
                { type: 'divider' },
                { type: 'line', text: '💡 جرب .بلوقن لست لعرض كل الملفات' }
            ]));
        }

        await react("⏳");

        const filePath = path.join(pluginsDir, foundFile);
        const code = fs.readFileSync(filePath, "utf-8");

        try {
            const codeLines = code.split('\n');
            
            const submessages = [
                {
                    messageType: 2,
                    messageText: `\n📄 *${foundFile}*\n📦 الحجم: ${(code.length / 1024).toFixed(2)} KB\n📝 ${codeLines.length} سطر\n`,
                },
                {
                    messageType: 5,
                    codeMetadata: {
                        codeLanguage: "javascript",
                        codeBlocks: [
                            {
                                highlightType: 1,
                                codeContent: code
                            }
                        ]
                    }
                }
            ];

            const richMessage = {
                richResponseMessage: {
                    messageType: 1,
                    submessages: submessages,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 1,
                        forwardedAiBotMessageInfo: { 
                            botJid: "867051314767696@bot"
                        },
                        forwardOrigin: 4
                    }
                }
            };

            const msg = await generateWAMessageFromContent(m.chat, { 
                botForwardedMessage: { message: richMessage } 
            }, {
                senderId: conn.user.id,
                userJid: conn.user.id,
                messageId: generateMessageIDV2(conn.user.id),
                quoted: m
            });

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            await react("📄");
            
        } catch (metaErr) {
            console.error("Meta AI Error:", metaErr);
            const copyButton = {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: '📋 نسخ الكود',
                    copy_code: code
                })
            };

            const menuText = theme.build([
                { type: 'title', text: foundFile },
                { type: 'info', label: '📦 الحجم', value: `${(code.length / 1024).toFixed(2)} KB` },
                { type: 'divider' },
                { type: 'line', text: '⚔️ اضغط على الزر أدناه لنسخ الكود' }
            ]);

            const interactiveMessage = {
                body: { text: menuText },
                footer: { text: '✧ 𝙎𝙃𝘼𝙉𝙆𝙎 𝐵𝛩𝑇 ✧' },
                nativeFlowMessage: {
                    buttons: [copyButton]
                }
            };

            const msg2 = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
                    }
                }
            }, { userJid: conn.user.jid, quoted: m });

            await conn.relayMessage(m.chat, msg2.message, { messageId: msg2.key.id });
            await react("📄");
        }
        return;
    }

    if (/^(لست|list)$/i.test(action)) {
        const plugins = getPlugins();
        if (!plugins.length) {
            await react("📦");
            return m.reply(theme.build([
                { type: 'title', text: '📂 لا يـوجـد' },
                { type: 'subtitle', text: 'لا يوجد أي بلوقنات' }
            ]));
        }

        const lines = [`${theme.divider}`, `│`, `│ 📦 *قـائـمـة الـبـلـوقـنـات*`, `│`];
        plugins.forEach((f, i) => {
            const name = f.replace(".js", "");
            lines.push(`│ ${i + 1}. ${name}`);
        });
        lines.push(`│`, `│ 📊 المجموع: ${plugins.length} بلوقن`);
        lines.push(`${theme.endDivider}`);

        await react("📦");
        return m.reply(lines.join("\n"));
    }

    if (/^(حذف|delete|del|remove)$/i.test(action)) {
        const nameArg = args.slice(1).join(" ").trim();
        if (!nameArg) return m.reply(theme.build([
            { type: 'title', text: '🗑️ حـذف بـلـوقـن' },
            { type: 'info', label: '📌 الاستخدام', value: `${usedPrefix}بلوقن حذف <اسم>` }
        ]));

        const foundFile = findPlugin(nameArg);
        if (!foundFile) {
            await react("❌");
            return m.reply(theme.build([
                { type: 'title', text: '❌ خـطـأ' },
                { type: 'error', text: `الملف "${nameArg}" غير موجود` },
                { type: 'divider' },
                { type: 'line', text: '💡 جرب .بلوقن لست لعرض كل الملفات' }
            ]));
        }

        const filePath = path.join(pluginsDir, foundFile);
        const code = fs.readFileSync(filePath, "utf-8");
        const fileSize = (code.length / 1024).toFixed(2);
        const lineCount = code.split('\n').length;

        fs.unlinkSync(filePath);
        if (global.plugins?.[foundFile]) delete global.plugins[foundFile];

        await react("🗑️");
        return m.reply(theme.build([
            { type: 'title', text: '🗑️ تـم الـحـذف' },
            { type: 'divider' },
            { type: 'info', label: '📄 الملف', value: foundFile },
            { type: 'info', label: '📦 الحجم', value: `${fileSize} KB` },
            { type: 'info', label: '📝 الأسطر', value: `${lineCount} سطر` }
        ]));
    }

    if (/^(اضف|اضافه|اضافة|add)$/i.test(action)) {
        const quoted = m.quoted;
        if (!quoted) {
            await react("❌");
            return m.reply(theme.build([
                { type: 'title', text: '❌ خـطـأ' },
                { type: 'error', text: 'رد على كود أو ملف البلوقن' }
            ]));
        }

        await react("⏳");

        let code = "";
        let fileName = "";
        
        const customName = args.slice(1).join(" ").trim();

        const docMsg = quoted.message?.documentMessage ||
            quoted.message?.documentWithCaptionMessage?.message?.documentMessage || null;

        if (docMsg) {
            let buffer;
            try { buffer = await quoted.download(); } catch {
                try {
                    const stream = await downloadContentFromMessage(docMsg, "document");
                    const chunks = [];
                    for await (const c of stream) chunks.push(c);
                    buffer = Buffer.concat(chunks);
                } catch (e) {
                    await react("❌");
                    return m.reply(`❌ فشل تحميل الملف: ${e.message}`);
                }
            }
            
            if (customName) {
                const cleanName = customName.replace(/\.js$/i, "").trim().replace(/\s+/g, '-');
                fileName = `${cleanName}.js`;
            } else {
                const baseName = (docMsg.fileName || `plugin_${Date.now()}`).replace(/\.js$/i, "");
                fileName = `${baseName}.js`;
            }
            
            code = buffer.toString("utf-8");
        } else {
            code = quoted.text || quoted.body || "";
            if (!code.trim()) {
                await react("❌");
                return m.reply(theme.build([
                    { type: 'title', text: '❌ خـطـأ' },
                    { type: 'error', text: 'الرسالة مش فيها كود' }
                ]));
            }
            
            if (customName) {
                const cleanName = customName.replace(/\.js$/i, "").trim().replace(/\s+/g, '-');
                fileName = `${cleanName}.js`;
            } else {
                let extractedName = null;
                
                const cmdMatch1 = code.match(/handler\.command\s*=\s*\/\^\(?([^)\/|\\s]+)/);
                if (cmdMatch1) extractedName = cmdMatch1[1].trim();
                
                if (!extractedName) {
                    const cmdMatch2 = code.match(/handler\.command\s*=\s*\[['"`]([^'"`]+)['"`]\]/);
                    if (cmdMatch2) extractedName = cmdMatch2[1].trim();
                }
                
                if (!extractedName) {
                    const cmdMatch3 = code.match(/command\s*:\s*['"`]([^'"`]+)['"`]/);
                    if (cmdMatch3) extractedName = cmdMatch3[1].trim();
                }
                
                if (!extractedName) {
                    const fileMatch = code.match(/plugins\/([a-zA-Z0-9_-]+)\.js/);
                    if (fileMatch) extractedName = fileMatch[1].trim();
                }
                
                if (!extractedName) {
                    extractedName = `plugin_${Date.now()}`;
                }
                
                fileName = `${extractedName}.js`;
            }
        }

        const savePath = path.join(pluginsDir, fileName);
        const isEdit = fs.existsSync(savePath);
        fs.writeFileSync(savePath, code, "utf-8");

        const fileSize = (code.length / 1024).toFixed(2);
        const lineCount = code.split('\n').length;

        await react("✅");
        return m.reply(theme.build([
            { type: 'title', text: isEdit ? '✏️ تـم الـتـعـديـل' : '✅ تـم الإضـافـة' },
            { type: 'divider' },
            { type: 'info', label: '📄 الملف', value: fileName },
            { type: 'info', label: '📦 الحجم', value: `${fileSize} KB` },
            { type: 'info', label: '📝 الأسطر', value: `${lineCount} سطر` }
        ]));
    }

    await react("📦");
    const helpText = theme.build([
        { type: 'title', text: '📦 إدارة الـبـلـوقـنـات' },
        { type: 'divider' },
        { type: 'info', label: '📋 لست', value: 'قائمة كل البلوقنات' },
        { type: 'info', label: '📄 عرض', value: 'عرض الكود (Meta AI)' },
        { type: 'info', label: '➕ اضف', value: 'إضافة بلوقن جديد (مع الاسم)' },
        { type: 'info', label: '🗑️ حذف', value: 'حذف بلوقن' },
        { type: 'divider' },
        { type: 'info', label: '📌 مثال', value: `${usedPrefix}بلوقن اضف myplugin` }
    ]);

    return m.reply(helpText);
};

handler.help = ["بلوقن لست", "بلوقن عرض", "بلوقن اضف", "بلوقن حذف"];
handler.tags = ["owner"];
handler.command = /^(بلوقن|plugin|plugins)$/i;
handler.owner = true;

export default handler;