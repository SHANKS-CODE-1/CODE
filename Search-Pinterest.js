/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: بحث بنتر
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios'

process.env.NEWSLETTER_ID = "120363426042842162@newsletter"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const query = text?.trim()

  if (!query) {
    return await m.reply(
      `> ❄️ *𝙎𝙃𝘼𝙉𝙆𝙎: "Pinterest Search"*
> 
> 🔍 بحث صور Pinterest
> 
> 📌 *الاستخدام:*
> \`${usedPrefix + command} Zhao Lusi\`
> \`${usedPrefix + command} anime cat\`
> 
> 𝑺𝑯𝑨𝑵𝑲𝑺 𝐁𝐎𝐓❄️`
    )
  }

  await m.react('🔍')

  try {
    const { data } = await axios.get(
      `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`,
      { timeout: 15000 }
    )

    const results = data?.data?.slice(0, 10)
    if (!results || results.length === 0) {
      await m.react('❌')
      return await m.reply(
        `> ❄️ *𝙎𝙃𝘼𝙉𝙆𝙎: "Pinterest Search"*
> 
> ❌ لا توجد نتائج لـ: *${query}*\n\n𝑺𝑯𝑨𝑵𝑲𝑺 𝐁𝐎𝐓❄️`
      )
    }

    const botJid = conn.user?.id || conn.user?.jid || '0@bot'
    const randomImg = results[Math.floor(Math.random() * results.length)].image_url

    const contextInfo = {
      mentionedJid: [],
      groupMentions: [],
      statusAttributions: [],
      stanzaId: m.key?.id,
      participant: m.sender,
      remoteJid: m.chat,
      forwardingScore: 1,
      isForwarded: true,
      forwardedAiBotMessageInfo: { botJid },
      forwardOrigin: 4
    }

    const single = (primitive) => ({
      view_model: { primitive, __typename: 'GenAISingleLayoutViewModel' }
    })

    const multi = (primitives, __typename = 'GenAIHScrollLayoutViewModel') => ({
      view_model: { primitives, __typename }
    })

    const sections = [
      single({
        text: `# 🥙 ${query.toUpperCase()}`,
        __typename: 'GenAIMarkdownTextUXPrimitive'
      }),
      single({
        media: { url: randomImg, mime_type: 'image/jpeg' },
        imagine_type: 'IMAGE',
        status: { status: 'READY' },
        __typename: 'GenAIImaginePrimitive'
      }),
      single({
        text: '- 🌭 *للحصول على الصور، افتح إحدى الصور أدناه وحمّلها من Pinterest*\n',
        __typename: 'GenAIMarkdownTextUXPrimitive'
      }),
      multi(
        results.map(item => ({
          title             : item?.grid_title || '-',
          subtitle          : item?.description?.trim() || '-',
          username          : item?.pinner?.username || 'pinterest',
          profile_picture_url: item?.pinner?.image_small_url || randomImg,
          is_verified       : true,
          thumbnail_url     : item?.image_url,
          post_caption      : item?.grid_title || '-',
          likes_count       : 1,
          comments_count    : 1,
          shares_count      : 1,
          post_url          : item?.pin,
          post_deeplink     : item?.pin,
          source_app        : 'INSTAGRAM',
          footer_label      : 'هل تريد اختيار هذه الصورة؟ اضغط هنا',
          footer_icon       : randomImg,
          is_carousel       : false,
          orientation       : 'LANDSCAPE',
          post_type         : 'PHOTO',
          __typename        : 'GenAIPostPrimitive'
        })),
        'GenAIHScrollLayoutViewModel'
      )
    ]

    await conn.relayMessage(m.chat, {
      messageContextInfo: {
        deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
        deviceListMetadataVersion: 2,
        botMetadata: {
          messageDisclaimerText: '',
          richResponseSourcesMetadata: { sources: [] }
        }
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [{ messageType: 2, messageText: `نتائج Pinterest: ${query}` }],
            unifiedResponse: {
              data: Buffer.from(JSON.stringify({
                response_id: `pins-${Date.now()}`,
                sections
              })).toString('base64')
            },
            contextInfo
          }
        }
      }
    }, {})

    await m.react('✅')

  } catch (err) {
    console.error('[SHANKS-Pins]', err)
    await m.react('❌')
    await m.reply(
      `> ❄️ *𝙎𝙃𝘼𝙉𝙆𝙎: "Pinterest Search"*
> 
> ❌ ${err.message || 'حدث خطأ في البحث'}\n\n𝑺𝑯𝑨𝑵𝑲𝑺 𝐁𝐎𝐓❄️`
    )
  }
}

handler.help = ['pins', 'pinsearch', 'pinterestsearch']
handler.tags = ['search', 'downloader']
handler.command = /^(pins|pinsearch|pinterestsearch|بينبحث|بين)$/i

export default handler