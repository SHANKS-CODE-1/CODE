/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎 〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: اضافه ميتا ai للمجموعه 
تحذير: الرقم ممكن يتبند أو الجروب لو مش قوي
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, text }) => {
  try {
    const groupJid = m.chat;

    if (!groupJid.endsWith("@g.us")) {
      return m.reply("❌ هذا الأمر يعمل فقط داخل المجموعات.");
    }

    const res = await conn.groupParticipantsUpdate(
      groupJid,
      ["867051314767696@bot"],
      "add",
    );

    m.reply("✅ تمت إضافة Meta AI إلى المجموعة بنجاح!");
  } catch (e) {
    console.error(e);
    m.reply(String(e?.stack || e));
  }
};

handler.command = /^(addmeta|ضيف-ميتا)$/i;
handler.help = ['ضيف-ميتا'];
handler.tags = ['group'];

export default handler;
