/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه التعبان تقعد تاكل تفاح عشان تكبر لعبه بسيطه للتسليه 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent, generateMessageIDV2 } from '@whiskeysockets/baileys';
import { Buffer } from 'buffer';

const waitAllPromises = async (arr) => await Promise.all(arr);

class Toolkit {
    static stringifyEscaped(obj) {
        return JSON.stringify(obj);
    }
}

class AIRich {
    static newLayout(type, data) {
        return {
            view_model: {
                primitive: data,
                __typename: `GenAI${type}LayoutViewModel`
            }
        };
    }

    static generateVerificationMetadata() {
        return {
            proofs: [
                {
                    version: 1,
                    useCase: 1,
                    signature: "SHANKS.MessageBuilderV4.7-VerificationSignature.Metadata.CustomSignatureBytesHere==",
                    certificateChain: [
                        "SHANKS.MessageBuilderV4.7-CertificateChain.Metadata.EncryptedData1...",
                        "SHANKS.MessageBuilderV4.7-CertificateChain.Metadata.EncryptedData2..."
                    ]
                }
            ]
        };
    }

    constructor() {
        this._title = "SHANKS SNAKE GAME";
        this._footer = "";
        this._responseId = "4db57b2c-8393-484d-8b9a-8e6d1a14b349";
        this._botResponseId = "b2e40280-433c-45d8-9c1a-270bec558860";
        this._sections = [];
        this._submessages = [{ messageType: 2, messageText: "SHANKS SNAKE VIEW" }];
        this._extraPayload = {};
        this._contextInfo = {};
        this._dynamic = false;
    }

    refreshResponseId() {
        this._responseId = 'id_' + Math.random().toString(36).substring(2);
    }

    refreshBotResponseId() {
        this._botResponseId = 'bot_' + Math.random().toString(36).substring(2);
    }

    async build(jid, { forwarded = true, notification = false, includesUnifiedResponse = true, includesSubmessages = true, quoted, quotedParticipant, messageId, ...options } = {}) {
        const forward = forwarded ? { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 } : {};
        const notif = notification ? { sessionTransparencyMetadata: { disclaimerText: '~ Ahmad tumbuh kembang', hcaId: `hca_${Date.now()}`, sessionTransparencyType: 1 } } : {};
        const qObj = quoted ? { stanzaId: quoted?.key?.id || quoted?.id, participant: quotedParticipant || quoted?.key?.participant || quoted?.participant || quoted?.key?.remoteJid, quotedType: 0, quotedMessage: typeof quoted === 'object' && quoted !== null ? (quoted.message ?? quoted) : undefined } : {};

        const sections = this._footer ? [...(await waitAllPromises(this._sections)), AIRich.newLayout('Single', { text: this._footer, __typename: 'GenAIMetadataTextPrimitive' })] : [...(await waitAllPromises(this._sections))];

        if (this._dynamic) {
            this.refreshResponseId();
            this.refreshBotResponseId();
        }

        return generateWAMessageFromContent(
            jid,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: { messageDisclaimerText: this._title, ...notif, verificationMetadata: AIRich.generateVerificationMetadata(), botResponseId: this._botResponseId },
                },
                ...this._extraPayload,
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: includesSubmessages ? await waitAllPromises(this._submessages) : [],
                            unifiedResponse: { data: includesUnifiedResponse ? Buffer.from(Toolkit.stringifyEscaped({ response_id: this._responseId, sections })).toString('base64') : '' },
                            contextInfo: { ...forward, ...qObj, ...this._contextInfo },
                        },
                    },
                },
            },
            { messageId: messageId || generateMessageIDV2(), ...options }
        );
    }
}

