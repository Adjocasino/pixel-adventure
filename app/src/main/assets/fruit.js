/* Fruit Catch (ported from tools/fruit_catch_src.html, demo v3.x) with LAN multiplayer.
   One simulation for 1 or 2 players. Solo: local. Multiplayer: the MP host simulates, the client sends inputs
   and draws the host's snapshots (interpolated).  Modes: solo | coop | vs.
   Co-op: shared score, a player at 0 hearts is DOWN; the teammate revives them with CPR (A/B alternating on a 110 BPM beat,
   8 good beats) and they come back with 1 heart. Bonk rescue: press A next to a stunned teammate to steady them.
   Hold Item (Tilt) to tilt your bilao, e.g. to pour fruit into your teammate's bilao.
   Versus: your own crate (P1 left, P2 right), bump the other player to slosh their pile, catch a banana to get a peel and drop it with A. */
(function(){
const W=320,H=180,GROUND=166,CANOPY=26,ROUND=120;let GRAV=1200;
const CFG={acc:900,mu:.3,sub:8};
/* ---------- pixel sprites ---------- */
const PAL={k:'#2a1d14',y:'#f6c844',Y:'#fff0a0',o:'#e08a2c',r:'#d9573a',g:'#5aa04a',G:'#2f6b2e',b:'#6b4226',
  l:'#a7d36a',L:'#d8f0a0',c:'#7fbf3a',w:'#ffffff',d:'#4a3826',D:'#33251a',p:'#7a5a3a',P:'#9b7650',s:'#8d8f93',S:'#c4c6c9',
  h:'#e8434f',H:'#ff9aa0',e:'#1c1c1c',a:'#f2d24a',u:'#dfe8ff',n:'#b98a4c',N:'#e0b876',m:'#8a5a2b',z:'#c9b24a',Z:'#fff6c8',v:'#9d6aa8',E:'#3a3d4a'};
function spr(rows){const h=rows.length,w=rows[0].length,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch!=='.'){x.fillStyle=PAL[ch];x.fillRect(i,j,1,1);}}));return c;}
const S={
 mango:spr(['....gG..','...gb...','..kkkk..','.kyYyyk.','kyYYyyyk','kyYyyyok','kyyyyyok','kyyyyrok','.kyyrok.','..kkkk..']),
 guava:spr(['...bg...','..kkkk..','.klLlck.','klLllcck','kllllcck','klllccck','.klccck.','..kkkk..']),
 cala:spr(['..g..','.kkk.','kLcck','kccck','.kkk.']),
 gold:spr(['....gG..','...gb...','..kkkk..','.kzZzzk.','kzZZzzzk','kzZzzzak','kzzzzzak','kzzzzaak','.kzzaak.','..kkkk..']),
 heart:spr(['...g...','.kk.kk.','khHkhhk','khhhhhk','.khhhk.','..khk..','...k...']),
 rotten:spr(['....D...','...Db...','..kkkk..','.kmdmmk.','kmdmmvmk','kmmmdmmk','kvmmmmdk','kmmdmmmk','.kmmmdk.','..kkkk..']),
 durian:spr(['.k..k..k..k.','..kgkgkgkk..','kkgcgcgcgkk.','.kgcgcgcgck.','kkcgcgcgcgkk','.kgcgcgcgck.','kkcgcgcgcgkk','.kgcgcgcgck.','kkgcgcgcgkk.','..kgcgcgck..','..kkkgkkk...','.k..k..k..k.']),
 pebble:spr(['.kkkk.','kSSssk','kSsssk','ksssdk','.kkkk.']),
 poop:spr(['.w.','www','wuw','.w.']),
 bee1:spr(['..uu.uu..','..uuuuu..','.kakakak.','kakakakae','kakakakae','.kakakak.','...k.k...']),
 bee2:spr(['.........','.uu...uu.','.kakakak.','kakakakae','kakakakae','.kakakak.','...k.k...']),
 melon:spr(['....kkkkkk....','..kkGgGgGgkk..','.kgGgGgGgGgGk.','kgGgGgGgGgGgGk','kGgGgGgGgGgGgk','kgGgGgGgGgGgGk','kGgGgGgGgGgGgk','.kGgGgGgGgGgk.','..kkGgGgGgkk..','....kkkkkk....']),
 crow1:spr(['...kk.......','..keek......','.keeeek.kkk.','keeeeeekeoak','.keeeeeeekk.','..keeeeek...','...k...k....']),
 crow2:spr(['............','..kkkkkk....','.keeeeeekkk.','keeeeeeeeoak','.keeeeeeekk.','..kEEEeek...','...k...k....']),
 bird1:spr(['..kk......','.kssk.....','kssssk.kkk','.kssssskok','..ksssskk.','...k..k...']),
 bird2:spr(['..........','.kkkkk....','kssssskkkk','.kssssskok','..kSSSskk.','...k..k...']),
 banana:spr(['.......kb.','......kyk.','.....kyyk.','k...kyYyk.','kykkyYyyk.','.kyyyyyok.','..kooook..','...kkkk...']),
 peel:spr(['k........k','yk......ky','.yk.kk.ky.','..kyYYyk..','...kkkk...']),
 buko:spr(['....kkkkkk....','..kkGgggGgkk..','.kGggcgggggGk.','.kgcLcgggggGk.','kgcLLcggggggGk','kggccgggggggGk','kgggggggggggGk','kgggggggggggGk','kGgggggggggGGk','.kGgggggggGGk.','.kGGggggGGGGk.','..kkGGGGGGkk..','....kkkkkk....']),
 heartUI:spr(['.hh.hh.','hHhhhhh','hhhhhhh','.hhhhh.','..hhh..','...h...']),
 heartOff:spr(['.ss.ss.','ssssSss','sssssss','.sssss.','..sss..','...s...']),
};
const IT={
 melon:{s:'melon',pts:80,r:7,m:6,e:.1,v:1.15,fruit:1},banana:{s:'banana',pts:20,r:4,m:1,e:.15,v:1.05,fruit:1},
 mango:{s:'mango',pts:10,r:4,m:1,e:.25,v:1,fruit:1},guava:{s:'guava',pts:15,r:3.6,m:1,e:.3,v:1.1,fruit:1},
 cala:{s:'cala',pts:25,r:2.5,m:.5,e:.45,v:1.45,fruit:1},gold:{s:'gold',pts:50,r:4,m:1,e:.25,v:1.25,fruit:1},
 heart:{s:'heart',r:3.5,m:1,e:.2,v:1.15},rotten:{s:'rotten',r:4,m:1.1,e:.1,v:1,bad:1},
 bee:{s:'bee1',r:4,v:.8,bad:1,nophys:1},durian:{s:'durian',r:6,m:5,e:.15,v:1.55,bad:1},buko:{s:'buko',r:7,m:8,e:.2,v:1.7,bad:1},
 pebble:{s:'pebble',r:2.6,m:3,e:.45,v:1.3,bad:1},poop:{s:'poop',r:2,v:1.2,bad:1,nophys:1}};
const HEAVY={durian:1,buko:1};
/* ---------- background ---------- */
const bg=document.createElement('canvas');bg.width=W;bg.height=H;
(function(){const x=bg.getContext('2d');const gr=x.createLinearGradient(0,0,0,GROUND);gr.addColorStop(0,'#6fb6ec');gr.addColorStop(1,'#c9ecff');x.fillStyle=gr;x.fillRect(0,0,W,GROUND);
  x.fillStyle='#9fd08a';for(let i=0;i<W;i++){const h=128+Math.sin(i*.03)*8+Math.sin(i*.011+2)*10;x.fillRect(i,h|0,1,GROUND-h+1);}
  x.fillStyle='#86c070';for(let i=0;i<W;i++){const h=145+Math.sin(i*.05+1)*5+Math.sin(i*.017)*6;x.fillRect(i,h|0,1,GROUND-h+1);}
  x.fillStyle='#5fa64a';x.fillRect(0,GROUND,W,H-GROUND);x.fillStyle='#4f8f3d';x.fillRect(0,GROUND,W,2);
  x.fillStyle='#78bf5a';for(let i=0;i<70;i++){const gx=(i*53)%W,gy=GROUND+4+((i*29)%(H-GROUND-6));x.fillRect(gx,gy,1,2);x.fillRect(gx+2,gy+1,1,1);}
  for(const cx of[0,W-24]){x.fillStyle='#2a1d14';x.fillRect(cx,GROUND-17,24,18);x.fillStyle='#9b6a3c';x.fillRect(cx+1,GROUND-16,22,16);
    x.fillStyle='#7a5230';for(let j=0;j<3;j++)x.fillRect(cx+1,GROUND-11+j*5,22,1);x.fillStyle='#b98a4c';x.fillRect(cx+1,GROUND-16,22,2);
    x.fillStyle='#2a1d14';x.fillRect(cx+3,GROUND-16,1,16);x.fillRect(cx+20,GROUND-16,1,16);}})();
