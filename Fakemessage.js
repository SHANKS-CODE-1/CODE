/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: فيك مسج تقدر تعكس بيها عادي بس خلي بالك 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { delay } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text }) => {
    if (!m.quoted) return m.reply('📌 رد على رسالة + اكتب النص الجديد');
    if (!text) return m.reply('📌 اكتب النص البديل');

    const stanzaId = m.quoted.id;

    try {
        const tempId = await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: '',
                contextInfo: { isGroupStatus: true }
            }
        }, {});

        const tempId2 = await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: { jid: m.chat, fromMe: true, id: tempId },
                type: 14,
                editedMessage: {
                    extendedTextMessage: {
                        text,
                        contextInfo: { isGroupStatus: false }
                    }
                }
            }
        }, { messageId: stanzaId });

        await delay(100);

        await Promise.allSettled([
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: tempId, fromMe: true } }),
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: tempId2, fromMe: true } })
        ]);

        await m.react('✅');
    } catch (e) {
        console.error('[fakemsg]', e);
        m.reply('❌ ' + (e?.message || e));
    }
};

handler.command = /^فيك$/i;
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;

export default handler;