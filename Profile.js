/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: سحب بروفايل الشخص من رقمه أو الريبلاي أو اسحب نفسك بدون اي شي جنب الامر
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who

    if (m.quoted) {
        who = m.quoted.sender
    } else if (text) {
        let cleanNum = text.replace(/[^0-9]/g, '')
        if (cleanNum.startsWith('01') && cleanNum.length === 11) {
            cleanNum = '2' + cleanNum
        }
        who = cleanNum ? cleanNum.trim() + '@s.whatsapp.net' : m.sender
    } else {
        who = m.sender
    }

    if (who.includes(':')) {
        who = who.split(':')[0] + '@s.whatsapp.net'
    }

    await m.react('🔍')

    try {
        let phoneNumber = who.split('@')[0]
        let countryData = getGlobalCountryInfo(phoneNumber)
        let carrierData = getCarrierInfo(phoneNumber)

        let username = 'غير معروف'
        try {
            if (m.quoted && m.quoted.sender === who && m.quoted.name) {
                username = m.quoted.name
            } else if (conn.getName) {
                username = await conn.getName(who)
            }

            if (!username || username === '+' + phoneNumber) {
                username = m.pushName || '+' + phoneNumber
            }
        } catch {
            username = '+' + phoneNumber
        }

        let bio = 'لا يوجد وصف (Bio) أو مخفي بسبب الخصوصية'
        try {
            let statusObj = await conn.fetchStatus(who)
            if (statusObj && statusObj.status) {
                bio = statusObj.status
            }
        } catch {
            try {
                let statusObj = await conn.getStatus(who)
                if (statusObj && statusObj.status) {
                    bio = statusObj.status
                }
            } catch {}
        }

        let caption = `👤 *بيانات البروفايل للرقم المطلوب:*\n\n` +
                      `✨ *الاسـم:* ${username}\n` +
                      `📱 *الرقـم:* +${phoneNumber}\n` +
                      `🌍 *الـدولة:* ${countryData.name}\n` +
                      `🔑 *رمز الدولة:* +${countryData.code}\n` +
                      `📶 *الشبكة:* ${carrierData}\n` +
                      `📝 *الـوصف (البايو):* ${bio}`

        let pp = 'https://avatar.iran.liara.run/public'
        try {
            pp = await conn.profilePictureUrl(who, 'image')
        } catch {
            try {
                pp = await conn.profilePictureUrl(who)
            } catch {}
        }

        try {
            await conn.sendMessage(m.chat, { image: { url: pp }, caption: caption }, { quoted: m })
            await m.react('✅')
        } catch {
            await m.reply(caption)
            await m.react('✅')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        await m.reply(`❌ حدث خطأ أثناء جلب البيانات:\n${e.message || e}`)
    }
}

function getGlobalCountryInfo(phone) {
    let countryCodes = {
        '20': 'EG', '966': 'SA', '965': 'KW', '971': 'AE', '974': 'QA', '968': 'OM', '973': 'BH',
        '962': 'JO', '964': 'IQ', '961': 'LB', '963': 'SY', '970': 'PS', '212': 'MA', '213': 'DZ',
        '216': 'TN', '218': 'LY', '249': 'SD', '967': 'YE', '252': 'SO', '222': 'MR', '1': 'US',
        '44': 'GB', '33': 'FR', '49': 'DE', '7': 'RU', '90': 'TR', '91': 'IN', '86': 'CN',
        '81': 'JP', '82': 'KR', '39': 'IT', '34': 'ES', '55': 'BR', '52': 'MX', '61': 'AU'
    }

    let codeFound = '1'
    let isoFound = 'US'

    for (let code in countryCodes) {
        if (phone.startsWith(code)) {
            if (code.length > codeFound.length || codeFound === '1') {
                codeFound = code
                isoFound = countryCodes[code]
            }
        }
    }

    if (codeFound === '1' && !phone.startsWith('1')) {
        let guess = phone.substring(0, 3)
        return { code: guess, name: 'دولة دولية 🌐' }
    }

    try {
        let regionNames = new Intl.DisplayNames(['ar'], { type: 'region' })
        let countryName = regionNames.of(isoFound) || 'غير معروفة'
        return { code: codeFound, name: countryName }
    } catch {
        return { code: codeFound, name: 'دولة دولية 🌐' }
    }
}

function getCarrierInfo(phone) {
    if (phone.startsWith('20')) {
        let localNum = phone.substring(2)
        if (localNum.startsWith('10') || localNum.startsWith('010')) return 'فودافون مصر (Vodafone) 🔴'
        if (localNum.startsWith('11') || localNum.startsWith('011')) return 'اتصالات مصر (Etisalat) 🟢'
        if (localNum.startsWith('12') || localNum.startsWith('012')) return 'أورنج مصر (Orange) 🟠'
        if (localNum.startsWith('15') || localNum.startsWith('015')) return 'المصرية للاتصالات (We) 🟣'
        if (localNum.startsWith('14') || localNum.startsWith('014')) return 'فودافون مصر - داتا (Vodafone) 🔴'
        return 'رقم مصري أرضي أو غير محدد 🇪🇬'
    }
    return 'خارج مصر (شبكة دولية) 🌐'
}

handler.help = ['بروفايل <رقم/ريبلاي>']
handler.tags = ['tools']
handler.command = /^(بروفايل|البروفايل|profile)$/i

export default handler