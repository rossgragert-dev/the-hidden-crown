/* ================= FX / DIALOGUE ================= */
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2000);}
function floatTxt(x,y,txt,col,big){fxs.push({k:'t',x,y,txt,col:col||'#fff',big,life:1,vy:-26});}
function burst(x,y,c,n,sp){for(let i=0;i<n;i++)parts.push({k:'s',x,y,vx:(rnd()-.5)*sp,vy:-rnd()*sp*.8,life:.35+rnd()*.3,max:.65,c});}
function ring(x,y,max,col){fxs.push({k:'r',x,y,r:4,max,col,life:.45});}
const cap=$('cap'),chb=$('ch');let line=null;
function say(lines,cb){S.q=lines.slice();S.qcb=cb||null;S.talk=true;S.choosing=false;nextLine();}
function nextLine(){
  if(!S.q.length){cap.classList.remove('show');line=null;S.talk=false;const cb=S.qcb;S.qcb=null;if(cb)cb();return;}
  const l=S.q.shift();line={who:l.who,words:l.text.split(' '),idx:0,t:0,done:false};
  cap.classList.add('show');cap.classList.toggle('nar',!l.who);renderLine();
}
function renderLine(){
  const ps=line.words.slice(0,line.idx).map(w=>w.replace(/\*(.+?)\*/g,'<b>$1</b>'));
  cap.innerHTML=(line.who?'<i>'+line.who+'</i>':'')+ps.join(' ')+(line.done?'<span class="tip">&#9660; tap</span>':'');
}
function adv(){if(S.choosing||!line||S.paused)return;if(!line.done){line.idx=line.words.length;line.done=true;renderLine();}else nextLine();}
function choose(prompt,opts){
  // Choices belong to the encounter just finished. Keep its actor and
  // the current camera position visible until the player decides.
  S.choiceCam=S.cam;S.choiceX=P.x;
  if(S.choiceActor&&!S.npc){
    const actor=S.choiceActor;
    S.npc={k:actor.k,x:P.x+27,face:-1,style:actor.style||null};
  }
  S.talk=true;S.choosing=true;line=null;cap.classList.add('show');cap.classList.remove('nar');cap.innerHTML=prompt;chb.innerHTML='';
  opts.forEach(o=>{const b=document.createElement('button');b.className='opt';b.innerHTML='<b>'+o.label+'</b><small>'+o.desc+'</small>';
    b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.addEventListener('click',()=>{chb.innerHTML='';S.choosing=false;S.talk=false;S.choiceActor=null;S.choiceCam=null;cap.classList.remove('show');o.fn();});chb.appendChild(b);});
}
function typeTick(dt){if(!line||line.done)return;line.t+=dt;let c=false;while(line.t>.055){line.t-=.055;line.idx++;c=true;if(line.idx>=line.words.length){line.done=true;break;}}if(c)renderLine();}
function shift(d,label){G.c=clamp(G.c+d,-100,100);if(label)toast(label+'  '+(d>0?'+':'')+Math.round(d));}
function fade(cb){const f=$('fade');f.classList.add('on');setTimeout(()=>{cb();setTimeout(()=>f.classList.remove('on'),250);},850);}

/* ================= MISSION FLOW ================= */
function resetField(){adventureEnd();enemies=[];proj=[];drops=[];fxs=[];parts=[];S.chests=[];S.npc=null;S.arena=false;S.activeInteract=null;S.guard=null;S.choiceCam=null;S.choiceActor=null;keys.use=0;S.talk=false;S.choosing=false;S.q=[];line=null;S.tm=[];cap.classList.remove('show');chb.innerHTML='';}
function startMission(id,resume){
  const m=MBY[id];if(!m)return;
  S.mission=m;S.replay=!!G.done[id];S.ilvl=m.lvl;S.boost=0;
  S.rew={xp:0,gold:0,items:[],lv:0,c0:G.c};
  $('title').style.display='none';hideModal();resetField();S.mode='play';document.body.dataset.mode='play';
  calc();P.hp=P.max;P.mp=P.mmax;P.inv=1;P.shield=0;P.ab=0;P.vx=0;
  FOL[0].k=(G.flags.halvardStands&&G.done.m11)?'ione':'halv';
  const cp=resume&&G.checkpoint&&G.checkpoint.id===id?G.checkpoint:null;
  loadMissionArea(cp&&m.areas?clamp(cp.area,0,m.areas.length-1):0);
}
function loadMissionArea(idx){
  const m=S.mission,area=m.areas?m.areas[idx]:null;
  resetField();S.areaIndex=idx;S.areaData=area;S.goalsDone={};
  S.pal=REG[area&&area.reg?area.reg:m.reg].pal;
  S.blight=S.pal==='fen'?.1:.06+.012*m.lvl;
  P.x=30;P.face=1;P.vx=0;P.inv=1;S.cam=0;P.guard=100;
  S.beats=(area?area.steps:m.steps).map((st,i)=>({x:30+i*270,st,i}));S.bi=0;
  S.beats.forEach(b=>{if(b.st.t==='chest')S.chests.push({x:b.x+46,open:false,bx:b.x});});
  FOL[0].x=2;FOL[1].x=-14;adventureBegin(area||{});const jump=$('jumpbtn');if(jump)jump.style.display='flex';buildLayers(S.pal);hud(true);missionHud(true);
  if(area)toast('CHAPTER '+(idx+1)+' / '+m.areas.length+': '+area.title);
}
function endMissionArea(){
  const m=S.mission;
  if(m.type==='lab'){hideModal();fade(()=>openBoard());return;}
  if(m.type==='travel'){
    if(S.areaIndex>=m.areas.length-1){
      G.loc=m.endLoc;G.day=(G.day||1)+m.travelDays;save();
      toast('ARRIVED AT '+NODES[m.endLoc].n.toUpperCase());
      fade(()=>openBoard());return;
    }
    const next=S.areaIndex+1;
    fade(()=>{if(S.mission===m&&S.mode==='play')loadMissionArea(next);});
    return;
  }
  if(!m.areas||S.areaIndex>=m.areas.length-1){completeMission();return;}
  const idx=S.areaIndex+1;
  G.checkpoint={id:m.id,area:idx};save();
  P.hp=Math.min(P.max,P.hp+Math.round(P.max*.25));
  P.mp=Math.min(P.mmax,P.mp+Math.round(P.mmax*.3));
  fade(()=>{if(S.mission===m&&S.mode==='play')loadMissionArea(idx);});
}
function missionHud(force){
  const box=$('objtrack');if(!box)return;
  if(S.mode!=='play'||!S.areaData){box.style.display='none';return;}
  const a=S.areaData,goals=S.beats.filter(b=>b.st.goal);
  const current=goals.find(b=>!S.goalsDone[b.i]);
  const label=S.joust?(S.joust.role==='rider'?'Pass '+S.joust.round+'/'+S.joust.passes+': tap COUCH when the foe lowers his lance':'Pass '+S.joust.round+'/'+S.joust.passes+': tap USE as the rider reaches your hand'):current?current.st.goal:'Proceed to the next area';
  const count=goals.filter(b=>S.goalsDone[b.i]).length;
  const guard=S.guard?' | '+S.guard.name+' '+Math.max(0,Math.ceil(S.guard.hp))+'/'+S.guard.max:'';
  const html=(S.areaIndex+1)+'/'+S.mission.areas.length+'  '+a.title+'  ('+count+'/'+goals.length+')'+guard+'|'+label;
  if(force||box.dataset.text!==html){
    box.dataset.text=html;box.textContent='';
    const strong=document.createElement('strong');strong.textContent=html.split('|')[0];
    const small=document.createElement('span');small.textContent=html.split('|')[1];
    box.appendChild(strong);box.appendChild(small);
  }
  box.style.display=S.talk||enemies.some(e=>e.boss&&!e.dead)?'none':'block';
}
function useMissionObject(){
  if(S.adv)return adventureUse();
  const ob=S.activeInteract;if(!ob||S.talk||S.arena||Math.abs(P.x-ob.x)>28)return false;
  S.activeInteract=null;keys.use=0;sfx(560,.16,'triangle',.05);
  if(ob.st.flag)G.flags[ob.st.flag]=1;
  if(ob.st.lines)say(LN(ob.st.lines),ob.done);else ob.done();
  return true;
}
function hurtGuard(n){
  if(!S.guard)return;
  S.guard.hp=Math.max(0,S.guard.hp-n);missionHud(true);
  if(S.guard.hp>0)return;
  toast(S.guard.name.toUpperCase()+' BREACHED — RETRY DEFENSE');
  S.guard.hp=S.guard.max;enemies=[];proj=[];
  S.spawnQ=S.curList.map(o=>({...o}));S.spawnT=-1;
  P.x=S.guard.x+22;P.inv=1.5;
}

