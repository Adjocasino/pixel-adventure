/* Market Square (Cottage Meadow v1.2). West of Willow Village.
   - Fish stall ("SELL FISH"): sell fish from your bag for coins. Jao hangs around beside it (he is NOT the seller):
     talk to him for a quote, and he says a money line after you close the sell menu.
   - Animal shop ("ANIMALS"): Bins sells chickens for the barn; you name each one you buy. Every Bins line is a meal invite.
     Turon (his husky x golden retriever) sits in front of the counter. Pet him.
   Art: tools/export_market_sprites.py -> market.png + market_atlas.js (same art as docs/mockups/market_stalls.gif). */
(function(){
const A=window.MARKET_ATLAS,IMG=new Image();IMG.src='market.png';
const spr=(k,x,y,flip)=>{const r=A[k];if(!r||!IMG.complete)return;if(flip){ctx.save();ctx.translate(Math.round(x)+r[2],Math.round(y));ctx.scale(-1,1);ctx.drawImage(IMG,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);ctx.restore();}
  else ctx.drawImage(IMG,r[0],r[1],r[2],r[3],Math.round(x),Math.round(y),r[2],r[3]);};

/* ---------------- prices + coins ---------------- */
CM.coins=CM.coins||0;
const BAND_BASE=[4,8,14,22,35],TIER_MULT={IRON:1,BRONZE:1.5,SILVER:2,PLATINUM:3,GOLD:5};
function fishPrice(k){const p=k.split(':');let bi=0;FISH_BANDS.forEach((b,i)=>{if(b[2].includes(p[1]))bi=i;});return Math.round(BAND_BASE[bi]*(TIER_MULT[p[2]]||1));}
const CHICKEN_PRICE=150,MAX_CHICKENS=6;
const coinTxt=()=>`<b style="color:#ffe07a">● ${CM.coins} coins</b>`;
// bag shows coins too

window.openBag=openBag=function(){openPanel('BAG',b=>{const p=document.createElement('p');p.innerHTML=coinTxt();b.appendChild(p);
  itemsGrid(b,CM.inv,'Your bag is empty. Go fishing at Mirror Lake or play Fruit Catch under the big mango tree in Sunny Meadow!');});};

/* ---------------- lines ---------------- */
const JAO=['The moon never goes to the gym. Still full.','You are not late. Everyone else is just early.','Be like a chair. Always supportive. ...People also sit on you. Hmm.',
 'Clouds never pay rent. Still living up there.','You are not lost. The road just moved.','Be like a pillow. Soft. Always there for you. ...Gets drooled on. Hmm.',
 'Trees never finished school. Still leaving.','You are not short. The ceiling is just showing off.','Be like a candle. Bright. Warm. ...Slowly melting. Hmm. *puff*',
 'The rooster never sets an alarm. Still wakes up everybody.','You are not broke. Your money is just on vacation.','Be like an umbrella. Protect others from the rain. ...Then get left on the jeep. Hmm.',
 'The stars never post online. Still everybody looks at them.','You are not lazy. You are in power-saving mode.','Be like a bridge. Connect people. ...People walk all over you. Hmm.',
 'The sun never says sorry for being late in the morning. Still everyone waits for it.','You are not old. You are vintage. *puff*','Be like coffee. Strong. Warm. ...Also bitter. Hmm.',
 'Mountains never move. Still people travel to see them.','You are not wrong. You are just early to being right.','Be like a door. Open to everyone. ...Also gets slammed. Hmm.',
 'Rain never gets invited. Still comes to every party.','You are not alone. Your shadow is right there. Rude, but there.','Be like a fan. Keep everyone cool. ...Nobody says thank you to a fan. Hmm. *puff*',
 'Cats never say sorry. Still everybody loves them.'];
const JAO_SELL=['Money never stays. Still everyone wants it.','You did not lose the item. You gained coins. Big brain.','Be like a coin. Shiny. Valuable. ...Always passed around. Hmm.',
 'You are not spending. You are moving money to a better home.','Wallets never smile. Still they feel happy when full. *puff*'];
const ARAW_LINES=['Araw purrs like a tiny motorcycle. Jao: "Araw means sun. Never goes to work. Still shining. *puff*"',
 'Araw headbutts your hand. Jao: "Be like a cat. Sleep all day. ...Still everybody loves you. Hmm."',
 'Araw slow-blinks at you. Jao: "He likes you. He does not like the vape. Smart cat."',
 'Araw rolls over, then pretends nothing happened. Jao: "Cats never apologize. Still family."'];
const BINS=['Have you eaten? No? Breakfast at my place. It\'s always ready.','Tomorrow, breakfast at my house, 6 AM. Turon will save you a seat.',
 'Lunch at my place later? I cooked too much again. On purpose.','You look hungry. You always look hungry. Dinner, my place, 7 o\'clock.',
 'Breakfast is the most important meal of the day. That\'s why I invite you every day.','My door is open for breakfast, lunch and dinner. Merienda too, if you knock twice.',
 'You skipped breakfast? Okay. Then come over for breakfast at lunch time.','Turon already ate. Now it\'s your turn. Come over!'];
const last={};
function pick(list,key){let i;do{i=Math.random()*list.length|0;}while(list.length>1&&i===last[key]);last[key]=i;return list[i];}

/* ---------------- the map ---------------- */
const FX=178,FY=136;                         // fish stall top-left (91x88, bottom = 192)
const AX=300,AY=142;                         // animal stall back top-left (91x70); counter front bottom = AY+82
const JX=FX+92,JFEET=FY+92;                  // Jao: image left, feet y
const TX=AX+8,TY=AY+77;
const RX=JX-12,RY=JFEET-14;                  // Araw (Jao's orange cat), image top-left (22x24), sits in front of Jao
const ARAW=new Image();ARAW.src='araw.png';let purrT=0;                      // Turon image top-left (22x24)
const PX=AX+44,PY=AY+80;                     // chick pen top-left (42x19)
GEN.market={name:'Market Square',seed:61,base:T_G,music:'day',spawn:[45,16],
  exits:[{side:'e',a:14,b:19,to:'village',sx:2,sy:17,dir:'right'}],
  build(m,R){
    ell(m,22,14,17,9,T_S);path(m,[[50,17],[42,16],[34,15]],4,T_S);
    addBlock(m,FX+2,FY+24,87,64);addBlock(m,AX+2,AY+24,87,58);
    addBlock(m,JX+5,JFEET-4,13,4);addBlock(m,RX+5,RY+18,13,5);addBlock(m,TX+2,TY+18,18,6);addBlock(m,PX,PY+4,42,15);
    for(let ty=8;ty<=14;ty++)for(let tx=11;tx<=25;tx++)occ(m,tx,ty);
    addAt(m,'barrel',10,13);addAt(m,'crate',9,14);addAt(m,'crate',27,14);addAt(m,'barrel',26,10);addAt(m,'barrel',8,10);
    for(const[tx,ty]of[[7,17],[30,18],[18,21]])addAt(m,'lamp',tx,ty);
    addAt(m,'sign',40,13,{msg:'→ Willow Village'});addAt(m,'sign',36,18,{msg:'Market Square. Fish stall: sell what you catch. Animal shop: Bins.'});
    border(m,R,'day');
    scatter(m,R,'tree',14,grassOK(m),1,{pal:'day'});scatter(m,R,'bush',8,grassOK(m),0,R=>({berry:R()<.4}));
    scatter(m,R,'rock',4,grassOK(m));scatter(m,R,'fern',24,grassOK(m));
    m.flowers=60;m.butterflies=5;m.leafCols=['#5aa86a','#7cbf6e','#e6ae5a'];
  }};

/* ---------------- Jao ascends (golden-fish gift) ----------------
   Original synthesized piece (gong, plucks, pentatonic bamboo flute, rising chimes), ported from demos/jao_ascend.html. */
let ac,out,rev;
function initAudio(){if(ac)return;ac=gameAC();if(!ac)return;
  out=ac.createGain();out.gain.value=.8;out.connect(gameMaster());
  rev=ac.createConvolver();const L=ac.sampleRate*3.2,ir=ac.createBuffer(2,L,ac.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.6);}
  rev.buffer=ir;const rg=ac.createGain();rg.gain.value=.55;rev.connect(rg);rg.connect(out);}
const hz=n=>440*Math.pow(2,(n-69)/12);
function noiseBuf(sec){const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
function send(node,dry=.6,wet=.8){const a=ac.createGain(),b=ac.createGain();a.gain.value=dry;b.gain.value=wet;node.connect(a);node.connect(b);a.connect(out);b.connect(rev);}
function gong(t){const m=ac.createGain();m.gain.setValueAtTime(0,t);m.gain.linearRampToValueAtTime(.5,t+.02);m.gain.exponentialRampToValueAtTime(.001,t+5.5);send(m,.5,.9);
  [[1,.6],[1.48,.35],[2.09,.25],[2.73,.18],[3.56,.1]].forEach(([r,v],i)=>{const o=ac.createOscillator(),q=ac.createGain();o.frequency.value=73*r;o.frequency.setValueAtTime(73*r*1.01,t);o.frequency.exponentialRampToValueAtTime(73*r,t+1.5);
    q.gain.value=v;q.gain.setValueAtTime(v,t);q.gain.exponentialRampToValueAtTime(.001,t+5-i*.6);o.connect(q);q.connect(m);o.start(t);o.stop(t+5.6);});
  const n=ac.createBufferSource();n.buffer=noiseBuf(.4);const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=900;const ng=ac.createGain();ng.gain.setValueAtTime(.25,t);ng.gain.exponentialRampToValueAtTime(.001,t+.35);n.connect(f);f.connect(ng);ng.connect(m);n.start(t);}
function pluck(t,n,v=.25){const f=hz(n),m=ac.createGain();m.gain.setValueAtTime(v,t);m.gain.exponentialRampToValueAtTime(.001,t+1.6);send(m,.6,.6);
  [[1,1],[2,.45],[3,.2],[4.02,.08]].forEach(([r,a])=>{const o=ac.createOscillator();o.type=r===1?'triangle':'sine';o.frequency.setValueAtTime(f*r*1.012,t);o.frequency.exponentialRampToValueAtTime(f*r,t+.05);
    const q=ac.createGain();q.gain.setValueAtTime(a,t);q.gain.exponentialRampToValueAtTime(.001,t+1.4/r);o.connect(q);q.connect(m);o.start(t);o.stop(t+1.7);});}
/* flute: notes [[midi,dur],...] played legato with grace slides and delayed vibrato */
function flute(t0,notes,v=.2){const o=ac.createOscillator(),o2=ac.createOscillator(),m=ac.createGain(),lfo=ac.createOscillator(),ld=ac.createGain();
  o.type='sine';o2.type='triangle';const o2g=ac.createGain();o2g.gain.value=.18;
  lfo.frequency.value=5.2;lfo.connect(ld);ld.connect(o.frequency);ld.connect(o2.detune);
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;
  o.connect(m);o2.connect(o2g);o2g.connect(m);m.connect(lp);send(lp,.55,.9);
  const br=ac.createBufferSource();br.buffer=noiseBuf(12);br.loop=true;const bf=ac.createBiquadFilter();bf.type='bandpass';bf.Q.value=1.4;const bg=ac.createGain();bg.gain.value=0;br.connect(bf);bf.connect(bg);send(bg,.5,.6);
  let t=t0;m.gain.setValueAtTime(0,t);m.gain.linearRampToValueAtTime(v,t+.12);bg.gain.setValueAtTime(0,t);bg.gain.linearRampToValueAtTime(.05,t+.06);bg.gain.linearRampToValueAtTime(.012,t+.3);
  for(const[n,d,slide]of notes){const f=hz(n);
    if(slide){o.frequency.setValueAtTime(o.frequency.value||f,t);o.frequency.exponentialRampToValueAtTime(f,t+.16);o2.frequency.exponentialRampToValueAtTime(f*2,t+.16);}
    else{o.frequency.setValueAtTime(f*.985,t);o.frequency.exponentialRampToValueAtTime(f,t+.07);o2.frequency.setValueAtTime(f*2,t);
      m.gain.setValueAtTime(v*.82,t);m.gain.linearRampToValueAtTime(v,t+.08);bg.gain.setValueAtTime(.035,t);bg.gain.linearRampToValueAtTime(.012,t+.15);}
    bf.frequency.setValueAtTime(f*2,t);
    ld.gain.setValueAtTime(0,t);if(d>.6)ld.gain.linearRampToValueAtTime(f*.012,t+Math.min(.9,d*.6));
    o.frequency.value=f;t+=d;}
  m.gain.setValueAtTime(v,t-.9);m.gain.linearRampToValueAtTime(0,t+.4);bg.gain.linearRampToValueAtTime(0,t+.2);
  for(const x of[o,o2,lfo,br]){x.start(t0);x.stop(t+.6);}return t;}
function chime(t,n,v=.12){const o=ac.createOscillator(),q=ac.createGain(),o2=ac.createOscillator(),q2=ac.createGain();o.frequency.value=hz(n);o2.frequency.value=hz(n)*2.76;
  q.gain.setValueAtTime(0,t);q.gain.linearRampToValueAtTime(v,t+.005);q.gain.exponentialRampToValueAtTime(.001,t+2.4);q2.gain.setValueAtTime(v*.3,t);q2.gain.exponentialRampToValueAtTime(.001,t+.8);
  o.connect(q);o2.connect(q2);send(q,.4,1);send(q2,.3,1);o.start(t);o2.start(t);o.stop(t+2.5);o2.stop(t+1);}
function wind(t,dur){const n=ac.createBufferSource();n.buffer=noiseBuf(dur+.5);const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.8;
  f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2400,t+dur);const q=ac.createGain();q.gain.setValueAtTime(0,t);q.gain.linearRampToValueAtTime(.09,t+dur*.6);q.gain.linearRampToValueAtTime(0,t+dur);
  n.connect(f);f.connect(q);send(q,.5,.8);n.start(t);n.stop(t+dur+.4);}
/* the piece: D minor pentatonic (D F G A C), original line */
function playAscend(){initAudio();if(!ac)return;if(ac.state==='suspended')ac.resume();const t=ac.currentTime+.08;
  gong(t);
  [50,57,62,57,62,65].forEach((n,i)=>pluck(t+.25+i*.11,n,.18));
  flute(t+.9,[[69,.45],[72,.4],[74,1.1],[77,.32,1],[79,.32,1],[81,1.25],[79,.22],[84,.3,1],[86,2.4,1]],.19);
  pluck(t+2.45,62,.14);pluck(t+2.55,69,.12);pluck(t+4.05,65,.14);pluck(t+4.15,72,.12);
  wind(t+4.2,3.4);
  [86,89,91,93,96,98,101,103].forEach((n,i)=>chime(t+4.9+i*.17,n,.09));
  chime(t+6.6,98,.07);chime(t+6.9,103,.05);
  return t;}

const ASC_QUOTES=['I was not gone. I was buffering.','I went up. Too many clouds. No signal. Came back.',
 'Ascending is easy. Coming back down for the stall... that is the real journey. *puff*','You saw nothing. The vape saw everything. Hmm.'];
let asc=null,gold=[];   // asc = {t0} while Jao ascends
function jaoAscend(){asc={t0:performance.now()};pauseWorldMusic(true);playAscend();}

/* ---------------- animation + smoke ---------------- */
const SEQ=(a)=>a.flatMap(([p,n])=>Array(n).fill(p));
const JT=SEQ([['idle',6],['breath',6],['idle',4],['raise',3],['inhale',9],['raise',2],['exhale',5],['idle',6],['breath',6],['idle',5]]);
const BT=SEQ([['idle',8],['breath',6],['idle',4],['blink',2],['idle',6],['push',2],['push2',5],['push',2],['idle',6],['breath',6],['blink',2],['idle',3]]);
const TT=SEQ([['idle',6],['breath',6],['wag',1],['idle',1],['wag',1],['idle',1],['wag',1],['idle',1],['idle',4],['blink',2],['idle',4],['breath',6],['idle',7],['breath',4]]);
let puffs=[],jf=0,lastJ='',wagT=0,chicks=[[PX+8,PY+7,1],[PX+18,PY+10,0],[PX+28,PY+6,1]];
const here=()=>map&&map.id==='market';
HOOKS.extraTick.push(()=>{if(!here())return;const T=__pa.T;if(T%7)return;jf++;
  const jp=JT[jf%JT.length];
  if(jp==='exhale'&&lastJ!=='exhale')for(let k=0;k<14;k++)puffs.push([JX+11+k*.9,JFEET-26+(k%3),2+k*.35,0,46]);
  lastJ=jp;
  const tip=jp==='idle'||jp==='breath'||jp==='exhale'?[JX+15,JFEET-17]:[JX+16,JFEET-20];
  if(jf%2===0)puffs.push([tip[0],tip[1],.8,0,26]);
  if(jf%5===0)puffs.push([JX+6+(jf*7)%14,JFEET-40+(jf%3),3.5,0,60]);   // the permanent linger over his head
  for(const p of puffs){p[3]++;p[0]+=.45+Math.sin(p[3]*.3+p[2])*.35;p[1]-=.45;p[2]+=.22;}
  puffs=puffs.filter(p=>p[3]<p[4]);
  if(jf%6===0)for(const c of chicks)if(Math.random()<.5)c[2]=1-c[2];
  if(wagT>0)wagT--;if(purrT>0)purrT--;
  if(asc){const T=(performance.now()-asc.t0)/1000;
    if(T>1.2&&T<4.4)puffs.push([JX+15,JFEET-17,1,0,40]);
    if(T>3.6&&T<7.2){const lift=Math.min(1,(T-3.6)/2.4)*14;for(let i=0;i<4;i++)puffs.push([JX+3+Math.random()*18,JFEET-36+Math.random()*34-lift,2+Math.random()*2,0,70+Math.random()*40]);
      for(let i=0;i<2;i++)gold.push([JX+4+Math.random()*16,JFEET-30+Math.random()*28-lift,(Math.random()-.5)*.6,-.3-Math.random()*.6,60]);}
    if(T>=9){asc=null;pauseWorldMusic(false);say('Jao: "'+pick(ASC_QUOTES,'aq')+'"');}}
  for(const g of gold){g[4]--;g[0]+=g[2]*3;g[1]+=g[3]*3;}gold=gold.filter(g=>g[4]>0);});
HOOKS.extraDraw.push(list=>{if(!here())return;
  list.push({y:FY+88,fn:(cx,cy)=>spr('fishStall',FX-cx,FY-cy)});
  list.push({y:AY+82,fn:(cx,cy)=>{spr('animalBack',AX-cx,AY-cy);spr('bins_'+BT[jf%BT.length],AX+A._binsOff[0]-cx,AY+A._binsOff[1]-cy);spr('animalFront',AX+A._frontOff[0]-cx,AY+A._frontOff[1]-cy);}});
  list.push({y:PY+19,fn:(cx,cy)=>{spr('pen',PX-cx,PY-cy);
    for(const c of chicks){const hop=(jf+c[0])%8<2?1:0,x=Math.round(c[0]+(c[2]?1:-1)*((jf/6|0)%3)-cx),y=Math.round(c[1]-hop-cy);
      ctx.fillStyle='#f6d84a';ctx.fillRect(x,y,5,3);ctx.fillRect(x+1,y-1,3,1);ctx.fillStyle='#e08a2c';ctx.fillRect(c[2]?x+5:x-1,y+1,1,1);ctx.fillRect(x+1,y+3,1,1);ctx.fillRect(x+3,y+3,1,1);
      ctx.fillStyle='#1c1c1c';ctx.fillRect(c[2]?x+3:x+1,y,1,1);}}});
  list.push({y:TY+24,fn:(cx,cy)=>{ctx.fillStyle='rgba(120,96,60,.45)';ctx.fillRect(Math.round(TX+3-cx),Math.round(TY+22-cy),16,3);
    spr('turon_'+(wagT>0?(jf%2?'wag':'idle'):TT[jf%TT.length]),TX-cx,TY-cy);}});
  list.push({y:RY+23,fn:(cx,cy)=>{const fr=purrT>0?1:(jf%40===7?1:(jf%40>=20&&jf%40<23?2:0));ctx.fillStyle='rgba(120,96,60,.45)';ctx.fillRect(Math.round(RX+4-cx),Math.round(RY+21-cy),14,3);
    if(ARAW.complete)ctx.drawImage(ARAW,fr*22,0,22,24,Math.round(RX-cx),Math.round(RY-cy+(purrT>0&&jf%2?1:0)),22,24);
    if(purrT>0&&jf%3===0){ctx.fillStyle='#ff7a9a';const hx=Math.round(RX+11-cx+((jf*5)%9)-4),hy=Math.round(RY-4-cy-(30-purrT)%12);ctx.fillRect(hx,hy,2,1);ctx.fillRect(hx+3,hy,2,1);ctx.fillRect(hx,hy+1,5,1);ctx.fillRect(hx+1,hy+2,3,1);ctx.fillRect(hx+2,hy+3,1,1);}}});
  list.push({y:JFEET,fn:(cx,cy)=>{ctx.fillStyle='rgba(120,96,60,.45)';ctx.fillRect(Math.round(JX+4-cx),Math.round(JFEET-1-cy),16,3);
    if(!asc){spr('jao_'+JT[jf%JT.length],JX-cx,JFEET-37-cy);return;}
    const T=(performance.now()-asc.t0)/1000;let pose=T<1.2?'inhale':T<4.4?'idle':'exhale',al=1,lift=0;
    if(T>3.6){const k=Math.min(1,(T-3.6)/2.4);al=1-k;lift=k*14;}
    if(T>7.2&&T<8.6)al=0;if(T>=8.6)al=Math.min(1,(T-8.6)/.35);if(T>=8.6)lift=0,pose='idle';
    if(al>0){ctx.globalAlpha=al;spr('jao_'+pose,JX-cx,JFEET-37-lift-cy);ctx.globalAlpha=1;}}});});
HOOKS.extraOverlay.push((cx,cy)=>{if(!here())return;
  for(const g of gold){const tw=(g[4]>>2)%2,x=Math.round(g[0]-cx),y=Math.round(g[1]-cy);ctx.fillStyle=tw?'#ffe07a':'#d9a520';ctx.fillRect(x,y,1,1);if(tw){ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3);}}
  for(const p of puffs){const a=Math.max(0,.67*(1-p[3]/p[4]));ctx.fillStyle=`rgba(232,236,244,${a.toFixed(3)})`;ctx.beginPath();ctx.arc(p[0]-cx,p[1]-cy,p[2],0,7);ctx.fill();}
  wtxt('Jao',Math.round(JX+12-cx),Math.round(JFEET-46-cy),'#fff6c8',6);});

