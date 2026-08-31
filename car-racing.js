/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه سباق سيارات و فيها تطوير عربيتك  و فلوس و تحرك حلوه شي بسيط للتسليه 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

var handler = async (m, { conn }) => {
  await m.react("🏎️");

  let generateWAMessage, proto;
  try {
    let baileysLib;
    try { baileysLib = await import('@whiskeysockets/baileys'); }
    catch { baileysLib = await import('baileys'); }

    generateWAMessage = baileysLib?.generateWAMessageFromContent || baileysLib?.default?.generateWAMessageFromContent;
    proto = baileysLib?.proto || baileysLib?.default?.proto;
  } catch (e) {
    console.error(e);
  }

  if (!generateWAMessage || !proto) {
    return m.reply("❌ حدث خطأ في مكتبة البوت.");
  }

  const htmlContent = `<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;}
body{background:#0d1117;padding:10px;color:#fff;}
.game-card{width:100%;padding:12px;border-radius:16px;background:#161b22;border:1px solid #30363d;display:flex;flex-direction:column;gap:10px;}
.header{display:flex;justify-content:space-between;font-size:11px;font-weight:bold;color:#ff9800;}
.viewport-container{position:relative;width:100%;height:230px;background:#111;border-radius:10px;overflow:hidden;border:2px solid #30363d;}
canvas{width:100%;height:100%;display:block;}
.hud-stats{position:absolute;top:8px;left:8px;right:8px;display:flex;justify-content:space-between;font-family:monospace;font-size:10px;font-weight:bold;color:#4caf50;z-index:10;text-shadow:1px 1px 2px #000;pointer-events:none;}
.money-box{color:#ffd700;}
.dist-box{color:#00e5ff;}
.remain-box{color:#ff5252;}
.controls-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.btn{background:#21262d;border:1px solid #30363d;color:#fff;padding:12px 0;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;touch-action:manipulation;}
.btn:active{background:#30363d;}
.btn-acc{grid-column:span 3;background:#2ea043;color:#fff;font-size:15px;padding:12px 0;}
.btn-shop{background:#8957e5;grid-column:span 3;padding:10px 0;margin-top:4px;}
.footer-brand{display:flex;justify-content:space-between;padding-top:4px;font-size:10px;color:#8b949e;font-weight:bold;}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;flex-direction:column;justify-content:center;align-items:center;z-index:20;}
.overlay h2{font-size:22px;margin-bottom:10px;}
.overlay p{font-size:14px;margin-bottom:15px;color:#ccc;}
.btn-restart{background:#e53935;color:#fff;padding:10px 20px;border:none;border-radius:6px;font-weight:bold;cursor:pointer;}
</style>

<div class="game-card">
  <div class="header">
    <span>🏎️ SPEED RIVAL 3D - SHANKS</span>
    <span>👑 SHANKS ENGINE</span>
  </div>

  <div class="viewport-container">
    <div class="hud-stats">
      <span class="money-box">💰 $<span id="money">0</span></span>
      <span class="dist-box">🏁 <span id="dist">0</span>m</span>
      <span class="remain-box">⏳ باقي <span id="remain">2000</span>m</span>
      <span>POS: <span id="pos">5/5</span></span>
    </div>
    <div id="gameOverlay" class="overlay">
      <h2 id="overlayTitle">GAME OVER</h2>
      <p id="overlaySub">لقد تحطمت سيارتك!</p>
      <button class="btn-restart" id="btnRestart">إعادة اللعب 🔄</button>
    </div>
    <canvas id="raceCanvas" width="320" height="230"></canvas>
  </div>

  <div class="controls-grid">
    <button class="btn" id="btnLeft">⬅️ يسار</button>
    <button class="btn" id="btnBrake">🛑 فرامل</button>
    <button class="btn" id="btnRight">➡️ يمين</button>
    <button class="btn btn-acc" id="btnGas">⚡ زيادة السرعة (GAS)</button>
    <button class="btn btn-shop" id="btnUpgrade">🛒 تطوير السيارة ($150)</button>
  </div>

  <div class="footer-brand">
    <span>SHANKS CAR RACING SYSTEM</span>
    <span>DEVELOPED BY SHANKS</span>
  </div>
</div>

<script>
(function(){
const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlaySub = document.getElementById('overlaySub');

let money = 0;
let carLevel = 1;
let gameOver = false;
let gameWon = false;
const finishDistance = 2000;

const cars = [
  { name: 'LVL 1 - Basic', maxSpeed: 4.5, accel: 0.1, color: '#e53935', cost: 0 },
  { name: 'LVL 2 - Sport', maxSpeed: 6.5, accel: 0.15, color: '#00e5ff', cost: 150 },
  { name: 'LVL 3 - Super', maxSpeed: 9.0, accel: 0.22, color: '#ffeb3b', cost: 400 },
  { name: 'LVL 4 - Hyper', maxSpeed: 12.0, accel: 0.3, color: '#d500f9', cost: 1000 }
];

let playerX = 0;
let playerSpeed = 0;
let distance = 0;

let rivals = [
  { x: -0.5, y: -200, speed: 3.5, color: '#4caf50' },
  { x: -0.2, y: -400, speed: 4.0, color: '#ff9800' },
  { x: 0.2, y: -600, speed: 3.8, color: '#9c27b0' },
  { x: 0.5, y: -800, speed: 4.2, color: '#00bcd4' }
];

let isGas = false;
let isBrake = false;
let moveDir = 0;

function resetGame() {
  playerX = 0;
  playerSpeed = 0;
  distance = 0;
  gameOver = false;
  gameWon = false;
  overlay.style.display = 'none';
  rivals = [
    { x: -0.5, y: -200, speed: 3.5, color: '#4caf50' },
    { x: -0.2, y: -400, speed: 4.0, color: '#ff9800' },
    { x: 0.2, y: -600, speed: 3.8, color: '#9c27b0' },
    { x: 0.5, y: -800, speed: 4.2, color: '#00bcd4' }
  ];
}

function triggerGameOver() {
  gameOver = true;
  overlayTitle.textContent = "💥 GAME OVER";
  overlayTitle.style.color = "#ff1744";
  overlaySub.textContent = "اصطدمت بسيارة أخرى ومِتّ!";
  overlay.style.display = 'flex';
}

function triggerWin(rank) {
  gameWon = true;
  let reward = (6 - rank) * 100;
  money += reward;
  overlayTitle.textContent = "🏁 وصلت للنهاية!";
  overlayTitle.style.color = "#4caf50";
  overlaySub.textContent = "المركز: " + rank + " | المكافأة: $" + reward;
  overlay.style.display = 'flex';
}

function updatePhysics() {
  if (gameOver || gameWon) return;

  const currentCar = cars[carLevel - 1];

  if (isGas) {
    playerSpeed = Math.min(currentCar.maxSpeed, playerSpeed + currentCar.accel);
  } else if (isBrake) {
    playerSpeed = Math.max(0, playerSpeed - 0.25);
  } else {
    playerSpeed = Math.max(0, playerSpeed - 0.05);
  }

  playerX += moveDir * 0.04 * (playerSpeed / currentCar.maxSpeed + 0.2);
  playerX = Math.max(-0.85, Math.min(0.85, playerX));

  distance += playerSpeed;
  money += Math.floor(playerSpeed * 0.02);

  let remainDist = Math.max(0, finishDistance - Math.floor(distance));

  let rank = 1;
  const playerY = canvas.height - 45;
  const pW = 32;
  const pH = 48;
  const pX = (canvas.width / 2) + (playerX * (canvas.width * 0.4));

  rivals.forEach(r => {
    r.y += r.speed - playerSpeed;

    if (r.y < -1000 && distance < finishDistance - 200) r.y += 1200;
    if (r.y > 700) r.y -= 1200;
    if (r.y < playerY) rank++;

    if (r.y > playerY - pH && r.y < playerY + pH) {
      let scale = Math.max(0.2, Math.min(1, r.y / canvas.height));
      let rX = (canvas.width / 2) + (r.x * (canvas.width * 0.4) * (r.y / canvas.height));
      let rW = 32 * scale;
      if (Math.abs(pX - rX) < (pW + rW) / 2.2) {
        triggerGameOver();
      }
    }
  });

  if (distance >= finishDistance && !gameWon) {
    triggerWin(rank);
  }

  document.getElementById('money').textContent = money;
  document.getElementById('pos').textContent = rank + '/5';
  document.getElementById('dist').textContent = Math.floor(distance);
  document.getElementById('remain').textContent = remainDist;
}

function drawRoad() {
  ctx.fillStyle = '#1b5e20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.35, 0);
  ctx.lineTo(canvas.width * 0.65, 0);
  ctx.lineTo(canvas.width * 0.95, canvas.height);
  ctx.lineTo(canvas.width * 0.05, canvas.height);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  let offset = (distance * 2) % 40;
  for (let y = 0; y < canvas.height; y += 40) {
    let drawY = y + offset;
    let scale = drawY / canvas.height;
    let x1 = canvas.width / 2;
    let x2 = canvas.width / 2;
    ctx.beginPath();
    ctx.moveTo(x1, drawY);
    ctx.lineTo(x2, drawY + 15 * scale);
    ctx.stroke();
  }

  let finishY = canvas.height - (finishDistance - distance);
  if (finishY > 0 && finishY < canvas.height) {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) ctx.fillRect(canvas.width * 0.1 + (i * 25), finishY, 25, 10);
    }
  }
}

function drawCar(xRel, yPos, color, isPlayer = false) {
  let scale = isPlayer ? 1 : Math.max(0.2, Math.min(1, yPos / canvas.height));
  let screenY = isPlayer ? canvas.height - 45 : yPos;
  let screenX = (canvas.width / 2) + (xRel * (canvas.width * 0.4) * (screenY / canvas.height));

  let w = 32 * scale;
  let h = 48 * scale;

  ctx.save();
  ctx.translate(screenX, screenY);

  ctx.fillStyle = '#000';
  ctx.fillRect(-w/2 - 3, -h/2 + 4, 4, 10 * scale);
  ctx.fillRect(w/2 - 1, -h/2 + 4, 4, 10 * scale);
  ctx.fillRect(-w/2 - 3, h/2 - 14, 4, 10 * scale);
  ctx.fillRect(w/2 - 1, h/2 - 14, 4, 10 * scale);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-w/2, -h/2, w, h, [6 * scale]);
  ctx.fill();

  ctx.fillStyle = '#111';
  ctx.fillRect(-w/3, -h/4, (w*2)/3, h/3);

  ctx.fillStyle = isPlayer ? '#00e5ff' : '#ff1744';
  ctx.fillRect(-w/3, -h/2 + 2, 6 * scale, 3);
  ctx.fillRect(w/3 - 6 * scale, -h/2 + 2, 6 * scale, 3);

  ctx.restore();
}

function render() {
  updatePhysics();
  drawRoad();

  rivals.forEach(r => {
    if (r.y > 0 && r.y < canvas.height) {
      drawCar(r.x, r.y, r.color, false);
    }
  });

  drawCar(playerX, 0, cars[carLevel - 1].color, true);
}

setInterval(render, 30);

function bindBtn(id, startFn, endFn) {
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('touchstart', (e) => { e.preventDefault(); startFn(); }, {passive: false});
  el.addEventListener('touchend', (e) => { e.preventDefault(); endFn(); }, {passive: false});
  el.addEventListener('mousedown', startFn);
  el.addEventListener('mouseup', endFn);
}

bindBtn('btnGas', () => { isGas = true; }, () => { isGas = false; });
bindBtn('btnBrake', () => { isBrake = true; }, () => { isBrake = false; });
bindBtn('btnLeft', () => { moveDir = -1; }, () => { moveDir = 0; });
bindBtn('btnRight', () => { moveDir = 1; }, () => { moveDir = 0; });

document.getElementById('btnRestart').addEventListener('click', resetGame);

document.getElementById('btnUpgrade').addEventListener('click', () => {
  if (carLevel < cars.length) {
    let nextCar = cars[carLevel];
    if (money >= nextCar.cost) {
      money -= nextCar.cost;
      carLevel++;
      let newNext = cars[carLevel];
      document.getElementById('btnUpgrade').textContent = newNext ? '🛒 تطوير السيارة ($' + newNext.cost + ')' : '✅ أعلى مستوى!';
    } else {
      alert('ليس لديك مال كافي! تحتاج $' + nextCar.cost);
    }
  }
});

})();
</script>`;

  const messageContent = {
    senderKeyDistributionMessage: {
      groupId: "120363411834515372@g.us",
      axolotlSenderKeyDistributionMessage: "MwidoZf1BxAAGiATOcZBc6abP9Ciw5aq4yd9nzp/Btcjf0dNT0nvuD9TDiIhBXdteTO+zFprOiGJZmQkVPItyxuO7YkG7Qbg/G65IOAA"
    },
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [{ messageType: 2, messageText: "🏎️ SHANKS CAR RACING GAME" }],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "__typename": "GenAIUnifiedResponse",
              "response_id": "b20b66d0-3732-4e7c-bbde-83ab300907bd",
              "sections": [{
                "__typename": "GenAIUnifiedResponseSection",
                "view_model": {
                  "__typename": "GenAISingleLayoutViewModel",
                  "primitive": {
                    "__typename": "GenAIaeacdsnwHtmlPrimitive",
                    "payload": htmlContent
                  }
                }
              }]
            })).toString('base64')
          },
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
            forwardOrigin: 4
          }
        }
      }
    }
  };

  let msg = generateWAMessageFromContent(m.chat, messageContent, { userJid: conn.user.id });
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  await m.react("✅");
};

handler.help = ["race"];
handler.tags = ["games"];
handler.command = /^(race|سباق)$/i;

export default handler;