const LN=x=>typeof x==='function'?x():x;
function runStep(b){
  const st=b.st,last=b.i===S.beats.length-1,fin=()=>{
    if(st.flag)G.flags[st.flag]=1;
    if(st.goal)S.goalsDone[b.i]=true;
    missionHud(true);
    if(last){endMissionArea();return;}
    // Story choices should appear while the speaker/defeated opponent is still
    // on screen. Older quests put them 270 world units after the previous event.
    if(S.beats[S.bi]&&S.beats[S.bi].st.t==='choice'&&!S.arena&&!S.talk){
      const next=S.beats[S.bi++];
      runStep(next);
    }
  };
  switch(st.t){
   case 'explore':{if(st.intro)say(LN(st.intro),()=>missionHud(true));else missionHud(true);break;}
   case 'say':if(st.npc)S.npc={k:st.npc.k,x:P.x+90,face:-1};say(LN(st.lines),fin);break;
   case 'toast':toast(st.text);fin();break;
   case 'wave':{S.npc=null;const go=()=>wave(st.list,()=>{if(st.outro)say(LN(st.outro),fin);else fin();});if(st.intro)say(LN(st.intro),go);else go();break;}
   case 'defend':{
     const go=()=>{
       S.guard={x:P.x-24,hp:st.hp||110,max:st.hp||110,name:st.target||'Ward'};
       wave(st.list,()=>{S.guard=null;missionHud(true);if(st.outro)say(LN(st.outro),fin);else fin();});
       missionHud(true);
     };
     if(st.intro)say(LN(st.intro),go);else go();break;
   }
   case 'interact':
     S.npc=null;S.activeInteract={x:b.x+110,st,done:fin};
     toast('REACH '+st.name.toUpperCase()+' AND TAP USE');break;
   case 'choice':if(S.replay){S.npc=null;fin();break;}
     choose(st.prompt,st.opts.map(o=>({label:o.label,desc:o.desc,fn:()=>applyChoice(o,fin)})));break;
   case 'chest':{const run=()=>{openChest(b,st.boost||0,st.out);fin();};if(st.lines)say(LN(st.lines),run);else run();break;}
   case 'loot':{const run=()=>{giveLoot(st);fin();};if(st.lines)say(st.lines,run);else run();break;}
  }
}
function applyChoice(o,fin){
  S.npc=null;
  if(o.c)shift(o.c,o.cl);
  if(o.flag)G.flags[o.flag]=1;
  if(o.heal)P.hp=Math.min(P.max,P.hp+P.max*o.heal);
  if(o.gold){G.gold+=o.gold;S.rew.gold+=o.gold;floatTxt(P.x,GY-50,'+'+o.gold+' gold','#ffd34a');}
  if(o.xp)gainXP(o.xp);
  if(o.maxhp){G.bhp=(G.bhp||0)+o.maxhp;calc();toast('+'+o.maxhp+' max HP');}
  if(o.maxmp){G.bmp=(G.bmp||0)+o.maxmp;calc();toast('+'+o.maxmp+' max mana');}
  if(o.loot)giveLoot(o.loot);
  if(o.shake){S.shake=.3;sfx(90,.3,'sawtooth',.06);}
  if(o.lines)say(o.lines,fin);else fin();
}
function dropItem(it,x){drops.push({x,y:GY-34,vy:-70,it,g:false,t:0});}
function giveLoot(spec){const it=genItem(S.ilvl+(rnd()<.3?1:0),spec.rar!=null?spec.rar:rollRar(S.boost+1),spec.slot);dropItem(it,P.x+22);}
function openChest(b,boost,out){
  const c=S.chests.find(q=>q.bx===b.x);if(c)c.open=true;sfx(400,.15,'triangle',.05);
  const n=1+(rnd()<.4?1:0),cx=c?c.x:P.x+40;
  for(let i=0;i<n;i++)dropItem(genItem(S.ilvl+(rnd()<.5?1:0),rollRar(S.boost+boost+.6)),cx+(i?10:-4));
  if(rnd()<(out==null?.12:out))dropItem(genItem(1,rollRar(S.boost+boost+.8),'outfit'),cx+14);
  const gd=8+Math.floor(rnd()*12)+S.ilvl*3;G.gold+=gd;if(S.rew)S.rew.gold+=gd;floatTxt(cx,GY-40,'+'+gd+' gold','#ffd34a');
}
function wave(list,cb){
  // Remember the defeated boss for a following mercy / judgment choice.
  // It can be drawn kneeling instead of disappearing before the decision.
  const boss=list.find(o=>o.boss&&EN[o.k]&&EN[o.k].h);
  S.choiceActor=boss?{k:boss.k,style:boss.sp||EN[boss.k].sp}:null;
  S.npc=null;S.arena=true;S.arenaL=Math.max(0,P.x-W*.5);S.arenaR=S.arenaL+W;S.curList=list;S.spawnQ=list.map(o=>({...o}));S.spawnT=0;S.waveCb=cb;S.blight=Math.min(.3,S.blight+.03);
}
function spawn(o){
  const def={...EN[o.k]};if(o.sp&&def.sp)def.sp={...def.sp,...o.sp};if(o.name)def.n=o.name;
  const lv=S.ilvl,hp=def.hp*(1+.16*(lv-1))*(o.hpm||1);
  enemies.push({k:o.k,def,x:o.s>0?S.arenaR+16:S.arenaL-16,face:-o.s,hp,max:hp,dmg:def.dmg*(1+.1*(lv-1))*(o.dmgm||1),cd:.8+rnd(),wind:0,hurt:0,fear:0,stun:0,vx:0,t:rnd()*3,mv:false,dead:false,boss:!!o.boss,xpm:o.hpm?Math.sqrt(o.hpm):1,atkA:0,dashT:0});
}
function completeMission(){
  const m=S.mission;if(!m||S.mode!=='play')return;S.mode='done';
  const first=!G.done[m.id],mul=first?1:.4;
  gainXP(Math.round((60+35*m.lvl)*(m.type==='side'?.6:1)*mul));
  const gd=Math.round((20+12*m.lvl)*(first?1:.5));G.gold+=gd;S.rew.gold+=gd;
  addItem(genItem(m.lvl+1,rollRar(S.boost+(m.type==='main'?1.5:.8))),true);
  G.done[m.id]=1;
  if(m.id===KNIGHT_MISSION&&knightCorin())toast('KNIGHTED BY SER HALVARD — YOUR OLD KIT IS RETURNED');
  if(m.id==='m8'){G.shieldTier=Math.max(G.shieldTier||0,1);toast('KNIGHT SHIELD UNLOCKED');}
  if(m.id==='m12'){G.shieldTier=Math.max(G.shieldTier||0,2);toast('DUSKWARD MIRROR UNLOCKED');}
  if(G.checkpoint&&G.checkpoint.id===m.id)G.checkpoint=null;G.loc=m.endLoc||m.loc||G.loc;save();missionHud(true);
  toast('MISSION COMPLETE');sfx(520,.5,'triangle',.06);
  later(1.4,()=>openResults(m,first));
}

