/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbC5LLx6GcGDXZUmHP0y
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://github.com/SHANKS-CODE-1/CODE
الوظيفه: SHANKS DRIVE: Rhythm Racer
لعبة سباق ايقاعات سريعة. اتحرك بين الحارات، اضرب بالـ BLASTER و فعل HYPER NITRO عشان تجيب اعلى سكور!
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
        this._title = "SHANKS DRIVE VIEW";
        this._footer = "";
        this._responseId = "4db57b2c-8393-484d-8b9a-8e6d1a14b349";
        this._botResponseId = "b2e40280-433c-45d8-9c1a-270bec558860";
        this._sections = [];
        this._submessages = [{ messageType: 2, messageText: "SHANKS CODE VIEW" }];
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
        { bypassDownload = true, forwarded = true, notification = false, includesUnifiedResponse = true, includesSubmessages = true, quoted, quotedParticipant, messageId, ...options } = {}
    ) {
        const forward = forwarded
            ? {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
                    forwardOrigin: 4,
                }
            : {};

        const notif = notification
            ? {
                    sessionTransparencyMetadata: {
                        disclaimerText: '~ Ahmad tumbuh kembang',
                        hcaId: `hca_${Date.now()}`,
                        sessionTransparencyType: 1,
                    },
                }
            : {};

        const qObj = quoted
            ? {
                    stanzaId: quoted?.key?.id || quoted?.id,
                    participant: quotedParticipant || quoted?.key?.participant || quoted?.participant || quoted?.key?.remoteJid,
                    quotedType: 0,
                    quotedMessage: typeof quoted === 'object' && quoted !== null ? (quoted.message ?? quoted) : undefined,
                }
            : {};

        const sections = this._footer
            ? [
                    ...(await waitAllPromises(this._sections)),
                    AIRich.newLayout('Single', {
                        text: this._footer,
                        __typename: 'GenAIMetadataTextPrimitive',
                    }),
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
                        verificationMetadata: AIRich.generateVerificationMetadata(),
                        botResponseId: this._botResponseId,
                    },
                },
                ...this._extraPayload,
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: includesSubmessages ? await waitAllPromises(this._submessages) : [],
                            unifiedResponse: {
                                data: includesUnifiedResponse ? Buffer.from(Toolkit.stringifyEscaped({ response_id: this._responseId, sections })).toString('base64') : '',
                            },
                            contextInfo: {
                                ...forward,
                                ...qObj,
                                ...this._contextInfo,
                            },
                        },
                    },
                },
            },
            { messageId: messageId || generateMessageIDV2(), ...options }
        );
    }
}

