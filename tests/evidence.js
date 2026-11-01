// Captures real in-engine screenshots of the three M0 scenes. Usage: node tests/evidence.js <outdir> [prefix]
const {chromium}=require('playwright');
const {pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const out=path.resolve(process.argv[2]||'docs/evidence/after'),pre=process.argv[3]||'';
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch();
 const errs=[];
 for(const [tag,vp] of [['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  const ctx=await browser.newContext({viewport:vp,hasTouch:true,deviceScaleFactor:2});
  const page=await ctx.newPage();page.on('pageerror',e=>errs.push(tag+': '+e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(300);
  await page.evaluate(()=>{const g=window.__G;g.startMission('m0');});
  const settle=async(ms)=>{await page.waitForTimeout(ms||350);await page.evaluate(()=>{const g=window.__G;for(let i=0;i<40&&g.S.talk;i++){g.adv();g.adv();}});await page.waitForTimeout(250);};
  const place=async(x,py)=>{await page.evaluate(([x,py])=>{const g=window.__G;g.P.x=x;g.P.py=py||0;g.P.vy=0;g.P.grounded=true;g.S.cam=Math.max(0,x-g.W*.4);},[x,py]);await page.waitForTimeout(500);};
  const shot=async(n)=>page.screenshot({path:`${out}/${pre}${tag}-${n}.png`});
  await settle(500);
  await place(120,0);await shot('01-armory-entry');
  await place(560,0);await shot('02-armory-shield-rack');
  await place(670,-54);await shot('03-armory-loft');
  await place(880,0);await shot('04-armory-forge-lances');
  await page.evaluate(()=>{window.__G.loadMissionArea(1);});await settle(500);
  await place(330,0);await shot('05-stables-entry');
  await place(430,0);await shot('06-stables-horse');await page.evaluate(()=>{const g=window.__G;g.adventureUse();});await page.waitForTimeout(300);await shot('06b-stables-grooming');await page.waitForTimeout(1200);await shot('06c-stables-groomed');
  await place(610,-36);await shot('07-stables-loft-saddle');
  await page.evaluate(()=>{window.__G.loadMissionArea(2);});await settle(500);
  await place(300,0);await shot('08-lists-entry');
  await place(520,0);await shot('09-lists-joust-start');
  await page.evaluate(()=>{const g=window.__G;g.S.adv.objects.forEach(o=>{if(o.kind==='gear')o.done=true;});g.G.flags.squireLances=1;g.P.x=527;g.P.py=0;g.adventureUse&&g.adventureUse();});
  const adv=async(f)=>page.evaluate(f);
  await adv(()=>{const g=window.__G,J=g.S.joust;let n=0;while(J&&!(J.phase==='approach'&&J.a.x>J.anchor-110)&&n++<5000)g.joustStep(J,1/60);});
  await shot('10-lists-joust-approach');
  await adv(()=>{const g=window.__G,J=g.S.joust;let n=0;while(J&&J.a.x+14<J.anchor+4&&n++<5000)g.joustStep(J,1/60);g.adventureUse();g.joustStep(J,1/60);g.joustStep(J,1/60);});
  await shot('11-lists-joust-handoff');
  await ctx.close();
 }
 console.log(errs.join('\n')||'evidence captured to '+out);
 await browser.close();
})();
