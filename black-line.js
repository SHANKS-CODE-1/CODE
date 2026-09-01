/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمـطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 is 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: تحويل اي رساله او كود لي خط اسود جديده محدش عاملها قبلي و اي شخص هيقولك غير كذا يبقي فاشل 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let inputText = text || (m.quoted && (m.quoted.text || m.quoted.body)) || "";
    
    if (!inputText) {
        return m.reply(`❌ يرجى كتابة النص الذي تريد تحويله إلى الخط الأسود، مثال:\n\n*${usedPrefix + command} السلام عليكم*`);
    }

    try {
        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

     
        const htmlPayload = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n</head>\n<body style="margin:0;padding:0;background:transparent;">\n<pre style="font-family: monospace; font-size: 15px; font-weight: bold; white-space: pre-wrap; word-break: break-word; overflow-x: hidden;"><code>${inputText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>\n</body>\n</html>`;

        const sectionsData = [
            {
                view_model: {
                    primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: htmlPayload,
                        trusted_sources: ["shanks.dev"]
                    },
                    __typename: "GenAISingleLayoutViewModel"
                }
            }
        ];

        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [
                    {
                        messageType: 2,
                        messageText: `\n✨ *النص الأسود المميز*\n`,
                    }
                ],
                unifiedResponse: {
                    data: Buffer.from(
                        JSON.stringify({
                            response_id: generateUUID(),
                            sections: sectionsData
                        })
                    ).toString("base64")
                },
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
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
            quoted: m
        });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء إرسال النص الأسود!");
    }
};

handler.help = ["اسود <النص>", "خط <النص>"];
handler.tags = ["tools", "قسم الأدوات🛠️"];
handler.command = /^(اسود|خط|code_black)$/i;

export default handler;