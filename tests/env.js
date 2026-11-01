const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(400);
  for (const p of ['wood','cave','mine','keep']) {
    const ok = await page.evaluate(p => { const g = window.__G; g.openBoard(); document.getElementById('modal').classList.remove('on'); g.S.paused=false; g.S.pal = p; g.S.mode='hub'; g.S.cam = 60; return true; }, p);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `/tmp/shots/E-${p}.png` });
  }
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
