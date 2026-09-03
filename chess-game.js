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
        this._title = "SHANKS BOT - CHESS";
        this._footer = "";
        this._responseId = "4db57b2c-8393-484d-8b9a-8e6d1a14b349";
        this._botResponseId = "b2e40280-433c-45d8-9c1a-270bec558860";
        this._sections = [];
        this._submessages = [{ messageType: 2, messageText: "SHANKS CHESS PRO" }];
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

    async build(
        jid,
        {
            forwarded = true,
            notification = false,
            includesUnifiedResponse = true,
            includesSubmessages = true,
            quoted,
            quotedParticipant,
            messageId,
            ...options
        } = {}
    ) {
        const forward = forwarded
            ? {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                    botJid: '867051314767696@bot'
                },
                forwardOrigin: 4
            }
            : {};

        const notif = notification
            ? {
                sessionTransparencyMetadata: {
                    disclaimerText: '~ SHANKS BOT',
                    hcaId: `hca_${Date.now()}`,
                    sessionTransparencyType: 1
                }
            }
            : {};

        const qObj = quoted
            ? {
                stanzaId: quoted?.key?.id || quoted?.id,
                participant:
                    quotedParticipant ||
                    quoted?.key?.participant ||
                    quoted?.participant ||
                    quoted?.key?.remoteJid,
                quotedType: 0,
                quotedMessage:
                    typeof quoted === 'object' && quoted !== null
                        ? (quoted.message ?? quoted)
                        : undefined
            }
            : {};

        const sections = this._footer
            ? [
                ...(await waitAllPromises(this._sections)),
                AIRich.newLayout('Single', {
                    text: this._footer,
                    __typename: 'GenAIMetadataTextPrimitive'
                })
            ]
            : [...(await waitAllPromises(this._sections))];

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
                    botMetadata: {
                        messageDisclaimerText: this._title,
                        ...notif,
                        verificationMetadata:
                            AIRich.generateVerificationMetadata(),
                        botResponseId: this._botResponseId
                    }
                },
                ...this._extraPayload,
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: includesSubmessages
                                ? await waitAllPromises(this._submessages)
                                : [],
                            unifiedResponse: {
                                data: includesUnifiedResponse
                                    ? Buffer.from(
                                        Toolkit.stringifyEscaped({
                                            response_id: this._responseId,
                                            sections
                                        })
                                    )
                                    : ''
                            },
                            contextInfo: {
                                ...forward,
                                ...qObj,
                                ...this._contextInfo
                            }
                        }
                    }
                }
            },
            {
                messageId:
                    messageId || generateMessageIDV2(),
                ...options
            }
        );
    }
}


const chessPayload = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">

<style>
*{
    box-sizing:border-box;
    margin:0;
    padding:0;
    font-family:'Segoe UI',Arial,sans-serif;
    user-select:none;
    touch-action:manipulation
}

html,body{
    width:100%;
    background:#0b141a;
    color:#eef2f7;
    padding:6px;
    overflow-y:auto
}

#app{
    max-width:380px;
    margin:0 auto;
    background:#111b21;
    border:1px solid #222d34;
    border-radius:14px;
    padding:10px;
    box-shadow:0 4px 20px rgba(0,0,0,0.5)
}

.top-bar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:4px 8px;
    margin-bottom:8px
}

.bot-name{
    font:900 14px Arial;
    color:#00a884;
    letter-spacing:0.5px
}

.game-title{
    font:900 16px 'Arial Black';
    color:#e9edef;
    text-align:center;
    margin-bottom:6px
}

.info-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:4px 8px;
    font-size:12px;
    color:#8696a0;
    margin-bottom:6px
}

.level-badge{
    background:#202c33;
    padding:3px 8px;
    border-radius:6px;
    color:#00a884;
    font-weight:bold;
    border:1px solid #2a3942
}

.board-wrap{
    position:relative;
    width:100%;
    aspect-ratio:1/1;
    border:3px solid #1f2c34;
    border-radius:8px;
    overflow:hidden;
    background:#0b141a
}

canvas{
    width:100%;
    height:100%;
    display:block;
    touch-action:none
}

.status-bar{
    text-align:center;
    font-size:13px;
    color:#8696a0;
    background:#202c33;
    padding:6px;
    border-radius:6px;
    margin:8px 0;
    border:1px solid #2a3942
}

.btn-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:6px
}

.action-btn{
    background:#202c33;
    border:1px solid #2a3942;
    color:#e9edef;
    padding:10px;
    border-radius:8px;
    font-size:13px;
    font-weight:bold;
    cursor:pointer;
    text-align:center;
    transition:background 0.2s
}

.action-btn:active{
    background:#00a884;
    color:#111b21
}

.overlay{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(11,20,26,0.96);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
    padding:15px;
    z-index:99;
    pointer-events:auto
}

.overlay.hidden{
    display:none
}

