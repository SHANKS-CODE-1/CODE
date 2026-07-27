/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
╰━━━━━━━━━━━━━━━━━━╯
*/

import fs from "fs";
import {
    proto,
    generateWAMessageFromContent,
    generateMessageID
} from "@whiskeysockets/baileys";
import hljs from "highlight.js";
import crypto from "crypto";

const protoFile = "./proto.json";

function mapType(type) {
    switch (type) {
        case "string":
            return 3;
        case "number":
            return 2;
        case "keyword":
            return 1;
        case "comment":
            return 5;
        case "attr":
            return 4;
        default:
            return 0;
    }
}

const additionalNodes = [
    {
        tag: "biz",
        attrs: {},
        content: [
            {
                tag: "interactive",
                attrs: {
                    type: "native_flow",
                    v: "1"
                },
                content: [
                    {
                        tag: "native_flow",
                        attrs: {
                            v: "9",
                            name: "mixed"
                        }
                    }
                ]
            }
        ]
    }
];

function hljsToWhatsApp(code, lang = "javascript") {
    let html;
    try {
        html = hljs.highlight(code, { language: lang }).value;
    } catch {
        html = code;
    }

    const result = [];
    const regex = /(<span class="hljs-(.*?)">.*?<\/span>)/gs;
    let lastIndex = 0,
        match;

    const decodeHTML = s =>
        s
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");

    while ((match = regex.exec(html)) !== null) {
        if (match.index > lastIndex) {
            const raw = decodeHTML(
                html.slice(lastIndex, match.index).replace(/<[^>]+>/g, "")
            );

            raw.split(/(\s+|\.|\(|\)|\{|\}|,|:)/g)
                .filter(Boolean)
                .forEach(part =>
                    result.push({
                        highlightType: 0,
                        codeContent: part
                    })
                );
        }

        result.push({
            highlightType: mapType(match[2]),
            codeContent: decodeHTML(match[1].replace(/<[^>]+>/g, ""))
        });

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < html.length) {
        const raw = decodeHTML(
            html.slice(lastIndex).replace(/<[^>]+>/g, "")
        );

        raw.split(/(\s+|\.|\(|\)|\{|\}|,|:)/g)
            .filter(Boolean)
            .forEach(part =>
                result.push({
                    highlightType: 0,
                    codeContent: part
                })
            );
    }

    return result;
}

function unwrapMessage(msg) {
    if (!msg) return null;
    let m = msg;
    while (
        m?.ephemeralMessage?.message ||
        m?.viewOnceMessage?.message ||
        m?.viewOnceMessageV2?.message ||
        m?.viewOnceMessageV2Extension?.message ||
        m?.documentWithCaptionMessage?.message ||
        m?.botForwardedMessage?.message
    ) {
        m =
            m?.ephemeralMessage?.message ||
            m?.viewOnceMessage?.message ||
            m?.viewOnceMessageV2?.message ||
            m?.viewOnceMessageV2Extension?.message ||
            m?.documentWithCaptionMessage?.message ||
            m?.botForwardedMessage?.message;
    }
    return m;
}

function loadProtoStore() {
    try {
        return JSON.parse(fs.readFileSync(protoFile, "utf-8"));
    } catch {
        return {};
    }
}

function saveProtoStore(pr) {
    try {
        fs.writeFileSync(protoFile, JSON.stringify(pr, null, 2));
    } catch {}
}

function bindProtoStore(client) {
    if (client._protoStoreBound) return;
    client._protoStoreBound = true;
    client.ev.on("messages.upsert", ({ messages }) => {
        if (!messages?.length) return;
        const pr = loadProtoStore();
        const now = Date.now();
        for (const key of Object.keys(pr)) {
            if (now - pr[key].ts > 86400000) delete pr[key];
        }
        for (const msg of messages) {
            const id = msg.key?.id;
            const jid = msg.key?.remoteJid;
            if (!id || !jid || !msg.message) continue;
            pr[`${jid}_${id}`] = {
                message: proto.Message.toObject(msg.message, {
                    enums: Number,
                    longs: String,
                    bytes: String,
                    defaults: false,
                    arrays: true,
                    objects: true
                }),
                ts: now
            };
        }
        saveProtoStore(pr);
    });
}

