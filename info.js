/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: يجيب معلومات الحسابات و القنوات من اليوزر و الرابط من 8 مواقع تواصل و هم الأشهر  بي شكل مميز و تحليل لي شخصيه صاحب الاكونت من الوصف و الصوره و الاسم بي استخدام ال Ai
╰━━━━━━━━━━━━━━━━━━╯
import fetch from 'node-fetch'
import axios from 'axios'

const API_KEY = 'AIzaSyBdU-Np8RSh1tPSsPOWg3qIm6PnVK5PQb4'
const BASE_URL = 'https://us-central1-gptfree-2.cloudfunctions.net/agent_stream'
const TELEGRAM_BOT_TOKEN = '8913082069:AAEdL-v6L5PUN27kKahaDDdQLW_HLLPMPeY'

let cachedToken = null
let cachedTokenExpiry = 0

async function getFirebaseToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken
  }

  try {
    const res = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`,
      { returnSecureToken: true },
      {
        timeout: 30000,
        validateStatus: () => true,
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://gptfree.com',
          'Referer': 'https://gptfree.com/'
        }
      }
    )

    if (res.data?.idToken) {
      cachedToken = res.data.idToken
      cachedTokenExpiry = Date.now() + 3000000
      return cachedToken
    }
    return ''
  } catch {
    return ''
  }
}

function parseSSE(rawBody) {
  let answer = ""
  let event = ""

  for (const line of rawBody.split(/\r?\n/)) {
    const clean = line.trim()
    if (clean.startsWith("event:")) {
      event = clean.replace("event:", "").trim()
      continue
    }
    if (!clean.startsWith("data:")) continue

    const raw = clean.replace(/^data:\s*/, "").trim()
    if (!raw || raw === "[DONE]" || raw === "{}") continue

    try {
      const json = JSON.parse(raw)
      if (event === "result" && json.response) {
        answer = json.response
      }
    } catch {}
  }

  return answer.trim()
}

function decodeEntities(str) {
  if (!str) return ""
  try {
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
            .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
            .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    try { str = decodeURIComponent(str) } catch {}
    return str
  } catch { return str }
}

async function analyzeWithGPTFree(platform, username, nick, bio, extraInfo = '') {
  const token = await getFirebaseToken()
  if (!token) return ""

  const promptText = `أنت خبير تحليل حسابات ومشاريع برمجية وصانعي محتوى وقنوات. قم بتحليل هذا الحساب/المشروع/القناة بناءً على البيانات المتاحة:
- المنصة: ${platform}
- المعرف/الاسم: ${username}
- الاسم الظاهر/عنوان المشروع/اسم القناة: ${nick}
- البايو / الوصف: "${bio}"
${extraInfo ? `- تفاصيل إضافية: \n${extraInfo}` : ''}

المطلوب: اكتب تحليلاً مبتكراً ودقيقاً وشخصياً لهذا الحساب/المستودع/القناة تحديداً باللهجة المصرية العامية في 3 إلى 4 أسطر فقط بدون أي مقدمات. وضح طبيعة القناة أو الحساب، النمط العام، والغرض الأساسي منه و حاول تحليل شخصيه الشخص.`

  try {
    const res = await axios.post(BASE_URL,
      { message: promptText },
      {
        timeout: 120000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`,
          'Origin': 'https://gptfree.com',
          'Referer': 'https://gptfree.com/'
        }
      }
    )

    let rawBody = ""
    res.data.setEncoding("utf8")
    res.data.on("data", (chunk) => { rawBody += chunk })

    return await new Promise((resolve) => {
      res.data.on("end", () => {
        const answer = parseSSE(rawBody)
        resolve(answer)
      })
      res.data.on("error", () => resolve(""))
    })
  } catch (e) {
    console.log("GPTFree AI Scraping Error:", e)
    return ""
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*اكتب اليوزر أو الرابط*\nمثال:\n${usedPrefix}${command} shanks`)

  let rawInput = text.trim()
  let platform = ""
  let username = ""

  if (rawInput.includes('snapchat.com') || rawInput.includes('snap')) {
    platform = 'snapchat'
  } else if (rawInput.includes('youtube.com') || rawInput.includes('youtu.be') || rawInput.includes('yt')) {
    platform = 'youtube'
  } else if (rawInput.includes('t.me/') || rawInput.includes('telegram.me/') || rawInput.includes('telegram')) {
    platform = 'telegram'
  } else if (rawInput.includes('github.com') || rawInput.includes('github')) {
    platform = 'github'
  } else if (rawInput.includes('whatsapp.com/channel/') || rawInput.includes('@newsletter') || (/^\d{15,20}$/.test(rawInput) && !rawInput.includes('.'))) {
    platform = 'whatsapp'
  } else if (rawInput.includes('facebook.com') || rawInput.includes('fb.com')) {
    platform = 'facebook'
  } else if (rawInput.includes('tiktok.com')) {
    platform = 'tiktok'
  } else if (rawInput.includes('instagram.com')) {
    platform = 'instagram'
  }

  let args = rawInput.split(/\s+/)
  if (!platform && args.length >= 2 && ['snapchat', 'snap', 'youtube', 'yt', 'telegram', 'tg', 'channel', 'github', 'gh', 'tiktok', 'instagram', 'insta', 'facebook', 'fb', 'whatsapp', 'wa'].includes(args[0].toLowerCase())) {
    platform = args[0].toLowerCase()
    username = args[1]
  } else {
    username = args.length > 1 && !rawInput.startsWith('http') ? args[1] : args[0]
  }

  if (platform === 'snap') platform = 'snapchat'
  if (platform === 'yt') platform = 'youtube'
  if (platform === 'tg' || platform === 'channel') platform = 'telegram'
  if (platform === 'gh') platform = 'github'
  if (platform === 'insta') platform = 'instagram'
  if (platform === 'fb') platform = 'facebook'
  if (platform === 'wa') platform = 'whatsapp'

  const parseUsernameOrId = (input) => {
    let clean = input.replace(/@/g, '').trim()
    if (clean.startsWith('http')) {
      try {
        let urlObj = new URL(clean)
        let parts = urlObj.pathname.replace(/\/$/, '').split('/').filter(Boolean)
        if (clean.includes('snapchat.com')) {
          let snapUser = parts.includes('add') ? parts[parts.indexOf('add') + 1] : parts[0]
          return { type: 'snapchat', value: snapUser, originalUrl: clean }
        }
        if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
          let handle = parts.find(p => p.startsWith('@')) || parts.pop()
          return { type: 'youtube', value: handle.replace(/@/g, ''), originalUrl: clean }
        }
        if (clean.includes('t.me/') || clean.includes('telegram.me/')) {
          let target = parts[0]
          if (parts[0] === 's' && parts[1]) target = parts[1]
          if (target.startsWith('+')) target = target.replace('+', '')
          return { type: 'telegram', value: target, originalUrl: clean }
        }
        if (clean.includes('github.com')) {
          if (parts.length >= 2) return { type: 'repo', owner: parts[0], repo: parts[1], value: `${parts[0]}/${parts[1]}`, originalUrl: clean }
          if (parts.length === 1) return { type: 'user', value: parts[0], originalUrl: clean }
        }
        if (clean.includes('whatsapp.com/channel/')) {
          let code = parts[parts.indexOf('channel') + 1] || parts.pop()
          return { type: 'channel', value: code, originalUrl: clean }
        }
        if (clean.includes('facebook.com')) {
          if (parts.includes('share')) return { type: 'share', value: parts[parts.indexOf('share')+1], originalUrl: clean }
          if (urlObj.searchParams.has('id')) return { type: 'id', value: urlObj.searchParams.get('id'), originalUrl: clean }
          if (parts[0]==='people' && parts[1]) return { type: 'username', value: decodeEntities(parts[1]), originalUrl: clean }
          return { type: 'username', value: parts[0], originalUrl: clean }
        }
        return { type: 'username', value: parts.pop(), originalUrl: clean }
      } catch { return { type: 'username', value: clean, originalUrl: clean } }
    }
    if (clean.includes('/') && platform === 'github') {
      let [owner, repo] = clean.split('/')
      return { type: 'repo', owner, repo, value: `${owner}/${repo}`, originalUrl: `https://github.com/${clean}` }
    }
    return { type: 'username', value: clean, originalUrl: clean }
  }

  let parsed = parseUsernameOrId(username)
  username = parsed.value
  let originalUrlForFB = parsed.originalUrl || rawInput

  if (!platform) {
    const { generateWAMessageFromContent, proto } = await import('@whiskeysockets/baileys')
    
    let buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "👻 Snapchat",
          id: `${usedPrefix}${command} snapchat ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🔴 YouTube Channel",
          id: `${usedPrefix}${command} youtube ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "✈️ Telegram Channel / User",
          id: `${usedPrefix}${command} telegram ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🐙 GitHub",
          id: `${usedPrefix}${command} github ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "👤 Facebook",
          id: `${usedPrefix}${command} facebook ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🟢 WhatsApp Channel",
          id: `${usedPrefix}${command} whatsapp ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🎵 TikTok",
          id: `${usedPrefix}${command} tiktok ${username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📸 Instagram",
          id: `${usedPrefix}${command} instagram ${username}`
        })
      }
    ]

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*🔍 اختر المنصة للبحث عن: ${username}*\n\nالمدخل: ${username}\nاختر منصة من الأزرار بالأسفل 👇`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '𝚂𝙷𝙰𝙽𝙺𝚂 • معلومات'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: '',
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons
            })
          })
        }
      }
    }, { quoted: m })

    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  username = username.trim()
  await m.react('⏳')

  const { generateWAMessageFromContent } = await import('@whiskeysockets/baileys')

  if (platform === 'instagram') {
    const PROFILE_URL = 'https://www.instagram.com/' + username
    const FOOTER = '𝙎𝙃𝘼𝙉𝙆𝙎'
    const DEFAULT_FALLBACK_IMG = 'https://files.catbox.moe/9j035v.jpg'
    let IMAGE_URL = ''

    try {
      let res = await fetch(`https://www.picuki.com/profile/${username}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      })
      let html = await res.text()
      let match = html.match(/class="profile-avatar-before"[^>]*src="([^"]+)"/) || html.match(/class="profile-avatar"[^>]*src="([^"]+)"/)
      if (match && match[1]) IMAGE_URL = match[1]
    } catch {}

    if (!IMAGE_URL) IMAGE_URL = `https://unavatar.io/instagram/${username}`

    try {
      let checkRes = await fetch(IMAGE_URL, { method: 'HEAD', timeout: 3000 })
      if (!checkRes.ok) IMAGE_URL = DEFAULT_FALLBACK_IMG
    } catch {
      IMAGE_URL = DEFAULT_FALLBACK_IMG
    }

    const payload = {
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [],
            unifiedResponse: {
              data: Buffer.from(JSON.stringify({
                sections: [
                  {
                    view_model: {
                      primitives: [
                        {
                          title: 'Ai insta lookup',
                          subtitle: FOOTER,
                          secondary_subtitle: '',
                          image: { url: IMAGE_URL, mime_type: 'image/jpeg' },
                          entity_id: '123456',
                          entity_url: PROFILE_URL,
                          entity_type: 'WEBSITE',
                          action_type: 'OPEN_URL',
                          is_verified: true,
                          __typename: 'GenAICompactEntityPrimitive'
                        }
                      ],
                      __typename: 'GenAIActionRowLayoutViewModel'
                    }
                  },
                  {
                    view_model: {
                      primitives: [
                        { type: 'HORIZONTAL_LINE', __typename: 'GenAIDividerPrimitive' }
                      ],
                      __typename: 'GenAIVStackLayoutViewModel'
                    }
                  },
                  {
                    view_model: {
                      primitives: [
                        { __typename: 'GenAISpacerPrimitive' },
                        {
                          text: '# {{social_entity_1}}See results\0{{/social_entity_1}}    ',
                          inline_entities: [
                            {
                              key: 'social_entity_1',
                              metadata: {
                                __typename: 'GenAISocialEntityItem',
                                entity_id: username,
                                entity_name: username,
                                entity_full_name: username,
                                entity_picture_url: IMAGE_URL,
                                entity_url: PROFILE_URL,
                                entity_type: 'IG_PROFILE',
                                is_verified: true
                              }
                            }
                          ],
                          __typename: 'GenAIMarkdownTextUXPrimitive'
                        },
                        { __typename: 'GenAISpacerPrimitive' }
                      ],
                      __typename: 'GenAIActionRowLayoutViewModel'
                    }
                  }
                ]
              })).toString('base64')
            },
            contextInfo: { isForwarded: true, forwardOrigin: 4 }
          }
        }
      }
    }

    const waMsg = await generateWAMessageFromContent(m.chat, payload, { userJid: conn.user?.jid })
    await conn.relayMessage(m.chat, waMsg.message, { messageId: waMsg.key.id })
    return await m.react('✅')
  }

  let avatar = "", bio = "", nick = username, followers = null, videoCount = null, viewCount = null, following = null, likes = null, snapScore = null, profileUrl = "", extraDetails = "", chatType = "حساب/قناة"

  if (platform === 'snapchat') {
    profileUrl = `https://www.snapchat.com/add/${username}`
    try {
      const snapRes = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      })
      const html = await snapRes.text()

      let ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || ""
      let ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || html.match(/<meta name="description" content="([^"]+)"/)?.[1] || ""
      
      
      let bitmojiMatch = html.match(/https:\/\/images\.bitmoji\.com\/3d\/avatar\/[^\s"']+/i) || html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
      
      
      let subsMatch = html.match(/([\d,KkMm.]+)\s+(subscribers|followers|متابع|مشترك)/i)
      let scoreMatch = html.match(/"score":\s*(\d+)/i) || html.match(/Snap Score:\s*([\d,KkMm.]+)/i) || html.match(/النقاط:\s*([\d,KkMm.]+)/i)

      if (ogTitle) nick = decodeEntities(ogTitle).replace(/on Snapchat/i, '').replace(/على Snapchat/i, '').trim()
      if (ogDesc) bio = decodeEntities(ogDesc)
      if (bitmojiMatch) avatar = Array.isArray(bitmojiMatch) ? bitmojiMatch[0] : decodeEntities(bitmojiMatch)
      if (subsMatch) followers = subsMatch[1]
      if (scoreMatch) snapScore = scoreMatch[1]

      extraDetails = `• SnapScore: ${snapScore || 'خفي / غير متاح'}`

    } catch (e) {
      console.log('Snapchat Scrape Error:', e)
    }

  } else if (platform === 'youtube') {
    let cleanHandle = username.startsWith('@') ? username : `@${username}`
    profileUrl = `https://www.youtube.com/${cleanHandle}`

    try {
      const ytRes = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      })
      const html = await ytRes.text()

      let ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || ""
      let ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || html.match(/<meta name="description" content="([^"]+)"/)?.[1] || ""
      let ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || ""
      
      let subsMatch = html.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/i) || html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/i)
      let videosMatch = html.match(/"videosCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/i) || html.match(/"videosCountText":\{"runs":\[\{"text":"([^"]+)"\}/i)
      let viewsMatch = html.match(/"viewCountText":\{"simpleText":"([^"]+)"/i)

      if (ogTitle) nick = decodeEntities(ogTitle).replace(/\s*-\s*YouTube/i, '').trim()
      if (ogDesc) bio = decodeEntities(ogDesc)
      if (ogImage) avatar = decodeEntities(ogImage)

      if (subsMatch) followers = subsMatch[1]
      if (videosMatch) videoCount = videosMatch[1]
      if (viewsMatch) viewCount = viewsMatch[1]

      extraDetails = `• عدد الفيديوهات: ${videoCount || 'غير متاح'}\n• إجمالي المشاهدات: ${viewCount || 'غير متاح'}`

    } catch (e) {
      console.log('YouTube Scrape Error:', e)
    }

  } else if (platform === 'telegram') {
    profileUrl = `https://t.me/${username}`
    
    try {
      const chatRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${username}`)
      const chatData = await chatRes.json()

      if (chatData.ok && chatData.result) {
        let chat = chatData.result
        nick = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || username
        bio = chat.description || chat.bio || ''
        
        let rawType = chat.type || ''
        if (rawType === 'channel') chatType = 'قناة تلجرام 📢'
        else if (rawType === 'supergroup' || rawType === 'group') chatType = 'مجموعة تلجرام 👥'
        else if (rawType === 'private') chatType = 'حساب شخصي 👤'
        else chatType = 'تلجرام'

        try {
          const countRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=@${username}`)
          const countData = await countRes.json()
          if (countData.ok && countData.result) {
            followers = countData.result
          }
        } catch {}

        extraDetails = `نوع الكيان: ${chatType}`

        if (chat.photo?.big_file_id) {
          const fileRes = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${chat.photo.big_file_id}`)
          const fileData = await fileRes.json()
          if (fileData.ok && fileData.result?.file_path) {
            avatar = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`
          }
        }
      }
    } catch (e) {
      console.log('Telegram API Fetch Error:', e)
    }

    try {
      const scrapeUrl = `https://t.me/s/${username}`
      const res = await fetch(scrapeUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
      const html = await res.text()

      let ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || ""
      let ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || ""
      let ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || ""
      let subsMatch = html.match(/<div class="tgme_header_counter">([^<]+)<\/div>/) || html.match(/([\d,KkMm.]+)\s+(subscribers|members|متابع|مشترك)/i)

      if (ogTitle && (!nick || nick === username)) nick = decodeEntities(ogTitle)
      if (ogDesc && !bio) bio = decodeEntities(ogDesc)
      if (ogImage && !avatar) avatar = decodeEntities(ogImage)
      if (subsMatch && !followers) followers = subsMatch[1].replace(/subscribers|members|مشترك|متابع/gi, '').trim()

      if (html.includes('tgme_channel_info')) chatType = 'قناة تلجرام 📢'
    } catch (e) {
      console.log('Telegram Scrape Error:', e)
    }

  } else if (platform === 'github') {
    if (parsed.type === 'repo' || username.includes('/')) {
      let [owner, repo] = username.split('/')
      profileUrl = `https://github.com/${owner}/${repo}`

      try {
        let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
        let repoData = await repoRes.json()

        if (repoData && !repoData.message) {
          nick = repoData.full_name || username
          bio = repoData.description || 'لا يوجد وصف للمستودع'
          avatar = repoData.owner?.avatar_url || ''
          followers = repoData.stargazers_count
          likes = repoData.forks_count

          let contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
          let contentsData = await contentsRes.json()

          if (Array.isArray(contentsData)) {
            let files = contentsData.map(f => `- ${f.name} (${f.type})`).slice(0, 25)
            extraDetails = `قائمة الملفات في المستودع:\n` + files.join('\n')
          }
        }
      } catch (e) {
        console.log('GitHub Repo Fetch Error:', e)
      }
    } else {
      profileUrl = `https://github.com/${username}`
      try {
        let userRes = await fetch(`https://api.github.com/users/${username}`)
        let userData = await userRes.json()

        if (userData && !userData.message) {
          nick = userData.name || userData.login || username
          bio = userData.bio || 'لا يوجد بايو مدون'
          avatar = userData.avatar_url
          followers = userData.followers
          following = userData.following
          likes = userData.public_repos
        }
      } catch (e) {
        console.log('GitHub User Fetch Error:', e)
      }
    }
  } else if (platform === 'whatsapp') {
    let channelCode = username.replace(/https?:\/\/whatsapp\.com\/channel\//gi, '').replace('@newsletter', '').trim()
    profileUrl = `https://whatsapp.com/channel/${channelCode}`

    try {
      if (typeof conn.newsletterMetadata === 'function') {
        let isJid = channelCode.includes('@newsletter') || /^\d+$/.test(channelCode)
        let type = isJid ? 'jid' : 'invite'
        let param = isJid ? (channelCode.includes('@newsletter') ? channelCode : `${channelCode}@newsletter`) : channelCode
        let metadata = await conn.newsletterMetadata(type, param)
        
        if (metadata) {
          nick = metadata.name || nick
          bio = metadata.description || bio
          followers = metadata.subscribers || metadata.subscribersCount || null
          if (metadata.picture) {
            avatar = typeof metadata.picture === 'string' ? metadata.picture : metadata.picture.directPath
          }
        }
      }
    } catch (e) {
      console.log('Baileys Newsletter Fetch Error:', e)
    }

    if (!bio || !nick || nick === username) {
      try {
        const res = await fetch(profileUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
        const html = await res.text()

        let ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || html.match(/<title>([^<]+)<\/title>/)?.[1] || ""
        let ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || ""
        let ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || ""

        if (ogTitle) nick = decodeEntities(ogTitle).replace(/WhatsApp Channel/i, '').replace(/\|\s*WhatsApp/i, '').trim()
        if (ogDesc) bio = decodeEntities(ogDesc)
        if (ogImage) avatar = decodeEntities(ogImage)

        let subsMatch = html.match(/([\d,KkMm.]+)\s+(followers|subscribers|متابع|مشاركين)/i)
        if (subsMatch) followers = subsMatch[1]
      } catch (e) {
        console.log('WhatsApp Web Scrape Error:', e)
      }
    }
  } else if (platform === 'tiktok' || platform === 'tt') {
    profileUrl = 'https://www.tiktok.com/@' + username
    try {
      const htmlRes = await fetch(profileUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': 'https://www.tiktok.com/' } })
      const html = await htmlRes.text()
      const av = html.match(/"avatarLarger":"([^"]+)"/)
      const ni = html.match(/"nickname":"([^"]+)"/)
      const si = html.match(/"signature":"([^"]+)"/)
      const fo = html.match(/"followerCount":(\d+)/)
      const fw = html.match(/"followingCount":(\d+)/)
      const he = html.match(/"heartCount":(\d+)/)
      if (av) avatar = JSON.parse(`"${av[1]}"`)
      if (ni) nick = decodeEntities(JSON.parse(`"${ni[1]}"`))
      if (si) bio = decodeEntities(JSON.parse(`"${si[1]}"`))
      if (fo) followers = fo[1]
      if (fw) following = fw[1]
      if (he) likes = he[1]
    } catch {}

    if (!bio || !avatar) {
      try {
        const r = await fetch(`https://www.tikwm.com/api/user/info?uniqueId=${username}`)
        const j = await r.json()
        if (j.data?.user) {
          avatar = avatar || j.data.user.avatarLarger
          bio = bio || decodeEntities(j.data.user.signature)
          nick = decodeEntities(j.data.user.nickname) || nick
          followers = followers || j.data.user.followerCount
          following = following || j.data.user.followingCount
          likes = likes || j.data.user.totalFavorited
        }
      } catch {}
    }
  } else if (platform === 'facebook') {
    let finalUrl = originalUrlForFB.startsWith('http') ? originalUrlForFB : `https://www.facebook.com/${username}`
    profileUrl = finalUrl
    try {
      const res = await fetch(finalUrl, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'ar,en' } })
      finalUrl = res.url || finalUrl
      profileUrl = finalUrl
      const fbHtml = await res.text()

      let ogTitle = fbHtml.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || fbHtml.match(/<title>([^<]+)<\/title>/)?.[1] || ""
      let ogDesc = fbHtml.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || ""
      let ogImage = fbHtml.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || ""

      ogTitle = decodeEntities(ogTitle)
      ogDesc = decodeEntities(ogDesc)
      ogImage = decodeEntities(ogImage).replace(/&amp;/g,'&')

      if (ogTitle) {
        nick = ogTitle.replace(/\s*\|\s*Facebook.*$/i,'').trim()
        if (nick.toLowerCase()==='facebook' || nick.length<2) nick = username
      }
      if (ogDesc) bio = ogDesc
      if (ogImage) avatar = ogImage

      if (nick.toLowerCase()==='people' || /^\d+$/.test(nick)) {
        try {
          let u = new URL(finalUrl)
          let m1 = u.pathname.match(/\/people\/([^\/]+)/)
          if (m1) nick = decodeEntities(decodeURIComponent(m1[1])).replace(/-/g,' ')
        } catch {}
      }
    } catch(e) { console.log(e) }
  }

  if (!avatar || avatar.includes('static')) avatar = "https://files.catbox.moe/9j035v.jpg"
  if (!bio) bio = "لا يوجد وصف مدون"

  let aiAnalysis = await analyzeWithGPTFree(platform, username, nick, bio, extraDetails)
  if (!aiAnalysis) {
    aiAnalysis = `الكيان البرمجي أو القناة/الحساب ${nick} على منصة ${platform}. الوصف: "${bio}". بناءً على البيانات، يركز الكيان على مشاركة محتوى مخصص وشيق للمتابعين.`
  }

  let statsText = ''
  if (platform === 'snapchat') {
    statsText = `*📊 بيانات الحساب:*\n• المعرف: @${username}\n• المشتركين/المتابعين: ${followers ?? 'غير متاح'}\n• SnapScore: ${snapScore ?? 'خاص / غير متاح'}\n• المنصة: Snapchat 👻`
  } else if (platform === 'youtube') {
    statsText = `*📊 بيانات القناة:*\n• المعرف: @${username.replace('@','')}\n• المشتركين: ${followers ?? 'غير متاح'}\n• الفيديوهات: ${videoCount ?? 'غير متاح'}\n• إجمالي المشاهدات: ${viewCount ?? 'غير متاح'}`
  } else if (platform === 'telegram') {
    statsText = `*📊 البيانات:*\n• المعرف: @${username}\n• النوع: ${chatType}\n• المتابعين/الأعضاء: ${followers ?? 'غير متاح'}`
  } else if (platform === 'github') {
    if (parsed.type === 'repo' || username.includes('/')) {
      statsText = `*📊 احصائيات المستودع:*\n• النجوم ⭐: ${followers ?? '0'}\n• الفورك 🍴: ${likes ?? '0'}\n• الرابط: ${profileUrl}`
    } else {
      statsText = `*📊 الاحصائيات:*\n• المتابعين: ${followers ?? '0'}\n• يتابع: ${following ?? '0'}\n• المستودعات: ${likes ?? '0'}`
    }
  } else if (platform === 'whatsapp') {
    statsText = `*📊 الاحصائيات:*\n• المتابعين: ${followers ?? 'غير متاح'}\n• المنصة: قناة واتساب`
  } else if (platform === 'facebook') {
    statsText = `*📊 الاحصائيات:*\n• المتابعين: غير متاح (ملف شخصي)\n• الحالة: حساب نشط`
  } else {
    statsText = `*📊 الاحصائيات:*\n• المتابعين: ${followers ?? '0'}\n• يتابع: ${following ?? '0'}\n• اللايكات: ${likes ?? '0'}`
  }

  let entityType = 'WEBSITE'
  let fullText = `*الوصف:*\n${bio}\n\n*🤖 تحليلي الذكي للقناة/الحساب:*\n${aiAnalysis.slice(0, 700)}\n\n${statsText}`
  let title = nick
  let subtitle = bio.slice(0, 40)
  let secondarySubtitle = (platform === 'snapchat' ? 'حساب سناب شات 👻' : platform === 'youtube' ? 'قناة يوتيوب 🔴' : platform === 'telegram' ? chatType : platform === 'github' ? 'GitHub' : platform === 'whatsapp' ? 'قناة واتساب' : '@' + username) + (followers ? ' • ' + followers + (platform === 'youtube' ? ' مشترك' : ' متابع') : '')

  const sections = [
    { view_model: { primitives: [{ title, subtitle, secondary_subtitle: secondarySubtitle, image: { url: avatar, mime_type: 'image/jpeg' }, entity_id: username, entity_url: profileUrl, entity_type: entityType, action_type: 'OPEN_URL', is_verified: true, __typename: 'GenAICompactEntityPrimitive' }], __typename: 'GenAIActionRowLayoutViewModel' } },
    { view_model: { primitives: [{ type: 'HORIZONTAL_LINE', __typename: 'GenAIDividerPrimitive' }], __typename: 'GenAIVStackLayoutViewModel' } },
    { view_model: { primitives: [{ __typename: 'GenAISpacerPrimitive' }, { text: fullText, __typename: 'GenAIMarkdownTextUXPrimitive' }, { __typename: 'GenAISpacerPrimitive' }], __typename: 'GenAIVStackLayoutViewModel' } },
    { view_model: { primitives: [{ type: 'HORIZONTAL_LINE', __typename: 'GenAIDividerPrimitive' }], __typename: 'GenAIVStackLayoutViewModel' } },
    { view_model: { primitives: [{ __typename: 'GenAISpacerPrimitive' }, { text: '# {{social_entity_1}}See results\0{{/social_entity_1}} ', inline_entities: [{ key: 'social_entity_1', metadata: { __typename: 'GenAISocialEntityItem', entity_id: nick, entity_name: nick, entity_full_name: nick, entity_picture_url: avatar, entity_url: profileUrl, entity_type: entityType, is_verified: true } }], __typename: 'GenAIMarkdownTextUXPrimitive' }, { __typename: 'GenAISpacerPrimitive' }], __typename: 'GenAIVStackLayoutViewModel' } }
  ]

  const payload = { botForwardedMessage: { message: { richResponseMessage: { messageType: 1, submessages: [], unifiedResponse: { data: Buffer.from(JSON.stringify({ sections })).toString('base64') }, contextInfo: { isForwarded: true, forwardOrigin: 4 } } } } }
  const waMsg = await generateWAMessageFromContent(m.chat, payload, { userJid: conn.user?.jid })
  await conn.relayMessage(m.chat, waMsg.message, { messageId: waMsg.key.id })
  await m.react('✅')
}

handler.help = ['معلومات']
handler.tags = ['stalker']
handler.command = ['معلومات', 'معلومه', 'info']

export default handler