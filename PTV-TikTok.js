/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: بيسحب ايديت عشوائي من التيك توك و يبعتها ptv ولو كتبت اسم الشخصيه هيبعت ايديت ليها
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'fs'
import axios from 'axios'

let sentVideos = []

const handler = async (m, { conn, text }) => {
    let senderId = m.sender.replace(/[^0-9]/g, '')
    let searchQuery = text ? `${text.trim()} edit anime` : 'edit anime High quality'

    // ⚡ التفاعل بالانتظار
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const filePath = `./temp-${senderId}.mp4`
    try {
        const apiUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(searchQuery)}&count=30`
        const res = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 30000
        })

        const data = res.data
        if (!data?.data?.videos || data.data.videos.length === 0) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            await conn.reply(m.chat, '❌ لم يتم العثور على فيديوهات لهذه الشخصية .', m)
            return
        }

        let availableVideos = data.data.videos.filter(v => (v.play || v.hdplay) && !sentVideos.includes(v.video_id))
        if (availableVideos.length === 0) {
            sentVideos = []
            availableVideos = data.data.videos.filter(v => v.play || v.hdplay)
        }

        const selectedVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)]
        sentVideos.push(selectedVideo.video_id)
        if (sentVideos.length > 20) sentVideos.shift()

        const videoUrl = selectedVideo.hdplay || selectedVideo.play
        const response = await axios.get(videoUrl, { responseType: 'arraybuffer' })
        fs.writeFileSync(filePath, response.data)

        const fk = {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: '🌹┊乂𝙎𝙃𝘼𝙉𝙆𝙎乂 𝐵𝛩𝑇┊🌹',
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SAIF\nTEL;type=CELL;waid=${senderId}:${senderId}\nEND:VCARD`
                }
            }
        }

        await conn.sendMessage(m.chat, { video: fs.readFileSync(filePath), mimetype: 'video/mp4', ptv: true }, { quoted: fk })
        
        // ⚡ التفاعل بالنجاح بعد الإرسال
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    } catch (err) {
        console.error(err)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        
        // ⚡ التفاعل بالفشل
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await conn.reply(m.chat, '❌ فشلت المهمة.. الروابط فيها خلل.', m)
    }
}

handler.command = ['تستو']
export default handler
