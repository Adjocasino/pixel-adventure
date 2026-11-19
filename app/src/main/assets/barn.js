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
  clip:[160,12,14,18],door:[144,H-6,48,6],coop:[10,40,96,66],hay:[196,140,26,22],smoker:[194,30,28,18]};
/* right wing (v1.8): four stalls along the east wall, an aisle in front of them (x 226..258).
   Duck, goat, cow, bees. Each needs something, makes something, and has its own little task. */
const STALL_X=262,STALL_W=W-STALL_X,STALLS=[34,72,110,148],STALL_H=38;
const KINDS={
  duck:{stall:0,nm:'Duck',needs:['water'],every:11,item:'duckegg',how:'pour water in her tub, then pick up her egg'},
  goat:{stall:1,nm:'Goat',needs:['food'],every:14,item:'goatmilk',how:'feed hay, then press A 5 times to milk'},
  cow:{stall:2,nm:'Cow',needs:['food','water'],every:16,item:'milk',how:'hay and water, then squeeze when the marker is in the green'},
  bees:{stall:3,nm:'Bees',needs:['calm'],every:15,item:'honey',how:'smoke the hive first, then take the honey'}};
const owned=k=>(CM.animals||[]).find(a=>a.k===k);
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
  // right wing: four stalls on the east wall, the aisle in front of them stays plank floor
  R(STALL_X-4,32,STALL_W+4,H-36,'#2b1d1a');
  STALLS.forEach((y,i)=>{R(STALL_X,y,STALL_W,STALL_H-2,i===3?'#7a6a4a':'#8a7055');
    for(let k=0;k<40;k++)R(STALL_X+2+(k*29)%(STALL_W-6),y+14+(k*17)%(STALL_H-18),2,1,k%3?'#d8b860':'#c8a048');   // straw
    R(STALL_X,y,STALL_W,3,'#5a4632');R(STALL_X,y+STALL_H-4,STALL_W,2,'#5a3418');
    // front fence (the side facing the aisle)
    R(STALL_X-4,y+6,4,2,'#8a5a30');R(STALL_X-4,y+20,4,2,'#8a5a30');R(STALL_X-5,y+2,2,STALL_H-4,'#6e4626');
    if(i===0){R(STALL_X+30,y+20,22,10,'#2b1d1a');R(STALL_X+31,y+21,20,8,'#7f95a8');}   // duck tub
    if(i===1||i===2){R(STALL_X+40,y+6,14,8,'#2b1d1a');R(STALL_X+41,y+7,12,6,'#9a6438');}   // hay rack
  });
  // bottom wall with the doorway
  R(0,H-4,144,4,'#5a3418');R(192,H-4,W-192,4,'#5a3418');R(144,H-3,48,3,'#c8a048');
  m.ground=c;m.tp=new Uint8Array(W*H).fill(T_P);}
function furnC(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),(x,y,ww,hh,col)=>{const g=c.getContext('2d');g.fillStyle=col;g.fillRect(x,y,ww,hh);});return{c,ox:0,oy:h};}
GEN.barn={name:'Barn',seed:77,base:T_P,music:'home',spawn:[10,10],interior:1,w:BW,h:BH,
  exits:[{side:'s',a:9,b:12,to:'meadow',sx:BX,sy:BY+1,dir:'down'}],
  ground:barnGround,
  build(m){m.indoor=1;m.barn=1;
    addBlock(m,0,0,W,34);addBlock(m,STALL_X-4,32,STALL_W+4,H-32);addBlock(m,0,H-4,144,4);addBlock(m,192,H-4,W-192,4);
    addF(m,POS.hay[0],POS.hay[1],furnC(26,22,(g,R)=>{R(0,4,26,18,'#2b1d1a');R(1,5,24,16,'#e0c070');R(1,5,24,3,'#f0da86');for(let y=9;y<20;y+=4)R(2,y,22,1,'#c8a048');R(12,5,2,16,'#a07a30');
      g.fillStyle='#5a3418';g.font='bold 6px monospace';g.textAlign='center';g.fillText('HAY',13,16);}),[0,10,26,12]);
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
  chickens:hens().map((h,i)=>mkChick(h.name,24+(i%3)*30+(i>2?14:0),62+(i>2?24:0)+(i%2)*6)),nests:[null,null,null],carry:Array.from({length:n},()=>({k:null,n:0})),pump:Array(n).fill(0),pops:[],lost:0,caught:0,
  stock:Object.keys(KINDS).filter(owned).map(k=>({k,name:owned(k).name,food:.7,water:.7,calm:.6,ready:0,readyT:KINDS[k].every*(.4+Math.random()*.3),t:Math.random()*9})),
  prod:{},mash:Array(n).fill(0),milk:Array(n).fill(null),stings:0};}
