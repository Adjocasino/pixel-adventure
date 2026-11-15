/* Golden gifts (Cottage Meadow).
   - Give a cat (Cotton, Collete, Precious) anything golden: a Gold-tier fish, a golden mango, a gold or golden egg.
     She stands up and does the whole trending cat clip: grin + wide claps, grin vanishes, licks her paw,
     looks up, big arm swoosh. Art: tools/cat_clap.py -> clap_<cat>.png (30x32 frames, ORDER below).
   - Give Jao a golden (Gold-tier) fish: he "ascends" into his vape smoke with gold sparkles to an original
     flute piece, then comes back like nothing happened (see market.js, JAO_ASCEND).
   The golden item is used up. Works any time. */
(function(){
const ORDER=["open","mid","clap","rub","clasp","groom1","groom2","curl","swoosh1","swoosh2","swoosh2b","up"];
const TL=[[0,120],[1,70],[2,110],[3,160],[1,70],[0,120],[1,70],[2,110],[3,160],[1,70],[0,120],[1,70],[2,110],[3,160],[1,70],[0,120],[1,70],[2,110],[3,160],[1,70],[0,120],[1,70],[2,110],[3,160],[1,70],[4,420],[5,200],[6,200],[5,200],[6,200],[5,200],[6,200],[4,150],[7,550],[8,160],[9,700],[10,140],[9,650]];
const UP=ORDER.indexOf('up'),INTRO=500,OUTRO=900,TL_MS=TL.reduce((a,x)=>a+x[1],0),TOTAL=INTRO+TL_MS+OUTRO;
const IMG={};for(const c of['cotton','collete','precious']){const im=new Image();im.src='clap_'+c+'.png';IMG[c]=im;}
const NAME={cotton:'Cotton',collete:'Collete',precious:'Precious'};

/* golden things you own: [store, key] */
function goldens(){const out=[];
  for(const k in CM.inv)if(CM.inv[k]>0&&(/^fish:.*:GOLD$/.test(k)||k==='fruit:gold'))out.push([CM.inv,k]);
  for(const k in CM.barn)if(CM.barn[k]>0&&(k==='egg:gold'||k==='egg:golden'))out.push([CM.barn,k]);
  const val=([s,k])=>window.MARKET?MARKET.basePrice(k):1;return out.sort((a,b)=>val(a)-val(b));}   // cheapest golden thing first
window.GIFT={goldens};

/* ---------- sounds ---------- */
let pops=[];
function A(){return gameAC();}
function nb(ac,sec){const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
function clapS(){const ac=A();if(!ac)return;const t=ac.currentTime;for(const[o,v]of[[0,.4],[.011,.28],[.023,.36]]){const n=ac.createBufferSource();n.buffer=nb(ac,.2);const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1250;f.Q.value=1.1;
  const q=ac.createGain();q.gain.setValueAtTime(v,t+o);q.gain.exponentialRampToValueAtTime(.001,t+o+(o>.02?.16:.03));n.connect(f);f.connect(q);q.connect(gameMaster());n.start(t+o);n.stop(t+o+.2);}}
function note(f,d,v,type,at=0){const ac=A();if(!ac)return;const t=ac.currentTime+at,o=ac.createOscillator(),q=ac.createGain();o.type=type||'square';o.frequency.value=f;q.gain.setValueAtTime(v,t);q.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(q);q.connect(gameMaster());o.start(t);o.stop(t+d+.02);}
function whoosh(){const ac=A();if(!ac)return;const t=ac.currentTime,n=ac.createBufferSource();n.buffer=nb(ac,.4);const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=1.5;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(2200,t+.25);
  const q=ac.createGain();q.gain.setValueAtTime(0,t);q.gain.linearRampToValueAtTime(.25,t+.08);q.gain.linearRampToValueAtTime(0,t+.3);n.connect(f);f.connect(q);q.connect(gameMaster());n.start(t);n.stop(t+.4);}
function sparkle(){[1568,2093,2637,3136].forEach((f,i)=>note(f,.25,.04,'triangle',i*.06));}
function jingle(){[[784,0],[988,.12],[1175,.24],[1568,.36]].forEach(([f,o])=>note(f,.2,.06,'square',o));note(2093,.5,.05,'triangle',.5);}

/* ---------- cats ---------- */
const actCat=PET_ACT.cat,updC=PET_UPD.cat,drawC=PET_DRAW.cat;
PET_ACT.cat=function(p){
  if(p.perch||p.st==='hop'||p.clap)return actCat(p);
  const g=goldens()[0];if(!g)return actCat(p);
  const[store,k]=g,nm=NAME[p.cat]||'The cat';
  ask(nm,`You have something golden: <b>${itemName(k)}</b>. Give it to ${nm}?<br><small>She will love it. (The item is used up.)</small>`,
    [['Give it',()=>{addItem(store,k,-1);cmSave();p.clap={t:0,last:-1};p.path=[];p.st='rest';p.t=9999;sparkle();say(`You give ${nm} the ${itemName(k)}…`);}, 'cur'],
     ['Just pet',()=>actCat(p)]]);};
PET_UPD.cat=function(p){if(!p.clap)return updC(p);
  const c=p.clap;c.t++;const ms=c.t*1000/60;
  if(ms>=TOTAL){p.clap=null;p.st='rest';p.t=rr(400,900);say(`${NAME[p.cat]} sits back down, very proud of herself.`);return;}
  if(ms>=INTRO&&ms<INTRO+TL_MS){let a=INTRO,k=0;for(;k<TL.length;k++){if(ms<a+TL[k][1])break;a+=TL[k][1];}
    if(k!==c.last){c.last=k;const nm=ORDER[TL[k][0]],prev=k?ORDER[TL[k-1][0]]:'';
      if(nm==='clap'){clapS();pops.push({x:p.x+(k%2?8:-10),y:p.y-34,t:0,txt:'CLAP'});}
      else if(nm==='clasp'&&prev==='mid')say(`${NAME[p.cat]}: ...`);
      else if(nm==='groom1'){note(620,.07,.05,'sine');note(520,.07,.04,'sine',.07);if(prev==='clasp')say(`${NAME[p.cat]} licks her paw like nothing happened.`);}
      else if(nm==='curl')note(880,.08,.04,'triangle');
      else if(nm==='swoosh1')whoosh();
      else if(nm==='swoosh2'&&prev==='swoosh1'){note(196,.5,.07,'square');note(98,.6,.06,'triangle');pops.push({x:p.x-16,y:p.y-12,t:0,txt:'ayy'});}}}
  if(ms>=INTRO+TL_MS&&!c.end){c.end=1;jingle();if(window.heartsAt)heartsAt(p.x,p.y,24);}};
PET_DRAW.cat=function(p,cx,cy){if(!p.clap)return drawC(p,cx,cy);const im=IMG[p.cat];if(!im||!im.complete)return drawC(p,cx,cy);
  const ms=p.clap.t*1000/60;let fr=UP;
  if(ms<120)return drawC(p,cx,cy);
  if(ms>=INTRO&&ms<INTRO+TL_MS){let a=INTRO;for(const[f,d]of TL){if(ms<a+d){fr=f;break;}a+=d;}}
  const x=Math.round(p.x-cx),y=Math.round(p.y-cy);
  const s=shadowC(7,2);ctx.drawImage(s,x-7,y-2);
  ctx.drawImage(im,fr*30,0,30,32,x-15,y-31,30,32);};
HOOKS.extraOverlay.push((cx,cy)=>{if(!pops.length)return;
  for(const q of pops){q.t++;const a=Math.max(0,1-q.t/30);wtxt(q.txt,Math.round(q.x-cx),Math.round(q.y-cy-q.t*.5),`rgba(255,224,122,${a.toFixed(2)})`,6);}
  pops=pops.filter(q=>q.t<30);});
})();
