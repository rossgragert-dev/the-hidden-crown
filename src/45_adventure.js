/* ================= SOLO ADVENTURE / PLATFORM ROOMS =================
   Data-driven exploration for new missions; old side-scrolling combat remains valid.
   Coordinates are world X and platform height (0 = ground, negative = above ground).
*/
function adventureBegin(area){
  const d=area.explore;
  if(!d){S.adv=null;P.py=0;P.vy=0;P.grounded=true;S.camY=0;return;}
  S.adv={
    length:d.length||1000,
    platforms:(d.platforms||[]).map(p=>({x:p.x,w:p.w,y:p.y})),
    objects:(d.objects||[]).map((o,i)=>Object.assign({i,done:!S.replay&&!!(o.flag&&G.flags[o.flag])},o)),
    scenery:d.scenery||'castle',seed:d.seed||5,
    progress:0,combatAt:(d.combatAt||[]).map((w,i)=>Object.assign({i,done:false},w))
  };
  P.py=0;P.vy=0;P.grounded=true;S.camY=0;S.joust=null;
  S.activeInteract=null;
  const b=$('jumpbtn');if(b)b.style.display='flex';
  const block=$('blockbtn');if(block)block.style.display=G.shieldTier>=0?'flex':'none';
  missionHud(true);
}
function adventureEnd(){
  S.adv=null;S.joust=null;S.camY=0;P.py=0;P.vy=0;P.grounded=true;
  const b=$('jumpbtn');if(b)b.style.display='none';
}
function adventureJump(){
  if(!S.adv||S.talk||S.mode!=='play'||S.joust||!P.grounded)return false;
  P.vy=-288;P.grounded=false;sfx(380,.09,'triangle',.025);return true;
}
function adventureNear(){
  if(!S.adv||S.talk||S.arena||S.joust)return null;
  let near=null,dist=1e9;
  for(const o of S.adv.objects){
    if(o.done)continue;
    const d=Math.abs(P.x-o.x);
    if(d<34&&Math.abs((P.py||0)-(o.y||0))<24&&d<dist){dist=d;near=o;}
  }
  return near;
}
function adventureUse(){
  if(!S.adv||S.talk||S.arena)return false;
  if(S.joust){adventureLance();return true;}
  const o=adventureNear();
  if(!o)return false;
  if(o.need&&!G.flags[o.need]){toast(o.locked||'A KEY OR TASK IS MISSING');sfx(110,.18,'square',.04);return true;}
  if(o.kind==='exit'){
    if(o.needFlags&&o.needFlags.some(f=>!G.flags[f])){toast('FINISH YOUR TASKS FIRST');return true;}
    G.flags[o.flag||('exit'+S.areaIndex)]=1;
    toast('AREA COMPLETE');sfx(630,.18,'triangle',.04);
    endMissionArea();return true;
  }
  if(o.kind==='joust'){
    S.joust={t:0,round:1,score:0,object:o};
    toast('HAND OVER THE LANCE WHEN THE RIDER REACHES THE MARK');return true;
  }
  o.done=true;
  if(o.flag){G.flags[o.flag]=1;save();}
  if(o.kind==='shield'){
    G.shieldTier=Math.max(G.shieldTier||0,o.tier||0);
    toast('WOODEN SHIELD ACQUIRED — HOLD GUARD');
  }else if(o.kind==='key'){
    toast('KEY FOUND: '+(o.label||'IRON KEY'));
  }else if(o.kind==='chest'){
    const item=genItem(S.ilvl+1,Math.max(1,o.rarity||1),o.slot||'armor');
    addItem(item,true);toast('CHEST OPENED: '+item.name);
  }else if(o.kind==='gear'){
    toast('COLLECTED: '+o.label);
  }else if(o.kind==='horse'){
    toast('HORSE GROOMED AND READY');
  }else if(o.kind==='door'){
    toast('DOOR UNLOCKED');
  }else toast('OBJECTIVE COMPLETE');
  if(o.lines)say(typeof o.lines==='function'?o.lines():o.lines,()=>{});
  missionHud(true);sfx(510,.14,'triangle',.04);
  return true;
}
function adventureLance(){
  const j=S.joust;
  if(!j)return;
  const good=j.t>=.72&&j.t<=1.16;
  if(good){j.score++;toast('PERFECT LANCE HANDOFF!');sfx(650,.17,'triangle',.06);}
  else{toast('MISSED THE TIMING — NEXT PASS');sfx(130,.18,'sawtooth',.05);}
  adventureNextPass();
}
function adventureNextPass(){
  const j=S.joust;if(!j)return;
  j.round++;j.t=0;
  if(j.round>3){
    const o=j.object;o.done=true;G.flags[o.flag||'joustServed']=1;save();
    S.joust=null;toast('TOURNAMENT COMPLETE: '+j.score+' / 3 HANDOFFS');
    if(j.score>=2){G.gold+=35;if(S.rew)S.rew.gold+=35;}
    missionHud(true);
  }
}
function adventureUpdate(dt){
  const a=S.adv;if(!a||S.mode!=='play')return;
  if(S.joust){S.joust.t+=dt;if(S.joust.t>=1.85)adventureNextPass();}
  const prev=P.py||0;
  // Walk off ledges naturally. A platform only supports the hero while
  // the feet are over its interval; no invisible floor under upper stories.
  const standing=a.platforms.some(p=>P.x>=p.x-4&&P.x<=p.x+p.w+4&&Math.abs(prev-p.y)<2);
  if(P.grounded&&prev<0&&!standing)P.grounded=false;
  if(!P.grounded){
    P.vy=Math.min(460,(P.vy||0)+620*dt);
    P.py=prev+P.vy*dt;
    if(P.vy>=0){
      let surface=0;
      for(const p of a.platforms){
        if(P.x>=p.x-4&&P.x<=p.x+p.w+4&&prev<=p.y+2&&P.py>=p.y-1&&p.y<surface)surface=p.y;
      }
      if(P.py>=surface){P.py=surface;P.vy=0;P.grounded=true;}
    }
  }else{P.vy=0;}
  S.camY=lerp(S.camY,Math.min(0,(P.py||0)+48),Math.min(1,dt*7));
  // Road sections: scripted enemies inhabit traversed terrain; one wave
  // per checkpoint and distinct region-specific composition.
  for(const w of a.combatAt){
    if(!w.done&&P.x>=w.x&&!S.arena&&!S.talk){
      w.done=true;wave(w.list,()=>{missionHud(true);});break;
    }
  }
}
function adventureWorldDraw(cam){
  const a=S.adv;if(!a)return;
  const y=GY,seed=a.seed;
  // Deterministic scenery per world segment, not a repeated painted strip.
  const first=Math.floor(Math.max(0,cam-100)/110),last=Math.ceil((cam+W+120)/110);
  for(let i=first;i<=last;i++){
    const x=i*110+((i*79+seed*19)%33)-cam;
    const hash=(Math.imul(i+seed+111,16777619)^Math.imul(i+19,2246822519))>>>0;
    const v=(hash^(hash>>>13))%13;
    if(['road','forest','marsh','mountain','ruins'].indexOf(a.scenery)>=0){
      if(a.scenery==='marsh'){
        R(x,y-12,44,8,'#354b49');R(x+7,y-26,3,24,'#426e50');
        R(x+17,y-32,3,30,'#628351');R(x+29,y-23,3,21,'#52754d');
      }else if(a.scenery==='mountain'){
        R(x-6,y-52,50,52,'#6f6965');R(x+8,y-69,24,35,'#92918c');
        R(x+19,y-73,7,12,'#bec5c4');
      }else if(a.scenery==='ruins'){
        R(x,y-61,12,61,'#7d7373');R(x+41,y-43,9,43,'#777079');
        R(x-5,y-66,61,7,'#aaa092');
      }else if(v%2===0){
        R(x,y-64,3,64,'#58412e');R(x-12,y-73,27,18,a.scenery==='forest'?'#244e2d':'#406036');
        R(x-6,y-83,15,20,'#45693e');R(x+2,y-64,3,6,'#305333');
      }else{
        R(x,y-20,23,20,'#726b5b');R(x+4,y-31,13,11,'#857663');
      }
    }else{
      R(x,y-82,8,82,a.scenery==='stable'?'#79502f':'#6d6870');
      R(x+52,y-82,8,82,a.scenery==='stable'?'#79502f':'#6d6870');
      R(x,y-87,60,7,'#b1a088');
      if(v%2===0){R(x+23,y-74,12,32,'#242432');R(x+26,y-70,6,27,'#6f5b34');}
      else{R(x+28,y-57,4,18,'#a76b32');R(x+24,y-65,12,9,'#e9bc60');}
    }
  }
  for(const p of a.platforms){
    const x=p.x-cam,py=y+p.y;
    R(x,py,p.w,5,a.scenery==='stable'?'#7b5134':'#89838d');
    R(x,py+5,p.w,4,'#524a4e');
    for(let k=0;k<p.w;k+=26)R(x+k,py+1,3,2,'#d4b888');
    R(x+5,py+9,4,Math.min(32,-p.y-4),'#514347');
    R(x+p.w-9,py+9,4,Math.min(32,-p.y-4),'#514347');
  }
  for(const o of a.objects){
    if(o.done)continue;
    const x=Math.round(o.x-cam),py=Math.round(y+(o.y||0));
    if(x<-40||x>W+40)continue;
    const locked=o.need&&!G.flags[o.need];
    if(o.kind==='exit'||o.kind==='door'){
      R(x-12,py-46,24,46,'#49404d');R(x-9,py-43,18,43,'#9e8769');
      R(x-6,py-38,12,35,locked?'#5d2c2c':'#394f38');
      R(x+3,py-20,2,2,'#e4c778');
    }else if(o.kind==='chest'){
      R(x-12,py-15,24,15,'#503127');R(x-12,py-19,24,7,'#9c653b');
      R(x-2,py-15,4,10,'#ebc664');
    }else if(o.kind==='horse'){
      R(x-20,py-29,36,22,'#815131');R(x+10,py-40,13,20,'#765039');
      R(x-14,py-7,5,8,'#453329');R(x+8,py-7,5,8,'#453329');
      R(x+20,py-33,3,3,'#ead9a4');
    }else{
      R(x-9,py-16,18,16,o.kind==='key'?'#b59e4b':o.kind==='shield'?'#4d6e91':'#6e5843');
      R(x-3,py-20,6,6,'#e8c469');
      if(o.kind==='key'){R(x+7,py-10,8,3,'#e9cb52');}
    }
    g.font='bold 8px Courier New';g.fillStyle='#ffedbb';g.textAlign='center';
    g.fillText(o.label||o.kind.toUpperCase(),x,py-51);
  }
  if(S.joust){
    const j=S.joust,w=94,x=clamp(P.x-cam-48,6,Math.max(6,W-103)),py=y+(P.py||0)-97;
    const riderX=x+95-Math.round(j.t/1.85*100);
    R(riderX-9,py-50,28,9,'#6d4939');R(riderX+8,py-57,8,13,'#664032');
    R(riderX-6,py-43,4,9,'#49322a');R(riderX+12,py-43,4,9,'#49322a');
    R(riderX+1,py-66,6,17,'#86898e');R(riderX,py-70,8,8,'#d6ae79');
    R(riderX+7,py-62,34,2,'#e2c481');
    R(x-4,py-22,105,45,'rgba(12,10,14,.88)');
    R(x,py,94,7,'#49362b');R(x+38,py,18,7,'#96bd55');
    R(x+Math.min(91,j.t/1.85*91),py-3,3,14,'#ffdf7e');
    g.textAlign='left';g.font='bold 8px Courier New';g.fillStyle='#ffedbb';
    g.fillText('LANCE '+j.round+'/3  USE TO HAND OFF',x,py-8);
  }
}
