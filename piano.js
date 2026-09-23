/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه بيانو full screen 
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, sock }) => {
  const client = sock || conn;

  const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>لحن — 𝚂𝙷𝙰𝙽𝙺𝚂</title>
<style>
:root{
  --bg:transparent;
  --card:transparent;
  --card-2:#2a3942;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#111b21;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.stage{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:24px 16px;
}
.card{width:100%;max-width:360px;}
.header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:14px;padding-bottom:12px;
  border-bottom:1px solid var(--line);
  gap:8px;
}
.header__title{font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-.005em;}
.header__sub{font-size:12px;color:var(--muted)}
.status{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:14px;font-size:13px;gap:8px;
}
.status__turn{display:flex;align-items:center;gap:8px;color:var(--ink-soft)}
.status__score{
  display:flex;gap:12px;
  font-variant-numeric:tabular-nums;
  color:var(--muted);font-size:12px;
}
.status__score b{color:var(--accent);font-weight:600;margin-right:3px;}

.keyboard{
  width:100%;
  height:180px;
  position:relative;
  display:flex;
  background:var(--cell-bg);
  border-radius:8px;
  overflow:hidden;
  border:1px solid var(--line);
}
.white-key{
  flex:1;
  background:#e9edef;
  border:1px solid var(--line-strong);
  border-bottom-left-radius:4px;
  border-bottom-right-radius:4px;
  position:relative;
  z-index:1;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  align-items:center;
  padding-bottom:10px;
  cursor:pointer;
  touch-action:none;
}
.white-key:active, .white-key.is-active{
  background:#aebac1;
}
.black-key{
  position:absolute;
  width:8%;
  height:60%;
  background:#111b21;
  z-index:2;
  border-bottom-left-radius:3px;
  border-bottom-right-radius:3px;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  align-items:center;
  padding-bottom:6px;
  border:1px solid var(--line-strong);
  touch-action:none;
}
.black-key:active, .black-key.is-active{
  background:var(--accent);
}
.key-label{
  font-size:10px;
  font-weight:bold;
  pointer-events:none;
}
.white-key .key-label{color:#111b21;}
.black-key .key-label{color:#e9edef;font-size:8px;}

/* Instruments & Controls */
.levels{margin-top:14px}
.levels__label{font-size:11px;color:var(--muted);margin-bottom:8px;}
.levels__list{
  display:flex;flex-wrap:nowrap;gap:8px;
  overflow-x:auto;overflow-y:hidden;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;-ms-overflow-style:none;
  padding:2px 2px 6px;margin:0 -2px;
}
.levels__list::-webkit-scrollbar{display:none;}
.level{
  background:transparent;border:1px solid var(--line-strong);
  border-radius:20px;padding:8px 14px;
  font-size:12px;font-weight:500;color:var(--ink-soft);
  cursor:pointer;font-family:inherit;
  transition:color .15s ease,border-color .15s ease,background .15s ease;
  white-space:nowrap;flex-shrink:0;
}
.level:hover{color:var(--ink);border-color:var(--ink-soft)}
.level.is-active{
  background:var(--accent);border-color:var(--accent);
  color:#0b141a;
}
.footer{margin-top:12px;display:flex;justify-content:space-between;gap:8px;}
.footer__btn{
  background:transparent;border:1px solid var(--line-strong);color:var(--ink-soft);
  font-family:inherit;font-size:12px;font-weight:500;
  cursor:pointer;padding:8px 12px;border-radius:6px;
  transition:color .15s ease;flex:1;text-align:center;
}
.footer__btn.is-active{background:var(--accent-2);color:#fff;border-color:var(--accent-2);}
@media (max-width:380px){
  .stage{padding:16px 12px}
  .level{padding:7px 12px;font-size:11px}
}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">لحن الموسيقي</div>
      <div class="header__sub">بواسطة: 𝚂𝙷𝙰𝙽𝙺𝚂</div>
    </div>
    <div class="status">
      <div class="status__turn">
        <span id="inst-display">بيانو كبير</span>
      </div>
      <div class="status__score">
        <span>النوتة: <b id="note-display">--</b></span>
      </div>
    </div>

    <div class="keyboard" id="keyboard"></div>

    <div class="levels">
      <div class="levels__label">اختر الآلة الموسيقية</div>
      <div class="levels__list" id="instruments-list">
        <button class="level is-active" data-inst="piano">Grand Piano</button>
        <button class="level" data-inst="pipe">Pipe Organ</button>
        <button class="level" data-inst="rock">Rock Organ</button>
        <button class="level" data-inst="brass">Brass Solo</button>
        <button class="level" data-inst="strings">Strings</button>
        <button class="level" data-inst="synth">Synth</button>
      </div>
    </div>

    <div class="footer">
      <button class="footer__btn" id="octave-btn">C3 - C5</button>
      <button class="footer__btn" id="sustain-btn">SUSTAIN: OFF</button>
      <button class="footer__btn" id="demo-btn">عرض نغمة</button>
    </div>
  </div>
</main>

<script>
let audioCtx = null;
let currentInst = 'piano';
let sustain = false;
let octOffset = 0;

const NOTES = [
  { note: 'C', octave: 3, label: 'Do', type: 'white' },
  { note: 'C#', octave: 3, label: 'Do#', type: 'black', pos: 1 },
  { note: 'D', octave: 3, label: 'Re', type: 'white' },
  { note: 'D#', octave: 3, label: 'Re#', type: 'black', pos: 2 },
  { note: 'E', octave: 3, label: 'Mi', type: 'white' },
  { note: 'F', octave: 3, label: 'Fa', type: 'white' },
  { note: 'F#', octave: 3, label: 'Fa#', type: 'black', pos: 4 },
  { note: 'G', octave: 3, label: 'Sol', type: 'white' },
  { note: 'G#', octave: 3, label: 'Sol#', type: 'black', pos: 5 },
  { note: 'A', octave: 3, label: 'La', type: 'white' },
  { note: 'A#', octave: 3, label: 'La#', type: 'black', pos: 6 },
  { note: 'B', octave: 3, label: 'Si', type: 'white' },
  
  { note: 'C', octave: 4, label: 'Do', type: 'white' },
  { note: 'C#', octave: 4, label: 'Do#', type: 'black', pos: 8 },
  { note: 'D', octave: 4, label: 'Re', type: 'white' },
  { note: 'D#', octave: 4, label: 'Re#', type: 'black', pos: 9 },
  { note: 'E', octave: 4, label: 'Mi', type: 'white' },
  { note: 'F', octave: 4, label: 'Fa', type: 'white' },
  { note: 'F#', octave: 4, label: 'Fa#', type: 'black', pos: 11 },
  { note: 'G', octave: 4, label: 'Sol', type: 'white' },
  { note: 'G#', octave: 4, label: 'Sol#', type: 'black', pos: 12 },
  { note: 'A', octave: 4, label: 'La', type: 'white' },
  { note: 'A#', octave: 4, label: 'La#', type: 'black', pos: 13 },
  { note: 'B', octave: 4, label: 'Si', type: 'white' },
  { note: 'C', octave: 5, label: 'Do', type: 'white' }
];

const $=id=>document.getElementById(id);
const keyboardEl=$('keyboard'), noteDisplay=$('note-display'), instDisplay=$('inst-display');

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function getFreq(note, octave) {
  const map = { 'C':0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11 };
  const idx = map[note] + (octave + octOffset) * 12;
  return 440 * Math.pow(2, (idx - 57) / 12);
}

function playNote(nObj) {
  initAudio();
  if (!audioCtx) return;

  const freq = getFreq(nObj.note, nObj.octave);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  let wave = 'triangle';
  if (currentInst === 'pipe') wave = 'sine';
  else if (currentInst === 'rock' || currentInst === 'brass') wave = 'sawtooth';
  else if (currentInst === 'strings' || currentInst === 'synth') wave = 'square';

  osc.type = wave;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  const now = audioCtx.currentTime;
  const duration = sustain ? 1.2 : 0.35;

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);

  noteDisplay.textContent = nObj.label + ' (' + nObj.note + (nObj.octave + octOffset) + ')';
}

function buildKeyboard(){
  keyboardEl.innerHTML = '';
  const whiteNotes = NOTES.filter(n => n.type === 'white');
  const totalWhite = whiteNotes.length;

  NOTES.forEach(n => {
    const key = document.createElement('div');
    if (n.type === 'white') {
      key.className = 'white-key';
      key.innerHTML = '<span class="key-label">' + n.label + '</span>';
    } else {
      key.className = 'black-key';
      key.style.left = ((n.pos - 0.35) / totalWhite * 100) + '%';
      key.innerHTML = '<span class="key-label">' + n.label + '</span>';
    }

    const trigger = (e) => {
      e.preventDefault();
      key.classList.add('is-active');
      playNote(n);
      setTimeout(() => key.classList.remove('is-active'), 200);
    };

    key.addEventListener('touchstart', trigger);
    key.addEventListener('mousedown', trigger);
    keyboardEl.appendChild(key);
  });
}

document.querySelectorAll('#instruments-list .level').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#instruments-list .level').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentInst = btn.dataset.inst;
    instDisplay.textContent = btn.textContent;
  });
});

