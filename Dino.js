/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه دينو المشهور بتاعت الديناصورات و الصبار و الطيور و كذا 
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {

  const messageContent = {
    senderKeyDistributionMessage: {
      groupId: "120363411834515372@g.us",
      axolotlSenderKeyDistributionMessage: "MwidoZf1BxAAGiATOcZBc6abP9Ciw5aq4yd9nzp/Btcjf0dNT0nvuD9TDiIhBXdteTO+zFprOiGJZmQkVPItyxuO7YkG7Qbg/G65IOAA"
    },

    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        messageDisclaimerText: "",
        botResponseId: "1fddbd07-5465-4bc8-8d75-7442e8ac15c2",
        verificationMetadata: {
          proofs: [
            {
              version: 1,
              useCase: 1,
              signature: "U0hBTktTLk1lc3NhZ2VCdWlsZGVyVjQuNy1WZXJpZmljYXRpb25TaWduYXR1cmUuTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzw==",
              certificateChain: [
                "U0hBTktTLk1lc3NhZ2VCdWlsZGVyVjQuNy1DZXJ0aWZpY2F0ZUNoYWluLk1ldGFkYXRh=="
              ]
            }
          ]
        }
      }
    },

    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,

          submessages: [
            {
              messageType: 2,
              messageText: "🦅 DINO RUNNER"
            }
          ],

          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "__typename": "GenAIUnifiedResponse",
              "response_id": "b20b66d0-3732-4e7c-bbde-83ab300907bd",

              "sections": [
                {
                  "__typename": "GenAIUnifiedResponseSection",

                  "view_model": {
                    "__typename": "GenAISingleLayoutViewModel",

                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",

                      "payload": `<style>
*{
box-sizing:border-box;
margin:0;
padding:0;
font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
-webkit-tap-highlight-color:transparent;
user-select:none;
-webkit-user-select:none;
}

body{
background:#1c2026;
padding:8px;
color:#e1e6ed;
width:100%;
}

#app{
width:100%;
margin:0 auto;
}

.card{
position:relative;
width:100%;
padding:16px 14px;
border-radius:20px;
background:#262b33;
border:1px solid #3a424e;
box-shadow:0 8px 20px rgba(0,0,0,0.4);
display:flex;
flex-direction:column;
gap:12px;
}

.header{
display:flex;
justify-content:space-between;
align-items:flex-start;
}

.brand-subtitle{
font-size:11px;
font-weight:700;
color:#7f8c9d;
letter-spacing:1px;
text-transform:uppercase;
}

.game-title{
font-size:22px;
font-weight:900;
color:#ffffff;
letter-spacing:0.5px;
}

.scores{
display:flex;
flex-direction:column;
align-items:flex-end;
background:#1d2229;
padding:6px 12px;
border-radius:10px;
border:1px solid #323a46;
}

.score-main{
font-size:20px;
font-weight:900;
color:#22c55e;
font-family:monospace;
letter-spacing:1px;
}

.score-best{
font-size:10px;
font-weight:700;
color:#94a3b8;
font-family:monospace;
}

.game-container{
position:relative;
width:100%;
height:170px;
background:#181c22;
border-radius:14px;
border:1.5px solid #333c4a;
overflow:hidden;
cursor:pointer;
}

canvas{
width:100%;
height:100%;
display:block;
}

.overlay{
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(15, 23, 42, 0.85);
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:8px;
border-radius:12px;
backdrop-filter:blur(2px);
}

.overlay.hidden{
display:none;
}

.game-over-text{
font-size:16px;
font-weight:900;
color:#ef4444;
letter-spacing:1px;
background:#2a1619;
padding:4px 12px;
border-radius:6px;
border:1px solid #7f1d1d;
}

.tap-text{
font-size:11px;
color:#94a3b8;
font-weight:600;
}

.footer-info{
display:flex;
justify-content:space-between;
align-items:center;
padding:0 4px;
}

.speed-badge{
font-size:12px;
font-weight:800;
color:#38bdf8;
background:#0f293d;
padding:4px 10px;
border-radius:8px;
border:1px solid #1e4976;
}

.dev-brand{
font-size:9px;
font-weight:900;
letter-spacing:1.5px;
color:#64748b;
}
</style>

<div id="app">
  <div class="card">
    
    <div class="header">
      <div>
        <div class="brand-subtitle">SHANKS DINO</div>
        <div class="game-title">Dino Runner</div>
      </div>
      
      <div class="scores">
        <div class="score-main" id="score">00000</div>
        <div class="score-best" id="best">BEST 00000</div>
      </div>
    </div>

    <div class="game-container" id="gameBox">
      <canvas id="canvas"></canvas>
      
      <div class="overlay" id="overlay">
        <div class="game-over-text" id="overlayTitle">PRESS TO START</div>
        <div class="tap-text" id="overlaySub">Tap anywhere or press Space</div>
      </div>
    </div>

    <div class="footer-info">
      <div class="speed-badge" id="speed">Speed 5.0x</div>
      <div class="dev-brand">𝙎𝙃𝘼𝙉𝙆𝙎 CODE</div>
    </div>

  </div>
</div>

<script>
(function(){
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gameBox = document.getElementById("gameBox");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlaySub = document.getElementById("overlaySub");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const speedEl = document.getElementById("speed");

let W = canvas.width = gameBox.clientWidth * 2;
let H = canvas.height = gameBox.clientHeight * 2;

window.addEventListener('resize', () => {
  W = canvas.width = gameBox.clientWidth * 2;
  H = canvas.height = gameBox.clientHeight * 2;
});

let state = "START";
let score = 0;
let best = 0;
try { best = parseInt(localStorage.getItem("shanks_dino_best") || "0", 10) || 0; } catch(e){}

function formatScore(n){
  return String(Math.floor(n)).padStart(5, '0');
}

bestEl.textContent = "BEST " + formatScore(best);

let speedMultiplier = 5.0;
let baseSpeed = 6;

let dino = {
  x: 40,
  y: 0,
  w: 36,
  h: 40,
  vy: 0,
  gravity: 1.1,
  jumpPower: -18,
  grounded: false
};

let obstacles = [];
let clouds = [
  {x: W * 0.3, y: 30, w: 40},
  {x: W * 0.7, y: 50, w: 50},
  {x: W * 1.1, y: 25, w: 35}
];

let frame = 0;

function resetGame(){
  score = 0;
  speedMultiplier = 5.0;
  obstacles = [];
  dino.y = H - 40 - dino.h;
  dino.vy = 0;
  dino.grounded = true;
  frame = 0;
}

function jump(){
  if (state === "START" || state === "GAMEOVER"){
    resetGame();
    state = "PLAYING";
    overlay.classList.add("hidden");
    return;
  }
  if (state === "PLAYING" && dino.grounded){
    dino.vy = dino.jumpPower;
    dino.grounded = false;
  }
}

gameBox.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  jump();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    jump();
  }
});

function spawnObstacle(){
  let canSpawnBird = score >= 400 && Math.random() < 0.45;

  if (canSpawnBird) {
    let heights = [H - 40 - 32, H - 40 - 55, H - 40 - 80];
    let birdY = heights[Math.floor(Math.random() * heights.length)];
    obstacles.push({
      x: W + 20,
      y: birdY,
      w: 38,
      h: 26,
      type: "bird"
    });
  } else {
    let type = Math.random() > 0.4 ? "single" : "double";
    let h = 38 + Math.random() * 12;
    let w = type === "single" ? 22 : 38;
    obstacles.push({
      x: W + 20,
      y: H - 40 - h,
      w: w,
      h: h,
      type: "cactus"
    });
  }
}

function update(){
  if (state !== "PLAYING") return;

  frame++;
  score += 0.15;
  speedMultiplier = 5.0 + (score / 150);
  
  scoreEl.textContent = formatScore(score);
  speedEl.textContent = "Speed " + speedMultiplier.toFixed(1) + "x";

  let currentSpeed = baseSpeed * (speedMultiplier / 5.0);

  dino.vy += dino.gravity;
  dino.y += dino.vy;
  
  let groundY = H - 40 - dino.h;
  if (dino.y >= groundY){
    dino.y = groundY;
    dino.vy = 0;
    dino.grounded = true;
  }

  clouds.forEach(c => {
    c.x -= currentSpeed * 0.3;
    if (c.x + c.w < 0){
      c.x = W + Math.random() * 100;
      c.y = 20 + Math.random() * 40;
    }
  });

  if (frame % Math.max(32, Math.floor(85 / (currentSpeed/6))) === 0){
    if (Math.random() < 0.78){
      spawnObstacle();
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i--){
    let obs = obstacles[i];
    obs.x -= currentSpeed;

    let padding = 6;
    if (
      dino.x + padding < obs.x + obs.w &&
      dino.x + dino.w - padding > obs.x &&
      dino.y + padding < obs.y + obs.h &&
      dino.y + dino.h - padding > obs.y
    ){
      state = "GAMEOVER";
      if (score > best){
        best = score;
        try{ localStorage.setItem("shanks_dino_best", String(Math.floor(best))); }catch(e){}
        bestEl.textContent = "BEST " + formatScore(best);
      }
      overlayTitle.textContent = "GAME OVER";
      overlaySub.textContent = "Tap anywhere to try again";
      overlay.classList.remove("hidden");
    }

    if (obs.x + obs.w < 0){
      obstacles.splice(i, 1);
    }
  }
}

function draw(){
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, H - 40);
  ctx.lineTo(W, H - 40);
  ctx.stroke();

  ctx.fillStyle = "#334155";
  for(let i = 0; i < W; i += 40){
    let dotX = (i - (frame * 3) % 40 + W) % W;
    ctx.fillRect(dotX, H - 32, 6, 3);
  }

  ctx.fillStyle = "#334155";
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
    ctx.arc(c.x + 12, c.y - 4, 15, 0, Math.PI * 2);
    ctx.arc(c.x + 26, c.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#38bdf8";
  let dx = dino.x;
  let dy = dino.y;
  let dw = dino.w;
  let dh = dino.h;

  ctx.fillRect(dx + 8, dy + 10, dw - 12, dh - 18);
  ctx.fillRect(dx + 16, dy, dw - 8, 14);
  ctx.fillStyle = "#181c22";
  ctx.fillRect(dx + 26, dy + 3, 4, 4);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(dx + 22, dy + 10, dw - 14, 4);

  ctx.fillStyle = "#0284c7";
  if (!dino.grounded){
    ctx.fillRect(dx + 10, dy + dh - 10, 6, 10);
    ctx.fillRect(dx + 20, dy + dh - 14, 6, 8);
  } else {
    let legStep = Math.floor(frame / 5) % 2;
    if (legStep === 0){
      ctx.fillRect(dx + 10, dy + dh - 10, 6, 10);
      ctx.fillRect(dx + 22, dy + dh - 6, 6, 6);
    } else {
      ctx.fillRect(dx + 10, dy + dh - 6, 6, 6);
      ctx.fillRect(dx + 22, dy + dh - 10, 6, 10);
    }
  }

  obstacles.forEach(obs => {
    if (obs.type === "bird") {
      ctx.fillStyle = "#f59e0b";
      let wingWing = Math.floor(frame / 6) % 2;
      
      ctx.fillRect(obs.x + 8, obs.y + 8, obs.w - 12, 10);
      ctx.fillRect(obs.x, obs.y + 6, 10, 8);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(obs.x - 6, obs.y + 10, 6, 4);
      
      ctx.fillStyle = "#f59e0b";
      if (wingWing === 0) {
        ctx.fillRect(obs.x + 14, obs.y - 8, 10, 14);
      } else {
        ctx.fillRect(obs.x + 14, obs.y + 12, 10, 14);
      }
    } else {
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(obs.x + 6, obs.y, obs.w - 12, obs.h);
      ctx.fillRect(obs.x, obs.y + 10, obs.w, 6);
      ctx.fillRect(obs.x, obs.y + 4, 6, 12);
      ctx.fillRect(obs.x + obs.w - 6, obs.y + 6, 6, 10);
    }
  });
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

})();
</script>`
                    }
                  }
                }
              ]

            })).toString('base64')
          },

          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: {
              botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
          }
        }
      }
    }
  }

  let msg = generateWAMessageFromContent(
    m.chat,
    messageContent,
    {
      userJid: conn.user.id
    }
  )

  await conn.relayMessage(
    m.chat,
    msg.message,
    {
      messageId: msg.key.id
    }
  )
}

handler.command = [
  'dino',
  'dinorunner',
  'ديناصور'
]

export default handler