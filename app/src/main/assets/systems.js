/* Cottage Meadow v1.0 systems: save data, bag + barn storage, panels/dialogs, Settings (music), minigame overlay host,
   world interactions and the hooks the main loop calls (HOOKS.*). Loaded after index.html's main script. */
const gameAC=()=>{audioInit();return AC;};
const gameMaster=()=>master;
const gameSfxBus=()=>sfxG;

/* ---------------- save data ---------------- */
const CM=(()=>{let d={};try{d=JSON.parse(localStorage.getItem('cmData')||'{}');}catch(e){}
  d.inv=d.inv||{};d.barn=d.barn||{};d.music=d.music||'auto';d.best=d.best||{};d.animals=d.animals||[{k:'chicken',name:'Ginger'},{k:'chicken',name:'Rocky'}];
  d.name=d.name||'';return d;})();
function cmSave(){try{localStorage.setItem('cmData',JSON.stringify(CM));}catch(e){}}

/* ---------------- items ---------------- */
const TIERS=['IRON','BRONZE','SILVER','PLATINUM','GOLD'];
const TIER_COL={IRON:'#8a8f9a',BRONZE:'#d18a4e',SILVER:'#e2e8ef',PLATINUM:'#bfe6f2',GOLD:'#ffe07a',bronze:'#d18a4e',silver:'#e2e8ef',gold:'#ffe07a'};
const FRUIT_NAMES={mango:'Mango',guava:'Guava',cala:'Calamansi',banana:'Banana',melon:'Watermelon',gold:'Golden mango'};
function itemName(k){const p=k.split(':');
  if(p[0]==='fish')return `${p[1]} (${p[2][0]+p[2].slice(1).toLowerCase()})`;
  if(p[0]==='fruit')return FRUIT_NAMES[p[1]]||p[1];
  if(p[0]==='egg')return p[1]==='golden'?'Golden egg':`Egg (${p[1]})`;
  return k;}
const ICON_CACHE={};
function itemIcon(k){if(ICON_CACHE[k])return ICON_CACHE[k];const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d'),p=k.split(':');
  const px=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  let temp=false;
  if(p[0]==='fish'){const i=typeof FISH_ORDER!=='undefined'?FISH_ORDER.indexOf(p[1]):-1;if(i>=0&&typeof FISH_IMG!=='undefined'&&FISH_IMG.complete&&FISH_IMG.naturalWidth){g.drawImage(FISH_IMG,4,i*28+4,40,20,0,2,16,8);}
    else{px(2,6,10,5,'#7f95a8');px(12,7,3,3,'#5f6b7a');temp=true;}g.fillStyle=TIER_COL[p[2]];g.fillRect(12,12,4,4);}
  else if(p[0]==='egg'){const col=p[1]==='golden'?'#ffd34a':'#f4ecd8';g.fillStyle='#3a2a1a';g.beginPath();g.ellipse(8,9,5,6,0,0,7);g.fill();g.fillStyle=col;g.beginPath();g.ellipse(8,9,4,5,0,0,7);g.fill();
    px(6,6,2,2,'#ffffff');if(p[1]!=='golden'){g.fillStyle=TIER_COL[p[1]];g.fillRect(12,12,4,4);}}
  else if(p[0]==='fruit'){const col={mango:'#f6c844',guava:'#a7d36a',cala:'#7fbf3a',banana:'#f6d84a',melon:'#4f9a3a',gold:'#ffe07a'}[p[1]]||'#f6c844';
    g.fillStyle='#2a1d14';g.beginPath();g.ellipse(8,9,p[1]==='melon'?7:5,p[1]==='melon'?5:6,0,0,7);g.fill();g.fillStyle=col;g.beginPath();g.ellipse(8,9,p[1]==='melon'?6:4,p[1]==='melon'?4:5,0,0,7);g.fill();
    px(7,2,2,2,'#4f8a3c');px(6,6,2,2,'rgba(255,255,255,.6)');}
  if(temp)return c;return ICON_CACHE[k]=c;}
function addItem(store,k,n=1){store[k]=(store[k]||0)+n;if(store[k]<=0)delete store[k];cmSave();}