$('sustain-btn').addEventListener('click', () => {
  sustain = !sustain;
  $('sustain-btn').classList.toggle('is-active', sustain);
  $('sustain-btn').textContent = 'SUSTAIN: ' + (sustain ? 'ON' : 'OFF');
});

$('octave-btn').addEventListener('click', () => {
  if (octOffset === 0) { octOffset = 1; $('octave-btn').textContent = 'C4 - C6'; }
  else if (octOffset === 1) { octOffset = -1; $('octave-btn').textContent = 'C2 - C4'; }
  else { octOffset = 0; $('octave-btn').textContent = 'C3 - C5'; }
});

$('demo-btn').addEventListener('click', () => {
  const demo = [NOTES[0], NOTES[2], NOTES[4], NOTES[5], NOTES[7], NOTES[9], NOTES[11], NOTES[12]];
  demo.forEach((n, i) => {
    setTimeout(() => playNote(n), i * 280);
  });
});

buildKeyboard();
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
            title: "𝚂𝙷𝙰𝙽𝙺𝚂:𝙎𝙃𝘼𝙉𝙆𝙎 piano",
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
                tab_header: "Piano",
                sections: [
                  {
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: HTML,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
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

handler.help = ['لحن', 'piano'];
handler.tags = ['tools', 'game'];
handler.command = /^(لحن|piano|بيانو)$/i;

export default handler;