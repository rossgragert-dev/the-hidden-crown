/* ================= MODALS ================= */
const modal=$('modal'),mw=$('mw');
const UI={tab:'knight',sel:null,selSk:null};
function showModal(h){mw.innerHTML=h;modal.classList.add('on');modal.scrollTop=0;S.paused=true;}
function hideModal(){modal.classList.remove('on');S.paused=false;}
const hdr=(t,r)=>'<div class="mh"><h2>'+t+'</h2><span>'+(r||'')+'</span><button class="xb" data-a="close">&#10005;</button></div>';
const goldStr=()=>'Lv '+G.lvl+' &middot; '+G.gold+'g';
/* ================= WORLD MAP ================= */
const NODES={
 hearth:{n:'Castle Hearthmoor',x:180,y:178,t:'castle',d:'A highland castle and the Order of the Silver Thorn.'},
 green:{n:'The Greenmarch',x:104,y:268,t:'village',d:'Farms and villages. First to feel the blight.'},
 fen:{n:'Veilfen Reeds',x:62,y:372,t:'marsh',d:'Mist-bound marsh. Marshkin country.'},
 cave:{n:'Hollowdeep Caves',x:150,y:432,t:'cave',d:'Smugglers\' tunnels and glowing crystal. Dungeon.'},
 thorn:{n:'Thornwood',x:272,y:238,t:'forest',d:'Ancient forest of poachers and hollow oaks. Dungeon.'},
 mine:{n:'Greywatch Mine',x:300,y:114,t:'mine',d:'An abandoned silver mine. Dungeon.'},
 keep:{n:'Ashfall Keep',x:66,y:126,t:'ruin',d:'A burned-out keep held by the Ashen Hand. Dungeon.'},
 road:{n:'Southern Road',x:218,y:340,t:'road',d:'The highway south, out of Auremark\'s heartland.'},
 camp:{n:'Refugee Camp',x:276,y:426,t:'camp',lock:'ACT II',d:'Where the survivors gather.'},
 ironvale:{n:'Ironvale',x:326,y:40,t:'city',lock:'ACT II',d:'Hammerguild strongholds under the mountains.'},
 colleg:{n:'Collegium',x:34,y:232,t:'tower',lock:'ACT II',d:'Quill & Flame, the tower of mages.'},
 spire:{n:'Blighted Spire',x:332,y:330,t:'spire',lock:'ACT II',d:'The source of the blight?'},
 aurelith:{n:'Aurelith',x:180,y:34,t:'city',lock:'ACT III',d:'The royal capital and the Oathcrown.'}
};
const EDGES=[
 {a:'hearth',b:'green',n:"King's Road",d:2,c:[128,212],open:()=>G.done.m1,why:'Finish "Eyes Up" first.'},
 {a:'hearth',b:'thorn',n:'Forest Track',d:1,c:[236,184],open:()=>G.done.m2,why:'Needs "The Greenmarch Road".'},
 {a:'thorn',b:'green',n:"Woodcutter's Path",d:1,c:[196,276],open:()=>G.done.m2,why:'Needs "The Greenmarch Road".'},
 {a:'green',b:'fen',n:'Reed Causeway',d:2,c:[66,318],open:()=>G.done.m3,why:'Flooded until "Bread or Blood".'},
 {a:'fen',b:'cave',n:"Smugglers' Tunnel",d:1,c:[90,414],open:()=>G.done.m4,why:'Needs "The Whispering Reeds".'},
 {a:'hearth',b:'mine',n:'Mine Road',d:2,c:[252,120],open:()=>G.done.m5,why:'Barred until "A Rival\'s Debt".'},
 {a:'hearth',b:'keep',n:'Old Keep Road',d:1,c:[116,138],open:()=>G.done.m8,why:'Needs "Trial of Steel".'},
 {a:'green',b:'road',n:'South Fork',d:1,c:[170,318],open:()=>G.done.m11,why:'Opens after "The Long Night".'},
 {a:'fen',b:'road',n:'Marsh Track',d:2,c:[142,386],open:()=>G.done.m11,why:'Opens after "The Long Night".'},
 {a:'road',b:'camp',n:'Refugee Way',d:2,c:[256,392],open:()=>false,why:'Act II. A later chapter.'},
 {a:'mine',b:'ironvale',n:'Ironvale Pass',d:3,c:[330,84],open:()=>false,why:'Act II. A later chapter.'},
 {a:'fen',b:'colleg',n:"Scholars' Way",d:3,c:[30,296],open:()=>false,why:'Act II. A later chapter.'},
 {a:'road',b:'spire',n:'Ash Road',d:3,c:[290,330],open:()=>false,why:'Act II. A later chapter.'},
 {a:'hearth',b:'aurelith',n:'Royal Road',d:4,c:[200,100],open:()=>false,why:'Act III. A later chapter.'}
];
function findPath(from,to,ignoreLocks){
  if(from===to)return [];const prev={[from]:null},q=[from];
  while(q.length){const cur=q.shift();if(cur===to)break;
    for(const e of EDGES){if(!ignoreLocks&&!e.open())continue;let nx=null,fwd=true;if(e.a===cur){nx=e.b;}else if(e.b===cur){nx=e.a;fwd=false;}
      if(nx&&!(nx in prev)){prev[nx]={from:cur,e,fwd};q.push(nx);}}}
  if(!(to in prev))return null;const out=[];let c=to;while(prev[c]){out.unshift({e:prev[c].e,fwd:prev[c].fwd});c=prev[c].from;}return out;
}
const bez=(A,C,B,t)=>[(1-t)*(1-t)*A[0]+2*(1-t)*t*C[0]+t*t*B[0],(1-t)*(1-t)*A[1]+2*(1-t)*t*C[1]+t*t*B[1]];
function nodeIcon(n){
  switch(n.t){
   case 'castle':return '<rect x="-12" y="-6" width="24" height="14" fill="#9a9aa8" stroke="#3a3a48"/><rect x="-14" y="-12" width="8" height="20" fill="#8a8a98" stroke="#3a3a48"/><rect x="6" y="-12" width="8" height="20" fill="#8a8a98" stroke="#3a3a48"/><polygon points="-15,-12 -10,-20 -5,-12" fill="#b4543a"/><polygon points="5,-12 10,-20 15,-12" fill="#b4543a"/><rect x="-3" y="0" width="6" height="8" fill="#2a2230"/><rect x="-1" y="-24" width="1" height="6" fill="#333"/><rect x="0" y="-24" width="6" height="3" fill="#2f5fd0"/>';
   case 'village':return '<polygon points="-14,2 -8,-8 -2,2" fill="#b4543a"/><rect x="-12" y="2" width="8" height="7" fill="#e8d8ac" stroke="#5a4028"/><polygon points="0,4 7,-7 14,4" fill="#b4543a"/><rect x="2" y="4" width="10" height="6" fill="#e8d8ac" stroke="#5a4028"/><rect x="-4" y="-10" width="2" height="5" fill="#8a4a3a"/>';
   case 'marsh':return '<ellipse cx="0" cy="2" rx="16" ry="8" fill="#6aa8a0" stroke="#2a5a58"/><path d="M-8 2 L-8 -8 M-4 3 L-5 -10 M3 2 L4 -9 M8 3 L9 -6" stroke="#2a5a3a" stroke-width="1.5"/><circle cx="-8" cy="-9" r="1.5" fill="#6a3a22"/><circle cx="4" cy="-10" r="1.5" fill="#6a3a22"/>';
   case 'cave':return '<polygon points="-16,8 -6,-10 0,-2 6,-12 16,8" fill="#7a7a8a" stroke="#3a3a48"/><path d="M-6 8 Q0 -6 6 8 Z" fill="#14182a"/><polygon points="-2,0 0,-6 2,0" fill="#5ae0ff"/><polygon points="3,2 4,-3 6,2" fill="#b070ff"/>';
   case 'forest':return '<polygon points="-14,8 -8,-8 -2,8" fill="#3a6a3a" stroke="#1a3a1a"/><polygon points="-4,8 3,-12 10,8" fill="#4a7a3a" stroke="#1a3a1a"/><polygon points="6,8 12,-4 18,8" fill="#3a6a3a" stroke="#1a3a1a"/><rect x="2" y="8" width="2" height="3" fill="#4a3220"/><rect x="-9" y="8" width="2" height="3" fill="#4a3220"/>';
   case 'mine':return '<polygon points="-16,8 -4,-12 4,-4 10,-10 16,8" fill="#8a7a6a" stroke="#4a3a2a"/><rect x="-5" y="-2" width="10" height="10" fill="#14100c" stroke="#7a5230"/><rect x="-6" y="-3" width="12" height="2" fill="#7a5230"/><path d="M12 -14 L20 -8 M14 -16 L18 -6" stroke="#5a5a62" stroke-width="2"/>';
   case 'ruin':return '<rect x="-12" y="-4" width="8" height="12" fill="#6a6a78" stroke="#2a2a38"/><rect x="2" y="-12" width="9" height="20" fill="#6a6a78" stroke="#2a2a38"/><polygon points="2,-12 5,-16 8,-12 11,-14 11,-12" fill="#6a6a78"/><path d="M-12 -4 L-10 -8 L-7 -4" fill="#6a6a78"/><circle cx="-2" cy="-14" r="3" fill="#ff8a2a"/>';
   case 'road':return '<rect x="-1" y="-12" width="2" height="20" fill="#6a4a2a"/><polygon points="1,-12 12,-9 1,-6" fill="#c9a24a" stroke="#5a4028"/><polygon points="-1,-4 -12,-1 -1,2" fill="#c9a24a" stroke="#5a4028"/>';
   case 'camp':return '<polygon points="-14,8 -6,-8 2,8" fill="#c8b890" stroke="#5a4028"/><polygon points="0,8 8,-6 16,8" fill="#a89870" stroke="#5a4028"/><circle cx="-2" cy="10" r="2" fill="#e8802a"/>';
   case 'city':return '<rect x="-10" y="-4" width="20" height="12" fill="#e8d098" stroke="#5a4028"/><rect x="-14" y="-12" width="6" height="20" fill="#e8d098" stroke="#5a4028"/><rect x="8" y="-12" width="6" height="20" fill="#e8d098" stroke="#5a4028"/><polygon points="-14,-12 -11,-20 -8,-12" fill="#e8b84a"/><polygon points="8,-12 11,-20 14,-12" fill="#e8b84a"/><polygon points="-3,-4 0,-16 3,-4" fill="#e8b84a"/>';
   case 'tower':return '<rect x="-5" y="-14" width="10" height="22" fill="#a88ad8" stroke="#3a2a58"/><polygon points="-7,-14 0,-26 7,-14" fill="#6a3fa8" stroke="#3a2a58"/><rect x="-1" y="-8" width="2" height="4" fill="#ffe27a"/>';
   case 'spire':return '<polygon points="-8,8 -3,-14 0,-24 3,-14 8,8" fill="#2a2924" stroke="#000"/><circle cx="0" cy="-8" r="2" fill="#9acd32"/>';
  }return '';
}
function mapSvg(sel){
  const r=mkr(7),cur=G.loc;
  let s='<svg id="mapsvg" viewBox="0 0 360 470" style="width:100%;display:block;border:3px solid #5a4028;border-radius:10px;background:#e6d5a2"><defs><radialGradient id="vg"><stop offset="55%" stop-color="#e6d5a2" stop-opacity="0"/><stop offset="100%" stop-color="#7a5a2a" stop-opacity=".6"/></radialGradient></defs>';
  // terrain
  for(let k=0;k<40;k++)s+='<rect x="'+Math.round(r()*340)+'" y="'+Math.round(r()*450)+'" width="3" height="1" fill="#d4c08a"/>';
  s+='<path d="M340 150 C300 190 240 220 232 290 S196 400 188 470" fill="none" stroke="#5a88a8" stroke-width="8" stroke-linecap="round"/><path d="M340 150 C300 190 240 220 232 290 S196 400 188 470" fill="none" stroke="#9cc4e0" stroke-width="4" stroke-linecap="round"/>';
  for(const [mx,my] of [[270,64],[298,58],[326,76],[286,92],[336,112],[312,96],[244,50],[150,44],[200,52],[226,34]]){const h=18+Math.round(r()*10);s+='<polygon points="'+mx+','+my+' '+(mx+14)+','+(my-h)+' '+(mx+28)+','+my+'" fill="#a89878" stroke="#5a4028"/><polygon points="'+(mx+14)+','+(my-h)+' '+(mx+9)+','+(my-h+9)+' '+(mx+19)+','+(my-h+9)+'" fill="#fff"/>';}
  for(let k=0;k<26;k++){const tx=228+r()*92,ty=204+r()*74;s+='<polygon points="'+tx+','+(ty+6)+' '+(tx+4)+','+(ty-4)+' '+(tx+8)+','+(ty+6)+'" fill="#6a8a4a" stroke="#2a4a2a" stroke-width=".6"/>';}
  for(let k=0;k<22;k++){const tx=20+r()*100,ty=336+r()*76;s+='<path d="M'+tx+' '+ty+' l0 -7 M'+(tx+3)+' '+ty+' l1 -5" stroke="#3a7a6a" stroke-width="1.2"/>';}
  for(let k=0;k<6;k++)s+='<rect x="'+(66+k*12)+'" y="238" width="10" height="'+(40+(k%2)*6)+'" fill="'+(k%2?'#c8b862':'#b4c070')+'" opacity=".7"/>';
  s+='<path d="M0 470 L0 440 Q20 430 40 440 L40 470Z" fill="#7aa8c8" opacity=".5"/>';
  s+='<rect width="360" height="470" fill="url(#vg)"/>';
  // roads
  for(const e of EDGES){const A=NODES[e.a],B=NODES[e.b],op=e.open(),d='M'+A.x+' '+A.y+' Q'+e.c[0]+' '+e.c[1]+' '+B.x+' '+B.y;
    s+='<path d="'+d+'" fill="none" stroke="'+(op?'#6a4020':'#9a8a6a')+'" stroke-width="'+(op?3:2)+'" stroke-dasharray="'+(op?'5 3':'2 4')+'" stroke-linecap="round"/>';
    if(!op){const m=bez([A.x,A.y],e.c,[B.x,B.y],.5);s+='<g transform="translate('+m[0]+' '+m[1]+')"><circle r="5.5" fill="#8a2a2a" stroke="#2a0a0a"/><path d="M-2.5 -2.5 l5 5 M2.5 -2.5 l-5 5" stroke="#fff" stroke-width="1.4"/></g>';}}
  // nodes
  for(const id in NODES){const n=NODES[id],lk=!!n.lock;
    s+='<g data-a="node" data-v="'+id+'" transform="translate('+n.x+' '+n.y+')" opacity="'+(lk?.5:1)+'" style="cursor:pointer">'+(sel===id?'<circle r="22" fill="none" stroke="#c0402a" stroke-width="2" stroke-dasharray="3 2"/>':'')+'<circle r="19" fill="rgba(0,0,0,0)"/>'+nodeIcon(n)
     +'<text x="'+(n.x<60?-12:n.x>296?12:0)+'" y="'+(n.t==='tower'||n.t==='spire'?20:22)+'" text-anchor="'+(n.x<60?'start':n.x>296?'end':'middle')+'" font-size="9" font-weight="bold" font-family="Courier New,monospace" fill="#2a1a08" style="paint-order:stroke;stroke:#f0e2b4;stroke-width:3px">'+(lk?n.n+' ('+n.lock.replace('ACT ','')+')':n.n)+'</text></g>';}
  // dungeons badge + marker
  const c=NODES[cur];
  s+='<g id="mk" transform="translate('+c.x+' '+(c.y-30)+')"><ellipse cx="0" cy="26" rx="7" ry="2" fill="rgba(0,0,0,.25)"/><circle r="9" fill="#ffd34a" stroke="#3a2410" stroke-width="1.5"/><text y="4" text-anchor="middle" font-size="12" fill="#3a2410">&#9819;</text></g>';
  return s+'</svg>';
}
function mcard(m){
  const st=mstate(m),col=m.type==='main'?'#ffd34a':m.type==='dungeon'?'#c070ff':'#9fd1ff',nm=m.type==='main'?'MAIN':m.type==='dungeon'?'DUNGEON':'SIDE';
  return '<div class="card k'+(st==='lock'?' lock':'')+'" '+(st!=='lock'?'data-a="brief" data-v="'+m.id+'"':'')+'><h4>'+(st==='done'?'&#10003; ':'')+m.title+'<span class="pill" style="color:'+col+';border-color:'+col+'">'+nm+'</span><span class="pill" style="color:#aaa;border-color:#555">Lv '+m.lvl+'</span></h4><p>'+(st==='lock'?'Locked. Finish an earlier mission first.':m.desc)+'</p></div>';
}
function mstate(m){
  if(m.type==='main'){if(!m.req||G.done[m.req])return G.done[m.id]?'done':'open';return 'lock';}
  return G.done[m.after]?(G.done[m.id]?'done':'open'):'lock';
}
function openBoard(){
  $('title').style.display='none';S.mode='hub';S.mission=null;S.pal='day';document.body.dataset.mode='hub';resetField();buildLayers('day');S.cam=0;
  calc();P.hp=P.max;P.mp=P.mmax;hud(true);UI.node=G.loc||'hearth';UI.msg='';renderBoard();
}
function renderBoard(){
  const sel=UI.node||G.loc,N0=NODES[sel],here=sel===G.loc;
  let h='<div class="mh"><h2>WORLD MAP</h2><span>Day '+(G.day||1)+' &middot; '+goldStr()+'</span></div>';
  h+='<div class="tabs"><button class="tb" data-a="bag">BAG</button><button class="tb" data-a="skills">SKILLS'+(G.pts?' &#9733;'+G.pts:'')+'</button><button class="tb" data-a="menu">MENU</button></div>';
  const nx=MISSIONS.find(m=>m.type==='main'&&mstate(m)==='open');
  if(nx)h+='<div class="card k" data-a="node" data-v="'+nx.loc+'" style="padding:8px 10px"><b style="color:#ffd34a">NEXT STORY:</b> '+nx.title+' <span class="stat">@ '+NODES[nx.loc].n+'</span></div>';
  h+=mapSvg(sel);
  h+='<div class="card" style="margin-top:8px"><h4>'+N0.n+(N0.lock?'<span class="pill" style="color:#aaa;border-color:#555">'+N0.lock+'</span>':'')+(here?'<span class="pill" style="color:#6fe07a;border-color:#6fe07a">YOU ARE HERE</span>':'')+'</h4><p>'+N0.d+'</p>';
  if(UI.msg)h+='<p class="dn">'+UI.msg+'</p>';
  if(!here){const p=findPath(G.loc,sel);if(p){const days=p.reduce((a,x)=>a+x.e.d,0);h+='<button class="bt go" data-a="go" data-v="'+sel+'" style="width:100%;margin-top:8px">TRAVEL ('+days+' day'+(days>1?'s':'')+' via '+p.map(x=>x.e.n).join(', ')+')</button>';}
    else{const q=findPath(G.loc,sel,true),blk=q&&q.find(x=>!x.e.open());h+='<p class="dn">No open route. '+(blk?blk.e.n+': '+blk.e.why:'Unknown lands.')+'</p>';}}
  h+='<div id="tmsg" class="stat"></div></div>';
  const ms=MISSIONS.filter(m=>m.loc===sel).sort((a,b)=>({main:0,side:1,dungeon:2}[a.type]-{main:0,side:1,dungeon:2}[b.type]));
  if(ms.length){h+='<div class="sec">MISSIONS HERE</div>'+ms.map(mcard).join('');}
  else if(!N0.lock)h+='<div class="stat" style="opacity:.7">Nothing to do here yet.</div>';
  const st=STUBS.filter(s=>s[0]===2||s[0]===3);
  h+='<div class="sec">LATER CHAPTERS (LOCKED)</div><div class="card lock">'+STUBS.map(s=>'<div class="stat">&#9643; Act '+['','I','II','III'][s[0]]+': '+s[1]+'</div>').join('')+'</div>';
  showModal(h);
}
function travel(pth,dest){
  UI.trav=true;const mk=$('mk');let i=0,t=0;
  const finish=()=>{clearInterval(iv);UI.trav=false;G.loc=dest;save();UI.node=dest;UI.msg='';renderBoard();};
  const iv=setInterval(()=>{
    if(!modal.classList.contains('on')){finish();return;}
    if(i>=pth.length){finish();return;}
    const e=pth[i].e,fwd=pth[i].fwd,A=fwd?NODES[e.a]:NODES[e.b],B=fwd?NODES[e.b]:NODES[e.a];
    const tm=$('tmsg');if(tm)tm.textContent='Traveling: '+e.n+' ('+e.d+' day'+(e.d>1?'s':'')+')';
    t+=.04;const pt=bez([A.x,A.y],e.c,[B.x,B.y],Math.min(1,t));if(mk)mk.setAttribute('transform','translate('+pt[0]+' '+(pt[1]-30)+')');
    if(t>=1){G.day=(G.day||1)+e.d;t=0;i++;}
  },30);
}
function renderBrief(id){
  const m=MBY[id],done=!!G.done[id],xp=Math.round((60+35*m.lvl)*(m.type==='side'?.6:1)*(done?.4:1));
  let h=hdr(m.title,m.type==='main'?'MAIN QUEST':'SIDE QUEST');
  h+='<div class="card"><p style="font-size:13px">'+m.desc+'</p><p>Region: <b>'+REG[m.reg].n+'</b></p><p>Recommended level: <b style="color:'+(G.lvl<m.lvl?'#ff7a6a':'#6fe07a')+'">'+m.lvl+'</b> (you are Lv '+G.lvl+')</p><p>Rewards: ~'+xp+' XP, gold, and loot'+(done?'':', plus story choices that move your compass')+'.</p>'+(done?'<p class="dn">Replay: reduced XP, story choices skipped. Good for farming gear.</p>':'')+'</div>';
  const cp=m.areas&&G.checkpoint&&G.checkpoint.id===id?G.checkpoint:null;
  if(m.areas)h+='<div class="card"><b>'+m.areas.length+' connected battlefields</b> &middot; Multiple objectives &middot; Checkpoint saves'+(cp?'<p>Checkpoint: '+m.areas[cp.area].title+'</p>':'')+'</div>';
  const there=G.loc===m.loc;if(!there)h+='<div class="card"><p class="dn">You are at '+NODES[G.loc].n+'. This mission is at '+NODES[m.loc].n+'. Travel there on the map first.</p></div>';
  h+='<div class="row" style="display:flex;gap:8px"><button class="bt go'+(there?'':' dim')+'" data-a="begin" data-v="'+id+'" style="flex:1">'+(cp?'RESUME':'BEGIN')+'</button><button class="bt" data-a="'+(there?'board':'showloc')+'" data-v="'+m.loc+'" style="flex:1">'+(there?'BACK':'SHOW ON MAP')+'</button></div>';
  showModal(h);
}
/* ---- bag ---- */
function statsHtml(){const m=S.m;return '<div class="card"><div class="stat">HP '+P.max+' &middot; Mana '+P.mmax+' &middot; Defense '+m.def+' &middot; Crit '+m.crit.toFixed(1)+'% (x'+m.critMul+')</div><div class="stat">Damage +'+(m.dmg+m.allDmg)+'% &middot; Sword +'+m.swordDmg+'% &middot; Staff +'+m.staffDmg+'% &middot; Bow +'+m.bowDmg+'%</div><div class="stat">Life leech '+m.leech.toFixed(1)+'% &middot; Regen '+m.regen.toFixed(1)+'/s &middot; Dodge '+m.dodge+'%</div></div>';}
function cellHtml(it,sel,act,v,slot){
  if(!it)return '<div class="cell" style="border-color:#444;color:#666">'+SLOTG[slot]+'<small>empty</small></div>';
  return '<div class="cell'+(sel?' sel':'')+'" data-a="'+act+'" data-v="'+v+'" style="border-color:'+itemCol(it)+';color:'+itemCol(it)+'">'+SLOTG[it.slot]+'<small>'+(it.slot==='outfit'?it.name.slice(0,11):(it.dmg||it.def||'')+' &middot; i'+it.ilvl)+'</small></div>';
}
function itemCard(it,loc){
  const c=itemCol(it),cur=G.eq[it.slot];
  let h='<div class="card" style="border-color:'+c+'"><h4 style="color:'+c+'">'+it.name+'</h4><div class="stat" style="color:'+c+'">'+RAR[it.rar].n+' '+SLOTN[it.slot]+' &middot; item level '+it.ilvl+'</div>';
  for(const l of itemLines(it))h+='<div class="stat">'+l+'</div>';
  if(it.slot==='outfit'){const d=OBY[it.oid];h+='<div style="margin:6px 0">'+[d.col,d.tab,d.trim,d.cape].map(c=>'<span style="display:inline-block;width:18px;height:18px;margin-right:4px;border:1px solid #000;background:'+c+'"></span>').join('')+'</div>';}
  if(loc==='inv'&&cur&&cur.id!==it.id){const k=it.dmg!=null?'dmg':'def',d=(it[k]||0)-(cur[k]||0);if(it[k]!=null)h+='<div class="stat '+(d>=0?'up':'dn')+'">vs equipped: '+(d>=0?'+':'')+d+' '+(k==='dmg'?'damage':'defense')+'</div>';}
  h+='<div class="row" style="display:flex;gap:8px;margin-top:8px">';
  if(loc==='inv')h+='<button class="bt go" data-a="equip" data-v="'+it.id+'" style="flex:1">EQUIP</button><button class="bt" data-a="sell" data-v="'+it.id+'" style="flex:1">SELL '+sellVal(it)+'g</button>';
  else if(it.slot==='outfit')h+='<span class="stat" style="flex:1">Worn</span><button class="bt" data-a="unequip" data-v="outfit" style="flex:1">TAKE OFF</button>';
  else h+='<span class="stat" style="flex:1">Equipped</span>';
  return h+'</div></div>';
}
function renderBag(){
  let h=hdr('BAG',goldStr());
  h+='<div class="sec">EQUIPPED</div><div class="eq">'+EQSLOTS.map(s=>cellHtml(G.eq[s],UI.sel&&UI.sel.loc==='eq'&&UI.sel.id===(G.eq[s]&&G.eq[s].id),'selEq',s,s)).join('')+'</div>';
  if(UI.sel){const it=UI.sel.loc==='eq'?G.eq[UI.sel.id]:G.inv.find(x=>x.id===UI.sel.id);if(it)h+=itemCard(it,UI.sel.loc);}
  const fl=UI.flt||'all',list=G.inv.filter(i=>fl==='all'||(fl==='outfit'?i.slot==='outfit':i.slot!=='outfit'));
  h+='<div class="sec">INVENTORY ('+G.inv.length+'/28)</div><div class="tabs">'+[['all','ALL'],['gear','GEAR'],['outfit','OUTFITS ('+G.inv.filter(i=>i.slot==='outfit').length+')']].map(f=>'<button class="tb'+(fl===f[0]?' sel':'')+'" data-a="flt" data-v="'+f[0]+'">'+f[1]+'</button>').join('')+'</div><div class="grid">'+list.map(it=>cellHtml(it,UI.sel&&UI.sel.loc==='inv'&&UI.sel.id===it.id,'selInv',it.id)).join('')+'</div>';
  if(G.inv.some(i=>i.rar===0))h+='<button class="bt" data-a="sellcommon" style="width:100%;margin-bottom:10px">SELL ALL COMMON</button>';
  h+=statsHtml();showModal(h);
}
/* ---- skills ---- */
function renderSkills(){
  const tr=UI.tab,T=TREES[tr];let h=hdr('SKILLS','Points: '+G.pts);
  h+='<div class="tabs">'+Object.keys(TREES).map(k=>'<button class="tb'+(k===tr?' sel':'')+'" data-a="tab" data-v="'+k+'" style="border-color:'+TREES[k].col+'">'+TREES[k].n+' ('+spent(k)+')</button>').join('')+'</div>';
  h+='<div class="stat" style="text-align:center;margin-bottom:8px;color:'+T.col+'">'+T.d+'</div>';
  for(let t=1;t<=4;t++){
    const ns=SK.filter(s=>s.tr===tr&&s.tier===t);
    h+='<div class="tier">TIER '+t+(t>1?' &middot; needs '+3*(t-1)+' points in tree':'')+'</div><div class="nodes">';
    for(const s of ns){const r=rank(s.id),ok=canLearn(s);
      h+='<button class="node'+(r?' on':'')+(!r&&!ok?' lk':'')+(UI.selSk===s.id?' sel':'')+'" data-a="selSk" data-v="'+s.id+'" style="border-color:'+(r?T.col:'#555')+'"><b>'+s.n+'</b><small>'+r+'/'+s.max+(s.d()===undefined?'':'')+'</small></button>';}
    h+='</div>';
  }
  const s=SKB[UI.selSk];
  if(s&&s.tr===tr){const r=rank(s.id),ok=canLearn(s);
    h+='<div class="card" style="border-color:'+T.col+'"><h4>'+s.n+' <span class="stat">'+r+'/'+s.max+'</span></h4>'
      +(r?'<div class="stat up">Now: '+s.d(r)+'</div>':'')+(r<s.max?'<div class="stat">Next: '+s.d(r+1)+'</div>':'<div class="stat">Maxed.</div>')
      +(s.req?'<div class="stat" style="opacity:.7">Requires: '+SKB[s.req].n+'</div>':'')
      +'<button class="bt go'+(ok?'':' dim')+'" data-a="learn" data-v="'+s.id+'" style="width:100%;margin-top:8px">LEARN ('+G.pts+' pts)</button></div>';}
  else h+='<div class="card"><p>Tap a skill to read it. Abilities fire from the SKILL button using your equipped weapon.</p></div>';
  h+='<button class="bt'+(G.gold>=respecCost()&&Object.keys(G.sk).length?'':' dim')+'" data-a="respec" style="width:100%">RESPEC ALL ('+respecCost()+'g)</button>';
  showModal(h);
}
/* ---- results / menu ---- */
function openResults(m,first){
  const r=S.rew;S.mode='hub';resetField();document.body.dataset.mode='hub';
  let h='<div class="mh"><h2>'+(first?'MISSION COMPLETE':'MISSION REPLAYED')+'</h2></div><div class="card"><h4>'+m.title+'</h4>';
  h+='<div class="stat">+'+r.xp+' XP &middot; +'+r.gold+' gold'+(r.lv?' &middot; <b style="color:#ffd34a">LEVEL UP x'+r.lv+'</b>':'')+'</div>';
  const dc=Math.round(G.c-r.c0);h+='<div class="stat">Compass: '+(dc>0?'+':'')+dc+' &rarr; '+tier(G.c)+'</div></div>';
  h+='<div class="sec">LOOT ('+r.items.length+')</div>'+(r.items.length?r.items.map(it=>'<div class="card" style="border-color:'+itemCol(it)+';padding:6px 10px"><b style="color:'+itemCol(it)+'">'+it.name+'</b> <span class="stat">'+RAR[it.rar].n+' '+SLOTN[it.slot]+' &middot; '+(it.dmg?it.dmg+' dmg':it.def?it.def+' def':'trinket')+'</span></div>').join(''):'<div class="stat">None.</div>');
  h+='<div class="row" style="display:flex;gap:8px;margin-top:10px"><button class="bt go" data-a="board" style="flex:1">CONTINUE</button><button class="bt" data-a="bag" style="flex:1">BAG</button>'+(G.pts?'<button class="bt" data-a="skills" style="flex:1">SKILLS &#9733;'+G.pts+'</button>':'')+'</div>';
  showModal(h);
}
function renderMenu(){
  let h=hdr('MENU',goldStr());
  h+='<button class="bt go" data-a="close" style="width:100%;margin-bottom:8px">RESUME</button><button class="bt" data-a="bag" style="width:100%;margin-bottom:8px">BAG</button><button class="bt" data-a="skills" style="width:100%;margin-bottom:8px">SKILLS</button><button class="bt" data-a="savegame" style="width:100%;margin-bottom:8px">SAVE GAME</button>';
  if(S.mode==='play')h+='<button class="bt" data-a="abandon" style="width:100%;margin-bottom:8px">ABANDON MISSION</button>';
  h+='<button class="bt" data-a="title" style="width:100%">SAVE &amp; QUIT TO TITLE</button>';
  showModal(h);
}
const ACT={
  close(){if(UI.trav)return;if(S.mode==='play')hideModal();else renderBoard();},
  board(){UI.node=G.loc;UI.msg='';renderBoard();},
  node(v){if(UI.trav)return;UI.node=v;UI.msg='';renderBoard();},
  showloc(v){UI.node=v;UI.msg='';renderBoard();},
  go(v){if(UI.trav)return;const p=findPath(G.loc,v);if(!p){UI.msg='No open route.';renderBoard();return;}UI.msg='';travel(p,v);},
  flt(v){UI.flt=v;renderBag();},
  unequip(v){const it=G.eq[v];if(it){G.eq[v]=null;G.inv.push(it);calc();save();}UI.sel=null;renderBag();hud(true);},
  brief(v){renderBrief(v);},
  begin(v){const cp=G.checkpoint&&G.checkpoint.id===v;fade(()=>startMission(v,!!cp));},
  restart(v){if(G.checkpoint&&G.checkpoint.id===v){G.checkpoint=null;save();}fade(()=>startMission(v,false));},
  bag(){UI.sel=null;renderBag();},
  skills(){renderSkills();},
  menu(){renderMenu();},
  tab(v){UI.tab=v;UI.selSk=null;renderSkills();},
  selSk(v){UI.selSk=v;renderSkills();},
  learn(v){learn(v);renderSkills();hud(true);},
  respec(){if(respec())renderSkills();hud(true);},
  selInv(v){UI.sel={loc:'inv',id:v};renderBag();},
  selEq(v){const it=G.eq[v];UI.sel=it?{loc:'eq',id:it.id}:null;renderBag();},
  equip(v){const it=G.inv.find(x=>x.id===v);if(it){equipItem(it);UI.sel={loc:'eq',id:it.id};}renderBag();hud(true);},
  sell(v){const it=G.inv.find(x=>x.id===v);if(it)sellItem(it);UI.sel=null;renderBag();},
  sellcommon(){G.inv.filter(i=>i.rar===0).forEach(sellItem);UI.sel=null;renderBag();},
  savegame(){save();toast('Game saved');},
  abandon(){hideModal();fade(()=>openBoard());},
  title(){save();hideModal();fade(()=>{resetField();showTitle();});}
};
mw.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;initAudio();const a=t.dataset.a;if(ACT[a])ACT[a](t.dataset.v);});
document.querySelectorAll('#hb [data-m]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const k=b.dataset.m;if(S.mode!=='play')return;if(k==='bag')ACT.bag();else if(k==='skills')ACT.skills();else renderMenu();}));

/* ================= TITLE / NEW GAME ================= */
function showTitle(){
  S.mode='title';document.body.dataset.mode='title';S.pal='day';buildLayers('day');$('boot').style.display='none';
  $('title').style.display='flex';let h='';
  if(hasSave())h+='<button class="bt go" id="bcont">CONTINUE</button>';h+='<button class="bt" id="bnew">NEW GAME</button>';
  $('tbtns').innerHTML=h;let armed=false;
  const c=$('bcont');if(c)c.onclick=()=>{initAudio();if(load()){calc();$('title').style.display='none';openBoard();}};
  $('bnew').onclick=function(){if(hasSave()&&!armed){armed=true;this.textContent='TAP AGAIN TO ERASE SAVE';return;}initAudio();newG();startGear();calc();save();$('title').style.display='none';startPrologue();};
}
function startPrologue(){
  S.mode='prologue';document.body.dataset.mode='prologue';S.pro.x=W*.55+40;S.cam=40;resetField();
  say([N('Auremark. Sixteen years ago. The *Night* of *Ash*.'),
       N('King Roderan lay *poisoned* by the very man sworn to guard his throne.'),
       N('Regent *Maldric* Vane burned the royal nursery. The kingdom was told the infant prince had *perished*.'),
       N('He had not. Ser *Halvard* carried the last *Aldaris* through the flames.')],()=>fade(()=>startMission('m0')));
}

/* ================= iOS ZOOM GUARD ================= */
/* Safari can ignore user-scalable=no and interpret fast repeated taps as page zoom.
   Keep rapid presses actionable (pointerdown handlers still run), but cancel the
   second synthetic click/tap zoom. Do not interfere with scrolling in menus. */
(function(){
  let previousTap=0,previousX=-1000,previousY=-1000;
  document.addEventListener('touchend',function(e){
    if(document.body.dataset.mode!=='play'||modal.classList.contains('on')||e.touches.length||e.changedTouches.length!==1){
      previousTap=0;return;
    }
    const tap=e.changedTouches[0],now=Date.now();
    const repeat=now-previousTap<380&&Math.abs(tap.clientX-previousX)<36&&Math.abs(tap.clientY-previousY)<36;
    previousTap=now;previousX=tap.clientX;previousY=tap.clientY;
    if(repeat&&e.cancelable)e.preventDefault();
  },{passive:false});
  document.addEventListener('dblclick',function(e){
    if(document.body.dataset.mode==='play'&&!modal.classList.contains('on'))e.preventDefault();
  },{passive:false});
  ['gesturestart','gesturechange'].forEach(function(type){
    document.addEventListener(type,function(e){
      if(document.body.dataset.mode==='play'&&!modal.classList.contains('on'))e.preventDefault();
    },{passive:false});
  });
})();

/* ================= INPUT ================= */
document.querySelectorAll('[data-k]').forEach(b=>{
  const k=b.dataset.k,up=()=>{keys[k]=0;b.classList.remove('on');};
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();initAudio();keys[k]=1;b.classList.add('on');if(k==='use'){if(!adventureUse())useMissionObject();keys.use=0;}if(k==='jump')adventureJump();try{b.setPointerCapture(e.pointerId);}catch(_){}});
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
});
document.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();setW(+b.dataset.w);}));
$('mode').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();toggleMode();});
$('panel').addEventListener('pointerdown',e=>{if(e.target.closest('.opt'))return;adv();});
cv.addEventListener('pointerdown',()=>{if(S.talk)adv();});
const KM={ArrowUp:'jump',w:'jump',W:'jump',Shift:'block',x:'use',X:'use',ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r',j:'atk',J:'atk',z:'atk',Z:'atk',e:'abl',E:'abl',f:'abl',F:'abl'};
addEventListener('keydown',e=>{
  if(modal.classList.contains('on')){if(e.key==='Escape'&&S.mode==='play')hideModal();return;}
  if(S.mode!=='play'&&S.mode!=='prologue')return;
  if(e.key==='Enter'||(e.key===' '&&S.talk)){adv();e.preventDefault();return;}
  if(e.key===' '){keys.atk=1;e.preventDefault();return;}
  if(KM[e.key]){keys[KM[e.key]]=1;if(KM[e.key]==='use'&&!e.repeat){if(!adventureUse())useMissionObject();keys.use=0;}if(KM[e.key]==='jump'&&!e.repeat)adventureJump();e.preventDefault();}
  if(e.key==='1')setW(0);if(e.key==='2')setW(1);if(e.key==='3')setW(2);if(e.key==='q'||e.key==='Q')toggleMode();
  if(e.key==='b'||e.key==='B')ACT.bag();if(e.key==='k'||e.key==='K')ACT.skills();if(e.key==='Escape')renderMenu();
});
addEventListener('keyup',e=>{if(e.key===' ')keys.atk=0;if(KM[e.key])keys[KM[e.key]]=0;});
let rzT=0;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{layout();LAYKEY='';buildLayers(S.mode==='prologue'?'ash':S.pal);},120);});

/* ================= LOOP ================= */
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);draw();hud();requestAnimationFrame(frame);}
layout();if(hasSave())load();calc();showTitle();requestAnimationFrame(frame);
window.__G={S,P,G,get enemies(){return enemies;},get drops(){return drops;},ACT,setW,toggleMode,adv,attack,startMission,openBoard,gainXP,genItem,addItem,calc,learn,keys,useAbility,renderBoard,renderBag,renderSkills,get W(){return W;},get H(){return H;},get GY(){return GY;},adventureJump,adventureUse,adventureNear,useMissionObject,loadMissionArea,missionHud};
