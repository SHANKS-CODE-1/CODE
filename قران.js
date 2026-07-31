/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: من الاسم طبعا قرأن كله و قرأ كثيير
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

const UA = 'Mozilla/5.0 (Linux; Android 14; 22120RN86G Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.215 Mobile Safari/537.36'
const BRAND = '◜⏤͟͟͞͞ 📖 قرآن ˖࣪⃟🕌◞•'
const THUMB_READERS = 'https://i.postimg.cc/BjtDq829/upload-1780907260054.jpg'
const THUMB_SURAHS  = 'https://i.postimg.cc/v1z0pxsK/upload-1780907104073.jpg'

if (!global.quranSessions) global.quranSessions = {}

const DEC = { top: '※⋅ ━━ ╼╃⊰🕌⊱╄╾ ━━ ⋅※', icon: '📖 ' }
const box = (lines) => `${DEC.top}\n${lines.map(l => `${DEC.icon}${l}`).join('\n')}\n${DEC.top}`

const SURAHS = [
  'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس',
  'هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه',
  'الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم',
  'لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر',
  'فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق',
  'الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
  'الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج',
  'نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس',
  'التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد',
  'الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات',
  'القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر',
  'المسد','الإخلاص','الفلق','الناس'
]

