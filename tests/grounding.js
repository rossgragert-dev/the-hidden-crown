// Regression for the opening armory's furniture/collision grounding.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){
   const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
   await page.waitForFunction(()=>!!window.__G);
   const sample=await page.evaluate(()=>{
     const a=window.__G;a.startMission('m0');a.S.talk=false;a.S.q=[];
     const camera=[0,47,161,308,579].map(cam=>({
       cam,armory:interiorBackCam(cam,'armory'),stable:interiorBackCam(cam,'stable'),
       lists:interiorBackCam(cam,'lists')}));
     const contacts=[];
     const orig=window.R;
     window.R=(x,y,w,h,col)=>contacts.push({x,y,w,h,col});
     try{
       const ground=a.GY;
       for(const p of a.S.adv.platforms)drawSupportedPlatform(p,0,ground,'armory');
     }finally{window.R=orig;}
     return {camera,contacts,ground:a.GY,platforms:a.S.adv.platforms};
   });
   for(const c of sample.camera){
     assert.equal(c.armory,Math.floor(c.cam),'Armory furniture must scroll with physical platforms');
     assert.equal(c.stable,Math.floor(c.cam),'Stable furniture must scroll with physical platforms');
     assert.equal(c.lists,Math.floor(c.cam*.74),'Open-air tournament keeps distant parallax');
   }
   for(const p of sample.platforms){
     const surfaces=sample.contacts.filter(r=>Math.abs(r.y-(sample.ground+p.y))<.01&&r.w>=p.w);
     assert.ok(surfaces.length,'The tabletop must align to the collision surface');
     const left=p.x+7,right=p.x+p.w-12;
     const feet=sample.contacts.filter(r=>r.y<=sample.ground&&r.y+r.h>=sample.ground&&r.h<=5
       &&(Math.abs(r.x-left+4)<1||Math.abs(r.x-right+4)<1));
     assert.ok(feet.length>=2,'Furniture posts should show ground-contact feet: '+p.kind);
   }
   for(const [area,worldX,name] of [[0,350,'workbench'],[0,668,'loft'],[0,805,'rack'],[1,600,'hayloft']]){
     await page.evaluate(({area,worldX})=>{
       const a=window.__G;
       if(area!==a.S.areaIndex)a.loadMissionArea(area);
       a.S.talk=false;a.S.q=[];a.P.x=worldX;a.S.cam=Math.max(0,worldX-a.W*.5);
     },{area,worldX});
     await page.waitForTimeout(150);
     if(viewport.width===390){
       fs.mkdirSync('/tmp/shots',{recursive:true});
       await page.screenshot({path:'/tmp/shots/grounded-'+name+'.png'});
     }
   }
   assert.deepEqual(errors,[]);
   await context.close();
  }
  console.log('Armory/stable furniture camera + platform-floor contact tests: PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
