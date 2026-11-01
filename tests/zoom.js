// Regression: rapid mobile taps should not trigger browser-level double-tap zoom.
// Chromium mobile emulation is not a substitute for manual iPhone Safari QA.
const assert=require('assert');
const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const path=require('path');
(async()=>{
  const browser=await chromium.launch();
  try{
    for(const viewport of [{width:390,height:844},{width:844,height:390}]){
      const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:3});
      const page=await context.newPage();
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
      await page.evaluate(()=>{const a=window.__G;a.G.done.m9=1;a.G.lvl=10;a.calc();a.startMission('m10');});
      const test=await page.evaluate(()=>{
        const target=document.querySelector('[data-k="atk"]');
        const modal=document.querySelector('#modal');
        const gameAction=getComputedStyle(target).touchAction;
        const menuAction=getComputedStyle(modal).touchAction;
        const panelAction=getComputedStyle(document.querySelector('#panel')).touchAction;
        const mk=(x,y)=>new TouchEvent('touchend',{
          cancelable:true,bubbles:true,touches:[],targetTouches:[],
          changedTouches:[new Touch({identifier:1,target,clientX:x,clientY:y})]
        });
        const first=mk(150,710);target.dispatchEvent(first);
        const second=mk(151,712);target.dispatchEvent(second);
        const distant=mk(320,780);target.dispatchEvent(distant);
        return {
          gameAction,menuAction,panelAction,
          first:first.defaultPrevented,second:second.defaultPrevented,
          distant:distant.defaultPrevented,scale:window.visualViewport&&window.visualViewport.scale
        };
      });
      assert.equal(test.gameAction,'none','Controls should opt out of browser gestures');
      assert.equal(test.panelAction,'none','Dialogue panel should opt out of double tap zoom');
      assert.equal(test.menuAction,'pan-y','Menus should remain vertically scrollable');
      assert.equal(test.first,false,'First tap must not be swallowed');
      assert.equal(test.second,true,'Second nearby tap should suppress Safari zoom');
      assert.equal(test.distant,false,'A distant tap must not be swallowed');
      await page.locator('[data-k="atk"]').tap();
      await page.waitForTimeout(65);
      await page.locator('[data-k="atk"]').tap();
      await page.waitForTimeout(80);
      assert.equal(await page.evaluate(()=>window.visualViewport.scale),1,'Rapid attack taps must not zoom the page');
      assert.equal((await page.locator('#boot').evaluate(e=>getComputedStyle(e).display)),'none','Game should boot');
      assert.deepEqual(errors,[],'No JS page errors');
      console.log(viewport.width+'x'+viewport.height+' rapid touch zoom prevention: PASS');
      await context.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
