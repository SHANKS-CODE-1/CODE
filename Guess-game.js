/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: لعبه تخمين الارقام + في ملف تاني بي اسم Stop guess لازم تضيفه في البوت عشان تقدر تنهي اي لعبه
╰━━━━━━━━━━━━━━━━━━╯
*/

import { delay } from '@whiskeysockets/baileys';

global.guessGames = global.guessGames || {};

const parseNum = (jid) => (jid || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '');

let handler = async (m, { conn }) => {
    const chatId = m.chat;

    if (!m.isGroup) {
        return m.reply('❌ *هذه اللعبة تعمل داخل المجموعات فقط!*');
    }

    const groupMetadata = await conn.groupMetadata(chatId).catch(() => ({ participants: [] }));
    const participants = groupMetadata.participants || [];

    const botCandidates = [conn.user?.jid, conn.user?.id, conn.user?.lid]
        .filter(Boolean)
        .map(parseNum)
        .filter(Boolean);

    const botGroup = participants.find(p => {
        const pCandidates = [p.id, p.jid, p.lid]
            .filter(Boolean)
            .map(parseNum)
            .filter(Boolean);
        return pCandidates.some(c => botCandidates.includes(c));
    }) || {};

    const isBotAdmin = botGroup.admin === "admin" || botGroup.admin === "superadmin";

    if (!isBotAdmin) {
        return m.reply('❌ *يحتاج البوت ورتبة مشرف (Admin) للتحكم في المجموعة وطرد الخاسرين!*');
    }

    const eligiblePlayers = participants.filter(p => {
        const pCandidates = [p.id, p.jid, p.lid].filter(Boolean).map(parseNum);
        const isAdmin = p.admin === 'admin' || p.admin === 'superadmin';
        const isBot = pCandidates.some(c => botCandidates.includes(c));
        return !isAdmin && !isBot;
    });

    if (eligiblePlayers.length < 2) {
        return m.reply('❌ *لا يوجد عدد كافٍ من الأعضاء غير المشرفين لبدء اللعبة! (مطلوب لاعبين على الأقل)*');
    }

    let players = {};
    eligiblePlayers.forEach(p => {
        const pJid = p.id || p.jid;
        players[pJid] = {
            id: pJid,
            hearts: 10,
            choice: null
        };
    });

    global.guessGames[chatId] = {
        active: true,
        players: players,
        step: 'WAITING'
    };

    await m.reply(`🎮 *بدأت لعبة التخمين الكبرى!*

👥 *عدد المشاركين:* ${Object.keys(players).length} أعضاء (تم استبعاد المشرفين).
🫀 *القلوب:* يبدأ كل لاعب بـ 10 قلوب.
🔒 *قوانين:*
- سيتم إغلاق الروم أثناء التجهيز وفتحها للاختيار.
- لديك 10 ثوانٍ لإرسال رقم من (0 إلى 100).
- أي إرسال لنص غير رقمي = *طرد فوراً!*
- أصحاب الـ 0 قلوب = *طرد من المجموعة!*

⏳ *جاري تغيير رابط المجموعة وإغلاقها لبدء الجولة الأولى...*`);

    await conn.groupRevokeInvite(chatId).catch(() => {});
    runGameLoop(conn, chatId);
};

