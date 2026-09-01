/*╭━━━〔 CREDITS FOR 𝕊ℍ𝔸ℕ𝕂𝕊〕━━━╮
│ 👑 الـمـطـور ↜𝕊ℍ𝔸ℕ𝕂𝕊
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y 
الوظيفة: لعبه X O البروتوكول الجديد هتعجبك
╰━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn }) => {
  const htmlPayload = `<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
}

body{
  margin:0;
  background:transparent;
  color:#fff;
  font-family:Arial,sans-serif;
  touch-action:manipulation;
}

.wrap{
  width:100%;
  max-width:500px;
  margin:auto;
  padding:14px;
}

.card{
  padding:18px;
  border-radius:22px;
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.09),
      rgba(255,255,255,.025)
    );
  border:1px solid rgba(255,255,255,.13);
  box-shadow:
    0 20px 60px rgba(0,0,0,.55);
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

.brand small{
  display:block;
  color:rgba(255,255,255,.38);
  font-size:8px;
  letter-spacing:3px;
}

.brand b{
  display:block;
  margin-top:4px;
  font-size:21px;
  letter-spacing:.5px;
}

.status{
  text-align:right;
  font-size:10px;
  color:rgba(255,255,255,.55);
}

.score{
  margin-top:4px;
  color:#fff;
  font-size:13px;
}

.controls{
  display:flex;
  gap:8px;
  margin-bottom:14px;
}

select,
button{
  flex:1;
  min-width:0;
  border:1px solid rgba(255,255,255,.13);
  border-radius:11px;
  padding:11px;
  background:#111116;
  color:#fff;
  font-weight:bold;
  outline:none;
}

button{
  cursor:pointer;
}

button:active{
  transform:scale(.95);
}

.board{
  position:relative;
  width:100%;
  aspect-ratio:1;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:7px;
  padding:7px;
  border-radius:17px;
  background:#07070b;
  border:1px solid rgba(255,255,255,.09);
}

.cell{
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:13px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.065);
  font-size:52px;
  font-weight:900;
  cursor:pointer;
  transition:
    transform .12s,
    background .12s;
}

.cell:active{
  transform:scale(.92);
}

.cell.x{
  color:#fff;
  text-shadow:
    0 0 12px rgba(255,255,255,.8),
    0 0 28px rgba(255,255,255,.35);
}

.cell.o{
  color:#8d7cff;
  text-shadow:
    0 0 12px rgba(141,124,255,.9),
    0 0 28px rgba(141,124,255,.45);
}

.cell.win{
  animation:win .55s infinite alternate;
}

@keyframes win{
  from{
    transform:scale(1);
    background:rgba(255,255,255,.06);
  }
  to{
    transform:scale(1.06);
    background:rgba(255,255,255,.17);
    box-shadow:
      0 0 25px rgba(255,255,255,.35);
  }
}

.win-line{
  position:absolute;
  height:5px;
  border-radius:10px;
  background:#fff;
  box-shadow:
    0 0 10px #fff,
    0 0 25px rgba(141,124,255,.9);
  transform-origin:left center;
  transform:scaleX(0);
  transition:
    transform .5s cubic-bezier(.2,.8,.2,1);
  z-index:10;
  pointer-events:none;
}

.info{
  margin-top:12px;
  text-align:center;
  color:rgba(255,255,255,.42);
  font-size:10px;
}

.overlay{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(0,0,0,.76);
  backdrop-filter:blur(7px);
  opacity:0;
  pointer-events:none;
  transition:.25s;
  z-index:99;
}

.overlay.show{
  opacity:1;
  pointer-events:auto;
}

.result{
  width:min(88%,340px);
  padding:27px 20px;
  text-align:center;
  border-radius:22px;
  background:#111116;
  border:1px solid rgba(255,255,255,.15);
  box-shadow:
    0 25px 70px rgba(0,0,0,.8);
  transform:scale(.7);
  transition:
    transform .35s cubic-bezier(.2,.8,.2,1);
}

.overlay.show .result{
  transform:scale(1);
}

.icon{
  font-size:52px;
  margin-bottom:7px;
  animation:pop .5s;
}

@keyframes pop{
  0%{
    transform:scale(.2);
  }
  70%{
    transform:scale(1.2);
  }
  100%{
    transform:scale(1);
  }
}

.result h1{
  margin:0;
  font-size:28px;
  letter-spacing:2px;
}

.result p{
  margin:9px 0 20px;
  color:rgba(255,255,255,.45);
  font-size:12px;
}

.result button{
  width:100%;
  background:#fff;
  color:#111;
}
</style>

<div class="wrap">

  <div class="card">

    <div class="header">

      <div class="brand">
        <small>SHANKS ARCADE</small>
        <b>TIC TAC TOE</b>
      </div>

      <div class="status">
        <div id="turn">
          YOUR TURN
        </div>

        <div class="score">
          <span id="wins">0</span>
          -
          <span id="losses">0</span>
          -
          <span id="draws">0</span>
        </div>
      </div>

    </div>

    <div class="controls">

      <select id="difficulty">
        <option value="easy">
          EASY
        </option>

        <option value="normal" selected>
          NORMAL
        </option>

        <option value="hard">
          HARD
        </option>
      </select>

      <button id="reset">
        RESET
      </button>

    </div>

    <div id="board" class="board">

      <div
        id="winLine"
        class="win-line">
      </div>

      <div class="cell" data-i="0"></div>
      <div class="cell" data-i="1"></div>
      <div class="cell" data-i="2"></div>

      <div class="cell" data-i="3"></div>
      <div class="cell" data-i="4"></div>
      <div class="cell" data-i="5"></div>

      <div class="cell" data-i="6"></div>
      <div class="cell" data-i="7"></div>
      <div class="cell" data-i="8"></div>

    </div>

    <div
      class="info"
      id="info">
      YOU = X • CPU = O
    </div>

  </div>

</div>

<div
  id="overlay"
  class="overlay">

  <div class="result">

    <div
      class="icon"
      id="resultIcon">
      🏆
    </div>

    <h1 id="resultTitle">
      YOU WIN
    </h1>

    <p id="resultText">
      Nice move.
    </p>

    <button id="playAgain">
      PLAY AGAIN
    </button>

  </div>

</div>

<script>
const cells=[
  ...document.querySelectorAll(".cell")
];

const boardEl=
  document.getElementById("board");

const difficulty=
  document.getElementById("difficulty");

const resetBtn=
  document.getElementById("reset");

const turnEl=
  document.getElementById("turn");

const infoEl=
  document.getElementById("info");

const overlay=
  document.getElementById("overlay");

const resultIcon=
  document.getElementById("resultIcon");

const resultTitle=
  document.getElementById("resultTitle");

const resultText=
  document.getElementById("resultText");

const playAgain=
  document.getElementById("playAgain");

const winLine=
  document.getElementById("winLine");

const winsEl=
  document.getElementById("wins");

const lossesEl=
  document.getElementById("losses");

const drawsEl=
  document.getElementById("draws");


let board=
  Array(9).fill("");

let gameOver=false;
let playerTurn=true;

let wins=0;
let losses=0;
let draws=0;



let audioCtx=null;

function audio(){

  if(!audioCtx){

    audioCtx=
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

  if(
    audioCtx.state==="suspended"
  ){

    audioCtx.resume();

  }

  return audioCtx;
}


function tone(
  frequency,
  duration,
  type="sine",
  volume=.05
){

  const ctx=audio();

  const osc=
    ctx.createOscillator();

  const gain=
    ctx.createGain();

  osc.type=type;

  osc.frequency.value=
    frequency;

  gain.gain.setValueAtTime(
    volume,
    ctx.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    .001,
    ctx.currentTime+duration
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();

  osc.stop(
    ctx.currentTime+duration
  );
}


function clickSound(){

  tone(
    520,
    .07,
    "square",
    .035
  );

}


function moveSound(){

  tone(
    650,
    .09,
    "sine",
    .05
  );

}


function errorSound(){

  tone(
    130,
    .15,
    "sawtooth",
    .05
  );

}


function winSound(){

  tone(
    523,
    .15,
    "sine",
    .06
  );

  setTimeout(
    ()=>{
      tone(
        659,
        .15,
        "sine",
        .06
      );
    },
    120
  );

  setTimeout(
    ()=>{
      tone(
        784,
        .25,
        "sine",
        .07
      );
    },
    240
  );

}


function loseSound(){

  tone(
    330,
    .18,
    "sawtooth",
    .05
  );

  setTimeout(
    ()=>{
      tone(
        220,
        .3,
        "sawtooth",
        .05
      );
    },
    180
  );

}


function drawSound(){

  tone(
    440,
    .12,
    "square",
    .04
  );

  setTimeout(
    ()=>{
      tone(
        440,
        .18,
        "square",
        .04
      );
    },
    150
  );

}



const combinations=[
  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6]
];


function checkWinner(b){

  for(
    const combo of combinations
  ){

    const [a,c,d]=combo;

    if(
      b[a] &&
      b[a]===b[c] &&
      b[a]===b[d]
    ){

      return{
        winner:b[a],
        combo:combo
      };

    }

  }

  if(
    b.every(
      cell=>cell!==""
    )
  ){

    return{
      winner:"draw",
      combo:null
    };

  }

  return null;
}


function render(){

  cells.forEach(
    (cell,i)=>{

      cell.textContent=
        board[i];

      cell.classList.remove(
        "x",
        "o"
      );

      if(board[i]){

        cell.classList.add(
          board[i].toLowerCase()
        );

      }

    }
  );

}


function showWinLine(combo){

  if(!combo)return;

  const first=
    cells[combo[0]];

  const last=
    cells[combo[2]];

  const boardRect=
    boardEl.getBoundingClientRect();

  const firstRect=
    first.getBoundingClientRect();

  const lastRect=
    last.getBoundingClientRect();

  const x1=
    firstRect.left+
    firstRect.width/2-
    boardRect.left;

  const y1=
    firstRect.top+
    firstRect.height/2-
    boardRect.top;

  const x2=
    lastRect.left+
    lastRect.width/2-
    boardRect.left;

  const y2=
    lastRect.top+
    lastRect.height/2-
    boardRect.top;

  const dx=x2-x1;
  const dy=y2-y1;

  const length=
    Math.sqrt(
      dx*dx+dy*dy
    );

  const angle=
    Math.atan2(
      dy,
      dx
    )*180/Math.PI;

  winLine.style.left=
    x1+"px";

  winLine.style.top=
    y1+"px";

  winLine.style.width=
    length+"px";

  winLine.style.transform=
    "rotate("+
    angle+
    "deg) scaleX(1)";

  combo.forEach(
    i=>{
      cells[i].classList.add(
        "win"
      );
    }
  );

}


function resetLine(){

  winLine.style.transform=
    "rotate(0deg) scaleX(0)";

  cells.forEach(
    cell=>{
      cell.classList.remove(
        "win"
      );
    }
  );

}


function finish(result){

  gameOver=true;

  if(
    result.winner==="X"
  ){

    wins++;

    winsEl.textContent=
      wins;

    turnEl.textContent=
      "YOU WIN";

    resultIcon.textContent=
      "🏆";

    resultTitle.textContent=
      "YOU WIN";

    resultText.textContent=
      "عاش يا بطل! لعب ممتاز 🔥";

    winSound();

  }
  else if(
    result.winner==="O"
  ){

    losses++;

    lossesEl.textContent=
      losses;

    turnEl.textContent=
      "YOU LOSE";

    resultIcon.textContent=
      "❤️‍🔥";

    resultTitle.textContent=
      "YOU LOSE";

    resultText.textContent=
      "البوت فاز عليك المرادي!";

    loseSound();

  }
  else{

    draws++;

    drawsEl.textContent=
      draws;

    turnEl.textContent=
      "DRAW";

    resultIcon.textContent=
      "🤝";

    resultTitle.textContent=
      "DRAW";

    resultText.textContent=
      "تعادل بين الطرفين!";

    drawSound();

  }

  if(result.combo){

    showWinLine(
      result.combo
    );

  }

  setTimeout(
    ()=>{
      overlay.classList.add(
        "show"
      );
    },
    650
  );

}


function playerMove(index){

  if(
    gameOver ||
    !playerTurn ||
    board[index]
  ){

    if(
      !gameOver &&
      board[index]
    ){

      errorSound();

    }

    return;
  }

  audio();

  board[index]="X";

  playerTurn=false;

  moveSound();

  render();

  const result=
    checkWinner(board);

  if(result){

    finish(result);

    return;
  }

  turnEl.textContent=
    "CPU THINKING";

  infoEl.textContent=
    "جاري تفكير البوت...";

  setTimeout(
    cpuMove,
    350+
    Math.random()*350
  );

}


function emptyCells(b){

  const arr=[];

  b.forEach(
    (v,i)=>{

      if(!v){
        arr.push(i);
      }

    }
  );

  return arr;
}


function randomMove(){

  const available=
    emptyCells(board);

  return available[
    Math.floor(
      Math.random()*
      available.length
    )
  ];

}


function winningMove(symbol){

  for(
    const index of emptyCells(board)
  ){

    board[index]=symbol;

    const result=
      checkWinner(board);

    board[index]="";

    if(
      result &&
      result.winner===symbol
    ){

      return index;

    }

  }

  return null;
}


function mediumMove(){

  let move=
    winningMove("O");

  if(move!==null)
    return move;

  move=
    winningMove("X");

  if(move!==null)
    return move;

  if(!board[4])
    return 4;

  const corners=
    [0,2,6,8].filter(
      i=>!board[i]
    );

  if(corners.length){

    return corners[
      Math.floor(
        Math.random()*
        corners.length
      )
    ];

  }

  return randomMove();
}


function minimax(
  b,
  maximizing
){

  const result=
    checkWinner(b);

  if(result){

    if(
      result.winner==="O"
    )
      return 10;

    if(
      result.winner==="X"
    )
      return -10;

    return 0;
  }

  if(maximizing){

    let best=-Infinity;

    for(
      const i of emptyCells(b)
    ){

      b[i]="O";

      const value=
        minimax(
          b,
          false
        );

      b[i]="";

      best=
        Math.max(
          best,
          value
        );

    }

    return best;

  }

  let best=Infinity;

  for(
    const i of emptyCells(b)
  ){

    b[i]="X";

    const value=
      minimax(
        b,
        true
      );

    b[i]="";

    best=
      Math.min(
        best,
        value
      );

  }

  return best;
}


function hardMove(){

  let bestScore=
    -Infinity;

  let move=null;

  for(
    const i of emptyCells(board)
  ){

    board[i]="O";

    const score=
      minimax(
        board,
        false
      );

    board[i]="";

    if(score>bestScore){

      bestScore=score;
      move=i;

    }

  }

  return move;
}


function cpuMove(){

  if(gameOver)return;

  let move;

  if(
    difficulty.value==="easy"
  ){

    move=randomMove();

  }
  else if(
    difficulty.value==="normal"
  ){

    move=mediumMove();

  }
  else{

    move=hardMove();

  }

  if(
    move===undefined ||
    move===null
  ){

    move=randomMove();

  }

  board[move]="O";

  moveSound();

  render();

  const result=
    checkWinner(board);

  if(result){

    finish(result);

    return;
  }

  playerTurn=true;

  turnEl.textContent=
    "YOUR TURN";

  infoEl.textContent=
    "اختر مربعاً";

}



function startGame(){

  board=
    Array(9).fill("");

  gameOver=false;
  playerTurn=true;

  overlay.classList.remove(
    "show"
  );

  resetLine();

  turnEl.textContent=
    "YOUR TURN";

  infoEl.textContent=
    "YOU = X • CPU = O";

  render();

}


cells.forEach(
  (cell,i)=>{

    cell.addEventListener(
      "pointerdown",
      e=>{

        e.preventDefault();

        playerMove(i);

      }
    );

  }
);


resetBtn.addEventListener(
  "pointerdown",
  e=>{

    e.preventDefault();

    clickSound();

    startGame();

  }
);


playAgain.addEventListener(
  "pointerdown",
  e=>{

    e.preventDefault();

    clickSound();

    startGame();

  }
);


difficulty.addEventListener(
  "change",
  ()=>{

    clickSound();

    startGame();

  }
);


window.addEventListener(
  "resize",
  ()=>{

    const result=
      checkWinner(board);

    if(
      result &&
      result.combo &&
      gameOver
    ){

      showWinLine(
        result.combo
      );

    }

  }
);


startGame();
</script>`;

  try {
    await conn.relayMessage(
      m.chat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: "b2e40280-433c-45d8-9c1a-270bec558860",
            verificationMetadata: {
              proofs: [
                {
                  version: 1,
                  useCase: 1,
                  signature: "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==",
                  certificateChain: [
                    "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg"
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
                  messageText: "NEON TIC TAC TOE"
                }
              ],

              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: "4db57b2c-8393-484d-8b9a-8e6d1a14b349",

                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                            payload: htmlPayload,
                            trusted_sources: ["shanks.dev"]
                          },
                          __typename: "GenAISingleLayoutViewModel"
                        }
                      }
                    ]
                  })
                ).toString("base64")
              }
            }
          }
        }
      },
      {}
    )
  } catch (e) {
    console.error(e)
    m.reply("❌ حدث خطأ أثناء عرض اللعبة!")
  }
}

handler.help = ["xo", "tictactoe"]
handler.tags = ['games']
handler.command = /^(xo|tictactoe|تيك|اكس-او)$/i

export default handler
