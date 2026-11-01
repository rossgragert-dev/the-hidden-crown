const { chromium } = require('playwright');
(async () => {
  const out = '/tmp/shots';
  const browser = await chromium.launch();
  const errs = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const g = window.__G;
    g.G.lvl = 7; g.G.pts = 6; g.G.gold = 420; g.G.done = { m1: 1, m2: 1, m3: 1, s1: 1 };
    g.G.eq.sword = g.genItem(6, 3, 'sword'); g.G.eq.staff = g.genItem(6, 2, 'staff'); g.G.eq.bow = g.genItem(6, 4, 'bow'); g.G.eq.armor = g.genItem(6, 2, 'armor'); g.G.eq.trinket = g.genItem(6, 3, 'trinket');
    for (let i = 0; i < 9; i++) g.G.inv.push(g.genItem(6, i % 5, undefined));
    g.G.sk = { iron: 2, edge: 1, bash: 1 };
    g.calc(); g.openBoard();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/U1-board.png' });
  await page.evaluate(() => { document.getElementById('modal').scrollTop = 99999; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: out + '/U1b-board-bottom.png' });
  await page.evaluate(() => { window.__G.ACT.bag(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.__G.ACT.selInv(window.__G.G.inv[3].id); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/U2-bag.png' });
  await page.evaluate(() => { window.__G.ACT.skills(); window.__G.ACT.selSk('bash'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/U3-skills.png' });
  await page.evaluate(() => { window.__G.ACT.tab('arcana'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/U4-skills2.png' });
  await page.evaluate(() => { window.__G.ACT.brief('m4'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/U5-brief.png' });
  // start mission 4 (fen) and test abilities
  await page.evaluate(() => { window.__G.startMission('m4'); });
  await page.waitForTimeout(600);
  for (let i = 0; i < 40; i++) { const t = await page.evaluate(() => window.__G.S.talk && !window.__G.S.choosing); if (!t) break; await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
  await page.evaluate(() => { window.__G.P.x = 580; });
  await page.waitForTimeout(300);
  for (let i = 0; i < 40; i++) { const t = await page.evaluate(() => window.__G.S.talk && !window.__G.S.choosing); if (!t) break; await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
  await page.waitForTimeout(2500);
  await page.evaluate(() => { window.__G.setW(0); window.__G.keys.abl = 1; });
  await page.waitForTimeout(250);
  await page.evaluate(() => { window.__G.keys.abl = 0; });
  await page.screenshot({ path: out + '/U6-fen-combat.png' });
  await page.evaluate(() => { window.__G.setW(2); window.__G.keys.atk = 1; });
  await page.waitForTimeout(900);
  await page.evaluate(() => { window.__G.keys.atk = 0; window.__G.setW(1); window.__G.toggleMode(); window.__G.keys.atk = 1; });
  await page.waitForTimeout(700);
  await page.screenshot({ path: out + '/U7-fen-staff.png' });
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
