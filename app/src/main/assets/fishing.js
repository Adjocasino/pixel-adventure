/* Mirror Lake rhythm fishing (ported from demos/fishing_rhythm.html).
   A = top lane, B = bottom lane. 120 -> 200 BPM over exactly 100 notes. 8-bit music.
   Catch chart (user's design): the score band picks a fish pair, the % inside the band picks the tier (Iron..Gold). */
const FISH_ORDER=['Tilapia','Bangus','Hito','Dalag','Karpa','Tawilis','Ayungin','Gurami','Igat','Janitor fish'];
const FISH_IMG=new Image();FISH_IMG.src='fish_sheet.png';
const FISH_BANDS=[  // [min%, max%, fish pair, tier cut-offs (lowest % of each tier)]
  [0,49,['Janitor fish','Ayungin'],[0,10,20,30,40]],
  [50,69,['Tilapia','Tawilis'],[50,54,58,62,66]],
  [70,84,['Hito','Gurami'],[70,73,76,79,82]],
  [85,94,['Dalag','Bangus'],[85,87,89,91,93]],
  [95,100,['Karpa','Igat'],[95,96,97,98,100]]];
function fishFor(pct){const b=FISH_BANDS.find(b=>pct>=b[0]&&pct<=b[1])||FISH_BANDS[0];let tier=0;for(let i=0;i<5;i++)if(pct>=b[3][i])tier=i;
  return{name:b[2][Math.random()<.5?0:1],tier:TIERS[tier],tierI:tier};}

