/* ================= CORE ================= */
const cv=document.getElementById('cv');let g=cv.getContext('2d');
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
let _s=11;const rnd=()=>{_s=(_s*16807)%2147483647;return (_s-1)/2147483646;};
const mkr=seed=>{let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};};
const hex2=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
const toHex=a=>'#'+a.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
function sh(h,f){const t=f<0?0:255,p=Math.abs(f);return toHex(hex2(h).map(v=>v+(t-v)*p));}
function mix(a,b,t){const A=hex2(a),B=hex2(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t));}
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};

const tier=c=>c>=70?'The Beloved':c>=30?'The Just':c>-30?'The Wanderer':c>-70?'The Iron Hand':'The Monster King';
let W=200,H=400,SC=2,GY=320,HZ=256;
function layout(){
  const vw=innerWidth,vh=innerHeight,portrait=vh>vw;
  SC=Math.max(2,Math.round(Math.min(vw,vh)/200));
  W=Math.ceil(vw/SC);H=Math.ceil(vh/SC);
  cv.width=W;cv.height=H;cv.style.width=W*SC+'px';cv.style.height=H*SC+'px';
  let sab=0;try{sab=parseFloat(getComputedStyle($('sabprobe')).paddingBottom)||0;}catch(e){}
  const reserve=((portrait?186:96)+sab)/SC;
  GY=Math.max(Math.round(H*.55),Math.round(H-reserve-6));
  HZ=GY-70;
  g.imageSmoothingEnabled=false;
}

/* ---------- audio ---------- */
let AC=null;
function initAudio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
function sfx(f,d,type,v){if(!AC)return;try{const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=type||'square';o.frequency.value=f;gn.gain.setValueAtTime(v||.04,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d);}catch(e){}}

/* ---------- persistent game data ---------- */
const SAVEKEY='hiddencrown.save.v2';
const G={};
function defaultsG(){return {lvl:1,xp:0,pts:0,gold:0,sk:{},inv:[],eq:{sword:null,staff:null,bow:null,armor:null,trinket:null,outfit:null},loc:'hearth',day:1,c:0,flags:{},done:{},kills:0,ng:0,hasSave:1,checkpoint:null,shieldTier:-1,sq:1,stash:[]};}
function newG(){Object.assign(G,defaultsG());}
let NOSAVE=false; // set by the ?chapter=N test shortcut so a preview never overwrites a real save
/* ---------- save system (v0.7.1) ----------
   Key stays 'hiddencrown.save.v2' so existing progress keeps loading. Format changes are additive only:
   a 'ver' field is stamped on every write and old saves are migrated forward in memory. */