.overlay h2{
    color:#00a884;
    font-size:18px;
    margin-bottom:4px
}

.overlay p{
    color:#8696a0;
    font-size:11px;
    margin-bottom:8px
}

.overlay button{
    padding:10px 24px;
    background:#00a884;
    border:none;
    border-radius:8px;
    font-weight:bold;
    color:#111b21;
    font-size:14px;
    cursor:pointer;
    margin:4px
}

.promo-box{
    display:flex;
    flex-direction:column;
    gap:6px;
    width:100%;
    max-width:200px;
    margin-top:6px
}

.promo-btn{
    background:#202c33;
    border:1px solid #00a884;
    color:#fff;
    font-size:16px;
    padding:10px;
    border-radius:8px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    font-weight:bold
}

.promo-btn:active{
    background:#00a884;
    color:#111b21
}
</style>
</head>

<body>

<div id="app">

<div class="top-bar">
    <div class="bot-name">SHANKS BOT</div>
    <div class="level-badge" id="lvlBadge">مبتدئ ~ 800</div>
</div>

<div class="game-title">شطرنج ♟️</div>

<div class="info-row">
    <span>دورك (الأبيض)</span>
    <span id="turnIndicator">دورك</span>
</div>

<div class="board-wrap">

<canvas id="cv" width="360" height="360"></canvas>

<div id="menu" class="overlay">

<h2>لعبة الشطرنج الاحترافية ♟️</h2>

<p>
ترقية البيدق وتصميم مخصص للواتساب!
</p>

<button id="startBtn">
ابدأ اللعبة
</button>

</div>


<div id="promoModal" class="overlay hidden">

<h2>ترقية البيدق 👑</h2>

<p>
اختر القطعة:
</p>

<div class="promo-box">

<button class="promo-btn" data-piece="Q">
<span>♕</span> وزير (Queen)
</button>

<button class="promo-btn" data-piece="R">
<span>♖</span> قلعة (Rook)
</button>

<button class="promo-btn" data-piece="B">
<span>♗</span> فيل (Bishop)
</button>

<button class="promo-btn" data-piece="N">
<span>♘</span> حصان (Knight)
</button>

</div>

</div>


<div id="winMsg" class="overlay hidden">

<h2 id="endTitle">
انتهت اللعبة
</h2>

<p id="overText">
النتيجة
</p>

<button id="restartBtn">
لعب مرة أخرى
</button>

</div>

</div>


<div class="status-bar" id="statusBar">
اضغط على قطعتك ثم المكان الجديد
</div>

<div class="btn-grid">

<button class="action-btn" id="retryBtn">
لعب مرة أخرى
</button>

<button class="action-btn" id="levelBtn">
تغيير المستوى
</button>

</div>

</div>


<script>

