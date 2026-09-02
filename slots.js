/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه slots استعملها بي الحلال يا كلب😭
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
        messageDisclaimerText: "SHANKS SYSTEM",
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
              messageText: "👑 SHANKS FRUIT SPINNER"
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
font-family:Arial, sans-serif;
-webkit-tap-highlight-color:transparent;
user-select:none;
-webkit-user-select:none;
}

body{
background:#041a12;
padding:6px;
color:#f6f1d5;
width:100%;
}

#app{
width:100%;
margin:0 auto;
}

.machine{
position:relative;
width:100%;
padding:12px 10px 14px;
border-radius:22px;
background:linear-gradient(180deg, #104b38 0%, #062b1e 100%);
border:3px solid #bba052;
box-shadow:
0 0 0 3px #062217,
0 0 0 6px #d5b85c,
inset 0 0 15px rgba(0,0,0,0.8);
}

.topLight{
height:10px;
margin:0 15px 8px;
border-radius:6px;
background:#051f15;
border:1.5px solid #5d8a52;
box-shadow:0 0 10px rgba(146,255,187,.5);
display:flex;
align-items:center;
justify-content:space-around;
overflow:hidden;
}

.topLight span{
width:12px;
height:4px;
background:#eaffdc;
border-radius:2px;
box-shadow:0 0 5px #d8ffd0;
}

.titleBox{
position:relative;
height:48px;
border-radius:14px;
border:2.5px solid #c5a854;
background:linear-gradient(180deg, #125540 0%, #083325 100%);
display:flex;
align-items:center;
justify-content:center;
box-shadow:inset 0 2px 6px rgba(255,220,120,.2);
}

.title{
font-size:18px;
font-weight:900;
letter-spacing:1px;
color:#fdfae6;
text-shadow:0 2px 4px #000;
}

.sub{
margin:5px auto 8px;
width:75%;
height:24px;
border:1.5px solid #c5a854;
border-radius:12px;
background:linear-gradient(180deg, #104b38 0%, #073123 100%);
display:flex;
align-items:center;
justify-content:center;
font-size:10px;
font-weight:800;
color:#d5ebd9;
letter-spacing:0.8px;
white-space:nowrap;
}

.stats{
display:grid;
grid-template-columns:1fr 1fr 1fr;
height:48px;
border-radius:12px;
overflow:hidden;
background:linear-gradient(180deg, #07261b 0%, #031710 100%);
border:2px solid #1c4d3d;
margin-bottom:8px;
}

.stat{
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
border-right:1px solid rgba(206,189,112,.25);
}

.stat:last-child{
border-right:0;
}

.statLabel{
font-size:9px;
font-weight:800;
color:#8ea899;
}

.statValue{
font-size:16px;
font-weight:900;
color:#ffffff;
margin-top:1px;
}

.slotFrame{
padding:6px;
border-radius:16px;
background:linear-gradient(180deg, #998348 0%, #d8be65 25%, #184232 75%, #a58a49 100%);
box-shadow:0 4px 0 #051810;
}

.slots{
position:relative;
display:grid;
grid-template-columns:repeat(5,1fr);
height:160px;
overflow:hidden;
border-radius:10px;
background:#f7f0da;
border:3px solid #082218;
}

.reel{
display:flex;
flex-direction:column;
height:100%;
border-right:1px solid rgba(85,55,25,.3);
background:linear-gradient(90deg, rgba(255,255,255,.25), transparent 20%, transparent 80%, rgba(70,40,10,.18));
}

.reel:last-child{
border-right:0;
}

.cell{
height:33.333%;
display:flex;
align-items:center;
justify-content:center;
font-size:26px;
position:relative;
}

.cell:after{
content:"";
position:absolute;
bottom:0;
left:0;
right:0;
height:1px;
background:rgba(80,50,20,.15);
}

.cell.seven{
font-family:'Arial Black', sans-serif;
font-size:30px;
font-weight:900;
color:#d20d20;
text-shadow:1.5px 1.5px 0 #fff;
}

.slots.spinning .reel{
animation:blurSpin .16s linear infinite;
}

@keyframes blurSpin{
0%{transform:translateY(-3px)}
50%{transform:translateY(3px)}
100%{transform:translateY(-3px)}
}

.message{
height:34px;
margin-top:8px;
border-radius:10px;
border:2px solid #164939;
background:linear-gradient(180deg, #09281f 0%, #051a14 100%);
display:flex;
align-items:center;
justify-content:center;
font-size:12px;
font-weight:900;
color:#6fcb95;
letter-spacing:0.8px;
}

.controls{
margin-top:8px;
padding:6px;
border-radius:14px;
background:linear-gradient(180deg, #ba9e55 0%, #5d7847 30%, #164835 70%, #0a2d21 100%);
border:2px solid #cbaf5a;
display:grid;
grid-template-columns:1fr 1.5fr;
gap:8px;
}

button{
border:0;
font-weight:900;
color:white;
cursor:pointer;
touch-action:manipulation;
}

.bet{
height:42px;
border-radius:12px;
background:linear-gradient(180deg, #20775a 0%, #0b4835 100%);
border:2px solid #5b180f;
font-size:14px;
text-shadow:0 1px 2px #000;
}

.spin{
height:42px;
border-radius:12px;
background:linear-gradient(180deg, #5ebd39 0%, #228828 55%, #106321 100%);
border:2px solid #5b180f;
font-size:16px;
text-shadow:0 1px 2px #000;
}

.spin:active,
.bet:active{
transform:translateY(2px);
}

.spin.ready{
animation:pulse 1s infinite;
}

@keyframes pulse{
50%{filter:brightness(1.15)}
}

.brand{
text-align:center;
font-size:9px;
font-weight:900;
letter-spacing:1.5px;
margin-top:8px;
color:rgba(240,231,190,.8);
}

.win{
animation:winFlash .45s ease-in-out 3;
}

@keyframes winFlash{
50%{
filter:brightness(1.3);
}
}
</style>

<div id="app">

<div class="machine">

<div class="topLight">
<span></span><span></span><span></span><span></span><span></span>
<span></span><span></span><span></span><span></span><span></span>
</div>

<div class="titleBox">
<div class="title">SHANKS FRUIT</div>
</div>

<div class="sub">
JACKPOT · 10,000 CREDITS
</div>

<div class="stats">

<div class="stat">
<div class="statLabel">CREDITS</div>
<div class="statValue" id="score">500</div>
</div>

<div class="stat">
<div class="statLabel">BET</div>
<div class="statValue" id="betVal">10</div>
</div>

<div class="stat">
<div class="statLabel">BEST WIN</div>
<div class="statValue" id="best">0</div>
</div>

</div>

<div class="slotFrame">

<div class="slots" id="slots">

<div class="reel">
<div class="cell">🍋</div>
<div class="cell">🍒</div>
<div class="cell">💎</div>
</div>

<div class="reel">
<div class="cell">🍒</div>
<div class="cell">🔔</div>
<div class="cell seven">7</div>
</div>

<div class="reel">
<div class="cell">💎</div>
<div class="cell">🍒</div>
<div class="cell">🔔</div>
</div>

<div class="reel">
<div class="cell">🍒</div>
<div class="cell">🍒</div>
<div class="cell">💎</div>
</div>

<div class="reel">
<div class="cell">🍒</div>
<div class="cell">🔔</div>
<div class="cell">🔔</div>
</div>

</div>

</div>

<div class="message" id="message">
SPIN TO PLAY
</div>

<div class="controls">

<button class="bet" id="betBtn">
BET +
</button>

<button class="spin" id="spin">
SPIN
</button>

</div>

<div class="brand">
SHANKS SYSTEM
</div>

</div>

</div>

<script>
(function(){

const symbols=["🍒","🍋","💎","🔔","7"];

const reels=[
document.querySelectorAll(".reel")[0],
document.querySelectorAll(".reel")[1],
document.querySelectorAll(".reel")[2],
document.querySelectorAll(".reel")[3],
document.querySelectorAll(".reel")[4]
];

const scoreEl=document.getElementById("score");
const bestEl=document.getElementById("best");
const betValEl=document.getElementById("betVal");
const message=document.getElementById("message");
const slots=document.getElementById("slots");
const spinButton=document.getElementById("spin");
const betButton=document.getElementById("betBtn");

let score=500;
let bet=10;
let best=0;
let spinning=false;

try{
best=parseInt(localStorage.getItem("shanks_fruit_best")||"0",10)||0;
}catch(e){}

bestEl.textContent=best;

function randomSymbol(){
return symbols[Math.floor(Math.random()*symbols.length)];
}

function setReel(reel,values){
const cells=reel.querySelectorAll(".cell");
cells.forEach(function(cell,index){
let value=values[index];
cell.textContent=value;
cell.classList.toggle("seven",value==="7");
});
}

function generateResult(){
let result=[];
for(let i=0;i<5;i++){
result.push([randomSymbol(),randomSymbol(),randomSymbol()]);
}
return result;
}

function calculateScore(result){
let points=0;
let middle=result.map(r=>r[1]);
let counts={};
middle.forEach(s=>{counts[s]=(counts[s]||0)+1;});

Object.keys(counts).forEach(s=>{
let n=counts[s];
if(n===5) points+=bet*100;
else if(n===4) points+=bet*50;
else if(n===3) points+=bet*10;
else if(n===2) points+=bet*2;
});

if(middle.every(s=>s==="7")) points+=bet*200;
if(middle.every(s=>s==="💎")) points+=bet*150;

return points;
}

function spin(){
if(spinning) return;
if(score < bet){
message.textContent="NOT ENOUGH CREDITS!";
return;
}

score -= bet;
scoreEl.textContent=score;
spinning=true;

spinButton.disabled=true;
spinButton.classList.remove("ready");

slots.classList.add("spinning");
message.textContent="SPINNING...";

let result=generateResult();
let duration=850;

reels.forEach(function(reel,index){
let timer=0;
let interval=setInterval(function(){
setReel(reel,[randomSymbol(),randomSymbol(),randomSymbol()]);
timer+=70;

if(timer>=duration+index*180){
clearInterval(interval);
setReel(reel,result[index]);

if(index===reels.length-1){
setTimeout(function(){
finish(result);
},180);
}
}
},70);
});
}

function finish(result){
slots.classList.remove("spinning");
let gained=calculateScore(result);

score+=gained;
scoreEl.textContent=score;

if(gained>0){
message.textContent="+"+gained+" CREDITS!";
if(gained>best){
best=gained;
try{localStorage.setItem("shanks_fruit_best",String(best));}catch(e){}
bestEl.textContent=best;
}
if(gained>=bet*10){
message.textContent="🎉 BIG WIN! +"+gained;
slots.classList.add("win");
setTimeout(()=>slots.classList.remove("win"),1400);
}
}else{
message.textContent="TRY AGAIN!";
}

spinning=false;
spinButton.disabled=false;
spinButton.classList.add("ready");
}

betButton.addEventListener("pointerdown",function(e){
e.preventDefault();
if(spinning) return;
bet += 10;
if(bet > 100) bet = 10;
betValEl.textContent = bet;
});

spinButton.addEventListener("pointerdown",function(e){
e.preventDefault();
spin();
});

document.addEventListener("keydown",function(e){
if(e.code==="Space"){
e.preventDefault();
spin();
}
});

spinButton.classList.add("ready");

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
  'fruit',
  'slots',
  'spinner',
  'فواكه'
]

export default handler