/* ---------------- panels + dialogs ---------------- */
const pnl=document.getElementById('pnl'),pnlT=document.getElementById('pnlT'),pnlB=document.getElementById('pnlB');
let pnlOnClose=null;
function openPanel(title,build,onClose){pnlT.textContent=title;pnlB.innerHTML='';build(pnlB);pnl.classList.add('show');pnlOnClose=onClose||null;document.getElementById('pnlX').style.display='';}
function closePanel(){pnl.classList.remove('show');const f=pnlOnClose;pnlOnClose=null;if(f)f();}
document.getElementById('pnlX').onclick=()=>{audioInit();closePanel();};
const panelOpen=()=>pnl.classList.contains('show');
/* ask('Title','text',[['Start',fn],['Not now',fn]]) */
function ask(title,text,btns,noClose){openPanel(title,b=>{if(text){const p=document.createElement('p');p.innerHTML=text;b.appendChild(p);}
  const row=document.createElement('div');row.className='row';for(const[label,fn,cls]of btns){const x=document.createElement('button');x.textContent=label;if(cls)x.className=cls;
    x.onclick=()=>{audioInit();sfx.open();pnl.classList.remove('show');pnlOnClose=null;if(fn)fn();};row.appendChild(x);}b.appendChild(row);});
  document.getElementById('pnlX').style.display=noClose?'none':'';}
function itemsGrid(b,store,empty){const keys=Object.keys(store).sort();if(!keys.length){const p=document.createElement('p');p.textContent=empty;b.appendChild(p);return;}
  const g=document.createElement('div');g.className='items';for(const k of keys){const d=document.createElement('div');d.className='it';const ic=itemIcon(k),c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(ic,0,0);d.appendChild(c);
    const s=document.createElement('span');s.textContent=`${itemName(k)} ×${store[k]}`;d.appendChild(s);g.appendChild(d);}b.appendChild(g);}
function openBag(){openPanel('BAG',b=>itemsGrid(b,CM.inv,'Your bag is empty. Go fishing at Mirror Lake or play Fruit Catch under the big mango tree in Sunny Meadow!'));}
function openStorage(){openPanel('BARN STORAGE',b=>{const p=document.createElement('p');p.textContent='Everything Ginger, Rocky and friends give you is kept here.';b.appendChild(p);
  itemsGrid(b,CM.barn,'Empty. Tend the animals in the barn to fill it.');});}
document.getElementById('bInv').onclick=()=>{audioInit();openBag();};

/* ---------------- settings: music picker ---------------- */
let musicPaused=false,modPlaying=null;
function musicPick(n){   // called by setMusic(n): returns the chip song to play, or null when a piano song (or nothing) plays
  if(musicPaused){stopMod();return null;}
  const pick=SONG_LIST.find(s=>s.id===CM.music)||SONG_LIST[0];
  if(pick.kind==='mod'){if(modPlaying!==pick.id){stopMod();if(AC){MUSIC.mods[pick.mod].start(pick.ver);modPlaying=pick.id;}}return null;}
  stopMod();if(pick.kind==='chip')return pick.song;return n;}
function stopMod(){if(modPlaying){for(const k in MUSIC.mods)MUSIC.mods[k].stop();modPlaying=null;}}
function musicRefresh(){curSong=null;songTr=[];setMusic(map?map.music:null);}
function pauseWorldMusic(v){musicPaused=v;musicRefresh();}
function openSettings(){openPanel('SETTINGS',b=>{const h=document.createElement('p');h.innerHTML='<b>Music</b>: pick a song, or Auto to let each place play its own.';b.appendChild(h);
  const l=document.createElement('div');l.className='list';for(const s of SONG_LIST){const x=document.createElement('button');x.textContent=(CM.music===s.id?'♪ ':'')+s.name;if(CM.music===s.id)x.className='cur';
    x.onclick=()=>{audioInit();CM.music=s.id;cmSave();musicRefresh();openSettings();};l.appendChild(x);}b.appendChild(l);});}
document.getElementById('bSet').onclick=()=>{audioInit();openSettings();};
// a song picked before the first tap starts once audio is unlocked
addEventListener('pointerdown',()=>{if(AC&&!modPlaying&&!musicPaused){const p=SONG_LIST.find(s=>s.id===CM.music);if(p&&p.kind==='mod')musicRefresh();}},{capture:true});

