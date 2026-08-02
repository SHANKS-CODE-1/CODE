/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفه: تحويل اي صوت لي فويس امتداد opus 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import ffmpegPath from 'ffmpeg-static'

const execAsync = promisify(exec)

let handler = async (m, { conn }) => {
    let q = m.quoted
    if (!q) return m.reply('⚡ رد على فيديو أو صوت لتحويله لفويس')

    let mime = (q.msg || q).mimetype || ''
    let isVideo = mime.includes('video')
    let isAudio = mime.includes('audio')

    if (!isVideo && !isAudio) {
        return m.reply('⚡ رد على فيديو أو صوت فقط')
    }

    await conn.sendMessage(m.chat, { react: { text: '🎤', key: m.key } })
    await m.reply('⏳ جاري تحويل الملف لفويس بجودة عالية...')

    try {
        let media = await q.download()
        let ext = isVideo ? 'mp4' : (mime.includes('ogg') ? 'ogg' : 'mp3')
        let inputPath = join(tmpdir(), `voice_in_${Date.now()}.${ext}`)
        let outputPath = join(tmpdir(), `voice_out_${Date.now()}.ogg`)

        writeFileSync(inputPath, media)

        // ⚡ أعلى جودة opus (باستخدام ffmpegPath المباشر)
        let cmd = `"${ffmpegPath}" -i "${inputPath}" -c:a libopus -b:a 64k -ac 2 -ar 48000 -vbr on -compression_level 0 -application audio -frame_duration 20 -f opus "${outputPath}" -y`

        await execAsync(cmd, { timeout: 60000 })

        if (!existsSync(outputPath)) throw new Error('فشل التحويل')

        let buffer = readFileSync(outputPath)

        // ⚡ لو الحجم كبير (> 1MB)، ننزل الجودة شوية
        if (buffer.length > 1024 * 1024) {
            let midPath = join(tmpdir(), `voice_mid_${Date.now()}.ogg`)
            let cmd2 = `"${ffmpegPath}" -i "${inputPath}" -c:a libopus -b:a 32k -ac 1 -ar 24000 -vbr on -compression_level 3 -application audio -frame_duration 40 -f opus "${midPath}" -y`
            await execAsync(cmd2, { timeout: 60000 })
            
            if (existsSync(midPath)) {
                buffer = readFileSync(midPath)
                try { unlinkSync(midPath) } catch {}
            }
        }

        // ⚡ إرسال كفويس نوت
        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        // تنظيف
        try { unlinkSync(inputPath) } catch {}
        try { unlinkSync(outputPath) } catch {}

    } catch (e) {
        console.error(e)
        await m.reply('❌ فشل التحويل\n⚡ تأكد من تثبيت ffmpeg')
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['لفويس']
handler.tags = ['tools']
handler.command = /^(لفويس|tovoice|opus|تحويل_فويس)$/i

export default handler