function happyOf(a){const K=KINDS[a.k];let v=1;for(const nd of K.needs)v=Math.min(v,a[nd]);return Math.min(1,v*1.25);}
function hens(){const l=(CM.animals||[]).filter(a=>a.k==='chicken');return l.length?l:[{k:'chicken',name:'Ginger'},{k:'chicken',name:'Rocky'}];}
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
  // duck, goat, cow, bees
  for(const a of B.stock||[]){a.t+=dt;const K=KINDS[a.k];
    a.food=Math.max(0,a.food-.017*k*dt);a.water=Math.max(0,a.water-.02*k*dt);a.calm=Math.max(0,a.calm-.022*k*dt);
    if(!a.ready&&happyOf(a)>.4){a.readyT-=dt;if(a.readyT<=0){a.ready=1;const y=STALLS[K.stall];
      pop(STALL_X-6,y+4,a.k==='duck'?'duck egg!':a.k==='bees'?'honey!':'milk ready!','#fff6c8');a.k==='duck'?sfx.quack():sfx.chime();}}
    if(a.k==='duck'&&Math.random()<.0015)sfx.quack();}
  for(let i=0;i<B.milk.length;i++)if(B.milk[i]&&B.time-B.milk[i].last>6)B.milk[i]=null;   // walked away from the cow
  let h=0;for(const c of B.chickens)h+=c.lost?0:Math.min(1,Math.min(c.food,c.water)*1.25);for(const a of B.stock||[])h+=happyOf(a);
  B.happySum+=h/(B.chickens.length+(B.stock||[]).length);B.happyN++;
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
  else if(id==='crate'){
    if(cr.k==='prod'){const q=cr.item.split(':')[1];B.prod[cr.item]=(B.prod[cr.item]||0)+1;B.score+=QPTS[q];cr.k=null;cr.item=null;sfx.chime();say2('+'+QPTS[q]+' stored','#fff0a0');return;}
    if(cr.k!=='eggs'){say2('Put eggs, milk or honey here');return;}let pts=0;
    for(const q of cr.q){if(q.startsWith('duck:')){const key='duckegg:'+q.slice(5);B.prod[key]=(B.prod[key]||0)+1;pts+=QPTS[q.slice(5)];}else{B.eggs[q]++;pts+=QPTS[q];}}
    B.score+=pts;cr.k=null;cr.q=[];cr.n=0;sfx.chime();say2('+'+pts+' eggs stored','#fff0a0');}
  else if(id==='hay'){if(cr.k&&cr.k!=='hay'){say2('Hands full!');return;}if(!owned('goat')&&!owned('cow')){say2('Hay is for a goat or a cow');return;}cr.k='hay';cr.n=1;sfx.cut();say2('hay','#f0da86');}
  else if(id==='smoker'){if(!owned('bees')){say2('The smoker is for bees');return;}if(cr.k&&cr.k!=='smoke'){say2('Hands full!');return;}cr.k='smoke';cr.n=1;noise(.3,.15,1200,200);say2('smoker lit','#d8dde4');}
  else if(id.startsWith('stall'))useStall(+id.slice(5),i,cr,say2);}