/* ---------------- minigame overlay host ---------------- */
const mgw=document.getElementById('mgw');
let MG=null;   // the running minigame: {update(), draw(), back(), end()}
function mgOpen(game){if(MG)MG.end&&MG.end();MG=game;mgw.innerHTML='';mgw.classList.add('on');document.body.classList.add('mgon');pauseWorldMusic(true);
  const x=document.createElement('button');x.className='mgx';x.textContent='✕';x.onclick=()=>{audioInit();if(MG&&MG.back)MG.back();else mgClose();};mgw.appendChild(x);
  game.init(mgw);fitMG();}
function mgClose(){const g=MG;MG=null;mgw.classList.remove('on');document.body.classList.remove('mgon');mgw.innerHTML='';if(g&&g.end)g.end();pauseWorldMusic(false);saveState();}
function mgCanvas(w,h,scale=1){const c=document.createElement('canvas');c.className='mgc';c.width=w*scale;c.height=h*scale;c.dataset.w=w;c.dataset.h=h;mgw.appendChild(c);
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;if(scale!==1)g.setTransform(scale,0,0,scale,0,0);fitMG();return[c,g];}
function fitMG(){for(const c of mgw.querySelectorAll('canvas.mgc')){const w=+c.dataset.w,h=+c.dataset.h,s=Math.min(innerWidth/w,innerHeight/h);c.style.width=Math.floor(w*s)+'px';c.style.height=Math.floor(h*s)+'px';}}
addEventListener('resize',fitMG);
function mgPad(label,sub,css,cls){const d=document.createElement('div');d.className='pad'+(cls?' '+cls:'');d.innerHTML=`${label}<small>${sub}</small>`;Object.assign(d.style,css);mgw.appendChild(d);return d;}
let mgLast=performance.now(),mgAcc=0;
function mgFrame(now){if(MG){mgAcc+=Math.min(100,now-mgLast);mgLast=now;let n=0;while(MG&&mgAcc>=1000/60&&n<4){MG.update();mgAcc-=1000/60;n++;}if(MG)MG.draw();}else{mgLast=now;mgAcc=0;}requestAnimationFrame(mgFrame);}
requestAnimationFrame(mgFrame);

/* ---------------- world interactions (Action button near a spot) ---------------- */
const SPOTS=[];   // {map, box:{x,y,w,h}, fn, label}
function addSpot(mapId,box,fn,label){SPOTS.push({map:mapId,box,fn,label});}
function spotHere(){const fb=frontBox();for(const s of SPOTS)if(map&&s.map===map.id&&hit(fb,s.box))return s;return null;}

/* ---------------- hooks called by the main loop ---------------- */
const HOOKS={
  extraUpdate:[],extraTick:[],extraDraw:[],extraOverlay:[],extraItem:[],extraAction:[],
  update(inp){if(MG||panelOpen())return true;for(const f of this.extraUpdate)if(f(inp))return true;return false;},
  action(){for(const f of this.extraAction)if(f())return true;const s=spotHere();if(s){sfx.open();s.fn();return true;}return false;},
  item(){for(const f of this.extraItem)if(f())return true;openBag();return true;},
  tick(){for(const f of this.extraTick)f();},
  drawList(list){for(const f of this.extraDraw)f(list);},
  overlay(cx,cy){for(const f of this.extraOverlay)f(cx,cy);
    const s=spotHere();if(s&&s.label&&!fade){const x=Math.round(pl.x-cx),y=Math.round(pl.y-cy-34);ctx.font='bold 7px monospace';const w=ctx.measureText(s.label).width+8;
      ctx.fillStyle='rgba(20,30,28,.8)';ctx.fillRect(Math.round(x-w/2),y-7,Math.round(w),10);ctx.fillStyle='#fff6c8';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.label,x,y-2);}},
  back(){if(MG){if(MG.back)MG.back();else mgClose();return true;}if(panelOpen()){closePanel();return true;}return false;},
};

window.HOOKS=HOOKS;
/* small text helper for the world canvas */
function wtxt(s,x,y,col='#fff',size=7,al='center'){ctx.font=`bold ${size}px monospace`;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillStyle='rgba(10,16,20,.75)';ctx.fillText(s,x+1,y+1);ctx.fillStyle=col;ctx.fillText(s,x,y);}