(function() {

var cv = document.getElementById('cv');
var ctx = cv.getContext('2d');

var menu = document.getElementById('menu');
var winMsg = document.getElementById('winMsg');
var promoModal = document.getElementById('promoModal');

var overText = document.getElementById('overText');
var endTitle = document.getElementById('endTitle');

var startBtn = document.getElementById('startBtn');
var restartBtn = document.getElementById('restartBtn');
var retryBtn = document.getElementById('retryBtn');
var levelBtn = document.getElementById('levelBtn');

var statusBar = document.getElementById('statusBar');
var lvlBadge = document.getElementById('lvlBadge');

let board;
let turn;
let selectedPiece;
let validMoves;
let gameActive = false;
let pendingPromotion = null;


const levels = [

    {
        name:'مبتدئ ~ 800',
        val:800
    },

    {
        name:'متوسط ~ 1200',
        val:1200
    },

    {
        name:'محترف ~ 1600',
        val:1600
    },

    {
        name:'قائد ~ 3000+',
        val:3000
    }

];

let lvlIndex = 0;

function resetGame(e) {

    if(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    board = [

        ['r','n','b','q','k','b','n','r'],

        ['p','p','p','p','p','p','p','p'],

        ['','','','','','','',''],

        ['','','','','','','',''],

        ['','','','','','','',''],

        ['','','','','','','',''],

        ['P','P','P','P','P','P','P','P'],

        ['R','N','B','Q','K','B','N','R']

    ];

    turn = 'w';

    selectedPiece = null;

    validMoves = [];

    gameActive = true;

    pendingPromotion = null;

    menu.classList.add('hidden');

    winMsg.classList.add('hidden');

    promoModal.classList.add('hidden');

    statusBar.textContent = "دورك (الأبيض)";

    draw();

}

function isWhite(p) {

    return p >= 'A' && p <= 'Z';

}


function isBlack(p) {

    return p >= 'a' && p <= 'z';

}

function findKing(b,color) {

    let targetK =
        color === 'w'
            ? 'K'
            : 'k';

    for(let r=0;r<8;r++) {

        for(let c=0;c<8;c++) {

            if(b[r][c] === targetK) {

                return {
                    r:r,
                    c:c
                };

            }

        }

    }

    return null;

}

function getRawMoves(b,r,c) {

    let p = b[r][c];

    if(!p) return [];

    let moves = [];

    let color =
        isWhite(p)
            ? 'w'
            : 'b';

    let dir =
        color === 'w'
            ? -1
            : 1;

    let startRow =
        color === 'w'
            ? 6
            : 1;

    if(p.toLowerCase() === 'p') {

        let nr = r + dir;

        if(
            nr >= 0 &&
            nr < 8 &&
            !b[nr][c]
        ) {

            moves.push({
                r:nr,
                c:c
            });

            if(
                r === startRow &&
                !b[r + 2 * dir][c]
            ) {

                moves.push({
                    r:r + 2 * dir,
                    c:c
                });

            }

        }


        [-1,1].forEach(function(dc) {

            let nc = c + dc;

            let nr2 = r + dir;

            if(
                nr2 >= 0 &&
                nr2 < 8 &&
                nc >= 0 &&
                nc < 8
            ) {

                let target = b[nr2][nc];

                if(
                    target &&
                    (
                        (
                            color === 'w' &&
                            isBlack(target)
                        )
                        ||
                        (
                            color === 'b' &&
                            isWhite(target)
                        )
                    )
                ) {

                    moves.push({
                        r:nr2,
                        c:nc
                    });

                }

            }

        });

    }

    else if(p.toLowerCase() === 'n') {

        [
            [-2,-1],
            [-2,1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ].forEach(function(s) {

            let nr = r + s[0];
            let nc = c + s[1];

            if(
                nr >= 0 &&
                nr < 8 &&
                nc >= 0 &&
                nc < 8
            ) {

                let target = b[nr][nc];

                if(
                    !target ||
                    (
                        color === 'w'
                            ? isBlack(target)
                            : isWhite(target)
                    )
                ) {

                    moves.push({
                        r:nr,
                        c:nc
                    });

                }

            }

        });

    }

    else if(

        p.toLowerCase() === 'r' ||
        p.toLowerCase() === 'b' ||
        p.toLowerCase() === 'q'

    ) {

        let dirs = [];

        if(
            p.toLowerCase() === 'r' ||
            p.toLowerCase() === 'q'
        ) {

            dirs.push(
                [-1,0],
                [1,0],
                [0,-1],
                [0,1]
            );

        }

        if(
            p.toLowerCase() === 'b' ||
            p.toLowerCase() === 'q'
        ) {

            dirs.push(
                [-1,-1],
                [-1,1],
                [1,-1],
                [1,1]
            );

        }

        dirs.forEach(function(d) {

            let nr = r + d[0];
            let nc = c + d[1];

            while(
                nr >= 0 &&
                nr < 8 &&
                nc >= 0 &&
                nc < 8
            ) {

                let target = b[nr][nc];

                if(!target) {

                    moves.push({
                        r:nr,
                        c:nc
                    });

                } else {

                    if(
                        (
                            color === 'w' &&
                            isBlack(target)
                        )
                        ||
                        (
                            color === 'b' &&
                            isWhite(target)
                        )
                    ) {

                        moves.push({
                            r:nr,
                            c:nc
                        });

                    }

                    break;

                }

                nr += d[0];

                nc += d[1];

            }

        });

    }

    else if(p.toLowerCase() === 'k') {

        [
            [-1,-1],
            [-1,0],
            [-1,1],
            [0,-1],
            [0,1],
            [1,-1],
            [1,0],
            [1,1]
        ].forEach(function(s) {

            let nr = r + s[0];

            let nc = c + s[1];

            if(
                nr >= 0 &&
                nr < 8 &&
                nc >= 0 &&
                nc < 8
            ) {

                let target = b[nr][nc];

                if(
                    !target ||
                    (
                        color === 'w'
                            ? isBlack(target)
                            : isWhite(target)
                    )
                ) {

                    moves.push({
                        r:nr,
                        c:nc
                    });

                }

            }

        });

    }


    return moves;

}

function isSquareUnderAttack(b,r,c,attackerColor) {

    for(let row=0;row<8;row++) {

        for(let col=0;col<8;col++) {

            let p = b[row][col];

            if(!p) continue;

            let correctColor =
                attackerColor === 'w'
                    ? isWhite(p)
                    : isBlack(p);

            if(!correctColor) continue;

            if(p.toLowerCase() === 'p') {

                let dir =
                    attackerColor === 'w'
                        ? -1
                        : 1;

                if(
                    row + dir === r &&
                    (
                        col - 1 === c ||
                        col + 1 === c
                    )
                ) {

                    return true;

                }

                continue;

            }

            let moves =
                getRawMoves(
                    b,
                    row,
                    col
                );

            if(
                moves.some(function(m) {

                    return (
                        m.r === r &&
                        m.c === c
                    );

                })
            ) {

                return true;

            }

        }

    }

    return false;

}

function isInCheck(b,color) {

    let kPos =
        findKing(
            b,
            color
        );

    if(!kPos) return false;

    let attacker =
        color === 'w'
            ? 'b'
            : 'w';

    return isSquareUnderAttack(
        b,
        kPos.r,
        kPos.c,
        attacker
    );

}

function getValidMoves(r,c) {

    let p = board[r][c];

    if(!p) return [];

    let color =
        isWhite(p)
            ? 'w'
            : 'b';

    if(color !== turn) return [];

    let raw =
        getRawMoves(
            board,
            r,
            c
        );

    let legal = [];

    raw.forEach(function(m) {

        let tempBoard =
            board.map(function(row) {

                return [...row];

            });

        tempBoard[m.r][m.c] = p;

        tempBoard[r][c] = '';

        if(
            !isInCheck(
                tempBoard,
                color
            )
        ) {

            legal.push(m);

        }

    });

    return legal;

}

function getAllLegalMoves(b,color) {

    let all = [];

    for(let r=0;r<8;r++) {

        for(let c=0;c<8;c++) {

            let p = b[r][c];

            if(!p) continue;

            let correctColor =
                color === 'w'
                    ? isWhite(p)
                    : isBlack(p);

            if(!correctColor) continue;

            let raw =
                getRawMoves(
                    b,
                    r,
                    c
                );

            raw.forEach(function(m) {

                let tempBoard =
                    b.map(function(row) {

                        return [...row];

                    });

                tempBoard[m.r][m.c] = p;

                tempBoard[r][c] = '';

                if(
                    !isInCheck(
                        tempBoard,
                        color
                    )
                ) {

                    all.push({

                        fr:r,
                        fc:c,
                        tr:m.r,
                        tc:m.c

                    });

                }

            });

        }

    }

    return all;

}

function checkGameStatusAfterMove(currentTurnColor) {

    let opponent =
        currentTurnColor === 'w'
            ? 'b'
            : 'w';

    let legalMoves =
        getAllLegalMoves(
            board,
            opponent
        );

    if(legalMoves.length === 0) {

        if(
            isInCheck(
                board,
                opponent
            )
        ) {

            let winner =
                currentTurnColor === 'w'
                    ? true
                    : false;

            endGame(
                winner,
                "كش مات! تم محاصرة الملك بنجاح."
            );

        } else {

            endGame(
                null,
                "تعادل (جمود)."
            );

        }

        return true;

    }

    return false;

}

function makeMove(fr,fc,tr,tc) {

    let piece =
        board[fr][fc];

    if(
        piece === 'P' &&
        tr === 0
    ) {

        pendingPromotion = {
            fr:fr,
            fc:fc,
            tr:tr,
            tc:tc
        };

        promoModal.classList.remove(
            'hidden'
        );

        return;

    }

    executeMove(
        fr,
        fc,
        tr,
        tc,
        piece
    );

}


function executeMove(
    fr,
    fc,
    tr,
    tc,
    piece,
    promotedPiece = null
) {

    board[tr][tc] =
        promotedPiece || piece;

    board[fr][fc] = '';

    if(
        checkGameStatusAfterMove('w')
    ) {

        return;

    }

    turn = 'b';

    statusBar.textContent =
        "تفكير الذكاء الاصطناعي...";

    setTimeout(
        aiMove,
        500
    );

    draw();

}

const ENGINE_VALUES = {

    p:100,
    n:320,
    b:330,
    r:500,
    q:900,
    k:20000

};

const ENGINE_PST = {

p:[
0,5,5,0,0,5,5,0,
5,10,10,-10,-10,10,10,5,
5,5,10,20,20,10,5,5,
0,0,20,30,30,20,0,0,
5,5,10,25,25,10,5,5,
5,-5,-5,0,0,-5,-5,5,
5,10,10,-20,-20,10,10,5,
0,0,0,0,0,0,0,0
],

n:[
-50,-40,-30,-30,-30,-30,-40,-50,
-40,-20,0,5,5,0,-20,-40,
-30,5,10,15,15,10,5,-30,
-30,0,15,20,20,15,0,-30,
-30,5,15,20,20,15,5,-30,
-30,0,10,15,15,10,0,-30,
-40,-20,0,0,0,0,-20,-40,
-50,-40,-30,-30,-30,-30,-40,-50
],

b:[
-20,-10,-10,-10,-10,-10,-10,-20,
-10,5,0,0,0,0,5,-10,
-10,10,10,10,10,10,10,-10,
-10,0,10,10,10,10,0,-10,
-10,5,5,10,10,5,5,-10,
-10,0,5,0,0,5,0,-10,
-10,0,0,0,0,0,0,-10,
-20,-10,-10,-10,-10,-10,-10,-20
],

r:[
0,0,5,10,10,5,0,0,
-5,0,0,0,0,0,0,-5,
-5,0,0,0,0,0,0,-5,
-5,0,0,0,0,0,0,-5,
-5,0,0,0,0,0,0,-5,
-5,0,0,0,0,0,0,-5,
5,10,10,10,10,10,10,5,
0,0,5,5,5,5,0,0
],

q:[
-20,-10,-10,0,0,-10,-10,-20,
-10,0,5,5,5,5,0,-10,
-10,5,5,5,5,5,5,-10,
0,0,5,5,5,5,0,0,
-5,0,5,5,5,5,0,-5,
-10,0,5,5,5,5,0,-10,
-10,0,0,0,0,0,0,-10,
-20,-10,-10,0,0,-10,-10,-20
],

k:[
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-20,-30,-30,-40,-40,-30,-30,-20,
-10,-20,-20,-20,-20,-20,-20,-10,
20,20,0,0,0,0,20,20,
20,30,10,0,0,10,30,20
]

};

function engineBoardKey(b,color) {

    return (
        color +
        "|" +
        b.map(function(row) {

            return row.join('');

        }).join('/')
    );

}

function engineMakeMove(b,m) {

    const temp =
        b.map(function(row) {

            return [...row];

        });

    const piece =
        temp[m.fr][m.fc];

    temp[m.tr][m.tc] =
        piece;

    temp[m.fr][m.fc] =
        '';

    if(
        piece === 'P' &&
        m.tr === 0
    ) {

        temp[m.tr][m.tc] = 'Q';

    }

    if(
        piece === 'p' &&
        m.tr === 7
    ) {

        temp[m.tr][m.tc] = 'q';

    }

    return temp;

}

function evaluateBoard(b) {

    let score = 0;

    let whiteBishops = 0;
    let blackBishops = 0;

    let whitePawns = 0;
    let blackPawns = 0;

    for(let r=0;r<8;r++) {

        for(let c=0;c<8;c++) {

            const p = b[r][c];

            if(!p) continue;

            const type =
                p.toLowerCase();

            const value =
                ENGINE_VALUES[type] || 0;

            if(isWhite(p)) {

                score += value;

                if(ENGINE_PST[type]) {

                    score +=
                        ENGINE_PST[type][
                            r * 8 + c
                        ];

                }

                if(type === 'b')
                    whiteBishops++;

                if(type === 'p')
                    whitePawns++;

            } else {

                score -= value;

                if(ENGINE_PST[type]) {

                    const mirror =
                        (7-r) * 8 + c;

                    score -=
                        ENGINE_PST[type][
                            mirror
                        ];

                }

                if(type === 'b')
                    blackBishops++;

                if(type === 'p')
                    blackPawns++;

            }

        }

    }

    if(whiteBishops >= 2)
        score += 35;

    if(blackBishops >= 2)
        score -= 35;

    for(let c=0;c<8;c++) {

        let whiteCount = 0;
        let blackCount = 0;

        for(let r=0;r<8;r++) {

            if(b[r][c] === 'P')
                whiteCount++;

            if(b[r][c] === 'p')
                blackCount++;

        }

        if(whiteCount > 1) {

            score -=
                (whiteCount - 1) * 12;

        }

        if(blackCount > 1) {

            score +=
                (blackCount - 1) * 12;

        }

    }

    const whiteMoves =
        getAllLegalMoves(
            b,
            'w'
        ).length;

    const blackMoves =
        getAllLegalMoves(
            b,
            'b'
        ).length;

    score +=
        (whiteMoves - blackMoves) * 5;

    if(isInCheck(b,'w'))
        score -= 50;

    if(isInCheck(b,'b'))
        score += 50;

    if(whitePawns > blackPawns)
        score += 3;

    if(blackPawns > whitePawns)
        score -= 3;

    return score;

}

function engineMoveScore(b,m) {

    const attacker =
        b[m.fr][m.fc];

    const victim =
        b[m.tr][m.tc];

    let score = 0;

    if(victim) {

        score += 100000;

        score +=
            (
                ENGINE_VALUES[
                    victim.toLowerCase()
                ] || 0
            ) * 10;

        score -=
            (
                ENGINE_VALUES[
                    attacker.toLowerCase()
                ] || 0
            );

    }

    if(
        attacker === 'P' &&
        m.tr === 0
    ) {

        score += 90000;

    }

    if(
        attacker === 'p' &&
        m.tr === 7
    ) {

        score += 90000;

    }

    const temp =
        engineMakeMove(
            b,
            m
        );

    const enemy =
        isWhite(attacker)
            ? 'b'
            : 'w';

    if(
        isInCheck(
            temp,
            enemy
        )
    ) {

        score += 50000;

    }

    return score;

}

function engineOrderMoves(b,moves) {

    return moves

        .map(function(m) {

            return {

                move:m,

                score:
                    engineMoveScore(
                        b,
                        m
                    )

            };

        })

        .sort(function(a,b) {

            return b.score - a.score;

        })

        .map(function(x) {

            return x.move;

        });

}

const engineTT = new Map();

const engineMaxTT = 50000;

const engineKillers = {};

function engineQuiescence(
    b,
    alpha,
    beta,
    color,
    depth = 3
) {

    const standPat =
        evaluateBoard(b);

    if(color === 'w') {

        if(
            standPat >= beta
        ) {

            return beta;

        }

        alpha =
            Math.max(
                alpha,
                standPat
            );

    } else {

        if(
            standPat <= alpha
        ) {

            return alpha;

        }

        beta =
            Math.min(
                beta,
                standPat
            );

    }

    if(depth <= 0) {

        return standPat;

    }

    let moves =
        getAllLegalMoves(
            b,
            color
        );

    moves =
        moves.filter(function(m) {

            const attacker =
                b[m.fr][m.fc];

            const victim =
                b[m.tr][m.tc];

            return Boolean(victim) ||

                (
                    attacker === 'P' &&
                    m.tr === 0
                ) ||

                (
                    attacker === 'p' &&
                    m.tr === 7
                );

        });

    moves =
        engineOrderMoves(
            b,
            moves
        );

    if(color === 'w') {

        let best =
            standPat;

        for(const m of moves) {

            const temp =
                engineMakeMove(
                    b,
                    m
                );

            const value =
                engineQuiescence(
                    temp,
                    alpha,
                    beta,
                    'b',
                    depth - 1
                );

            best =
                Math.max(
                    best,
                    value
                );

            alpha =
                Math.max(
                    alpha,
                    value
                );

            if(
                alpha >= beta
            ) {

                break;

            }

        }

        return best;

    }

    let best =
        standPat;

    for(const m of moves) {

        const temp =
            engineMakeMove(
                b,
                m
            );

        const value =
            engineQuiescence(
                temp,
                alpha,
                beta,
                'w',
                depth - 1
            );

        best =
            Math.min(
                best,
                value
            );

        beta =
            Math.min(
                beta,
                value
            );

        if(
            alpha >= beta
        ) {

            break;

        }

    }

    return best;

}

function minimax(
    b,
    depth,
    alpha,
    beta,
    isMaximizing
) {

    const color =
        isMaximizing
            ? 'w'
            : 'b';

    const key =
        engineBoardKey(
            b,
            color
        ) +
        "|" +
        depth;

    const cached =
        engineTT.get(key);

    if(
        cached !== undefined
    ) {

        return cached;

    }

    const moves =
        getAllLegalMoves(
            b,
            color
        );

    if(moves.length === 0) {

        if(
            isInCheck(
                b,
                color
            )
        ) {

            const mate =
                isMaximizing
                    ? -10000000 - depth
                    : 10000000 + depth;

            if(
                engineTT.size <
                engineMaxTT
            ) {

                engineTT.set(
                    key,
                    mate
                );

            }

            return mate;

        }

        return 0;

    }

    if(depth <= 0) {

        const value =
            engineQuiescence(
                b,
                alpha,
                beta,
                color,
                3
            );

        if(
            engineTT.size <
            engineMaxTT
        ) {

            engineTT.set(
                key,
                value
            );

        }

        return value;

    }

    let ordered =
        engineOrderMoves(
            b,
            moves
        );

    if(
        engineKillers[depth]
    ) {

        const killers =
            engineKillers[depth];

        ordered.sort(
            function(a,z) {

                const aK =
                    killers.some(
                        function(k) {

                            return (
                                k.fr === a.fr &&
                                k.fc === a.fc &&
                                k.tr === a.tr &&
                                k.tc === a.tc
                            );

                        }
                    );

                const zK =
                    killers.some(
                        function(k) {

                            return (
                                k.fr === z.fr &&
                                k.fc === z.fc &&
                                k.tr === z.tr &&
                                k.tc === z.tc
                            );

                        }
                    );

                return (
                    Number(zK) -
                    Number(aK)
                );

            }
        );

    }

    if(isMaximizing) {

        let best =
            -Infinity;

        for(const m of ordered) {

            const temp =
                engineMakeMove(
                    b,
                    m
                );

            const value =
                minimax(
                    temp,
                    depth - 1,
                    alpha,
                    beta,
                    false
                );

            best =
                Math.max(
                    best,
                    value
                );

            alpha =
                Math.max(
                    alpha,
                    value
                );

            if(
                beta <= alpha
            ) {

                if(
                    !b[m.tr][m.tc]
                ) {

                    if(
                        !engineKillers[depth]
                    ) {

                        engineKillers[
                            depth
                        ] = [];

                    }

                    engineKillers[
                        depth
                    ].unshift(m);

                    engineKillers[
                        depth
                    ] =
                        engineKillers[
                            depth
                        ].slice(0,2);

                }

                break;

            }

        }

        if(
            engineTT.size <
            engineMaxTT
        ) {

            engineTT.set(
                key,
                best
            );

        }

        return best;

    }

    let best =
        Infinity;

    for(const m of ordered) {

        const temp =
            engineMakeMove(
                b,
                m
            );

        const value =
            minimax(
                temp,
                depth - 1,
                alpha,
                beta,
                true
            );

        best =
            Math.min(
                best,
                value
            );

        beta =
            Math.min(
                beta,
                value
            );

        if(
            beta <= alpha
        ) {

            if(
                !b[m.tr][m.tc]
            ) {

                if(
                    !engineKillers[depth]
                ) {

                    engineKillers[
                        depth
                    ] = [];

                }

                engineKillers[
                    depth
                ].unshift(m);

                engineKillers[
                    depth
                ] =
                    engineKillers[
                        depth
                    ].slice(0,2);

            }

            break;

        }

    }

    if(
        engineTT.size <
        engineMaxTT
    ) {

        engineTT.set(
            key,
            best
        );

    }

    return best;

}

function aiMove() {

    if(!gameActive)
        return;

    const allMoves =
        getAllLegalMoves(
            board,
            'b'
        );

    if(allMoves.length === 0) {

        if(
            isInCheck(
                board,
                'b'
            )
        ) {

            endGame(
                true,
                "كش مات! لقد انتصرت على بوت القائد."
            );

        } else {

            endGame(
                null,
                "تعادل."
            );

        }

        return;

    }

    const currentLvl =
        levels[lvlIndex].val;

    let chosen = null;

    if(currentLvl <= 800) {

        chosen =
            allMoves[
                Math.floor(
                    Math.random() *
                    allMoves.length
                )
            ];

    }

    else if(currentLvl <= 1200) {

        const ordered =
            engineOrderMoves(
                board,
                allMoves
            );

        const pool =
            ordered.slice(
                0,
                Math.min(
                    8,
                    ordered.length
                )
            );

        chosen =
            pool[
                Math.floor(
                    Math.random() *
                    pool.length
                )
            ];

    }

    else if(currentLvl === 1600) {

        engineTT.clear();

        let bestEval =
            Infinity;

        let bestMoves = [];

        const ordered =
            engineOrderMoves(
                board,
                allMoves
            );

        for(const m of ordered) {

            const temp =
                engineMakeMove(
                    board,
                    m
                );

            const value =
                minimax(
                    temp,
                    3,
                    -Infinity,
                    Infinity,
                    true
                );

            if(
                value < bestEval
            ) {

                bestEval = value;

                bestMoves = [m];

            }

            else if(
                value === bestEval
            ) {

                bestMoves.push(m);

            }

        }

        chosen =
            bestMoves[
                Math.floor(
                    Math.random() *
                    bestMoves.length
                )
            ];

    }

    else {

        engineTT.clear();

        let bestEval =
            Infinity;

        let bestMoves = [];

        const depth = 5;

        const ordered =
            engineOrderMoves(
                board,
                allMoves
            );

        for(const m of ordered) {

            const temp =
                engineMakeMove(
                    board,
                    m
                );

            const value =
                minimax(
                    temp,
                    depth - 1,
                    -Infinity,
                    Infinity,
                    true
                );

            if(
                value < bestEval
            ) {

                bestEval = value;

                bestMoves = [m];

            }

            else if(
                value === bestEval
            ) {

                bestMoves.push(m);

            }

        }

        chosen =
            bestMoves.length > 0

                ? bestMoves[
                    Math.floor(
                        Math.random() *
                        bestMoves.length
                    )
                ]

                : allMoves[0];

    }

    if(chosen) {

        let piece =
            board[
                chosen.fr
            ][
                chosen.fc
            ];

        board[
            chosen.tr
        ][
            chosen.tc
        ] =
            piece;

        board[
            chosen.fr
        ][
            chosen.fc
        ] =
            '';

        if(
            piece === 'p' &&
            chosen.tr === 7
        ) {

            board[
                chosen.tr
            ][
                chosen.tc
            ] =
                'q';

        }

    }

    if(
        checkGameStatusAfterMove('b')
    ) {

        return;

    }

    turn = 'w';

    statusBar.textContent =
        "دورك (الأبيض)";

    draw();

}

function endGame(won,msg) {

    gameActive = false;

    if(won === true) {

        endTitle.textContent =
            "أحسنت! فزت بالمباراة 🎉";

        overText.textContent =
            msg;

    }

    else if(won === false) {

        endTitle.textContent =
            "خسرت المعركة 💔";

        overText.textContent =
            msg;

    }

    else {

        endTitle.textContent =
            "انتهت اللعبة تعادل 🤝";

        overText.textContent =
            msg;

    }

    winMsg.classList.remove(
        'hidden'
    );

}

cv.addEventListener(
    'pointerdown',
    function(e) {

        if(
            !gameActive ||
            turn !== 'w'
        ) {

            return;

        }

        let rect =
            cv.getBoundingClientRect();

        let c =
            Math.floor(
                (
                    (
                        e.clientX -
                        rect.left
                    )
                    /
                    rect.width
                ) * 8
            );

        let r =
            Math.floor(
                (
                    (
                        e.clientY -
                        rect.top
                    )
                    /
                    rect.height
                ) * 8
            );

        if(selectedPiece) {

            let found =
                validMoves.find(
                    function(m) {

                        return (
                            m.r === r &&
                            m.c === c
                        );

                    }
                );

            if(found) {

                makeMove(
                    selectedPiece.r,
                    selectedPiece.c,
                    r,
                    c
                );

                selectedPiece = null;

                validMoves = [];

                draw();

                return;

            }

        }

        if(
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8 &&
            isWhite(
                board[r][c]
            )
        ) {

            selectedPiece = {
                r:r,
                c:c
            };

            validMoves =
                getValidMoves(
                    r,
                    c
                );

            draw();

        }

        else {

            selectedPiece = null;

            validMoves = [];

            draw();

        }

    }
);

function draw() {

    ctx.clearRect(
        0,
        0,
        360,
        360
    );

    let size = 45;

    const symbols = {

        P:'♙',
        R:'♖',
        N:'♘',
        B:'♗',
        Q:'♕',
        K:'♔',

        p:'♟',
        r:'♜',
        n:'♞',
        b:'♝',
        q:'♛',
        k:'♚'

    };

    for(let r=0;r<8;r++) {

        for(let c=0;c<8;c++) {

            let x =
                c * size;

            let y =
                r * size;

            ctx.fillStyle =
                (r+c)%2 === 0
                    ? '#b58863'
                    : '#f0d9b5';

            ctx.fillRect(
                x,
                y,
                size,
                size
            );

            if(
                selectedPiece &&
                selectedPiece.r === r &&
                selectedPiece.c === c
            ) {

                ctx.fillStyle =
                    'rgba(245,158,11,0.6)';

                ctx.fillRect(
                    x,
                    y,
                    size,
                    size
                );

            }

            let p =
                board[r][c];

            if(p) {

                ctx.font =
                    'bold 32px Arial';

                ctx.textAlign =
                    'center';

                ctx.textBaseline =
                    'middle';

                ctx.fillStyle =
                    isWhite(p)
                        ? '#ffffff'
                        : '#111827';

                ctx.fillText(
                    symbols[p],
                    x + size / 2,
                    y + size / 2 + 2
                );

            }

        }

    }

    validMoves.forEach(
        function(m) {

            ctx.fillStyle =
                'rgba(0,168,132,0.7)';

            ctx.beginPath();

            ctx.arc(
                m.c * size +
                    size / 2,

                m.r * size +
                    size / 2,

                8,

                0,

                Math.PI * 2
            );

            ctx.fill();

        }
    );

}

function toggleLevel(e) {

    if(e) {

        e.preventDefault();

        e.stopPropagation();

    }

    lvlIndex =
        (
            lvlIndex + 1
        )
        %
        levels.length;

    lvlBadge.textContent =
        levels[
            lvlIndex
        ].name;

}

document
.querySelectorAll('.promo-btn')
.forEach(function(btn) {

    btn.addEventListener(
        'pointerdown',
        function(e) {

            e.preventDefault();

            e.stopPropagation();

            let chosenType =
                this.getAttribute(
                    'data-piece'
                );

            if(pendingPromotion) {

                promoModal.classList.add(
                    'hidden'
                );

                let piece =
                    board[
                        pendingPromotion.fr
                    ][
                        pendingPromotion.fc
                    ];

                executeMove(
                    pendingPromotion.fr,
                    pendingPromotion.fc,
                    pendingPromotion.tr,
                    pendingPromotion.tc,
                    piece,
                    chosenType
                );

                pendingPromotion = null;

            }

        }
    );

});

startBtn.addEventListener(
    'pointerdown',
    resetGame
);

restartBtn.addEventListener(
    'pointerdown',
    resetGame
);

retryBtn.addEventListener(
    'pointerdown',
    resetGame
);

levelBtn.addEventListener(
    'pointerdown',
    toggleLevel
);

resetGame();

})();

</script>
</body>
</html>`;

let handler = async (m,{conn}) => {

    const aiRich =
        new AIRich();

    aiRich._sections.push(

        AIRich.newLayout(
            'Single',
            {

                __typename:
                    'GenAIaeacdsnwHtmlPrimitive',

                payload:
                    chessPayload,

                trusted_sources:
                    ["shanks.bot"]

            }
        )

    );

    const message =
        await aiRich.build(
            m.chat,
            {
                quoted:m
            }
        );

    return await conn.relayMessage(
        m.chat,
        message.message,
        {
            messageId:
                message.key.id
        }
    );

};

handler.command = [
    'chess',
    'شس',
    'شطرنج'
];

export default handler;