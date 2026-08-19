/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
الوظيفه: بتوقف لعبه التخمين ++ لعبه التخمين اسمها Guess game
╰━━━━━━━━━━━━━━━━━━╯
*/

global.guessGames = global.guessGames || {};

let handler = async (m, { conn }) => {
    const chatId = m.chat;
    const game = global.guessGames[chatId];

    if (!game || !game.active) {
        return m.reply('❌ *لا توجد لعبة تخمين قائمة حالياً في هذه المجموعة.*');
    }

    game.active = false;
    game.step = 'STOPPED';

    delete global.guessGames[chatId];

    await conn.groupSettingUpdate(chatId, 'not_announcement').catch(() => {});
    await m.reply('🛑 *تم إيقاف لعبة التخمين بواسطة الأدمن.*\n🔓 تم فتح المجموعة مرة أخرى.');
};

handler.help = ['وقف-لعبة'];
handler.tags = ['games'];
handler.command = /^وقف-لعبة$/i;

export default handler;