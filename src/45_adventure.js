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
    scenery:d.scenery||'castle',seed:d.seed||5,verticalCamera:!!d.verticalCamera,
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
  if(S.joust){joustAct(S.joust);return true;}
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
    joustPrebake();P.face=1;S.joust=joustCreate({role:'squire',anchor:Math.round(P.x),object:o,lead:260,seed:7+(o.i||0)});
    S.joust.on=joustOn;toast('OFFER THE LANCE AS THE RIDER REACHES YOUR HAND');return true;
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
    o.groomT=1.1;toast('HORSE GROOMED AND READY');
  }else if(o.kind==='door'){
    toast('DOOR UNLOCKED');
  }else toast('OBJECTIVE COMPLETE');
  if(o.lines)say(typeof o.lines==='function'?o.lines():o.lines,()=>{});
  missionHud(true);sfx(510,.14,'triangle',.04);
  return true;
}
function joustOn(k,v){
  if(k==='handoff'){toast('PERFECT LANCE HANDOFF!');sfx(650,.17,'triangle',.06);}
  else if(k==='resolve'&&!(v&&v.pts)){toast(v.verdict);sfx(130,.18,'sawtooth',.05);}
  else if(k==='start')sfx(180,.2,'sawtooth',.03);
}
function adventureJoustFinish(){
  const j=S.joust;if(!j)return;
  const o=j.object;if(o){o.done=true;G.flags[o.flag||'joustServed']=1;save();}
  S.joust=null;toast('TOURNAMENT COMPLETE: '+j.score+' / '+j.passes+' HANDOFFS');
  if(j.score>=2){G.gold+=35;if(S.rew)S.rew.gold+=35;}
  missionHud(true);
}
function adventureUpdate(dt){
  const a=S.adv;if(!a||S.mode!=='play')return;
  if(S.joust){joustStep(S.joust,dt);if(joustDone(S.joust))adventureJoustFinish();}
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
  // Keep short rooms steady: the hero jumps while platforms and walls remain fixed.
  // Reserve vertical following for deliberately tall tower and cavern maps.
  S.camY=a.verticalCamera?lerp(S.camY,Math.min(0,(P.py||0)+48),Math.min(1,dt*7)):0;
  // Road sections: scripted enemies inhabit traversed terrain; one wave
  // per checkpoint and distinct region-specific composition.
  for(const w of a.combatAt){
    if(!w.done&&P.x>=w.x&&!S.arena&&!S.talk){
      w.done=true;wave(w.list,()=>{missionHud(true);});break;
    }
  }
}

/* Unique hand-authored pixel-art environment vocabulary for each opening room.
   These backgrounds stay fixed vertically for indoor platforming; the character
   jumps in front of immovable walls, shelves, bridges and foreground objects. */