async function runGameLoop(conn, chatId) {
    const game = global.guessGames[chatId];
    if (!game || !game.active) return;

    let round = 1;

    while (game.active) {
        let activePlayerIds = Object.keys(game.players);

        if (activePlayerIds.length === 1) {
            const winnerId = activePlayerIds[0];
            await conn.groupSettingUpdate(chatId, 'not_announcement').catch(() => {});
            await conn.sendMessage(chatId, {
                text: `🏆 *مبـارررك الفائـز النهائـي!* 🏆\n\n🎉 البطل الوحيد الصامد: *@${winnerId.split('@')[0]}*\n🫀 القلوب المتبقية: ${game.players[winnerId].hearts}\n\nتم فتح المجموعة وإنتهاء اللعبة بنجاح!`,
                mentions: [winnerId]
            });
            delete global.guessGames[chatId];
            break;
        }

        if (activePlayerIds.length === 0) {
            await conn.groupSettingUpdate(chatId, 'not_announcement').catch(() => {});
            await conn.sendMessage(chatId, { text: '💀 *انتهت اللعبة بخسارة جميع اللاعبين وطوردهم!*' });
            delete global.guessGames[chatId];
            break;
        }

        await conn.groupSettingUpdate(chatId, 'announcement').catch(() => {});
        activePlayerIds.forEach(id => { game.players[id].choice = null; });

        await conn.sendMessage(chatId, {
            text: `🔔 *الجـولـة (${round})*\n\n🔒 *تم إغلاق المجموعة.*\n⚡ تجهزوا، سيتم فتح الشات بعد 5 ثوانٍ ولديك 10 ثوانٍ لإرسال رقمك!`
        });

        await delay(5000);
        if (!game.active) return;

        game.step = 'CHOOSING';
        await conn.groupSettingUpdate(chatId, 'not_announcement').catch(() => {});

        const countdownMsg = await conn.sendMessage(chatId, {
            text: `🔓 *تم فتح المجموعة!*\n\n🎯 أرسل الآن رقماً من *0 إلى 100*\n⏳ *الوقت المتبقي: 10 ثوانٍ!*`
        });

        for (let t = 9; t >= 1; t--) {
            await delay(1000);
            if (!game.active) return;
            await conn.sendMessage(chatId, {
                text: `🔓 *تم فتح المجموعة!*\n\n🎯 أرسل الآن رقماً من *0 إلى 100*\n⏳ *الوقت المتبقي: ${t} ثوانٍ!*`,
                edit: countdownMsg.key
            }).catch(() => {});
        }

        await delay(1000);
        if (!game.active) return;

        game.step = 'CALCULATING';
        await conn.groupSettingUpdate(chatId, 'announcement').catch(() => {});

        activePlayerIds.forEach(id => {
            if (game.players[id].choice === null) {
                game.players[id].choice = Math.floor(Math.random() * 101);
            }
        });

        const botNumber = Math.floor(Math.random() * 101);

        let exactMatch = false;
        let closestDistance = Infinity;

        activePlayerIds.forEach(id => {
            const num = game.players[id].choice;
            const dist = Math.abs(num - botNumber);
            if (num === botNumber) exactMatch = true;
            if (dist < closestDistance) closestDistance = dist;
        });

        let roundLog = `🤖 *رقم البوت العشوائي كان:* [ *${botNumber}* ]\n\n`;

        if (exactMatch) {
            roundLog += `🎯 *ما شاء الله! حدث تطابق ممتاز بالرقم!*\n`;
            activePlayerIds.forEach(id => {
                if (game.players[id].choice === botNumber) {
                    roundLog += `✨ *@${id.split('@')[0]}* طابق الرقم وبقي قلوبه كما هي!\n`;
                } else {
                    game.players[id].hearts -= 2;
                    roundLog += `❌ *@${id.split('@')[0]}* اختار (${game.players[id].choice}) وخسر -2 🫀\n`;
                }
            });
        } else {
            roundLog += `⭐ *أقرب تخمين كان بفارق (${closestDistance}):*\n`;
            activePlayerIds.forEach(id => {
                const dist = Math.abs(game.players[id].choice - botNumber);
                if (dist === closestDistance) {
                    roundLog += `👑 *@${id.split('@')[0]}* كان الأقرب باختياره (${game.players[id].choice}) ولم يخسر شيئاً!\n`;
                } else {
                    game.players[id].hearts -= 1;
                    roundLog += `❌ *@${id.split('@')[0]}* اختار (${game.players[id].choice}) وخسر -1 🫀\n`;
                }
            });
        }

        let playersToKick = [];
        activePlayerIds.forEach(id => {
            if (game.players[id].hearts <= 0) {
                playersToKick.push(id);
                delete game.players[id];
            }
        });

        roundLog += `\n📊 *وضع القلوب الحالي:* \n`;
        Object.keys(game.players).forEach(id => {
            roundLog += `• *@${id.split('@')[0]}*: ${game.players[id].hearts} 🫀\n`;
        });

        await conn.sendMessage(chatId, {
            text: roundLog,
            mentions: activePlayerIds
        });

        if (playersToKick.length > 0) {
            await conn.sendMessage(chatId, {
                text: `🚪 *تم استبعاد وطرد اللاعبين منتهيي القلوب:* \n` + playersToKick.map(p => `@${p.split('@')[0]}`).join('\n'),
                mentions: playersToKick
            });

            for (let target of playersToKick) {
                await conn.groupParticipantsUpdate(chatId, [target], 'remove').catch(() => {});
                await delay(500);
            }
        }

        round++;
        await delay(4000);
        if (!game.active) return;
    }
}

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const game = global.guessGames[chatId];

    if (!game || !game.active || game.step !== 'CHOOSING') return;

    const senderNum = parseNum(m.sender);

    const playerKey = Object.keys(game.players).find(key => parseNum(key) === senderNum);

    if (playerKey) {
        const text = m.text ? m.text.trim() : '';

        if (isNaN(text) || text === '' || parseInt(text) < 0 || parseInt(text) > 100) {
            await m.reply(`⚠️ *@${m.sender.split('@')[0]}* أرسلت إجابة غير صالحة! (قانون اللعبة: إرسال أرقام فقط من 0 إلى 100). تم طردك!`, null, { mentions: [m.sender] });

            delete game.players[playerKey];
            await conn.groupParticipantsUpdate(chatId, [m.sender], 'remove').catch(() => {});
            return;
        }

        if (game.players[playerKey].choice === null) {
            game.players[playerKey].choice = parseInt(text);
            await m.react('✅');
        }
    }
};

handler.help = ['لعبة'];
handler.tags = ['games'];
handler.command = /^لعبة$/i;

export default handler;