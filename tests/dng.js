const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(400);
  await page.evaluate(() => { const g = window.__G; g.G.lvl = 8; g.G.done = { m1:1,m2:1,m3:1,m4:1,m5:1,m6:1,m7:1,m8:1 };
    const o = g.genItem(1, 4, 'outfit'); o.oid = 'regalia'; o.name = 'Aldaris Regalia'; g.G.eq.outfit = o; g.calc(); });
  const shots = [['d2','cave'],['d4','keep'],['d3','mine'],['d1','forest']];
  for (const [id, name] of shots) {
    await page.evaluate(id => window.__G.startMission(id), id);
    await page.waitForTimeout(400);
    for (let i = 0; i < 20; i++) { const t = await page.evaluate(() => window.__G.S.talk); if (!t) break; await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    await page.evaluate(() => { window.__G.P.x = 300; });
    await page.waitForTimeout(2300);
    await page.screenshot({ path: `/tmp/shots/D-${name}.png` });
  }
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