function adventureBackdrop(cam){
  const a=S.adv,kind=a&&a.scenery,y=GY;
  if(!a||['armory','stable','lists'].indexOf(kind)<0)return false;
  const backCam=Math.floor(cam*.74);
  if(kind==='armory'){
    R(0,0,W,H,'#141722');
    R(0,0,W,y+1,'#353643');
    // Stone masonry with offset courses, visible joints and irregular highlights.
    for(let row=0;row<Math.ceil((y+5)/17);row++){
      const by=row*17-4;
      for(let n=Math.floor(backCam/49)-2;n<Math.ceil((backCam+W)/49)+2;n++){
        const x=n*49+(row%2)*24-backCam;
        const tone=(Math.abs(n*17+row*11)%4);
        R(x,by,47,15,['#4b4b55','#55535b','#484954','#59545c'][tone]);
        R(x+2,by+2,20,1,'rgba(235,218,172,.06)');
        R(x+45,by+7,1,5,'#302e3c');
      }
    }
    R(0,0,W,12,'#252330');
    R(0,y-12,W,12,'#6e6058');R(0,y,W,H-y,'#403b3d');
    for(let j=0;j<W+40;j+=30){
      const k=Math.floor((j+backCam)/30);
      R(j-(backCam%30),y+2,28,H-y,'#534b4b');
      R(j-(backCam%30)+3,y+3,21,2,'#6f6159');
      if(k%3===0)R(j-(backCam%30)+21,y+13,2,16,'#322e34');
    }
    const first=Math.floor(backCam/170)-1,last=Math.ceil((backCam+W)/170)+1;
    for(let n=first;n<=last;n++){
      const x=n*170-backCam;
      // Load-bearing castle pillar and carved vault.
      R(x+2,24,15,y-24,'#302d39');R(x+5,25,8,y-25,'#6a6266');
      R(x-1,20,21,8,'#938179');R(x+2,14,15,6,'#6b5e63');
      R(x+16,30,45,6,'#76717a');R(x+61,35,47,5,'#5d5661');
      R(x+108,30,45,6,'#76717a');R(x+150,20,21,8,'#938179');
      R(x+155,24,12,y-24,'#302d39');R(x+158,26,6,y-26,'#655d65');
      const style=((n%4)+4)%4;
      if(style===0){ // hearthmoor heraldry and lances
        R(x+61,y-183,42,7,'#b49561');
        R(x+65,y-178,33,91,'#283b61');
        R(x+67,y-175,29,4,'#af9555');
        R(x+78,y-159,8,42,'#c4ad72');
        R(x+71,y-144,22,7,'#c4ad72');
        R(x+77,y-113,10,11,'#d7cba4');
        for(let p=0;p<5;p++){R(x+22+p*6,y-77,2,63,'#bfa681');R(x+19+p*6,y-80,8,4,'#8d8c95');}
      }else if(style===1){ // weapon racks and shields
        R(x+38,y-79,96,6,'#34272c');R(x+41,y-74,90,4,'#a48053');
        for(let k=0;k<5;k++){
          const q=x+47+k*18;
          R(q,y-124,2,65,'#cac3a8');R(q-5,y-105,12,4,'#9a8063');
          R(q-1,y-134,4,11,'#9a9fa9');
        }
        R(x+72,y-65,30,37,'#314568');R(x+81,y-58,12,23,'#a99867');
        R(x+84,y-49,6,7,'#f1d98f');
      }else if(style===2){ // forge corner with flickering fire and tools
        R(x+46,y-76,76,67,'#383138');R(x+52,y-71,64,57,'#63545a');
        R(x+65,y-58,36,45,'#251c20');
        const flame=8+Math.round(Math.sin(S.t*8+n)*4);
        R(x+75,y-20-flame,19,flame,'#eb9b3e');
        R(x+80,y-15-flame,9,flame,'#ffde70');
        R(x+61,y-12,45,7,'#c2b2a2');
        R(x+119,y-64,7,54,'#675257');R(x+113,y-77,18,14,'#939095');
        R(x+28,y-58,20,9,'#7c838d');R(x+32,y-51,12,36,'#473f45');
      }else{ // standing armor and storage alcove
        R(x+47,y-87,67,74,'#2c2a34');
        R(x+73,y-110,15,14,'#bbb5b1');R(x+69,y-96,23,40,'#8e969f');
        R(x+65,y-88,6,34,'#6b707c');R(x+91,y-88,6,34,'#69727f');
        R(x+74,y-59,6,42,'#777783');R(x+84,y-59,6,42,'#777783');
        R(x+66,y-114,29,3,'#d3b778');
        R(x+29,y-20,27,19,'#67503e');R(x+32,y-24,21,6,'#b08e58');
        R(x+104,y-22,30,21,'#6d5340');R(x+108,y-26,23,6,'#aa8754');
      }
      // Every arch has a fixed torch fixture for warm indoor lighting.
      R(x+137,y-147,3,22,'#987e57');R(x+132,y-150,13,5,'#a6a6a2');
      const flicker=Math.round(Math.sin(S.t*11+n)*2);
      R(x+136,y-165-flicker,6,17+flicker,'#f2a546');
      R(x+138,y-161-flicker,3,10,'#ffe09a');
      const glow=g.createRadialGradient(x+139,y-157,2,x+139,y-157,57);
      glow.addColorStop(0,'rgba(245,151,63,.17)');
      glow.addColorStop(1,'rgba(245,151,63,0)');
      g.fillStyle=glow;g.fillRect(x+83,y-211,112,114);
    }
  }else if(kind==='stable'){
    R(0,0,W,H,'#22201f');
    R(0,0,W,y,'#5d4939');
    for(let row=0;row<y;row+=22)R(0,row,W,2,'#352d2b');
    R(0,y-19,W,19,'#776044');R(0,y,W,H-y,'#64513a');
    for(let i=Math.floor(backCam/145)-1;i<Math.ceil((backCam+W)/145)+1;i++){
      const x=i*145-backCam;
      R(x,0,13,y,'#3d2b24');R(x+3,0,7,y,'#806043');
      R(x+140,0,8,y,'#3d2b24');
      R(x+21,35,110,9,'#b19263');
      R(x+25,48,100,y-65,'#45352b');
      for(let k=0;k<7;k++)R(x+30+k*14,57,3,y-79,'#78543b');
      R(x+38,y-45,88,8,'#b28e5b');
      R(x+60,y-37,52,9,'#7b583c');
      if(i%2===0){
        R(x+69,y-64,32,12,'#b1976f');
        for(let h=0;h<6;h++)R(x+58+h*9,y-21,6,3,'#c9a15b');
      }else{
        R(x+37,y-79,31,23,'#77543d');R(x+39,y-82,27,6,'#a37d4b');
        R(x+80,y-86,32,38,'#655040');
      }
    }
  }else{ // the tournament is open-air, not a castle room
    R(0,0,W,H,'#7197b7');R(0,y-96,W,95,'#9ec0c0');
    R(0,y,W,H-y,'#bba67b');
    for(let k=0;k<W+20;k+=9)R(k,y+2,7,3,'#ad9469');
    for(let i=Math.floor(backCam/115)-1;i<Math.ceil((backCam+W)/115)+1;i++){
      const x=i*115-backCam;
      R(x+19,y-78,74,60,'#6e6670');
      R(x+14,y-81,84,8,'#968e91');
      for(let j=0;j<4;j++){
        R(x+25+j*19,y-60,11,23,'#292e42');
        R(x+23+j*19,y-64,15,4,'#c4b49b');
      }
      R(x+10,y-110,3,68,'#654733');
      const colors=['#b7463e','#2c567e','#e2b55f'];
      R(x+13,y-107,24,21,colors[Math.abs(i)%3]);
      R(x+14,y-105,21,4,'#f2e2b4');
      R(x,y-31,115,6,'#9c7648');
      for(let s=0;s<4;s++)R(x+s*34,y-26,5,26,'#715037');
      R(x+11,y-24,103,3,'#d0b17a');
    }
  }
  return true;
}

