// End-to-end seven-chapter opening with actual mount, joust, training and magic.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  // Use the real NEW GAME pathway: it equips Corin's wooden practice sword.
  // Calling startMission directly from a fresh title bypasses startGear.
  await page.locator('#bnew').click();
  await page.waitForFunction(()=>window.__G.S.mode==='play'&&window.__G.S.mission?.id==='m0');
  const skip=async()=>{await page.waitForTimeout(50);await page.evaluate(()=>{
    const g=window.__G;for(let i=0;i<46&&g.S.talk&&!g.S.choosing;i++){g.adv();g.adv();}
  });};
  const where=()=>page.evaluate(()=>window.__G.S.areaData.id);
  const obj=async(kind,label)=>{
    return page.evaluate(([kind,label])=>{
      const g=window.__G,a=g.S.adv,o=a.objects.find(x=>x.kind===kind&&(!label||x.label===label));
      if(!o)throw Error('Missing '+kind+': '+label+' in '+g.S.areaData.id);
      a.combatAt.forEach(w=>{w.done=true;});
      g.S.talk=false;g.S.q=[];
      g.P.x=o.x;g.P.py=o.y||0;g.P.vy=0;g.P.grounded=true;
      const used=g.adventureUse();
      return {used,done:o.done,flag:o.flag&&g.G.flags[o.flag],area:g.S.areaData.id};
    },[kind,label]);
  };
  const advance=async(next)=>{
    await obj('exit');await page.waitForTimeout(1200);await skip();assert.equal(await where(),next);
  };
  await skip();
  const chapters=await page.evaluate(()=>window.__G.S.mission.areas.map(a=>a.id));
  assert.deepEqual(chapters,['rideout','inn','stables','lists','practicelists','trainingyard','returnroad']);
  assert.equal(await where(),'rideout');
  const mount=await page.evaluate(()=>{
    const g=window.__G;
    g.P.x=355;g.S.adv.mount.speed=82;g.adventureUpdate(.05);
    return {variant:g.S.adv.mount.v,gait:g.S.adv.mount.speed,lesson:g.G.flags.squireCanter};
  });
  assert.equal(mount.variant,'bay');assert.ok(mount.gait>65);
  assert.ok(mount.lesson,'The horse riding challenge must record a canter');
  assert.ok((await obj('reins')).flag);
  await advance('inn');
  assert.ok((await obj('chest')).done);
  assert.ok((await obj('key')).flag);
  assert.ok((await obj('gear','BREASTPLATE')).flag);
  assert.ok((await obj('gear','TOURNAMENT HELM')).flag);
  assert.ok((await obj('gear','POLISHING OIL')).flag);
  await advance('stables');
  assert.ok((await obj('horse')).flag);
  assert.ok((await obj('gear','TOURNAMENT SADDLE')).flag);
  await advance('lists');
  assert.ok((await obj('armor')).flag);
  assert.ok((await obj('gear','SPARE LANCES')).flag);
  assert.ok((await obj('joust')).used);
  await page.evaluate(()=>{
    const g=window.__G;let n=0;
    while(g.S.joust&&n++<24000){
      const j=g.S.joust;
      if(j.phase==='approach'&&!j.used&&j.a.x+14>=j.anchor+6)g.joustAct(j);
      g.adventureUpdate(1/60);
    }
  });
  await skip();
  assert.equal(await page.evaluate(()=>window.__G.G.flags.squireJoust),1);
  assert.equal(await page.evaluate(()=>!!window.__G.G.flags.bluntSword),false,'Iron sword belongs in chapter six');
  await advance('practicelists');
  const practice=await obj('joust');
  assert.ok(practice.used);
  assert.equal(await page.evaluate(()=>window.__G.S.joust.role),'rider');
  assert.equal(await page.evaluate(()=>window.__G.S.joust.opponent),'halvard');
  await page.evaluate(()=>{
    const g=window.__G;let n=0;
    while(g.S.joust&&n++<24000){
      const j=g.S.joust;
      if(j.phase==='approach'&&j.set<0&&j.b.x-j.a.x<230)g.joustAct(j);
      g.adventureUpdate(1/60);
    }
  });
  await skip();
  assert.ok(await page.evaluate(()=>window.__G.G.flags.squirePracticeJoust));
  await advance('trainingyard');
  assert.equal(await page.evaluate(()=>window.__G.G.eq.bow),null);
  assert.ok((await obj('bow')).flag);
  await skip();
  let trained=await page.evaluate(()=>{
    const g=window.__G,a=g.S.adv,tar=a.objects.find(o=>o.kind==='archerytarget');
    g.P.x=tar.x-32;g.P.face=1;g.P.w=2;g.P.cd=0;
    g.S.cam=Math.max(0,g.P.x-g.W*.4);
    g.attack();for(let i=0;i<12&&!tar.done;i++)g.combatTick(.03);
    return {done:tar.done,bow:g.G.eq.bow&&g.G.eq.bow.name};
  });
  assert.ok(trained.done,'A real projectile must hit the archery target');
  assert.equal(trained.bow,'Elowen’s Field Bow');
  assert.ok((await obj('shield')).flag);
  const block=await page.evaluate(()=>{
    const g=window.__G,o=g.S.adv.objects.find(o=>o.kind==='guardtest');
    g.P.x=o.x;g.P.py=0;g.P.grounded=true;
    g.keys.block=0;const no=g.adventureUse(),locked=o.done;
    g.keys.block=1;g.adventureUse();g.keys.block=0;
    return {locked,done:o.done,guard:g.G.flags.squireGuardLearned};
  });
  assert.equal(block.locked,false);assert.equal(block.guard,1);
  const sword=await page.evaluate(()=>{
    const g=window.__G,o=g.S.adv.objects.find(o=>o.kind==='swordtarget');
    g.P.x=o.x-23;g.P.face=1;g.P.w=0;g.P.cd=0;g.S.talk=false;g.S.q=[];
    g.attack();
    return {flag:g.G.flags.squireSwordHit,done:o.done,talk:g.S.talk,
      cd:g.P.cd,world:g.S.adv.scenery,need:g.G.flags.squireGuardLearned,
      facing:g.P.face,weapon:g.P.w,x:g.P.x,targetX:o.x};
  });
  assert.ok(sword.flag,'Sword practice target: '+JSON.stringify(sword));assert.ok(sword.done);
  assert.ok((await obj('sword')).flag);
  assert.equal(await page.evaluate(()=>window.__G.G.eq.sword.name),'Blunt Iron Sword');
  await advance('returnroad');
  assert.equal(await page.evaluate(()=>window.__G.S.adv.mount.v),'bay');
  await page.evaluate(()=>{
    const g=window.__G;g.S.talk=false;g.P.x=476;g.adventureUpdate(.03);
  });
  await skip();
  const collapse=await page.evaluate(()=>({broken:window.__G.G.flags.squireBridgeBroken,
     mounted:!!window.__G.S.adv.mount}));
  assert.ok(collapse.broken);assert.equal(collapse.mounted,false);
  const staff=await obj('staff');await skip();assert.equal(staff.flag,1);
  const choice=await obj('crossroads');assert.equal(choice.used,true);
  assert.equal(await page.locator('#ch .opt').count(),2);
  await page.locator('#ch .opt').first().click();
  let route=await page.evaluate(()=>{
    const g=window.__G;
    g.P.x=608;g.P.py=0;g.P.w=1;g.P.cd=0;g.attack();
    return {path:g.G.flags.ionePathChoice,cast:g.G.flags.ionePathMade};
  });
  assert.equal(route.path,'dawn');assert.equal(route.cast,1);
  await skip();
  assert.ok((await obj('gear','THE LIGHT RUNE')).flag);
  await obj('exit');await page.waitForTimeout(1600);
  assert.equal(await page.evaluate(()=>window.__G.G.done.m0),1);
  assert.equal(await page.evaluate(()=>window.__G.G.shieldTier),0);
  assert.deepEqual(errors,[]);

  // Established world-map multi-leg travel remains playable.
  await page.evaluate(()=>{const g=window.__G;g.G.done.m1=1;g.openBoard();g.ACT.go('green');});
  await page.waitForTimeout(1150);await skip();
  assert.equal(await page.evaluate(()=>window.__G.S.mission.type),'travel');
  const ride=await page.evaluate(()=>({areas:window.__G.S.mission.areas.length,
   seeds:window.__G.S.mission.areas.map(a=>a.explore.seed)}));
  assert.equal(ride.areas,2);assert.notEqual(ride.seeds[0],ride.seeds[1]);
  console.log('Seven chapter squire RPG: horsemanship, inn, stables, joust, mounted practice, bow, sword, guard and magic bridge PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