/* ================= COMBAT ================= */
function wBase(t){const it=G.eq[t];return it&&it.dmg?it.dmg:6;}
const TN=['sword','staff','bow'];
function rollHit(w,mul){const m=S.m,t=TN[w];let d=wBase(t)*(1+(m.dmg+m.allDmg+(m[t+'Dmg']||0))/100)*(mul||1)*(.92+rnd()*.16);const crit=rnd()*100<m.crit;if(crit)d*=m.critMul;return [Math.max(1,Math.round(d)),crit];}
function hitEnemy(e,n,crit,dir,kb){
  if(e.dead)return;e.hp-=n;e.hurt=.15;e.vx=dir*(kb+(S.m.kb?70:0));if(e.wind>0&&!e.dashPend&&rnd()<.4)e.wind=0;
  floatTxt(e.x,GY-(e.def.h?54:34)-(e.def.k?18:0),String(n),crit?'#ffd34a':'#fff',crit);burst(e.x,GY-10,'#cfe35a',5,90);sfx(e.hp<=0?80:150,.09,'square',.04);
  if(S.m.leech)P.hp=Math.min(P.max,P.hp+n*S.m.leech/100);
  if(e.hp<=0)killEnemy(e);
}
function killEnemy(e){
  e.dead=true;G.kills++;burst(e.x,GY-10,'#7a9a2a',14,150);
  gainXP(e.def.xp*(1+.15*(S.ilvl-1))*e.xpm);
  const g0=e.def.g,gd=g0[0]+Math.floor(rnd()*(g0[1]-g0[0]+1));G.gold+=gd;if(S.rew)S.rew.gold+=gd;
  if(S.m.healKill)P.hp=Math.min(P.max,P.hp+P.max*S.m.healKill/100);
  if(e.boss){dropItem(genItem(S.ilvl+1,rollRar(S.boost+1.4)),e.x);S.shake=.3;}
  else if(rnd()<e.def.drop){if(rnd()<.06)dropItem(genItem(1,rollRar(S.boost+.5),'outfit'),e.x);else dropItem(genItem(S.ilvl,rollRar(S.boost)),e.x);}
}
// Vertical combat spaces use world Y relative to the floor (0 = ground).
// A hero standing on a raised, solid platform is physically separated from
// ground enemies. Airborne overlap still matters if Corin drops into an enemy.
function enemyCombatHeight(e){return e.def.rat?10:e.def.h?48:e.def.big?33:22;}
function heroAboveEnemyFloor(e){
  return !!(S.adv&&P.grounded&&(P.py||0)<-12&&(e.py||0)>=-2);
}
function heroEnemyOverlap(e){
  if(!S.adv)return true; // keep old flat missions unchanged
  if(heroAboveEnemyFloor(e))return false;
  const feet=P.py||0,ef=e.py||0;
  return feet-1>ef-enemyCombatHeight(e)+2&&feet-44<ef-2;
}
function hostileProjectileHitsHero(pr){
  if(Math.abs(pr.x-P.x)>=8)return false;
  if(!S.adv)return true;
  if(P.grounded&&(P.py||0)<-12&&pr.originGround!==false)return false;
  const y=pr.y-GY,feet=P.py||0;
  return y>=feet-43&&y<=feet-2;
}
function projectileHitsEnemy(pr,e){
  if(Math.abs(pr.x-e.x)>=(e.def.k?16:9))return false;
  if(!S.adv)return true;
  const ey=(e.py||0),y=pr.y-GY;
  return y>=ey-enemyCombatHeight(e)&&y<=ey-1;
}
function hurtPlayer(n,dir){
  if(P.inv>0||S.mode!=='play')return;
  if(keys.block&&G.shieldTier>=0&&P.guard>0&&dir===-P.face){
    const strength=G.shieldTier>=1?.85:.65;
    const absorbed=Math.max(1,Math.round(n*strength));P.guard=Math.max(0,P.guard-absorbed*3);
    n=Math.max(0,n-absorbed);floatTxt(P.x,GY+(P.py||0)-58,'BLOCK','#a5d4ff');
    if(n<=0){P.inv=.18;return;}
  }
  if(rnd()*100<S.m.dodge){floatTxt(P.x,GY-58,'Dodge','#9fd1ff');P.inv=.4;return;}
  let d=Math.max(1,Math.round(n*(100/(100+S.m.def))*(1-S.m.dmgRed/100)));
  if(P.shield>0){const a=Math.min(P.shield,d);P.shield-=a;d-=a;}
  if(d>0){P.hp-=d;floatTxt(P.x,GY-58,'-'+d,'#ff7a6a');}
  P.inv=.7;P.hurt=.25;P.vx=dir*90;S.shake=.15;sfx(100,.15,'sawtooth',.06);
}
function fireProj(w,type,mul,vx,pierce){const [d,c]=rollHit(w,mul);proj.push({x:P.x+P.face*10,y:GY+(P.py||0)-30,vx:P.face*vx,type,dmg:d,crit:c,life:1.6,face:P.face,pierce:pierce||0,hits:[]});}
function attack(){
  if(P.cd>0||S.talk||S.mode!=='play')return;
  if(!G.eq[TN[P.w]])P.w=G.eq.sword?0:G.eq.staff?1:G.eq.bow?2:0;
  let nr=null,nd=1e9;for(const e of enemies){const d=Math.abs(e.x-P.x);if(d<nd){nd=d;nr=e;}}
  if(nr&&nd<120)P.face=nr.x>=P.x?1:-1;
  if(P.w===0){P.cd=.36;P.atk=P.atkMax=.22;sfx(200,.08,'sawtooth');
    for(const e of enemies){const dx=(e.x-P.x)*P.face;if(dx>-8&&dx<(e.def.k?44:34)&&heroEnemyOverlap(e)){const [d,c]=rollHit(0,1);hitEnemy(e,d,c,P.face,80);}}}
  else if(P.w===1){const cost=S.dusk?3:2;if(P.mp<cost){toast('Not enough mana');P.cd=.3;return;}
    P.mp-=cost;P.cd=.6;P.atk=P.atkMax=.26;
    fireProj(1,S.dusk?'dusk':'dawn',S.dusk?1.25*(1+S.m.duskDmg/100):.85,150,S.m.staffPierce?1:0);
    if(S.dusk)G.c=clamp(G.c-1.5,-100,100);else G.c=clamp(G.c+.5,-100,100);sfx(S.dusk?110:520,.2,'triangle',.05);}
  else{P.cd=.5*S.m.bowCd;P.atk=P.atkMax=.18;fireProj(2,'arrow',1,240,S.m.arrowPierce);sfx(320,.07,'square');}
}
function abilityId(){const w=P.w;if(w===0)return rank('whirl')?'whirl':rank('bash')?'bash':null;if(w===1)return rank('nova')?'nova':null;return rank('volley')?'volley':null;}
const ABN={bash:'BASH',whirl:'SPIN',nova:'NOVA',volley:'VOLLEY'};
function useAbility(){
  if(S.talk||P.ab>0||S.mode!=='play')return;const a=abilityId();
  if(!a){toast(P.w===1?'Learn NOVA in SKILLS (Arcana)':P.w===2?'Learn VOLLEY in SKILLS (Wild)':'Learn BASH in SKILLS (Valor)');return;}
  if(a==='bash'){P.ab=P.abMax=6;P.atk=P.atkMax=.25;sfx(120,.2,'square',.06);ring(P.x+P.face*18,GY-20,26,'#e8e8f0');
    for(const e of enemies){const dx=(e.x-P.x)*P.face;if(dx>-10&&dx<48&&heroEnemyOverlap(e)){const [d,c]=rollHit(0,1.2);hitEnemy(e,d,c,P.face,130);e.stun=1.1;}}}
  else if(a==='whirl'){P.ab=P.abMax=9;P.atk=P.atkMax=.35;sfx(160,.3,'sawtooth',.06);ring(P.x,GY-18,52,'#ffffff');
    for(const e of enemies){if(Math.abs(e.x-P.x)<54&&heroEnemyOverlap(e)){const [d,c]=rollHit(0,1.5);hitEnemy(e,d,c,e.x>=P.x?1:-1,110);}}}
  else if(a==='nova'){if(P.mp<8){toast('Not enough mana');return;}P.mp-=8;P.ab=P.abMax=8;P.atk=P.atkMax=.3;sfx(S.dusk?90:620,.4,'triangle',.07);
    ring(P.x,GY-18,78,S.dusk?'#c070ff':'#ffe27a');
    for(const e of enemies){if(Math.abs(e.x-P.x)<80&&heroEnemyOverlap(e)){const [d,c]=rollHit(1,1.4*(S.dusk?1+S.m.duskDmg/100:1));hitEnemy(e,d,c,e.x>=P.x?1:-1,90);if(S.dusk)e.fear=S.m.fear+1.5;}}
    if(!S.dusk){P.hp=Math.min(P.max,P.hp+P.max*.12);burst(P.x,GY-20,'#fff6b0',10,100);}else G.c=clamp(G.c-3,-100,100);}
  else if(a==='volley'){P.ab=P.abMax=8;sfx(340,.1,'square',.05);
    for(let i=0;i<5;i++)later(i*.1,()=>{if(S.mode!=='play')return;P.atk=P.atkMax=.14;fireProj(2,'arrow',.9,260,S.m.arrowPierce);sfx(320+i*20,.06,'square');});}
}
function updateCombat(dt){
  for(const e of enemies){
    e.t+=dt;if(e.hurt>0)e.hurt-=dt;if(e.fear>0)e.fear-=dt;if(e.stun>0)e.stun-=dt;e.cd-=dt;if(e.atkA>0)e.atkA-=dt*4;
    e.x+=e.vx*dt;e.vx*=Math.pow(.02,dt);
    if(S.arena){if(!e.in&&e.x>S.arenaL+8&&e.x<S.arenaR-8)e.in=true;if(e.in)e.x=clamp(e.x,S.arenaL+6,S.arenaR-6);}
    const targetGuard=!!S.guard&&Math.abs(e.x-S.guard.x)<Math.abs(e.x-P.x)+38;const d=(targetGuard?S.guard.x:P.x)-e.x,ad=Math.abs(d),def=e.def,sp=def.spd;e.face=d>=0?1:-1;e.mv=false;
    if(e.stun>0)continue;
    if(e.wind>0){e.wind-=dt;if(e.wind<=0){
      if(e.dashPend){e.dashPend=false;e.vx=e.face*270;e.dashT=.22;e.cd=1.3;e.dashHit=0;e.dashGuard=targetGuard;}
      else if(def.ranged){proj.push({x:e.x+e.face*10,y:GY-30,vx:e.face*130,type:(e.k==='wisp'||e.k==='acolyte'?'dusk':'arrow'),dmg:e.dmg,hostile:1,life:2.2,face:e.face,guard:targetGuard,originGround:(e.py||0)>=-2});e.cd=1.8+rnd()*.6;e.atkA=1;}
      else{e.atkA=1;if(ad<def.rng+10){if(targetGuard)hurtGuard(e.dmg);else if(heroEnemyOverlap(e))hurtPlayer(e.dmg,e.face);}e.cd=1.2+rnd()*.4;}}
      continue;}
    if(e.dashT>0){e.dashT-=dt;if(ad<16&&!e.dashHit){e.dashHit=1;if(e.dashGuard&&S.guard)hurtGuard(e.dmg);else if(heroEnemyOverlap(e))hurtPlayer(e.dmg,e.face);}continue;}
    if(S.arena&&!e.in){e.x+=Math.sign(d)*sp*1.3*dt;e.mv=true;continue;}
    if(e.fear>0){e.x-=Math.sign(d)*sp*dt;e.mv=true;continue;}
    if(def.ranged){const room=e.x>S.arenaL+22&&e.x<S.arenaR-22;if(ad<60&&room){e.x-=Math.sign(d)*sp*dt;e.mv=true;}else if(ad>135){e.x+=Math.sign(d)*sp*dt;e.mv=true;}else if(e.cd<=0)e.wind=.5;continue;}
    if(def.dash&&ad>36&&ad<130&&e.cd<=0){e.wind=.4;e.dashPend=true;continue;}
    if(ad>def.rng){e.x+=Math.sign(d)*sp*dt;e.mv=true;}else if(e.cd<=0)e.wind=.35;
  }
  for(const pr of proj){
    pr.x+=pr.vx*dt;pr.life-=dt;
    if(pr.hostile){if(!pr.guard&&keys.block&&G.shieldTier>=0&&P.guard>=10&&pr.face===-P.face&&hostileProjectileHitsHero(pr)){
      P.guard=Math.max(0,P.guard-13);
      if(G.shieldTier>=2){pr.hostile=0;pr.vx=-pr.vx;pr.face=-pr.face;pr.hits=[];pr.pierce=0;pr.life=2;pr.dmg=Math.round(pr.dmg*1.3);toast('WARD REFLECT');sfx(740,.14,'triangle',.04);continue;}
      pr.life=0;toast('SHIELD BLOCK');sfx(140,.1,'square',.04);continue;
    }if(pr.guard&&S.guard){if(Math.abs(pr.x-S.guard.x)<8){hurtGuard(pr.dmg);pr.life=0;}}else if(hostileProjectileHitsHero(pr)){hurtPlayer(pr.dmg,pr.face);pr.life=0;}continue;}
    for(const e of enemies){if(e.dead||pr.hits.includes(e))continue;if(projectileHitsEnemy(pr,e)){
      pr.hits.push(e);hitEnemy(e,pr.dmg,pr.crit,pr.face,pr.type==='arrow'?40:25);
      if(pr.type==='dawn'){P.hp=Math.min(P.max,P.hp+S.m.dawnHeal);burst(P.x,GY-24,'#fff6b0',4,50);if(S.m.shieldPer)P.shield=Math.min(40,P.shield+S.m.shieldPer);}
      if(pr.type==='dusk')e.fear=S.m.fear;
      if(pr.pierce>0)pr.pierce--;else{pr.life=0;break;}}}
  }
  proj=proj.filter(p=>p.life>0&&p.x>S.cam-30&&p.x<S.cam+W+30);
  enemies=enemies.filter(e=>!e.dead);
}