function adventureWorldDraw(cam){
  const a=S.adv;if(!a)return;
  const y=GY,seed=a.seed;
  // Deterministic scenery per world segment, not a repeated painted strip.
  const first=Math.floor(Math.max(0,cam-100)/110),last=Math.ceil((cam+W+120)/110);
  for(let i=first;i<=last;i++){
    if(a.scenery==='armory'||a.scenery==='stable'||a.scenery==='lists')continue;
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
    if(o.done&&o.kind!=='horse')continue;
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
      // stall dressing: hay, bucket, tack hook
      R(x+30,py-8,22,8,'#c9a85a');R(x+33,py-11,16,4,'#dcc070');R(x+36,py-13,3,2,'#e8d08a');
      R(x-48,py-10,9,10,'#6a4a2a');R(x-48,py-10,9,2,'#8a6a3a');R(x-47,py-8,7,1,'#3a2a18');
      const gr=!!o.done,sd=G.flags.squireSaddle,gt=o.groomT>0;
      if(gt)o.groomT-=1/60;
      const ph=gt?S.t*3.2:S.t*.35;
      drawHorse(x,py,1,{v:'bay',tk:sd?'saddled':gr?'blanket':'stable',liv:'hearth',gait:gt?'groom':'idle',ph,st:{dirty:!gr,groomed:gr}});
      if(gt&&Math.floor(S.t*14)%2)R(x+Math.round(Math.sin(S.t*9)*14),py-34-Math.round((S.t*40)%12),1,2,'#fff6c0');
      else if(gr&&Math.floor(S.t*2.2)%5===0)R(x-10+Math.floor(S.t*7)%24,py-30,1,1,'#fff6c0');
    }else{
      R(x-9,py-16,18,16,o.kind==='key'?'#b59e4b':o.kind==='shield'?'#4d6e91':'#6e5843');
      R(x-3,py-20,6,6,'#e8c469');
      if(o.kind==='key'){R(x+7,py-10,8,3,'#e9cb52');}
    }
    if(!(S.joust&&o.kind==='joust')&&!o.done){g.font='bold 8px Courier New';g.fillStyle='#ffedbb';g.textAlign='center';
    g.fillText(o.label||o.kind.toUpperCase(),x,py-51);}
  }
  if(S.joust){joustDraw(S.joust,cam,y);joustHud(S.joust,clamp(P.x-cam-48,6,Math.max(6,W-117)),y-96);}
}
