/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
الوظيفه: كود تست بيكتب I'm back معدله بتاعي فاجر عمتا 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { delay } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    let animatedText = "I'm back";

    let { key } = await conn.sendMessage(m.chat, { text: "..." });
    let currentText = '';
                                                                    for (let i = 0; i < animatedText.length; i++) {
        currentText += animatedText[i];
        conn.sendMessage(m.chat, { text: currentText + '█', edit: key }).catch(() => {});                                               await delay(100);
    }                                                           
    await conn.sendMessage(m.chat, { text: animatedText, edit: key });
};                                                              
handler.command = ['تست'];                                
export default handler;