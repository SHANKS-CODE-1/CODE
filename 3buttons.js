/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: ثلاث ازرار جنب بعض 
╰━━━━━━━━━━━━━━━━━━╯
*/
let handler = async (m, { conn }) => {
  try {
    
    await conn.sendMessage(m.chat, {
      react: {
        text: "⏳",
        key: m.key
      }
    });

    
    await conn.relayMessage(
      m.chat,
      {
        interactiveMessage: {
          header: {
            title: "tes"
          },
          body: {
            text: "tes"
          },
          footer: {
            text: "tes"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: ""
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "tes",
                  id: ".تست"
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "tes2",
                  id: ".tes2"
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "tes3",
                  id: ".tes3"
                })
              }
            ],
            messageParamsJson: "{}"
          },
          interactiveMessage: "nativeFlowMessage"
        }
      },
      {}
    );
    await conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: m.key
      }
    });

  } catch (e) {
    console.error('[Three Buttons Error]:', e);
    await m.reply(String(e.stack || e));
  }
}

handler.help = ['ثلاثه']
handler.tags = ['tools']
handler.command = /^(ثلاثه|ثلاثة|three)$/i

export default handler