/* ---------------- selling (shared) ----------------
   Base price per item. Cheap items (base < LOW) lose demand as you sell them: each one sold drops that item's
   price by 15% (down to 25% of base, min 1 coin), and demand recovers slowly (back to full in about 10 minutes
   of real time). Valuable items always sell at full price. So grinding common stuff is a poor way to get rich. */
const EGG_BASE={bronze:2,silver:6,gold:14,golden:80};
const FRUIT_BASE={cala:1,banana:1,guava:2,mango:3,melon:8,gold:40};
/* barn products (v1.8): duck eggs and goat milk are cheap (their price drops if you sell a lot), cow milk and honey hold value */
const BARN_BASE={duckegg:{bronze:4,silver:9,gold:18},goatmilk:{bronze:6,silver:12,gold:24},milk:{bronze:8,silver:16,gold:30},honey:{bronze:10,silver:20,gold:40}};
const LOW=10,DROP=.85,FLOOR=.25,RECOVER_PER_MIN=.075;
function basePrice(k){const p=k.split(':');
  if(p[0]==='fish')return fishPrice(k);if(p[0]==='egg')return EGG_BASE[p[1]]||2;if(p[0]==='fruit')return FRUIT_BASE[p[1]]||1;if(BARN_BASE[p[0]])return BARN_BASE[p[0]][p[1]]||1;return 1;}
