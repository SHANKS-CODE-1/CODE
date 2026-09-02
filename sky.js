/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه sky هي لعبه حواجز لعبه بسيطه للتسليه باركور
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
        this._title = "SHANKS SKY OBSTACLE GAME";
        this._footer = "";
        this._responseId = "4db57b2c-8393-484d-8b9a-8e6d1a14b349";
        this._botResponseId = "b2e40280-433c-45d8-9c1a-270bec558860";
        this._sections = [];
        this._submessages = [{ messageType: 2, messageText: "SHANKS SKY VIEW" }];
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
                            unifiedResponse: { data: includesUnifiedResponse ? Buffer.from(Toolkit.stringifyEscaped({ response_id: this._responseId, sections })) : '' },
                            contextInfo: { ...forward, ...qObj, ...this._contextInfo },
                        },
                    },
                },
            },
            { messageId: messageId || generateMessageIDV2(), ...options }
        );
    }
}

const skyObstaclePayload = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;user-select:none}html,body{width:100%;background:#090d16;color:#eef2f7;padding:8px;overflow-y:auto}#app{max-width:400px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;padding:5px;gap:8px}.tt{font:900 16px 'Arial Black';color:#38bdf8;text-shadow:0 0 10px rgba(56,189,248,0.4)}.tt small{display:block;font:700 6px Arial;color:#22c55e}.hr{background:rgba(0,0,0,.6);border:1px solid rgba(56,189,248,.3);border-radius:8px;padding:3px 8px;text-align:center;min-width:50px}.hr i{display:block;font:700 6px Arial;color:#94a3b8}.hr b{font:900 12px 'Arial Black';color:#fff}.gw{position:relative;border:2px solid rgba(56,189,248,.4);border-radius:12px;overflow:hidden;background:#05070c;box-shadow:0 0 20px rgba(56,189,248,0.15);margin-top:5px}canvas{width:100%;display:block;touch-action:none}.controls{display:flex;justify-content:center;margin-top:10px}.btn-up{width:100%;max-width:220px;height:50px;background:linear-gradient(135deg, #ff9800, #f57c00);border:2px solid #ffb74d;border-radius:12px;color:#fff;font-size:18px;font-weight:bold;cursor:pointer;box-shadow:0 4px 0 #e65100;touch-action:manipulation}.btn-up:active{transform:translateY(3px);box-shadow:0 1px 0 #e65100}.msg-box{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(5,7,12,0.95);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;z-index:10}.msg-box.hidden{display:none}.msg-box h2{color:#ff5252;font-size:22px;margin-bottom:8px}.msg-box p{color:#38bdf8;font-size:12px;margin-bottom:15px}.msg-box button{padding:10px 24px;background:#22c55e;border:none;border-radius:8px;font-weight:bold;color:#05070c;font-size:14px;cursor:pointer}</style></head><body><div id="app"><div class="hdr"><div class="tt">SKY OBSTACLE<small>GAME</small></div><div style="display:flex;gap:5px"><div class="hr"><i>SCORE</i><b id="sc">0</b></div><div class="hr"><i>BEST</i><b id="bs">0</b></div></div></div><div class="gw"><canvas id="cv" width="360" height="360"></canvas><div id="menu" class="msg-box"><h2 style="color:#38bdf8">حواجز السماء ☁️</h2><p>اضغط ابدأ وتجنب الحواجز بالسماء! ترك الزر أو الاصطدام بالسقف والأرض يعني الموت.</p><button id="startBtn">ابدأ اللعبة</button></div><div id="winMsg" class="msg-box hidden"><h2 style="color:#22c55e">💥 انتهت اللعبة</h2><p id="overText">خسرت! السكور: 0</p><button id="restartBtn">إعادة المحاولة</button></div></div><div class="controls"><button class="btn-up" id="btnUp">🚀 اضغط للصعود (⬆️)</button></div></div><script>
(function() {
    var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
    var scEl = document.getElementById('sc'), bsEl = document.getElementById('bs');
    var menu = document.getElementById('menu'), winMsg = document.getElementById('winMsg'), overText = document.getElementById('overText');
    var btnUp = document.getElementById('btnUp');
    
    let LOGICAL_SIZE = 360;
    let player, obstacles, score, best = 0, isPlay = false, gameInterval = null, isAscending = false;

    try {
        best = parseInt(localStorage.getItem('shanks_sky_best') || '0', 10);
    } catch(e) {}
    bsEl.textContent = best;

    function startGame() {
        menu.classList.add('hidden');
        winMsg.classList.add('hidden');
        player = { x: 70, y: 180, radius: 13, velocity: 0 };
        obstacles = [];
        score = 0;
        scEl.textContent = '0';
        isPlay = true;
        isAscending = false;
        if(gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(loop, 20);
    }

    function createObstacle() {
        const gapHeight = 100;
        const minTop = 35;
        const maxTop = LOGICAL_SIZE - gapHeight - 35;
        const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
        obstacles.push({
            x: LOGICAL_SIZE,
            width: 50,
            topHeight: topHeight,
            bottomY: topHeight + gapHeight,
            passed: false
        });
    }

    const handleStart = (e) => { isAscending = true; if(e) e.preventDefault(); };
    const handleEnd = (e) => { isAscending = false; if(e) e.preventDefault(); };

    btnUp.onmousedown = handleStart;
    btnUp.onmouseup = handleEnd;
    btnUp.addEventListener('touchstart', handleStart, {passive: false});
    btnUp.addEventListener('touchend', handleEnd, {passive: false});

    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);

    let frameCount = 0;
    function loop() {
        if (!isPlay) return;
        frameCount++;
        if (frameCount % 90 === 0) {
            createObstacle();
        }

        if (isAscending) {
            player.velocity = -4.2;
        } else {
            player.velocity += 0.35;
        }
        player.y += player.velocity;

        if (player.y - player.radius <= 0 || player.y + player.radius >= LOGICAL_SIZE) {
            gameOver();
            return;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= 3;

            if (
                player.x + player.radius > obs.x &&
                player.x - player.radius < obs.x + obs.width &&
                (player.y - player.radius < obs.topHeight || player.y + player.radius > obs.bottomY)
            ) {
                gameOver();
                return;
            }

            if (!obs.passed && obs.x + obs.width < player.x) {
                obs.passed = true;
                score++;
                scEl.textContent = score;
                if (score > best) {
                    best = score;
                    bsEl.textContent = best;
                    try { localStorage.setItem('shanks_sky_best', best); } catch(e) {}
                }
            }

            if (obs.x + obs.width < 0) {
                obstacles.splice(i, 1);
            }
        }

        draw();
    }

    function drawSky() {
        let grad = ctx.createLinearGradient(0, 0, 0, LOGICAL_SIZE);
        grad.addColorStop(0, '#1e3c72');
        grad.addColorStop(1, '#2a5298');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.arc(80, 80, 25, 0, Math.PI * 2);
        ctx.arc(110, 75, 18, 0, Math.PI * 2);
        ctx.arc(280, 220, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.font = '900 24px "Arial Black", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SHANKS MD', LOGICAL_SIZE / 2, LOGICAL_SIZE / 2 - 20);
        ctx.restore();
    }

    function drawObstacles() {
        obstacles.forEach(obs => {
            let colGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
            colGrad.addColorStop(0, '#8e44ad');
            colGrad.addColorStop(1, '#9b59b6');
            ctx.fillStyle = colGrad;
            ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
            ctx.fillRect(obs.x, obs.bottomY, obs.width, LOGICAL_SIZE - obs.bottomY);
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight);
            ctx.strokeRect(obs.x, obs.bottomY, obs.width, LOGICAL_SIZE - obs.bottomY);
        });
    }

    function drawPlayer() {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(player.x + 4, player.y - 3, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(player.x + 5, player.y - 3, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    function draw() {
        drawSky();
        drawObstacles();
        drawPlayer();
    }

    function gameOver() {
        isPlay = false;
        clearInterval(gameInterval);
        overText.textContent = 'خسرت! السكور: ' + score + ' نقطة';
        winMsg.classList.remove('hidden');
    }

    drawSky();
})();
</script></body></html>`;

let handler = async (m, { conn }) => {
    const aiRich = new AIRich();
    aiRich._sections.push(
        AIRich.newLayout('Single', {
            __typename: 'GenAIaeacdsnwHtmlPrimitive',
            payload: skyObstaclePayload,
            trusted_sources: ["shanks.dev"]
        })
    );

    const message = await aiRich.build(m.chat, { quoted: m });
    return await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
};

handler.command = ['skygame', 'sky'];

export default handler;