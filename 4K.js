/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const uploadToUguu = async (buffer, ext) => {
  const form = new FormData();
  form.append('files[]', buffer, `file.${ext}`);

  try {
    const response = await fetch('https://uguu.se/upload.php', {
      method: 'POST',
      body: form
    });
    const result = await response.json();

    if (!result.files || result.files.length === 0) {
      throw new Error('فشل في رفع الملف إلى Uguu.se');
    }

    return result.files[0].url;
  } catch (error) {
    throw new Error(`فشل في رفع الملف: ${error.message}`);
  }
};

const enhanceImageWithAPI = async (imageUrl, action = 'both', method = 3, size = 'high') => {
  try {
    const params = {
      imageUrl: imageUrl
    };

    if (action === 'both') {
      params.action = 'both';
      params.method = method || 3;
      params.size = size || 'high';
    } else if (action === 'ihancer') {
      params.action = 'ihancer';
      params.method = method || 2;
      params.size = size || 'high';
    } else if (action === 'jpghd') {
      params.action = 'jpghd';
    } else {
      throw new Error('نوع التحسين غير معروف');
    }

    const response = await axios.get(
      `https://engez.a7a.online/api/v1/tools/image-enhance`,
      {
        params: params,
        timeout: 120000,
        responseType: 'arraybuffer'
      }
    );

    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('image')) {
      return {
        success: true,
        imageBuffer: Buffer.from(response.data),
        isBuffer: true,
        action: action
      };
    } else {
      const text = Buffer.from(response.data).toString('utf-8');
      const data = JSON.parse(text);

      if (data?.success && data?.response?.url) {
        return {
          success: true,
          enhancedUrl: data.response.url,
          size: data.response.size || 'غير معروف',
          method: method || 'غير محدد',
          action: action,
          sizeLabel: size || 'غير محدد',
          isBuffer: false
        };
      } else {
        throw new Error(JSON.stringify(data || 'فشل في تحسين الصورة'));
      }
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error ${error.response.status}: ${error.message}`);
    }
    throw new Error(`فشل في تحسين الصورة: ${error.message}`);
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!/image/.test(mime)) {
    return m.reply(
      `✨ *تحسين جودة الصورة بالذكاء الاصطناعي*\n\n` +
      `⚙️ *الاستخدام:*\n` +
      `رد على صورة واستخدم أحد الأوامر:\n\n` +
      `📌 *الأوامر المتاحة:*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔹 *جودة منخفضة (Low) - SD*\n` +
      `• \`.sd\` - عشوائي (1-4)\n` +
      `• \`.sd1\`, \`.sd2\`, \`.sd3\`, \`.sd4\`\n\n` +
      `🔸 *جودة متوسطة (Medium) - HD*\n` +
      `• \`.hd\` - عشوائي (1-4)\n` +
      `• \`.hd1\`, \`.hd2\`, \`.hd3\`, \`.hd4\`\n\n` +
      `🔹 *جودة عالية (High) - FHD*\n` +
      `• \`.fhd\` - عشوائي (1-4)\n` +
      `• \`.fhd1\`, \`.fhd2\`, \`.fhd3\`, \`.fhd4\`\n\n` +
      `🌟 *جودة فائقة:*\n` +
      `• \`.4k\` - JPG HD\n\n` +
      `📝 *مثال:*\n` +
      `\`.4k\` (رد على صورة)\n` +
      `\`.sd3\` (رد على صورة)\n` +
      `\`.hd\` (رد على صورة)\n\n` +
      `⏱️ المدة المتوقعة: 20-60 ثانية`
    );
  }

  let action, method, size, label;

  if (command === 'sd') {
    action = 'ihancer';
    method = Math.floor(Math.random() * 4) + 1;
    size = 'low';
    label = `SD${method}`;
  } else if (command.match(/^sd[1-4]$/)) {
    action = 'ihancer';
    method = parseInt(command.replace('sd', ''));
    size = 'low';
    label = `SD${method}`;
  } else if (command === 'hd') {
    action = 'ihancer';
    method = Math.floor(Math.random() * 4) + 1;
    size = 'medium';
    label = `HD${method}`;
  } else if (command.match(/^hd[1-4]$/)) {
    action = 'ihancer';
    method = parseInt(command.replace('hd', ''));
    size = 'medium';
    label = `HD${method}`;
  } else if (command === 'fhd') {
    action = 'ihancer';
    method = Math.floor(Math.random() * 4) + 1;
    size = 'high';
    label = `FHD${method}`;
  } else if (command.match(/^fhd[1-4]$/)) {
    action = 'ihancer';
    method = parseInt(command.replace('fhd', ''));
    size = 'high';
    label = `FHD${method}`;
  } else if (command === '4k') {
    action = 'jpghd';
    method = null;
    size = null;
    label = '4k';
  } else {
    action = 'ihancer';
    method = Math.floor(Math.random() * 4) + 1;
    size = 'high';
    label = `FHD${method}`;
  }

  const qualityConfig = { action, method, size, label };

  const waitMsg = await m.reply(
    `⏳ *جاري تحسين الصورة...*\n\n` +
    `📤 رفع الصورة إلى الخادم...\n` +
    `🎯 نوع الجودة: *${qualityConfig.label}*\n` +
    `📊 الحجم: *${qualityConfig.size || 'غير محدد'}*\n` +
    `⚙️ الميثود: *${qualityConfig.method || 'غير محدد'}*`
  );

  try {
    const mediaBuffer = await q.download();
    if (!mediaBuffer || mediaBuffer.length === 0) {
      throw new Error('فشل تحميل الصورة');
    }

    const { ext } = await fileTypeFromBuffer(mediaBuffer);

    await conn.sendMessage(m.chat, {
      text: `⏳ *جارٍ رفع الصورة إلى الخادم...*`,
      edit: waitMsg.key
    }).catch(() => {});

    const imageUrl = await uploadToUguu(mediaBuffer, ext || 'jpg');

    if (!imageUrl) {
      throw new Error('فشل رفع الصورة');
    }

    await conn.sendMessage(m.chat, {
      text: `⏳ *جارٍ تحسين الصورة...*\n` +
            `🎯 النوع: *${qualityConfig.label}*\n` +
            `⏱️ قد يستغرق 20-60 ثانية`,
      edit: waitMsg.key
    }).catch(() => {});

    const result = await enhanceImageWithAPI(
      imageUrl, 
      qualityConfig.action, 
      qualityConfig.method, 
      qualityConfig.size
    );

    await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {});

    if (result.isBuffer) {
      await conn.sendMessage(
        m.chat,
        {
          image: result.imageBuffer,
          caption: 
            `✅ *تم تحسين الصورة بنجاح*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🎯 *نوع الجودة:* ${qualityConfig.label}\n` +
            `⚙️ *الميثود:* ${qualityConfig.method || 'تلقائي'}\n` +
            `📊 *الحجم:* ${qualityConfig.size || 'غير محدد'}`
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: result.enhancedUrl },
          caption: 
            `✅ *تم تحسين الصورة بنجاح*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🎯 *نوع الجودة:* ${qualityConfig.label}\n` +
            `📦 *حجم الملف:* ${(result.size / 1024 / 1024).toFixed(2)} MB`
        },
        { quoted: m }
      );
    }

  } catch (error) {
    await conn.sendMessage(m.chat, { delete: waitMsg.key }).catch(() => {});

    let errorMsg = error.message;
    if (errorMsg.length > 4000) {
      errorMsg = errorMsg.slice(0, 4000) + '\n\n... (تم اختصار الرسالة)';
    }

    m.reply(
      `❌ *فشل تحسين الصورة*\n\n` +
      `🔧 *الخطأ:* ${errorMsg}\n\n` +
      `💡 *اقتراحات:*\n` +
      `• تأكد من نوع الجودة المختار\n` +
      `• جرب صورة أصغر حجماً\n` +
      `• انتظر دقيقة وحاول مجدداً`
    );
  }
};

handler.help = ['sd', 'hd', 'fhd', '4k'];
handler.tags = ['ai', 'image'];
handler.command = ['sd', 'sd1', 'sd2', 'sd3', 'sd4', 'hd', 'hd1', 'hd2', 'hd3', 'hd4', 'fhd', 'fhd1', 'fhd2', 'fhd3', 'fhd4', '4k'];

export default handler;