CM.demand=CM.demand||{};
/* demand recovers on time the game is open (CM.playT, seconds), not the phone clock, so changing the phone's time does nothing */
CM.playT=CM.playT||0;let lastPT=performance.now();
setInterval(()=>{const n=performance.now();CM.playT+=Math.min(5,(n-lastPT)/1000);lastPT=n;},1000);
for(const k in CM.demand)if(CM.demand[k][1]>1e11)CM.demand[k][1]=CM.playT;   // old saves stored phone-clock times
function demand(k){const d=CM.demand[k];if(!d)return 1;const m=Math.min(1,d[0]+RECOVER_PER_MIN*Math.max(0,CM.playT-d[1])/60);if(m>=1){delete CM.demand[k];return 1;}return m;}
function priceAt(k,m){const b=basePrice(k);return b>=LOW?b:Math.max(1,Math.round(b*m));}
function price(k){return priceAt(k,demand(k));}
function quote(k,q){let m=demand(k),v=0;const b=basePrice(k);for(let i=0;i<q;i++){v+=priceAt(k,m);if(b<LOW)m=Math.max(FLOOR,m*DROP);}return[v,m];}
function sellItems(store,k,q){q=Math.min(q,store[k]||0);if(!q)return 0;const[v,m]=quote(k,q);addItem(store,k,-q);CM.coins+=v;
  if(basePrice(k)<LOW)CM.demand[k]=[m,CM.playT];cmSave();return v;}