const READERS_RAW = [
  { name: 'إبراهيم الأخضر',                server: 'https://server6.mp3quran.net/akdr/',                                                          surahCount: 114 },
  { name: 'إبراهيم الجبرين',               server: 'https://server6.mp3quran.net/jbreen/',                                                        surahCount: 107 },
  { name: 'إبراهيم الجرمي',                server: 'https://server11.mp3quran.net/jormy/',                                                         surahCount: 114 },
  { name: 'إبراهيم الدوسري',               server: 'https://server10.mp3quran.net/ibrahim_dosri/Rewayat-Hafs-A-n-Assem/',                          surahCount: 114 },
  { name: 'إبراهيم السعدان',               server: 'https://server10.mp3quran.net/IbrahemSadan/',                                                  surahCount: 50  },
  { name: 'إبراهيم الشهري',                server: 'https://server16.mp3quran.net/Ibrahim-Al-Shahri/Rewayat-Hafs-A-n-Assem/',                      surahCount: 113 },
  { name: 'إدريس أبكر',                    server: 'https://server6.mp3quran.net/abkr/',                                                          surahCount: 114 },
  { name: 'أحمد الحذيفي',                  server: 'https://server8.mp3quran.net/ahmad_huth/',                                                     surahCount: 110 },
  { name: 'أحمد الطرابلسي',               server: 'https://server10.mp3quran.net/trabulsi/',                                                       surahCount: 114 },
  { name: 'أحمد طالب بن حميد',            server: 'https://server16.mp3quran.net/a_binhameed/Rewayat-Hafs-A-n-Assem/',                            surahCount: 107 },
  { name: 'أحمد عامر',                     server: 'https://server10.mp3quran.net/Aamer/',                                                         surahCount: 114 },
  { name: 'أخيل عبدالحي روا',             server: 'https://server12.mp3quran.net/malaysia/akil/',                                                  surahCount: 4   },
  { name: 'أستاذ زامري',                   server: 'https://server12.mp3quran.net/malaysia/zamri/',                                                surahCount: 7   },
  { name: 'أكرم العلاقمي',                server: 'https://server9.mp3quran.net/akrm/',                                                           surahCount: 114 },
  { name: 'الحسيني العزازي',              server: 'https://server8.mp3quran.net/3zazi/',                                                           surahCount: 57  },
  { name: 'الدوكالي محمد العالم',          server: 'https://server7.mp3quran.net/dokali/',                                                         surahCount: 114 },
  { name: 'الزين محمد أحمد',              server: 'https://server9.mp3quran.net/alzain/',                                                          surahCount: 114 },
  { name: 'العشري عمران',                  server: 'https://server9.mp3quran.net/omran/',                                                          surahCount: 113 },
  { name: 'العيون الكوشي',                server: 'https://server11.mp3quran.net/koshi/',                                                          surahCount: 114 },
  { name: 'الفاتح محمد الزبير',            server: 'https://server6.mp3quran.net/fateh/',                                                          surahCount: 114 },
  { name: 'القارئ ياسين',                 server: 'https://server11.mp3quran.net/qari/',                                                           surahCount: 114 },
  { name: 'الوليد الشمسان',               server: 'https://server14.mp3quran.net/shamsan/Rewayat-Hafs-A-n-Assem/',                                surahCount: 71  },
  { name: 'بندر بليله',                    server: 'https://server6.mp3quran.net/balilah/',                                                        surahCount: 114 },
  { name: 'توفيق الصايغ',                 server: 'https://server6.mp3quran.net/twfeeq/',                                                         surahCount: 114 },
  { name: 'جمال الدين الزيلعي',           server: 'https://server11.mp3quran.net/zilaie/',                                                        surahCount: 8   },
  { name: 'جمال شاكر عبدالله',            server: 'https://server6.mp3quran.net/jamal/',                                                          surahCount: 114 },
  { name: 'جمعان العصيمي',                server: 'https://server6.mp3quran.net/jaman/',                                                          surahCount: 114 },
  { name: 'جنيد آدم عبدالله',             server: 'https://server16.mp3quran.net/J-Abdullah/Rewayat-Hafs-A-n-Assem/',                             surahCount: 114 },
  { name: 'حاتم فريد الواعر',             server: 'https://server11.mp3quran.net/hatem/',                                                         surahCount: 114 },
  { name: 'حسن الدغريري',                 server: 'https://server16.mp3quran.net/H-Aldaghriri/Rewayat-Hafs-A-n-Assem/',                          surahCount: 114 },
  { name: 'حسين آل الشيخ',               server: 'https://server11.mp3quran.net/alshaik/',                                                        surahCount: 59  },
  { name: 'حمد الدغريري',                 server: 'https://server6.mp3quran.net/hamad/',                                                          surahCount: 88  },
  { name: 'خالد الجليل',                  server: 'https://server10.mp3quran.net/jleel/',                                                         surahCount: 114 },
  { name: 'خالد الزيادي',                 server: 'https://server16.mp3quran.net/K-Alzadi/Rewayat-Hafs-A-n-Assem/',                               surahCount: 114 },
  { name: 'خالد الشريمي',                 server: 'https://server12.mp3quran.net/shoraimy/',                                                      surahCount: 73  },
  { name: 'خالد القحطاني',                server: 'https://server10.mp3quran.net/qht/',                                                           surahCount: 114 },
  { name: 'خالد المهنا',                  server: 'https://server11.mp3quran.net/mohna/',                                                         surahCount: 114 },
  { name: 'رضية عبدالرحمن',               server: 'https://server12.mp3quran.net/malaysia/rziah/',                                                surahCount: 4   },
  { name: 'رقية سولونق',                  server: 'https://server12.mp3quran.net/malaysia/rogiah/',                                               surahCount: 1   },
  { name: 'سابينة مامات',                 server: 'https://server12.mp3quran.net/malaysia/mamat/',                                                surahCount: 4   },
  { name: 'سعود الشريم',                  server: 'https://server7.mp3quran.net/shuraym/',                                                        surahCount: 114 },
  { name: 'سيدين عبدالرحمن',              server: 'https://server12.mp3quran.net/malaysia/sideen/',                                               surahCount: 4   },
  { name: 'طارق عبدالغني دعوب',           server: 'https://server10.mp3quran.net/tareq/',                                                         surahCount: 114 },
  { name: 'عادل الكلباني',                server: 'https://server8.mp3quran.net/a_klb/',                                                          surahCount: 114 },
  { name: 'عبدالإله بن عون',              server: 'https://server16.mp3quran.net/a_binaoun/Rewayat-Hafs-A-n-Assem/',                              surahCount: 114 },
  { name: 'عبدالبديع غيلان',              server: 'https://server16.mp3quran.net/A-Ghailan/Rewayat-Hafs-A-n-Assem/',                             surahCount: 114 },
  { name: 'عبدالرحمن السديس',             server: 'https://server7.mp3quran.net/sudais/',                                                         surahCount: 114 },
  { name: 'عبدالرحمن السويّد',            server: 'https://server16.mp3quran.net/a_swaiyd/Rewayat-Hafs-A-n-Assem/',                               surahCount: 107 },
  { name: 'عبدالرحمن بن عبدالرزاق البدر', server: 'https://server16.mp3quran.net/A-AlBadr/Rewayat-Hafs-A-n-Assem/',                              surahCount: 114 },
  { name: 'عبدالغني عبدالله',             server: 'https://server12.mp3quran.net/malaysia/abdulgani/',                                            surahCount: 13  },
  { name: 'عبدالله الكندري',              server: 'https://server10.mp3quran.net/Abdullahk/',                                                     surahCount: 114 },
  { name: 'عبدالله القرافي',              server: 'https://server16.mp3quran.net/a_alqrafi/Rewayat-Hafs-A-n-Assem/',                             surahCount: 114 },
  { name: 'عبدالله فهمي',                 server: 'https://server12.mp3quran.net/malaysia/fhmi/',                                                 surahCount: 4   },
  { name: 'عبد المجيب بنكيران',           server: 'https://server16.mp3quran.net/A-Benkirane/Rewayat-Warsh-A-n-Nafi/',                           surahCount: 114 },
  { name: 'عثمان الأنصاري',               server: 'https://server11.mp3quran.net/Othmn/',                                                         surahCount: 76  },
  { name: 'علي الحذيفي',                  server: 'https://server7.mp3quran.net/huthify/',                                                        surahCount: 114 },
  { name: 'عليجان قوري حمدان',            server: 'https://server16.mp3quran.net/Alijon/Rewayat-Hafs-A-n-Assem/',                                surahCount: 114 },
  { name: 'فارس عباد',                    server: 'https://server6.mp3quran.net/faris/',                                                          surahCount: 114 },
  { name: 'ماجد الزامل',                  server: 'https://server9.mp3quran.net/zaml/',                                                           surahCount: 114 },
  { name: 'ماجد العنزي',                  server: 'https://server8.mp3quran.net/majd_onazi/',                                                     surahCount: 113 },
  { name: 'ماهر المعيقلي',                server: 'https://server12.mp3quran.net/maher/Almusshaf-Al-Mojawwad/',                                   surahCount: 114 },
  { name: 'ماهر شخاشيرو',                server: 'https://server10.mp3quran.net/shaksh/',                                                         surahCount: 114 },
  { name: 'محمد الأيراوي',                server: 'https://server6.mp3quran.net/earawi/',                                                         surahCount: 111 },
  { name: 'محمد البراك',                  server: 'https://server13.mp3quran.net/braak/',                                                         surahCount: 63  },
  { name: 'محمد الحافظ',                  server: 'https://server12.mp3quran.net/malaysia/hafz/',                                                 surahCount: 3   },
  { name: 'محمد الزبيدي',                 server: 'https://server16.mp3quran.net/M-AlZubaidi/Rewayat-Hafs-A-n-Assem/',                           surahCount: 114 },
  { name: 'محمد الطبلاوي',                server: 'https://server12.mp3quran.net/tblawi/Al-Mojawwad/',                                            surahCount: 114 },
  { name: 'محمد الفقيه',                  server: 'https://server16.mp3quran.net/M_Alfaqih/Rewayat-Hafs-A-n-Assem/',                             surahCount: 114 },
  { name: 'محمد اللحيدان',                server: 'https://server8.mp3quran.net/lhdan/',                                                          surahCount: 114 },
  { name: 'محمد المحيسني',                server: 'https://server11.mp3quran.net/mhsny/',                                                         surahCount: 114 },
  { name: 'محمد المنشد',                  server: 'https://server10.mp3quran.net/monshed/',                                                       surahCount: 110 },
  { name: 'محمد أيوب',                    server: 'https://server16.mp3quran.net/ayyoub2/Rewayat-Hafs-A-n-Assem/',                               surahCount: 114 },
  { name: 'محمد برهجي',                   server: 'https://server16.mp3quran.net/M_Burhaji/Rewayat-Hafs-A-n-Assem/',                             surahCount: 114 },
  { name: 'محمد جبريل',                   server: 'https://server8.mp3quran.net/jbrl/',                                                           surahCount: 114 },
  { name: 'محمد حفص علي',                server: 'https://server12.mp3quran.net/malaysia/hfs/',                                                   surahCount: 5   },
  { name: 'محمد خير النور',               server: 'https://server12.mp3quran.net/malaysia/nor/',                                                  surahCount: 4   },
  { name: 'محمد رشاد الشريف',             server: 'https://server10.mp3quran.net/rashad/',                                                        surahCount: 114 },
  { name: 'محمد سايد',                    server: 'https://server16.mp3quran.net/m_sayed/Rewayat-Warsh-A-n-Nafi/',                               surahCount: 114 },
  { name: 'محمد صالح عالم شاه',           server: 'https://server12.mp3quran.net/shah/',                                                          surahCount: 114 },
  { name: 'محمد صديق المنشاوي',           server: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mo-lim/',                                    surahCount: 114 },
  { name: 'محمد عبدالحكيم سعيد العبدالله', server: 'https://server9.mp3quran.net/abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai/',                     surahCount: 114 },
  { name: 'محمد عبدالكريم',               server: 'https://server12.mp3quran.net/m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani/', surahCount: 114 },
  { name: 'محمد عثمان خان',               server: 'https://server6.mp3quran.net/khan/',                                                          surahCount: 114 },
  { name: 'محمود الرفاعي',                server: 'https://server11.mp3quran.net/mrifai/',                                                        surahCount: 114 },
  { name: 'محمود الشيمي',                 server: 'https://server10.mp3quran.net/sheimy/',                                                        surahCount: 114 },
  { name: 'محمود خليل الحصري',            server: 'https://server13.mp3quran.net/husr/Rewayat-Qalon-A-n-Nafi/',                                  surahCount: 114 },
  { name: 'محمود علي البنا',              server: 'https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad/',                                     surahCount: 114 },
  { name: 'معمر الأندونيسي',              server: 'https://server6.mp3quran.net/muamr/',                                                          surahCount: 8   },
  { name: 'معيض الحارثي',                 server: 'https://server8.mp3quran.net/harthi/',                                                         surahCount: 114 },
  { name: 'مشاري العفاسي',                server: 'https://server8.mp3quran.net/afasy/',                                                          surahCount: 114 },
  { name: 'مصطفى إسماعيل',               server: 'https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/',                                  surahCount: 114 },
  { name: 'مصطفى اللاهوني',              server: 'https://server6.mp3quran.net/lahoni/',                                                          surahCount: 114 },
  { name: 'مصطفى رعد العزاوي',           server: 'https://server8.mp3quran.net/ra3ad/',                                                           surahCount: 114 },
  { name: 'مفتاح السلطني',                server: 'https://server14.mp3quran.net/muftah_sultany/Rewayat_Ibn-Thakwan-A-n-Ibn-Amer/',              surahCount: 114 },
  { name: 'موسى بلال',                    server: 'https://server11.mp3quran.net/bilal/',                                                         surahCount: 114 },
  { name: 'ناصر العبيد',                  server: 'https://server11.mp3quran.net/obaid/',                                                         surahCount: 67  },
  { name: 'نورين محمد صديق',              server: 'https://server16.mp3quran.net/nourin_siddig/Rewayat-Aldori-A-n-Abi-Amr/',                     surahCount: 114 },
  { name: 'واصل المذن',                   server: 'https://server11.mp3quran.net/wasel/Rewayat-Hafs-A-n-Assem/',                                 surahCount: 9   },
  { name: 'وديع اليمني',                  server: 'https://server6.mp3quran.net/wdee3/',                                                          surahCount: 114 },
  { name: 'وشيار حيدر اربيلي',            server: 'https://server11.mp3quran.net/wishear/',                                                       surahCount: 2   },
  { name: 'ياسر الدوسري',                 server: 'https://server11.mp3quran.net/yasser/',                                                        surahCount: 114 },
  { name: 'ياسر سلامة',                   server: 'https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem/',                               surahCount: 114 },
  { name: 'يوسف الدغوش',                 server: 'https://server7.mp3quran.net/dgsh/',                                                            surahCount: 26  },
  { name: 'يوسف العيدروس',               server: 'https://server16.mp3quran.net/Y_ALaidroos/Rewayat-Hafs-A-n-Assem/',                           surahCount: 113 },
  { name: 'يوسف بن نوح أحمد',             server: 'https://server8.mp3quran.net/noah/',                                                          surahCount: 114 },
]

const seen = new Set()
const READERS = READERS_RAW
  .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true })
  .sort((a, b) => a.name.localeCompare(b.name, 'ar'))

