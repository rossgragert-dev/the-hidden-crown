// v0.6.5 regression: choice placement, end-scene preservation, natural hero
// silhouette and new hand-authored foregrounds on mobile.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const path=require('path');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){
   const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:2});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
   await page.waitForFunction(()=>!!window.__G);

   // The first moral decision must open as soon as the speaking guard finishes.
   // Do not make the player walk another 270 units after the NPC's dialogue.
   await page.evaluate(()=>{
     const a=window.__G;
     a.startMission('m2');
     a.S.talk=false;a.S.q=[];a.S.bi=2;
     a.P.x=a.S.beats[2].x;
     a.P.py=0;a.P.grounded=true;
     a.S.cam=Math.max(0,a.P.x-a.W*.4);
   });
   await page.waitForFunction(()=>window.__G.S.talk&&window.__G.S.npc&&window.__G.S.npc.k==='guard');
   const staged=await page.evaluate(()=>{
     const a=window.__G;
     return {distance:a.S.npc.x-a.P.x,cam:a.S.cam,player:a.P.x,index:a.S.bi};
   });
   assert.ok(staged.distance>5&&staged.distance<=35,'The guard must remain beside Corin, not on the screen edge');
   assert.equal(staged.index,3,'One preceding dialogue step has fired');
   await page.evaluate(()=>{
     const a=window.__G;
     for(let i=0;i<30&&a.S.talk&&!a.S.choosing;i++)a.adv();
   });
   const choice=await page.evaluate(()=>{
     const a=window.__G;
     const opts=[...document.querySelectorAll('#ch .opt')];
     return {active:a.S.choosing,options:opts.length,player:a.P.x,cam:a.S.cam,
       npc:a.S.npc&&a.S.npc.k,npcDist:a.S.npc&&a.S.npc.x-a.P.x,
       index:a.S.bi};
   });
   assert.equal(choice.active,true,'Choices must appear immediately after conversation');
   assert.equal(choice.options,3,'All moral choices must be visible');
   assert.equal(choice.player,staged.player,'Player should not need to walk away before deciding');
   assert.ok(Math.abs(choice.cam-staged.cam)<15,'Camera should remain pinned near the speaker');
   assert.equal(choice.npc,'guard','The person being addressed should remain present during the choice');
   assert.ok(choice.npcDist>5&&choice.npcDist<=35);
   assert.equal(choice.index,4,'Choice event is consumed immediately');
   const screenshotDir='/tmp/shots';fs.mkdirSync(screenshotDir,{recursive:true});
   if(viewport.width===390)await page.screenshot({path:screenshotDir+'/v065-guard-choice.png'});
   await page.locator('#ch .opt').first().click();
   assert.ok(await page.evaluate(()=>window.__G.G.flags.spared),'Choice must still set story flag');

   // Mission-complete and results backdrop must remain the same world scene.
   await page.evaluate(()=>{const a=window.__G;a.startMission('m2');a.S.talk=false;});
   await page.waitForTimeout(80);
   const before=await page.evaluate(()=>window.__G.worldConfig()?.style);
   assert.equal(before,'farmroad');
   await page.evaluate(()=>window.__G.completeMission());
   const done=await page.evaluate(()=>({mode:window.__G.S.mode,style:window.__G.worldConfig()?.style}));
   assert.equal(done.mode,'done');
   assert.equal(done.style,before,'Mission completion must retain its story background');
   await page.waitForFunction(()=>window.__G.S.mode==='hub'&&!!window.__G.S.resultsBackdrop,{timeout:6500});
   const results=await page.evaluate(()=>{
     const a=window.__G;
     return {captured:a.S.resultsBackdrop.width===a.W,
       mode:a.S.mode};
   });
   assert.ok(results.captured,'Result view should have a frozen copy of the completed scene');
   if(viewport.width===390)await page.screenshot({path:screenshotDir+'/v065-results-backdrop.png'});
   await page.evaluate(()=>window.__G.openBoard());
   assert.equal(await page.evaluate(()=>window.__G.S.resultsBackdrop==null),true,'Captured scene should be released when leaving results');

   // Corin's default sword pose should have a natural free hand, not an
   // enormous permanent shield floating beside the torso.
   const hero=await page.evaluate(()=>{
     const a=window.__G;const o=a.heroOpts();
     const limbs=a.personParts(o);
     return {hero:o.hero,nosh:o.nosh,oversized:limbs.some(t=>t[0]===-13&&t[2]===7&&t[3]===9)};
   });
   assert.equal(hero.hero,true);assert.equal(hero.nosh,true);
   assert.equal(hero.oversized,false,'No protruding rectangular shield on idle Corin');

   await page.evaluate(()=>{const a=window.__G;a.startMission('m0');a.loadMissionArea(3);});
   await page.waitForTimeout(130);
   if(viewport.width===390)await page.screenshot({path:screenshotDir+'/v065-garden-arcade.png'});
   await page.evaluate(()=>{const a=window.__G;a.loadMissionArea(1);});
   await page.waitForTimeout(130);
   if(viewport.width===390)await page.screenshot({path:screenshotDir+'/v065-stable-texture.png'});
   assert.deepEqual(errors,[],'No browser rendering or script errors');
   console.log(viewport.width+'x'+viewport.height+' dialogue, world, sprite and foreground regressions PASS');
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
