/* ================= SOLO ADVENTURE / PLATFORM ROOMS =================
   Data-driven exploration for new missions; old side-scrolling combat remains valid.
   Coordinates are world X and platform height (0 = ground, negative = above ground).
*/
function adventureBegin(area){
  const d=area.explore;
  if(!d){S.adv=null;P.py=0;P.vy=0;P.grounded=true;S.camY=0;const j=$('jumpbtn');if(j)j.style.display='flex';return;}
  S.adv={
    length:d.length||1000,
    platforms:(d.platforms||[]).map(p=>({x:p.x,w:p.w,y:p.y,kind:p.kind||null})),
    objects:(d.objects||[]).map((o,i)=>Object.assign({i,done:!S.replay&&!!(o.flag&&G.flags[o.flag])},o)),
    scenery:d.scenery||'castle',seed:d.seed||5,verticalCamera:!!d.verticalCamera,
    mount:d.mount?{...d.mount,speed:0,ph:0,halvX:102}:null,
    bridge:d.bridge?{...d.bridge,collapsed:false}:null,
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
  if(S.talk||S.mode!=='play'||S.joust||!P.grounded)return false;
  P.vy=S.adv&&S.adv.mount?-235:-288;P.grounded=false;sfx(380,.09,'triangle',.025);return true;
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
  if(o.needFlags&&o.needFlags.some(f=>!G.flags[f])&&o.kind!=='exit'){
    toast('COMPLETE THE EARLIER LESSON FIRST');return true;
  }
  if(o.kind==='archerytarget'||o.kind==='swordtarget'){
    toast(o.kind==='archerytarget'?'SELECT BOW AND FIRE AN ARROW':'SELECT SWORD AND STRIKE THE DUMMY');return true;
  }
  if(o.kind==='guardtest'&&!keys.block){
    toast('HOLD GUARD WHILE YOU TAP USE');return true;
  }
  if(o.kind==='crossroads'){
    if(G.flags.ionePathChoice){toast('SELECT STAFF AND CAST WITH ATK TO OPEN THE PATH');return true;}
    choose('The bridge is broken. How will Corin use Ione’s new staff?',[
      {label:'DAWN — reveal the hidden crossing',desc:'Illuminate the old stepping stones beneath the mist.',
       fn:()=>{S.dusk=false;G.flags.ionePathChoice='dawn';o.done=true;save();
         toast('DAWN CHOSEN — SELECT STAFF AND CAST AT THE BRIDGE');}},
      {label:'DUSK — force a new crossing',desc:'Break the obstruction and pull a rough new road from the rock.',
       fn:()=>{S.dusk=true;G.flags.ionePathChoice='dusk';o.done=true;shift(-3,'DUSK POWER');save();
         toast('DUSK CHOSEN — SELECT STAFF AND CAST AT THE BRIDGE');}}
    ]);
    return true;
  }
  if(o.kind==='exit'){
    if(o.needFlags&&o.needFlags.some(f=>!G.flags[f])){toast('FINISH YOUR TASKS FIRST');return true;}
    G.flags[o.flag||('exit'+S.areaIndex)]=1;
    toast('AREA COMPLETE');sfx(630,.18,'triangle',.04);
    endMissionArea();return true;
  }
  if(o.kind==='joust'){
    joustPrebake();P.face=1;const rr=o.role==='rider';
    S.joust=joustCreate(rr?{role:'rider',anchor:Math.round(o.x),object:o,lead:560,seed:5+Math.floor(S.t*7)%90,passes:o.passes||3,easy:!!o.easy,opponent:o.opponent}:{role:'squire',anchor:Math.round(P.x),object:o,lead:260,seed:7+(o.i||0)});
    S.joust.on=joustOn;toast(rr?'LOWER YOUR LANCE AS HE CHARGES':'OFFER THE LANCE AS THE RIDER REACHES YOUR HAND');return true;
  }
  o.done=true;
  if(o.flag){G.flags[o.flag]=1;save();}
  if(o.kind==='staff'){
    if(!G.eq.staff){G.eq.staff=fixedItem('staff',"Ione's Rowan Staff",12,0,{gift:'ione'});}
    P.w=1;G.flags.ioneTaught=1;calc();hud(true);save();
    toast('ROWAN STAFF RECEIVED — SELECT STAFF AND CAST WITH ATK');
    say([L('Magister Ione','The staff listens to intention, not strength. Breathe, focus, then let the Dawn tide carry your light.'),L('Corin','Then this is not a weapon of force. It is a promise to aim well.')],()=>{});
  }else if(o.kind==='bow'){
    if(!G.eq.bow)G.eq.bow=fixedItem('bow','Elowen’s Field Bow',9,0,{gift:'elowen'});
    P.w=2;calc();save();hud(true);
    toast('FIRST BOW RECEIVED — SELECT BOW AND FIRE AT THE STRAW TARGET');
    say([L('Ranger Elowen','It is yours. Let the string settle against your cheek. Do not chase the mark with your fingers.'),L('Corin','I shall loose the next arrow only when I am steady.')],()=>{});
  }else if(o.kind==='reins'){
    toast('REINS CHECKED — HOLD RIGHT TO CANTER; JUMP TO CLEAR AN OBSTACLE');
  }else if(o.kind==='armor'){
    toast('HALVARD’S ARMOR FASTENED');
    say([L('Ser Halvard','Good. The breastplate is firm, and the helm sits square. Now keep three spare lances ready at the tilts.')],()=>{});
  }else if(o.kind==='guardtest'){
    toast('SHIELD GUARD LEARNED — HALVARD APPROVES');
  }else if(o.kind==='sword'){
    giveBluntSword();P.w=0;calc();hud(true);
    toast('HALVARD’S BLUNT IRON SWORD RECEIVED');
    say([L('Ser Halvard','That is the beginning of a true cut, lad. Take this blunted blade. You must earn a sharper one later.')],()=>{});
  }else if(o.kind==='shield'){
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
  const o=j.object;
  if(j.role==='rider'){
    if(o){o.done=true;G.flags[o.flag||'squirePracticeJoust']=1;save();}
    S.joust=null;P.x=o.x-50;P.face=1;
    toast('PRACTICE COMPLETE — YOU '+j.score+'  FOE '+j.foe);
    if(o&&o.opponent==='halvard')say([
      L('Ser Halvard','You found the seat and lowered the lance. Remember: the first victory is keeping balance, not unhorsing a friend.'),
      L('Corin','I thought the horse might throw me before I even reached you.')],()=>{});
    missionHud(true);return;
  }
  if(o){o.done=true;G.flags[o.flag||'joustServed']=1;save();}
  S.joust=null;toast('TOURNAMENT COMPLETE: '+j.score+' / '+j.passes+' HANDOFFS');
  if(j.score>=2){G.gold+=35;if(S.rew)S.rew.gold+=35;}
  say([L('Ser Halvard','A good squire remembers every handoff. Tomorrow, I shall show you how the same pass feels from a saddle.')],()=>{});
  missionHud(true);
}
function adventureUpdate(dt){
  const a=S.adv;if(!a||S.mode!=='play')return;
  if(a.mount){
    a.mount.ph+=dt*strideRate(gaitForSpeed(a.mount.speed),a.mount.speed);
    a.mount.halvX=lerp(a.mount.halvX,Math.max(94,P.x+86),Math.min(1,dt*1.8));
    if(P.x>340&&a.mount.speed>66&&!G.flags.squireCanter){
      G.flags.squireCanter=1;toast('HORSEMANSHIP: STEADY CANTER LEARNED');save();
    }
  }
  if(a.bridge){
    if(!a.bridge.collapsed&&P.x>=a.bridge.trigger){
      a.bridge.collapsed=true;P.x=a.bridge.trigger;P.vx=0;P.vy=0;
      a.mount=null;P.py=0;P.grounded=true;
      G.flags.squireBridgeBroken=1;save();
      S.shake=.55;sfx(85,.6,'sawtooth',.09);
      say([
        N('The swollen river tears loose the old bridge supports. With a crack of timber, the middle span falls into the torrent. Corin’s bay refuses the edge.'),
        L('Ser Halvard','Corin! Hold your horse! The bridge is gone. I am on the far bank and cannot come back.'),
        L('Corin','Father! How am I to cross?'),
        L('Ser Halvard','Keep your head. Find another way. I will seek the north ford and meet you at home.'),
        N('Stranded among mist and standing stones, Corin sees a lantern flicker in a hidden garden beside the broken span.')
      ],()=>{});
      return;
    }
    if(!G.flags.ionePathMade&&P.x>a.bridge.edge)P.x=a.bridge.edge;
  }
  if(S.joust){joustStep(S.joust,dt);if(joustDone(S.joust))adventureJoustFinish();else if(S.joust.role==='rider')P.x=clamp(S.joust.a.x,10,a.length);}
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
// Indoor architectural props share the same horizontal world space as the
// platform collision surfaces and Corin's feet. Exterior lists may parallax.
function interiorBackCam(cam,kind){
  return kind==='armory'||kind==='stable'||kind==='inn'?Math.floor(cam):Math.floor(cam*.74);
}
function adventureBackdrop(cam){
  const a=S.adv,kind=a&&a.scenery,y=GY;
  if(!a||['armory','stable','lists','inn','practice'].indexOf(kind)<0)return false;
  const backCam=interiorBackCam(cam,kind);
  if(kind==='inn'){sceneInn(cam,y);return true;}
  if(kind==='practice'){scenePractice(cam,y);return true;}
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
    sceneArmory(cam,backCam,y);
  }else if(kind==='stable'){
    R(0,0,W,H,'#231f21');
    R(0,0,W,y,'#554535');
    const wall=g.createLinearGradient(0,0,0,y);
    wall.addColorStop(0,'rgba(12,10,12,.33)');
    wall.addColorStop(.7,'rgba(145,101,55,.07)');
    wall.addColorStop(1,'rgba(234,194,119,.11)');
    g.fillStyle=wall;g.fillRect(0,0,W,y);
    // Shaded wooden boards with individual grain, pegs and support joints.
    for(let row=0;row<y;row+=18){
      R(0,row,W,2,'#392f2d');
      for(let i=-1;i<W/47+2;i++){
        const x=i*47-(backCam%47),shade=(i+row/18)%4;
        R(x+1,row+3,43,1,shade===0?'#806145':'#6e5541');
        R(x+5,row+6,1,5,'#8e7353');
        R(x+28,row+11,11,1,'#876747');
      }
    }
    R(0,y-22,W,22,'#7b6245');R(0,y,W,H-y,'#6d593e');
    for(let i=Math.floor(backCam/152)-1;i<Math.ceil((backCam+W)/152)+1;i++){
      const x=i*152-backCam;
      // Roof truss, angled timber, structural supports all reach the floor.
      R(x,0,15,y,'#392b26');R(x+3,0,6,y,'#94704f');
      R(x+146,0,7,y,'#302723');R(x+147,0,3,y,'#7b6045');
      R(x+18,31,127,9,'#9f784f');R(x+21,32,118,2,'#d0a06b');
      g.strokeStyle='#725138';g.lineWidth=5;g.beginPath();
      g.moveTo(x+14,36);g.lineTo(x+73,3);
      g.moveTo(x+140,36);g.lineTo(x+73,3);g.stroke();
      // Recessed stable stall with layered boards and slatted railing.
      R(x+25,51,113,Math.max(0,y-83),'#41332c');
      R(x+29,54,104,Math.max(0,y-90),'#63503d');
      for(let j=0;j<9;j++){
        const bx=x+31+j*12;
        R(bx,59,3,Math.max(0,y-93),'#795b41');
        R(bx+1,59,1,Math.max(0,y-93),'#af8660');
      }
      R(x+24,y-52,114,10,'#b5905c');
      R(x+25,y-49,110,2,'#e0b879');
      R(x+26,y-31,112,6,'#554033');
      for(let j=0;j<6;j++)R(x+33+j*18,y-30,4,12,'#9f8057');
      // Near stall: hanging reins, saddle, hay and feed trough.
      if(i%2===0){
        R(x+92,y-103,3,47,'#c2a376');R(x+94,y-103,2,43,'#584337');
        R(x+83,y-81,31,11,'#705039');R(x+87,y-85,23,5,'#bc9563');
        R(x+93,y-70,3,21,'#c19f6b');R(x+104,y-69,3,20,'#c19f6b');
        for(let h=0;h<14;h++){
          const xx=x+41+(h*11)%84,yy=y-14-(h%3)*5;
          R(xx,yy,8,3,h%2?'#d5b06f':'#ab894d');
          R(xx+2,yy-3,2,6,'#e6ca87');
        }
      }else{
        R(x+39,y-103,48,32,'#302925');
        R(x+42,y-100,42,27,'#7f6044');
        for(let h=0;h<5;h++)R(x+44+h*8,y-91,3,17,'#b08c61');
        R(x+96,y-115,24,42,'#674d3a');
        R(x+99,y-116,18,5,'#bd9668');
        R(x+104,y-111,2,25,'#a37f56');
        R(x+53,y-29,35,12,'#987a52');
        R(x+56,y-33,29,5,'#d1b476');
        R(x+61,y-22,25,3,'#5a4738');
      }
      // Warm light from the high window reaches the straw-strewn floor.
      if(i%3===0){
        R(x+65,41,25,41,'#37444b');
        R(x+67,43,21,37,'#a9b3a6');
        R(x+77,43,3,37,'#514e48');
        R(x+67,60,21,3,'#514e48');
        const glow=g.createRadialGradient(x+79,66,1,x+79,66,82);
        glow.addColorStop(0,'rgba(238,199,128,.13)');
        glow.addColorStop(1,'rgba(238,199,128,0)');
        g.fillStyle=glow;g.fillRect(x-5,15,170,145);
      }
      for(let j=0;j<14;j++){
        const xx=x+(worldHash(i*31+j,17)%150);
        R(xx,y-1-(j%4)*3,3+(j%4),1,j%3?'#d9b576':'#a58b57');
      }
      R(x+14,y-4,125,4,'rgba(20,15,14,.25)');
    }
  }else{ // the tournament is open-air, not a castle room
    sceneLists(cam,backCam,y);
  }
  return true;
}

// Platforms are world objects with a real structure underneath their collision
// surface, not unexplained horizontal strips. Draw the exact top at p.y so the
// sprite, its supporting legs/rock, and the physics always agree.
function drawSupportedPlatform(p,cam,ground,scenery){
  const x=Math.round(p.x-cam),w=p.w,top=Math.round(ground+p.y),h=Math.max(0,-p.y);
  if(x>W+15||x+w<-15)return;
  const kind=p.kind||(scenery==='stable'?'hayloft':scenery==='armory'?'loft':
    scenery==='lists'?'bleachers':'outcrop');
  const wood=['workbench','loft','rack','hayloft','tackbench','bleachers'].indexOf(kind)>=0;
  if(!wood){
    // Outcrops are stone rising from the earth. The shelf is supported by an
    // irregular rock face that extends all the way down to the ground.
    R(x+5,top+5,w-10,Math.max(0,h-5),'#5d5d5c');
    for(let j=0;j<w-10;j+=18){
      const v=Math.abs((Math.imul(j+11,29)+p.x*7)%11);
      R(x+6+j,top+7+v,Math.min(15,w-18-j),Math.max(0,h-8-v),'#73736d');
      R(x+9+j,top+8+v,3,Math.max(0,h-9-v),'#86877d');
    }
    R(x+1,top,w-2,6,'#9a9886');
    R(x+4,top+1,w-8,2,'#c7bb93');
    R(x+8,top+6,w-16,2,'#514e4b');
    return;
  }
  if(kind==='hay'){
    // Stack of hay bales with actual weight on the ground.
    for(let row=0;row<Math.ceil(h/12);row++){
      const by=ground-12*(row+1),shift=(row%2)*11;
      for(let bx=0;bx<w;bx+=37){
        const xx=x+bx+shift-5,ww=Math.min(36,x+w-xx);
        if(ww<=0||xx>x+w)continue;
        R(xx,by,ww,11,'#9c7938');R(xx+2,by+1,Math.max(0,ww-4),3,'#d5b25d');
        R(xx+8,by+3,2,7,'#e6c876');R(xx+20,by+4,2,5,'#765329');
      }
    }
    R(x,top,w,4,'#d4b364');
    return;
  }
  const frame=kind==='bleachers'?'#684b35':kind==='workbench'||kind==='tackbench'?'#6e4b32':'#705238';
  const highlight=kind==='bleachers'?'#c49b60':'#a78150';
  const post=kind==='rack'?4:6;
  // Visible posts connect the upper walking surface to the stone / soil floor.
  for(const pos of [7,w-12]){
    const px=x+pos;
    R(px,top+5,post,Math.max(0,h-5),frame);
    R(px+1,top+6,2,Math.max(0,h-6),highlight);
    R(px-4,ground-4,post+8,4,'#4a3a30');
    // Pressed into the floor, not suspended just above the flagstones.
    R(px-7,ground-1,post+14,2,'rgba(25,17,13,.48)');
  }
  if(w>=125){const mid=x+Math.floor(w/2);R(mid,top+8,5,Math.max(0,h-8),frame);R(mid+1,top+9,2,Math.max(0,h-9),highlight);R(mid-5,ground-1,15,2,'rgba(25,17,13,.35)');}
  if(h>=26){
    // Cross-bracing joins upper beams to lower supports and prevents the
    // illusion that catwalks are floating above a worktable.
    g.strokeStyle=frame;g.lineWidth=3;g.beginPath();
    g.moveTo(x+10,top+10);g.lineTo(x+Math.min(42,w*.35),ground-7);
    g.moveTo(x+w-10,top+10);g.lineTo(x+w-Math.min(42,w*.35),ground-7);
    g.stroke();
  }
  if(kind==='loft'||kind==='hayloft'){
    R(x-4,top-1,w+8,7,'#745132');
    for(let i=0;i<w;i+=19){R(x+i,top,w>i+18?17:w-i,2,'#c39a61');R(x+i+1,top+4,2,2,'#413127');}
    R(x+3,top+7,w-6,3,'#3f302b');
    // A visible ladder signals how a real worker would reach the raised loft.
    const lx=x+Math.max(15,Math.floor(w*.25));
    R(lx,top+6,3,Math.max(0,h-6),'#ad8153');
    R(lx+17,top+6,3,Math.max(0,h-6),'#ad8153');
    for(let y=top+14;y<ground-2;y+=11)R(lx+2,y,16,3,'#c89c65');
    if(kind==='hayloft'){R(x+31,top-6,20,6,'#c2a253');R(x+33,top-9,16,3,'#e8c273');}
  }else if(kind==='bleachers'){
    R(x,top,w,6,'#ad8053');R(x+2,top,w-4,2,'#dbb67a');
    R(x+6,top-16,w-12,4,'#8a6845');
    R(x+7,top-18,4,16,'#735339');R(x+w-12,top-18,4,16,'#735339');
    R(x+6,top+6,w-12,2,'#442f23');
  }else{
    // A tabletop, workbench or storage rack with a full-width cabinet / shelf
    // under the top; legs genuinely reach the floor.
    R(x-2,top,w+4,5,'#b28a58');R(x,top,w,2,'#e4bd79');
    // A narrow under-lip shadow gives the tabletop actual thickness.
    R(x-2,top+5,w+4,2,'#503929');
    R(x+4,top+6,w-8,4,frame);
    if(h>17)R(x+12,ground-11,w-24,4,'#a07c55');
    if(kind==='rack'){
      for(let i=14;i<w-10;i+=18){
        R(x+i,top-17,2,16,'#8d8b8a');R(x+i-4,top-20,10,4,'#c4a968');
      }
    }else if(kind==='workbench'){
      R(x+16,top-8,w-32,7,'#51463c');
      R(x+21,top-10,16,3,'#aab0b5');
      R(x+w-34,top-10,9,3,'#d2bd89');
    }else if(kind==='tackbench'){
      R(x+18,top-10,22,6,'#8d6447');
      R(x+50,top-12,26,8,'#9c7a54');
    }
  }
}

function adventureWorldDraw(cam){
  const a=S.adv;if(!a)return;
  const y=GY,seed=a.seed;
  // Deterministic scenery per world segment, not a repeated painted strip.
  const first=Math.floor(Math.max(0,cam-100)/110),last=Math.ceil((cam+W+120)/110);
  for(let i=first;i<=last;i++){
    if(['armory','stable','lists','inn','practice','magegarden','trainingyard','returnroad'].includes(a.scenery))continue;
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
  if(a.bridge){
    const B=a.bridge,edge=B.edge-cam,right=B.to-cam,w=B.to-B.edge;
    // The drowned stone road and broken bridge are world-anchored. The gap
    // is impassable until Corin casts the spell he chose with Ione.
    if(edge<W+60&&right>-60){
      R(edge-23,y-25,29,25,'#817367');R(edge-23,y-25,31,4,'#c2ae8a');
      R(right-2,y-25,29,25,'#817367');R(right-2,y-25,29,4,'#c2ae8a');
      R(edge+5,y-5,w-7,20,'#345962');
      for(let k=0;k<8;k++){
        const xx=edge+10+k*17;
        R(xx,y+4+(k%3)*3,10,1,'#81a8a6');
        if(k%2===0)R(xx+3,y-3,2,5,'#aec4b8');
      }
      // Broken rafters dip into the water on each bank.
      g.strokeStyle='#70523f';g.lineWidth=3;g.beginPath();
      g.moveTo(edge-15,y-13);g.lineTo(edge+13,y+11);
      g.moveTo(right+12,y-13);g.lineTo(right-12,y+12);g.stroke();
      const route=G.flags.ionePathMade&&G.flags.ionePathChoice;
      if(route==='dawn'){
        // Light reveals the ancient stepping stones, formerly hidden in mist.
        for(let k=0;k<6;k++){
          const xx=edge+k*(w-16)/5+3,top=y-10+(k%2)*2;
          R(xx,top,19,10,'#899d99');
          R(xx+1,top,17,3,'#d4ebe3');
          R(xx+3,top-3,11,2,'rgba(239,241,159,.8)');
          worldGlow(xx+9,top,20,'rgba(218,255,186,.13)');
        }
      }else if(route==='dusk'){
        // Dusk raises a rough, jagged new causeway from the river.
        R(edge+5,y-14,w-7,16,'#38314b');
        for(let k=0;k<10;k++){
          const xx=edge+5+k*12,top=y-19-(k%3)*3;
          R(xx,top,15,7,k%3?'#715583':'#524266');
          R(xx+2,top,8,2,'#a789ae');
        }
        worldGlow((edge+right)*.5,y-13,35,'rgba(185,91,237,.13)');
      }
      if(!route){R(edge+w*.47,y-35,8,20,'#7e6a58');R(edge+w*.47+2,y-38,4,4,'#ba9b71');}
    }
  }

  if(a.scenery==='trainingyard')sceneRangerRange(cam,y);
  if(a.scenery==='brokenbridge'||a.scenery==='returnroad')sceneMysticGrove(cam,y);
  for(const p of a.platforms)drawSupportedPlatform(p,cam,y,a.scenery);
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
      drawHorse(x,py,1,{v:'charger',tk:sd?'saddled':gr?'blanket':'stable',liv:'hearth',gait:gt?'groom':'idle',ph,st:{dirty:!gr,groomed:gr}});
      if(gt&&Math.floor(S.t*14)%2)R(x+Math.round(Math.sin(S.t*9)*14),py-34-Math.round((S.t*40)%12),1,2,'#fff6c0');
      else if(gr&&Math.floor(S.t*2.2)%5===0)R(x-10+Math.floor(S.t*7)%24,py-30,1,1,'#fff6c0');
    }else if(o.kind==='archerytarget'||o.kind==='swordtarget'){
      R(x-3,py-38,6,38,'#6a5039');R(x-8,py-3,16,3,'#4d392c');
      R(x-13,py-47,26,26,'#a38050');
      R(x-11,py-45,22,22,'#dac28a');
      R(x-7,py-41,14,14,'#a95c42');
      R(x-3,py-37,6,6,'#e9d79c');
      if(o.kind==='swordtarget'){R(x-15,py-47,4,27,'#9d834e');R(x+11,py-47,4,27,'#9d834e');}
    }else if(o.kind==='armor'){
      R(x-11,py-37,22,29,'#7b818e');R(x-13,py-32,5,19,'#b2b8bf');
      R(x+8,py-32,5,19,'#b2b8bf');
      R(x-10,py-43,20,8,'#acb2ba');
      R(x-2,py-23,5,13,'#d6b871');
      R(x-11,py-8,22,6,'#574b49');
    }else if(o.kind==='bow'||o.kind==='sword'||o.kind==='staff'){
      R(x-2,py-39,4,37,'#8c6d4d');
      if(o.kind==='bow'){
        g.strokeStyle='#b28a52';g.lineWidth=3;
        g.beginPath();g.moveTo(x,py-40);g.quadraticCurveTo(x+17,py-20,x,py-2);g.stroke();
        g.strokeStyle='#e0d7b0';g.lineWidth=1;g.beginPath();g.moveTo(x,py-40);g.lineTo(x,py-2);g.stroke();
      }else if(o.kind==='staff'){
        R(x-5,py-45,10,9,'#9acae6');R(x-2,py-43,4,6,'#e4f7e8');
      }else{R(x-4,py-41,8,14,'#acb6c6');R(x-6,py-30,12,3,'#e0c487');}
    }else if(o.kind==='crossroads'){
      R(x-9,py-51,18,48,'#666574');
      R(x-14,py-57,28,8,'#9e9daa');
      R(x-6,py-47,12,32,'#31354b');
      R(x-3,py-43,6,8,'#e4d4a4');
      R(x-4,py-23,8,9,'#8d6ab8');
    }else if(o.kind==='reins'){
      R(x-8,py-34,16,34,'#776047');R(x-11,py-38,22,6,'#ba9d68');
      R(x-3,py-34,3,26,'#d5bc8a');
      R(x+1,py-30,6,3,'#b6a580');
    }else if(o.kind==='guardtest'){
      R(x-8,py-43,16,39,'#705744');
      R(x-11,py-39,22,25,'#abb1b9');
      R(x-7,py-36,14,19,'#3b5b7a');R(x-2,py-31,4,9,'#c4af77');
    }else{
      R(x-9,py-16,18,16,o.kind==='key'?'#b59e4b':o.kind==='shield'?'#4d6e91':'#6e5843');
      R(x-3,py-20,6,6,'#e8c469');
      if(o.kind==='key'){R(x+7,py-10,8,3,'#e9cb52');}
    }
    if(!(S.joust&&o.kind==='joust')&&!o.done){g.font='bold 8px Courier New';g.fillStyle='#ffedbb';g.textAlign='center';
    g.fillText(o.label||o.kind.toUpperCase(),x,py-51);}
  }
  if(S.joust){joustDraw(S.joust,cam,y);joustHud(S.joust,6,80);}
}