const canopy=document.createElement('canvas');canopy.width=W;canopy.height=46;
(function(){const x=canopy.getContext('2d');let seed=7;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const blob=(cx,cy,r,col)=>{x.fillStyle=col;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+1)x.fillRect(cx+i,cy+j,1,1);};
  x.fillStyle='#2f6b2e';x.fillRect(0,0,W,14);
  for(let i=0;i<80;i++)blob(R()*W|0,10+R()*18|0,6+R()*7|0,'#2f6b2e');for(let i=0;i<90;i++)blob(R()*W|0,6+R()*16|0,4+R()*5|0,'#3f8a3a');
  for(let i=0;i<70;i++)blob(R()*W|0,2+R()*14|0,2+R()*4|0,'#5aa04a');for(let i=0;i<60;i++){x.fillStyle='#78bf5a';x.fillRect(R()*W|0,R()*24|0,2,1);}
  for(let i=0;i<12;i++){const mx=R()*W|0,my=14+R()*14|0;x.fillStyle='#6b4226';x.fillRect(mx+4,my-3,1,3);x.drawImage(S.mango,mx,my);}})();
/* ---------- avatars: Adjo carry sheet (tools/adjo_bilao.py), Inad + others from the game's own sprites ---------- */
const ADJO_META=[{x:0,w:38,h:46,ground:43,hx:28.5,hy:3},{x:38,w:38,h:46,ground:43,hx:28.5,hy:1},{x:76,w:38,h:46,ground:43,hx:28.5,hy:1},{x:114,w:38,h:46,ground:43,hx:28.5,hy:3},
  {x:152,w:38,h:46,ground:43,hx:28.5,hy:1},{x:190,w:38,h:46,ground:43,hx:28.5,hy:1},{x:228,w:26,h:36,ground:36,hx:13,hy:1},{x:254,w:26,h:36,ground:36,hx:13,hy:2}];
const adjoImg=new Image();adjoImg.src='adjo_bilao.png';let adjoL=null;
adjoImg.onload=()=>{adjoL=document.createElement('canvas');adjoL.width=adjoImg.width;adjoL.height=adjoImg.height;const x=adjoL.getContext('2d');
  for(let i=0;i<6;i++){const m=ADJO_META[i];x.save();x.translate(m.x+m.w,0);x.scale(-1,1);x.drawImage(adjoImg,m.x,0,m.w,m.h,0,0,m.w,m.h);x.restore();}};
const BOWL_Y={adjo:-36,girl:-46};                 // bilao height above the ground per avatar (Inad's floats above her hat)
const BOWL=[[-23,-15],[-22,-11],[-20,-7.5],[-17,-4.5],[-12,-2],[-6,-.5],[0,0],[6,-.5],[12,-2],[17,-4.5],[20,-7.5],[22,-11],[23,-15]];
const RIM=23,SHELL=1.4;
/* ---------- audio (8-bit, on the game's AudioContext) ---------- */
let AC=null,mOut=null,sOut=null,mNext=0,mStep=0;const live=[];
const hz=m=>440*Math.pow(2,(m-69)/12);
function ainit(){if(AC)return;AC=gameAC();if(!AC)return;mOut=AC.createGain();mOut.gain.value=.5;mOut.connect(gameMaster());sOut=AC.createGain();sOut.gain.value=.7;sOut.connect(gameMaster());}
function bl(m,t,d,type,v,dest,slide){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(hz(m),t);if(slide)o.frequency.exponentialRampToValueAtTime(hz(m+slide),t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(dest||sOut);o.start(t);o.stop(t+d+.02);live.push(o);}
function nz(t,d,v,f,dest,type){if(!AC)return;const n=AC.createBufferSource(),b=AC.createBuffer(1,Math.max(1,AC.sampleRate*d|0),AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
  n.buffer=b;const g=AC.createGain(),hp=AC.createBiquadFilter();hp.type=type||'highpass';hp.frequency.value=f||6000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);n.connect(hp);hp.connect(g);g.connect(dest||sOut);n.start(t);live.push(n);}
function stopSound(){for(const n of live){try{n.stop();}catch(e){}}live.length=0;}
const SFX={
 plop(n){const t=AC.currentTime;bl(64+Math.min(n,12),t,.06,'square',.07);},bounce(){bl(76,AC.currentTime,.04,'square',.04);},
 bank(n){const t=AC.currentTime;for(let i=0;i<Math.min(8,2+n/2|0);i++)bl(72+[0,4,7,12,16,19,24,28][i],t+i*.055,.12,'square',.09);},
 boo(){bl(55,AC.currentTime,.2,'square',.1,null,-6);},heart(){const t=AC.currentTime;[76,79,84].forEach((m,i)=>bl(m,t+i*.07,.16,'triangle',.25));},
 buzz(){const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();o.type='sawtooth';o.frequency.value=210;l.frequency.value=28;lg.gain.value=30;l.connect(lg);lg.connect(o.frequency);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.1);g.gain.linearRampToValueAtTime(0,t+.7);o.connect(g);g.connect(sOut);o.start(t);l.start(t);o.stop(t+.75);l.stop(t+.75);},
 stun(){const t=AC.currentTime;for(let i=0;i<4;i++)bl(84-i*3,t+i*.06,.08,'square',.08);},thud(){const t=AC.currentTime;bl(40,t,.3,'triangle',.5,null,-12);nz(t,.15,.25,800);},
 hurt(){const t=AC.currentTime;bl(60,t,.12,'square',.15);bl(55,t+.12,.12,'square',.15);bl(48,t+.24,.3,'square',.15,null,-5);},
 caw(){const t=AC.currentTime;[0,.22].forEach(d=>{bl(66,t+d,.16,'sawtooth',.09,null,-6);nz(t+d,.12,.08,1500);});},
 tweet(){const t=AC.currentTime;[0,.14].forEach(d=>bl(93,t+d,.09,'sine',.12,null,5));},splat(){const t=AC.currentTime;nz(t,.25,.3,400);bl(45,t,.2,'square',.08,null,-10);},
 rustle(){const t=AC.currentTime;for(let i=0;i<5;i++)nz(t+i*.18,.15,.12,2500,null,'bandpass');},
 bonk(){const t=AC.currentTime;bl(36,t,.5,'triangle',.6,null,-12);bl(48,t,.15,'square',.2,null,-12);nz(t,.3,.3,500);for(let i=0;i<3;i++)bl(88-i*5,t+.25+i*.08,.08,'square',.06);},
 slip(){const t=AC.currentTime;bl(70,t,.35,'square',.1,null,14);nz(t,.3,.12,3000);},spill(){bl(67,AC.currentTime,.1,'triangle',.12,null,-7);},
 wind(){nz(AC.currentTime,1.6,.18,500,null,'bandpass');},over(){const t=AC.currentTime;[67,64,60,55,48].forEach((m,i)=>bl(m,t+i*.16,.22,'square',.12));},
 done(){const t=AC.currentTime;[72,76,79,84,79,84].forEach((m,i)=>bl(m,t+i*.12,.18,'square',.1));},
 beat(){bl(84,AC.currentTime,.05,'square',.06);},good(){bl(88,AC.currentTime,.07,'triangle',.18);},down(){const t=AC.currentTime;[64,60,55].forEach((m,i)=>bl(m,t+i*.12,.2,'square',.12));},
 revive(){const t=AC.currentTime;[60,64,67,72,76,79,84].forEach((m,i)=>bl(m,t+i*.06,.15,'square',.1));},steady(){const t=AC.currentTime;bl(79,t,.08,'triangle',.2);bl(84,t+.07,.12,'triangle',.2);},
 drop(){bl(62,AC.currentTime,.08,'square',.08,null,-5);},bump(){const t=AC.currentTime;bl(48,t,.12,'triangle',.3,null,-5);nz(t,.06,.2,900);},
};
function sfx(n,a){if(AC&&SFX[n])try{SFX[n](a);}catch(e){}}
const LEAD=[72,0,76,79,81,79,76,0, 74,0,77,81,79,77,74,72, 72,0,76,79,84,83,81,79, 77,76,74,0,72,0,0,0,
            76,0,79,84,86,84,79,0, 77,0,81,84,83,81,79,77, 76,79,77,76,74,72,74,76, 72,0,67,0,72,0,0,0];