export async function before(m, { conn }) {
    bindProtoStore(conn);

    const isOwner = global.owner.some(
        ([number]) => number === m.sender.split("@")[0]
    );

    if (m.text !== "-->" || !isOwner || !m.quoted) return;

    const qId = m.quoted.key?.id;
    const qJid = m.quoted.key?.remoteJid || m.chat;
    let rawMsg = null;

    if (qId) {
        const pr = loadProtoStore();
        const entry = pr[`${qJid}_${qId}`];
        if (entry?.message) {
            rawMsg = entry.message;
        }
    }

    if (!rawMsg) {
        let fetched = await conn.ws?.config?.getMessage?.(m.quoted.key);
        if (fetched && Object.keys(fetched).length === 0) fetched = undefined;
        rawMsg =
            fetched ||
            conn.ws?.config?.getMessage?.(m.quoted.vM?.key)?.message ||
            m.getQuotedObj?.()?.message ||
            m.quoted.vM?.message ||
            m.quoted.message ||
            m.message?.[Object.keys(m.message)[0]]?.contextInfo?.quotedMessage ||
            null;
    }

    if (!rawMsg) {
        return await m.reply("لم أستطع العثور على الرسالة التي تم الرد عليها.");
    }

    let message = unwrapMessage(rawMsg);
    message = proto.Message.fromObject(message);

    const additionalNodesCode = JSON.stringify(
        additionalNodes,
        null,
        2
    ).replace(/^(\s*)"([A-Za-z_$][A-Za-z0-9_$]*)":/gm, "$1$2:");

    try {
        await conn.relayMessage(m.chat, message, { additionalNodes });
    } catch {}

    const messageCode = JSON.stringify(
        proto.Message.toObject(message, {
            enums: Number,
            longs: String,
            bytes: String,
            defaults: false,
            arrays: true,
            objects: true,
            oneofs: true
        }),
        null,
        2
    ).replace(
        /^(\s*)"([A-Za-z_$][A-Za-z0-9_$]*)":/gm,
        "$1$2:"
    );

    const fullCodeText = `
> try {
  await conn.relayMessage(
    m.chat,
    ${messageCode},
    {
      ${`additionalNodes: ${additionalNodesCode}`}
    }
  );

  await conn.sendMessage(m.chat, {
    react: {
      text: "✅",
      key: m.key
    }
  });
} catch (e) {
  await m.reply(String(e.stack || e));
}
`.trim();

    if (fullCodeText.length > 20000) {
        return await conn.sendMessage(m.chat, {
            document: Buffer.from(fullCodeText),
            mimetype: "text/javascript",
            fileName: "extracted_code.js",
            caption: "⚠️ النص المستخرج كبير جداً (أكثر من 20 ألف حرف)، تم إرساله كملف نصي.\n\n> ʙʏ sʜᴀɴKs+ɢɪɴᴛᴏᴋɪ"
        }, { quoted: m });
    }

    const codeBlocks = hljsToWhatsApp(fullCodeText);

    const msgContent = proto.Message.fromObject({
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [
                        {
                            messageType: 2,
                            messageText: "كود المستخرج:\n"
                        },
                        {
                            messageType: 5,
                            codeMetadata: {
                                codeLanguage: "javascript",
                                codeBlocks
                            }
                        },
                        {
                            messageType: 2,
                            messageText: "> ʙʏ sʜᴀɴᴋs+ɢɪɴᴛᴏᴋɪ"
                        }
                    ],
                    contextInfo: {
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: {
                            botJid: "g1n@bot"
                        },
                        forwardOrigin: 4,
                        quotedMessage: m.message,
                        participant: m.sender || m.chat
                    }
                }
            }
        }
    });

    const msg = generateWAMessageFromContent(m.chat, msgContent, {
        userJid: conn.user?.jid || m.sender,
        messageId: generateMessageID()
    });

    return await conn.relayMessage(m.chat, msg.message, {
        messageId: msg.key.id
    });
}
