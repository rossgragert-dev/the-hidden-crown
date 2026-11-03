// Opening continuity, raised-platform collision, and structurally grounded surfaces.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const path=require('path');
const fs=require('fs');
(async()=>{
  const browser=await chromium.launch();
  try{
    for(const viewport of [{width:390,height:844},{width:844,height:390}]){
      const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:2});
      const page=await context.newPage();
      const errs=[];
      page.on('pageerror',e=>errs.push(e.message));
      await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
      await page.locator('#bnew').click();
      await page.waitForFunction(()=>window.__G.S.mode==='play'&&window.__G.S.mission&&window.__G.S.mission.id==='m0');
      const story=await page.evaluate(()=>{
        const a=window.__G.S;
        return {mode:a.mode,id:a.mission.id,area:a.areaData.id,prologue:a.q.some(v=>/Night of Ash|King Roderan|royal nursery/.test(v.text||''))};
      });
      assert.equal(story.mode,'play');
      assert.equal(story.id,'m0');
      assert.equal(story.area,'rideout');
      assert.equal(story.prologue,false,'The old narrated pre-armory prologue must not appear');
      await page.evaluate(()=>{const g=window.__G;g.loadMissionArea(1);g.S.bi=g.S.beats.length;g.S.talk=false;g.S.q=[];});
      const geom=await page.evaluate(()=>{
        const g=window.__G;
        const a=g.S.adv;
        return {kind:a.scenery,platforms:a.platforms.map(p=>({kind:p.kind,x:p.x,y:p.y,w:p.w})),next:g.S.mission.id};
      });
      assert.equal(geom.kind,'inn');
      assert.deepEqual(geom.platforms.map(p=>p.kind),['workbench','loft','rack']);
      await page.evaluate(()=>{const g=window.__G;g.S.bi=g.S.beats.length;g.S.talk=false;g.S.q=[];g.P.x=350;g.P.py=-26;g.P.grounded=true;g.P.vy=0;g.S.cam=180;});
      await page.waitForTimeout(100);
      if(viewport.width===390){
        const shot='/tmp/shots/opening-armory-supported.png';
        fs.mkdirSync(path.dirname(shot),{recursive:true});
        await page.screenshot({path:shot});
      }
      const physics=await page.evaluate(()=>{
        const g=window.__G;
        const enemy=()=>{
          const e={k:'rat',def:{rat:1,n:'Cellar Rat',hp:8,dmg:14,rng:11,spd:0,xp:0,g:[0,0],drop:0},
            x:g.P.x+6,py:0,face:-1,hp:30,max:30,dmg:14,cd:0,wind:.01,hurt:0,
            fear:0,stun:0,vx:0,t:0,mv:false,dead:false,boss:false,
            atkA:0,dashT:0,dashPend:false,in:true};
          g.enemies.splice(0);g.enemies.push(e);
          return e;
        };
        g.S.arena=false;
        g.S.talk=false;g.S.q=[];
        g.keys.block=0;
        g.P.inv=0;g.P.hp=g.P.max;
        let e=enemy();
        g.P.py=-26;g.P.grounded=true;
        g.combatTick(.04);
        const platformHP=g.P.hp;

        g.P.inv=0;g.P.py=-20;g.P.grounded=false;
        e=enemy();
        g.combatTick(.04);
        const airborneHP=g.P.hp;

        g.P.inv=0;g.P.py=0;g.P.grounded=true;
        e=enemy();
        g.combatTick(.04);
        const groundHP=g.P.hp;

        g.enemies.splice(0);
        g.P.hp=g.P.max;g.P.inv=0;g.P.py=-26;g.P.grounded=true;
        const arrow=()=>({x:g.P.x,y:g.GY-30,vx:0,type:'arrow',dmg:16,
          hostile:1,life:1.4,face:-1,originGround:true});
        g.projectiles.push(arrow());g.combatTick(0);
        const platformArrowHP=g.P.hp;

        g.projectiles.splice(0);g.P.py=0;g.P.inv=0;
        g.projectiles.push(arrow());g.combatTick(0);
        const groundArrowHP=g.P.hp;

        g.projectiles.splice(0);
        g.P.hp=g.P.max;g.P.py=-26;g.P.grounded=true;g.P.cd=0;g.P.w=0;
        e=enemy();e.x=g.P.x+9;g.attack();
        const platformEnemyHP=e.hp;

        g.P.py=0;g.P.cd=0;
        g.attack();
        const groundEnemyHP=e.hp;
        return {max:g.P.max,platformHP,airborneHP,groundHP,platformArrowHP,groundArrowHP,
          platformEnemyHP,groundEnemyHP};
      });
      assert.equal(physics.platformHP,physics.max,'Ground rats must not hit Corin on a table');
      assert.equal(physics.airborneHP,physics.max,'Rats must not hit Corin while high above them');
      assert.ok(physics.groundHP<physics.max,'Ground melee combat must still damage Corin');
      assert.equal(physics.platformArrowHP,physics.max,'Ground-fired arrows should not pass through upper floors');
      assert.ok(physics.groundArrowHP<physics.max,'Ground-level arrows must still be harmful');
      assert.equal(physics.platformEnemyHP,30,'Corin cannot sword-strike through a raised floor');
      assert.ok(physics.groundEnemyHP<30,'Sword strikes still connect on the same floor');
      assert.deepEqual(errs,[],'No browser runtime errors');
      await context.close();
    }
    console.log('Opening: starts mounted, inn shelves align with platforms, safe vertical combat: PASS');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