const animalAt=s=>(B.stock||[]).find(a=>KINDS[a.k].stall===s);
const meter=(t0)=>{const p=((B.time-t0)*1.3)%2;return p<1?p:2-p;};   // 0..1..0, for the cow's squeeze
const GREEN=[.38,.62];
function useStall(s,i,cr,say2){const a=animalAt(s);
  if(!a){say2(`For sale: buy a ${Object.values(KINDS).find(K=>K.stall===s).nm.toLowerCase()} from Bins`);return;}
  const K=KINDS[a.k],q=()=>QUAL(happyOf(a));
  // giving what they need
  if(cr.k==='hay'&&K.needs.includes('food')){const add=1-a.food;a.food=1;cr.k=null;const p=Math.round(10*Math.max(.3,add));B.score+=p;sfx.chime();say2(`${a.name} eats! +${p}`,'#b6f0a0');return;}
  if(cr.k==='water'&&K.needs.includes('water')){const add=1-a.water;a.water=1;cr.k=null;const p=Math.round(10*Math.max(.3,add));B.score+=p;sfx.blub();say2(`${a.name}: water! +${p}`,'#9ae0ff');return;}
  if(cr.k==='smoke'&&a.k==='bees'){a.calm=1;cr.k=null;noise(.5,.18,900,150);say2('the bees calm down','#d8dde4');B.score+=8;return;}
  if(cr.k==='hay'||cr.k==='water'||cr.k==='smoke'){say2(`${a.name} doesn't need that`);return;}
  if(!a.ready){const need=K.needs.filter(n=>a[n]<.5);
    say2(need.length?(a.k==='bees'?'The bees are restless: smoke them':`${a.name} needs ${need.map(n=>n==='food'?'hay':n).join(' and ')}`):`${a.name} is happy. Not ready yet`);return;}
  // collecting
  if(a.k==='duck'){if(cr.k&&cr.k!=='eggs'){say2('Hands full!');return;}if(cr.k==='eggs'&&cr.q.length>=3){say2('Max 3 eggs');return;}
    if(cr.k!=='eggs'){cr.k='eggs';cr.q=[];}cr.q.push('duck:'+q());cr.n=cr.q.length;done(a);sfx.tink();say2('duck egg ('+q()+')');return;}
  if(cr.k){say2('Hands full! Drop it at the crate');return;}
  if(a.k==='bees'){if(a.calm<.5){a.calm=0;B.stings++;B.score=Math.max(0,B.score-10);sfx.thud();say2('OUCH! Stung! Smoke them first −10','#ff9aa0');return;}
    cr.k='prod';cr.item='honey:'+q();done(a);sfx.tink();say2('honey ('+q()+')','#ffd34a');return;}
  if(a.k==='goat'){B.mash[i]++;sfx.tink();if(B.mash[i]>=5){B.mash[i]=0;cr.k='prod';cr.item='goatmilk:'+q();done(a);sfx.chime();say2('goat milk ('+q()+')','#f4ecd8');}else say2('milking '+B.mash[i]+'/5','#f4ecd8');return;}
  if(a.k==='cow'){const m=B.milk[i];
    if(!m){B.milk[i]={t0:B.time,last:B.time,n:0};say2('squeeze in the green!','#b6f0a0');return;}
    const v=meter(m.t0);m.last=B.time;
    if(v>=GREEN[0]&&v<=GREEN[1]){m.n++;sfx.tink();if(m.n>=3){B.milk[i]=null;cr.k='prod';cr.item='milk:'+q();done(a);sfx.chime();say2('milk ('+q()+')','#ffffff');}else say2('good squeeze '+m.n+'/3','#b6f0a0');}
    else{B.milk[i]=null;B.score=Math.max(0,B.score-5);sfx.thud();say2(`${a.name} kicked the bucket! −5`,'#ff9aa0');}}}
