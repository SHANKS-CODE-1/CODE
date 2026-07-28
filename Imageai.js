/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const API_BASE = 'https://engez.a7a.online/api/v1';

const MODELS = [
    { id: '1', label: 'Flux عام' },
    { id: '2', label: 'Flux Anime' },
    { id: '3', label: 'Flux Painting' },
    { id: '4', label: 'Flux Cartoon' },
    { id: '5', label: 'FLUX 3D' },
    { id: '6', label: 'FLUX 3D Mini' },
    { id: '7', label: 'Flux Fantasy' },
    { id: '8', label: 'Flux Sci-Fi' },
    { id: '9', label: 'Flux Realism' },
    { id: '10', label: 'Flux Nature' },
    { id: '11', label: 'Flux Impression' },
    { id: '12', label: 'Flux Surreal' },
    { id: '13', label: 'FLUX PRO' },
    { id: '14', label: 'Turbo' },
    { id: '15', label: 'Gemini Flash' },
    { id: '16', label: 'DaVinci2' },
    { id: '17', label: 'Z Turbo' },
    { id: '18', label: 'FreeGen' },
    { id: '19', label: 'Upsampler FLUX' },
    { id: '20', label: 'TextPet' }
];

async function generateImage(prompt, model) {
    try {
        const params = new URLSearchParams();
        params.append('prompt', prompt);
        params.append('model', model);

        const response = await axios.get(`${API_BASE}/ai/imageai?${params.toString()}`, {
            timeout: 60000
        });

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل توليد الصورة');
        }

        return response.data.response;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال');
    }
}

const sendList = async (m, conn, { body, footer, buttonText, sections }) => {
    try {
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: body },
                        footer: { text: footer || '🎨 AI Image Generator' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: buttonText,
                                    sections
                                })
                            }]
                        }
                    }
                }
            }
        }, { userJid: conn.user.jid, quoted: m });
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.error('sendList error:', e);
        await m.reply(body);
    }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const modelMatch = command.match(/تخيل(\d+)/);
    if (modelMatch) {
        const modelId = modelMatch[1];
        if (!text) {
            return m.reply(
                '❌ *يرجى إدخال وصف الصورة*\n\n' +
                `📌 *مثال:*\n` +
                `• ${usedPrefix}${command} cat\n` +
                `• ${usedPrefix}${command} portrait of a girl`
            );
        }

        await m.react('⏳');

        try {
            await m.reply(`🎨 جاري توليد الصورة...\n📝 ${text}\n🆔 النموذج: ${modelId}`);

            const result = await generateImage(text, modelId);

            if (result?.url) {
                await conn.sendMessage(m.chat, {
                    image: { url: result.url },
                    caption: `🖼️ *تم توليد الصورة*\n📝 *الوصف:* ${text}\n🤖 *النموذج:* ${result.modelName || modelId}`
                }, { quoted: m });

                await m.react('✅');
            } else {
                throw new Error('لم يتم العثور على الصورة');
            }

        } catch (error) {
            await m.react('❌');
            return m.reply(`❌ *خطأ:* ${error.message}`);
        }
        return;
    }

    if (!text) {
        return m.reply(
            '❌ *يرجى إدخال وصف الصورة*\n\n' +
            '📌 *الأوامر المتاحة:*\n' +
            `• ${usedPrefix}توليد cat - يعرض قائمة النماذج\n` +
            `• ${usedPrefix}تخيل15 cat - توليد مباشر بالنموذج 15`
        );
    }

    await m.react('⏳');

    try {
        const sections = [{
            title: '🎨 اختر النموذج',
            rows: MODELS.map(model => ({
                title: model.label,
                description: `🆔 ${model.id}`,
                id: `${usedPrefix}تخيل${model.id} ${text}`
            }))
        }];

        await sendList(m, conn, {
            body: `🖼️ *توليد صورة*\n📝 *الوصف:* ${text}\n\n👇 اختر النموذج المناسب:`,
            footer: '🎨 AI Image Generator',
            buttonText: '📋 اختر نموذج',
            sections
        });

        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        return m.reply(`❌ *خطأ:* ${error.message}`);
    }
};

handler.command = ['توليد', 'generate', 'تخيل', /^تخيل([1-9]|1[0-9]|20)$/];
handler.help = ['توليد', 'تخيل', 'generate'];
handler.tags = ['ai'];

export default handler;
