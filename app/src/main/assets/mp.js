/* LAN multiplayer (two phones, same hotspot or Wi-Fi). Native side: LanBridge.java exposed as window.AndroidMP.
   Messages are one JSON line each: {t:type,d:data}.
   World: both players see each other walking on the same map (pos 10x/s).
   Invites: Fruit Catch (co-op / versus) and Barn (together). The MP HOST always runs the shared simulation. */
(function(){
const NAT=window.AndroidMP||null;
const MP=window.MP={connected:false,isHost:false,partner:null,status:'',ips:[],found:[],
  send(t,d){if(!this.connected)return;const line=JSON.stringify({t,d});try{(window.AndroidMP||{send(){}}).send(line);}catch(e){}},
  invite(g,mode){if(!this.connected){say('Not connected.');return;}this.send('inv',{g,mode,ch:pl.char});pendingInv={g,mode};say(`Invite sent: ${label(g,mode)}. Waiting for your friend…`);},
};
let pendingInv=null,lastPos=0;
const label=(g,m)=>g==='fruit'?`Fruit Catch ${m==='vs'?'Versus':'Co-op'}`:`Barn shift together (${m==='relaxed'?'relaxed':'timed'})`;
const charName=c=>(CHARS[c]&&CHARS[c].name)||'Friend';
/* ---------------- native callbacks ---------------- */
window.MPN={
  hosting(ips){MP.ips=ips||[];MP.status='Waiting for a friend to join…';refresh();},
  found(ip,name){if(!MP.found.some(f=>f.ip===ip)){MP.found.push({ip,name});refresh();}},
  scanDone(){MP.scanning=false;refresh();},
  error(m){MP.status=m;refresh();say(m);},
  connected(isHost){MP.connected=true;MP.isHost=!!isHost;MP.status='Connected!';MP.partner=null;sfx.chime();
    MP.send('hello',{ch:pl.char,v:1});refresh();say(isHost?'Your friend joined! You are the host.':'Connected to your friend!');document.getElementById('bMP').style.background='rgba(120,200,140,.45)';},
  closed(){const was=MP.connected;MP.connected=false;MP.partner=null;MP.status='Disconnected.';document.getElementById('bMP').style.background='';
    if(window.FRUIT&&FRUIT.running)FRUIT.onLeave();if(was)say('Multiplayer disconnected.');refresh();},
  msg(line){let m;try{m=JSON.parse(line);}catch(e){return;}const d=m.d||{};
    switch(m.t){
      case 'hello':MP.partner=Object.assign(MP.partner||{},{ch:d.ch,name:charName(d.ch)});refresh();break;
      case 'pos':{const p=MP.partner||(MP.partner={});if(p.map!==d.m||p.x==null){p.x=d.x;p.y=d.y;}Object.assign(p,{map:d.m,tx:d.x,ty:d.y,dir:d.dir,mv:d.mv,rd:d.rd,sp:d.sp,ch:d.ch,em:d.em,t:performance.now()});break;}
      case 'inv':askInvite(d);break;
      case 'inv_ok':if(MP.isHost)hostStart(d.g,d.mode,d.ch);pendingInv=null;break;
      case 'inv_no':pendingInv=null;say('Your friend said not now.');break;
      case 'go':clientStart(d);break;
      // fruit catch
      case 'fc_state':window.FRUIT&&FRUIT.onState(d);break;
      case 'fc_in':window.FRUIT&&FRUIT.onInput(d);break;
      case 'fc_again':window.FRUIT&&FRUIT.onAgain();break;
      case 'fc_leave':window.FRUIT&&FRUIT.onLeave();break;
      // barn
      case 'bn_state':window.BARN&&BARN.onState(d);break;
      case 'bn_act':window.BARN&&BARN.onAct(d);break;
      case 'bn_stop':window.BARN&&BARN.onStop();break;
      case 'bn_end':window.BARN&&BARN.onEnd(d);break;
    }},
};
function askInvite(d){sfx.chime();ask('Your friend invites you',`<b>${label(d.g,d.mode)}</b>. Join?`,[
  ['Join',()=>{if(MP.isHost)hostStart(d.g,d.mode,d.ch);else MP.send('inv_ok',{g:d.g,mode:d.mode,ch:pl.char});},'cur'],['Not now',()=>MP.send('inv_no',{})]]);}
function hostStart(g,mode,partnerChar){const go={g,mode,chars:[pl.char,partnerChar]};MP.send('go',go);startGame(go,true);}
function clientStart(d){startGame(d,false);}
function startGame(d,isHost){if(panelOpen())closePanel();
  if(d.g==='fruit'){FRUIT.start(d.mode,isHost?'host':'client',isHost?0:1,d.chars);}
  else if(d.g==='barn'){const go=()=>BARN.start(d.mode,isHost?'host':'client',isHost?0:1);if(!map||map.id!=='barn'){travel('barn',isHost?9:11,10,'up');setTimeout(go,600);}else go();}}
/* ---------------- world sync: send my position, draw my friend ---------------- */
HOOKS.extraTick.push(()=>{if(!MP.connected||!map)return;if(T-lastPos>=6){lastPos=T;
  MP.send('pos',{m:map.id,x:Math.round(pl.x),y:Math.round(pl.y),dir:pl.dir,mv:pl.moving?1:0,rd:pl.riding?1:0,sp:pl.sprint?1:0,ch:pl.char,em:pl.emote?1:0});}
  const p=MP.partner;if(p&&p.tx!=null){p.x+=(p.tx-p.x)*.25;p.y+=(p.ty-p.y)*.25;p.anim=(p.anim||0)+(p.mv?.12:0);}});
HOOKS.extraDraw.push(list=>{const p=MP.partner;if(!MP.connected||!p||!map||p.map!==map.id||p.x==null)return;
  list.push({y:p.y,fn:(cx,cy)=>{const ch=CHARS[p.ch]||CHARS.girl,dir=p.dir||'down',set=ch.set[dir]||ch.set.down;let s;
    if(p.rd&&ch.ride)s=ch.ride[dir][(T>>3)%4];else if(p.mv&&p.sp&&ch.run&&ch.run[dir])s=ch.run[dir][Math.floor(p.anim*1.5)%ch.run[dir].length];
    else if(p.mv)s=set.walk[Math.floor(p.anim)%4];else s=set.idle[(T>>5)%2];
    const x=Math.round(p.x-cx-(s.width>>1)),y=Math.round(p.y-cy-(s.height-1)-(p.rd?2:0));ctx.drawImage(shadowC(6,2),Math.round(p.x-cx-6),Math.round(p.y-cy-1));ctx.drawImage(s,x,y);
    wtxt(charName(p.ch)+' (P'+(MP.isHost?2:1)+')',Math.round(p.x-cx),y-5,'#9ae0ff',6);}});});
/* ---------------- the Multiplayer panel ---------------- */
let manualIp='';
function refresh(){if(panelOpen()&&document.getElementById('pnlT').textContent==='MULTIPLAYER')openMP();}
function openMP(){openPanel('MULTIPLAYER',b=>{const P=(h)=>{const p=document.createElement('p');p.innerHTML=h;b.appendChild(p);return p;};
  const row=()=>{const r=document.createElement('div');r.className='row';b.appendChild(r);return r;};
  const btn=(r,label,fn,cls)=>{const x=document.createElement('button');x.textContent=label;if(cls)x.className=cls;x.onclick=()=>{audioInit();fn();};r.appendChild(x);return x;};
  if(!NAT&&!window.AndroidMP){P('Multiplayer works in the phone app (two phones on the same hotspot or Wi-Fi).');return;}
  if(MP.connected){P(`<b>Connected</b> ${MP.isHost?'(you are the host)':'(you joined)'}${MP.partner&&MP.partner.name?` with <b>${MP.partner.name}</b>`:''}.`);
    P('Walk around together, or play: <b>Fruit Catch</b> at the big mango tree in Sunny Meadow (Co-op / Versus), and the <b>Barn</b> clipboard (Together).');
    const r=row();btn(r,'Fruit Catch Co-op',()=>{closePanel();MP.invite('fruit','coop');});btn(r,'Fruit Catch Versus',()=>{closePanel();MP.invite('fruit','vs');});
    btn(r,'Barn together',()=>{closePanel();MP.invite('barn',CM.barnMode==='relaxed'?'relaxed':'timed');});
    btn(row(),'Disconnect',()=>{(window.AndroidMP).close();MPN.closed();},'');return;}
  P('Play with a friend on the <b>same hotspot or Wi-Fi</b>. Both phones need this app. No internet needed.');
  if(MP.status)P(`<i>${MP.status}</i>`);
  if(MP.ips&&MP.ips.length&&!MP.connected)P(`Your address: <b>${MP.ips.join('</b> or <b>')}</b><br><small>Your friend can type this if Search doesn't find you.</small>`);
  const r=row();btn(r,'Host a game',()=>{MP.found=[];MP.status='Starting…';window.AndroidMP.host(charName(pl.char));refresh();},'cur');
  btn(r,MP.scanning?'Searching…':'Search for a game',()=>{if(MP.scanning)return;MP.found=[];MP.scanning=true;MP.status='Searching for a host…';window.AndroidMP.scan();refresh();});
  for(const f of MP.found){btn(row(),`Join ${f.name} (${f.ip})`,()=>{MP.status='Joining '+f.ip+'…';window.AndroidMP.join(f.ip);refresh();},'cur');}
  const r2=row(),inp=document.createElement('input');inp.placeholder='or type the host address';inp.value=manualIp;inp.oninput=()=>manualIp=inp.value;r2.appendChild(inp);
  btn(r2,'Join',()=>{if(!manualIp.trim())return;MP.status='Joining '+manualIp+'…';window.AndroidMP.join(manualIp.trim());refresh();});});}
document.getElementById('bMP').onclick=()=>{audioInit();openMP();};
})();
