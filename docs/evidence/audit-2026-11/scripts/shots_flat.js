const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch();
  for (const [w, h, tag] of [[390, 844, 'p'], [844, 390, 'l']]) {
    for (const id of ['m3', 'm8', 'd2']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); const page = await ctx.newPage();
      await page.goto('file://' + require('path').resolve(__dirname,'../../../../index.html') + ''); await sleep(400);
      await page.evaluate(id => { const g = window.__G; const G = g.G; G.eq.sword = { id: 'sw', slot: 'sword', rar: 0, ilvl: 1, aff: [], name: 'Blunt Iron Sword', dmg: 9 }; G.shieldTier = 0; g.P.w = 0; g.calc(); g.startMission(id);
        (function l() { if (g.S.talk && !g.S.choosing) g.adv(); if (g.S.choosing) { const o = document.querySelector('.opt'); if (o) o.click(); } requestAnimationFrame(l); })(); }, id);
      for (let i = 0; i < 150; i++) { await sleep(100); if (await page.evaluate(() => window.__G.enemies.length >= 2)) break; }
      await sleep(900);
      await page.screenshot({ path: `/tmp/shots/flat-${id}-${tag}.png` });
      await ctx.close();
    }
  }
  await browser.close();
})();