function done(a){a.ready=0;a.readyT=KINDS[a.k].every*(.8+Math.random()*.4);}
function catchChick(i,ci){const c=B.chickens[ci];if(!c||!c.run||c.lost)return;c.run=0;c.sad=0;c.food=Math.max(c.food,.4);c.water=Math.max(c.water,.4);c.x=56;c.y=70;c.tx=56;c.ty=70;B.caught++;B.score+=15;pop(c.x-10,c.y-20,`caught ${c.name}! +15`,'#b6f0a0');sfx.cluck();}
function endShift(){if(!B||!B.active)return;B.active=0;const pct=B.happyN?Math.round(B.happySum/B.happyN*100):0;
  const total=B.eggs.bronze+B.eggs.silver+B.eggs.gold,bonusK=pct>=95?.5:pct>=85?.25:pct>=70?.1:0,golden=pct>=95?1:0;
  // happy-animals bonus: extra eggs (silver) plus extra of every other product you stored
  const bonusProd={};if(bonusK)for(const key in B.prod||{})if(B.prod[key])bonusProd[key]=Math.ceil(B.prod[key]*bonusK);
  const bonus=(total?Math.ceil(total*bonusK):0);
  results={pct,eggs:Object.assign({},B.eggs),prod:Object.assign({},B.prod||{}),bonusProd,stings:B.stings||0,bonus,golden,score:B.score,lost:B.lost,caught:B.caught,stars:pct>=85?3:pct>=60?2:1};
  if(bRole!=='client'){applyResults(results);if(bRole==='host'&&window.MP)MP.send('bn_end',results);}showResults();}
function applyResults(r){CM.stats=CM.stats||{};CM.stats.shifts=(CM.stats.shifts||0)+1;if(r.golden)CM.stats.golden=(CM.stats.golden||0)+1;for(const q of['bronze','silver','gold'])if(r.eggs[q])addItem(CM.barn,'egg:'+q,r.eggs[q]);if(r.bonus)addItem(CM.barn,'egg:silver',r.bonus);if(r.golden)addItem(CM.barn,'egg:golden',1);
  for(const key in r.prod||{})if(r.prod[key])addItem(CM.barn,key,r.prod[key]);
  for(const key in r.bonusProd||{})if(r.bonusProd[key])addItem(CM.barn,key,r.bonusProd[key]);
  CM.best.barn=Math.max(CM.best.barn||0,r.score);cmSave();if(window.MARKET)setTimeout(()=>MARKET.checkUnlocks(true),400);}
