// v0.6.3: story-specific scenery, weather, enemy diversity and legacy jumping.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch();
 const err=[];
 try{
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){
   const ctx=await browser.newContext({viewport,hasTouch:true,deviceScaleFactor:2});
   const page=await ctx.newPage();page.on('pageerror',e=>err.push(e.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
   const roster=await page.evaluate(()=>window.__G.EN);
   for(const id of ['scout','spearman','torchraider','crossbow','sapper','wisp','boglurker','acolyte','sentry']){
    assert.ok(roster[id]&&roster[id].n,id+' enemy type must exist');
   }
   assert.ok(roster.wisp.creature&&roster.boglurker.creature,'Creature enemy art is not a recolored human');
   const scenes={m1:'gate',m2:'farmroad',m3:'granary',m4:'fen',m6:'library',m7:'rampart',m8:'training',m9:'chapel',m11:'forest',m12:'frontier'};
   const hashes={};
   for(const [id,style] of Object.entries(scenes)){
     await page.evaluate(id=>{const g=window.__G;g.startMission(id);g.S.talk=false;g.S.q=[];},id);
     await page.waitForTimeout(90);
     const state=await page.evaluate(()=>{
       const g=window.__G,config=g.worldConfig(),can=g.gctx.canvas;
       const data=g.gctx.getImageData(0,8,Math.min(g.W,240),Math.min(g.GY-20,100)).data;
       let h=2166136261;for(let i=0;i<data.length;i+=16)h=Math.imul(h^data[i]^data[i+1]<<8,16777619)>>>0;
       return {style:config&&config.style,hash:h,jump:getComputedStyle(document.getElementById('jumpbtn')).display};
     });
     assert.equal(state.style,style,'Scene identity for '+id);
     assert.equal(state.jump,'flex','Legacy mission '+id+' must expose JUMP');
     hashes[id]=state.hash;
   }
   assert.ok(new Set(Object.values(hashes)).size>=8,'Story chapters must not reuse a single background');
   // Legacy mission jump should be physically active, not a decorative button.
   await page.evaluate(()=>{const g=window.__G;g.startMission('m2');g.S.talk=false;g.S.q=[];g.P.grounded=true;g.P.py=0;g.adventureJump();});
   await page.waitForTimeout(120);
   assert.ok(await page.evaluate(()=>window.__G.P.py)<0,'Legacy jump physics should lift Corin off the ground');
   // The six siege stages must have different geography including an actual
   // drawbridge and visible burning settlement art hooks.
   await page.evaluate(()=>window.__G.startMission('m10'));
   const styles=[];
   for(let i=0;i<6;i++){
    await page.evaluate(i=>{const g=window.__G;g.loadMissionArea(i);g.S.talk=false;g.S.q=[];},i);
    await page.waitForTimeout(100);
    styles.push(await page.evaluate(()=>window.__G.worldConfig().style));
    if(viewport.width===390&&[1,2].includes(i)){
     const dest='/tmp/shots/'+(i===1?'v063-gatehouse-drawbridge.png':'v063-city-on-fire.png');
     fs.mkdirSync(path.dirname(dest),{recursive:true});await page.screenshot({path:dest});
    }
   }
   assert.deepEqual(styles,['fieldsiege','drawbridge','cityfire','chapelfire','burningkeep','cellar']);
   // A travel route should transition from departure light to arrival dusk.
   await page.evaluate(()=>{const g=window.__G;g.G.done.m0=1;g.G.done.m1=1;g.G.loc='hearth';g.openBoard();g.ACT.go('green');});
   await page.waitForTimeout(1350);
   const travel=await page.evaluate(()=>{
      const g=window.__G;const m=g.S.mission;
      if(m.type!=='travel')return {kind:m.type};
      const day=m.areas.map(a=>({weather:a.explore.weather,seed:a.explore.seed}));
      g.P.x=30;const dawn=g.worldConfig().period;g.P.x=g.S.adv.length-1;
      const noon=g.worldConfig().period;
      g.loadMissionArea(1);g.P.x=g.S.adv.length-2;
      const arrival=g.worldConfig().period;
      return {kind:m.type,day,dawn,noon,arrival};
   });
   assert.equal(travel.kind,'travel');
   assert.ok(travel.day.length>=2);
   assert.ok(travel.day.every(x=>x.weather));
   assert.notEqual(travel.day[0].seed,travel.day[1].seed);
   assert.notEqual(travel.dawn,travel.arrival,'Travel should visibly pass through times of day');
   assert.deepEqual(err,[],'Runtime errors');
   await ctx.close();
  }
  console.log('Act I backgrounds, siege landmarks, varied enemies, weather and old-mission jumping: PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
