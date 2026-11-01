// Joust engine: deterministic outcomes for squire and rider roles, easy mode, misses.
const {chromium}=require('playwright');const {pathToFileURL}=require('url');const path=require('path');const assert=require('assert');
(async()=>{
 const b=await chromium.launch();const page=await b.newPage({viewport:{width:390,height:844}});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href);await page.waitForTimeout(400);
 const r=await page.evaluate(()=>{
  const g=window.__G,out={};
  const run=(cfg,pol)=>{const J=g.joustCreate(cfg);let n=0;
   while(!g.joustDone(J)&&n++<60000){
    if(pol==='perfect'&&J.role==='squire'&&J.phase==='approach'&&!J.used&&J.a.x+14>=J.anchor+5)g.joustAct(J);
    if(pol==='early'&&J.role==='squire'&&J.phase==='approach'&&!J.used&&J.a.x+14>=J.anchor-90)g.joustAct(J);
    if(pol==='late'&&J.role==='squire'&&J.phase==='approach'&&!J.used&&J.a.x+14>=J.anchor+35)g.joustAct(J);
    if(pol==='rider'&&J.role==='rider'&&J.phase==='approach'&&J.set<0&&J.b.x-J.a.x<380)g.joustAct(J);
    g.joustStep(J,1/60);}
   return {score:J.score,foe:J.foe,t:Math.round(J.t*100)/100,done:g.joustDone(J)};};
  out.perfect=run({role:'squire',anchor:500},'perfect');
  out.perfect2=run({role:'squire',anchor:500},'perfect');
  out.early=run({role:'squire',anchor:500},'early');
  out.late=run({role:'squire',anchor:500},'late');
  out.none=run({role:'squire',anchor:500},'none');
  out.easyEarly=run({role:'squire',anchor:500,easy:true},'early');
  out.rider=run({role:'rider',anchor:500,seed:3,lead:560},'rider');
  out.rider2=run({role:'rider',anchor:500,seed:3,lead:560},'rider');
  out.riderIdle=run({role:'rider',anchor:500,seed:3,lead:560},'none');
  return out;});
 console.log(JSON.stringify(r));
 assert.equal(r.perfect.score,3);assert.deepEqual(r.perfect,r.perfect2);
 assert.equal(r.early.score,0);assert.equal(r.late.score,0);assert.equal(r.none.score,0);
 assert.ok(r.easyEarly.score>=r.early.score);
 assert.ok(r.rider.done&&r.rider.score>=9);assert.deepEqual(r.rider,r.rider2);
 assert.equal(r.riderIdle.score,0);assert.ok(r.riderIdle.foe>=6);
 assert.deepEqual(errs,[]);
 console.log('Joust engine: squire/rider roles, determinism, misses, easy mode PASS');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
