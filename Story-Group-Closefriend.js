/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
الوظيفه: ستوري جروب كلوز فريند تحكم في كل حاجه ايموجي شكل خط لون خط لون خلفيه كل شي 
╰━━━━━━━━━━━━━━━━━━╯
*/

import {
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    downloadContentFromMessage
} from '@whiskeysockets/baileys'

const colorsList = [
    { name: 'احمر', hex: 'FF0000' },
    { name: 'اخضر', hex: '25D366' },
    { name: 'ازرق', hex: '0000FF' },
    { name: 'اسود', hex: '000000' },
    { name: 'ابيض', hex: 'FFFFFF' },
    { name: 'اصفر', hex: 'FFFF00' },
    { name: 'برتقالي', hex: 'FFA500' },
    { name: 'وردي', hex: 'FF69B4' },
    { name: 'بنفسجي', hex: '800080' },
    { name: 'رمادي', hex: '808080' },
    { name: 'اخضر_نيون', hex: '39FF14' },
    { name: 'ازرق_نيون', hex: '00FFFF' },
    { name: 'وردي_نيون', hex: 'FF007F' },
    { name: 'بنفسجي_نيون', hex: 'BC13FE' },
    { name: 'اصفر_نيون', hex: 'E7FE00' },
    { name: 'احمر_نيون', hex: 'FF3131' },
    { name: 'داكن', hex: '121212' },
    { name: 'دموي', hex: '880808' },
    { name: 'كحلي', hex: '000080' },
    { name: 'فحمي', hex: '36454F' },
    { name: 'ليلي', hex: '191970' },
    { name: 'غابي', hex: '0B6623' },
    { name: 'نبيذي', hex: '722F37' },
    { name: 'شوكولاتي', hex: '1B1212' },
    { name: 'ذهبي', hex: 'FFD700' },
    { name: 'فضي', hex: 'C0C0C0' },
    { name: 'بلاتيني', hex: 'E5E4E2' },
    { name: 'برونزي', hex: 'CD7F32' },
    { name: 'زمردي', hex: '50C878' },
    { name: 'ياقوتي', hex: 'E0115F' },
    { name: 'ياقوت_ازرق', hex: '0F52BA' },
    { name: 'ملكي', hex: '4169E1' },
    { name: 'نعناعي', hex: '98FB98' },
    { name: 'ازرق_فاتح', hex: '89CFF0' },
    { name: 'لافندر', hex: 'E6E6FA' },
    { name: 'خوخي', hex: 'FFE5B4' },
    { name: 'سلموني', hex: 'FA8072' },
    { name: 'كريمی', hex: 'FFFDD0' },
    { name: 'سماوي', hex: '87CEEB' },
    { name: 'روزي', hex: 'FF66CC' },
    { name: 'سماوي_فوق', hex: '00FFFF' },
    { name: 'حبر_مائي', hex: '008080' },
    { name: 'فيروزي', hex: '40E0D0' },
    { name: 'نيلي', hex: '4B0082' },
    { name: 'أرجواني', hex: 'FF00FF' },
    { name: 'بنفسجي_فاتح', hex: 'EE82EE' },
    { name: 'قرمزي', hex: 'DC143C' },
    { name: 'مرجاني', hex: 'FF7F50' },
    { name: 'خاكي', hex: 'F0E68C' },
    { name: 'بيج', hex: 'D2B48C' },
    { name: 'سيينا', hex: 'A0522D' },
    { name: 'زيتوني', hex: '808000' },
    { name: 'برقوقي', hex: '673147' },
    { name: 'مشمشي', hex: 'FBCEB1' },
    { name: 'كهرماني', hex: 'FFBF00' },
    { name: 'واتساب_داكن', hex: '075E54' },
    { name: 'واتساب_فاتح', hex: '128C7E' },
    { name: 'واتساب_خلفية', hex: '0B141A' }
]

