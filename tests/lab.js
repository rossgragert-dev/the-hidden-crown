// Joust Lab: menu entry, mounted rider in the real scene, completion returns control. Also saves screenshots.
const {chromium}=require('playwright');const {pathToFileURL}=require('url');const path=require('path'),fs=require('fs'),assert=require('assert');
(async()=>{
 const out=path.resolve(__dirname,'..','docs','evidence','after');fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const errs=[];
 for(const [tag,vp] of [['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  const ctx=await b.newContext({viewport:vp,hasTouch:true,deviceScaleFactor:2});const page=await ctx.newPage();
  page.on('pageerror',e=>errs.push(tag+': '+e.message));
  await page.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href);await page.waitForTimeout(400);
  // menu entry (from the title/hub state) and easy toggle
  await page.evaluate(()=>{window.__G.ACT.menu();});
  const html=await page.evaluate(()=>document.getElementById('modal').innerHTML);
  assert.ok(/JOUST LAB/.test(html)&&/EASY JOUSTING: OFF/.test(html));
  await page.evaluate(()=>{window.__G.ACT.jousteasy();});
  assert.ok(/EASY JOUSTING: ON/.test(await page.evaluate(()=>document.getElementById('modal').innerHTML)));
  await page.evaluate(()=>{window.__G.ACT.jousteasy();window.__G.ACT.joustlab();});
  await page.waitForTimeout(1300);
  await page.evaluate(()=>{const g=window.__G;for(let i=0;i<30&&g.S.talk;i++){g.adv();g.adv();}});
  assert.equal(await page.evaluate(()=>window.__G.S.mission.id),'joustlab');
  await page.evaluate(()=>{const g=window.__G;g.P.x=527;g.S.cam=300;});await page.waitForTimeout(300);
  await page.evaluate(()=>window.__G.adventureUse());
  assert.equal(await page.evaluate(()=>window.__G.S.joust.role),'rider');
  const goldBefore=await page.evaluate(()=>window.__G.G.gold);
  await page.evaluate(()=>{const g=window.__G,J=g.S.joust;let n=0;while(!(J.phase==='approach'&&J.b.x-J.a.x<520)&&n++<9000)g.joustStep(J,1/60);});
  await page.screenshot({path:`${out}/${tag}-12-lab-approach.png`});
  await page.evaluate(()=>{const g=window.__G,J=g.S.joust;let n=0;while(!(J.phase==='approach'&&J.b.x-J.a.x<330)&&n++<9000)g.joustStep(J,1/60);g.adventureUse();});
  await page.evaluate(()=>{const g=window.__G,J=g.S.joust;let n=0;while(J.phase!=='resolve'&&n++<9000)g.joustStep(J,1/60);});
  await page.screenshot({path:`${out}/${tag}-13-lab-contact.png`});
  // finish all passes through the real game loop (adventureUpdate)
  await page.evaluate(()=>{const g=window.__G;let n=0;while(g.S.joust&&n++<30000){const J=g.S.joust;if(J.phase==='approach'&&J.set<0&&J.b.x-J.a.x<380)g.adventureUse();g.joustStep(J,1/60);if(g.joustDone(J))break;}});
  await page.waitForFunction(()=>!window.__G.S.joust,{timeout:5000});
  assert.ok(await page.evaluate(()=>window.__G.P.x)<527);
  assert.equal(await page.evaluate(()=>window.__G.G.gold),goldBefore);
  assert.equal(await page.evaluate(()=>!!window.__G.G.flags.squireJoust),false);
  await ctx.close();
 }
 assert.deepEqual(errs,[]);console.log('Joust Lab: menu, mounted pass, completion, no story side effects PASS');await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
