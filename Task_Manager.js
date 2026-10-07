/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
╰━━━━━━━━━━━━━━━━━━╯
*/

/*╭━━━〔 مدير المهام — Task Manager & Reminders 〕━━━╮
│ .task add <الوقت> <نص المهمة>   - إضافة مهمة شخصية ليك في القروب ده
│ .task list                      - مهامك في القروب ده
│ .task all                       - كل مهام القروب (أدمن/أونر بس)
│ .task done <رقم المهمة>         - تعليم المهمة كمنتهية (وحذفها)
│ .task del <رقم المهمة>          - حذف مهمة من غير تنفيذ
│
│ صيغة الوقت المقبولة:
│  » نسبي: 30m (دقيقة) / 2h (ساعة) / 1d (يوم) / 1d2h30m (مجمّع)
│  » وقت اليوم: 18:30 (لو الوقت فات هيتحط بكرة تلقائي)
│  » تاريخ كامل: 2026-10-10 18:30
│
│ البوت بيفحص المهام المستحقة كل 30 ثانية، وأول ما ميعاد مهمة يجي
│ بيبعت تنبيه في نفس القروب بمنشن الشخص.
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');
const CHECK_INTERVAL = 30 * 1000; 


let tasks = {}; 

function loadTasks() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || {};
        }
    } catch (e) {
        console.error('[Task] فشل تحميل tasks.json:', e);
        tasks = {};
    }
}

let saveTimer = null;
function saveTasks() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        try {
            fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
            fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
        } catch (e) {
            console.error('[Task] فشل حفظ tasks.json:', e);
        }
    }, 1500);
}

loadTasks();


function nextId(chat) {
    const entries = tasks[chat] ? Object.keys(tasks[chat]) : [];
    let n = entries.length + 1;
    while (tasks[chat] && tasks[chat][String(n)]) n++;
    return String(n);
}

function fmtTime(ts) {
    return new Date(ts).toLocaleString('ar-EG', {
        hour12: true,
        timeZone: 'Africa/Cairo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}


function parseWhen(input) {
    input = (input || '').trim();
    if (!input) return null;

    
    if (/^(\d+d)?(\d+h)?(\d+m)?$/i.test(input) && /\d/.test(input)) {
        const d = parseInt((input.match(/(\d+)d/i) || [0, 0])[1]) || 0;
        const h = parseInt((input.match(/(\d+)h/i) || [0, 0])[1]) || 0;
        const mi = parseInt((input.match(/(\d+)m/i) || [0, 0])[1]) || 0;
        if (d || h || mi) return Date.now() + d * 86400000 + h * 3600000 + mi * 60000;
    }

    
    let m = input.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})$/);
    if (m) {
        const [, y, mo, d, h, mi] = m.map(Number);
        return new Date(y, mo - 1, d, h, mi, 0, 0).getTime();
    }

    
    m = input.match(/^(\d{1,2}):(\d{2})$/);
    if (m) {
        const [, h, mi] = m.map(Number);
        const now = new Date();
        const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, mi, 0, 0);
        if (dt.getTime() <= Date.now()) dt.setDate(dt.getDate() + 1);
        return dt.getTime();
    }

    return null;
}


async function checkDueTasks(conn) {
    const now = Date.now();
    for (const chat of Object.keys(tasks)) {
        const chatTasks = tasks[chat];
        for (const id of Object.keys(chatTasks)) {
            const t = chatTasks[id];
            if (t.dueAt <= now) {
                try {
                    await conn.sendMessage(chat, {
                        text:
                            `⏰ *تذكير مهمة!*\n\n` +
                            `👤 @${t.userId.split('@')[0]}\n` +
                            `📝 المهمة: ${t.text}\n` +
                            `🕐 الموعد: ${fmtTime(t.dueAt)}`,
                        mentions: [t.userId]
                    });
                } catch (e) {
                    console.error('[Task] فشل إرسال تنبيه:', e);
                }
                delete chatTasks[id];
                saveTasks();
            }
        }
    }
}


const handler = async (m, { conn, args, text }) => {
    const sub = (args[0] || '').toLowerCase();
    const chat = m.chat;

    if (!m.isGroup) {
        return m.reply('❌ مدير المهام شغال جوه الجروبات بس (عشان التنبيهات بتتبعت فيها).');
    }

    if (sub === 'add' || sub === 'اضافة' || sub === 'إضافة') {
        const rest = args.slice(1);
        const when = rest[0];
        const taskText = rest.slice(1).join(' ');

        if (!when || !taskText) {
            return m.reply(
                '❌ الصيغة:\n*.task add <الوقت> <نص المهمة>*\n\n' +
                'أمثلة:\n» .task add 30m اتصل بالعميل\n» .task add 18:30 تسليم التقرير\n» .task add 2026-10-10 18:30 اجتماع الفريق'
            );
        }

        const dueAt = parseWhen(when);
        if (!dueAt) {
            return m.reply('❌ مش فاهم الوقت ده. استخدم: 30m / 2h / 1d، أو 18:30، أو 2026-10-10 18:30');
        }

        tasks[chat] = tasks[chat] || {};
        const id = nextId(chat);
        tasks[chat][id] = {
            id,
            userId: m.sender,
            userName: m.pushName || 'غير معروف',
            text: taskText,
            dueAt,
            createdAt: Date.now()
        };
        saveTasks();

        return m.reply(`✅ اتضافت المهمة رقم *${id}*\n📝 ${taskText}\n🕐 الموعد: ${fmtTime(dueAt)}`);
    }

    if (sub === 'list' || sub === 'قائمة' || sub === '') {
        const mine = Object.values(tasks[chat] || {}).filter(t => t.userId === m.sender);
        if (!mine.length) return m.reply('📭 مفيش مهام مسجلة ليك في القروب ده.');

        mine.sort((a, b) => a.dueAt - b.dueAt);
        const lines = mine.map(t => `*${t.id}.* ${t.text}\n   🕐 ${fmtTime(t.dueAt)}`);
        return m.reply(`📋 *مهامك:*\n\n${lines.join('\n\n')}`);
    }

    if (sub === 'all' || sub === 'الكل') {
        const list = Object.values(tasks[chat] || {});
        if (!list.length) return m.reply('📭 مفيش مهام مسجلة في القروب ده.');

        list.sort((a, b) => a.dueAt - b.dueAt);
        const lines = list.map(t => `*${t.id}.* ${t.text}\n   👤 ${t.userName}\n   🕐 ${fmtTime(t.dueAt)}`);
        return m.reply(`📋 *كل مهام القروب:*\n\n${lines.join('\n\n')}`);
    }

    if (sub === 'done' || sub === 'تم') {
        const id = args[1];
        const t = tasks[chat] && tasks[chat][id];
        if (!t) return m.reply('❌ مفيش مهمة بالرقم ده.');
        if (t.userId !== m.sender) return m.reply('❌ دي مش مهمتك.');
        delete tasks[chat][id];
        saveTasks();
        return m.reply(`✅ اتعلّمت المهمة *${id}* كمنتهية وتشالت.`);
    }

    if (sub === 'del' || sub === 'حذف') {
        const id = args[1];
        const t = tasks[chat] && tasks[chat][id];
        if (!t) return m.reply('❌ مفيش مهمة بالرقم ده.');
        if (t.userId !== m.sender) return m.reply('❌ دي مش مهمتك.');
        delete tasks[chat][id];
        saveTasks();
        return m.reply(`🗑️ اتحذفت المهمة *${id}*.`);
    }

    return m.reply(
        '📋 *مدير المهام*\n\n' +
        '» .task add <الوقت> <نص المهمة>\n' +
        '» .task list\n' +
        '» .task all (أدمن/أونر)\n' +
        '» .task done <رقم>\n' +
        '» .task del <رقم>'
    );
};

handler.help = ['task add', 'task list', 'task done', 'task del'];
handler.tags = ['tools'];
handler.command = ['task', 'مهمة', 'مهام'];
handler.group = true;


handler.all = async function () {
    if (global.__taskReminderStarted) return;
    global.__taskReminderStarted = true;
    const conn = this;
    setInterval(() => checkDueTasks(conn), CHECK_INTERVAL);
    console.log('[Task] فاحص التنبيهات اشتغل.');
};

export default handler;