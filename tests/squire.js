// Squire kit: new games start with a tunic + wooden sword, rats are beatable, blunt iron sword after the
// Halvard's sword lesson, knighting returns the stash, and legacy saves are untouched.
const {chromium}=require('playwright');const {pathToFileURL}=require('url');const path=require('path'),assert=require('assert');
(async()=>{
 const b=await chromium.launch();const errs=[];
 const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await ctx.newPage();
 page.on('pageerror',e=>errs.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href);await page.waitForTimeout(400);
 // New-game path through the real title button
 await page.evaluate(()=>{localStorage.clear();});
 await page.reload();await page.waitForTimeout(400);
 await page.evaluate(()=>{document.getElementById('bnew').click();});await page.waitForTimeout(300);
 const kit=await page.evaluate(()=>{const G=window.__G.G;return {sw:G.eq.sword&&G.eq.sword.name,dmg:G.eq.sword&&G.eq.sword.dmg,staff:G.eq.staff,bow:G.eq.bow,armor:G.eq.armor,outfit:G.eq.outfit&&G.eq.outfit.oid,stash:G.stash.map(i=>i.name),kn:!!G.flags.knighted};});
 assert.equal(kit.sw,'Wooden Practice Sword');assert.equal(kit.dmg,6);assert.equal(kit.staff,null);assert.equal(kit.bow,null);assert.equal(kit.armor,null);
 assert.equal(kit.outfit,'blue');assert.equal(kit.stash.length,4);assert.equal(kit.kn,false);
 // weapon buttons hidden for missing weapons
 await page.evaluate(()=>{const g=window.__G;g.startMission('m0');});await page.waitForTimeout(800);
 await page.evaluate(()=>{const g=window.__G;for(let i=0;i<30&&g.S.talk;i++){g.adv();g.adv();}});
 const vis=await page.evaluate(()=>[...document.querySelectorAll('[data-w]')].map(b=>getComputedStyle(b).display!=='none').concat([getComputedStyle(document.getElementById('mode')).display!=='none']));
 assert.deepEqual(vis,[true,false,false,false]);
 // stable grain rats: still beatable with Corin's wooden sword
 await page.evaluate(()=>{const g=window.__G;g.loadMissionArea(2);g.S.talk=false;g.S.q=[];g.P.x=307;g.P.py=0;g.P.vy=0;g.P.grounded=true;g.adventureUpdate(1/60);});
 await page.waitForTimeout(1600);
 const rat=await page.evaluate(async()=>{
  const g=window.__G;
  const spawned=g.enemies.length;const type=g.enemies[0]&&g.enemies[0].def.n;
  // fight: stand near each rat and swing
  let swings=0,hp0=g.P.hp;
  for(let t=0;t<2400&&g.enemies.some(e=>!e.dead);t++){
   const e=g.enemies.find(x=>!x.dead);if(e&&Math.abs(e.x-g.P.x)>20)g.P.x+=Math.sign(e.x-g.P.x)*2;
   if(e&&Math.abs(e.x-g.P.x)<30&&t%25===0){g.P.cd=0;g.attack();swings++;}
   g.combatTick(1/60);
  }
  return {spawned,type,left:g.enemies.filter(e=>!e.dead).length,swings,hp:g.P.hp>0};});
 console.log(JSON.stringify(rat));assert.equal(rat.spawned>=2,true);assert.equal(rat.type,'Cellar Rat');assert.equal(rat.left,0);assert.ok(rat.hp);assert.ok(rat.swings>=2&&rat.swings<=10,'rats should take a few hits: '+rat.swings);
 // Blunt iron sword is earned at Halvard's chapter six training target.
 const bl=await page.evaluate(()=>{const g=window.__G;const before=g.G.eq.sword.name;
  g.loadMissionArea(5);g.S.talk=false;g.S.q=[];g.G.flags.squireSwordHit=1;g.G.flags.squireSpar=1;
  const o=g.S.adv.objects.find(x=>x.kind==='sword');g.P.x=o.x;g.P.py=0;g.adventureUse();
  return {before,after:g.G.eq.sword.name,dmg:g.G.eq.sword.dmg,flag:g.G.flags.bluntSword};});
 assert.equal(bl.before,'Wooden Practice Sword');assert.equal(bl.after,'Blunt Iron Sword');assert.ok(bl.dmg>6&&bl.dmg<=10);assert.equal(bl.flag,1);
 // tunic recolour with rarity, still a simple tunic before knighting
 const look=await page.evaluate(()=>{const g=window.__G,G=g.G;const it=g.genItem(1,2,'outfit');G.inv.push(it);G.eq.outfit=it;const o=g.heroOpts();return {cloth:o.cloth,cape:o.cape,helm:o.helm};});
 assert.equal(look.cloth,1);assert.equal(look.cape,null);assert.equal(look.helm,null);
 // knighting
 // knighting (the m11 completion hook calls this same function)
 await page.evaluate(()=>{const g=window.__G;g.S.rew={xp:0,gold:0,items:[],lv:0,c0:0};g.knightCorin();});
 const after=await page.evaluate(()=>{const G=window.__G.G;return {kn:G.flags.knighted,sw:G.eq.sword.name,staff:G.eq.staff&&G.eq.staff.name,bow:G.eq.bow&&G.eq.bow.name,armor:G.eq.armor&&G.eq.armor.name,stash:G.stash.length,old:G.inv.some(i=>i.name==="Squire's Sword")};});
 assert.equal(after.kn,1);assert.equal(after.sw,'Hearthmoor Heirloom Blade');assert.equal(after.staff,'Practice Staff');assert.equal(after.bow,'Hunting Bow');assert.equal(after.armor,"Squire's Tunic");assert.equal(after.stash,0);assert.ok(after.old);
 const lookKn=await page.evaluate(()=>{const o=window.__G.heroOpts();return o.cloth||0;});assert.equal(lookKn,0);
 // legacy save: no marker -> keeps gear and counts as knighted
 await page.evaluate(()=>{const G=window.__G.G;const legacy={lvl:5,xp:0,pts:0,gold:50,sk:{},inv:[],eq:{sword:{id:'x',slot:'sword',rar:1,ilvl:3,aff:[],name:'Old Sword',dmg:20},staff:null,bow:null,armor:null,trinket:null,outfit:null},loc:'hearth',day:1,c:0,flags:{},done:{m0:1},kills:0,ng:0,hasSave:1,checkpoint:null,shieldTier:0};localStorage.setItem('hiddencrown.save.v2',JSON.stringify(legacy));});
 await page.reload();await page.waitForTimeout(400);
 await page.evaluate(()=>{document.getElementById('bcont')&&document.getElementById('bcont').click();});await page.waitForTimeout(300);
 const leg=await page.evaluate(()=>{const G=window.__G.G;return {sw:G.eq.sword&&G.eq.sword.name,kn:G.flags.knighted,lvl:G.lvl};});
 assert.equal(leg.sw,'Old Sword');assert.equal(leg.kn,1);assert.equal(leg.lvl,5);
 assert.deepEqual(errs,[]);console.log('Squire kit: start gear, stable rats, Halvard training sword, tunics, knighting stash return and legacy saves PASS');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