function getSurahNumber(name) {
  const clean = s => s.replace(/^(سورة\s+|ال)/, '').trim()
  const n = clean(name)
  const idx = SURAHS.findIndex(s => s === name || clean(s) === n || s.includes(n) || n.includes(clean(s)))
  return idx >= 0 ? idx + 1 : null
}

function mp3Url(server, num) {
  return `${server}${String(num).padStart(3, '0')}.mp3`
}

async function downloadMp3(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Referer': 'https://www.mp3quran.net/',
      'Accept': '*/*',
      'Accept-Encoding': 'identity',
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

async function sendInteractiveList(conn, jid, title, text, buttonText, sections, thumbUrl, quoted) {
  const media = await prepareWAMessageMedia({ image: { url: thumbUrl } }, { upload: conn.waUploadToServer })
  
  const msg = generateWAMessageFromContent(jid, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          header: proto.Message.InteractiveMessage.Header.create({
            title,
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          }),
          body: proto.Message.InteractiveMessage.Body.create({ text }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: BRAND }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: buttonText,
                sections
              })
            }]
          })
        })
      }
    }
  }, { quoted })

  return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = async (emoji) => {
    try { await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
  }

  const query = (text || '').trim()

  try {
    // 1. إذا أدخل المستخدم اسم سورة وقارئ مباشر بعد الأمر
    if (query.includes('|') || query.includes('-')) {
      const parts = query.split(/[|-]/).map(s => s.trim())
      const readerInput = parts[0]
      const surahInput = parts[1]

      const reader = READERS.find(r => r.name.includes(readerInput) || readerInput.includes(r.name))
      const surahNum = getSurahNumber(surahInput)

      if (!reader || !surahNum) {
        await react("⚠️")
        return m.reply(box(['لم يتم العثور على القارئ أو السورة المطلوبة.', 'يرجى التثبت من الأسماء والتجربة مرة أخرى.']))
      }

      await react("⏳")
      const url = mp3Url(reader.server, surahNum)
      const buffer = await downloadMp3(url)

      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mp4',
        ptt: false,
        fileName: `${SURAHS[surahNum - 1]} - ${reader.name}.mp3`
      }, { quoted: m })

      await react("✅")
      return
    }

    // 2. إذا حدد المستخدم برقم خياراً من الجلسات المخزنة
    if (/^\d+$/.test(query) && global.quranSessions[m.sender]) {
      const session = global.quranSessions[m.sender]
      const index = parseInt(query) - 1

      if (session.step === 'SELECT_SURAH') {
        const reader = session.reader
        if (index < 0 || index >= reader.surahCount) {
          await react("⚠️")
          return m.reply(box(['رقم السورة غير صحيح ضمن المتاح لهذا القارئ.']))
        }

        const surahNum = index + 1
        await react("⏳")

        const url = mp3Url(reader.server, surahNum)
        const buffer = await downloadMp3(url)

        delete global.quranSessions[m.sender]

        await conn.sendMessage(m.chat, {
          audio: buffer,
          mimetype: 'audio/mp4',
          ptt: false,
          fileName: `${SURAHS[surahNum - 1]} - ${reader.name}.mp3`
        }, { quoted: m })

        await react("✅")
        return
      }
    }

    // 3. عرض قائمة القراء التفاعلية
    await react("🕌")

    const readerChunks = chunkArray(READERS, 20)
    const sections = readerChunks.map((chunk, i) => ({
      title: `قائمة القراء - الجزء (${i + 1}/${readerChunks.length})`,
      rows: chunk.map(r => ({
        header: r.name,
        title: `سورة متاحة: ${r.surahCount}`,
        id: `${usedPrefix + command} ${r.name}`
      }))
    }))

    // إذا أدخل اسماً لقارئ لمعاينة سوره
    if (query) {
      const matchedReader = READERS.find(r => r.name.toLowerCase().includes(query.toLowerCase()))
      if (matchedReader) {
        global.quranSessions[m.sender] = { step: 'SELECT_SURAH', reader: matchedReader }

        const surahRows = SURAHS.slice(0, matchedReader.surahCount).map((s, idx) => ({
          header: `سورة ${s}`,
          title: `الرقم: ${idx + 1}`,
          id: `${usedPrefix + command} ${matchedReader.name} | ${s}`
        }))

        const surahChunks = chunkArray(surahRows, 20)
        const surahSections = surahChunks.map((chunk, i) => ({
          title: `السور المتاحة (${i + 1}/${surahChunks.length})`,
          rows: chunk
        }))

        return await sendInteractiveList(
          conn,
          m.chat,
          `القارئ: ${matchedReader.name}`,
          `اختر السورة المطلوبة من القائمة أدناه للبدء في التحميل والاستماع:`,
          'عرض قائمة السور',
          surahSections,
          THUMB_SURAHS,
          m
        )
      }
    }

    // القائمة الرئيسية لجميع القراء
    await sendInteractiveList(
      conn,
      m.chat,
      'القرآن الكريم 🕌',
      `مرحباً بك في المكتبة الصوتية للقرآن الكريم.\nاختر القارئ المطلوب من القائمة أدناه:`,
      'عرض قائمة القراء',
      sections,
      THUMB_READERS,
      m
    )

  } catch (err) {
    await react("❌")
    return m.reply(box(['حدث خطأ أثناء معالجة الطلب.', `السبب: ${(err?.message || err).slice(0, 100)}`]))
  }
}

handler.help = ['قرآن', 'قران']
handler.tags = ['islamic']
handler.command = /^(قرآن|قران|quran)$/i

export default handler