/* groups: [[label,store,filter],...] */
function openSell(title,intro,groups,onClose){const reopen=()=>openSell(title,intro,groups,onClose);openPanel(title,b=>{
  const top=document.createElement('p');top.innerHTML=`${coinTxt()}<br><small>${intro}</small>`;b.appendChild(top);
  const l=document.createElement('div');l.style.cssText='max-height:46vh;overflow:auto';let any=[];
  for(const[label,store,filt,empty]of groups){const keys=Object.keys(store).filter(k=>store[k]>0&&filt(k)).sort((x,y)=>basePrice(y)-basePrice(x));
    if(groups.length>1){const h=document.createElement('div');h.style.cssText='text-align:left;font-weight:700;margin:6px 0 2px;color:#cfe8ff';h.textContent=label;l.appendChild(h);}
    if(!keys.length){const p=document.createElement('div');p.style.cssText='font-size:12px;opacity:.75;text-align:left';p.textContent=empty;l.appendChild(p);continue;}
    for(const k of keys){any.push([store,k]);const n=store[k],pr=price(k),low=basePrice(k)<LOW,dm=demand(k),row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;margin:3px 0';
      const c=document.createElement('canvas');c.width=c.height=16;c.style.cssText='width:24px;height:24px;image-rendering:pixelated';c.getContext('2d').drawImage(itemIcon(k),0,0);row.appendChild(c);
      const sp=document.createElement('span');sp.style.cssText='flex:1;min-width:0;text-align:left;font-size:13px;line-height:1.25';
      sp.innerHTML=`${itemName(k)} <b>×${n}</b><br><small style="color:#ffe07a">● ${pr} each</small>`+(low&&dm<.99?` <small style="color:#ff9a8a">↓ ${Math.round(dm*100)}% demand</small>`:low?' <small style="opacity:.6">(cheap)</small>':'');row.appendChild(sp);
      for(const[lab,q]of[['Sell 1',1],['All '+quote(k,n)[0],n]]){const x=document.createElement('button');x.textContent=lab;x.style.cssText='flex:0 0 auto;width:auto;min-width:0;margin:0;padding:5px 9px;font-size:12px';
        x.onclick=()=>{sellItems(store,k,q);sfx.tink();reopen();};row.appendChild(x);}
      l.appendChild(row);}}
  b.appendChild(l);
  if(any.length>1){const r=document.createElement('div');r.className='row';const x=document.createElement('button');x.className='cur';
    const tot=any.reduce((a,[st,k])=>a+quote(k,st[k])[0],0);x.textContent=`Sell everything (${tot})`;x.onclick=()=>{for(const[st,k]of any)sellItems(st,k,st[k]);sfx.chime();reopen();};r.appendChild(x);b.appendChild(r);}
  const note=document.createElement('p');note.innerHTML='<small style="opacity:.7">Cheap items lose value the more you sell; demand comes back while you play.</small>';b.appendChild(note);
 },onClose);}

