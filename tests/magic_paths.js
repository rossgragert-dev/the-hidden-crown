// Alternate Dusk path: reject wrong magic, bridge stays blocked until correct cast,
// and both story choice and resulting causeway persist in the existing save flags.
const assert=require('assert');
const {chromium}=require('playwright'),{pathToFileURL}=require('url'),path=require('path');
(async()=>{
 const b=await chromium.launch();
 try{
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  await p.locator('#bnew').click();
  await p.waitForFunction(()=>window.__G.S.mode==='play');
  await p.evaluate(()=>{
    const g=window.__G;g.loadMissionArea(6);
    g.S.bi=g.S.beats.length;g.S.talk=false;g.S.q=[];
    g.P.x=476;g.adventureUpdate(.04);
  });
  await p.evaluate(()=>{const g=window.__G;while(g.S.talk){g.adv();g.adv();}});
  const initial=await p.evaluate(()=>{
    const g=window.__G;
    g.P.x=690;g.adventureUpdate(.01);
    return {x:g.P.x,mounted:!!g.S.adv.mount,bridge:g.G.flags.squireBridgeBroken};
  });
  assert.equal(initial.mounted,false);assert.equal(initial.bridge,1);
  assert.ok(initial.x<=625,'Uncrossable bridge must block the route');
  await p.evaluate(()=>{
    const g=window.__G,o=g.S.adv.objects.find(x=>x.kind==='staff');
    g.P.x=o.x;g.P.py=0;g.P.grounded=true;g.adventureUse();
    for(let i=0;i<12&&g.S.talk;i++){g.adv();g.adv();}
    const path=g.S.adv.objects.find(x=>x.kind==='crossroads');
    g.P.x=path.x;g.adventureUse();
  });
  assert.equal(await p.locator('#ch .opt').count(),2);
  await p.locator('#ch .opt').nth(1).click();
  const before=await p.evaluate(()=>{
    const g=window.__G;g.P.x=604;g.P.w=1;g.P.cd=0;
    g.S.dusk=false;g.attack();
    return {route:g.G.flags.ionePathChoice,built:!!g.G.flags.ionePathMade,mode:g.S.dusk};
  });
  assert.equal(before.route,'dusk');assert.equal(before.built,false);
  const after=await p.evaluate(()=>{
    const g=window.__G;g.S.dusk=true;g.P.cd=0;g.attack();
    return {route:g.G.flags.ionePathChoice,built:g.G.flags.ionePathMade,compass:g.G.c};
  });
  assert.equal(after.route,'dusk');assert.equal(after.built,1);
  assert.ok(after.compass<0,'Forcing an artificial crossing should carry a small Dusk cost');
  await p.evaluate(()=>{
    const g=window.__G;g.S.talk=false;g.S.q=[];
    g.P.x=690;g.adventureUpdate(.01);
  });
  assert.ok(await p.evaluate(()=>window.__G.P.x)>625,'Crossing must be traversable after casting');
  assert.deepEqual(errors,[]);
  console.log('Dusk bridge: blocked crossing, branch choice, spell alignment and permanent path PASS');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