const BASS=[48,55,48,55,53,60,53,60,48,55,52,55,53,55,50,55, 45,52,45,52,53,60,53,60,48,55,52,55,55,50,48,43];
function music(time){if(!AC)return;const bpm=140+30*Math.min(1,time/ROUND),st=60/bpm/2;if(mNext<AC.currentTime-.1)mNext=AC.currentTime+.05;
  while(mNext<AC.currentTime+.25){const i=mStep%64;if(LEAD[i])bl(LEAD[i],mNext,st*.9,'square',.05,mOut);if(i%2===0)bl(BASS[(i/2)|0],mNext,st*1.8,'triangle',.18,mOut);
    if(i%2===1)nz(mNext,.03,.04,7000,mOut);if(i%8===0)nz(mNext,.06,.08,1200,mOut);mNext+=st;mStep++;}}

/* =================== simulation (solo / MP host) =================== */
let G=null,mode='solo',role='local',me=0,state='title',bid=0,events=[];
const CPR_BEAT=60/110;
function mkPlayer(i,ch,n){const x=n===1?W/2:(i===0?W/2-50:W/2+50);
  return{i,ch,x,vx:0,ax:0,face:i===1?-1:1,dist:0,hearts:3,stun:0,slip:0,slipDir:1,dip:0,lead:0,bx:x,by:GROUND+(BOWL_Y[ch]||-34),bvx:0,bvy:0,bax:0,th:0,thv:0,
    wt:0,blink:0,down:0,cpr:0,cprKey:'',cprLock:0,ammo:0,splat:0,in:{dir:0,tx:null,tilt:0,a:0,b:0}};}
function reset(chars){bid=0;G={time:0,players:chars.map((c,i)=>mkPlayer(i,c,chars.length)),sc:[0,0],bodies:[],flyers:[],birds:[],crow:null,crowT:20,warns:[],peels:[],
  spawnT:.6,wind:0,windT:40,windDir:1,windWarn:0,dep:[null,null],banked:[[],[]],spilled:0,bestLoad:0,shake:0,fx:[],pops:[],over:0,win:0,beatT:0};}
const diff=()=>Math.min(1,G.time/ROUND),storm=()=>G.time>ROUND-15;
// events: played/shown locally and (as host) sent to the client
function ev(e){events.push(e);applyEv(e);}
function applyEv(e){if(e.s)sfx(e.s,e.a);
  if(e.pop)G.pops.push({x:e.x,y:e.y,txt:e.pop,col:e.c,t:0});
  if(e.burst)for(let i=0;i<(e.n||6);i++)G.fx.push({x:e.x,y:e.y,vx:(Math.random()-.5)*60,vy:-Math.random()*60-10,t:0,col:e.burst});
  if(e.splat!=null&&e.splat===me){splatT=3;splats=[];for(let i=0;i<5;i++)splats.push({x:40+Math.random()*(W-80),y:40+Math.random()*90,r:14+Math.random()*16});}
  if(e.shake)G.shake=Math.max(G.shake||0,e.shake);}
let splatT=0,splats=[];
function pickType(){const d=diff(),badP=.18+.22*d,r=Math.random(),lowHearts=G.players.some(p=>p.hearts<3&&!p.down);
  if(r<badP&&G.time>25&&Math.random()<.06+.06*d)return 'buko';
  if(r<badP){const opts=d<.12?['rotten','rotten','pebble']:['rotten','rotten','bee','durian','pebble','pebble','poop'];return opts[Math.random()*opts.length|0];}
  const g=Math.random();if(g<.04)return 'gold';if(g<.07&&lowHearts)return 'heart';if(g<.17)return 'banana';if(g<.21)return 'melon';if(g<.31+.1*d)return 'cala';if(g<.55)return 'guava';return 'mango';}
function spawn(){const k=pickType();
  if(k==='buko'){G.warns.push({x:44+Math.random()*(W-88),t:1.1});ev({s:'rustle'});return;}
  if(k==='poop'){G.birds.push({x:-12,y:30+Math.random()*12,dropX:40+Math.random()*(W-80),dropped:0,f:0});ev({s:'tweet'});return;}
  const x=34+Math.random()*(W-68),t=IT[k];
  if(t.nophys){G.flyers.push({k,x,y:CANOPY-4,bx:x,ph:Math.random()*6});if(k==='bee')ev({s:'buzz'});return;}
  addBody(k,x,CANOPY-4,(Math.random()-.5)*14,0);}
function addBody(k,x,y,vx,vy){const t=IT[k];G.bodies.push({id:++bid,k,x,y,vx,vy,r:t.r,m:t.m,e:t.e,ang:0,free:1,inB:-1,wasIn:-1,touched:0,owner:-1});}
// bilao collision per player
function bowlLocal(p,b){const c=Math.cos(p.th),s=Math.sin(p.th),dx=b.x-p.bx,dy=b.y-p.by;return[dx*c+dy*s,-dx*s+dy*c];}
function surfY(lx){for(let i=1;i<BOWL.length;i++){const[ax,ay]=BOWL[i-1],[bx2,by2]=BOWL[i];if(lx>=ax&&lx<=bx2)return ay+(by2-ay)*(lx-ax)/(bx2-ax);}return -99;}
function collideBowl(p,b){const c=Math.cos(p.th),s=Math.sin(p.th);let[lx,ly]=bowlLocal(p,b),hit=false;
  if(Math.abs(lx)>RIM+b.r+4||ly>b.r+6||ly<-20-b.r)return false;
  for(let i=0;i<BOWL.length-1;i++){const ax=BOWL[i][0],ay=BOWL[i][1]+SHELL,bx2=BOWL[i+1][0],by2=BOWL[i+1][1]+SHELL,ex=bx2-ax,ey=by2-ay,L2=ex*ex+ey*ey;
    let t=((lx-ax)*ex+(ly-ay)*ey)/L2;t=Math.max(0,Math.min(1,t));let nx=lx-(ax+ex*t),ny=ly-(ay+ey*t);const d=Math.hypot(nx,ny),R=b.r+SHELL;
    if(d>=R||d<1e-5)continue;nx/=d;ny/=d;lx+=nx*(R-d);ly+=ny*(R-d);
    const wnx=nx*c-ny*s,wny=nx*s+ny*c,rvx=b.vx-p.bvx,rvy=b.vy-p.bvy,vn=rvx*wnx+rvy*wny;
    if(vn<0){const jn=-(1+b.e)*vn;let tx=rvx-vn*wnx,ty=rvy-vn*wny;const vt=Math.hypot(tx,ty),mu=Math.abs(p.th)>.3?.04:CFG.mu,jt=Math.min(vt,mu*jn);
      if(vt>1e-6){tx-=tx/vt*jt;ty-=ty/vt*jt;}if(-vn>40)b.bump=1;b.vx=p.bvx+tx-b.e*vn*wnx;b.vy=p.bvy+ty-b.e*vn*wny;}
    hit=true;}
  if(hit){b.x=p.bx+lx*c-ly*s;b.y=p.by+lx*s+ly*c;}return hit;}
function inBowlOf(b){if(!b.touched)return -1;for(const p of G.players){const[lx,ly]=bowlLocal(p,b);if(Math.abs(lx)<RIM&&ly<surfY(lx)&&ly>-34)return p.i;}return -1;}
function collidePairs(){const B=G.bodies;for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],b=B[j],dx=b.x-a.x,dy=b.y-a.y,rr=a.r+b.r,d2=dx*dx+dy*dy;
  if(d2>=rr*rr||d2<1e-6)continue;const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,pen=rr-d,im=1/a.m+1/b.m;
  a.x-=nx*pen*(1/a.m)/im;a.y-=ny*pen*(1/a.m)/im;b.x+=nx*pen*(1/b.m)/im;b.y+=ny*pen*(1/b.m)/im;
  const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const e=Math.min(a.e,b.e),jj=-(1+e)*rv/im;a.vx-=jj*nx/a.m;a.vy-=jj*ny/a.m;b.vx+=jj*nx/b.m;b.vy+=jj*ny/b.m;
    const tx=-ny,ty=nx,vt=(b.vx-a.vx)*tx+(b.vy-a.vy)*ty,jt=Math.max(-.3*jj,Math.min(.3*jj,-vt/im));a.vx-=jt*tx/a.m;a.vy-=jt*ty/a.m;b.vx+=jt*tx/b.m;b.vy+=jt*ty/b.m;
    const pile=a.touched||b.touched;
    if(pile&&(HEAVY[a.k]||HEAVY[b.k])){const h=HEAVY[a.k]?a:b,o=h===a?b:a;heavyHit(h,o.owner>=0?o.owner:nearestPlayer(h.x));}
    if(pile){a.touched=b.touched=1;a.free=b.free=0;}}}}
