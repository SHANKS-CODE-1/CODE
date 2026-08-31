/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه:لعبه حرب بسيطه FPS فيها ريلود و عدد طلق و أشخاص تتحرك شي بسيط للتسليه
╰━━━━━━━━━━━━━━━━━━╯
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

var handler = async (m, { conn }) => {
  await m.react("🎮");

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
.viewport-container{position:relative;width:100%;height:220px;background:#000;border-radius:10px;overflow:hidden;border:2px solid #30363d;touch-action:none;}
canvas{width:100%;height:100%;display:block;touch-action:none;}
.hud-stats{position:absolute;top:8px;left:8px;right:8px;display:flex;justify-content:space-between;font-family:monospace;font-size:12px;font-weight:bold;color:#4caf50;z-index:10;text-shadow:1px 1px 2px #000;pointer-events:none;}
.ammo-box{color:#ffc107;}
.scope-overlay{position:absolute;inset:0;border:45px solid rgba(0,0,0,0.85);border-radius:50%;pointer-events:none;display:none;z-index:9;}
.scope-overlay::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:red;}
.scope-overlay::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:red;}
.controls-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.btn{background:#21262d;border:1px solid #30363d;color:#fff;padding:12px 0;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;touch-action:manipulation;}
.btn:active{background:#30363d;}
.btn-fire{grid-column:span 3;background:#da3633;color:#fff;font-size:16px;padding:14px 0;}
.btn-scope{background:#8957e5;}
.btn-reload{background:#d29922;}
.btn-turn{background:#1f6beb;}
.footer-brand{display:flex;justify-content:space-between;padding-top:4px;font-size:10px;color:#8b949e;font-weight:bold;}
</style>

<div class="game-card">
  <div class="header">
    <span>⚔️ WAR ZONE 3D - SHANKS FPS</span>
    <span>👑 SHANKS ENGINE</span>
  </div>

  <div class="viewport-container" id="viewport">
    <div class="hud-stats">
      <span>HP: <span id="hp">100</span></span>
      <span class="ammo-box">AMMO: <span id="ammo">30</span>/30</span>
      <span>SCORE: <span id="score">0</span></span>
    </div>
    <div class="scope-overlay" id="scopeView"></div>
    <canvas id="gameCanvas" width="320" height="220"></canvas>
  </div>

  <div class="controls-grid">
    <div></div>
    <button class="btn" id="btnW">⬆️ W</button>
    <div></div>
    <button class="btn" id="btnA">⬅️ A</button>
    <button class="btn" id="btnS">⬇️ S</button>
    <button class="btn" id="btnD">➡️ D</button>
    <button class="btn btn-scope" id="btnScope">🎯 SCOPE</button>
    <button class="btn btn-reload" id="btnReload">🔄 RELOAD</button>
    <button class="btn btn-turn" id="btnTurn">↺ TURN 60°</button>
    <button class="btn btn-fire" id="btnFire">🔥 FIRE (إطلاق)</button>
  </div>

  <div class="footer-brand">
    <span>SHANKS FPS SYSTEM</span>
    <span>DEVELOPED BY 𝙎𝙃𝘼𝙉𝙆𝙎</span>
  </div>
</div>

<script>
(function(){
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const viewport = document.getElementById('viewport');

let posX = 1.5, posY = 1.5;
let dirX = 1, dirY = 0;
let planeX = 0, planeY = 0.66;
let hp = 100, ammo = 30, score = 0;
let isScoped = false, isReloading = false;

const map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,1],
  [1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1]
];

const spawnPoints = [
  {x: 5.5, y: 1.5},
  {x: 6.5, y: 5.5},
  {x: 1.5, y: 6.5},
  {x: 5.5, y: 6.5},
  {x: 2.5, y: 5.5}
];

let enemies = [
  { x: 5.5, y: 1.5, dirX: 0.02, dirY: 0.015, alive: true },
  { x: 2.5, y: 5.5, dirX: -0.015, dirY: 0.02, alive: true },
  { x: 6.5, y: 3.5, dirX: 0.015, dirY: -0.015, alive: true }
];

function drawSoldier(x, bottomY, scale) {
  let h = Math.min(180, 140 / scale);
  let w = h * 0.48;

  ctx.save();
  ctx.translate(x, bottomY);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-w * 0.35, -h * 0.3, w * 0.28, h * 0.3);
  ctx.fillRect(w * 0.07, -h * 0.3, w * 0.28, h * 0.3);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-w * 0.4, -h * 0.75, w * 0.8, h * 0.48);

  ctx.fillStyle = '#d97724';
  ctx.fillRect(-w * 0.3, -h * 0.7, w * 0.6, h * 0.15);

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(0, -h * 0.88, w * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-w * 0.22, -h * 0.9, w * 0.44, h * 0.06);

  ctx.fillStyle = '#000000';
  ctx.fillRect(-w * 0.6, -h * 0.55, w * 0.7, h * 0.1);

  ctx.restore();
}

function updateEnemies() {
  enemies.forEach(en => {
    if(!en.alive) return;

    let nextX = en.x + en.dirX;
    let nextY = en.y + en.dirY;

    if(map[Math.floor(nextY)] && map[Math.floor(nextY)][Math.floor(nextX)] === 0) {
      en.x = nextX;
      en.y = nextY;
    } else {
      en.dirX = -en.dirX;
      en.dirY = -en.dirY;
    }
  });
}

function render() {
  updateEnemies();

  ctx.fillStyle = '#1f1008';
  ctx.fillRect(0, 0, canvas.width, canvas.height/2);
  
  ctx.fillStyle = '#8c431d';
  ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

  let zBuffer = [];

  for(let x = 0; x < canvas.width; x++) {
    let cameraX = 2 * x / canvas.width - 1;
    let rayDirX = dirX + planeX * cameraX;
    let rayDirY = dirY + planeY * cameraX;

    let mapX = Math.floor(posX);
    let mapY = Math.floor(posY);

    let deltaDistX = Math.abs(1 / (rayDirX || 1e-30));
    let deltaDistY = Math.abs(1 / (rayDirY || 1e-30));

    let stepX, stepY, sideDistX, sideDistY;

    if (rayDirX < 0) { stepX = -1; sideDistX = (posX - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1.0 - posX) * deltaDistX; }
    if (rayDirY < 0) { stepY = -1; sideDistY = (posY - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1.0 - posY) * deltaDistY; }

    let hit = 0, side = 0;
    while (hit === 0) {
      if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
      else { sideDistY += deltaDistY; mapY += stepY; side = 1; }
      if (map[mapY] && map[mapY][mapX] > 0) hit = 1;
    }

    let perpWallDist = side === 0 ? (mapX - posX + (1 - stepX) / 2) / rayDirX : (mapY - posY + (1 - stepY) / 2) / rayDirY;
    zBuffer[x] = perpWallDist;

    let lineHeight = Math.floor(canvas.height / (perpWallDist || 0.1));
    let drawStart = -lineHeight / 2 + canvas.height / 2;
    let drawEnd = lineHeight / 2 + canvas.height / 2;

    ctx.fillStyle = side === 1 ? '#ba6222' : '#e07d2d';
    ctx.fillRect(x, Math.max(0, drawStart), 1, Math.min(canvas.height, drawEnd) - Math.max(0, drawStart));
  }

  enemies.forEach(en => {
    if(!en.alive) return;
    let sx = en.x - posX, sy = en.y - posY;
    let invDet = 1.0 / (planeX * dirY - dirX * planeY);
    let transformX = invDet * (dirY * sx - dirX * sy);
    let transformY = invDet * (-planeY * sx + planeX * sy);

    if(transformY > 0) {
      let screenX = Math.floor((canvas.width / 2) * (1 + transformX / transformY));
      if(screenX >= -50 && screenX < canvas.width + 50 && transformY < zBuffer[Math.max(0, Math.min(canvas.width-1, screenX))]) {
        let lineHeight = Math.floor(canvas.height / transformY);
        let bottomY = lineHeight / 2 + canvas.height / 2;
        drawSoldier(screenX, bottomY, transformY);
      }
    }
  });

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(canvas.width/2 - 4, canvas.height/2 - 1, 8, 2);
  ctx.fillRect(canvas.width/2 - 1, canvas.height/2 - 4, 2, 8);
}

setInterval(render, 30);

function move(dir) {
  let speed = 0.25;
  let nx = posX, ny = posY;
  if(dir === 'W') { nx += dirX * speed; ny += dirY * speed; }
  if(dir === 'S') { nx -= dirX * speed; ny -= dirY * speed; }
  if(dir === 'A') { nx -= planeX * speed; ny -= planeY * speed; }
  if(dir === 'D') { nx += planeX * speed; ny += planeY * speed; }

  let gridX = Math.floor(nx);
  let gridY = Math.floor(ny);
  if(map[gridY] && map[gridY][gridX] === 0) {
    posX = nx; posY = ny;
  }
}

function rotate(angle) {
  let oldDirX = dirX;
  dirX = dirX * Math.cos(angle) - dirY * Math.sin(angle);
  dirY = oldDirX * Math.sin(angle) + dirY * Math.cos(angle);
  let oldPlaneX = planeX;
  planeX = planeX * Math.cos(angle) - planeY * Math.sin(angle);
  planeY = oldPlaneX * Math.sin(angle) + planeY * Math.cos(angle);
}

let lastTouchX = null;
const SENSITIVITY = 0.008;

viewport.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    lastTouchX = e.touches[0].clientX;
  }
}, { passive: true });

viewport.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && lastTouchX !== null) {
    let currentX = e.touches[0].clientX;
    let deltaX = currentX - lastTouchX;
    
    if (Math.abs(deltaX) > 0.5) {
      rotate(deltaX * SENSITIVITY);
      lastTouchX = currentX;
    }
  }
}, { passive: true });

viewport.addEventListener('touchend', () => { lastTouchX = null; });
viewport.addEventListener('touchcancel', () => { lastTouchX = null; });

function respawnEnemy(en) {
  let p = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  en.x = p.x;
  en.y = p.y;
  en.dirX = (Math.random() - 0.5) * 0.04;
  en.dirY = (Math.random() - 0.5) * 0.04;
  en.alive = true;
}

function addTouchAction(id, fn) {
  const el = document.getElementById(id);
  if(!el) return;
  let last = 0;
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    last = Date.now();
    fn();
  }, {passive: false});
  el.addEventListener('click', (e) => {
    if(Date.now() - last < 400) return;
    fn();
  });
}