/* ================= UPDATE ================= */
let smokeT=0;
function update(dt){
  S.t+=dt;typeTick(dt);if(S.shake>0)S.shake-=dt;
  if(S.paused)return;
  for(const t of S.tm)t.t-=dt;const due=S.tm.filter(t=>t.t<=0);S.tm=S.tm.filter(t=>t.t>0);due.forEach(t=>t.fn());
  for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='s')p.vy+=260*dt;p.life-=dt;}parts=parts.filter(p=>p.life>0);
  for(const f of fxs){f.life-=dt;if(f.k==='t')f.y+=f.vy*dt;else f.r=lerp(4,f.max,1-f.life/.45);}fxs=fxs.filter(f=>f.life>0);
  // chimney smoke
  smokeT-=dt;if(smokeT<=0&&LAY&&CHIM.length&&PALS[S.mode==='prologue'?'ash':S.pal].smk){smokeT=.35;const c=CHIM[Math.floor(rnd()*CHIM.length)],cm=S.cam*.72,sx=(((c.x-cm)%560)+560)%560;if(sx<W)parts.push({k:'m',x:cm+sx,y:c.y,vx:5,vy:-9-rnd()*5,life:3.2,max:3.2});}
  const pal=PALS[S.mode==='prologue'?'ash':S.pal];
  if(pal.embers&&S.mode==='prologue'&&rnd()<.6)parts.push({k:'e',x:S.cam+rnd()*W,y:H,vx:8+rnd()*10,vy:-30-rnd()*30,life:2.5,max:2.5,c:'#ff9b2a'});
  if(pal.fireflies&&rnd()<.08)parts.push({k:'e',x:S.cam+rnd()*W,y:GY-10-rnd()*70,vx:(rnd()-.5)*8,vy:-4,life:3,max:3,c:'#e8ff7a'});
  if(S.mode==='title'||S.mode==='hub'){S.cam+=dt*8;P.mv=false;return;}
  if(S.mode==='prologue'){S.pro.x+=dt*16;S.cam=S.pro.x-W*.55;return;}
  if(S.mode==='done'){S.cam=lerp(S.cam,S.cam,0);return;}
  if(S.mode!=='play')return;
  if(S.talk){
    P.mv=false;FOL.forEach(f=>f.mv=false);
    if(S.choosing&&S.choiceCam!=null)S.cam=S.choiceCam;
    return;
  }
  const dir=S.joust?0:(keys.r?1:0)-(keys.l?1:0);P.mv=dir!==0;if(dir)P.face=dir;
  const last=S.adv?S.adv.length:(S.beats.length?S.beats[S.beats.length-1].x+170:300);
  const maxX=S.arena?S.arenaR-12:last,minX=S.arena?S.arenaL+12:10;
  P.x=clamp(P.x+dir*(P.atk>0?32:64)*dt+P.vx*dt,minX,maxX);P.vx*=Math.pow(.02,dt);
  if(!S.adv&&G.shieldTier>=0)P.guard=Math.min(100,P.guard+(keys.block?4:19)*dt);
  if(P.cd>0)P.cd-=dt;if(P.atk>0)P.atk-=dt;if(P.inv>0)P.inv-=dt;if(P.hurt>0)P.hurt-=dt;if(P.ab>0)P.ab-=dt;if(P.shield>0)P.shield=Math.max(0,P.shield-dt*1.5);
  P.mp=Math.min(P.mmax,P.mp+dt*S.m.mpRegen);if(S.m.regen)P.hp=Math.min(P.max,P.hp+S.m.regen*dt);
  if(keys.atk)attack();if(keys.abl)useAbility();if(keys.use)useMissionObject();
  if(S.adv){adventureUpdate(dt);P.guard=Math.min(100,P.guard+(keys.block?4:19)*dt);}
  else if(!P.grounded){
    P.vy=Math.min(460,(P.vy||0)+620*dt);
    P.py+=P.vy*dt;
    if(P.py>=0){P.py=0;P.vy=0;P.grounded=true;}
  }
  if(!S.adv)FOL.forEach((f,i)=>{const tx=P.x-(i?46:28),d=tx-f.x;f.mv=Math.abs(d)>3;f.x+=d*Math.min(1,dt*2.6);f.face=P.face;});
  if(S.arena){S.spawnT+=dt;S.spawnQ=S.spawnQ.filter(o=>{if(S.spawnT>=o.d){spawn(o);return false;}return true;});}
  updateCombat(dt);
  // drops
  for(const d of drops){d.t+=dt;if(!d.g){d.vy+=320*dt;d.y+=d.vy*dt;if(d.y>=GY-6){d.y=GY-6;d.g=true;d.vy=0;}}
    else if(Math.abs(d.x-P.x)<80)d.x+=Math.sign(P.x-d.x)*90*dt;
    if(d.g&&Math.abs(d.x-P.x)<12){d.pick=1;addItem(d.it);if(d.it.rar<3)floatTxt(P.x,GY-64,d.it.name,itemCol(d.it),false);sfx(500+d.it.rar*120,.2,'triangle',.05);if(d.it.rar>=3){burst(P.x,GY-20,itemCol(d.it),18,140);toast(RAR[d.it.rar].n.toUpperCase()+'!  '+d.it.name);}}}
  drops=drops.filter(d=>!d.pick);
  // death
  if(P.hp<=0){toast('Corin falls... and rises again');P.hp=P.max;P.mp=P.mmax;P.inv=1.2;P.shield=0;
    if(S.arena){enemies=[];proj=[];S.spawnQ=S.curList.map(o=>({...o}));S.spawnT=-1;P.x=S.arenaL+30;}}
  if(S.arena&&!S.spawnQ.length&&!enemies.length){S.arena=false;const cb=S.waveCb;S.waveCb=null;if(cb)cb();}
  if(!S.talk&&!S.arena&&!S.activeInteract&&S.bi<S.beats.length&&P.x>=S.beats[S.bi].x){const b=S.beats[S.bi++];runStep(b);}
  const use=$('usebtn');if(use){
    const ob=S.adv?adventureNear():null;
    const near=!!ob||(S.activeInteract&&Math.abs(P.x-S.activeInteract.x)<=28);
    use.style.display=S.joust||S.activeInteract||ob?'flex':'none';
    use.textContent=S.joust?(S.joust.role==='rider'?'COUCH':'OFFER'):'USE';
    const guard=$('blockbtn');if(guard)guard.style.display=G.shieldTier>=0?'flex':'none';
    use.style.opacity=near?'1':'.45';
  }
  missionHud(false);
  const rj=S.joust&&S.joust.role==='rider';
  const tgt=S.arena?S.arenaL:clamp(P.x-W*(rj?.3:.4),0,Math.max(0,last+60-W));
  S.cam=lerp(S.cam,tgt,Math.min(1,dt*(rj?14:6)));
}

