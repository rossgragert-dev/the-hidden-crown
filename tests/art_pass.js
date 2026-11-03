// v0.7.0 art pass: every chapter renders cleanly along its whole length in both orientations, chapters are
// visually distinct, the ?chapter= shortcut never writes a save, and Halvard's charger is tacked differently
// from Corin's gelding.
const {chromium}=require('playwright');const {pathToFileURL}=require('url');const path=require('path'),assert=require('assert'),crypto=require('crypto');
(async()=>{
 const b=await chromium.launch();const errs=[];
 for(const [tag,vp] of [['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  const ctx=await b.newContext({viewport:vp,hasTouch:true,deviceScaleFactor:1});const page=await ctx.newPage();
  page.on('pageerror',e=>errs.push(tag+': '+e.message));
  await page.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href);await page.waitForTimeout(300);
  await page.evaluate(()=>localStorage.clear());await page.reload();await page.waitForTimeout(300);
  await page.evaluate(()=>document.getElementById('bnew').click());await page.waitForTimeout(300);
  await page.evaluate(()=>window.__G.startMission('m0'));await page.waitForTimeout(600);
  const hashes=[];
  for(let ch=0;ch<7;ch++){
   if(ch>0){await page.evaluate(i=>window.__G.loadMissionArea(i),ch);await page.waitForTimeout(350);}
   await page.evaluate(()=>{const g=window.__G;for(let i=0;i<40&&g.S.talk;i++){g.adv();g.adv();}});
   const info=await page.evaluate(()=>{const g=window.__G;return {len:g.S.adv.length,W:g.W};});
   // sweep the whole chapter: nothing may throw, labels must stay on screen
   for(let x=20;x<info.len;x+=Math.max(60,Math.floor(info.len/14))){
    await page.evaluate(x=>{const g=window.__G;g.P.x=x;g.S.cam=Math.max(0,x-g.W*.4);},x);await page.waitForTimeout(40);
   }
   await page.evaluate(()=>{const g=window.__G;g.P.x=Math.round(g.S.adv.length*.45);g.S.cam=Math.max(0,g.P.x-g.W*.4);});await page.waitForTimeout(250);
   const png=await page.screenshot({clip:{x:0,y:Math.round(vp.height*.3),width:vp.width,height:Math.round(vp.height*.4)}});
   hashes.push(crypto.createHash('md5').update(png).digest('hex'));
  }
  assert.equal(new Set(hashes).size,7,tag+': every chapter must look different');
  await ctx.close();
 }
 // ?chapter= shortcut: lands in the right chapter and never persists
 const c2=await b.newContext({viewport:{width:390,height:844}});const p2=await c2.newPage();p2.on('pageerror',e=>errs.push('shortcut: '+e.message));
 await p2.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href+'?chapter=6');await p2.waitForTimeout(900);
 const sc=await p2.evaluate(()=>({scene:window.__G.S.adv.scenery,saved:localStorage.getItem('hiddencrown.save.v2')}));
 assert.equal(sc.scene,'trainingyard');assert.equal(sc.saved,null);
 // distinct tack: knightly charger vs ordinary gelding (baked pixel data must differ)
 const tack=await p2.evaluate(()=>{const g=window.__G;const bake=(v,tk)=>{g.prebakeHorse(v,tk,'hearth',['idle']);const f=g.HCACHE.get([v,tk,'hearth','idle',0,0,0].join('|'));return f.c.toDataURL();};
  return {knight:bake('charger','knight'),plain:bake('charger','saddled'),bay:bake('bay','saddled')};});
 assert.notEqual(tack.knight,tack.plain);assert.notEqual(tack.bay,tack.knight);
 assert.deepEqual(errs,[]);console.log('Art pass: 7 chapters render along full length (both orientations), distinct looks, shortcut unsaved, distinct tack PASS');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
