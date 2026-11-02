// Visual regression: distinct painterly panoramas and stable mobile rendering.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){
   const ctx=await browser.newContext({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2});
   const page=await ctx.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
   const ids=['m2','m4','m10','m12'];
   const images=[];
   for(const id of ids){
    await page.evaluate(id=>{
     const a=window.__G;a.startMission(id);
     a.S.talk=false;a.S.q=[];a.S.cam=120;a.S.t+=2;
    },id);
    await page.waitForTimeout(180);
    const data=await page.evaluate(()=>{
     const a=window.__G,im=a.gctx.getImageData(0,6,a.W,Math.max(1,a.GY-14)).data;
     let h=2166136261;const shades=new Set();
     for(let i=0;i<im.length;i+=20){h=Math.imul(h^im[i],16777619)>>>0;shades.add((im[i]>>3)+','+(im[i+1]>>3)+','+(im[i+2]>>3));}
     return {hash:h,shades:shades.size,cache:a.pixelCacheSize,kind:a.worldConfig()?.style};
    });
    assert.ok(data.shades>35,'Landscape must contain textured color variation: '+id);
    assert.ok(data.cache<=4,'Static raster cache should be bounded');
    images.push(data.hash);
    if(viewport.width===390){
      fs.mkdirSync('/tmp/shots',{recursive:true});
      await page.screenshot({path:'/tmp/shots/pixel-'+id+'-portrait.png'});
    }
   }
   assert.equal(new Set(images).size,ids.length,'Major story regions need genuinely different panoramas');
   await page.evaluate(()=>{const a=window.__G;a.startMission('m12');a.S.talk=false;a.S.q=[];a.S.cam=460;});
   await page.waitForTimeout(170);
   if(viewport.width===390){
     await page.screenshot({path:'/tmp/shots/pixel-m12-mountains-portrait.png'});
   }
   assert.deepEqual(errors,[],'Rendering should not cause runtime exceptions');
   console.log(viewport.width+'x'+viewport.height+' distinct high-detail scenic layers PASS');
   await ctx.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