function nearestPlayer(x){let best=0,bd=1e9;for(const p of G.players){const d=Math.abs(p.bx-x);if(d<bd){bd=d;best=p.i;}}return best;}
function hurt(p,n){if(p.down)return;p.hearts=Math.max(0,p.hearts-n);p.blink=n>1?1.8:1.2;if(p.hearts<=0)goDown(p);}
function goDown(p){if(mode==='solo'){endGame(false);return;}p.down=1;p.cpr=0;p.cprKey='';ev({s:'down',pop:mode==='coop'?'DOWN!':'OUT!',x:p.x-12,y:GROUND-88,c:'#ff9aa0'});
  if(G.players.every(q=>q.down))endGame(false);}
function heavyHit(d,pi){if(d.hurt)return;d.hurt=1;const big=d.k==='buko',p=G.players[pi];
  hurt(p,big?2:1);if(big){p.stun=1.2;ev({s:'bonk',shake:.9,pop:'−2 ♥  BONK!',x:d.x-8,y:d.y-12,c:'#ff6a6a'});}else ev({s:'hurt',shake:.4,pop:'−1 ♥',x:d.x-8,y:d.y-12,c:'#ff6a6a'});
  ev({burst:big?'#8a6a35':'#7fbf3a',x:d.x,y:d.y,n:big?18:10});
  for(const b of G.bodies)if(b!==d&&b.inB===pi){const sg=b.x<d.x?-1:1;b.vy-=big?220+Math.random()*120:70+Math.random()*80;b.vx+=big?sg*(140+Math.random()*120):(Math.random()-.5)*120;}
  d.vy=-(big?160:0)+d.vy*.2;d.vx=(Math.random()-.5)*(big?140:0)+d.vx;}
function endGame(win){if(state==='over')return;state='over';G.over=1;G.win=win?1:0;ev({s:win?'done':'over'});finishRewards();}
// ---- one player's movement + bilao
function stepPlayer(p,dt){const d=diff(),inp=p.in;
  let load=0;for(const b of G.bodies)if(b.inB===p.i)load+=b.m;p.wt=Math.min(1,load/12);
  const maxV=150*(1-.5*p.wt);let tv=0;
  if(p.down){p.vx=0;}
  else{
    if(p.slip<=0&&Math.abs(p.vx)>25)for(const pe of G.peels)if(!pe.used&&pe.arm<=0&&Math.abs(pe.x-p.x)<6){pe.used=1;p.slip=.75;p.slipDir=p.vx<0?-1:1;p.dip=5;ev({s:'slip',pop:'WHOA!',x:p.x-12,y:GROUND-50,c:'#fff0a0'});}
    if(p.slip>0){p.slip-=dt;p.vx=p.slipDir*Math.max(60,190*p.slip/.75);p.x+=p.vx*dt;p.ax=0;}
    else if(p.stun>0)p.stun-=dt;
    else if(p.cprLock>0){p.cprLock-=dt;if(inp.dir||inp.tx!=null&&Math.abs(inp.tx-p.x)>14)p.cprLock=0;}
    else if(inp.tx!=null){tv=Math.max(-maxV,Math.min(maxV,(inp.tx-p.x)*7));if(Math.abs(inp.tx-p.x)<1.5)tv=0;}
    else tv=inp.dir*maxV;
    if(p.slip<=0){const acc=CFG.acc*(1-.45*p.wt)*dt,pv=p.vx;p.vx+=Math.max(-acc,Math.min(acc,tv-p.vx));p.x+=p.vx*dt;p.ax=(p.vx-pv)/dt;}}
  if(p.x<38){p.x=38;p.vx=Math.max(0,p.vx);}if(p.x>W-38){p.x=W-38;p.vx=Math.min(0,p.vx);}
  if(Math.abs(p.vx)>14)p.face=p.vx<0?-1:1;p.dist+=Math.abs(p.vx)*dt;
  for(const k of['blink'])if(p[k]>0)p[k]-=dt;p.dip=Math.max(0,p.dip-dt*14);
  const moving=Math.abs(p.vx)>14,dir=p.vx<0?-1:1;p.lead+=((moving?dir*3:0)-p.lead)*Math.min(1,dt*2);
  const nbx=p.x+p.lead,nby=p.down?GROUND-3:GROUND+(BOWL_Y[p.ch]||-34)+p.dip,pbv=p.bvx;p.bvx=(nbx-p.bx)/dt;p.bvy=(nby-p.by)/dt;p.bx=nbx;p.by=nby;p.bax=p.bax*.5+.5*(p.bvx-pbv)/dt;
  let thT=0;if(p.x<44)thT=-1.3;else if(p.x>W-44)thT=1.3;
  if(inp.tilt&&!p.down)thT=p.face*.95;                 // hold Item: tilt the bilao (pour)
  if(p.down)thT=p.face*.25;
  p.thv+=((thT-p.th)*400-p.thv*35)*dt;p.th+=p.thv*dt;}
// ---- A / B presses: CPR, steady, peel drop
function onPress(p,key){if(p.down||state!=='play')return;
  const mate=G.players.find(q=>q!==p);
  if(mode==='coop'&&mate&&Math.abs(mate.x-p.x)<24){
    if(mate.down){const ph=(G.beatT%CPR_BEAT)/CPR_BEAT,off=Math.min(ph,1-ph)*CPR_BEAT;p.cprLock=1.2;p.vx=0;
      if(off<.17&&key!==mate.cprKey){mate.cpr++;mate.cprKey=key;ev({s:'good',pop:'♥',x:mate.x,y:GROUND-30,c:'#ff6a8a'});
        if(mate.cpr>=8){mate.down=0;mate.hearts=1;mate.blink=2;mate.cpr=0;ev({s:'revive',pop:'REVIVED! +1 ♥',x:mate.x-26,y:GROUND-58,c:'#b6f0a0'});}}
      else ev({s:'boo'});return;}
    if(mate.stun>0&&key==='a'){mate.stun=0;G.sc[0]+=10;ev({s:'steady',pop:'Steady! +10',x:mate.x-16,y:GROUND-56,c:'#9ae0ff'});return;}}
  if(mode==='vs'&&key==='a'&&p.ammo>0){p.ammo--;G.peels.push({x:p.x-p.face*14,t:12,arm:.4});ev({s:'drop',pop:'peel!',x:p.x-p.face*14-8,y:GROUND-12,c:'#fff0a0'});}}
function deposit(b,side){if(!G.dep[side])G.dep[side]={items:[],t:0};G.dep[side].items.push(b.k);G.dep[side].t=0;ev({burst:'#fff0a0',x:b.x,y:GROUND-14,n:3});}
function tally(side){const it=G.dep[side].items;G.dep[side]=null;const fr=it.filter(k=>IT[k].fruit),rot=it.filter(k=>k==='rotten').length;
  let sum=0;for(const k of fr)sum+=IT[k].pts;const n=fr.length,mult=n?Math.min(3,1+.15*(n-1)):0,gold=fr.includes('gold')?2:1;
  const who=mode==='vs'?side:0,pts=Math.round(sum*mult*gold)-25*rot;G.sc[who]=Math.max(0,G.sc[who]+pts);G.banked[mode==='vs'?side:0].push(...fr);G.bestLoad=Math.max(G.bestLoad,n);
  const x=side===0?4:W-70;
  if(n){ev({s:'bank',a:n,pop:`+${Math.round(sum*mult*gold)}`,x,y:GROUND-30,c:'#fff0a0'});ev({pop:`${n} fruit x${mult.toFixed(2)}${gold>1?' x2 GOLD':''}`,x,y:GROUND-21,c:'#d8f0a0'});}
  if(rot)ev({s:'boo',pop:`rotten −${25*rot}`,x,y:GROUND-39,c:'#c08aff'});}