const fontStyles = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5
}

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {

    try {
        if (!isOwner && !isAdmin) {
            return m.reply('❌ هذا الأمر مخصص للمطورين ومشرفين المجموعة فقط!')
        }

        await m.react('🔮')

        if (args[0] === 'colors' || args[0] === 'الوان') {
            let txt = `🎨 *قائمة الألوان المرقمة*\n━━━━━━━━━━━━━━━\n\n`
            
            colorsList.forEach((c, index) => {
                txt += `${index + 1}. ${c.name}      `
                if ((index + 1) % 3 === 0) txt += '\n'
            })

            txt += `\n\n📝 *أرقام الخطوط المتاحة:*\n`
            txt += `• 0 ↜ عادي\n• 1 ↜ سيريف\n• 2 ↜ يدوي\n• 3 ↜ عريض\n• 4 ↜ رقمي\n• 5 ↜ رفيع`
            txt += `\n\n━━━━━━━━━━━━━━━\n> 📌 طريقة الاستخدام:\n${usedPrefix}${command} [الإيموجي] [رقم_الخلفية] [رقم_الخط] [رقم_لون_الخط] [النص]\n\n💡 *مثال:* ${usedPrefix}${command} ❄️ 5 2 37 test`
            return m.reply(txt)
        }

        let targetJid = m.chat
        let bgHex = '121212'   
        let textHex = 'FFFFFF' 
        let selectedFont = 2  

        
        let fullText = args.join(' ').trim()

        if (fullText.includes('@g.us')) {
            const jidMatch = fullText.match(/[a-zA-Z0-9-]+@g\.us/)
            if (jidMatch) {
                targetJid = jidMatch[0]
                fullText = fullText.replace(targetJid, '').trim()
            }
        }

        
        let customEmoji = "🫦"
        const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u
        const emojiMatch = fullText.match(emojiRegex)
        if (emojiMatch) {
            customEmoji = emojiMatch[0]
            fullText = fullText.replace(customEmoji, '').trim()
        }

        
        const paramsMatch = fullText.match(/^(\d+)\s+(\d+)\s+(\d+)/)
        
        if (paramsMatch) {
            let bgInput = paramsMatch[1]
            let fontInput = paramsMatch[2]
            let textInput = paramsMatch[3]

            
            let bgIndex = parseInt(bgInput) - 1
            if (colorsList[bgIndex]) bgHex = colorsList[bgIndex].hex

            
            if (fontStyles[fontInput] !== undefined) selectedFont = fontStyles[fontInput]

            
            let textIndex = parseInt(textInput) - 1
            if (colorsList[textIndex]) textHex = colorsList[textIndex].hex

            
            fullText = fullText.replace(/^(\d+)\s+(\d+)\s+(\d+)/, '').trim()
        }

        const text = fullText

        // ─── فحص وجود الميديا (سواء بالرد أو مباشرة) ───
        let quoted = m.quoted ? m.quoted : null
        let mime = quoted?.mimetype || quoted?.msg?.mimetype || m.msg?.mimetype || ''
        
        let isImage = mime.includes('image')
        let isVideo = mime.includes('video')
        let isAudio = mime.includes('audio')

        if (!isImage && !isVideo && !isAudio && !text) {
            return m.reply(
`💜 *بوست شانكس🍷  (Close Friends)*\n━━━━━━━━━━━━━━━\n\n` +
`❌ الاستخدام الجديد:\n` +
`${usedPrefix}${command} <الإيموجي> <رقم_الخلفية> <رقم_الخط> <رقم_لون_الخط> <النص>\n\n` +
`💡 لعرض قائمة الألوان وأرقامها اكتب:\n` +
`${usedPrefix}${command} الوان`
            )
        }

        const statusAudienceMetadata = {
            audienceType: 2,
            listName: "SHANKS🍷",
            listEmoji: customEmoji
        }

        let finalMediaMsg = {}

        if (isImage || isVideo || isAudio) {
            let mediaBuffer

            if (quoted) {
                mediaBuffer = await quoted.download()
            } else if (m.msg) {
                const mtype = Object.keys(m.message)[0]
                const stream = await downloadContentFromMessage(m.msg, mtype.replace('Message', ''))
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                mediaBuffer = buffer
            }

            if (!mediaBuffer) throw 'فشل تحميل الميديا من الرسالة!'

            let mediaOptions = isImage
                ? { image: mediaBuffer, caption: text, contextInfo: { statusAudienceMetadata } }
                : isVideo
                ? { video: mediaBuffer, caption: text, contextInfo: { statusAudienceMetadata } }
                : { audio: mediaBuffer, mimetype: 'audio/mp4', ptt: true, contextInfo: { statusAudienceMetadata } }

            let prepared = await prepareWAMessageMedia(mediaOptions, { upload: conn.waUploadToServer })

            finalMediaMsg = isImage
                ? { imageMessage: { ...prepared.imageMessage, contextInfo: { statusAudienceMetadata } } }
                : isVideo
                ? { videoMessage: { ...prepared.videoMessage, contextInfo: { statusAudienceMetadata } } }
                : { audioMessage: { ...prepared.audioMessage, contextInfo: { statusAudienceMetadata } } }

        } else {
            finalMediaMsg = {
                extendedTextMessage: {
                    text, 
                    backgroundArgb: parseInt('FF' + bgHex, 16),
                    textArgb: parseInt('FF' + textHex, 16), 
                    font: selectedFont,
                    contextInfo: {
                        statusAudienceMetadata: statusAudienceMetadata
                    }
                }
            }
        }

        let statusMsg = generateWAMessageFromContent(
            targetJid,
            {
                groupStatusMessageV2: {
                    message: finalMediaMsg
                }
            },
            { userJid: conn.user.id }
        )

        await conn.relayMessage(
            targetJid,
            statusMsg.message,
            { messageId: statusMsg.key.id }
        )

        await m.react('✅')

        let finalBgName = colorsList.find(c => c.hex === bgHex)?.name || bgHex
        let finalTxtName = colorsList.find(c => c.hex === textHex)?.name || textHex

        m.reply(
`${customEmoji} تم نشر بوست الكلوز بنجاح!\n🎨 الخلفية: ${finalBgName}\n✏️ الخط: ${finalTxtName}\n📝 نوع الخط: ${selectedFont}`
        )

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ حصل خطأ\n\n${e}`)
    }
}

handler.help = ['كلوز']
handler.tags = ['group']
handler.command = ['كلوز', 'close', 'لاستوري_خاص', 'كلوز_فريند']
handler.group = true

export default handler;