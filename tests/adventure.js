// Real engine integration: solo platform rooms, keys, shield, joust handoff and road.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  await page.evaluate(()=>{const g=window.__G;g.startMission('m0');});
  const skip=async()=>{
   await page.waitForTimeout(90);
   await page.evaluate(()=>{
    const g=window.__G;
    for(let i=0;i<36&&g.S.talk;i++){g.adv();g.adv();}
   });
  };
  const where=()=>page.evaluate(()=>window.__G.S.areaData.id);
  const obj=async(kind,label)=>{
   return await page.evaluate(([kind,label])=>{
    const g=window.__G,a=g.S.adv;
    const o=a.objects.find(x=>x.kind===kind&&(!label||x.label===label));
    if(!o)throw Error('missing '+kind+' '+label);
    g.P.x=o.x;g.P.py=o.y||0;g.P.vy=0;g.P.grounded=true;
    const used=g.adventureUse();
    return {used,done:o.done,flag:o.flag&&g.G.flags[o.flag],tier:g.G.shieldTier};
   },[kind,label]);
  };
  await skip();
  assert.equal(await where(),'armory');
  assert.equal(await page.locator('#jumpbtn').isVisible(),true);
  assert.equal(await page.locator('#blockbtn').isVisible(),false);
  assert.equal(await page.evaluate(()=>window.__G.adventureJump()),true);
  await page.waitForTimeout(140);
  assert.ok(await page.evaluate(()=>window.__G.P.py)<0,'jump should lift hero off the ground');
  await obj('exit');
  assert.equal(await where(),'armory','locked exit must not complete');
  assert.ok((await obj('chest')).done);
  assert.ok((await obj('key')).flag);
  assert.equal((await obj('shield')).tier,0);
  assert.ok((await obj('gear')).flag);
  await obj('exit');await page.waitForTimeout(1180);await skip();
  assert.equal(await where(),'stables');
  assert.ok((await obj('horse')).flag);
  assert.ok((await obj('gear')).flag);
  await obj('exit');await page.waitForTimeout(1180);await skip();
  assert.equal(await where(),'lists');
  assert.ok((await obj('gear')).flag);
  const start=await obj('joust');
  assert.ok(start.used);
  for(let i=0;i<3;i++)await page.evaluate(()=>{
   const g=window.__G;g.S.joust.t=.92;g.adventureUse();
  });
  assert.equal(await page.evaluate(()=>window.__G.G.flags.squireJoust),1);
  await obj('exit');await page.waitForTimeout(1180);await skip();
  assert.equal(await where(),'greenroad');
  const types=await page.evaluate(()=>window.__G.S.adv.combatAt.map(w=>w.list.map(e=>e.k)));
  assert.ok(types.length>=3);assert.ok(new Set(types.flat()).size>=4);
  await page.evaluate(()=>{window.__G.S.adv.combatAt.forEach(w=>w.done=true);});
  assert.ok((await obj('key')).flag);
  await obj('exit');
  await page.waitForTimeout(1600);
  const result=await page.evaluate(()=>({
    done:window.__G.G.done.m0,shield:window.__G.G.shieldTier,mode:window.__G.S.mode,
    hasFollowerRequirement:!!window.__G.S.mission.showFollowers,
    keys:window.__G.G.flags.squireArmoryKey
  }));
  assert.equal(result.done,1);assert.equal(result.shield,0);
  assert.ok(!result.hasFollowerRequirement);
  assert.equal(result.keys,1);
  // World-map travel must be playable, not an instant marker animation.
  await page.evaluate(()=>{const g=window.__G;g.G.done.m1=1;g.openBoard();g.ACT.go('green');});
  await page.waitForTimeout(1100);await skip();
  assert.equal(await page.evaluate(()=>window.__G.S.mission.type),'travel');
  const journey=await page.evaluate(()=>({
    areas:window.__G.S.mission.areas.length,
    seeds:window.__G.S.mission.areas.map(a=>a.explore.seed),
    enemies:window.__G.S.mission.areas.map(a=>a.explore.combatAt.length)
  }));
  assert.equal(journey.areas,2);
  assert.notEqual(journey.seeds[0],journey.seeds[1]);
  assert.ok(journey.enemies.every(n=>n>=2));
  await page.evaluate(()=>{window.__G.S.adv.combatAt.forEach(w=>w.done=true);});
  await obj('exit');await page.waitForTimeout(1100);await skip();
  assert.equal(await page.evaluate(()=>window.__G.S.mission.areas[window.__G.S.areaIndex].id),'travel-1');
  await page.evaluate(()=>{window.__G.S.adv.combatAt.forEach(w=>w.done=true);});
  await obj('exit');await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(()=>window.__G.G.loc),'green');
  assert.ok(await page.evaluate(()=>window.__G.G.day)>=3);
  assert.deepEqual(errors,[]);
  console.log('Solo squire campaign: platforms, locked exit, shield, jousting, road and completion PASS');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
