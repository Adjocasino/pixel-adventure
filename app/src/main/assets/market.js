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
const TX=AX+8,TY=AY+77;                      // Turon image top-left (22x24)
const PX=AX+44,PY=AY+80;                     // chick pen top-left (42x19)
GEN.market={name:'Market Square',seed:61,base:T_G,music:'day',spawn:[45,16],
  exits:[{side:'e',a:14,b:19,to:'village',sx:2,sy:17,dir:'right'}],
  build(m,R){
    ell(m,22,14,17,9,T_S);path(m,[[50,17],[42,16],[34,15]],4,T_S);
    addBlock(m,FX+2,FY+24,87,64);addBlock(m,AX+2,AY+24,87,58);
    addBlock(m,JX+5,JFEET-4,13,4);addBlock(m,TX+2,TY+18,18,6);addBlock(m,PX,PY+4,42,15);
    for(let ty=8;ty<=14;ty++)for(let tx=11;tx<=25;tx++)occ(m,tx,ty);
    addAt(m,'barrel',10,13);addAt(m,'crate',9,14);addAt(m,'crate',27,14);addAt(m,'barrel',26,10);addAt(m,'barrel',8,10);
    for(const[tx,ty]of[[7,17],[30,18],[18,21]])addAt(m,'lamp',tx,ty);
    addAt(m,'sign',40,13,{msg:'→ Willow Village'});addAt(m,'sign',36,18,{msg:'Market Square. Fish stall: sell what you catch. Animal shop: Bins.'});
    border(m,R,'day');
    scatter(m,R,'tree',14,grassOK(m),1,{pal:'day'});scatter(m,R,'bush',8,grassOK(m),0,R=>({berry:R()<.4}));
    scatter(m,R,'rock',4,grassOK(m));scatter(m,R,'fern',24,grassOK(m));
    m.flowers=60;m.butterflies=5;m.leafCols=['#5aa86a','#7cbf6e','#e6ae5a'];
  }};

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
  if(wagT>0)wagT--;});
HOOKS.extraDraw.push(list=>{if(!here())return;
  list.push({y:FY+88,fn:(cx,cy)=>spr('fishStall',FX-cx,FY-cy)});
  list.push({y:AY+82,fn:(cx,cy)=>{spr('animalBack',AX-cx,AY-cy);spr('bins_'+BT[jf%BT.length],AX+A._binsOff[0]-cx,AY+A._binsOff[1]-cy);spr('animalFront',AX+A._frontOff[0]-cx,AY+A._frontOff[1]-cy);}});
  list.push({y:PY+19,fn:(cx,cy)=>{spr('pen',PX-cx,PY-cy);
    for(const c of chicks){const hop=(jf+c[0])%8<2?1:0,x=Math.round(c[0]+(c[2]?1:-1)*((jf/6|0)%3)-cx),y=Math.round(c[1]-hop-cy);
      ctx.fillStyle='#f6d84a';ctx.fillRect(x,y,5,3);ctx.fillRect(x+1,y-1,3,1);ctx.fillStyle='#e08a2c';ctx.fillRect(c[2]?x+5:x-1,y+1,1,1);ctx.fillRect(x+1,y+3,1,1);ctx.fillRect(x+3,y+3,1,1);
      ctx.fillStyle='#1c1c1c';ctx.fillRect(c[2]?x+3:x+1,y,1,1);}}});
  list.push({y:TY+24,fn:(cx,cy)=>{ctx.fillStyle='rgba(120,96,60,.45)';ctx.fillRect(Math.round(TX+3-cx),Math.round(TY+22-cy),16,3);
    spr('turon_'+(wagT>0?(jf%2?'wag':'idle'):TT[jf%TT.length]),TX-cx,TY-cy);}});
  list.push({y:JFEET,fn:(cx,cy)=>{ctx.fillStyle='rgba(120,96,60,.45)';ctx.fillRect(Math.round(JX+4-cx),Math.round(JFEET-1-cy),16,3);spr('jao_'+JT[jf%JT.length],JX-cx,JFEET-37-cy);}});});