addTouchAction('btnW', () => move('W'));
addTouchAction('btnS', () => move('S'));
addTouchAction('btnA', () => move('A'));
addTouchAction('btnD', () => move('D'));
addTouchAction('btnTurn', () => rotate(Math.PI / 3));

addTouchAction('btnScope', () => {
  isScoped = !isScoped;
  document.getElementById('scopeView').style.display = isScoped ? 'block' : 'none';
});

addTouchAction('btnReload', () => {
  if(isReloading) return;
  isReloading = true;
  document.getElementById('ammo').textContent = '...';
  setTimeout(() => {
    ammo = 30;
    document.getElementById('ammo').textContent = ammo;
    isReloading = false;
  }, 1000);
});

addTouchAction('btnFire', () => {
  if(ammo <= 0 || isReloading) return;
  ammo--;
  document.getElementById('ammo').textContent = ammo;

  enemies.forEach(en => {
    if(!en.alive) return;
    let dist = Math.hypot(en.x - posX, en.y - posY);
    if(dist < 4.5) {
      en.alive = false;
      score += 100;
      document.getElementById('score').textContent = score;

      setTimeout(() => {
        respawnEnemy(en);
      }, 1000);
    }
  });
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
          submessages: [{ messageType: 2, messageText: "🎮 SHANKS FPS WAR GAME" }],
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

handler.help = ["fps"];
handler.tags = ["games"];
handler.command = /^(fps|حرب)$/i;

export default handler;