/* ---------------- fish stall ---------------- */
function openFishStall(){openSell('FISH STALL','Sell what you catch at Mirror Lake. Better tier = more coins.',
  [['Fish',CM.inv,k=>k.startsWith('fish:'),'You have no fish. Go fishing at the end of the Mirror Lake dock!']],
  ()=>{say('Jao: "'+pick(JAO_SELL,'js')+'"');});}

/* ---------------- animal shop ---------------- */
/* unlock rules (v1.3). Once unlocked it stays unlocked. Since v1.8 an unlocked animal can be bought (one of each, it gets a stall in the barn). */
const ANIMAL_PRICE={duck:250,goat:400,cow:600,bees:500};
const SOON=[
  {k:'duck',nm:'Duck',what:'duck eggs',goal:'Own 3 chickens',need:3,have:()=>chickens().length},
  {k:'cow',nm:'Cow',what:'milk',goal:'Own 4 chickens',need:4,have:()=>chickens().length},
  {k:'goat',nm:'Goat',what:'goat milk',goal:'Finish 5 barn shifts',need:5,have:()=>(CM.stats&&CM.stats.shifts)||0},
  {k:'bees',nm:'Bees',what:'honey',goal:'Get a golden egg in the barn',need:1,have:()=>(CM.stats&&CM.stats.golden)||0}];
