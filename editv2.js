/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: بحث ايديت تيك توك
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

const botName = `⌁ 𝙎𝙃𝘼𝙉𝙆𝙎 ⌁`;
const myCredit = `❄️ 𝚂𝙷𝙰𝙽𝙺𝚂`;
const channelLink = `https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y`;

function contactQuote(m) {
  return {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'NOXBOT' },
    message: {
      contactMessage: {
        displayName: m.pushName || 'User',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:${botName} ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

async function getHDVideoBuffer(videoUrl) {
  try {
    const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
    const data = res.data?.data;
    
    if (!data) return null;

    const bestQualityUrl = data.hdplay || data.play;
    if (!bestQualityUrl) return null;

    const videoStream = await axios({
      method: 'get',
      url: bestQualityUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      responseType: 'arraybuffer'
    });

    return Buffer.from(videoStream.data);
  } catch (e) {
    return null;
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fkontak = contactQuote(m);

  if (!text) {
    return conn.reply(
      m.chat, 
      `ꕥ *${botName}* ꕥ\n\n📌 *يرجى إدخال كلمة البحث مع الأمر.*\n\n> ✦ *مثال:* ${usedPrefix + command} رصاصه رحمه`, 
      fkontak
    );
  }

  await conn.reply(
    m.chat, 
    `⏳ *جاري البحث وسحب الفيديوهات بأعلى جودة (HD)...*`, 
    fkontak
  );

  try {
    const searchRes = await axios.get(`https://www.monte-dev.online/api/search/tiktok-search?q=${encodeURIComponent(text)}`);
    const videos = searchRes.data?.result?.videos || [];

    if (videos.length === 0) {
      return conn.reply(m.chat, `❌ *لم يتم العثور على أي نتائج.*`, fkontak);
    }

    const topVideos = videos.slice(0, 5);
    let cards = [];

    for (let vid of topVideos) {
      try {
        const videoBuffer = await getHDVideoBuffer(vid.url);
        if (!videoBuffer) continue;

        let media = await prepareWAMessageMedia(
          { video: videoBuffer },
          { upload: conn.waUploadToServer }
        );

        cards.push({
          header: {
            hasMediaAttachment: true,
            videoMessage: media.videoMessage
          },
          body: {
            text: `🎬 *صاحب المقطع:* ${vid.author?.name || 'غير معروف'}\n👁️ *المشاهدات:* ${vid.stats?.plays || 0} | ❤️ *الإعجابات:* ${vid.stats?.likes || 0}\n📝 *الوصف:* ${(vid.desc || 'بدون وصف').substring(0, 60)}...`
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "📥 رابط الفيديو (HD)",
                  url: vid.url,
                  merchant_url: vid.url
                })
              }
            ]
          }
        });
      } catch (err) {
      }
    }

    if (cards.length === 0) {
      return conn.reply(m.chat, `❌ *فشل تجهيز الفيديوهات.*`, fkontak);
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: {
            body: {
              text: `✨ *نتائج بحث تيك توك (HD)* ✨\n\n🔎 *البحث:* ${text}\n📊 *العدد:* ${cards.length}\n\n📢 *قناة البوت:*\n${channelLink}`
            },
            footer: { text: `⌁ ${botName} ⌁\nBy ${myCredit}` },
            carouselMessage: { cards }
          }
        }
      }
    }, { userJid: conn.user.jid, quoted: fkontak });

    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    return conn.reply(m.chat, `❌ *حدث خطأ أثناء البحث:* ${e.message}`, fkontak);
  }
};

handler.command = /^(ايديت|بحث-تيك|tiktoksearch)$/i;
handler.tags = ['downloader', 'search'];
export default handler;