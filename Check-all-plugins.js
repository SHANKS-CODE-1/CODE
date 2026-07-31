/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: فحص كل البلوجن و هيقول لك لو في مكتبه ناقصه ولا لا و ايه الاسم و ايه الخطاء في الكود ده لو في
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const handler = async (m, { conn }) => {
  const pluginDir = './plugins';
  const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  if (files.length === 0) return m.reply('🧞 لا يوجد أي بلوجنات للتنفيذ.');

  m.reply(`🧞 جاري تحميل وتشغيل ${files.length} بلوجن...\n`);

  for (const file of files) {
    const fullPath = path.join(pluginDir, file);
    try {
      const plugin = await import(path.resolve(fullPath));
      
      if (plugin?.default?.handler) {
       
        await plugin.default.handler(m, { conn, text: '', usedPrefix: '', command: '' });
        m.reply(`✅ تم تنفيذ البلوجن: ${file}`);
      } else {
        console.log(chalk.yellow(`⚠️ لا يوجد handler في ${file}`));
      }
    } catch (e) {
      m.reply(`❌ خطأ في تشغيل البلوجن ${file}:\n${e.message}`);
    }
  }

  m.reply('🧞 انتهى تنفيذ جميع البلوجنز.');
};

handler.help = ['تشغيل_الكل'];
handler.command = ['افحصهم'];
handler.tags = ['tools'];

export default handler;