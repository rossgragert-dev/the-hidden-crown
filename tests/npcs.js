const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(400);
  await page.evaluate(() => { const g = window.__G; g.G.lvl = 8; g.G.eq.armor = g.genItem(8, 3, 'armor'); g.G.eq.armor.look = 2; g.G.eq.armor.col = '#c4cad4'; g.calc(); g.openBoard(); });
  const shots = [['m6', 'night-ione'], ['m4', 'fen-wren'], ['m5', 'brannoch'], ['m7', 'ashen']];
  for (const [id, name] of shots) {
    await page.evaluate(id => window.__G.startMission(id), id);
    await page.waitForTimeout(500);
    for (let i = 0; i < 40; i++) { const st = await page.evaluate(() => ({ t: window.__G.S.talk, c: window.__G.S.choosing, npc: !!window.__G.S.npc })); if (st.npc || !st.t) break; await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
    if (id === 'm4' || id === 'm6' || id === 'm5') { await page.evaluate(() => { window.__G.P.x = 300; }); }
    if (id === 'm7') { await page.evaluate(() => { window.__G.P.x = 35; }); await page.waitForTimeout(300); for (let i = 0; i < 10; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); } await page.evaluate(() => { window.__G.P.x = 305; }); await page.waitForTimeout(300); for (let i = 0; i < 12; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(80); } }
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `/tmp/shots/N-${name}.png` });
  }
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