CM.unlocked=CM.unlocked||{};
function checkUnlocks(announce){const fresh=[];for(const a of SOON)if(!CM.unlocked[a.k]&&a.have()>=a.need){CM.unlocked[a.k]=1;fresh.push(a.nm);}
  if(fresh.length){cmSave();if(announce){sfx.chime();say(`Unlocked at Bins' animal shop: ${fresh.join(', ')}! Bins: "Come see them. Breakfast first, of course."`);}}return fresh;}
function chickens(){return CM.animals.filter(a=>a.k==='chicken');}
function openShop(line){checkUnlocks(false);line=line||pick(BINS,'b');openPanel('ANIMAL SHOP',b=>{
  const top=document.createElement('p');top.innerHTML=`<i>Bins: "${line}"</i><br>${coinTxt()}`;b.appendChild(top);
  const l=document.createElement('div');l.className='list';l.style.cssText='max-height:48vh;overflow:auto';
  const n=chickens().length,row=document.createElement('button');
  row.innerHTML=`🐔 Chicken: <b style="color:#ffe07a">● ${CHICKEN_PRICE}</b><br><small>Lays eggs in the barn (${n}/${MAX_CHICKENS} in the barn)</small>`;
  if(n>=MAX_CHICKENS){row.disabled=true;row.innerHTML+='<br><small>The coop is full!</small>';}
  else if(CM.coins<CHICKEN_PRICE){row.disabled=true;row.innerHTML+=`<br><small>Need ${CHICKEN_PRICE-CM.coins} more coins. Sell fish at the fish stall.</small>`;}
  row.onclick=()=>nameAnimal('chicken');l.appendChild(row);
  const sb=document.createElement('button');sb.className='cur';const ne=Object.keys(CM.barn).filter(k=>/^(egg|duckegg|goatmilk|milk|honey):/.test(k)).reduce((a,k)=>a+CM.barn[k],0),nf=Object.keys(CM.inv).filter(k=>k.startsWith('fruit:')).reduce((a,k)=>a+CM.inv[k],0);
  sb.innerHTML=`🥚 Sell barn goods & fruit <small>(${ne} in barn storage, ${nf} fruit in bag)</small>`;sb.onclick=openProduce;l.insertBefore(sb,l.firstChild);
  const ICON={duck:'🦆',goat:'🐐',cow:'🐄',bees:'🐝'};
  for(const a of SOON){const x=document.createElement('button');x.disabled=true;const pr=ANIMAL_PRICE[a.k],mine=CM.animals.find(z=>z.k===a.k);
    if(mine)x.innerHTML=`${ICON[a.k]} ${a.nm}: <b style="color:#b6f0a0">${mine.name} lives in your barn</b><br><small>Makes ${a.what}. One stall each.</small>`;
    else if(CM.unlocked[a.k]){x.innerHTML=`${ICON[a.k]} ${a.nm}: <b style="color:#ffe07a">● ${pr}</b><br><small>Makes ${a.what} in the barn</small>`;
      if(CM.coins<pr)x.innerHTML+=`<br><small>Need ${pr-CM.coins} more coins.</small>`;else{x.disabled=false;x.onclick=()=>nameAnimal(a.k);}}
    else x.innerHTML=`🔒 ${a.nm} <small>(${a.what})</small><br><small>${a.goal}: ${Math.min(a.have(),a.need)}/${a.need}</small>`;
    l.appendChild(x);}
  b.appendChild(l);});}