function sim(dt){G.time+=dt;G.beatT+=dt;const d=diff();
  if(G.time>=ROUND){endGame(true);return;}
  for(const p of G.players){if(p.in.a){for(let k=0;k<p.in.a;k++)onPress(p,'a');p.in.a=0;}if(p.in.b){for(let k=0;k<p.in.b;k++)onPress(p,'b');p.in.b=0;}stepPlayer(p,dt);}
  // versus: players bump into each other; a hard bump sloshes the slower player's pile
  if(mode==='vs'&&G.players.length===2){const[a,b]=G.players,dx=b.x-a.x;if(Math.abs(dx)<14&&!a.down&&!b.down){const push=(14-Math.abs(dx))/2*(dx<0?-1:1);a.x-=push;b.x+=push;
      const rel=Math.abs(a.vx-b.vx);if(rel>110&&!(G.bumpT>0)){G.bumpT=.4;const slow=Math.abs(a.vx)<Math.abs(b.vx)?a:b,fast=slow===a?b:a;
        for(const o of G.bodies)if(o.inB===slow.i){o.vy-=120+Math.random()*80;o.vx+=(fast.x>slow.x?1:-1)*(60+Math.random()*60);}ev({s:'bump',pop:'BUMP!',x:slow.x-12,y:GROUND-58,c:'#ffd36a'});}}
    if(G.bumpT>0)G.bumpT-=dt;}
  if(G.shake>0)G.shake-=dt;
  for(const pe of G.peels){pe.t-=dt;if(pe.arm>0)pe.arm-=dt;}G.peels=G.peels.filter(pe=>pe.t>0&&!pe.used);
  if(G.time>G.windT-1.2&&!G.windWarn&&G.wind<=0){G.windWarn=1;G.windDir=Math.random()<.5?-1:1;}
  if(G.time>G.windT){G.wind=3;G.windWarn=0;G.windT=G.time+10+Math.random()*8-6*d;ev({s:'wind'});}
  const wf=G.wind>0?G.windDir*(40+70*d):0;if(G.wind>0)G.wind-=dt;
  G.spawnT-=dt;if(G.spawnT<=0){spawn();if(G.players.length>1&&Math.random()<.45)spawn();G.spawnT=storm()?.18+Math.random()*.1:(.7-.42*d)*(.7+Math.random()*.6);}
  for(const b of G.birds){b.x+=75*dt;b.f+=dt;if(!b.dropped&&b.x>=b.dropX){b.dropped=1;G.flyers.push({k:'poop',x:b.x,y:b.y+5,bx:b.x,ph:0});}}G.birds=G.birds.filter(b=>b.x<W+20);
  if(!G.crow&&G.time>G.crowT){const L=Math.random()<.5,tgt=G.players[Math.random()*G.players.length|0];G.crow={x:L?-14:W+2,y:54,dir:L?1:-1,ph:'enter',t:0,f:0,tgt:tgt.i};ev({s:'caw'});}
  if(G.crow){const c=G.crow,tp=G.players[c.tgt];c.t+=dt;c.f+=dt;
    if(c.ph==='enter'){c.x+=c.dir*90*dt;if(c.t>.9){c.ph='swoop';c.t=0;c.sx=c.x;c.sy=c.y;c.tx=tp.bx-6;c.ty=tp.by-14;}}
    else if(c.ph==='swoop'){const u=Math.min(1,c.t/.8),e=u*u*(3-2*u);c.x=c.sx+(c.tx-c.sx)*e;c.y=c.sy+(c.ty-c.sy)*e+Math.sin(u*Math.PI)*10;
      if(u>=1){let top=null;for(const b of G.bodies)if(b.inB>=0&&IT[b.k].fruit&&Math.hypot(b.x-(c.x+6),b.y-(c.y+6))<20&&(!top||b.y<top.y))top=b;
        if(top){top.dead=1;c.carry=top.k;ev({s:'caw',pop:'stolen!',x:c.x,y:c.y-6,c:'#c4c6c9'});}c.ph='leave';c.t=0;}}
    else{c.x+=c.dir*110*dt;c.y-=70*dt;if(c.y<-20||c.x<-30||c.x>W+30){G.crow=null;G.crowT=G.time+14+Math.random()*10-5*d;}}}
  G.bodies=G.bodies.filter(b=>!b.dead);
  for(const w of G.warns){w.t-=dt;if(w.t<=0){w.done=1;addBody('buko',w.x,CANOPY-4,0,20);}}G.warns=G.warns.filter(w=>!w.done);
  const fall=40+45*d;
  for(const f of G.flyers){f.ph+=dt;f.y+=fall*IT[f.k].v*dt;if(f.k==='bee')f.x=Math.max(2,Math.min(W-11,f.bx+Math.sin(f.ph*3)*18+(wf*f.ph*.3)));
    for(const p of G.players){if(p.down)continue;const nearB=Math.abs(f.x+4-p.bx)<RIM+2&&Math.abs(f.y+3-p.by+3)<7,nearA=Math.abs(f.x+4-p.x)<8&&f.y>GROUND-36&&f.y<GROUND;
      if(nearB||nearA){f.done=1;if(f.k==='bee'){p.stun=1;ev({s:'stun',pop:'Stung!',x:f.x,y:f.y-6,c:'#f2d24a'});}else ev({s:'splat',splat:p.i});break;}}
    if(f.y>GROUND)f.done=1;}
  G.flyers=G.flyers.filter(f=>!f.done);
  const N=CFG.sub,h=dt/N;
  for(let s=0;s<N;s++){
    for(const b of G.bodies){b.vy+=GRAV*h;b.vx+=wf*h*(b.inB>=0?.35:1);if(b.free){const cap=(55+60*d)*IT[b.k].v*(storm()?1.2:1);if(b.vy>cap)b.vy=cap;}b.x+=b.vx*h;b.y+=b.vy*h;}
    collidePairs();
    for(const b of G.bodies){for(const p of G.players)if(collideBowl(p,b)){if(!b.touched&&HEAVY[b.k])heavyHit(b,p.i);b.touched=1;b.free=0;b.owner=p.i;}
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.5;}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*.5;}}}
  for(const b of G.bodies){const was=b.inB;b.inB=inBowlOf(b);
    if(b.inB>=0&&b.inB!==b.wasIn&&was!==b.inB){const p=G.players[b.inB],first=b.wasIn<0;b.wasIn=b.inB;
      if(b.k==='heart'){b.dead=1;if(p.hearts<3)p.hearts++;ev({s:'heart',pop:'+1 ♥',x:b.x-6,y:b.y-10,c:'#ff9aa0',burst:'#ff9aa0',n:8});continue;}
      if(first||was<0){let n=0;for(const o of G.bodies)if(o.inB===b.inB)n++;ev({s:'plop',a:n});if(b.k==='rotten')ev({pop:'eww',x:b.x-6,y:b.y-10,c:'#c08aff'});
        if(b.k==='banana'&&mode==='vs'&&first){p.ammo++;}}}
    if(b.bump){b.bump=0;if(b.inB>=0)ev({s:'bounce'});}
    b.ang+=b.vx*dt/(b.r*1.2);
    const inCrate=(b.x<24||b.x>W-24)&&b.y+b.r>GROUND-16&&b.y<GROUND;
    if(inCrate&&b.wasIn>=0){b.dead=1;deposit(b,b.x<W/2?0:1);continue;}
    if(b.y+b.r>=GROUND){b.dead=1;
      if(HEAVY[b.k]){ev({s:'thud'});if(b.k==='buko')ev({shake:.25,burst:'#8a6a35',x:b.x,y:GROUND-1,n:10});}
      if(b.k==='melon')ev({s:'thud',burst:'#e8434f',x:b.x,y:GROUND-2,n:14});
      if(b.k==='banana'&&b.x>26&&b.x<W-26){G.peels.push({x:b.x,t:12,arm:0});ev({pop:'peel!',x:b.x-8,y:GROUND-12,c:'#fff0a0'});}
      if(IT[b.k].fruit&&b.wasIn>=0){G.spilled++;ev({s:'spill',pop:'spilled',x:b.x-8,y:GROUND-12,c:'#ffb0a0'});}
      ev({burst:IT[b.k].fruit?'#ffd36a':'#9b7650',x:b.x,y:GROUND-1,n:4});}}
  G.bodies=G.bodies.filter(b=>!b.dead);
  for(const s of[0,1])if(G.dep[s]){G.dep[s].t+=dt;if(G.dep[s].t>.8)tally(s);}}
// rewards: banked fruit goes to the bag (co-op: everyone gets the team's fruit, versus: your own crate)
function finishRewards(){const mine=mode==='vs'?G.banked[me]:G.banked[0],cnt={};for(const k of mine)cnt[k]=(cnt[k]||0)+1;
  for(const k in cnt)addItem(CM.inv,'fruit:'+k,cnt[k]);const sc=mode==='vs'?G.sc[me]:G.sc[0];CM.best.fruit=Math.max(CM.best.fruit||0,sc);cmSave();G.reward=cnt;}