/* ================= DRAW ================= */
function heroOpts(){
  const kn=!!G.flags.knighted,a=G.eq.armor,wi=G.eq[TN[P.w]],rc=wi?itemCol(wi):'#e9eef5',hi=wi&&wi.rar>=2,lk=kn&&a?a.look||0:0;
  const o={...NPCS.corin,hero:true,nosh:true,col:a&&a.col?a.col:'#2f5fd0',look:lk,mv:P.mv,w:P.w,atk:P.atk>0?P.atk/P.atkMax:0,hurt:P.hurt,orb:S.dusk?'#c070ff':'#fff3a0',
    wcol:P.w===2?(hi?mix('#9a6a32',rc,.5):'#9a6a32'):(hi?mix('#eef2fa',rc,.5):'#eef2fa'),wglow:wi&&wi.rar>=3?rgba(rc,.4):null,ph:0,quiver:P.w===2?1:0};
  if(lk>=2){o.helm=o.metal;o.crest='plume';o.crestC='#b02a3a';}
  const of=G.eq.outfit&&OBY[G.eq.outfit.oid];
  if(of){o.col=of.col;o.tab=of.tab;o.trim=of.trim;if(of.aura)o.aura=of.aura;
    if(kn){o.cape=of.cape;if(of.metal)o.metal=of.metal;if(of.plume){o.helm=o.metal;o.crest='plume';o.crestC=of.plume;}}}
  if(!kn){o.cloth=1;o.cape=null;o.helm=null;o.crest=null;o.metal='#8a7a5a';if(!of){o.col=a&&a.col?a.col:'#2f5fd0';}}
  if(P.w===0&&wi&&wi.wood)o.wcol='#a97c4a';
  return o;
}
function drawScene(cam){
  g.save();if(S.adv){g.translate(0,-(S.camY||0));adventureWorldDraw(cam);}
  if(S.activeInteract){
    const ix=Math.round(S.activeInteract.x-cam);
    R(ix-9,GY-24,18,24,'#493b29');R(ix-7,GY-22,14,19,'#c9a24a');
    R(ix-4,GY-19,8,13,'#37251e');R(ix-11,GY-29,22,5,'#f4df9b');
    g.fillStyle='#fff7ce';g.font='bold 8px Courier New';g.textAlign='center';
    g.fillText(S.activeInteract.st.name,ix,GY-36);
  }
  if(S.guard){
    const ix=Math.round(S.guard.x-cam);
    R(ix-12,GY-37,24,37,'#6b5541');R(ix-9,GY-34,18,29,'#c8aa6a');
    R(ix-5,GY-29,10,20,'#394d80');
    R(ix-14,GY-43,28,4,'#321d16');
    R(ix-14,GY-43,Math.round(28*S.guard.hp/S.guard.max),4,'#78da82');
  }
  for(const c of S.chests)drawChest(c.x-cam,c.open,S.t);
  for(const d of drops){const x=Math.round(d.x-cam),y=Math.round(d.y),col=itemCol(d.it),pul=.5+.5*Math.sin(S.t*6);
    if(d.g){g.fillStyle=rgba(col,.22+.1*pul);g.fillRect(x-2,y-34,5,34);g.fillStyle=rgba(col,.5);g.fillRect(x,y-34,1,34);}
    R(x-4,y-8,8,8,'#17101a');R(x-3,y-7,6,6,col);R(x-3,y-7,6,2,sh(col,.45));R(x-1,y-5,2,2,'#fff');
    if(d.it.rar>=2&&Math.sin(S.t*8+d.x)>.6)R(x+4,y-12,1,3,'#fff');}
  if(S.areaData&&S.areaData.id==='magegarden')drawPerson(170-cam,GY,1,{...NPCS.ione,w:1,ph:S.t*.2});
  if(S.npc){
    const o=S.npc.style?{...S.npc.style,w:-1,ph:0,mv:false}: {...NPCS[S.npc.k],w:-1,ph:0};
    if(o.col)drawPerson(S.npc.x-cam,GY,S.npc.face,o,S.npc.k==='child'?.72:1);
  }
  if(!S.adv&&S.mode==='play'&&S.mission&&S.mission.showFollowers)FOL.forEach((f,i)=>drawPerson(f.x-cam,GY,f.face,{...NPCS[f.k],mv:f.mv,w:i?2:(f.k==='ione'?1:0),ph:i+1,wcol:i?'#9a6a32':'#eef2fa'}));
  for(const e of enemies)drawEnemy(e,cam,e.def);
  if(!(S.joust&&S.joust.role==='rider'))drawPerson(P.x-cam,GY+(P.py||0),P.face,heroOpts());
  if(keys.block&&G.shieldTier>=0){
    const x=Math.round(P.x-cam+P.face*10),y=Math.round(GY+(P.py||0)-27);
    R(x-5,y-11,10,23,G.shieldTier>=2?'#5ba7ed':G.shieldTier===1?'#9295a2':'#8a643a');
    R(x-3,y-9,6,18,'#34475d');R(x-1,y-7,2,12,'#f0d48b');
    if(G.shieldTier>=2){g.strokeStyle='#9feaff';g.strokeRect(x-8,y-13,16,27);}
  }
  if(P.shield>0){g.strokeStyle='rgba(159,209,255,.7)';g.lineWidth=1;g.strokeRect(Math.round(P.x-cam)-10.5,GY-50.5,21,52);}
  for(const pr of proj){const x=Math.round(pr.x-cam),y=pr.y,f=pr.face;
    if(pr.type==='arrow'){R(x-4,y,9,1,'#d8c8a0');R(f>0?x+5:x-6,y-1,2,3,'#ccc');R(f>0?x-5:x+4,y-1,1,3,pr.hostile?'#a33':'#e0e0e0');}
    else if(pr.type==='dawn'){R(x-4,y-3,9,7,'rgba(255,230,120,.3)');R(x-3,y-2,7,5,'#ffe27a');R(x-2,y-1,5,3,'#fff');R(x-7*f,y,4,1,'rgba(255,240,150,.6)');}
    else{R(x-4,y-3,9,7,'rgba(180,90,255,.3)');R(x-3,y-2,7,5,'#6a22b0');R(x-2,y-1,5,3,'#d27aff');R(x-7*f,y,4,1,'rgba(180,90,255,.6)');}}
  g.restore();
}
function draw(){
  const pk=S.mode==='prologue'?'ash':S.pal;buildLayers(pk);if(!LAY)return;
  const sx=S.shake>0?Math.round((rnd()-.5)*4):0,sy=S.shake>0?Math.round((rnd()-.5)*3):0,cam=Math.floor(S.cam);
  g.save();g.translate(sx,sy);
  if(!adventureBackdrop(cam)&&!storyWorldBackdrop(cam))drawBackdrop(cam,S.t,pk);
  for(const p of parts)if(p.k==='m'){const a=(p.life/p.max)*.42,s=3+(1-p.life/p.max)*9;g.fillStyle='rgba('+PALS[pk].smk+','+a.toFixed(2)+')';g.fillRect(Math.round(p.x-cam*.72-s/2),Math.round(p.y-s/2),Math.round(s),Math.round(s));}
  if(S.mode==='prologue')drawPerson(S.pro.x-cam,GY,1,{...NPCS.halv,mv:true,w:-1,carry:1,ph:0});
  else if(S.mode==='title'||S.mode==='hub'){const hx=cam+W*.5;drawPerson(hx-30,GY,1,{...NPCS.halv,w:-1});drawPerson(hx-14,GY,1,{...NPCS.lysa,w:-1,ph:1});drawPerson(hx,GY,1,{...heroOpts(),mv:false,w:-1});}
  else drawScene(cam);
  for(const p of parts)if(p.k==='s'||p.k==='e'){g.globalAlpha=Math.min(1,p.life/p.max*1.5);R(p.x-cam,p.y,2,2,p.c);g.globalAlpha=1;}
  // These hand-authored locations have their own indoor and arena foreground;
  // do not paint exterior trees or landscape tint over castle walls.
  const isUniqueRoom=!!(S.adv&&['armory','stable','lists'].indexOf(S.adv.scenery)>=0)||!!worldConfig();
  if(!isUniqueRoom){
    if(LAY.fg)lyr(LAY.fg,1.25,cam);
    const p0=PALS[pk];
    if(pk==='ash'){g.fillStyle='rgba(255,120,30,'+(.07+.04*Math.sin(S.t*7)).toFixed(3)+')';g.fillRect(0,0,W,H);}
    else if(p0.env){g.fillStyle=p0.tint;g.fillRect(0,0,W,H);}
    else if(pk!=='night'){g.fillStyle='rgba(120,150,30,'+S.blight.toFixed(3)+')';g.fillRect(0,0,W,H);}
    else{g.fillStyle='rgba(20,30,80,.12)';g.fillRect(0,0,W,H);}
  }
  storyWeatherOverlay(cam);
  for(const f of fxs){
    if(f.k==='t'){g.font=(f.big?'bold 10px':'bold 8px')+' "Courier New",monospace';g.textAlign='center';g.lineWidth=2;g.strokeStyle='#000';g.globalAlpha=Math.min(1,f.life*2);{const tx=clamp(Math.round(f.x-cam),34,W-34);g.strokeText(f.txt,tx,Math.round(f.y));g.fillStyle=f.col;g.fillText(f.txt,tx,Math.round(f.y));}g.globalAlpha=1;}
    else{g.strokeStyle=f.col;g.globalAlpha=Math.min(1,f.life*2.5);g.lineWidth=2;g.beginPath();g.ellipse(Math.round(f.x-cam),Math.round(f.y),f.r,f.r*.45,0,0,7);g.stroke();g.globalAlpha=1;}
  }
  g.restore();
}