function openProduce(){openSell('BINS BUYS','Bins cooks for everyone, so he buys eggs, milk and honey (from the barn storage) and fruit (from your bag).',
  [['Barn storage',CM.barn,k=>/^(egg|duckegg|goatmilk|milk|honey):/.test(k),'Nothing yet. Work a shift in the barn!'],['Fruit (bag)',CM.inv,k=>k.startsWith('fruit:'),'No fruit. Play Fruit Catch under the big mango tree.']],
  ()=>{say('Bins: "'+pick(BINS_BUY,'bb')+'"');});}
const BINS_BUY=['Eggs! Perfect. Breakfast tomorrow, my place. I\'ll cook these.','Thank you! Now you HAVE to come for lunch. It\'s your fruit.','Turon says thank you. He wants the mango. He can\'t have the mango.','This is a lot of eggs. Omelette party. You\'re invited. Obviously.'];
const SUGGEST=['Nugget','Mochi','Pepper','Kwek','Biscuit','Sunny','Tisoy','Bibingka','Pandesal','Chico'];
const NAME_SUG={chicken:SUGGEST,duck:['Kwak','Itik','Puddle','Waddles','Bibi'],goat:['Kambi','Pepper','Billy','Tsokolate','Gruff'],cow:['Bessie','Gatas','Mumu','Daisy','Kesong'],bees:['Queen Pulot','Buzzy','Reyna','Honeybun','Bubuyog']};
const NAME_ASK={chicken:["Name your chicken","Good choice! What's her name?"],duck:["Name your duck","She quacks at everyone. What's her name?"],
  goat:["Name your goat","He will eat your hay AND your basket. Name?"],cow:["Name your cow","Big girl, gentle heart. What do we call her?"],bees:["Name your queen bee","The hive needs a queen with a name."]};
