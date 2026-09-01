/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمـطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 is 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: خط رينبو RGP
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let inputText = text || (m.quoted && (m.quoted.text || m.quoted.body)) || "RGB text with animation lmaooo\nBlack text being displayed...";
    
    try {
        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

        
        const htmlPayload = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @keyframes rgbGlow {
    0% { color: #ff0000; text-shadow: 0 0 8px rgba(255, 0, 0, 0.6); }
    33% { color: #00ff00; text-shadow: 0 0 8px rgba(0, 255, 0, 0.6); }
    66% { color: #0000ff; text-shadow: 0 0 8px rgba(0, 0, 255, 0.6); }
    100% { color: #ff0000; text-shadow: 0 0 8px rgba(255, 0, 0, 0.6); }
  }
  body {
    margin: 0;
    padding: 0;
    background: transparent;
  }
  pre {
    font-family: monospace;
    font-size: 15px;
    font-weight: bold;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: hidden;
  }
  .rgb-text {
    animation: rgbGlow 4s infinite linear;
  }
</style>
</head>
<body>
<pre><code class="rgb-text">${inputText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
</body>
</html>`;

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
                        messageText: `\n✨ *تأثير الـ RGB المتحرك*\n`,
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
        m.reply("❌ حدث خطأ أثناء إرسال رسالة الـ RGB!");
    }
};

handler.help = ["rgb <النص>"];
handler.tags = ["tools", "قسم الأدوات🛠️"];
handler.command = /^(rgb|الوان|رينبو)$/i;

export default handler;