HOOKS.extraOverlay.push((cx,cy)=>{if(!here())return;
  for(const p of puffs){const a=Math.max(0,.67*(1-p[3]/p[4]));ctx.fillStyle=`rgba(232,236,244,${a.toFixed(3)})`;ctx.beginPath();ctx.arc(p[0]-cx,p[1]-cy,p[2],0,7);ctx.fill();}
  wtxt('Jao',Math.round(JX+12-cx),Math.round(JFEET-46-cy),'#fff6c8',6);});

/* ---------------- selling (shared) ----------------
   Base price per item. Cheap items (base < LOW) lose demand as you sell them: each one sold drops that item's
   price by 15% (down to 25% of base, min 1 coin), and demand recovers slowly (back to full in about 10 minutes
   of real time). Valuable items always sell at full price. So grinding common stuff is a poor way to get rich. */
const EGG_BASE={bronze:2,silver:6,gold:14,golden:80};
const FRUIT_BASE={cala:1,banana:1,guava:2,mango:3,melon:8,gold:40};
const LOW=10,DROP=.85,FLOOR=.25,RECOVER_PER_MIN=.075;
function basePrice(k){const p=k.split(':');
  if(p[0]==='fish')return fishPrice(k);if(p[0]==='egg')return EGG_BASE[p[1]]||2;if(p[0]==='fruit')return FRUIT_BASE[p[1]]||1;return 1;}
CM.demand=CM.demand||{};
function demand(k){const d=CM.demand[k];if(!d)return 1;const m=Math.min(1,d[0]+RECOVER_PER_MIN*(Date.now()-d[1])/60000);if(m>=1){delete CM.demand[k];return 1;}return m;}
function priceAt(k,m){const b=basePrice(k);return b>=LOW?b:Math.max(1,Math.round(b*m));}
function price(k){return priceAt(k,demand(k));}
function quote(k,q){let m=demand(k),v=0;const b=basePrice(k);for(let i=0;i<q;i++){v+=priceAt(k,m);if(b<LOW)m=Math.max(FLOOR,m*DROP);}return[v,m];}
function sellItems(store,k,q){q=Math.min(q,store[k]||0);if(!q)return 0;const[v,m]=quote(k,q);addItem(store,k,-q);CM.coins+=v;
  if(basePrice(k)<LOW)CM.demand[k]=[m,Date.now()];cmSave();return v;}
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
  const note=document.createElement('p');note.innerHTML='<small style="opacity:.7">Cheap items lose value the more you sell; demand comes back over time.</small>';b.appendChild(note);
 },onClose);}

/* ---------------- fish stall ---------------- */
function openFishStall(){openSell('FISH STALL','Sell what you catch at Mirror Lake. Better tier = more coins.',
  [['Fish',CM.inv,k=>k.startsWith('fish:'),'You have no fish. Go fishing at the end of the Mirror Lake dock!']],
  ()=>{say('Jao: "'+pick(JAO_SELL,'js')+'"');});}

/* ---------------- animal shop ---------------- */
/* unlock rules (v1.3). Once unlocked it stays unlocked. Buying still waits until the animal's barn task exists. */
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
  const sb=document.createElement('button');sb.className='cur';const ne=Object.keys(CM.barn).filter(k=>k.startsWith('egg:')).reduce((a,k)=>a+CM.barn[k],0),nf=Object.keys(CM.inv).filter(k=>k.startsWith('fruit:')).reduce((a,k)=>a+CM.inv[k],0);
  sb.innerHTML=`🥚 Sell eggs & fruit <small>(${ne} eggs in barn storage, ${nf} fruit in bag)</small>`;sb.onclick=openProduce;l.insertBefore(sb,l.firstChild);
  for(const a of SOON){const x=document.createElement('button');x.disabled=true;
    if(CM.unlocked[a.k])x.innerHTML=`✓ ${a.nm} <small>(${a.what})</small>: <b style="color:#b6f0a0">unlocked!</b><br><small>Barn task coming soon, then you can buy it.</small>`;
    else x.innerHTML=`🔒 ${a.nm} <small>(${a.what})</small><br><small>${a.goal}: ${Math.min(a.have(),a.need)}/${a.need}</small>`;
    l.appendChild(x);}
  b.appendChild(l);});}