const SAVE_VER=3,BAKKEY='hiddencrown.save.v2.bak',PROBEKEY='hiddencrown.probe';
const SAVESTAT={ok:true,checked:false,err:'',lastOk:0,mem:'',notice:'',onFail:null};
function storageProbe(){
  try{localStorage.setItem(PROBEKEY,'1');const r=localStorage.getItem(PROBEKEY)==='1';localStorage.removeItem(PROBEKEY);SAVESTAT.ok=r;SAVESTAT.err=r?'':'storage returned no data';}
  catch(e){SAVESTAT.ok=false;SAVESTAT.err=String(e&&e.name||e||'blocked');}
  SAVESTAT.checked=true;return SAVESTAT.ok;
}
function noteFail(e){const was=SAVESTAT.ok;SAVESTAT.ok=false;SAVESTAT.err=String(e&&e.name||e||'blocked');if((was||!SAVESTAT.warned)&&SAVESTAT.onFail){SAVESTAT.warned=true;SAVESTAT.onFail();}}
function save(){
  if(NOSAVE)return false;
  G.ver=SAVE_VER;let str;
  try{str=JSON.stringify(G);}catch(e){noteFail(e);return false;}
  SAVESTAT.mem=str; // always keep the latest state so it can still be exported when storage is blocked
  try{localStorage.setItem(SAVEKEY,str);SAVESTAT.ok=true;SAVESTAT.err='';SAVESTAT.lastOk=Date.now();return true;}
  catch(e){noteFail(e);return false;}
}
const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const numOr=(v,d,lo,hi)=>{v=typeof v==='number'&&isFinite(v)?v:d;if(lo!==undefined)v=Math.max(lo,v);if(hi!==undefined)v=Math.min(hi,v);return v;};
function fixItem(it,slotHint){
  const o=Object.assign({},it);
  o.id=(typeof o.id==='string'||typeof o.id==='number')?String(o.id):'fx'+Math.floor(Math.random()*1e9).toString(36);
  o.slot=typeof o.slot==='string'?o.slot:(slotHint||'trinket');
  o.name=typeof o.name==='string'?o.name:'Worn Relic';
  o.rar=Math.floor(numOr(o.rar,0,0,4));o.ilvl=Math.floor(numOr(o.ilvl,1,1,99));
  if('dmg' in o)o.dmg=numOr(o.dmg,0,0);if('def' in o)o.def=numOr(o.def,0,0);
  o.aff=Array.isArray(o.aff)?o.aff.filter(a=>isObj(a)&&typeof a.k==='string'&&typeof a.v==='number'&&isFinite(a.v)):[];
  return o;
}
/* Validate + repair a parsed save. Returns {g,notes} or null when it is not a recognisable save. */
function sanitizeSave(p){
  if(!isObj(p))return null;
  if(!('lvl' in p||'inv' in p||'flags' in p||'loc' in p))return null;
  const d=defaultsG();
  const notes=[],o=Object.assign({},d,p);
  const fix=(k,v)=>{if(o[k]!==v){notes.push(k);o[k]=v;}};
  fix('lvl',Math.floor(numOr(o.lvl,1,1,99)));fix('xp',numOr(o.xp,0,0));fix('pts',Math.floor(numOr(o.pts,0,0)));fix('gold',Math.floor(numOr(o.gold,0,0)));
  fix('day',Math.floor(numOr(o.day,1,1)));fix('kills',Math.floor(numOr(o.kills,0,0)));fix('c',numOr(o.c,0,-100,100));
  if(!isObj(o.sk))fix('sk',{});if(!isObj(o.flags))fix('flags',{});if(!isObj(o.done))fix('done',{});
  if(!isObj(o.eq))fix('eq',Object.assign({},d.eq));
  o.eq=Object.assign({},o.eq);
  ['sword','staff','bow','armor','trinket','outfit'].forEach(k=>{if(!(k in o.eq))o.eq[k]=null;else if(o.eq[k]&&!isObj(o.eq[k])){o.eq[k]=null;notes.push('eq.'+k);}else if(o.eq[k])o.eq[k]=fixItem(o.eq[k],k);});
  ['inv','stash'].forEach(k=>{if(!Array.isArray(o[k]))fix(k,[]);else{const n=o[k].filter(isObj);if(n.length!==o[k].length)notes.push(k);o[k]=n.map(x=>fixItem(x));}});
  if(typeof o.loc!=='string')fix('loc','hearth');
  if(o.checkpoint&&!isObj(o.checkpoint))fix('checkpoint',null);
  if(!isObj(o.opts)&&o.opts!==undefined)fix('opts',{});
  return {g:o,notes};
}
/* Bring an older save forward. Never drops fields; only adds/derives what newer builds expect. */
function migrateSave(o){
  const from=o.ver||2;
  if(!o.sq){o.sq=0;o.stash=o.stash||[];o.flags=o.flags||{};o.flags.knighted=1;} // pre-squire-kit saves: already knighted
  o.hasSave=1;o.ver=SAVE_VER;return from;
}
function applySave(o){Object.keys(G).forEach(k=>delete G[k]);newG();Object.assign(G,o);}
/* parse raw text → {ok,g,notes,from} or {ok:false,err} */
function parseSave(str){
  let p;try{p=JSON.parse(str);}catch(e){return {ok:false,err:'not valid save data'};}
  const r=sanitizeSave(p);if(!r)return {ok:false,err:'not a Hidden Crown save'};
  const from=migrateSave(r.g);return {ok:true,g:r.g,notes:r.notes,from:from};
}
const LOADINFO={src:'',notes:[],from:0,err:''};
function load(){
  LOADINFO.src='';LOADINFO.notes=[];LOADINFO.err='';
  let raw=null;try{raw=localStorage.getItem(SAVEKEY);}catch(e){}
  if(!raw&&SAVESTAT.mem&&!SAVESTAT.ok)raw=SAVESTAT.mem; // blocked storage: resume from this session's in-memory copy
  if(!raw)return false;
  let r=parseSave(raw);
  if(!r.ok){ // damaged primary → try the pre-overwrite backup
    LOADINFO.err=r.err;let bak=null;try{bak=localStorage.getItem(BAKKEY);}catch(e){}
    r=bak?parseSave(bak):r;if(!r.ok)return false;LOADINFO.src='backup';
  }else LOADINFO.src='save';
  LOADINFO.notes=r.notes;LOADINFO.from=r.from;applySave(r.g);return true;
}
function hasSave(){try{return !!localStorage.getItem(SAVEKEY);}catch(e){return false;}}
function hasBackup(){try{return !!localStorage.getItem(BAKKEY);}catch(e){return false;}}
/* Copy whatever is currently stored to the backup slot (called before a New Game or an import overwrites it). */
function backupSave(){try{const cur=localStorage.getItem(SAVEKEY);if(cur){localStorage.setItem(BAKKEY,cur);return true;}}catch(e){}
  if(SAVESTAT.mem){try{localStorage.setItem(BAKKEY,SAVESTAT.mem);return true;}catch(e){}}return false;}
