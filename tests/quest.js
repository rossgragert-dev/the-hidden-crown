// Multi-area mission regression: checkpoint persistence, interactions, area variety and completion.
const assert=require('assert');
const {chromium}=require('playwright');
const path=require('path');
const {pathToFileURL}=require('url');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(350);
  const setup=await page.evaluate(()=>{
   const g=window.__G;g.G.done.m9=1;g.G.lvl=12;g.calc();g.startMission('m10');
   return {areas:g.S.mission.areas.length,stage:g.S.areaData.id,tracker:document.getElementById('objtrack').textContent};
  });
  assert.equal(setup.areas,6);assert.equal(setup.stage,'outskirts');
  assert.ok(setup.tracker.indexOf('Outer Fields')>=0);
  const seen=new Set();
  let interactionCount=0,guardCount=0,completed=false;
  for(let i=0;i<2500;i++){
   const state=await page.evaluate(()=>{
    const g=window.__G;
    return {mode:g.S.mode,area:g.S.areaData&&g.S.areaData.id,index:g.S.areaIndex,
      talk:g.S.talk,choice:g.S.choosing,interact:!!g.S.activeInteract,
      guard:!!g.S.guard,enemies:g.enemies.length,arena:g.S.arena,
      beat:g.S.beats[g.S.bi]?g.S.beats[g.S.bi].x:null,checkpoint:g.G.checkpoint};
   });
   if(state.area)seen.add(state.area);
   if(state.guard)guardCount++;
   if(state.mode==='hub'){completed=true;break;}
   if(state.choice){
    await page.locator('.opt').first().click();
   }else if(state.talk){
    await page.evaluate(()=>{const g=window.__G;g.adv();g.adv();});
   }else if(state.interact){
    interactionCount++;
    await page.evaluate(()=>{const g=window.__G;g.P.x=g.S.activeInteract.x;});
    await page.waitForTimeout(80);
    const use=page.locator('#usebtn');
    assert.ok(await use.isVisible(),'USE must be visible near a world object');
    await use.tap();
    await page.waitForTimeout(60);
    assert.equal(await page.evaluate(()=>!!window.__G.S.activeInteract),false,'Touch USE must complete objective');
   }else if(state.arena){
    await page.evaluate(()=>{
      const g=window.__G;g.S.spawnT=100;
      g.enemies.forEach(e=>{e.hp=0;e.dead=true;});
    });
   }else if(state.beat!==null){
    await page.evaluate(x=>{window.__G.P.x=x+2;},state.beat);
   }
   await page.waitForTimeout(40);
  }
  assert.ok(completed,'The full six-area siege must finish');
  assert.deepEqual([...seen],['outskirts','gatehouse','village','chapel','keep','cellar']);
  assert.ok(interactionCount>=4,'Expected usable world objectives');
  assert.ok(guardCount>=2,'Expected two live defense objectives');
  const result=await page.evaluate(()=>({
   done:window.__G.G.done.m10,checkpoint:window.__G.G.checkpoint,
   flags:window.__G.G.flags,
   region:window.__G.G.loc
  }));
  assert.equal(result.done,1);
  assert.equal(result.checkpoint,null);
  assert.ok(result.flags.m10escaped,'Escape flag must persist');
  assert.equal(result.region,'hearth');
  assert.deepEqual(errors,[]);
  // Assert checkpoint resumes at its saved area and old saves can omit the new key.
  await page.evaluate(()=>{const g=window.__G;g.G.checkpoint={id:'m10',area:3};g.startMission('m10',true);});
  assert.equal(await page.evaluate(()=>window.__G.S.areaData.id),'chapel');
  console.log('Six-area quest, defense objectives, interactive props, checkpoint resume: PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