function openProduce(){openSell('BINS BUYS','Bins cooks for everyone, so he buys eggs (from the barn storage) and fruit (from your bag).',
  [['Eggs (barn storage)',CM.barn,k=>k.startsWith('egg:'),'No eggs yet. Work a shift in the barn!'],['Fruit (bag)',CM.inv,k=>k.startsWith('fruit:'),'No fruit. Play Fruit Catch under the big mango tree.']],
  ()=>{say('Bins: "'+pick(BINS_BUY,'bb')+'"');});}
const BINS_BUY=['Eggs! Perfect. Breakfast tomorrow, my place. I\'ll cook these.','Thank you! Now you HAVE to come for lunch. It\'s your fruit.','Turon says thank you. He wants the mango. He can\'t have the mango.','This is a lot of eggs. Omelette party. You\'re invited. Obviously.'];
const SUGGEST=['Nugget','Mochi','Pepper','Kwek','Biscuit','Sunny','Tisoy','Bibingka','Pandesal','Chico'];
function nameAnimal(kind){const taken=new Set(CM.animals.map(a=>a.name.toLowerCase()));const sug=SUGGEST.filter(s=>!taken.has(s.toLowerCase()));const def=sug[Math.random()*sug.length|0]||'Chick';
  ask('Name your chicken',`Bins: "Good choice! What's her name?"<br><input id="anName" maxlength="12" placeholder="${def}" style="margin-top:8px;padding:6px;font-size:16px;width:70%;text-align:center">`,
    [['Buy ●'+CHICKEN_PRICE,()=>{const el=document.getElementById('anName');let nm=(el&&el.value||'').trim().replace(/[<>&"]/g,'')||def;
        if(taken.has(nm.toLowerCase()))nm+=' 2';if(CM.coins<CHICKEN_PRICE||chickens().length>=MAX_CHICKENS)return;
        CM.coins-=CHICKEN_PRICE;CM.animals.push({k:kind,name:nm});cmSave();sfx.chime();
        say(`${nm} moved into the barn! Bins: "Now you have to come for breakfast. ${nm} insists."`);setTimeout(()=>checkUnlocks(true),2600);},'cur'],['Back',()=>openShop()]]);
  setTimeout(()=>{const el=document.getElementById('anName');if(el)el.focus();},50);}

/* ---------------- interaction spots ---------------- */
addSpot('market',{x:TX-4,y:TY+18,w:32,h:16},()=>{wagT=30;sfx.chime();say('Turon wags his tail. Bins: "He likes you! Stay for lunch, he\'s sharing."');},'A: pet Turon');
addSpot('market',{x:FX+8,y:FY+86,w:76,h:18},openFishStall,'A: sell fish');
addSpot('market',{x:JX+16,y:JFEET-16,w:26,h:26},()=>{jf=JT.indexOf('exhale')-1;say('Jao: "'+pick(JAO,'j')+'"');},'A: talk to Jao');
addSpot('market',{x:AX+30,y:AY+80,w:14,h:20},()=>openShop(),'A: animal shop');
addSpot('market',{x:AX+44,y:AY+97,w:44,h:12},()=>openShop(),'A: animal shop');

window.MARKET={openFishStall,openShop,openProduce,fishPrice,price,basePrice,quote,checkUnlocks,_dbg:{get puffs(){return puffs.length;}}};
})();