const realisticSnakePayload = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;user-select:none}html,body{width:100%;background:#090d16;color:#eef2f7;padding:8px;overflow-y:auto}#app{max-width:400px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;padding:5px;gap:8px}.tt{font:900 16px 'Arial Black';color:#22c55e;text-shadow:0 0 10px rgba(34,197,94,0.4)}.tt small{display:block;font:700 6px Arial;color:#38bdf8}.hr{background:rgba(0,0,0,.6);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:3px 8px;text-align:center;min-width:50px}.hr i{display:block;font:700 6px Arial;color:#94a3b8}.hr b{font:900 12px 'Arial Black';color:#fff}.gw{position:relative;border:2px solid rgba(34,197,94,.4);border-radius:12px;overflow:hidden;background:#05070c;box-shadow:0 0 20px rgba(34,197,94,0.15);margin-top:5px}canvas{width:100%;display:block;touch-action:none}.controls{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px;justify-items:center}.btn{width:50px;height:45px;background:rgba(34,197,94,.1);border:2px solid rgba(34,197,94,.4);border-radius:10px;color:#22c55e;font-size:18px;font-weight:bold;cursor:pointer}.btn:active{background:rgba(34,197,94,.4);color:#fff}.msg-box{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(5,7,12,0.95);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;z-index:10}.msg-box.hidden{display:none}.msg-box h2{color:#22c55e;font-size:22px;margin-bottom:8px}.msg-box p{color:#38bdf8;font-size:12px;margin-bottom:15px}.msg-box button{padding:10px 24px;background:#22c55e;border:none;border-radius:8px;font-weight:bold;color:#05070c;font-size:14px;cursor:pointer}</style></head><body><div id="app"><div class="hdr"><div class="tt">SHANKS SNAKE<small>GAME</small></div><div style="display:flex;gap:5px"><div class="hr"><i>SCORE</i><b id="sc">0</b></div><div class="hr"><i>BEST</i><b id="bs">0</b></div></div></div><div class="gw"><canvas id="cv" width="360" height="360"></canvas><div id="menu" class="msg-box"><h2>لعبة التعبان</h2><p>اضغط ابدأ وكل التفاح بدون ما تخبط!</p><button id="startBtn">ابدأ المغامرة</button></div><div id="winMsg" class="msg-box hidden"><h2>🍎 مبروك يا بطل!</h2><p id="winText">حققت السكور المطلوب وتفاحاتك كلها تمام!</p><button id="restartBtn">العب تاني</button></div></div><div class="controls"><div></div><button class="btn" id="upBtn">▲</button><div></div><button class="btn" id="leftBtn">◀</button><button class="btn" id="downBtn">▼</button><button class="btn" id="rightBtn">▶</button><div></div></div></div><script>
(function() {
    var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
    var scEl = document.getElementById('sc'), bsEl = document.getElementById('bs');
    var menu = document.getElementById('menu'), winMsg = document.getElementById('winMsg'), winText = document.getElementById('winText');
    
    var grid = 20, tileCount = 18;
    var snake = [], food = {}, dx = 1, dy = 0, nextDx = 1, nextDy = 0;
    var score = 0, best = 0, isPlay = false, targetScore = 10, gameInterval = null;

    try {
        best = parseInt(localStorage.getItem('shanks_real_snake_best') || '0', 10);
    } catch(e) {}
    bsEl.textContent = best;

    function startGame() {
        menu.classList.add('hidden');
        winMsg.classList.add('hidden');
        snake = [{x: 8, y: 8}, {x: 7, y: 8}, {x: 6, y: 8}];
        dx = 1; dy = 0;
        nextDx = 1; nextDy = 0;
        score = 0;
        scEl.textContent = '0';
        spawnFood();
        isPlay = true;
        if(gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(loop, 130);
    }

    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    window.setDir = function(x, y) {
        if (!isPlay) return;
        if ((x === -dx && x !== 0) || (y === -dy && y !== 0)) return;
        nextDx = x;
        nextDy = y;
    };

    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);

    document.getElementById('upBtn').addEventListener('click', () => setDir(0, -1));
    document.getElementById('downBtn').addEventListener('click', () => setDir(0, 1));
    document.getElementById('leftBtn').addEventListener('click', () => setDir(-1, 0));
    document.getElementById('rightBtn').addEventListener('click', () => setDir(1, 0));

    function loop() {
        if (!isPlay) return;
        dx = nextDx;
        dy = nextDy;

        let head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scEl.textContent = score;
            if (score > best) {
                best = score;
                bsEl.textContent = best;
                try { localStorage.setItem('shanks_real_snake_best', best); } catch(e) {}
            }
            if (score === targetScore) {
                isPlay = false;
                clearInterval(gameInterval);
                winText.textContent = 'مبرووك! وصلت لهدف ' + score + ' تفاحات بجدارة!';
                winMsg.classList.remove('hidden');
            }
            spawnFood();
        } else {
            snake.pop();
        }

        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, cv.width, cv.height);

        let fx = food.x * grid + grid / 2, fy = food.y * grid + grid / 2;
        let appleGrad = ctx.createRadialGradient(fx - 2, fy - 2, 2, fx, fy, grid / 2 - 2);
        appleGrad.addColorStop(0, '#ef4444');
        appleGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = appleGrad;
        ctx.beginPath();
        ctx.arc(fx, fy + 1, grid / 2 - 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(fx - 3, fy - 2, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, fy - grid / 2 + 4);
        ctx.quadraticCurveTo(fx + 4, fy - grid / 2 - 2, fx + 6, fy - grid / 2);
        ctx.stroke();

        for (let i = 0; i < snake.length; i++) {
            let sx = snake[i].x * grid + 1, sy = snake[i].y * grid + 1;
            let size = grid - 2;
            if (i === 0) {
                ctx.fillStyle = '#16a34a';
                ctx.beginPath();
                ctx.roundRect(sx, sy, size, size, 6);
                ctx.fill();

                ctx.fillStyle = '#facc15';
                ctx.fillRect(sx + 4, sy + 4, 3, 3);
                ctx.fillRect(sx + 11, sy + 4, 3, 3);
                ctx.fillStyle = '#000';
                ctx.fillRect(sx + 5, sy + 5, 1, 1);
                ctx.fillRect(sx + 12, sy + 5, 1, 1);
            } else {
                let greenVal = Math.max(60, 160 - i * 3);
                ctx.fillStyle = 'rgb(22,' + greenVal + ',74)';
                ctx.beginPath();
                ctx.roundRect(sx + 2, sy + 2, size - 4, size - 4, 4);
                ctx.fill();
            }
        }
    }

    function gameOver() {
        isPlay = false;
        clearInterval(gameInterval);
        menu.querySelector('h2').textContent = 'GAME OVER';
        menu.querySelector('p').textContent = 'خسرت! السكور: ' + score + ' | اضغط لإعادة المحاولة';
        menu.querySelector('button').textContent = 'إعادة المحاولة';
        menu.classList.remove('hidden');
    }

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, cv.width, cv.height);
})();
</script></body></html>`;

let handler = async (m, { conn }) => {
    const aiRich = new AIRich();
    aiRich._sections.push(
        AIRich.newLayout('Single', {
            __typename: 'GenAIaeacdsnwHtmlPrimitive',
            payload: realisticSnakePayload,
            trusted_sources: ["shanks.dev"]
        })
    );

    const message = await aiRich.build(m.chat, { quoted: m });
    return await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
};

handler.command = ['snakegame'];

export default handler;