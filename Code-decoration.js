/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎 〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: زخرفه الاكواد مع الحفاظ علي كل الوظائف 
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let codeToDecorate = m.quoted ? (m.quoted.text || '') : text;

    if (!codeToDecorate) {
        return m.reply(`⚡ يرجى الرد على الكود الذي تريد زخرفته مع كتابة وصف الزخرفة، أو كتابة الأمر متبوعاً بالوصف والكود:\n\n*مثال:* ${usedPrefix + command} قم بإضافة زخرفة إيموجي نيون وهيدر فخم للرسائل\n(أو قم بالرد على الكود مباشرة)`);
    }

    let decorationStyle = text;
    if (m.quoted && !text) {
        decorationStyle = "قم بزخرفة النص/الكود بشكل فخم واحترافي مع إضافة إيموجيات وهيدرات وفوتر مناسبين";
    }

    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });

    try {
        const systemPrompt = `أنت خبير في زخرفة وتنسيق الأكواد والرسائل لبرمجيات البوتات.
المطلوب منك:
1. تطبيق الزخرفة المطلوبة حسب هذا الوصف: "${decorationStyle}".
2. الحفاظ الكامل والشرس على منطق الكود الاصلي (Code Logic)، المتغيرات، الدوال، والـ Syntax دون تعديل أو حذف أي جزء من الكود البرمجي.
3. التنسيق يتم فقط على النصوص الموجهة للمستخدم مثل (m.reply, conn.sendMessage, console.log, النصوص الزخرفية، الهيدر، الفوتر).
4. قم بإرجاع الكود المعدل فقط دون أي مقدمات أو شروحات جانبية أو نصوص خارج الكود.`;

        const fullPrompt = `${systemPrompt}\n\nالكود المراد زخرفته:\n${codeToDecorate}`;

        const apiUrl = `https://engez.a7a.online/api/v1/ai/gpt?prompt=${encodeURIComponent(fullPrompt)}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        let decoratedCode = data.result || data.response || data.data || data.message;

        if (typeof decoratedCode === 'object') {
            decoratedCode = JSON.stringify(decoratedCode, null, 2);
        }

        if (!decoratedCode) throw new Error("لم يتم استلام رد صالح من الذكاء الاصطناعي");

        decoratedCode = decoratedCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '').trim();

        await m.reply(decoratedCode);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`❌ حدث خطأ أثناء زخرفة الكود:\n${e.message}`);
    }
};

handler.help = ['زخرف_كود <الوصف>'];
handler.tags = ['tools', 'ai'];
handler.command = /^(زخرف_كود|زخرفة_كود|زخرف-كود)$/i;

export default handler;
