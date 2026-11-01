/* ================= CORE ================= */
const cv=document.getElementById('cv'),g=cv.getContext('2d');
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
  const reserve=(portrait?186:96)/SC;
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
function newG(){Object.assign(G,{lvl:1,xp:0,pts:0,gold:0,sk:{},inv:[],eq:{sword:null,staff:null,bow:null,armor:null,trinket:null,outfit:null},loc:'hearth',day:1,c:0,flags:{},done:{},kills:0,ng:0,hasSave:1,checkpoint:null,shieldTier:-1,sq:1,stash:[]});}
function save(){try{localStorage.setItem(SAVEKEY,JSON.stringify(G));}catch(e){}}
function load(){try{const s=localStorage.getItem(SAVEKEY);if(!s)return false;newG();const p=JSON.parse(s);Object.assign(G,p);
  // Saves from before the squire-kit change keep their gear and look (treated as already knighted).
  if(!p.sq){G.sq=0;G.stash=[];G.flags=G.flags||{};G.flags.knighted=1;}return true;}catch(e){return false;}}
function hasSave(){try{return !!localStorage.getItem(SAVEKEY);}catch(e){return false;}}
newG();

/* ---------- runtime state ---------- */
const keys={l:0,r:0,atk:0,abl:0,use:0,jump:0,block:0};
const S={mode:'title',t:0,cam:0,talk:false,choosing:false,q:[],qcb:null,arena:false,arenaL:0,arenaR:0,spawnQ:[],spawnT:0,curList:null,waveCb:null,dusk:false,blight:.08,npc:null,shake:0,mission:null,replay:false,beats:[],bi:0,chests:[],pal:'day',paused:false,pro:{x:60},rew:null,tm:[],m:{},ilvl:1,boost:0};
const P={x:30,face:1,hp:100,max:100,mp:30,mmax:30,w:0,cd:0,atk:0,atkMax:.2,inv:0,hurt:0,vx:0,mv:false,ab:0,abMax:6,shield:0,lastHeal:0,py:0,vy:0,grounded:true,guard:100};
const FOL=[{x:0,face:1,mv:false,k:'halv'},{x:0,face:1,mv:false,k:'lysa'}];
let enemies=[],proj=[],parts=[],drops=[],fxs=[];
const later=(s,fn)=>S.tm.push({t:s,fn});