function makeFishing(){
  const W=320,H=180;let cv,ctx,AC=null,master=null,pads=[];
  function audio(){if(AC)return;AC=gameAC();if(!AC)return;master=AC.createGain();master.gain.value=.55;master.connect(gameMaster());}
  function osc(type,f,t,d,v,f2){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02);live.push(o);}
  let NB=null;const live=[];
  function nz(t,d,v,hp){if(!AC)return;if(!NB){NB=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
    const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+.02);live.push(s);}
  function stopSound(){for(const n of live){try{n.stop();}catch(e){}}live.length=0;}
  const hz=n=>440*Math.pow(2,(n-69)/12);
  // ---- chart
  const BPM0=120,BPM1=200,INTRO=2;
  const PAT=['a.b.a.b.','aab.a.bb','X.a.b.a.','a.a.bba.','b.X.b.aa','abab.a..','X...X...','a.b.abab','b.b.a.a.','aba.bab.','X.ab.Xa.','abbaabba'];
  function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
  function buildChart(seed){const r=rng(seed),pats=[];let count=0;
    while(count<100){const bar=pats.length,pool=bar<3?[0,6,8]:bar<8?[0,1,2,3,4,8,10]:[1,2,4,5,7,9,10,11];const p=PAT[pool[(r()*pool.length)|0]];
      const ev=[];for(let s=0;s<8&&count<100;s++){const c=p[s];if(c==='a'||c==='b'){ev.push([s,c]);count++;}
        else if(c==='X'){if(count<=98){ev.push([s,'X']);count+=2;}else{ev.push([s,'a']);count++;}}}
      pats.push(ev);}
    const nb=pats.length,total=INTRO+nb+1,bpm=[],start=[];let t=0;
    for(let b=0;b<total;b++){const i=b-INTRO,k=nb>1?Math.min(1,Math.max(0,i/(nb-1))):0;bpm[b]=b<INTRO?BPM0:Math.round(BPM0+(BPM1-BPM0)*k);start[b]=t;t+=4*60/bpm[b];}
    const notes=[];pats.forEach((ev,i)=>{const b=INTRO+i,sl=30/bpm[b];for(const[sx,c]of ev){const tt=start[b]+sx*sl;
      if(c==='X'){notes.push({t:tt,lane:'b',dbl:1,bar:b});notes.push({t:tt,lane:'a',dbl:1,bar:b});}else notes.push({t:tt,lane:c,bar:b});}});
    return{notes,bars:nb,bpm,start,total,end:t,introEnd:start[INTRO]};}
  function bpmAt(tn){if(!chart)return BPM0;let b=0;while(b+1<chart.total&&chart.start[b+1]<=tn)b++;return chart.bpm[b];}
  const PROG=[[48,52,55],[45,48,52],[41,45,48],[43,47,50]],SCALE=[0,2,4,7,9],TOP='a';
  function scheduleSong(t0,chart){const total=chart.total;
    for(let b=0;b<total;b++){const bt=t0+chart.start[b],ch=PROG[b%4],BEAT=60/chart.bpm[b],SL=BEAT/2;
      for(let q=0;q<4;q++){const t=bt+q*BEAT;osc('sine',150,t,.12,.9,45);if(q%2)nz(t,.09,.35,1500);}
      for(let e=0;e<8;e++){const t=bt+e*SL;nz(t,.025,b<INTRO?.12:.08,7000);if(b>=INTRO)osc('sawtooth',hz(ch[e%3]-12),t,.1,.06);}
      if(b<INTRO){osc('square',hz(72),bt,.08,.12);osc('square',hz(72),bt+BEAT,.08,.08);osc('square',hz(72),bt+BEAT*2,.08,.08);osc('square',hz(79),bt+BEAT*3,.12,.14);}}
    chart.notes.forEach((n,i)=>{const b=n.bar%4,root=PROG[b][0]+24,deg=SCALE[(i*3+(n.lane===TOP?2:0))%5];osc('square',hz(root+deg+(n.lane===TOP?12:0)),t0+n.t,.09,.09);});
    return t0+chart.end;}
  function hitSfx(j){if(!AC)return;const t=AC.currentTime;if(j==='miss'){nz(t,.06,.15,200);return;}osc('triangle',j==='perfect'?1320:j==='great'?990:760,t,.05,.18);}
  // ---- state
  const RANKS=[{n:'IRON',c:['#5d616b','#8a8f9a','#3e4149'],s:'#b7bcc6'},{n:'BRONZE',c:['#a4612c','#d18a4e','#6e3d18'],s:'#f2b47a'},
    {n:'SILVER',c:['#aeb8c4','#e2e8ef','#7d8794'],s:'#ffffff'},{n:'PLATINUM',c:['#bfe6f2','#f2fcff','#86b8cc'],s:'#ffffff'},{n:'GOLD',c:['#e3a92a','#ffe07a','#a8721a'],s:'#fff6c8'}];
  const WIN={perfect:.05,great:.09,good:.13},PTS={perfect:1,great:.75,good:.4,miss:0};
  let state='dock',T=0,chart,t0=0,score=0,combo=0,maxCombo=0,judg=null,cnt={},fx=[],trans=0,result=null,pressFlash={a:0,b:0},seed=(Math.random()*1e6)|0;
  const now=()=>AC?AC.currentTime-t0:0;
  function startSong(){audio();if(!AC){state='dock';return;}if(AC.state==='suspended')AC.resume();chart=buildChart(seed++);t0=AC.currentTime+.6;scheduleSong(t0,chart);
    score=0;combo=0;maxCombo=0;judg=null;cnt={perfect:0,great:0,good:0,miss:0};fx=[];state='play';}
  function judge(n,j){n.done=j;cnt[j]++;score+=PTS[j];if(j==='miss')combo=0;else{combo++;maxCombo=Math.max(maxCombo,combo);}
    judg={j,t:T,lane:n.lane};hitSfx(j);if(j!=='miss')fx.push({x:HITX,y:LANEY[n.lane],t:0,j});}
  function press(l){pressFlash[l]=8;
    if(state==='dock'){if(l==='a'){state='enter';trans=0;audio();if(AC)osc('triangle',660,AC.currentTime,.15,.2,990);}else mgClose();return;}
    if(state==='result'){if(l==='a'){state='enter';trans=0;}else mgClose();return;}
    if(state!=='play')return;const tn=now();let best=null;
    for(const n of chart.notes){if(n.done||n.lane!==l)continue;const d=Math.abs(n.t-tn);if(d<=WIN.good&&(!best||d<Math.abs(best.t-tn)))best=n;if(n.t-tn>WIN.good)break;}
    if(best){const d=Math.abs(best.t-tn);judge(best,d<=WIN.perfect?'perfect':d<=WIN.great?'great':'good');}}
  function finish(){const pct=Math.round(score),f=fishFor(pct);result={pct,fish:f,rank:RANKS[f.tierI],cnt:{...cnt},maxCombo};state='result';T=0;
    addItem(CM.inv,`fish:${f.name}:${f.tier}`);CM.best.fish=Math.max(CM.best.fish||0,pct);cmSave();
    if(AC){const t=AC.currentTime;[0,4,7,12].forEach((d,i)=>osc('square',hz(72+d),t+i*.09,.18,.1));}}
  // ---- input
  const KEYB=['KeyF','KeyZ','ArrowDown','KeyD','KeyS','KeyK','ShiftLeft'],KEYA=['KeyJ','KeyX','ArrowUp','Space','Enter'];
  const onKey=e=>{if(e.repeat)return;if(KEYB.includes(e.code)){press('b');e.preventDefault();}else if(KEYA.includes(e.code)){press('a');e.preventDefault();}};
  // ---- drawing
  const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
  function txt(s,x,y,c='#fff',sz=8,al='center',sh='#1a1a2a'){ctx.font=`bold ${sz}px monospace`;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillStyle=sh;ctx.fillText(s,Math.round(x)+1,Math.round(y)+1);ctx.fillStyle=c;ctx.fillText(s,Math.round(x),Math.round(y));}
  function fish(x,y,c,sc=1,flip=1,t=0){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(sc*flip,sc);const P=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(a,b,w,h);};
    P(-7,-3,12,6,c[0]);P(-6,-4,10,1,c[0]);P(-6,3,10,1,c[2]);P(-5,-2,8,2,c[1]);P(5,-2,2,4,c[0]);P(7,-1,1,2,c[0]);const tw=Math.round(Math.sin(t/4));P(-10,-4+tw,3,3,c[2]);P(-10,1+tw,3,3,c[2]);P(-9,-1+tw,2,2,c[0]);
    P(-2,-5,4,1,c[2]);P(2,-1,1,1,'#1a1a2a');P(3,-2,1,1,'#fff');P(-4,1,6,1,c[2]);ctx.restore();}
  function speciesFish(name,x,y,sc,t){const i=FISH_ORDER.indexOf(name);if(i<0||!FISH_IMG.complete)return false;const fr=(t>>3)%2;
    ctx.drawImage(FISH_IMG,fr*48,i*28,48,28,Math.round(x-24*sc),Math.round(y-14*sc),48*sc,28*sc);return true;}
  function bubbleFish(x,y){ctx.fillStyle='#1d3a5c';ctx.beginPath();ctx.arc(Math.round(x),Math.round(y),8,0,7);ctx.fill();ctx.fillStyle='#5fc0e8';ctx.beginPath();ctx.arc(Math.round(x),Math.round(y),7,0,7);ctx.fill();
    ctx.fillStyle='#bdf0ff';ctx.fillRect(Math.round(x)-4,Math.round(y)-4,3,2);ctx.fillStyle='#2b6f9a';ctx.fillRect(Math.round(x)-3,Math.round(y)+1,6,1);ctx.fillStyle='#fff';ctx.fillRect(Math.round(x)+2,Math.round(y)-2,2,2);ctx.fillStyle='#1a1a2a';ctx.fillRect(Math.round(x)+3,Math.round(y)-1,1,1);}
  function leapFish(x,y,t){const b=Math.round(Math.sin(t/3+x/20)*2);ctx.fillStyle='#3a1d2a';ctx.beginPath();ctx.arc(Math.round(x),Math.round(y)+b,8,0,7);ctx.fill();fish(x,y+b,['#f07a5a','#ffb08a','#b44a3a'],1,-1,t);}
  const HITX=58,LANEY={a:62,b:128};
  function water(y0,t){for(let y=y0;y<H;y++){const k=(y-y0)/(H-y0);ctx.fillStyle=`rgb(${(40-k*20)|0},${(120-k*55)|0},${(160-k*40)|0})`;ctx.fillRect(0,y,W,1);}
    for(let i=0;i<14;i++){const x=(i*53+t*.3)%(W+20)-10,y=y0+6+((i*37)%(H-y0-10));R(x,y,6,1,'rgba(200,240,255,.25)');}}
  function sky(h,t){for(let y=0;y<h;y++){const k=y/h;ctx.fillStyle=`rgb(${(140+k*60)|0},${(200+k*30)|0},240)`;ctx.fillRect(0,y,W,1);}
    for(const[cx,cy,s]of[[60,18,1],[200,26,1.3],[280,14,.9]]){const x=(cx+t*.08*s)%(W+60)-30;ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillRect(x,cy,26*s,5);ctx.fillRect(x+5,cy-4,14*s,4);}}
  const hero=()=>{const ch=CHARS[pl.char];return ch.set.down.idle[0];};
  function drawDock(){sky(80,T);water(80,T);
    for(let x=0;x<60;x+=3)R(x,78+((x/3)%2),3,4,'#5e8f4a');R(0,82,58,98,'#4f7a3e');
    for(let x=40;x<200;x+=12){R(x,84,12,6,'#a0703f');R(x,84,12,1,'#c48d55');R(x+11,84,1,6,'#6e4a26');}R(40,90,160,2,'#5e3c24');
    for(const px of[52,100,148,196])R(px,90,4,18,'#5e3c24');
    const sx=214,sy=96,p=(Math.sin(T/10)+1)/2;ctx.strokeStyle=`rgba(255,255,255,${.4+p*.5})`;ctx.lineWidth=1;
    for(let r=0;r<3;r++){const rr=4+((T/3+r*8)%22);ctx.globalAlpha=1-rr/26;ctx.beginPath();ctx.ellipse(sx,sy,rr,rr*.4,0,0,7);ctx.stroke();}ctx.globalAlpha=1;
    for(let i=0;i<4;i++){const a=T/12+i*1.57;R(sx+Math.cos(a)*8,sy-6+Math.sin(a)*3,1,1,'#fff6c8');}
    const h=hero();ctx.drawImage(h,190-(h.width>>1),84-h.height);
    const bob=Math.round(Math.sin(T/8));R(205,48+bob,14,12,'#fff');txt('A',212,54+bob,'#2f7a3a',8,'center','#fff');R(210,60+bob,4,2,'#fff');
    txt('MIRROR LAKE — FISHING SPOT',W/2,12,'#fff',8);txt('Press A to cast your line   ·   B to leave',W/2,150,'#fff6c8',8);
    txt('100 notes · 120 → 200 BPM · A = top lane, B = bottom lane',W/2,164,'#cfe6f2',6);
    if(CM.best.fish)txt(`best: ${CM.best.fish}%`,W-6,24,'#cfe6f2',6,'right');}
  function drawPlay(){const tn=now();
    sky(84,T);water(84,T);R(0,84,W,1,'#d8f4ff');
    for(const l of['a','b']){const y=LANEY[l];ctx.fillStyle=l===TOP?'rgba(255,240,220,.18)':'rgba(10,40,70,.35)';ctx.fillRect(0,y-11,W,22);}
    R(4,96,40,6,'#a0703f');R(4,96,40,1,'#c48d55');R(4,101,40,1,'#5e3c24');const h=hero();ctx.drawImage(h,24-(h.width>>1),97-h.height);
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.moveTo(34,72);ctx.lineTo(HITX,LANEY[TOP]-14);ctx.stroke();
    for(const l of['a','b']){const y=LANEY[l],f=pressFlash[l];ctx.strokeStyle=l===TOP?'#ffcf9a':'#9ae0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(HITX,y,10+(f>0?2:0),0,7);ctx.stroke();ctx.lineWidth=1;
      if(f>0){ctx.fillStyle=`rgba(255,255,255,${f/16})`;ctx.beginPath();ctx.arc(HITX,y,10,0,7);ctx.fill();}txt(l.toUpperCase(),HITX,y,'#fff',8,'center','rgba(0,0,0,.4)');}
    const SPD=170;
    for(const n of chart.notes){if(n.done)continue;const x=HITX+(n.t-tn)*SPD;if(x>W+12)break;if(x<-12)continue;
      if(n.dbl&&n.lane===TOP){ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(Math.round(x),LANEY.a+8,1,LANEY.b-LANEY.a-16);}
      if(n.lane===TOP)leapFish(x,LANEY[n.lane],T);else bubbleFish(x,LANEY[n.lane]);}
    for(const n of chart.notes){if(!n.done&&tn-n.t>WIN.good)judge(n,'miss');}
    fx=fx.filter(f=>++f.t<16);for(const f of fx){const r=6+f.t;ctx.strokeStyle=f.j==='perfect'?`rgba(255,240,150,${1-f.t/16})`:`rgba(200,240,255,${1-f.t/16})`;ctx.beginPath();ctx.arc(f.x,f.y,r,0,7);ctx.stroke();}
    R(0,0,W,13,'rgba(10,20,30,.55)');txt(`${score.toFixed(1)}%`,W-6,7,'#fff6c8',8,'right');txt('FISHING',58,7,'#cfe6f2',8,'left');
    const prog=Math.max(0,Math.min(1,tn/(chart.start[chart.total-1])));R(110,5,140,3,'rgba(255,255,255,.2)');R(110,5,140*prog,3,'#9ae0ff');
    if(tn<chart.introEnd){const k=Math.ceil((chart.introEnd-tn)/(60/BPM0));if(tn>0)txt(k>4?'READY':String(Math.min(4,k)),W/2,44,'#fff',16);}
    {const bp=bpmAt(Math.max(0,tn));txt(`${bp} BPM`,W/2,22,bp>=180?'#ff9a7a':bp>=150?'#ffe07a':'#cfe6f2',7);}
    if(combo>=3)txt(`${combo} COMBO`,W/2+40,96,'#fff',10);
    if(judg&&T-judg.t<24){const c={perfect:'#ffe07a',great:'#9ae0ff',good:'#b6f0a0',miss:'#ff8a8a'}[judg.j];txt(judg.j.toUpperCase(),HITX+30,LANEY[judg.lane]-18-(T-judg.t)/4,c,8);}
    if(tn>chart.start[chart.total-1]+0.3)finish();}
  function drawResult(){const r=result,k=Math.min(1,T/30);sky(84,T);water(84,T);R(0,0,W,H,'rgba(10,16,28,.55)');
    txt('YOU CAUGHT A',W/2,18,'#cfe6f2',8);txt(`${r.fish.tier} ${r.fish.name.toUpperCase()}!`,W/2,32,r.rank.c[1],12);
    const fy=78+Math.round(Math.sin(T/10)*2);if(!speciesFish(r.fish.name,W/2,fy,Math.max(.2,3*k),T))fish(W/2,fy,r.rank.c,4*k,1,T);
    const sp=r.fish.tierI>=3?8:r.fish.tierI>=2?5:3;for(let i=0;i<sp;i++){const a=T/15+i*6.28/sp;R(W/2+Math.cos(a)*52,fy+Math.sin(a)*22,2,2,r.rank.s);}
    txt(`${r.pct}%`,W/2,118,'#fff',12);
    txt(`Perfect ${r.cnt.perfect}   Great ${r.cnt.great}   Good ${r.cnt.good}   Miss ${r.cnt.miss}   Max combo ${r.maxCombo}`,W/2,134,'#cfe6f2',6);
    txt('Added to your bag.',W/2,146,'#b6f0a0',6);
    txt('A: fish again    B: back to the lake',W/2,166,'#fff6c8',7);}
  return{
    init(host){[cv,ctx]=mgCanvas(W,H,1);audio();
      const pb=mgPad('B','bottom lane',{left:'18px',bottom:'22px',background:'#d8873a'}),pa=mgPad('A','top lane',{right:'18px',bottom:'22px',background:'#4fa85a'});pads=[pa,pb];
      for(const[el,l]of[[pa,'a'],[pb,'b']]){el.addEventListener('pointerdown',e=>{e.preventDefault();el.classList.add('on');press(l);});
        for(const ev of['pointerup','pointercancel','pointerleave'])el.addEventListener(ev,()=>el.classList.remove('on'));}
      addEventListener('keydown',onKey);},
    update(){},
    draw(){T++;for(const l in pressFlash)if(pressFlash[l]>0)pressFlash[l]--;ctx.clearRect(0,0,W,H);
      if(state==='dock')drawDock();
      else if(state==='enter'){drawDock();trans++;const r=trans*9;ctx.fillStyle='#0e1a24';ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(214,96,Math.max(0,300-r),0,7,true);ctx.fill();if(trans>34)startSong();}
      else if(state==='play')drawPlay();else if(state==='result')drawResult();},
    back(){if(state==='play'){ask('Stop fishing?','The fish will get away.',[['Stop',()=>{stopSound();mgClose();}],['Keep fishing',null,'cur']]);}else mgClose();},
    end(){removeEventListener('keydown',onKey);stopSound();},
    get state(){return state;},
    _finish(pct){score=pct;cnt={perfect:0,great:0,good:0,miss:0};finish();},
    get result(){return result;},
  };
}
// the end of the Mirror Lake dock (the plank tiles at x 31..32, y 11..17)
addSpot('lake',{x:31*TS-6,y:16*TS,w:2*TS+12,h:2*TS+8},()=>ask('Mirror Lake','Go fishing? Hit the notes with <b>A</b> (top lane) and <b>B</b> (bottom lane).',[['Start',()=>mgOpen(makeFishing()),'cur'],['Not now',null]]),'A: fish');