/* =================== view (what we draw) =================== */
// solo/host draw G directly; the client draws an interpolated copy of the host's snapshots
let snapA=null,snapB=null,snapAt=0;
function viewState(){if(role!=='client')return G;if(!snapB)return null;const k=Math.min(1.2,(performance.now()-snapAt)/50);
  if(!snapA)return snapB;const V=Object.assign({},snapB),byId={};for(const b of snapA.bodies)byId[b.id]=b;
  V.bodies=snapB.bodies.map(b=>{const a=byId[b.id];if(!a)return b;return Object.assign({},b,{x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k});});
  V.players=snapB.players.map((p,i)=>{const a=snapA.players[i];if(!a)return p;const L=(f)=>a[f]+(p[f]-a[f])*k;return Object.assign({},p,{x:L('x'),bx:L('bx'),by:L('by'),th:L('th'),dist:L('dist')});});
  return V;}
// snapshot (host -> client)
const r1=v=>Math.round(v*10)/10;
function snapshot(){return{t:r1(G.time),st:state,sc:G.sc,w:r1(G.wind),wd:G.windDir,ww:G.windWarn,sp:G.spilled,bl:G.bestLoad,bt:r1(G.beatT),win:G.win,shake:G.shake>0?r1(G.shake):0,
  players:G.players.map(p=>({i:p.i,ch:p.ch,x:r1(p.x),vx:r1(p.vx),face:p.face,dist:r1(p.dist),hearts:p.hearts,stun:r1(p.stun),slip:r1(p.slip),slipDir:p.slipDir,bx:r1(p.bx),by:r1(p.by),th:Math.round(p.th*100)/100,wt:Math.round(p.wt*100)/100,blink:r1(p.blink),down:p.down,cpr:p.cpr,ammo:p.ammo})),
  bodies:G.bodies.map(b=>({id:b.id,k:b.k,x:r1(b.x),y:r1(b.y),ang:Math.round(b.ang*10)/10,free:b.free,inB:b.inB})),
  flyers:G.flyers.map(f=>({k:f.k,x:r1(f.x),y:r1(f.y),ph:r1(f.ph)})),birds:G.birds.map(b=>({x:r1(b.x),y:r1(b.y),f:r1(b.f)})),
  crow:G.crow?{x:r1(G.crow.x),y:r1(G.crow.y),dir:G.crow.dir,ph:G.crow.ph,f:r1(G.crow.f),carry:G.crow.carry}:null,
  warns:G.warns.map(w=>({x:r1(w.x),t:r1(w.t)})),peels:G.peels.map(p=>({x:r1(p.x),t:r1(p.t)})),banked:G.over?G.banked:null,ev:events.splice(0)};}
function onSnapshot(s){snapA=snapB;snapB=s;snapAt=performance.now();if(!G)reset(s.players.map(p=>p.ch));
  G.time=s.t;G.sc=s.sc;G.players.forEach((p,i)=>Object.assign(p,s.players[i]));for(const e of s.ev||[])applyEv(e);
  if(s.st==='over'&&state!=='over'){state='over';G.over=1;G.win=s.win;G.spilled=s.sp;G.bestLoad=s.bl;G.banked=s.banked||[[],[]];finishRewards();}
  else if(s.st==='play'&&state!=='play'){state='play';}}

/* =================== drawing =================== */
let cv,ctx,lt=0;
function txt(s,x,y,col,size,al){ctx.font=`bold ${size||8}px monospace`;ctx.textAlign=al||'left';ctx.textBaseline='alphabetic';ctx.fillStyle='#1a1a1a';ctx.fillText(s,x+.6,y+.6);ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y);}
function drawSprite(sp,x,y,ang){if(!ang){ctx.drawImage(sp,Math.round(x-sp.width/2),Math.round(y-sp.height/2));return;}
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(Math.round(ang*4)/4);ctx.drawImage(sp,-sp.width/2|0,-sp.height/2|0);ctx.restore();}
function drawAvatar(p,time){if(p.blink>0&&((p.blink*12)|0)%2)return;const moving=Math.abs(p.vx)>14,left=p.vx<0||(!moving&&p.face<0);
  ctx.save();if(p.down){ctx.translate(p.x,GROUND);ctx.rotate(p.face*1.4);ctx.translate(-p.x,-GROUND);}
  else if(p.slip>0){ctx.translate(p.x,GROUND);ctx.rotate(-p.slipDir*.35);ctx.translate(-p.x,-GROUND);}
  if(p.ch==='adjo'&&adjoImg.complete){const i=moving?((p.dist/7)|0)%6:6+(((time*1.6)|0)%2),m=ADJO_META[i],bodyC=moving?19:13,lf=moving&&p.vx<0;
    const top=GROUND+1-m.ground,lx=Math.round(p.x-(lf?(m.w-1-bodyC):bodyC));ctx.drawImage(lf&&adjoL?adjoL:adjoImg,m.x,0,m.w,m.h,lx,top,m.w,m.h);}
  else{const ch=CHARS[p.ch]||CHARS.girl;let s;
    if(moving&&ch.ride){const fr=ch.ride[p.vx<0?'left':'right'];s=fr[((p.dist/9)|0)%4];ctx.drawImage(s,Math.round(p.x-s.width/2),GROUND-s.height-3);}
    else{const set=ch.set[moving?(p.vx<0?'left':'right'):'down'];s=moving?set.walk[((p.dist/8)|0)%4]:set.idle[((time*1.5)|0)%2];ctx.drawImage(s,Math.round(p.x-s.width/2),GROUND-s.height+1);}
    if(p.ch==='girl'&&!p.down){for(let k=0;k<3;k++){const a=time*5+k*2.1,sy=((time*30+k*9)%14);ctx.fillStyle=k%2?'#9cd1f8':'#dcefff';ctx.fillRect(Math.round(p.bx-8+k*8+Math.sin(a)*2),Math.round(p.by+6+sy),1,1);}}}
  ctx.restore();
  if(p.stun>0){for(let i=0;i<3;i++){const a=time*6+i*2.1;ctx.fillStyle='#fff6a0';ctx.fillRect(Math.round(p.x+Math.cos(a)*9),Math.round(GROUND-30+Math.sin(a)*3),2,2);}}
  if(p.slip>0){ctx.fillStyle='#d9c79a';for(let i=0;i<3;i++)ctx.fillRect(Math.round(p.x-p.slipDir*(6+i*4)),GROUND-1-(i%2),2,1);}}
