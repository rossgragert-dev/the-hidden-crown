// Captures real in-engine screenshots of the seven opening chapters. Usage: node tests/chapter_shots.js <outdir> [prefix]
const {chromium}=require('playwright');const {pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const out=path.resolve(process.argv[2]||'docs/evidence/v070'),pre=process.argv[3]||'';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const errs=[];
 for(const [tag,vp] of [['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  const ctx=await b.newContext({viewport:vp,hasTouch:true,deviceScaleFactor:2});const page=await ctx.newPage();
  page.on('pageerror',e=>errs.push(tag+': '+e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);await page.waitForTimeout(300);
  await page.evaluate(()=>localStorage.clear());await page.reload();await page.waitForTimeout(300);
  await page.evaluate(()=>document.getElementById('bnew').click());await page.waitForTimeout(300);
  await page.evaluate(()=>window.__G.startMission('m0'));await page.waitForTimeout(700);
  const settle=async()=>{await page.evaluate(()=>{const g=window.__G;for(let i=0;i<40&&g.S.talk;i++){g.adv();g.adv();}});await page.waitForTimeout(250);};
  const names=['road','inn','stables','tournament','practice','yard','bridge'];
  for(let ch=0;ch<7;ch++){
   if(ch>0){await page.evaluate(i=>window.__G.loadMissionArea(i),ch);await page.waitForTimeout(500);}
   await settle();
   const len=await page.evaluate(()=>window.__G.S.adv.length);
   for(const [k,f] of [['a',.12],['b',.45],['c',.8]]){
    await page.evaluate(([x])=>{const g=window.__G;g.P.x=x;g.P.py=0;g.P.vy=0;g.P.grounded=true;g.S.cam=Math.max(0,x-g.W*.4);},[Math.round(len*f)]);
    await page.waitForTimeout(450);
    await page.screenshot({path:`${out}/${pre}${tag}-${ch+1}-${names[ch]}-${k}.png`});
   }
  }
  // Dawn and Dusk bridge paths
  for(const route of ['dawn','dusk']){
   await page.evaluate(r=>{const g=window.__G;g.G.flags.ionePathMade=1;g.G.flags.ionePathChoice=r;g.G.flags.ioneFirstStaff=1;g.G.flags.squireBridgeBroken=1;g.P.x=640;g.P.py=0;g.P.vy=0;g.S.cam=520;},route);
   await page.waitForTimeout(500);
   await page.screenshot({path:`${out}/${pre}${tag}-7-bridge-${route}.png`});
  }
  await ctx.close();
 }
 console.log(errs.join('\n')||'chapter shots captured to '+out);await b.close();
})();
