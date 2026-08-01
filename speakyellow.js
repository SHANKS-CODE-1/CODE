/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('يرجى كتابة النص الذي تريد تلوينه، مثال: *.اكتب مرحبا*');

    // النص الذي سيتم تلوينه بالفلتر الأصفر
    text = `=={${text}}==`;

        await conn.relayMessage(
  m.chat,
  {
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              sections: [{
                view_model: {
                  primitive: {
                    text,
                    __typename: "GenAIMarkdownTextUXPrimitive"
                  },
                  __typename: "GenAISingleLayoutViewModel"
                }
              }]
            }))
          },
          contextInfo: {
            forwardingScore: -1,
            isForwarded: true,
            forwardOrigin: 4
          }
        }
      }
    }
  },
  {}
);
}

handler.command = ['اكتب'];
export default handler;