function nameAnimal(kind){const taken=new Set(CM.animals.map(a=>a.name.toLowerCase()));const sug=(NAME_SUG[kind]||SUGGEST).filter(s=>!taken.has(s.toLowerCase()));const def=sug[Math.random()*sug.length|0]||'Buddy';
  const pr=kind==='chicken'?CHICKEN_PRICE:ANIMAL_PRICE[kind],[title,line]=NAME_ASK[kind]||NAME_ASK.chicken;
  ask(title,`Bins: "${line}"<br><input id="anName" maxlength="12" placeholder="${def}" style="margin-top:8px;padding:6px;font-size:16px;width:70%;text-align:center">`,
    [['Buy ●'+pr,()=>{const el=document.getElementById('anName');let nm=(el&&el.value||'').trim().replace(/[<>&"]/g,'')||def;
        if(taken.has(nm.toLowerCase()))nm+=' 2';if(CM.coins<pr)return;
        if(kind==='chicken'?chickens().length>=MAX_CHICKENS:CM.animals.some(a=>a.k===kind))return;
        CM.coins-=pr;CM.animals.push({k:kind,name:nm});cmSave();sfx.chime();
        say(kind==='chicken'?`${nm} moved into the barn! Bins: "Now you have to come for breakfast. ${nm} insists."`:`${nm} moved into a stall in the barn! Bins: "Bring me some of what ${nm} makes. I'll cook it."`);
        setTimeout(()=>checkUnlocks(true),2600);},'cur'],['Back',()=>openShop()]]);
  setTimeout(()=>{const el=document.getElementById('anName');if(el)el.focus();},50);}

/* ---------------- interaction spots ---------------- */
addSpot('market',{x:TX-4,y:TY+18,w:32,h:16},()=>{wagT=30;sfx.chime();say('Turon wags his tail. Bins: "He likes you! Stay for lunch, he\'s sharing."');},'A: pet Turon');
addSpot('market',{x:FX+8,y:FY+86,w:76,h:18},openFishStall,'A: sell fish');
addSpot('market',{x:RX-2,y:RY+16,w:26,h:16},()=>{purrT=30;if(sfx.purr)sfx.purr();else sfx.chime();say(pick(ARAW_LINES,'a'));},'A: pet Araw');
addSpot('market',{x:JX+16,y:JFEET-16,w:26,h:26},()=>{if(asc)return;
  const gf=Object.keys(CM.inv).filter(k=>CM.inv[k]>0&&/^fish:.*:GOLD$/.test(k)).sort((x,y)=>fishPrice(x)-fishPrice(y))[0];
  const talk=()=>{jf=JT.indexOf('exhale')-1;say('Jao: "'+pick(JAO,'j')+'"');};
  if(!gf)return talk();
  ask('Jao',`You have a golden fish: <b>${itemName(gf)}</b>. Give it to Jao?<br><small>He has never been given anything golden. (The fish is used up.)</small>`,
    [['Give it',()=>{addItem(CM.inv,gf,-1);cmSave();say('Jao: "...Gold. Hmm." *long inhale*');jaoAscend();},'cur'],['Just talk',talk]]);},'A: talk to Jao');
addSpot('market',{x:AX+30,y:AY+80,w:14,h:20},()=>openShop(),'A: animal shop');
addSpot('market',{x:AX+44,y:AY+97,w:44,h:12},()=>openShop(),'A: animal shop');

window.MARKET={jaoAscend,get ascending(){return !!asc;},openFishStall,openShop,openProduce,fishPrice,price,basePrice,quote,checkUnlocks,_dbg:{get puffs(){return puffs.length;}}};
})();