function drawBowl(p){ctx.save();ctx.translate(p.bx,p.by);ctx.rotate(p.th);
  ctx.fillStyle='#2a1d14';ctx.beginPath();ctx.moveTo(-24,-15.5);BOWL.forEach(([x,y])=>ctx.lineTo(x*1.05,y+3.2));ctx.lineTo(24,-15.5);for(let i=BOWL.length-1;i>=0;i--)ctx.lineTo(BOWL[i][0],BOWL[i][1]);ctx.closePath();ctx.fill();
  ctx.fillStyle='#8a5a2b';ctx.beginPath();ctx.moveTo(-23,-14.6);BOWL.forEach(([x,y])=>ctx.lineTo(x,y+2.2));ctx.lineTo(23,-14.6);for(let i=BOWL.length-1;i>=0;i--)ctx.lineTo(BOWL[i][0],BOWL[i][1]+.4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e0b876';for(let x=-20;x<=20;x+=3){ctx.fillRect(x,surfY(x)+.4,1.5,1.2);}ctx.fillStyle='#b98a4c';ctx.fillRect(-24,-16,3,2);ctx.fillRect(21,-16,3,2);ctx.restore();}
function drawBody(b,time){const t=IT[b.k],sp=S[t.s];
  if((HEAVY[b.k]||b.k==='pebble')&&b.free){const p=Math.max(0,Math.min(1,(b.y-CANOPY)/(GROUND-CANOPY))),w=Math.round(3+p*(sp.width+2));ctx.fillStyle='rgba(30,40,20,'+(.25+.35*p)+')';ctx.fillRect(Math.round(b.x-w/2),GROUND-1,w,2);}
  drawSprite(sp,b.x,b.y,t.fruit||b.k==='rotten'?b.ang:0);
  if(b.k==='rotten'){for(let i=0;i<3;i++){const a=time*9+i*2.1+b.x;ctx.fillStyle='#1c1c1c';ctx.fillRect(Math.round(b.x+Math.cos(a)*7),Math.round(b.y+Math.sin(a*1.3)*5),1,1);}}
  if(b.k==='gold'&&((time*8)|0)%2){ctx.fillStyle='#fff';ctx.fillRect(Math.round(b.x-6),Math.round(b.y-1),1,1);ctx.fillRect(Math.round(b.x+5),Math.round(b.y+2),1,1);}}
const NAMES=['P1','P2'];
function draw(){const V=viewState(),now=performance.now()/1000;ctx.save();ctx.setTransform(3,0,0,3,0,0);
  if(!V){ctx.drawImage(bg,0,0);ctx.drawImage(canopy,0,-6);ctx.fillStyle='rgba(10,20,15,.55)';ctx.fillRect(0,0,W,H);txt(role==='client'?'Waiting for the host…':'Get ready…',W/2,90,'#fff',9,'center');ctx.restore();return;}
  const time=V.t!=null?V.t:V.time,shake=V.shake||0;
  if(shake>0)ctx.translate(Math.round((Math.random()-.5)*4),Math.round((Math.random()-.5)*3));
  ctx.drawImage(bg,0,0);
  if(mode==='vs'){txt('P1 CRATE',12,GROUND-20,'#fff0a0',5,'center');txt('P2 CRATE',W-12,GROUND-20,'#fff0a0',5,'center');}
  else{txt('CRATE',12,GROUND-20,'#fff0a0',6,'center');txt('CRATE',W-12,GROUND-20,'#fff0a0',6,'center');}
  for(const pe of V.peels)if(pe.t>2||((pe.t*8)|0)%2)ctx.drawImage(S.peel,Math.round(pe.x-5),GROUND-4);
  if(V.crow){const c=V.crow,sp=((c.f*10)|0)%2?S.crow1:S.crow2;if(c.ph!=='leave'){const w=c.ph==='swoop'?14:9;ctx.fillStyle='rgba(30,30,40,.35)';ctx.fillRect(Math.round(c.x+6-w/2),GROUND-1,w,2);}
    ctx.save();ctx.translate(Math.round(c.x+6),Math.round(c.y));if(c.dir<0)ctx.scale(-1,1);ctx.drawImage(sp,-6,0);ctx.restore();if(c.carry)drawSprite(S[IT[c.carry].s],c.x+6,c.y+10,0);}
  for(const b of V.birds)ctx.drawImage(((b.f*8)|0)%2?S.bird1:S.bird2,Math.round(b.x),Math.round(b.y));
  if(state!=='title'){for(const p of V.players){drawAvatar(p,time);drawBowl(p);}
    if(V.players.length>1)for(const p of V.players){if(p.down)continue;txt(NAMES[p.i]+(p.i===me?' (you)':''),p.x,GROUND-52+(p.ch==='girl'?-10:0),p.i===0?'#9ae0ff':'#ffb08a',5,'center');}}
  for(const b of V.bodies)drawBody(b,time);
  for(const f of V.flyers){const sp=f.k==='bee'?(((f.ph*20)|0)%2?S.bee1:S.bee2):S.poop;ctx.drawImage(sp,Math.round(f.x),Math.round(f.y));}
  for(const f of G.fx){ctx.fillStyle=f.col;ctx.fillRect(Math.round(f.x),Math.round(f.y),1,1);}
  const wind=V.w!=null?V.w:V.wind,wd=V.wd!=null?V.wd:V.windDir,ww=V.ww!=null?V.ww:V.windWarn;
  if(wind>0){ctx.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<14;i++){const yy=(i*37)%120+30,xx=((i*71+time*260*wd)%W+W)%W;ctx.fillRect(Math.round(xx),yy,10,1);}}
  ctx.drawImage(canopy,0,-6);
  for(const w of V.warns){const j=Math.round(Math.sin(time*60)*1.5);ctx.fillStyle='#2f6b2e';ctx.fillRect(Math.round(w.x-10+j),30,20,5);ctx.fillStyle='#5aa04a';
    for(let i=0;i<5;i++){const fy=32+((time*40+i*9)%30),fx=w.x-8+((i*7)%16)+Math.sin(time*8+i)*2;ctx.fillRect(Math.round(fx),Math.round(fy),2,1);}txt('!',w.x,46,'#ff6a6a',10,'center');}
  for(const p of G.pops)txt(p.txt,Math.round(p.x),Math.round(p.y-p.t*14),p.col,7);
  // CPR helper: beat heart + A/B prompt near a downed teammate
  if(mode==='coop'&&state==='play'){const bt=V.bt!=null?V.bt:V.beatT;for(const p of V.players)if(p.down){const ph=(bt%CPR_BEAT)/CPR_BEAT,pulse=ph<.18;
      const x=Math.round(p.x),y=GROUND-40;ctx.fillStyle=pulse?'#ff6a8a':'#b8485a';ctx.fillRect(x-4,y,3,3);ctx.fillRect(x+1,y,3,3);ctx.fillRect(x-4,y+2,8,3);ctx.fillRect(x-3,y+5,6,2);ctx.fillRect(x-1,y+7,2,1);
      txt(`CPR ${p.cpr}/8`,x,y-5,'#fff',6,'center');const mate=V.players.find(q=>q!==p);if(mate&&mate.i===me)txt(Math.abs(mate.x-p.x)<24?'A, B, A, B on the beat!':'go to your teammate!',x,y-13,'#fff6c8',5,'center');}}
  if(splatT>0){const a=Math.min(1,splatT/.8);ctx.fillStyle=`rgba(245,245,235,${.92*a})`;for(const s of splats){for(let j=-s.r;j<=s.r;j+=2)for(let i=-s.r;i<=s.r;i+=2)if(i*i+j*j<=s.r*s.r*(.7+.3*Math.sin(i*.7+j*.5)))ctx.fillRect(s.x+i,s.y+j,2,2);}}
  ctx.restore();ctx.save();ctx.setTransform(3,0,0,3,0,0);
  if(state!=='title'){const mp=V.players[me]||V.players[0];
    for(const p of V.players){const x0=p.i===0?16:W-44;for(let i=0;i<3;i++)ctx.drawImage(i<p.hearts?S.heartUI:S.heartOff,x0+i*9,6);if(V.players.length>1)txt(NAMES[p.i],x0-10,11,p.i===0?'#9ae0ff':'#ffb08a',6);}
    const sc=V.sc||[0,0];
    if(mode==='vs'){txt(`${sc[0]}`,W/2-30,13,'#9ae0ff',9,'right');txt(`${sc[1]}`,W/2+30,13,'#ffb08a',9,'left');}
    else{ctx.fillStyle='rgba(20,40,70,.85)';ctx.fillRect(W/2+26,3,62,13);txt(String(sc[0]).padStart(6,'0'),W/2+84,13,'#fff',9,'right');}
    const left=Math.max(0,ROUND-time);txt(`${(left/60|0)}:${String(left%60|0).padStart(2,'0')}`,W/2,13,time>ROUND-15?'#ff9aa0':'#fff',9,'center');
    let n=0;for(const b of V.bodies)if(b.inB===mp.i&&IT[b.k].fruit)n++;
    if(n)txt(`bilao: ${n} fruit  x${Math.min(3,1+.15*(n-1)).toFixed(2)}`,6,34,'#ffffff',7);
    {const w=mp.wt||0;txt('weight',6,45,'#ffffff',6);ctx.fillStyle='#1a1a1a';ctx.fillRect(32,40,42,6);ctx.fillStyle=w<.5?'#8fd88a':w<.8?'#f2c56b':'#ff7a6a';ctx.fillRect(33,41,Math.round(40*w),4);if(w>.8)txt('HEAVY',78,45,'#ff9aa0',6);}
    if(mode==='vs'&&mp.ammo)txt(`peels: ${mp.ammo}  (A to drop)`,6,56,'#fff0a0',6);
    if(ww||wind>0)txt(wd>0?'WIND  >>>':'<<<  WIND',W/2,26,'#d8f0ff',8,'center');
    if(time>ROUND-15&&state==='play')txt('FRUIT STORM!',W/2,38,'#ffd36a',9,'center');
    if(mp.down&&mode==='coop')txt('You are down! Your teammate can revive you.',W/2,74,'#ff9aa0',7,'center');}
  if(state==='title'){ctx.fillStyle='rgba(10,20,15,.55)';ctx.fillRect(0,0,W,H);txt('FRUIT CATCH',W/2,52,'#fff0a0',16,'center');
    txt('catch fruit in the bilao, keep it balanced',W/2,72,'#fff',7,'center');txt('run to a CRATE at either edge to bank it',W/2,84,'#fff',7,'center');
    txt('hold TILT (Item) to tip your bilao',W/2,96,'#fff',7,'center');
    txt(role==='client'?'waiting for the host…':'tap / press A to start',W/2,116,'#d8f0a0',8,'center');if(CM.best.fruit)txt('best: '+CM.best.fruit,W/2,132,'#ffffff',7,'center');}
  if(state==='over'){ctx.fillStyle='rgba(10,20,15,.6)';ctx.fillRect(0,0,W,H);const win=G.win;
    txt(win?"TIME'S UP!":'GAME OVER',W/2,40,win?'#fff0a0':'#ff9aa0',16,'center');const sc=V.sc||[0,0];
    if(mode==='vs'){txt(`P1 ${sc[0]}   —   P2 ${sc[1]}`,W/2,60,'#fff',10,'center');txt(sc[0]===sc[1]?'DRAW!':(sc[0]>sc[1]?'P1':'P2')+' WINS!',W/2,74,'#ffd36a',10,'center');}
    else txt('score '+sc[0],W/2,62,'#fff',9,'center');
    txt(`biggest load ${G.bestLoad}   spilled ${G.spilled}`,W/2,88,'#d8f0a0',7,'center');
    const rw=G.reward||{},keys=Object.keys(rw);txt(keys.length?'to your bag: '+keys.map(k=>`${({mango:'mango',guava:'guava',cala:'calamansi',banana:'banana',melon:'watermelon',gold:'golden mango'})[k]} ×${rw[k]}`).join(', '):'no fruit banked',W/2,102,'#fff0a0',6,'center');
    txt(role==='client'?'B: leave':'A: play again    B: leave',W/2,128,'#fff',7,'center');}
  ctx.restore();}

/* =================== input + loop =================== */
let keysDown={},touchX=null,tiltHeld=0,aPresses=0,bPresses=0,padEls=[];
const onKey=e=>{const c=e.code;if(e.type==='keydown'){if(e.repeat)return;keysDown[c]=1;
    if(['KeyJ','KeyX','Space','Enter'].includes(c))pressA();if(['KeyK','KeyZ'].includes(c))pressB();if(['KeyQ','KeyI','ShiftLeft','ShiftRight'].includes(c))tiltHeld=1;}
  else{keysDown[c]=0;if(['KeyQ','KeyI','ShiftLeft','ShiftRight'].includes(c))tiltHeld=0;}
  if(c.startsWith('Arrow')||c==='Space')e.preventDefault();};
function pressA(){ainit();if(state==='title'&&role!=='client'){startRound();return;}if(state==='over'){if(role!=='client'){if(role==='host'&&window.MP)MP.send('fc_again',{});startRound();}return;}aPresses++;}
function pressB(){if(state==='over'){leave();return;}bPresses++;}
function localInput(){const dir=(keysDown.ArrowRight||keysDown.KeyD?1:0)-(keysDown.ArrowLeft||keysDown.KeyA?1:0);const inp={dir,tx:touchX,tilt:tiltHeld,a:aPresses,b:bPresses};aPresses=0;bPresses=0;return inp;}
function startRound(){reset(chars);state='play';mNext=0;mStep=0;splatT=0;snapA=snapB=null;}
let chars=['adjo'],tick=0;
function leave(){if(window.MP&&MP.connected&&role!=='local')MP.send('fc_leave',{});mgClose();}
const game={
  init(host){[cv,ctx]=mgCanvas(W,H,3);ainit();lt=performance.now();
    cv.addEventListener('pointerdown',e=>{ainit();if(state!=='play'){pressA();return;}const r=cv.getBoundingClientRect();touchX=(e.clientX-r.left)/r.width*W;cv.setPointerCapture(e.pointerId);});
    cv.addEventListener('pointermove',e=>{if(touchX!==null){const r=cv.getBoundingClientRect();touchX=(e.clientX-r.left)/r.width*W;}});
    for(const n of['pointerup','pointercancel'])cv.addEventListener(n,()=>{touchX=null;});
    const pa=mgPad('A',mode==='vs'?'peel / start':mode==='coop'?'CPR / steady':'start',{right:'16px',bottom:'20px',background:'#4fa85a'},'sm');
    const pt=mgPad('⤵','tilt (hold)',{right:'16px',bottom:'112px',background:'#4a7fd0'},'sm');
    const pads=[[pa,()=>pressA()],[pt,()=>{tiltHeld=1;},()=>{tiltHeld=0;}]];
    if(mode==='coop'){const pb=mgPad('B','CPR',{right:'96px',bottom:'20px',background:'#d8873a'},'sm');pads.push([pb,()=>pressB()]);}
    else{const pb=mgPad('B','leave',{right:'96px',bottom:'20px',background:'#d8873a',opacity:.75},'sm');pads.push([pb,()=>{if(state!=='play')leave();else pressB();}]);}
    for(const[el,dn,upf]of pads){el.style.pointerEvents='auto';el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('on');ainit();dn();});
      for(const n of['pointerup','pointercancel','pointerleave'])el.addEventListener(n,()=>{el.classList.remove('on');if(upf)upf();});}
    addEventListener('keydown',onKey);addEventListener('keyup',onKey);
    if(role!=='local'){state='title';if(role==='host')setTimeout(()=>{if(MG===game)startRound();},1200);}},
  update(){const dt=1/60;
    for(const f of G?G.fx:[]){f.t+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=220*dt;}if(G){G.fx=G.fx.filter(f=>f.t<.5);for(const p of G.pops)p.t+=dt;G.pops=G.pops.filter(p=>p.t<1.1);}
    if(splatT>0)splatT-=dt;
    if(role==='client'){tick++;if(tick%2===0&&window.MP)MP.send('fc_in',localInput());return;}
    if(state!=='play')return;
    {const li=localInput(),p=G.players[me];p.in.dir=li.dir;p.in.tx=li.tx;p.in.tilt=li.tilt;p.in.a+=li.a;p.in.b+=li.b;}
    sim(dt);music(G.time);
    if(role==='host'){tick++;if(tick%3===0||state==='over')MP.send('fc_state',snapshot());}else events.length=0;},
  draw(){if(role==='client'&&state==='play'&&G)music(G.time);draw();},
  back(){if(state==='play'&&role!=='client')ask('Leave Fruit Catch?','You lose the fruit that is not banked yet.',[['Leave',leave],['Keep playing',null,'cur']]);else leave();},
  end(){removeEventListener('keydown',onKey);removeEventListener('keyup',onKey);stopSound();G=null;state='title';},
};
/* ---------- public API ---------- */
window.FRUIT={
  start(m,r,myIndex,charList){mode=m;role=r;me=myIndex||0;chars=charList||[pl.char];G=null;state=role==='local'?'title':'title';events=[];if(role==='local')reset(chars);mgOpen(game);},
  onState(s){if(MG===game&&role==='client')onSnapshot(s);},
  onInput(inp){if(MG===game&&role==='host'&&G&&G.players[1]){const p=G.players[1];p.in.dir=inp.dir;p.in.tx=inp.tx;p.in.tilt=inp.tilt;p.in.a+=inp.a||0;p.in.b+=inp.b||0;}},
  onAgain(){if(MG===game&&role==='client'){state='title';G=null;snapA=snapB=null;}},
  onLeave(){if(MG===game){say('Your partner left Fruit Catch.');mgClose();}},
  get running(){return MG===game;},
  _dbg:{get G(){return G},get state(){return state},drop:(k,x)=>{addBody(k,x??G.players[0].bx,CANOPY,0,0);},noSpawn:()=>{if(G)G.spawnT=1e9;},sim:(n)=>{for(let i=0;i<n;i++)sim(1/60);}},
};
})();
/* the big mango tree in Sunny Meadow (tree at tile 12,9) starts Fruit Catch */
addSpot('meadow',{x:12*TS-22,y:9*TS-6,w:60,h:34},()=>{
  const btns=[['Solo',()=>FRUIT.start('solo','local',0,[pl.char]),'cur']];
  if(window.MP&&MP.connected){btns.push(['Co-op',()=>MP.invite('fruit','coop')]);btns.push(['Versus',()=>MP.invite('fruit','vs')]);}
  btns.push(['Not now',null]);
  ask('The big mango tree','Play <b>Fruit Catch</b>? Catch fruit in your bilao and bank it in a crate.'+(window.MP&&MP.connected?'':'<br><small>Connect with a friend in Multiplayer (⇄) for Co-op or Versus.</small>'),btns);},'A: Fruit Catch');
