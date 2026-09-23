/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه قتال مسدسات بي مستويات صعوبه ممتعه 
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, sock }) => {
  const client = sock || conn;

  const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Gun Spin — 𝚂𝙷𝙰𝙽𝙺𝚂</title>
<style>
:root{
  --bg:#2a3942;
  --ink:#e9edef;
  --accent:#00a884;
  --line:#374248;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{
  background:#111b21;
  color:var(--ink);
  font-family:var(--sys);
  display:flex;
  flex-direction:column;
  align-items:center;
  height:100vh;
  overflow:hidden;
  touch-action:none;
}
.header {
  width: 100%;
  padding: 12px 15px;
  text-align: center;
  background: var(--bg);
  border-bottom: 2px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.score-board {
  display: flex;
  gap: 15px;
  font-weight: bold;
  font-size: 16px;
}
.score-blue { color: #3ca0ec; }
.score-yellow { color: #e1b434; }

#gameContainer {
  flex: 1;
  width: 100%;
  max-width: 420px;
  position: relative;
  background: #383838;
  border-left: 4px solid #282828;
  border-right: 4px solid #282828;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.controls {
  width: 100%;
  max-width: 420px;
  padding: 12px;
  background: var(--bg);
  display: flex;
  justify-content: center;
}
.btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 17px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s, background 0.2s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #555;
}
.btn:active:not(:disabled) { background: #008069; }
</style>
</head>
<body>

<div class="header">
  <div id="levelText" style="font-weight:bold; color:#aebac1;">Level 1</div>
  <div class="score-board">
    <span class="score-blue" id="blueHealth">100%</span>
    <span style="color:#666">|</span>
    <span class="score-yellow" id="yellowHealth">100%</span>
  </div>
</div>

<div id="gameContainer">
  <canvas id="gameCanvas"></canvas>
</div>

<div class="controls">
  <button class="btn" id="shootBtn">إطلاق النار 💥</button>
</div>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = canvas.parentElement.clientWidth;
  height = canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

const GRAVITY = 0.12;
let bullets = [];
let particles = [];
let smokeParticles = [];
let isRespawning = false;
let level = 1;
let enemyShootTimer = null;

let lastShootTime = 0;
const SHOOT_COOLDOWN = 250; 
function updateLevelDisplay() {
  document.getElementById('levelText').innerText = 'Level ' + level;
}

let audioCtx = null;
function ac() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioCtx;
}
function unlockAudio() {
  const c = ac();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}
function playGunshot() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;

  const bufferSize = Math.floor(c.sampleRate * 0.12);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 900;
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.55, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(c.destination);
  noise.start(now);

  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
  const oGain = c.createGain();
  oGain.gain.setValueAtTime(0.4, now);
  oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
  osc.connect(oGain);
  oGain.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}
function playHit() {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(300, now);
  o.frequency.exponentialRampToValueAtTime(90, now + 0.1);
  const g = c.createGain();
  g.gain.setValueAtTime(0.25, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  o.connect(g); g.connect(c.destination);
  o.start(now); o.stop(now + 0.13);
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

class Gun {
  constructor(x, y, color, isPlayer) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = isPlayer ? -Math.PI/2 : Math.PI/2;
    this.spinSpeed = 0.07;
    this.color = color;
    this.dark = shadeColor(color, -60);
    this.light = shadeColor(color, 60);
    this.isPlayer = isPlayer;
    this.maxHealth = 100;
    this.health = 100;
    this.visible = true;
    this.scale = 1;
  }

  update() {
    if(!this.visible) return;

    this.angle += this.spinSpeed;
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    
    this.vx *= 0.98;
    this.vy *= 0.98;

    const pad = 20;
    if(this.x < pad) { this.x = pad; this.vx *= -0.6; }
    if(this.x > width - pad) { this.x = width - pad; this.vx *= -0.6; }
    if(this.y < pad) { this.y = pad; this.vy *= -0.6; }
    if(this.y > height - pad) { this.y = height - pad; this.vy *= -0.6; }
  }

  draw() {
    if(!this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale);

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.dark;
    ctx.lineWidth = 1.4;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(13, -6);
    ctx.lineTo(13, -2);
    ctx.lineTo(9, -2);
    ctx.lineTo(9, 2);
    ctx.lineTo(-12, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.dark;
    ctx.fillRect(9, -1.5, 4, 3);

    ctx.strokeStyle = this.light;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(7, -5);
    ctx.stroke();

    ctx.save();
    ctx.translate(-9, 2);
    ctx.rotate(0.5);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.dark;
    ctx.lineWidth = 1.2;
    ctx.fillRect(-4, 0, 8, 13);
    ctx.strokeRect(-4, 0, 8, 13);
    ctx.restore();

    ctx.strokeStyle = this.dark;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(-2.5, 5, 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = this.dark;
    ctx.fillRect(-13, -7, 3, 3);

    ctx.restore();
  }

  shoot() {
    if(!this.visible || this.health <= 0) return;
    
    const bx = this.x + Math.cos(this.angle) * 16;
    const by = this.y + Math.sin(this.angle) * 16;
    
    bullets.push({
      x: bx, y: by,
      vx: Math.cos(this.angle) * 18,
      vy: Math.sin(this.angle) * 18,
      history: [{x: bx, y: by}],
      color: this.color,
      owner: this
    });

  
    const baseRecoil = this.isPlayer ? 6 : 6 + (level * 0.4);
    this.vx -= Math.cos(this.angle) * baseRecoil;
    this.vy -= Math.sin(this.angle) * baseRecoil;
    
    const mult = this.isPlayer ? 1 : 1 + (level * 0.1);
    this.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.1 + Math.random()*0.06) * mult;

    playGunshot();
  }

  explode() {
    this.visible = false;
    for(let i=0; i<25; i++) {
      particles.push({
        x: this.x,
        y: this.y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 6 + 4,
        color: this.color,
        life: 1.0
      });
    }
  }

  respawn() {
    this.x = width / 2;
    this.y = this.isPlayer ? height - 120 : 120;
    this.vx = 0;
    this.vy = 0;
    
    this.maxHealth = this.isPlayer ? 100 : (100 + (level - 1) * 20);
    this.health = this.maxHealth;
    
    this.scale = 0;
    this.visible = true;

    let popInterval = setInterval(() => {
      this.scale += 0.1;
      if(this.scale >= 1) {
        this.scale = 1;
        clearInterval(popInterval);
      }
    }, 30);
  }
}

let player = new Gun(width/2, height - 120, '#3ca0ec', true);
let enemy = new Gun(width/2, 120, '#e1b434', false);

function startEnemyAI() {
  if(enemyShootTimer) clearInterval(enemyShootTimer);
 
  const interval = Math.max(450, 1300 - (level * 100)); 
  enemyShootTimer = setInterval(() => {
    if(enemy.visible && enemy.health > 0 && !isRespawning) {
      enemy.shoot();
    }
  }, interval);
}
startEnemyAI();

function triggerRespawn(won) {
  if(isRespawning) return;
  isRespawning = true;

  if(won) {
    level++;
  } else {
    level = 1; 
  }
  updateLevelDisplay();

  setTimeout(() => {
    player.respawn();
    enemy.respawn();
    startEnemyAI();
    document.getElementById('blueHealth').innerText = '100%';
    document.getElementById('yellowHealth').innerText = '100%';
    isRespawning = false;
  }, 1800);
}

const shootBtn = document.getElementById('shootBtn');

const handleShoot = (e) => {
  if(e) e.preventDefault();
  const now = Date.now();
  
  if(now - lastShootTime < SHOOT_COOLDOWN) return;
  lastShootTime = now;


  shootBtn.disabled = true;
  setTimeout(() => { shootBtn.disabled = false; }, SHOOT_COOLDOWN);

  unlockAudio();
  if(player.visible) player.shoot();
};

shootBtn.addEventListener('pointerdown', handleShoot);
canvas.addEventListener('pointerdown', handleShoot);

function update() {
  ctx.fillStyle = '#383838';
  ctx.fillRect(0, 0, width, height);

  player.update(); player.draw();
  enemy.update(); enemy.draw();

  for(let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    b.history.push({ x: b.x, y: b.y });
    if(b.history.length > 8) b.history.shift();

    smokeParticles.push({
      x: b.x, y: b.y,
      radius: Math.random() * 2.5 + 1.5,
      alpha: 0.3
    });

    if(b.history.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(b.history[0].x, b.history[0].y);
      for(let j = 1; j < b.history.length; j++) {
        ctx.lineTo(b.history[j].x, b.history[j].y);
      }
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3.5, 0, Math.PI*2);
    ctx.fill();

    if(b.owner === player && enemy.visible) {
      if(Math.hypot(b.x - enemy.x, b.y - enemy.y) < 22) {
        enemy.health -= 25;
        const pct = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));
        document.getElementById('yellowHealth').innerText = pct + '%';
        bullets.splice(i, 1);
        playHit();
        
        if(enemy.health <= 0) {
          enemy.explode();
          triggerRespawn(true); 
        }
        continue;
      }
    }
    if(b.owner === enemy && player.visible) {
      if(Math.hypot(b.x - player.x, b.y - player.y) < 22) {
        player.health -= 25;
        const pct = Math.max(0, Math.round((player.health / player.maxHealth) * 100));
        document.getElementById('blueHealth').innerText = pct + '%';
        bullets.splice(i, 1);
        playHit();
        
        if(player.health <= 0) {
          player.explode();
          triggerRespawn(false); 
        }
        continue;
      }
    }

    if(b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
      bullets.splice(i, 1);
    }
  }

  for(let i = smokeParticles.length - 1; i >= 0; i--) {
    let s = smokeParticles[i];
    ctx.fillStyle = 'rgba(200, 200, 200, ' + s.alpha + ')';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
    ctx.fill();
    s.alpha -= 0.025;
    if(s.alpha <= 0) smokeParticles.splice(i, 1);
  }

  for(let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += GRAVITY * 0.5;
    p.life -= 0.02;

    if(p.life <= 0) {
      particles.splice(i, 1);
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1.0;
    }
  }

  requestAnimationFrame(update);
}

update();
</script>
</body>
</html>`;

  const data = {
    response_id: "PopiooNixelPopiooNixelPopiooNixel",
    sections: [
      {
        __typename: "GenAIUnifiedResponseSection",
        view_model: {
          __typename: "GenAISingleLayoutViewModel",
          primitive: {
            __typename: "GenAIBotProgressStatusPrimitive",
            title: "𝚂𝙷𝙰𝙽𝙺𝚂:𝙎𝙃𝘼𝙉𝙆𝙎 Gun Spin",
            is_in_progress: true
          }
        }
      }
    ],
    embedded_screens: [
      {
        title: "Preview",
        content: [
          {
            __typename: "FOAIDNixelButtonSheets",
            tabs: [
              {
                id: "tab_0",
                tab_header: "Gun Spin",
                sections: [
                  {
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: HTML,
                        url: "https://shanks-code.com",
                        trusted_sources: ["shanks-code.com"]
                      }
                    }
                  }
                ],
                step_entries: []
              }
            ]
          }
        ]
      }
    ]
  };

  await client.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {
          messageDisclaimerText: "",
          richResponseSourcesMetadata: {}
        }
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            unifiedResponse: {
              data: Buffer.from(JSON.stringify(data)).toString('base64')
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: { botJid: "0@bot" },
              forwardOrigin: 4
            }
          }
        }
      }
    },
    {
      messageId: await client.generateMessageTag()
    }
  );
};

handler.help = ['لعبة-المسدسات', 'guns'];
handler.tags = ['tools', 'game'];
handler.command = /^(مسدسات|فليب|حرب-المسدسات)$/i;

export default handler;