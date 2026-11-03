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
       cam,armory:a.interiorBackCam(cam,'armory'),stable:a.interiorBackCam(cam,'stable'),
       lists:a.interiorBackCam(cam,'lists')}));
     return {camera,ground:a.GY,platforms:a.S.adv.platforms};
   });
   for(const c of sample.camera){
     assert.equal(c.armory,Math.floor(c.cam),'Armory furniture must scroll with physical platforms');
     assert.equal(c.stable,Math.floor(c.cam),'Stable furniture must scroll with physical platforms');
     assert.equal(c.lists,Math.floor(c.cam*.74),'Open-air tournament keeps distant parallax');
   }
   assert.deepEqual(sample.platforms.map(p=>p.kind),['workbench','loft','rack']);
   assert.ok(sample.platforms.every(p=>p.y<0&&p.x>0&&p.w>50),'Grounding must preserve original collision platforms');
   // The contact foot rectangle now intersects the exact GY floor pixel.
   // Verify the painter's geometry as well as visually captured gameplay frames.
   const painter=fs.readFileSync(path.resolve(__dirname,'..','src','45_adventure.js'),'utf8');
   assert.ok(painter.includes("R(px-7,ground-1,post+14,2"),'Each wooden support needs a ground-contact shadow');
   assert.ok(painter.includes("Math.max(0,h-5),frame"),'Legs must reach the world floor exactly');
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
