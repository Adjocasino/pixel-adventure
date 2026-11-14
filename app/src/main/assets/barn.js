/* Barn Ranch (docs/BARN_RANCH.md, layout = docs/mockups/barn_wireframe.png).
   A red barn in Sunny Meadow. Inside: Ginger and Rocky. Start a shift at the clipboard ("Tend the animals?").
   Timed panic (default, 90 s) or Relaxed (sign outside the barn). Tasks: carry corn to the feeder, pump water and pour it,
   collect eggs from the nests and put them in the egg crate, catch a runaway chicken before it gets out the door.
   Hybrid scoring: each egg's quality comes from how fresh it was; the shift's happiness % adds a bonus stack.
   Eggs go to the storage box OUTSIDE the barn. Multiplayer: both players tend the same shift (host runs the shift). */
(function(){
const BW=20,BH=12,DUR=90;
/* ---------------- barn exterior (Sunny Meadow) ---------------- */
function barnSprite(){const w=132,h=104,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  const R=(x,y,ww,hh,col)=>{g.fillStyle=col;g.fillRect(x,y,ww,hh);};
  // roof (gable)
  for(let y=0;y<34;y++){const half=8+y*1.75;R(Math.round(66-half),y+4,Math.round(half*2),1,y%4===0?'#4a3a36':'#5e4a44');}
  g.fillStyle='#2b1d1a';for(let y=0;y<34;y++){const half=8+y*1.75;g.fillRect(Math.round(66-half)-1,y+4,1,1);g.fillRect(Math.round(66+half),y+4,1,1);}
  R(4,37,124,3,'#3a2a26');
  // walls
  R(8,40,116,62,'#b8403a');for(let x=8;x<124;x+=6)R(x,40,1,62,'#9a3230');R(8,40,116,2,'#d0584e');R(8,100,116,2,'#7a2826');
  // trim
  R(8,40,2,62,'#f2ece0');R(122,40,2,62,'#f2ece0');R(8,40,116,2,'#f2ece0');
  // hay-loft window
  R(56,16,20,16,'#2b1d1a');R(58,18,16,12,'#e0b876');R(58,18,16,3,'#c89a4a');R(65,18,2,12,'#f2ece0');R(58,23,16,2,'#f2ece0');
  // big door with an X brace
  R(46,58,40,44,'#2b1d1a');R(48,60,36,42,'#8a2c28');R(48,60,36,2,'#f2ece0');R(48,60,2,42,'#f2ece0');R(82,60,2,42,'#f2ece0');R(65,60,2,42,'#f2ece0');
  g.strokeStyle='#f2ece0';g.lineWidth=2;g.beginPath();g.moveTo(50,62);g.lineTo(64,100);g.moveTo(64,62);g.lineTo(50,100);g.moveTo(68,62);g.lineTo(82,100);g.moveTo(82,62);g.lineTo(68,100);g.stroke();
  // side windows
  for(const x of[18,98]){R(x,58,16,14,'#2b1d1a');R(x+2,60,12,10,'#8fd0f0');R(x+7,60,2,10,'#f2ece0');R(x+2,64,12,2,'#f2ece0');}
  // little sign
  R(54,46,24,8,'#f2ece0');g.fillStyle='#8a2c28';g.font='bold 6px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('BARN',66,50);
  return{c,ox:66,oy:102};}
function boxSprite(){const c=document.createElement('canvas');c.width=22;c.height=20;const g=c.getContext('2d'),R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  R(1,6,20,13,'#2b1d1a');R(2,7,18,11,'#a06a38');R(2,7,18,2,'#c48a52');for(let x=4;x<20;x+=5)R(x,9,1,9,'#7a4a26');R(1,3,20,5,'#2b1d1a');R(2,4,18,3,'#c48a52');R(9,8,4,3,'#e0c070');return{c,ox:11,oy:19};}
function signSprite(){const c=document.createElement('canvas');c.width=20;c.height=22;const g=c.getContext('2d'),R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  R(9,10,2,12,'#6e4626');R(1,1,18,11,'#2b1d1a');R(2,2,16,9,'#d8b07a');R(4,4,12,1,'#8a5a30');R(4,7,9,1,'#8a5a30');return{c,ox:10,oy:21};}
const BX=20,BY=7;   // barn door tile in the meadow (the barn is drawn above it)
const ob=GEN.meadow.build;
GEN.meadow.build=function(m,R){for(let y=1;y<=6;y++)for(let x=16;x<=24;x++)occ(m,x,y);occ(m,25,6);occ(m,15,6);ob(m,R);
  m.objs.push({kind:'barn',x:BX*TS,y:7*TS,s:barnSprite(),b:{x:BX*TS-60,y:7*TS-44,w:120,h:42},sh:[60,6]});
  m.objs.push({kind:'storebox',x:25*TS+8,y:7*TS-2,s:boxSprite(),b:{x:25*TS-2,y:7*TS-9,w:20,h:7},sh:[10,3]});
  m.objs.push({kind:'barnsign',x:15*TS+8,y:7*TS-2,s:signSprite(),b:{x:15*TS+5,y:7*TS-6,w:6,h:4},sh:[6,2]});};
addSpot('meadow',{x:BX*TS-16,y:7*TS-6,w:32,h:20},()=>{sfx.open();travel('barn',10,10,'up');},'A: enter barn');
addSpot('meadow',{x:25*TS-4,y:7*TS-14,w:26,h:22},()=>openStorage(),'A: storage');
addSpot('meadow',{x:15*TS-2,y:7*TS-14,w:20,h:22},()=>{CM.barnMode=CM.barnMode==='relaxed'?'timed':'relaxed';cmSave();
  say(CM.barnMode==='relaxed'?'Barn shifts: RELAXED. No timer, the animals get hungry slowly. End the shift at the clipboard.':'Barn shifts: TIMED PANIC. 90 seconds, keep everyone fed and happy!');},'A: shift mode');

/* ---------------- barn interior ---------------- */
const W=BW*TS,H=BH*TS;
const POS={nests:[[16,18],[40,18],[64,18]],feeder:[18,94,28,10],waterer:[64,94,28,10],crate:[14,144,34,30],pump:[128,92,30,34],bin:[194,96,30,30],
  clip:[160,12,14,18],door:[144,H-6,48,6],coop:[10,40,96,66]};
function barnGround(m){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  // floor planks + straw in the coop
  for(let y=32;y<H;y++){const pl=(y-32)/6|0;R(0,y,W,1,pl%2?'#a4794a':'#99703f');}
  for(let x=0;x<W;x+=32)for(let y=32;y<H;y+=6)R(x+((y/6|0)%2)*16,y,1,6,'#7a5230');
  for(let i=0;i<260;i++){const x=6+(i*37)%100,y=40+(i*53)%70;R(x,y,2,1,i%3?'#d8b860':'#c8a048');}
  // back wall (face, 3/4 view)
  R(0,0,W,32,'#8a2c28');for(let x=0;x<W;x+=8)R(x,0,1,30,'#7a2624');R(0,28,W,4,'#5a3418');R(0,31,W,1,'#2b1d1a');
  // nest boxes on the back wall
  for(const[x,y]of POS.nests){R(x,y-6,20,20,'#2b1d1a');R(x+1,y-5,18,18,'#a06a38');R(x+3,y+2,14,9,'#e0c070');R(x+3,y+2,14,2,'#c8a048');}
  // roost bar
  R(18,52,78,2,'#6e4626');R(20,54,2,10,'#5a3418');R(92,54,2,10,'#5a3418');
  // ladder + hay loft hint, tool wall, clipboard
  R(128,0,2,30,'#6e4626');R(140,0,2,30,'#6e4626');for(let y=4;y<30;y+=6)R(128,y,14,2,'#8a5a30');
  R(192,4,30,24,'#5a3418');for(const[x,y,w,h,col]of[[196,8,2,16,'#c4cad2'],[202,8,8,2,'#8a909a'],[214,8,2,18,'#9a6438'],[212,6,6,3,'#c4cad2']])R(x,y,w,h,col);
  R(POS.clip[0],POS.clip[1],14,18,'#2b1d1a');R(POS.clip[0]+1,POS.clip[1]+3,12,14,'#f2ece0');R(POS.clip[0]+4,POS.clip[1],6,4,'#8a909a');for(let k=0;k<4;k++)R(POS.clip[0]+3,POS.clip[1]+6+k*3,8,1,'#8a8a8a');
  // right wing: locked stalls
  R(224,32,96,H-32,'#6e5a44');for(const[x,y]of[[230,40],[276,40],[230,110],[276,110]]){R(x,y,40,62,'#2b1d1a');R(x+2,y+2,36,58,'#8a7055');
    g.fillStyle='#f2ece0';g.fillRect(x+6,y+24,28,12);g.fillStyle='#8a2c28';g.font='bold 5px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('FOR',x+20,y+28);g.fillText('SALE',x+20,y+33);}
  R(316,140,4,36,'#2b1d1a');
  // bottom wall with the doorway
  R(0,H-4,144,4,'#5a3418');R(192,H-4,W-192,4,'#5a3418');R(144,H-3,48,3,'#c8a048');
  m.ground=c;m.tp=new Uint8Array(W*H).fill(T_P);}
function furnC(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),(x,y,ww,hh,col)=>{const g=c.getContext('2d');g.fillStyle=col;g.fillRect(x,y,ww,hh);});return{c,ox:0,oy:h};}
GEN.barn={name:'Barn',seed:77,base:T_P,music:'home',spawn:[10,10],interior:1,w:BW,h:BH,
  exits:[{side:'s',a:9,b:12,to:'meadow',sx:BX,sy:BY+1,dir:'down'}],
  ground:barnGround,
  build(m){m.indoor=1;m.barn=1;
    addBlock(m,0,0,W,34);addBlock(m,224,32,96,H-32);addBlock(m,0,H-4,144,4);addBlock(m,192,H-4,W-192,4);
    // low fence around the coop with a gate gap at x 96..112
    const fence=furnC(96,10,(g,R)=>{R(0,2,96,2,'#8a5a30');R(0,6,96,2,'#8a5a30');for(let x=0;x<96;x+=8)R(x,0,2,10,'#6e4626');});
    addF(m,0,106,fence,[0,6,96,4]);
    addF(m,POS.feeder[0],POS.feeder[1]-4,furnC(28,14,(g,R)=>{R(0,4,28,10,'#2b1d1a');R(1,5,26,8,'#9a6438');R(2,5,24,3,'#5a3418');}),[0,6,28,8],{feeder:1});
    addF(m,POS.waterer[0],POS.waterer[1]-4,furnC(28,14,(g,R)=>{R(0,4,28,10,'#2b1d1a');R(1,5,26,8,'#7f95a8');R(2,5,24,3,'#3a5a7a');}),[0,6,28,8],{waterer:1});
    addF(m,POS.crate[0],POS.crate[1],furnC(34,30,(g,R)=>{R(0,4,34,26,'#2b1d1a');R(1,5,32,24,'#b98a4c');R(1,5,32,3,'#d8b07a');for(let y=12;y<28;y+=5)R(1,y,32,1,'#8a5a30');R(4,8,26,4,'#f2ece0');}),[0,10,34,20]);
    addF(m,POS.pump[0],POS.pump[1],furnC(30,34,(g,R)=>{R(10,4,8,28,'#2b1d1a');R(11,5,6,26,'#5d7a8a');R(4,6,14,4,'#3a4a55');R(18,8,10,3,'#3a4a55');R(2,24,24,10,'#2b1d1a');R(3,25,22,8,'#7f95a8');R(4,26,20,3,'#a8d8f0');}),[0,22,30,12]);
    addF(m,POS.bin[0],POS.bin[1],furnC(30,30,(g,R)=>{R(0,2,30,28,'#2b1d1a');R(1,3,28,26,'#d8c48a');R(1,3,28,4,'#f0da86');R(4,12,22,8,'#8a6a35');g.fillStyle='#f2ece0';g.font='bold 6px monospace';g.textAlign='center';g.fillText('CORN',15,19);}),[0,14,30,16]);
  }};

/* ---------------- shift state ---------------- */
let B=null;          // the shift (host/solo) or the host's copy (client)
let bRole='local',bMe=0,lastSend=0,results=null;
function newShift(mode,n){return{active:1,mode,time:0,feeder:.6,waterer:.6,score:0,eggs:{bronze:0,silver:0,gold:0},happySum:0,happyN:0,
  chickens:[mkChick('Ginger',40,70),mkChick('Rocky',72,82)],nests:[null,null,null],carry:Array.from({length:n},()=>({k:null,n:0})),pump:Array(n).fill(0),pops:[],lost:0,caught:0};}
function mkChick(name,x,y){return{name,x,y,tx:x,ty:y,food:.8,water:.8,run:0,lost:0,layT:4+Math.random()*4,f:0,fl:0,t:0,sad:0};}
const pop=(x,y,txt,col)=>{B.pops.push({x,y,txt,col,t:0});};
function startShift(mode,role,me){results=null;bRole=role;bMe=me||0;if(role!=='client'){B=newShift(mode,role==='host'?2:1);}
  showArea(mode==='relaxed'?'Shift started: relaxed':'Shift started: 90 seconds!');sfx.chime();}
function stepShift(dt){const relaxed=B.mode==='relaxed',k=relaxed?.4:1;B.time+=dt;
  const eat=Math.min(B.feeder,.012*dt*2),drink=Math.min(B.waterer,.014*dt*2);
  for(const c of B.chickens){if(c.lost)continue;c.t+=dt;
    c.food=Math.max(0,c.food-.022*k*dt);c.water=Math.max(0,c.water-.026*k*dt);
    if(B.feeder>.02&&c.food<.95){c.food=Math.min(1,c.food+.05*dt);B.feeder=Math.max(0,B.feeder-.006*dt);}
    if(B.waterer>.02&&c.water<.95){c.water=Math.min(1,c.water+.05*dt);B.waterer=Math.max(0,B.waterer-.007*dt);}
    const hungry=c.food<.15||c.water<.15;c.sad=hungry?c.sad+dt:Math.max(0,c.sad-dt);
    if(!relaxed&&!c.run&&c.sad>5){c.run=1;pop(c.x-14,c.y-24,`${c.name} ran off!`,'#ff9aa0');sfx.cluck();}
    // movement
    if(c.run){const tx=168,ty=H+4,dx=tx-c.x,dy=ty-c.y,L=Math.hypot(dx,dy)||1;c.x+=dx/L*24*dt;c.y+=dy/L*24*dt;c.fl=dx<0;c.f=(c.t*8|0)%2;
      if(c.y>H-6){c.lost=1;B.lost++;B.score=Math.max(0,B.score-30);pop(150,H-30,`${c.name} got out! −30`,'#ff6a6a');sfx.blub();}}
    else{if(Math.hypot(c.tx-c.x,c.ty-c.y)<2&&Math.random()<.01){const[cx,cy,cw,ch]=POS.coop;c.tx=cx+Math.random()*cw;c.ty=cy+Math.random()*ch;}
      const dx=c.tx-c.x,dy=c.ty-c.y,L=Math.hypot(dx,dy);if(L>1){c.x+=dx/L*14*dt;c.y+=dy/L*14*dt;c.fl=dx<0;c.f=(c.t*6|0)%2;}else c.f=0;
      if(c.food>.35&&c.water>.35){c.layT-=dt;if(c.layT<=0){const free=B.nests.map((n,i)=>n?-1:i).filter(i=>i>=0);
        if(free.length){const i=free[Math.random()*free.length|0];B.nests[i]={fresh:1,by:c.name};pop(POS.nests[i][0]-4,POS.nests[i][1]-8,'egg!','#fff6c8');sfx.cluck();}c.layT=10+Math.random()*6;}}}
    if(Math.random()<.002)sfx.cluck();}
  for(const n of B.nests)if(n)n.fresh=Math.max(0,n.fresh-dt/(relaxed?50:25));
  let h=0;for(const c of B.chickens)h+=c.lost?0:Math.min(1,Math.min(c.food,c.water)*1.25);B.happySum+=h/B.chickens.length;B.happyN++;
  for(const p of B.pops)p.t+=dt;B.pops=B.pops.filter(p=>p.t<1.6);
  if(!relaxed&&B.time>=DUR)endShift();}
const QUAL=f=>f>.7?'gold':f>.35?'silver':'bronze',QPTS={gold:30,silver:20,bronze:10};
// a player (index i) uses a station
function useStation(id,i){const cr=B.carry[i];if(!cr)return;const say2=(t,c)=>{const p=i===bMe?pl:(MP_PARTNER()||pl);pop(p.x-20,p.y-30,t,c||'#fff6c8');};
  if(id==='bin'){if(cr.k&&cr.k!=='corn'){say2('Hands full!');return;}cr.k='corn';cr.n=1;sfx.cut();say2('corn');}
  else if(id==='pump'){if(cr.k&&cr.k!=='water'){say2('Hands full!');return;}B.pump[i]++;sfx.blub();if(B.pump[i]>=4){B.pump[i]=0;cr.k='water';cr.n=1;say2('bucket full!','#9ae0ff');}else say2('pump '+B.pump[i]+'/4','#9ae0ff');}
  else if(id==='feeder'){if(cr.k==='corn'){cr.k=null;const add=1-B.feeder;B.feeder=1;B.score+=Math.round(10*Math.max(.3,add));sfx.chime();say2('fed! +'+Math.round(10*Math.max(.3,add)),'#b6f0a0');}else say2('Bring corn from the bin');}
  else if(id==='waterer'){if(cr.k==='water'){cr.k=null;const add=1-B.waterer;B.waterer=1;B.score+=Math.round(10*Math.max(.3,add));sfx.chime();say2('water! +'+Math.round(10*Math.max(.3,add)),'#9ae0ff');}else say2('Pump water first');}
  else if(id.startsWith('nest')){const n=+id.slice(4),egg=B.nests[n];if(!egg){say2('No egg yet');return;}if(cr.k&&cr.k!=='eggs'){say2('Hands full!');return;}
    if(cr.k==='eggs'&&cr.q.length>=3){say2('Max 3 eggs');return;}if(cr.k!=='eggs'){cr.k='eggs';cr.q=[];}cr.q.push(QUAL(egg.fresh));cr.n=cr.q.length;B.nests[n]=null;sfx.tink();say2('egg ('+QUAL(egg.fresh)+')');}
  else if(id==='crate'){if(cr.k!=='eggs'){say2('Put eggs here');return;}let pts=0;for(const q of cr.q){B.eggs[q]++;pts+=QPTS[q];}B.score+=pts;cr.k=null;cr.q=[];cr.n=0;sfx.chime();say2('+'+pts+' eggs stored','#fff0a0');}}
function catchChick(i,ci){const c=B.chickens[ci];if(!c||!c.run||c.lost)return;c.run=0;c.sad=0;c.food=Math.max(c.food,.4);c.water=Math.max(c.water,.4);c.x=56;c.y=70;c.tx=56;c.ty=70;B.caught++;B.score+=15;pop(c.x-10,c.y-20,`caught ${c.name}! +15`,'#b6f0a0');sfx.cluck();}
function endShift(){if(!B||!B.active)return;B.active=0;const pct=B.happyN?Math.round(B.happySum/B.happyN*100):0;
  const total=B.eggs.bronze+B.eggs.silver+B.eggs.gold,bonusK=pct>=95?.5:pct>=85?.25:pct>=70?.1:0,bonus=total?Math.ceil(total*bonusK):0,golden=pct>=95?1:0;
  results={pct,eggs:Object.assign({},B.eggs),bonus,golden,score:B.score,lost:B.lost,caught:B.caught,stars:pct>=85?3:pct>=60?2:1};
  if(bRole!=='client'){applyResults(results);if(bRole==='host'&&window.MP)MP.send('bn_end',results);}showResults();}
function applyResults(r){for(const q of['bronze','silver','gold'])if(r.eggs[q])addItem(CM.barn,'egg:'+q,r.eggs[q]);if(r.bonus)addItem(CM.barn,'egg:silver',r.bonus);if(r.golden)addItem(CM.barn,'egg:golden',1);
  CM.best.barn=Math.max(CM.best.barn||0,r.score);cmSave();}
function showResults(){const r=results;if(!r)return;sfx.chime();
  openPanel('SHIFT DONE',b=>{const p=document.createElement('div');
    p.innerHTML=`<p style="font-size:22px">${'★'.repeat(r.stars)}${'☆'.repeat(3-r.stars)}</p><p>Happiness: <b>${r.pct}%</b> &nbsp; Score: <b>${r.score}</b></p>
    <p>Eggs: ${r.eggs.gold} gold · ${r.eggs.silver} silver · ${r.eggs.bronze} bronze</p>
    <p>${r.bonus?`Happy animals bonus: <b>+${r.bonus} eggs</b>`:'No bonus (needs 70%+ happiness)'}${r.golden?' and <b>1 golden egg!</b>':''}</p>
    ${r.lost?`<p style="color:#ffb0a0">${r.lost} chicken${r.lost>1?'s':''} got out (they come back home tomorrow).</p>`:''}
    <p style="color:#b6f0a0">Everything went to the <b>storage box outside the barn</b>.</p>`;b.appendChild(p);});
  B=null;}
const MP_PARTNER=()=>window.MP&&MP.partner&&MP.partner.map==='barn'?MP.partner:null;

/* ---------------- interactions inside the barn ---------------- */
function act(id){if(!B||!B.active){if(id==='clip')return;say('Start a shift at the clipboard first.');return;}
  if(bRole==='client'){MP.send('bn_act',{id});return;}useStation(id,bMe);}
addSpot('barn',{x:POS.clip[0]-12,y:32,w:38,h:20},()=>{
  if(B&&B.active){if(B.mode==='relaxed'||bRole!=='client')ask('Barn shift',B.mode==='relaxed'?'End the relaxed shift now?':'End the shift early?',[['End shift',()=>{if(bRole==='client')MP.send('bn_stop',{});else endShift();}],['Keep going',null,'cur']]);return;}
  const mode=CM.barnMode==='relaxed'?'relaxed':'timed',btns=[['Start',()=>startShift(mode,'local',0),'cur']];
  if(window.MP&&MP.connected)btns.push(['Together',()=>MP.invite('barn',mode)]);btns.push(['Not now',null]);
  ask('Tend the animals?',`${mode==='relaxed'?'<b>Relaxed</b> shift: no timer.':'<b>Timed panic</b>: 90 seconds.'} Feed Ginger and Rocky (corn bin → feeder), give water (pump → waterer), collect eggs (nests → egg crate) and catch runaways!<br><small>Change Timed/Relaxed at the sign outside the barn.</small>`,btns);},'A: clipboard');
addSpot('barn',{x:POS.bin[0]-6,y:POS.bin[1]-6,w:42,h:40},()=>act('bin'),'A: corn');
addSpot('barn',{x:POS.pump[0]-6,y:POS.pump[1]+4,w:42,h:36},()=>act('pump'),'A: pump');
addSpot('barn',{x:POS.feeder[0]-4,y:POS.feeder[1]-4,w:36,h:22},()=>act('feeder'),'A: feeder');
addSpot('barn',{x:POS.waterer[0]-4,y:POS.waterer[1]-4,w:36,h:22},()=>act('waterer'),'A: waterer');
POS.nests.forEach(([x,y],i)=>addSpot('barn',{x:x-2,y:y+8,w:24,h:20},()=>act('nest'+i),'A: nest'));
addSpot('barn',{x:POS.crate[0]-4,y:POS.crate[1]-4,w:42,h:38},()=>act('crate'),'A: egg crate');
addSpot('barn',{x:224,y:34,w:20,h:150},()=>say('For sale. The animal shop at the market opens soon!'),'A: stalls');
// catching a runaway: press A next to it
HOOKS.extraAction.push(()=>{if(!B||!B.active||!map||map.id!=='barn')return false;
  for(let i=0;i<B.chickens.length;i++){const c=B.chickens[i];if(c.run&&!c.lost&&Math.hypot(c.x-pl.x,c.y-pl.y)<18){if(bRole==='client')MP.send('bn_act',{id:'catch',c:i});else catchChick(bMe,i);return true;}}return false;});
/* ---------------- tick (solo/host simulate, host syncs) ---------------- */
HOOKS.extraTick.push(()=>{if(!B||!B.active)return;if(bRole!=='client')stepShift(1/60);
  if(bRole==='host'&&window.MP&&T-lastSend>=6){lastSend=T;MP.send('bn_state',B);}});
/* ---------------- drawing ---------------- */
HOOKS.extraDraw.push(list=>{if(!map||map.id!=='barn')return;const st=B;
  const chicks=st?st.chickens:[{name:'Ginger',x:40,y:70,fl:0,f:0},{name:'Rocky',x:72,y:82,fl:1,f:0}];
  if(!st){const t=__pa.T;chicks[0].x=40+Math.sin(t/90)*10;chicks[1].x=72+Math.cos(t/110)*12;chicks[0].f=(t>>4)%2;chicks[1].f=(t>>5)%2;}
  for(const c of chicks){if(c.lost)continue;list.push({y:c.y,fn:(cx,cy)=>{const s=(c.fl?CHKf:CHK)[c.f||0],x=Math.round(c.x-cx),y=Math.round(c.y-cy);
      ctx.drawImage(shadowC(5,2),x-5,y-2);ctx.drawImage(s,x-8,y-14);
      if(Math.hypot(c.x-pl.x,c.y-pl.y)<40||c.run)wtxt(c.name,x,y-19,c.run?'#ff9aa0':'#fff6c8',6);}});}
  if(st)st.nests.forEach((n,i)=>{if(!n)return;const[x,y]=POS.nests[i];list.push({y:y+12,fn:(cx,cy)=>{const ex=x+10-cx,ey=y+6-cy;
      ctx.fillStyle='#3a2a1a';ctx.fillRect(ex-3,ey-4,6,8);ctx.fillStyle=n.fresh>.7?'#fff6e0':n.fresh>.35?'#f4ecd8':'#d8ccb4';ctx.fillRect(ex-2,ey-3,4,6);ctx.fillStyle='#ffffff';ctx.fillRect(ex-1,ey-2,1,2);
      if(n.fresh>.7&&(__pa.T>>3)%2){ctx.fillStyle='#ffe07a';ctx.fillRect(ex+3,ey-5,1,1);}}});});});
HOOKS.extraOverlay.push((cx,cy)=>{if(!map||map.id!=='barn'||!B)return;const st=B;
  // levels on the feeder / waterer
  const bar=(x,y,v,col)=>{ctx.fillStyle='#1a1a1a';ctx.fillRect(x-cx,y-cy,28,3);ctx.fillStyle=v<.2?'#ff6a6a':col;ctx.fillRect(x-cx,y-cy,Math.round(28*v),3);};
  bar(POS.feeder[0],POS.feeder[1]+12,st.feeder,'#f2c56b');bar(POS.waterer[0],POS.waterer[1]+12,st.waterer,'#9ae0ff');
  for(const p of st.pops)wtxt(p.txt,Math.round(p.x-cx+20),Math.round(p.y-cy-p.t*10),p.col,6);
  // HUD (top centre, clear of the nests)
  ctx.save();ctx.translate(Math.round(VW/2-77),0);
  ctx.fillStyle='rgba(20,30,28,.75)';ctx.fillRect(4,4,150,36);
  wtxt(st.mode==='relaxed'?'RELAXED SHIFT':`TIME ${Math.max(0,Math.ceil(DUR-st.time))}s`,8,11,st.mode!=='relaxed'&&DUR-st.time<15?'#ff9aa0':'#fff6c8',7,'left');
  wtxt(`score ${st.score}`,150,11,'#fff',7,'right');
  st.chickens.forEach((c,i)=>{const y=21+i*9;wtxt(c.name,8,y,c.lost?'#888':c.run?'#ff9aa0':'#fff',6,'left');
    const mb=(x,v,col)=>{ctx.fillStyle='#1a1a1a';ctx.fillRect(x,y-2,34,4);ctx.fillStyle=v<.2?'#ff6a6a':col;ctx.fillRect(x,y-2,Math.round(34*v),4);};
    if(!c.lost){mb(46,c.food,'#f2c56b');mb(86,c.water,'#9ae0ff');}else wtxt('got out',60,y,'#888',6,'left');});
  wtxt('food',63,38,'#f2c56b',5);wtxt('water',103,38,'#9ae0ff',5);
  ctx.restore();
  // what you're carrying (over your head)
  const cr=st.carry[bMe];if(cr&&cr.k){const x=Math.round(pl.x-cx),y=Math.round(pl.y-cy-30);ctx.fillStyle='rgba(20,30,28,.8)';ctx.fillRect(x-14,y-6,28,9);
    wtxt(cr.k==='corn'?'corn':cr.k==='water'?'water':`eggs ${cr.n}/3`,x,y-1,cr.k==='corn'?'#f2c56b':cr.k==='water'?'#9ae0ff':'#fff6e0',6);}});

/* ---------------- multiplayer glue (called by mp.js) ---------------- */
window.BARN={
  start:startShift,
  onState(s){if(bRole==='client'){B=s;}},
  onAct(d){if(!B||!B.active)return;if(d.id==='catch')catchChick(1,d.c);else useStation(d.id,1);},
  onStop(){endShift();},
  onEnd(r){results=r;applyResults(r);B=null;showResults();},
  get B(){return B;},
  _dbg:{get B(){return B},endShift,useStation,catchChick,step:(n)=>{for(let i=0;i<n;i++)stepShift(1/60);}},
};
})();
