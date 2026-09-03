/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: لعبه ماريو سهله بس في مشكله بسيطه هي أن الاول الحواجز متصله بس بتعدي الحته دي و بتبقي شغاله عادي
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
        botResponseId: "mario-endless-shanks-final",
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
              messageText: "🍄 SUPER MARIO ENDLESS ARCADE — BY SHANKS"
            }
          ],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "__typename": "GenAIUnifiedResponse",
              "response_id": "mario-endless-shanks-id",
              "sections": [
                {
                  "__typename": "GenAIUnifiedResponseSection",
                  "view_model": {
                    "__typename": "GenAISingleLayoutViewModel",
                    "primitive": {
                      "__typename": "GenAIaeacdsnwHtmlPrimitive",
                      "payload": "<style>\n*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}\nhtml,body{width:100%}\nbody{background:linear-gradient(160deg,#141e30,#243b55);padding:8px;color:#fff;overflow-y:auto}\n#app{max-width:420px;margin:0 auto}\n.hdr{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 7px;gap:8px}\n.tt{font:900 17px 'Arial Black';color:#f8d800;text-shadow:0 2px #000;letter-spacing:1px}\n.tt small{display:block;font:700 6.5px Arial;letter-spacing:2px;color:#fff;text-shadow:none}\n.hrs{display:flex;gap:5px;align-items:center}\n.hr{background:rgba(0,0,0,.5);border:1px solid rgba(248,216,0,.5);border-radius:9px;padding:3px 6px;text-align:center;min-width:40px}\n.hr i{display:block;font:700 6.5px Arial;font-style:normal;letter-spacing:1px;color:#f8d800}\n.hr b{font:900 11px 'Arial Black';color:#fff}\n.gw{position:relative;border:3px solid #f8d800;border-radius:14px;overflow:hidden;background:#5c94fc;box-shadow:0 0 18px rgba(0,0,0,.4)}\ncanvas{width:100%;display:block;touch-action:none}\n.pads{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-top:8px}\n.pd{height:48px;border:2px solid rgba(255,255,255,.3);border-radius:12px;font:900 11px 'Arial Black';color:#fff;cursor:pointer;touch-action:none;box-shadow:0 3px 0 rgba(0,0,0,.4);background:linear-gradient(#e52521,#900);\n.pd:active{transform:translateY(2px);box-shadow:none}\n#jumpB{background:linear-gradient(#f8d800,#c89800);color:#000}\n#stopB{background:linear-gradient(#555,#222);color:#ffeb7b}\n.hint{text-align:center;font:600 9px Arial;color:#ffeb7b;margin-top:6px;text-shadow:0 1px #000}\n</style>\n<div id=\"app\">\n<div class=\"hdr\"><div class=\"tt\">MARIO ENDLESS<small>SHANKS ENGINE</small></div><div class=\"hrs\"><div class=\"hr\"><i>SCORE</i><b id=\"sc\">0</b></div><div class=\"hr\"><i>COINS</i><b id=\"cn\">0</b></div><div class=\"hr\"><i>MODE</i><b id=\"pt\">ENDLESS</b></div></div></div>\n<div class=\"gw\"><canvas id=\"cv\" width=\"404\" height=\"240\"></canvas></div>\n<div class=\"pads\">\n<button class=\"pd\" id=\"leftB\">◀ يسار</button>\n<button class=\"pd\" id=\"stopB\">⏹ وقوف</button>\n<button class=\"pd\" id=\"jumpB\">⬆ نطه</button>\n<button class=\"pd\" id=\"rightB\">▶ يمين</button>\n</div>\n<div class=\"hint\">🎮 Mario game! اجمع العملات وتفادى الوحوش والأنابيب.</div>\n</div>\n<script>\n(function(){\nvar cv=document.getElementById('cv'),ctx=cv.getContext('2d'),W=404,H=240;\nvar scEl=document.getElementById('sc'),cnEl=document.getElementById('cn');\nvar score=0,coins=0,state='ready',cameraX=0,animFrame=0;\nvar mario={x:50,y:172,w:22,h:28,vx:0,vy:0,grounded:false};\nvar obstacles=[],platforms=[],items=[],enemies=[];\nvar nextGenX=500;\n\nfunction reset(){\nscore=0;coins=0;mario.x=50;mario.y=172;mario.vx=0;mario.vy=0;mario.grounded=false;cameraX=0;animFrame=0;\nobstacles=[];platforms=[];items=[];enemies=[];\nnextGenX=500;\n\n// توليد بداية العالم\nfor(let i=1; i<=4; i++){\ngenerateChunk(i * 350);\n}\n\nscEl.textContent='0';cnEl.textContent='0';\n}\n\nfunction generateChunk(startX){\nlet obsX = startX + Math.random()*100;\nlet isTele = Math.random() > 0.7;\nobstacles.push({x: obsX, y: 170, w: 28, h: 30, teleport: isTele, targetX: obsX + 600});\n\nlet pfX = startX + Math.random()*50;\nlet pfY = 100 + Math.random()*30;\nlet pfW = 90 + Math.random()*30;\nplatforms.push({x: pfX, y: pfY, w: pfW, h: 14});\n\nitems.push({x: pfX + pfW/2 - 7, y: pfY - 25, w: 14, h: 14, taken: false});\n\nif(Math.random() > 0.4){\nlet enX = startX + 150;\nenemies.push({x: enX, y: 176, w: 22, h: 20, vx: 1.2, minX: startX, maxX: startX + 320, alive: true});\n}\n}\n\nfunction jump(){\nif(mario.grounded){\nmario.vy=-10.8;mario.grounded=false;\n}\nelse if(state==='ready'||state==='dead'){state='play';reset();}\n}\n\nfunction mv(d){mario.vx=d*3;}\nfunction stopMv(){mario.vx=0;}\n\ndocument.getElementById('leftB').addEventListener('pointerdown',function(e){e.preventDefault();mv(-1);});\ndocument.getElementById('rightB').addEventListener('pointerdown',function(e){e.preventDefault();mv(1);});\ndocument.getElementById('stopB').addEventListener('pointerdown',function(e){e.preventDefault();stopMv();});\ndocument.getElementById('jumpB').addEventListener('pointerdown',function(e){e.preventDefault();jump();});\n\ndocument.addEventListener('keydown',function(e){if(e.code==='ArrowLeft')mv(-1);if(e.code==='ArrowRight')mv(1);if(e.code==='ArrowDown')stopMv();if(e.code==='Space')jump();});\n\nfunction update(){\nif(state!=='play')return;\nscore++;scEl.textContent=score;\nmario.vy+=0.48;\nmario.x+=mario.vx;\n\n// توليد أجزاء جديدة تلقائياً كل ما ماريو تقدم للأمام\nif(mario.x + 600 > nextGenX){\ngenerateChunk(nextGenX);\nnextGenX += 350;\n}\n\n// اصطدام الأنابيب أفقياً\nobstacles.forEach(function(obs){\nif(mario.y+mario.h>obs.y && mario.y<obs.y+obs.h){\nif(mario.vx>0 && mario.x+mario.w>=obs.x && mario.x<obs.x){\nmario.x=obs.x-mario.w;\n}\nelse if(mario.vx<0 && mario.x<=obs.x+obs.w && mario.x+mario.w>obs.x+obs.w){\nmario.x=obs.x+obs.w;\n}\n}\n});\n\nmario.y+=mario.vy;\nif(mario.vx!==0 && mario.grounded){animFrame+=0.25;}else{animFrame=0;}\n\nlet onGround=false;\nif(mario.y>=172){mario.y=172;mario.vy=0;onGround=true;}\n\n// المنصات\nplatforms.forEach(function(pf){\nif(mario.x+mario.w>pf.x && mario.x<pf.x+pf.w){\nif(mario.y+mario.h>=pf.y && mario.y+mario.h<=pf.y+12 && mario.vy>=0){\nmario.y=pf.y-mario.h;\nmario.vy=0;\nonGround=true;\n}\nelse if(mario.y<=pf.y+pf.h && mario.y+mario.h>pf.y+pf.h && mario.vy<0){\nmario.y=pf.y+pf.h;\nmario.vy=0;\n}\n}\n});\n\n// الوقوف فوق الأنابيب\nobstacles.forEach(function(obs){\nif(mario.x+mario.w>obs.x && mario.x<obs.x+obs.w && mario.y+mario.h>=obs.y && mario.y+mario.h<=obs.y+8 && mario.vy>=0){\nmario.y=obs.y-mario.h;\nmario.vy=0;\nonGround=true;\n}\n});\n\nmario.grounded=onGround;\nif(mario.x<10)mario.x=10;\n\n// تتبع الكاميرا بسلاسة وراء ماريو\ncameraX = mario.x - W/2;\nif(cameraX < 0) cameraX = 0;\n\n// العملات\nitems.forEach(function(it){\nif(!it.taken && mario.x+mario.w>it.x && mario.x<it.x+it.w && mario.y+mario.h>it.y && mario.y<it.y+it.h){\nit.taken=true;coins++;cnEl.textContent=coins;score+=100;\n}});\n\n// الوحوش\nenemies.forEach(function(en){\nif(!en.alive)return;\nen.x+=en.vx;\nif(en.x<=en.minX || en.x>=en.maxX)en.vx*=-1;\n\nif(mario.x+mario.w>en.x && mario.x<en.x+en.w && mario.y+mario.h>en.y && mario.y<en.y+en.h){\nif(mario.vy>0 && mario.y+mario.h-mario.vy<=en.y+10){\nen.alive=false;mario.vy=-7;score+=250;\n}else{\nstate='dead';\n}\n}\n});\n}\n\nfunction draw(){\nctx.fillStyle='#5c94fc';ctx.fillRect(0,0,W,H);\nctx.save();\nctx.translate(-Math.round(cameraX),0);\n\n// أرضية لا نهائية مبنية بناءً على مكان الكاميرا\nlet groundDrawX = Math.floor(cameraX / 500) * 500;\nctx.fillStyle='#c84c0c';ctx.fillRect(groundDrawX, 200, W + 600, 40);\nctx.fillStyle='#00a800';ctx.fillRect(groundDrawX, 200, W + 600, 8);\n\nplatforms.forEach(function(pf){\nif(pf.x + pf.w > cameraX && pf.x < cameraX + W + 100){\nctx.fillStyle='#b85d18';ctx.fillRect(pf.x,pf.y,pf.w,pf.h);\nctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(pf.x,pf.y,pf.w,pf.h);\nctx.fillStyle='#e07a30';ctx.fillRect(pf.x+4,pf.y+3,pf.w-8,3);\n}\n});\n\nobstacles.forEach(function(obs){\nif(obs.x + obs.w > cameraX && obs.x < cameraX + W + 100){\nctx.fillStyle='#008000';ctx.fillRect(obs.x,obs.y,obs.w,obs.h);ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(obs.x,obs.y,obs.w,obs.h);\nctx.fillStyle='#00a800';ctx.fillRect(obs.x-2,obs.y,obs.w+4,8);ctx.strokeRect(obs.x-2,obs.y,obs.w+4,8);\n}\n});\n\nitems.forEach(function(it){\nif(!it.taken && it.x + it.w > cameraX && it.x < cameraX + W + 100){\nctx.fillStyle='#f8d800';ctx.beginPath();ctx.arc(it.x+7,it.y+7,6,0,7);ctx.fill();ctx.strokeStyle='#b8860b';ctx.lineWidth=1.5;ctx.stroke();\n}\n});\n\nenemies.forEach(function(en){\nif(en.alive && en.x + en.w > cameraX && en.x < cameraX + W + 100){\nctx.fillStyle='#006400';ctx.beginPath();ctx.arc(en.x+11,en.y+11,10,Math.PI,0,false);ctx.fill();\nctx.fillRect(en.x+2,en.y+10,18,10);\nctx.fillStyle='#ff0000';ctx.fillRect(en.x+4,en.y+8,4,4);ctx.fillRect(en.x+14,en.y+8,4,4);\nctx.fillStyle='#000';ctx.fillRect(en.x+5,en.y+9,2,2);ctx.fillRect(en.x+15,en.y+9,2,2);\nctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.strokeRect(en.x+2,en.y+10,18,10);\n}\n});\n\nlet mx=mario.x, my=mario.y;\nctx.fillStyle='#e52521'; ctx.fillRect(mx+2,my,16,7); ctx.fillRect(mx+8,my-3,11,4);\nctx.fillStyle='#ffccaa'; ctx.fillRect(mx+4,my+7,14,8);\nctx.fillStyle='#000'; ctx.fillRect(mx+11,my+9,3,3); ctx.fillRect(mx+10,my+12,8,3);\nctx.fillStyle='#e52521'; ctx.fillRect(mx+3,my+15,16,10);\nctx.fillStyle='#0000cd'; ctx.fillRect(mx+5,my+18,12,8);\nctx.fillStyle='#f8d800'; ctx.fillRect(mx+6,my+19,2,2); ctx.fillRect(mx+14,my+19,2,2);\n\nctx.fillStyle='#8B4513';\nif(!mario.grounded){\nctx.fillRect(mx+2,my+25,6,3); ctx.fillRect(mx+14,my+25,6,3);\n} else if(mario.vx!==0) {\nlet legOffset = Math.sin(animFrame)*3;\nctx.fillRect(mx+2,my+25+legOffset,6,3); \nctx.fillRect(mx+14,my+25-legOffset,6,3);\n} else {\nctx.fillRect(mx+2,my+25,6,3); ctx.fillRect(mx+13,my+25,6,3);\n}\n\nctx.restore();\n\nif(state==='ready'){\nctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,W,H);\nctx.fillStyle='#fff';ctx.font='bold 16px Arial';ctx.textAlign='center';ctx.fillText('SUPER MARIO - SHANKS',W/2,H/2-10);\nctx.font='11px Arial';ctx.fillText('اضغط للبدء والركض بلا حدود',W/2,H/2+15);ctx.textAlign='left';\n}\nif(state==='dead'){\nctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(0,0,W,H);\nctx.fillStyle='#e52521';ctx.font='bold 22px Arial';ctx.textAlign='center';ctx.fillText('GAME OVER',W/2,H/2-10);\nctx.fillStyle='#fff';ctx.font='12px Arial';ctx.fillText('اضغط للعب مجدداً',W/2,H/2+15);ctx.textAlign='left';\n}\n}\nfunction loop(){update();draw();requestAnimationFrame(loop);}\nrequestAnimationFrame(loop);\ndocument.addEventListener('pointerdown',function(){if(state==='ready'||state==='dead'){state='play';reset();}});\n})();\n</script>",
                      "trusted_sources": []
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

  let msg = generateWAMessageFromContent(m.chat, messageContent, { userJid: conn.user.id })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['mario', 'ماريو']
export default handler