const htmlPayload = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none}html,body{width:100%;background:#05030a;color:#d8e0ff;padding:8px;overflow-y:auto}#app{max-width:420px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 7px;gap:8px}.tt{font:900 18px 'Arial Black';color:#00f0ff;text-shadow:0 0 10px #00f0ff88,0 2px #000;letter-spacing:1.5px}.tt small{display:block;font:700 6.5px Arial;letter-spacing:2px;color:#ff00a0;text-shadow:none}.hrs{display:flex;gap:6px;align-items:center}.hr{background:rgba(0,0,0,.6);border:1px solid rgba(0,240,255,.35);border-radius:9px;padding:3px 9px;text-align:center;min-width:54px}.hr i{display:block;font:700 7px Arial;font-style:normal;letter-spacing:1px;color:#8a92a6}.hr b{font:900 13px 'Arial Black';color:#eef1f8;font-variant-numeric:tabular-nums}.mbtn{width:34px;height:34px;border:2px solid rgba(0,240,255,.35);border-radius:9px;background:rgba(0,0,0,.6);color:#eef1f8;font-size:15px;cursor:pointer}.mbtn:active{filter:brightness(1.6)}.gw{position:relative;border:2px solid rgba(0,240,255,.4);border-radius:14px;overflow:hidden;background:#030208;box-shadow:0 0 20px rgba(0,240,255,.2)}canvas{width:100%;display:block;touch-action:none}.pads{display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:8px;margin-top:8px}.pd{height:52px;border:2px solid rgba(255,255,255,.16);border-radius:14px;font:900 13px 'Arial Black';color:#fff;cursor:pointer;touch-action:none;box-shadow:0 4px 0 rgba(0,0,0,.6);background:linear-gradient(#1a2638,#0d1522 60%,#060a12)}.pd:active{transform:translateY(3px);box-shadow:none;filter:brightness(1.5)}#atkB{background:linear-gradient(#0088cc,#004488 60%,#002244);color:#e0f7ff;text-shadow:0 1px #000;border-color:rgba(0,240,255,.6)}.ub{margin-top:8px;width:100%;height:40px;border:2px solid rgba(255,0,160,.5);border-radius:12px;font:900 13px 'Arial Black';color:#6a0040;background:#0c0312;cursor:pointer;touch-action:none;letter-spacing:2px}.ub.rdy{color:#fff;background:linear-gradient(90deg,#ff00a0,#ff55c8);box-shadow:0 0 16px #ff00a0aa;animation:up 1s infinite}.ub:active{transform:translateY(2px)}@keyframes up{50%{filter:brightness(1.4)}}.hint{text-align:center;font:600 9px Arial;color:#8a92a6;margin-top:6px}</style></head><body><div id="app"><div class="hdr"><div class="tt">SHANKS DRIVE<small>BY SHANKS</small></div><div class="hrs"><div class="hr"><i>SCORE</i><b id="sc">0</b></div><div class="hr"><i>BEST</i><b id="bs">0</b></div><button class="mbtn" id="muteB">🔊</button></div></div><div class="gw"><canvas id="cv" width="404" height="380"></canvas></div><div class="pads"><button class="pd" id="leftB">◀</button><button class="pd" id="atkB">💥 BLASTER</button><button class="pd" id="rightB">▶</button></div><button class="ub" id="ultB">⚡ HYPER NITRO — 0%</button><div class="hint">💥 إطلاق الليزر · حقوق التطوير لـ SHANKS</div></div><script>(function(){var cv=document.getElementById('cv'),x=cv.getContext('2d'),W=404,H=380,DPR=2;cv.width=W*DPR;cv.height=H*DPR;var scEl=document.getElementById('sc'),bsEl=document.getElementById('bs'),ub=document.getElementById('ultB');var BEST=0;try{BEST=parseInt(localStorage.getItem('shanks_drive_best')||'0',10)||0;}catch(e){}bsEl.textContent=BEST;var horizonY=80,playerY=330,MAXZ=750,laneW=66,EDGE=1.65;function psc(z){return 1-(z/MAXZ)*.65}function py(z){return playerY-(z/MAXZ)*(playerY-horizonY)}function pX(l,z){return W/2+l*laneW*psc(z)}var AC=null,MUTED=false;try{MUTED=localStorage.getItem('shanks_drive_mute')==='1'}catch(e){}function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC}function tone(f,d,t,v,at,sl){var a=AC;if(!a||MUTED)return;try{var n=a.currentTime+(at||0),o=a.createOscillator(),g=a.createGain();o.type=t||'square';o.frequency.setValueAtTime(f,n);if(sl)o.frequency.exponentialRampToValueAtTime(sl,n+d);g.gain.setValueAtTime(v||.1,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.03);}catch(e){}}function noiz(d,v,at,fc){var a=AC;if(!a||MUTED)return;try{var n=a.currentTime+(at||0),len=Math.floor(a.sampleRate*d),b=a.createBuffer(1,len,a.sampleRate),c=b.getChannelData(0);for(var i=0;i<len;i++)c[i]=Math.random()*2-1;var s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();s.buffer=b;f.type='lowpass';f.frequency.value=fc||1200;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);s.connect(f);f.connect(g);g.connect(a.destination);s.start(n);s.stop(n+d+.03);}catch(e){}}function sLaser(){tone(900,.08,'sawtooth',.12,0,180);noiz(.05,.08,0,3000);}function sHit(){noiz(.1,.22,0,1000);tone(120,.08,'sine',.25,0,40);}function sParry(){tone(1800,.08,'square',.15,0,1200);tone(900,.15,'sine',.12);noiz(.06,.1,0,4000);}function sNitro(){tone(200,.6,'sawtooth',.15,0,1800);noiz(.6,.2,0,2500);}function sExplode(){noiz(.25,.3,0,800);tone(80,.2,'sine',.3,0,30);}function sHurt(){tone(220,.25,'sawtooth',.18,0,60);noiz(.2,.15,.02,600);}function sHeal(){tone(523,.08,'sine',.08);tone(659,.1,'sine',.08,.06);}var state='ready',frame=0,score=0,best=BEST,hp=100,iframe=0,camZ=0,scroll=5.5,shake=0,flashR=0,wflash=0,hitstop=0;var lane=0,px=0,pv=0,playerX=W/2,shots=[],ents=[],props=[],parts=[],pops=[],rings=[],projs=[],ghosts=[];var nitro=0,nitroT=0,nitroPing=false,combo=0,comboT=0,overT=0,bestNew=false;var obsAt=300,droneAt=450,tankAt=1800,propAt=100;function reset(){score=0;hp=100;iframe=0;camZ=0;scroll=5.5;shake=0;flashR=0;wflash=0;hitstop=0;lane=0;px=0;pv=0;playerX=W/2;nitro=0;nitroT=0;nitroPing=false;combo=0;comboT=0;shots=[];ents=[];props=[];parts=[];pops=[];rings=[];projs=[];ghosts=[];bestNew=false;obsAt=camZ+300;droneAt=camZ+450;tankAt=camZ+1800;propAt=camZ+100;scEl.textContent='0';ub.classList.remove('rdy');ub.textContent='⚡ HYPER NITRO — 0%';}function mv(d){ac();if(state!=='play')return;var nl=Math.max(-1,Math.min(1,lane+d));if(nl!==lane){lane=nl;tone(350,.04,'square',.05);ghosts.push({x:playerX,y:playerY,t:1});}}function shoot(){ac();if(state!=='play')return;shots.push({lane:lane,z:20,vz:scroll+18});sLaser();for(var i=0;i<3;i++){parts.push({x:playerX+(i===0?-12:12),y:playerY-10,vx:(Math.random()-.5)*2,vy:-3,life:.2,c:'#00f0ff',s:2.5});}}function tryNitro(){ac();if(state!=='play')return;if(nitro>=100&&nitroT===0){nitroT=300;nitro=0;ub.classList.remove('rdy');ub.textContent='⚡ HYPER NITRO — 0%';sNitro();shake=12;}}document.getElementById('leftB').addEventListener('pointerdown',function(e){e.preventDefault();mv(-1);});document.getElementById('rightB').addEventListener('pointerdown',function(e){e.preventDefault();mv(1);});document.getElementById('atkB').addEventListener('pointerdown',function(e){e.preventDefault();shoot();});ub.addEventListener('pointerdown',function(e){e.preventDefault();tryNitro();});var mb=document.getElementById('muteB');mb.addEventListener('pointerdown',function(e){e.preventDefault();MUTED=!MUTED;mb.textContent=MUTED?'🔇':'🔊';try{localStorage.setItem('shanks_drive_mute',MUTED?'1':'0');}catch(e2){}});function burst(wx,wy,n,cols){for(var i=0;i<n;i++){parts.push({x:wx,y:wy,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:.8,c:cols[i%cols.length],s:2+Math.random()*3});}}function popup(sx,y,txt,c){pops.push({sx:sx,y:y,t:1,txt:txt,c:c});if(pops.length>6)pops.shift();}function dmg(n){if(iframe>0||nitroT>0||state!=='play')return;hp=Math.max(0,hp-n);iframe=70;shake=10;flashR=.6;combo=0;sHurt();popup(playerX,playerY-50,'-'+n,'#ff3050');burst(playerX,playerY-10,12,['#ff3050','#ff00a0']);if(hp<=0){state='dead';overT=performance.now();sExplode();if(score>best){best=score;bsEl.textContent=best;try{localStorage.setItem('shanks_drive_best',best);}catch(e){}bestNew=true;}}}function addNitro(v){nitro=Math.min(100,nitro+v);if(nitro>=100&&!nitroPing){nitroPing=true;tone(1200,.15,'sine',.15);ub.classList.add('rdy');}ub.textContent='⚡ HYPER NITRO — '+Math.floor(nitro)+'%';}function spawn(){if(camZ>obsAt){var r=Math.random(),l=Math.floor(Math.random()*3)-1;if(r<.4)ents.push({t:'barrier',z:MAXZ,lane:l,hp:1});else if(r<.7)ents.push({t:'spike',z:MAXZ,lane:l,hp:1});else ents.push({t:'mine',z:MAXZ,lane:l,hp:1});obsAt=camZ+260+Math.random()*240;}if(camZ>droneAt){ents.push({t:'drone',z:MAXZ,lane:Math.floor(Math.random()*3)-1,hp:1,shootT:0});droneAt=camZ+320+Math.random()*300;}if(camZ>tankAt){ents.push({t:'tank',z:MAXZ,lane:Math.floor(Math.random()*3)-1,hp:3});tankAt=camZ+1600+Math.random()*800;}if(camZ>propAt){props.push({z:MAXZ,side:Math.random()<.5?-1:1,kind:Math.random()<.5?'tower':'light'});propAt=camZ+140+Math.random()*120;}}function update(){frame++;if(hitstop>0){hitstop--;return;}shake=Math.max(0,shake-.5);flashR=Math.max(0,flashR-.03);wflash=Math.max(0,wflash-.04);if(iframe>0)iframe--;if(nitroT>0){nitroT--;if(frame%2===0){parts.push({x:playerX+(Math.random()-.5)*20,y:playerY+10,vx:(Math.random()-.5)*3,vy:3+Math.random()*4,life:.4,c:Math.random()<.5?'#ff00a0':'#00f0ff',s:3});}}var curScroll=scroll+(nitroT>0?4.5:0);camZ+=curScroll;score+=Math.round(curScroll*.12);if(frame%6===0)scEl.textContent=score;var tgt=lane*laneW;pv+=(tgt-px)*.55;pv*=.42;px+=pv;playerX=W/2+px;for(var i=ghosts.length-1;i>=0;i--){if((ghosts[i].t-=.1)<=0)ghosts.splice(i,1);}for(i=parts.length-1;i>=0;i--){var q=parts[i];q.x+=q.vx;q.y+=q.vy;if((q.life-=.04)<=0)parts.splice(i,1);}for(i=pops.length-1;i>=0;i--){if((pops[i].t-=.04)<=0)pops.splice(i,1);}if(state!=='play')return;spawn();for(i=shots.length-1;i>=0;i--){var s=shots[i];s.z+=s.vz;var hit=false;for(var j=ents.length-1;j>=0;j--){var e=ents[j];if(e.lane===s.lane&&Math.abs(e.z-s.z)<35){e.hp--;hit=true;if(e.hp<=0){e.rm=true;sExplode();var gain=e.t==='tank'?200:100;score+=gain;popup(pX(e.lane,e.z),py(e.z)-20,'+'+gain,'#00f0ff');burst(pX(e.lane,e.z),py(e.z),14,['#00f0ff','#ff00a0','#fff']);addNitro(e.t==='tank'?25:12);if(hp<100){hp=Math.min(100,hp+4);sHeal();}}else{sHit();burst(pX(e.lane,e.z),py(e.z),6,['#fff','#00f0ff']);}break;}}for(var k=projs.length-1;k>=0;k--){var pr=projs[k];if(pr.lane===s.lane&&Math.abs(pr.z-s.z)<40){pr.rm=true;hit=true;sParry();wflash=.4;popup(pX(pr.lane,pr.z),py(pr.z)-20,'PARRY!','#ffe600');burst(pX(pr.lane,pr.z),py(pr.z),10,['#ffe600','#fff']);addNitro(20);}}if(hit||s.z>MAXZ)shots.splice(i,1);}for(i=projs.length-1;i>=0;i--){var pr2=projs[i];pr2.z-=curScroll+8;if(pr2.z<15){if(pr2.lane===Math.round(px/laneW)&&nitroT===0)dmg(15);projs.splice(i,1);}}for(i=ents.length-1;i>=0;i--){var e2=ents[i];e2.z-=curScroll;if(e2.t==='drone'&&e2.z>200&&e2.z<600){e2.shootT++;if(e2.shootT===40){projs.push({lane:e2.lane,z:e2.z-20});sLaser();}}if(e2.z<15&&e2.z>-20){if(e2.lane===Math.round(px/laneW)){if(nitroT>0){e2.rm=true;score+=80;sExplode();burst(pX(e2.lane,0),py(0),12,['#ff00a0','#00f0ff']);}else if(!e2.hit){e2.hit=true;dmg(e2.t==='tank'?30:18);}}}if(e2.z<-50||e2.rm)ents.splice(i,1);}props.forEach(function(p){p.z-=curScroll});props=props.filter(function(p){return p.z>-50});}function drawGrid(){var sc0=psc(-100),sc1=psc(MAXZ),y0=py(-100),y1=py(MAXZ);x.fillStyle='#090614';x.beginPath();x.moveTo(W/2-EDGE*laneW*sc0,y0);x.lineTo(W/2+EDGE*laneW*sc0,y0);x.lineTo(W/2+EDGE*laneW*sc1,y1);x.lineTo(W/2-EDGE*laneW*sc1,y1);x.fill();[-EDGE,EDGE].forEach(function(o){x.strokeStyle='#ff00a0';x.lineWidth=3;x.beginPath();x.moveTo(W/2+o*laneW*sc0,y0);x.lineTo(W/2+o*laneW*sc1,y1);x.stroke();});x.strokeStyle='rgba(0,240,255,0.4)';x.lineWidth=1.5;for(var k=0;k<12;k++){var z=k*65-(camZ%65);if(z<0||z>MAXZ)continue;var sy=py(z),w=EDGE*laneW*psc(z);x.beginPath();x.moveTo(W/2-w,sy);x.lineTo(W/2+w,sy);x.stroke();}[-.5,.5].forEach(function(o){x.strokeStyle='rgba(0,240,255,0.2)';x.beginPath();x.moveTo(W/2+o*laneW*sc0,y0);x.lineTo(W/2+o*laneW*sc1,y1);x.stroke();});}function drawPlayer(){if(state==='dead')return;if(iframe>0&&Math.floor(frame/3)%2===0)return;ghosts.forEach(function(g){x.globalAlpha=g.t*.3;x.fillStyle='#00f0ff';x.fillRect(g.x-14,g.y-8,28,14);x.globalAlpha=1;});var pyy=playerY+Math.sin(frame*.15)*2.5;x.fillStyle='rgba(0,0,0,0.5)';x.beginPath();x.ellipse(playerX,playerY+12,16,5,0,0,7);x.fill();x.save();x.translate(playerX,pyy);var lean=pv*.012;x.rotate(lean);var fg=x.createLinearGradient(0,10,0,25);fg.addColorStop(0,nitroT>0?'#ff00a0':'#00f0ff');fg.addColorStop(1,'transparent');x.fillStyle=fg;x.fillRect(-6,10,12,12+Math.random()*8);x.fillStyle='#0e1726';x.strokeStyle=nitroT>0?'#ff00a0':'#00f0ff';x.lineWidth=2;x.beginPath();x.moveTo(0,-18);x.lineTo(-14,6);x.lineTo(-8,12);x.lineTo(8,12);x.lineTo(14,6);x.closePath();x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.ellipse(0,-4,4,7,0,0,7);x.fill();x.fillStyle='#00f0ff';x.fillRect(-15,-8,3,10);x.fillRect(12,-8,3,10);x.restore();}function drawEnt(e){var z=e.z,sc=psc(z),sy=py(z),sx=pX(e.lane,z);if(sy<horizonY-10||sy>H+30)return;x.save();x.translate(sx,sy);x.scale(sc,sc);if(e.t==='barrier'){x.fillStyle='rgba(255,0,160,0.2)';x.strokeStyle='#ff00a0';x.lineWidth=2;x.fillRect(-22,-24,44,24);x.strokeRect(-22,-24,44,24);}else if(e.t==='spike'){x.fillStyle='#ffe600';x.beginPath();x.moveTo(-18,0);x.lineTo(0,-22);x.lineTo(18,0);x.closePath();x.fill();}else if(e.t==='mine'){x.fillStyle='#ff3050';x.beginPath();x.arc(0,-10,12,0,7);x.fill();}else if(e.t==='drone'){x.fillStyle='#121826';x.strokeStyle='#00f0ff';x.lineWidth=2;x.beginPath();x.moveTo(-20,-10);x.lineTo(0,-22);x.lineTo(20,-10);x.lineTo(0,0);x.closePath();x.fill();x.stroke();x.fillStyle='#ff3050';x.beginPath();x.arc(0,-11,4,0,7);x.fill();}else if(e.t==='tank'){x.fillStyle='#1c0826';x.strokeStyle='#ff00a0';x.lineWidth=2.5;x.fillRect(-26,-28,52,28);x.strokeRect(-26,-28,52,28);x.fillStyle='#ff00a0';x.fillRect(-10,-34,20,8);}x.restore();}function drawProp(p){var sc=psc(p.z),sy=py(p.z),bx=W/2+p.side*(EDGE+.3)*laneW*sc;if(sy<horizonY)return;x.fillStyle='#090d18';x.strokeStyle='rgba(0,240,255,0.3)';x.lineWidth=1;if(p.kind==='tower'){x.fillRect(bx-8*sc,sy-60*sc,16*sc,60*sc);x.strokeRect(bx-8*sc,sy-60*sc,16*sc,60*sc);}else{x.fillRect(bx-3*sc,sy-40*sc,6*sc,40*sc);x.fillStyle='#ff00a0';x.beginPath();x.arc(bx,sy-40*sc,4*sc,0,7);x.fill();}}function draw(){x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle='#040208';x.fillRect(0,0,W,H);var sg=x.createLinearGradient(0,20,0,90);sg.addColorStop(0,'#ff00a0');sg.addColorStop(1,'#ffe600');x.fillStyle=sg;x.beginPath();x.arc(W/2,75,35,0,7);x.fill();x.fillStyle='#040208';for(var i=0;i<5;i++){x.fillRect(W/2-40,62+i*5,80,1.8+i*.4);}x.fillStyle='rgba(0,240,255,0.15)';x.fillRect(0,horizonY-2,W,4);x.save();if(shake>0){x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);}drawGrid();props.forEach(drawProp);shots.forEach(function(s){var sc=psc(s.z),sy=py(s.z),sx=pX(s.lane,s.z);x.fillStyle='#00f0ff';x.fillRect(sx-2*sc,sy-10*sc,4*sc,10*sc);});projs.forEach(function(pr){var sc=psc(pr.z),sy=py(pr.z),sx=pX(pr.lane,pr.z);x.fillStyle='#ff3050';x.beginPath();x.arc(sx,sy,5*sc,0,7);x.fill();});ents.slice().sort(function(a,b){return b.z-a.z}).forEach(drawEnt);drawPlayer();parts.forEach(function(p){x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s);});pops.forEach(function(p){x.font='900 12px Arial';x.fillStyle=p.c;x.textAlign='center';x.fillText(p.txt,p.sx,p.y-(1-p.t)*15);});x.restore();if(nitroT>0){x.strokeStyle='rgba(255,0,160,0.3)';x.lineWidth=2;for(i=0;i<8;i++){var rx=Math.random()*W;x.beginPath();x.moveTo(rx,0);x.lineTo(rx+(rx-W/2)*.3,H);x.stroke();}}if(flashR>0){x.fillStyle='rgba(255,40,80,'+(flashR*.3)+')';x.fillRect(0,0,W,H);}if(wflash>0){x.fillStyle='rgba(255,255,255,'+(wflash*.3)+')';x.fillRect(0,0,W,H);}x.fillStyle='rgba(0,0,0,0.6)';x.fillRect(W/2-70,10,140,12);x.strokeStyle='rgba(0,240,255,0.5)';x.strokeRect(W/2-70,10,140,12);x.fillStyle=hp>30?'#00f0ff':'#ff3050';x.fillRect(W/2-68,12,136*(hp/100),8);if(state==='ready'){x.fillStyle='rgba(3,2,8,0.75)';x.fillRect(0,0,W,H);x.textAlign='center';x.font='900 26px Arial';x.fillStyle='#00f0ff';x.fillText('SHANKS DRIVE',W/2,160);x.font='700 10px Arial';x.fillStyle='#ff00a0';x.fillText('اضغط للبدء',W/2,185);}else if(state==='dead'){x.fillStyle='rgba(3,2,8,0.8)';x.fillRect(0,0,W,H);x.textAlign='center';x.font='900 26px Arial';x.fillStyle='#ff3050';x.fillText('GAME OVER',W/2,160);x.font='700 12px monospace';x.fillStyle='#fff';x.fillText('SCORE: '+score,W/2,190);x.font='700 10px Arial';x.fillStyle='#8a92a6';x.fillText('اضغط لإعادة اللعب',W/2,215);}}document.addEventListener('pointerdown',function(){if(state==='ready'||(state==='dead'&&performance.now()-overT>800)){ac();state='play';reset();}},{capture:true});function loop(){update();draw();requestAnimationFrame(loop);}requestAnimationFrame(loop);})();</script></body></html>`;

let handler = async (m, { conn }) => {
    const aiRich = new AIRich();
    aiRich._sections.push(
        AIRich.newLayout('Single', {
            __typename: 'GenAIaeacdsnwHtmlPrimitive',
            payload: htmlPayload,
            trusted_sources: ["shanks.dev"]
        })
    );

    const message = await aiRich.build(m.chat, { quoted: m });
    return await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
};

handler.command = ['Racer'];

export default handler;