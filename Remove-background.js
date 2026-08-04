/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: ازاله خلفيه من اي صوره
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs';

const removalAi = {
  cookies: new Map(),

  headers: {
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36',
    'accept-language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-ch-ua': '"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"'
  },

  isImageBuffer(buf) {
    if (!buf || !(buf instanceof Uint8Array || Buffer.isBuffer(buf)) || buf.length < 4) {
      return false;
    }
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
    if (buf.length >= 12 &&
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return true;
    if (buf[0] === 0x42 && buf[1] === 0x4D) return true;

    return false;
  },

  saveCookies(res) {
    const setCookies = res.headers.getSetCookie?.() ?? [];
    for (const item of setCookies) {
      const [pair] = item.split(';');
      const [key, ...val] = pair.split('=');
      if (key && val.length) this.cookies.set(key.trim(), val.join('=').trim());
    }
  },

  getCookieHeader() {
    return Array.from(this.cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  },

  async getSecurity() {
    const headers = {
      ...this.headers,
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Accept-Encoding': 'gzip, deflate, br, zstd'
    };
    const cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch('https://removal.ai/', { headers });
    this.saveCookies(res);

    const html = await res.text();
    const match = html.match(/var\s+ajax_upload_object\s*=\s*(\{[\s\S]*?\});/);
    if (!match) throw new Error('ajax_upload_object not found');
    return Function(`return (${match[1]})`)().security;
  },

  async getWebToken(security) {
    const headers = {
      ...this.headers,
      'Connection': 'keep-alive',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://removal.ai/upload/',
      'Accept-Encoding': 'gzip, deflate, br, zstd'
    };
    const cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch(`https://removal.ai/wp-admin/admin-ajax.php?action=ajax_get_webtoken&security=${security}`, { headers });
    this.saveCookies(res);

    const json = await res.json();
    if (!json.success) throw new Error(JSON.stringify(json));
    return json.data.webtoken;
  },

  async removeBackground(input) {
    let buffer;
    let filename = 'image.png';

    if (typeof input === 'string') {
      if (!fs.existsSync(input)) {
        throw new Error(`File not found at path: ${input}`);
      }
      buffer = fs.readFileSync(input);
      filename = input.split('/').pop() || 'image.png';
    } else if (Buffer.isBuffer(input) || input instanceof Uint8Array) {
      buffer = Buffer.from(input);
    } else {
      throw new Error('Invalid input: Must be a file path (string) or Buffer.');
    }

    if (!this.isImageBuffer(buffer)) {
      throw new Error('Invalid file format: File is not a supported image.');
    }

    const security = await this.getSecurity();
    const token = await this.getWebToken(security);

    const form = new FormData();
    form.append('image_file', new Blob([buffer], { type: 'image/png' }), filename);

    const headers = {
      ...this.headers,
      'web-token': token,
      'accept': '*/*',
      'origin': 'https://removal.ai',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'priority': 'u=1, i'
    };
    const cookie = this.getCookieHeader();
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch('https://api.removal.ai/3.0/remove', {
      method: 'POST',
      headers,
      body: form
    });
    this.saveCookies(res);

    return await res.json();
  }
};

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`⚡ يرجى الرد على صورة لإزالة خلفيتها باستخدام الأمر:\n*${usedPrefix + command}*`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        let media = await q.download()
        if (!media) throw new Error('فشل تحميل الصورة')

        let result = await removalAi.removeBackground(media)
        
        if (result && (result.url || result.low_resolution)) {
            let imageUrl = result.url || result.low_resolution
            await conn.sendFile(m.chat, imageUrl, 'no-bg.png', '✨ تم إزالة الخلفية بنجاح', m)
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
            throw new Error('فشل معالجة الصورة من السيرفر')
        }

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await m.reply('❌ حدث خطأ أثناء إزالة الخلفية، تأكد من الصورة وحاول مجدداً.')
    }
}

handler.help = ['ازالة', 'removebg', 'nobg']
handler.tags = ['tools']
handler.command = /^(ازالة|removebg|nobg|إزالة_الخلفية)$/i

export default handler