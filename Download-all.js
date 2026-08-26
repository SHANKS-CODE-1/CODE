/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: تحميل من السوشيال انستا و سناب و تيك و يوتيوب بي شكل هيكس ميتا
╰━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';

const API_URL = 'https://2b.hidenfree.com';

async function getInfo(url) {
    const { data } = await axios.get(`${API_URL}/api/universal/info`, {
        params: { url },
        timeout: 30000,
        validateStatus: () => true
    });
    return data;
}

async function download(url, type = 'video') {
    const { data } = await axios.get(`${API_URL}/api/universal/public`, {
        params: { api_key: 'free_key', url, type },
        timeout: 300000,
        validateStatus: () => true
    });
    return data;
}

/* استخراج الهاشتاجات من النص */
function extractHashtags(text = '') {
   const matches = text.match(/#[\w\u0600-\u06FF]+/g) || [];
   return [...new Set(matches)];
}

/* عنوان نظيف بدون هاشتاجات */
function cleanTitle(text = '') {
   return text.replace(/#[\w\u0600-\u06FF]+/g, '').trim();
}

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`📥 *تحميل ${command}*\n\n📌 .${command} <رابط>`);
    if (!text.includes('http')) return m.reply('❌ أرسل رابط صالح');

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const info = await getInfo(text);

        const dlData = await download(text, 'video');
        if (!dlData?.success || (!dlData?.fileKey && !dlData?.url)) {
            throw new Error(dlData?.error || 'فشل التحميل');
        }

        const videoUrl = dlData.url || `${API_URL}/api/universal/download?file=${dlData.fileKey}`;
        const title = cleanTitle(dlData.title || info.title) || 'Downloaded Video';
        const author = info.uploader || info.author || 'Unknown';
        
        const rawTags = extractHashtags(info.title || '');
        const hashtags = rawTags.length ? rawTags : ['#Downloader', '#SHANKS'];
        const hashtagPills = hashtags.slice(0, 5).map(tag => ({
            prompt_text: tag,
            prompt_type: "SUGGESTED_PROMPT",
            __typename: "GenAIFollowUpSuggestionPillPrimitive"
        }));

        const interactivePayload = {
            response_id: `download-${Date.now()}`,
            sections: [
                {
                    view_model: {
                        primitive: { text: `🎬 **${title}**\n👤 **المؤلف:** ${author}`, __typename: "GenAIMarkdownTextUXPrimitive" },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitive: {
                            media: { 
                                url: videoUrl, 
                                mime_type: "video/mp4", 
                                duration: info.duration || 10 
                            }, 
                            imagine_type: "ANIMATE", 
                            status: { status: "READY" }, 
                            __typename: "GenAIImaginePrimitive" 
                        },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitive: { text: "📌 **الهاشتاجات:**", __typename: "GenAIMetadataTextPrimitive" },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitives: hashtagPills,
                        __typename: "GenAIActionRowLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitive: { text: "⚡ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗗 𝗕𝗬 𝙎𝙃𝘼𝙉𝙆𝙎", __typename: "GenAIMetadataTextPrimitive" },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                }
            ]
        };

        await conn.relayMessage(m.chat, {
            messageContextInfo: {
                threadId: [],
                deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                deviceListMetadataVersion: 2,
                botMetadata: { messageDisclaimerText: "", richResponseSourcesMetadata: { sources: [] } }
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        submessages: [
                            { messageType: 2, messageText: title },
                            { messageType: 2, messageText: `Author: ${author}` }
                        ],
                        messageType: 1,
                        unifiedResponse: {
                            data: Buffer.from(JSON.stringify(interactivePayload)).toString('base64')
                        },
                        contextInfo: {
                            mentionedJid: [],
                            groupMentions: [],
                            statusAttributions: [],
                            stanzaId: m.id,
                            participant: m.sender,
                            remoteJid: m.chat,
                            forwardingSlib: 1,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "0@bot" },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        }, {});

        await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });

    } catch (e) {
        console.error('[Universal Error]', e.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply('❌ حدث خطأ أثناء التحميل: ' + (e.message || 'خطأ غير معروف'));
    }
};

handler.command = /^(انستا|تيك|يوتيوب|سناب)$/i;
handler.tags = ['downloader'];
export default handler;