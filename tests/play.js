const { chromium } = require('playwright');
(async () => {
  const out = '/tmp/shots';
  const vp = process.argv[2] === 'land' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const tag = process.argv[2] === 'land' ? 'L' : 'P';
  const browser = await chromium.launch();
  const errs = [];
  const ctx = await browser.newContext({ viewport: vp, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(500);
  await page.click('#bnew');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${tag}1-prologue.png` });
  const talkOut = async (n=60) => { for (let i = 0; i < n; i++) { const t = await page.evaluate(() => window.__G.S.talk && !window.__G.S.choosing); if (!t) break; await page.keyboard.press('Enter'); await page.waitForTimeout(120); } };
  await talkOut();
  await page.waitForTimeout(3500);
  const mode = await page.evaluate(() => window.__G.S.mode + ' ' + (window.__G.S.mission && window.__G.S.mission.id));
  console.log('after prologue:', mode);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${tag}2-dialogue.png` });
  await talkOut();
  // advance to wave
  await page.evaluate(() => { window.__G.P.x = 575; });
  await page.waitForTimeout(400);
  await talkOut();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${out}/${tag}3-wave-start.png` });
  await page.keyboard.down('j'); await page.waitForTimeout(1800); await page.keyboard.up('j');
  await page.screenshot({ path: `${out}/${tag}4-combat.png` });
  // kill all
  for (let i = 0; i < 30; i++) {
    const n = await page.evaluate(() => window.__G.enemies.length + (window.__G.S.arena ? 1 : 0));
    if (!n) break;
    await page.evaluate(() => { const e = window.__G.enemies[0]; if (e) window.__G.P.x = e.x - 14; window.__G.P.hp = window.__G.P.max; });
    await page.keyboard.down('j'); await page.waitForTimeout(400); await page.keyboard.up('j');
  }
  await talkOut();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${tag}5-after-wave.png` });
  const st = await page.evaluate(() => ({ lvl: window.__G.G.lvl, xp: window.__G.G.xp, inv: window.__G.G.inv.length, drops: window.__G.drops.length, bi: window.__G.S.bi, talk: window.__G.S.talk, gold: window.__G.G.gold }));
  console.log('state', JSON.stringify(st));
  // walk to chest
  await page.evaluate(() => { window.__G.P.x = 845; });
  await page.waitForTimeout(500);
  await page.evaluate(()=>{window.__G.P.x=845;});
  await page.waitForTimeout(300);
  await talkOut();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${tag}6-chest.png` });
  // finish the mission: move to end
  await page.evaluate(() => { window.__G.P.x = 1120; });
  await page.waitForTimeout(600);
  await talkOut();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}/${tag}7-results.png` });
  console.log('mode now', await page.evaluate(() => window.__G.S.mode));
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