function showResults(){const r=results;if(!r)return;sfx.chime();
  openPanel('SHIFT DONE',b=>{const p=document.createElement('div');
    p.innerHTML=`<p style="font-size:22px">${'★'.repeat(r.stars)}${'☆'.repeat(3-r.stars)}</p><p>Happiness: <b>${r.pct}%</b> &nbsp; Score: <b>${r.score}</b></p>
    <p>Eggs: ${r.eggs.gold} gold · ${r.eggs.silver} silver · ${r.eggs.bronze} bronze</p>
    ${Object.keys(r.prod||{}).length?`<p>${Object.keys(r.prod).sort().map(k=>`${itemName(k)} ×${r.prod[k]}`).join(' · ')}</p>`:''}
    ${r.stings?`<p style="color:#ffb0a0">Stung ${r.stings} time${r.stings>1?'s':''}. Smoke the hive before you take honey!</p>`:''}
    <p>${(()=>{const extra=Object.keys(r.bonusProd||{}).map(k=>`+${r.bonusProd[k]} ${itemName(k).replace(/ \(.*/,'').toLowerCase()}`);if(r.bonus)extra.unshift(`+${r.bonus} eggs`);
      return extra.length?`Happy animals bonus: <b>${extra.join(', ')}</b>`:r.pct>=70?'Happy animals! Collect something next time to get a bonus.':'No bonus (needs 70%+ happiness)';})()}${r.golden?' and <b>1 golden egg!</b>':''}</p>
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
  // 'Together' only when your friend is at the clipboard too
  const near=window.MP&&MP.nearMe();if(near)btns.push(['Together',()=>MP.invite('barn',mode)]);btns.push(['Not now',null]);
  ask('Tend the animals?',`${mode==='relaxed'?'<b>Relaxed</b> shift: no timer.':'<b>Timed panic</b>: 90 seconds.'} Feed ${hens().map(h=>h.name).join(', ').replace(/, ([^,]*)$/,' and $1')} (corn bin → feeder), give water (pump → waterer), collect eggs (nests → egg crate) and catch runaways!${Object.keys(KINDS).filter(owned).map(k=>`<br>${KINDS[k].nm} ${owned(k).name}: ${KINDS[k].how}.`).join('')}<br><small>Change Timed/Relaxed at the sign outside the barn.</small>`,btns);},'A: clipboard');
addSpot('barn',{x:POS.bin[0]-6,y:POS.bin[1]-6,w:42,h:40},()=>act('bin'),'A: corn');
addSpot('barn',{x:POS.pump[0]-6,y:POS.pump[1]+4,w:42,h:36},()=>act('pump'),'A: pump');
addSpot('barn',{x:POS.feeder[0]-4,y:POS.feeder[1]-4,w:36,h:22},()=>act('feeder'),'A: feeder');
addSpot('barn',{x:POS.waterer[0]-4,y:POS.waterer[1]-4,w:36,h:22},()=>act('waterer'),'A: waterer');
POS.nests.forEach(([x,y],i)=>addSpot('barn',{x:x-2,y:y+8,w:24,h:20},()=>act('nest'+i),'A: nest'));
addSpot('barn',{x:POS.crate[0]-4,y:POS.crate[1]-4,w:42,h:38},()=>act('crate'),'A: egg crate');
addSpot('barn',{x:POS.hay[0]-6,y:POS.hay[1]-2,w:38,h:30},()=>act('hay'),'A: hay');
addSpot('barn',{x:POS.smoker[0],y:POS.smoker[1],w:POS.smoker[2],h:POS.smoker[3]},()=>act('smoker'),'A: smoker');
STALLS.forEach((y,s)=>addSpot('barn',{x:STALL_X-34,y:y+2,w:32,h:STALL_H-4},()=>{
  if(!B||!B.active){const k=Object.keys(KINDS).find(k=>KINDS[k].stall===s),a=owned(k);
    say(a?`${a.name} the ${KINDS[k].nm.toLowerCase()}. Start a shift at the clipboard to ${KINDS[k].how}.`:`For sale. Bins sells ${k==='bees'?'beehives':KINDS[k].nm.toLowerCase()+'s'} at the market once you unlock them.`);return;}
  act('stall'+s);},'A: stall'));
// catching a runaway: press A next to it
HOOKS.extraAction.push(()=>{if(!B||!B.active||!map||map.id!=='barn')return false;
  for(let i=0;i<B.chickens.length;i++){const c=B.chickens[i];if(c.run&&!c.lost&&Math.hypot(c.x-pl.x,c.y-pl.y)<18){if(bRole==='client')MP.send('bn_act',{id:'catch',c:i});else catchChick(bMe,i);return true;}}return false;});
/* ---------------- tick (solo/host simulate, host syncs) ---------------- */
HOOKS.extraTick.push(()=>{if(!B||!B.active)return;if(bRole!=='client')stepShift(1/60);
  if(bRole==='host'&&window.MP&&T-lastSend>=6){lastSend=T;MP.send('bn_state',B);}});
/* ---------------- stall animals: sprites (facing left, toward the aisle), 2 frames each ---------------- */
function spr(w,h,draw){return[0,1].map(f=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw((x,y,ww,hh,col)=>{g.fillStyle=col;g.fillRect(x,y,ww,hh);},f);return c;});}
const OL='#2b1d1a';
const DUCK=spr(16,14,(R,f)=>{R(4,4,10,7,OL);R(1,1,6,6,OL);R(5,5,8,5,'#f4f4ee');R(2,2,4,4,'#f4f4ee');R(9,5,4,2,'#d8d8d0');R(0,4,3,2,'#f0a030');R(3,3,1,1,OL);
  R(6,11,1,f?2:3,'#f0a030');R(10,11,1,f?3:2,'#f0a030');R(13,6,2,2,'#f4f4ee');});
const GOAT=spr(24,22,(R,f)=>{R(6,7,16,9,OL);R(2,3,7,8,OL);R(7,8,14,7,'#ece6da');R(3,4,5,6,'#ece6da');R(10,8,10,2,'#d8d0c0');
  R(3,1,1,3,'#8a8f9a');R(6,1,1,3,'#8a8f9a');R(1,6,2,1,'#ece6da');R(4,6,1,1,OL);R(3,10,2,3,'#c8c0b0');   // horns, ear, eye, beard
  for(const[x,d]of[[8,f],[11,1-f],[16,1-f],[19,f]])R(x,15,2,d?6:5,'#5a4a3a');R(21,8,2,2,'#ece6da');});
const COW=spr(30,24,(R,f)=>{R(6,6,22,11,OL);R(1,3,8,10,OL);R(7,7,20,9,'#f4f2ec');R(2,4,6,8,'#f4f2ec');
  R(12,7,6,4,'#3a2e2a');R(20,10,5,5,'#3a2e2a');R(4,4,3,3,'#3a2e2a');R(1,9,5,4,'#e8a8a0');R(2,10,1,1,OL);R(4,6,1,1,OL);R(2,2,1,2,'#d8ccb4');R(7,2,1,2,'#d8ccb4');
  R(15,16,4,2,'#e8a8a0');for(const[x,d]of[[8,f],[11,1-f],[21,1-f],[24,f]])R(x,16,2,d?7:6,'#5a4a3a');R(27,8,1,6,'#3a2e2a');});
const HIVE=spr(18,22,(R,f)=>{R(1,4,16,18,OL);R(2,5,14,16,'#e0b050');for(let y=9;y<20;y+=4)R(2,y,14,1,'#a07a30');R(0,2,18,4,OL);R(1,3,16,2,'#c48a52');R(7,16,4,2,OL);});
/* ---------------- drawing ---------------- */
HOOKS.extraDraw.push(list=>{if(!map||map.id!=='barn')return;const st=B;
  const chicks=st?st.chickens:hens().map((h,i)=>{const t=__pa.T+i*137,bx=24+(i%3)*30+(i>2?14:0),by=62+(i>2?24:0)+(i%2)*6;
    return{name:h.name,x:bx+Math.sin(t/(90+i*13))*10,y:by,fl:Math.cos(t/(90+i*13))<0?1:0,f:(t>>(4+i%2))%2};});
  for(const c of chicks){if(c.lost)continue;list.push({y:c.y,fn:(cx,cy)=>{const s=(c.fl?CHKf:CHK)[c.f||0],x=Math.round(c.x-cx),y=Math.round(c.y-cy);
      ctx.drawImage(shadowC(5,2),x-5,y-2);ctx.drawImage(s,x-8,y-14);
      if(Math.hypot(c.x-pl.x,c.y-pl.y)<40||c.run)wtxt(c.name,x,y-19,c.run?'#ff9aa0':'#fff6c8',6);}});}
  // stalls: animal (or a FOR SALE sign), duck tub water, bees
  STALLS.forEach((sy,s)=>{const k=Object.keys(KINDS).find(k=>KINDS[k].stall===s),a=st&&st.stock?st.stock.find(x=>x.k===k):null,own=a||(st&&st.stock?null:owned(k));   // during a shift the host's barn decides
    list.push({y:sy+STALL_H-6,fn:(cx,cy)=>{const T=__pa.T,ox=STALL_X-cx,oy=sy-cy;
      if(!own){ctx.fillStyle='#f2ece0';ctx.fillRect(ox+14,oy+12,30,13);ctx.fillStyle='#8a2c28';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('FOR',ox+29,oy+16);ctx.fillText('SALE',ox+29,oy+21);wtxt(KINDS[k].nm,ox+29,oy+31,'#d8ccb4',5);return;}
      const fr=((a?a.t*60:T)/(k==='duck'?14:30)|0)%2,bob=Math.sin((a?a.t:T/60)*2+s)*3;
      if(k==='duck'){const w=a?a.water:.8;ctx.fillStyle='#3a5a7a';ctx.fillRect(ox+31,oy+21+Math.round(8*(1-w)),20,Math.max(0,Math.round(8*w)));
        ctx.drawImage(shadowC(5,2),ox+12+bob-5,oy+30);ctx.drawImage(DUCK[fr],ox+6+Math.round(bob),oy+18);}
      else if(k==='goat'){ctx.drawImage(shadowC(8,2),ox+10,oy+33);ctx.drawImage(GOAT[fr],ox+8+Math.round(bob/2),oy+12);}
      else if(k==='cow'){ctx.drawImage(shadowC(11,2),ox+8,oy+34);ctx.drawImage(COW[fr],ox+6,oy+11);}
      else{ctx.drawImage(HIVE[0],ox+24,oy+10);const calm=a?a.calm:.8,nb=calm<.3?12:calm<.6?7:4,sp=calm<.3?3:1.2;
        for(let b=0;b<nb;b++){const t=T/60*sp+b*1.7;ctx.fillStyle=b%2?'#2b1d1a':'#ffd34a';ctx.fillRect(Math.round(ox+33+Math.cos(t*1.3+b)*(10+b%3*4)),Math.round(oy+18+Math.sin(t*1.7+b*2)*(8+b%2*3)),2,1);}}
      if(a){const K=KINDS[k],bars=k==='bees'?[['calm','#d8dde4']]:K.needs.map(n=>[n,n==='food'?'#f2c56b':'#9ae0ff']);   // need bars inside the stall
        bars.forEach(([n,col],j)=>{const v=a[n],x=ox+3,y=oy+4+j*4;ctx.fillStyle='#1a1a1a';ctx.fillRect(x,y,22,3);ctx.fillStyle=v<.2?'#ff6a6a':col;ctx.fillRect(x,y,Math.round(22*v),3);});}
      if(a&&a.ready&&(T>>4)%2)wtxt('!',ox-2,oy+8,'#ffe07a',9);
      if(Math.hypot(STALL_X-14-pl.x,sy+20-pl.y)<30)wtxt(own.name,ox+40,oy+6,'#fff6c8',6);}});});
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
  const hh=18+st.chickens.length*9;ctx.fillStyle='rgba(20,30,28,.75)';ctx.fillRect(4,4,150,hh);
  wtxt(st.mode==='relaxed'?'RELAXED SHIFT':`TIME ${Math.max(0,Math.ceil(DUR-st.time))}s`,8,11,st.mode!=='relaxed'&&DUR-st.time<15?'#ff9aa0':'#fff6c8',7,'left');
  wtxt(`score ${st.score}`,150,11,'#fff',7,'right');
  st.chickens.forEach((c,i)=>{const y=21+i*9;wtxt(c.name,8,y,c.lost?'#888':c.run?'#ff9aa0':'#fff',6,'left');
    const mb=(x,v,col)=>{ctx.fillStyle='#1a1a1a';ctx.fillRect(x,y-2,34,4);ctx.fillStyle=v<.2?'#ff6a6a':col;ctx.fillRect(x,y-2,Math.round(34*v),4);};
    if(!c.lost){mb(46,c.food,'#f2c56b');mb(86,c.water,'#9ae0ff');}else wtxt('got out',60,y,'#888',6,'left');});
  wtxt('food',63,hh+2,'#f2c56b',5);wtxt('water',103,hh+2,'#9ae0ff',5);
  ctx.restore();
  // cow squeeze meter
  const m=st.milk&&st.milk[bMe];if(m){const s=KINDS.cow.stall,x=Math.round(STALL_X-40-cx),y=Math.round(STALLS[s]+4-cy),v=meter(m.t0);
    ctx.fillStyle='rgba(20,30,28,.85)';ctx.fillRect(x-2,y-2,40,10);ctx.fillStyle='#5a2a2a';ctx.fillRect(x,y,36,6);ctx.fillStyle='#4a9a4a';ctx.fillRect(x+Math.round(36*GREEN[0]),y,Math.round(36*(GREEN[1]-GREEN[0])),6);
    ctx.fillStyle='#fff';ctx.fillRect(x+Math.round(35*v),y-1,2,8);wtxt(`${m.n}/3`,x+18,y+13,'#fff',6);}
  // what you're carrying (over your head)
  const cr=st.carry[bMe];if(cr&&cr.k){const x=Math.round(pl.x-cx),y=Math.round(pl.y-cy-30);
    const lab=cr.k==='prod'?itemName(cr.item).replace(/ \(.*/,''):cr.k==='eggs'?`eggs ${cr.n}/3`:cr.k==='smoke'?'smoker':cr.k;
    const col={corn:'#f2c56b',water:'#9ae0ff',hay:'#f0da86',smoke:'#d8dde4',prod:'#ffe9b0'}[cr.k]||'#fff6e0';
    ctx.fillStyle='rgba(20,30,28,.8)';ctx.fillRect(x-22,y-6,44,9);wtxt(lab,x,y-1,col,6);}});

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