/* ================= HUD ================= */
let hudK='';
function hud(force){
  const bo=enemies.find(e=>e.boss&&!e.dead);
  if(!G.eq[TN[P.w]])P.w=G.eq.sword?0:G.eq.staff?1:G.eq.bow?2:0;
  const key=[Math.round(P.hp),P.max,Math.floor(P.mp),P.mmax,Math.round(G.c),G.lvl,G.xp,P.w,S.dusk,bo?Math.round(bo.hp):-1,Math.round(P.ab*4),abilityId(),G.eq.sword?1:0,G.eq.staff?1:0,G.eq.bow?1:0].join();
  if(key===hudK&&!force)return;hudK=key;
  document.querySelectorAll('[data-w]').forEach(x=>{x.style.display=G.eq[TN[+x.dataset.w]]?'':'none';});$('mode').style.display=G.eq.staff?'':'none';
  $('hp').style.width=clamp(P.hp/P.max,0,1)*100+'%';$('mp').style.width=clamp(P.mp/P.mmax,0,1)*100+'%';$('xp').style.width=clamp(G.xp/xpNeed(G.lvl),0,1)*100+'%';
  $('lv').textContent='Lv '+G.lvl+(G.pts?'  ★'+G.pts:'');
  $('cm').style.left=(G.c+100)/200*100+'%';
  const t=$('ctitle');t.textContent='♛ '+tier(G.c);t.style.color=G.c>=30?'#ffd34a':G.c<=-30?'#ff6a4a':'#e9e2c4';
  const ab=abilityId(),b=$('abl');b.textContent=ab?ABN[ab]:'LOCK';b.style.setProperty('--p',P.ab>0?Math.round(P.ab/P.abMax*100):0);b.style.opacity=ab?1:.5;
  document.querySelectorAll('[data-w]').forEach(x=>x.classList.toggle('sel',+x.dataset.w===P.w));
  $('boss').style.display=bo?'block':'none';if(bo){$('bname').textContent=bo.def.n;$('bhp').style.width=clamp(bo.hp/bo.max,0,1)*100+'%';}
}
function setW(i){if(!G.eq[TN[i]]){toast('NO '+TN[i].toUpperCase()+' EQUIPPED');return;}P.w=i;hud(true);}
function toggleMode(){S.dusk=!S.dusk;const m=$('mode');m.textContent=S.dusk?'DUSK':'DAWN';m.className='btn sm'+(S.dusk?' dusk':'');}