function restoreBackup(){try{const b=localStorage.getItem(BAKKEY);if(!b)return false;const r=parseSave(b);if(!r.ok)return false;const cur=localStorage.getItem(SAVEKEY);applySave(r.g);save();if(cur)localStorage.setItem(BAKKEY,cur);return true;}catch(e){return false;}}
/* ---------- export / import: HC3-<base64 json>-<fnv1a hex> ---------- */
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ('00000000'+h.toString(16)).slice(-8);}
function exportCode(){G.ver=SAVE_VER;const j=JSON.stringify(G);const b=btoa(unescape(encodeURIComponent(j)));return 'HC3-'+b+'-'+fnv(b);}
function importCode(code){
  code=String(code||'').replace(/\s+/g,'');
  const m=/^HC(\d)-([A-Za-z0-9+/=]+)-([0-9a-f]{8})$/.exec(code);
  if(!m)return {ok:false,err:'That is not a Hidden Crown save code.'};
  if(fnv(m[2])!==m[3])return {ok:false,err:'The code is damaged or incomplete (checksum mismatch).'};
  let j;try{j=decodeURIComponent(escape(atob(m[2])));}catch(e){return {ok:false,err:'The code could not be decoded.'};}
  const r=parseSave(j);if(!r.ok)return {ok:false,err:'The code does not contain a valid save.'};
  return r;
}
newG();

/* ---------- runtime state ---------- */
const keys={l:0,r:0,atk:0,abl:0,use:0,jump:0,block:0};
const S={mode:'title',t:0,cam:0,talk:false,choosing:false,q:[],qcb:null,arena:false,arenaL:0,arenaR:0,spawnQ:[],spawnT:0,curList:null,waveCb:null,dusk:false,blight:.08,npc:null,shake:0,mission:null,replay:false,beats:[],bi:0,chests:[],pal:'day',paused:false,pro:{x:60},rew:null,tm:[],m:{},ilvl:1,boost:0};
const P={x:30,face:1,hp:100,max:100,mp:30,mmax:30,w:0,cd:0,atk:0,atkMax:.2,inv:0,hurt:0,vx:0,mv:false,ab:0,abMax:6,shield:0,lastHeal:0,py:0,vy:0,grounded:true,guard:100};
const FOL=[{x:0,face:1,mv:false,k:'halv'},{x:0,face:1,mv:false,k:'lysa'}];
let enemies=[],proj=[],parts=[],drops=[],fxs=[];
const later=(s,fn)=>S.tm.push({t:s,fn});
