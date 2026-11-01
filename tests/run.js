const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch();
  const errs = [];
  async function session(name, vp) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(name + ' PAGEERR ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(name + ' CONSOLE ' + m.text()); });
    await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}-1-title.png` });
    await page.keyboard.press('Enter'); // start
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-2-prologue.png` });
    // click through prologue
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(150); }
    await page.waitForTimeout(2500);
    const mode = await page.evaluate(() => window.__G.S.mode);
    errs.push(name + ' mode after prologue: ' + mode);
    // intro dialogue beat 0
    await page.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
    await page.screenshot({ path: `${out}/${name}-3-dialogue.png` });
    for (let i = 0; i < 20; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    // walk right to wave 1
    await page.evaluate(() => { window.__G.P.x = 335; });
    await page.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/${name}-4-wave.png` });
    // fight: spam attack with each weapon
    for (let w = 0; w < 3; w++) {
      await page.evaluate(w => window.__G.setW(w), w);
      await page.keyboard.down('j');
      await page.waitForTimeout(1500);
      await page.keyboard.up('j');
      if (w === 1) await page.screenshot({ path: `${out}/${name}-5-staff.png` });
    }
    // kill remaining enemies via loop
    for (let i = 0; i < 40; i++) {
      const n = await page.evaluate(() => window.__G.enemies.length + (window.__G.S.arena ? 1 : 0));
      if (!n) break;
      await page.evaluate(() => { const e = window.__G.enemies[0]; if (e) window.__G.P.x = e.x - 10; window.__G.P.hp = 10; window.__G.setW(0); });
      await page.keyboard.down('j'); await page.waitForTimeout(500); await page.keyboard.up('j');
    }
    const st = await page.evaluate(() => ({ arena: window.__G.S.arena, en: window.__G.enemies.length, bi: window.__G.S.bi, talk: window.__G.S.talk }));
    errs.push(name + ' after wave1 ' + JSON.stringify(st));
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
    // guard choice beat
    await page.evaluate(() => { window.__G.P.x = 565; });
    await page.waitForTimeout(300);
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${name}-6-choice.png` });
    const opts = await page.$$('.opt');
    errs.push(name + ' options: ' + opts.length);
    if (opts.length) await opts[0].click();
    await page.waitForTimeout(400);
    for (let i = 0; i < 10; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    // granary
    await page.evaluate(() => { window.__G.P.x = 805; });
    await page.waitForTimeout(300);
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    const o2 = await page.$$('.opt');
    errs.push(name + ' options2: ' + o2.length);
    if (o2.length) await o2[2].click();
    await page.waitForTimeout(400);
    for (let i = 0; i < 10; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    // wave 2 with boss
    await page.evaluate(() => { window.__G.P.x = 1035; });
    await page.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    await page.waitForTimeout(4200);
    await page.screenshot({ path: `${out}/${name}-7-boss.png` });
    for (let i = 0; i < 80; i++) {
      const n = await page.evaluate(() => window.__G.enemies.length + (window.__G.S.arena ? 1 : 0));
      if (!n) break;
      await page.evaluate(() => { const e = window.__G.enemies[0]; if (e) window.__G.P.x = e.x - 10; window.__G.P.hp = 10; window.__G.setW(0); });
      await page.keyboard.down('j'); await page.waitForTimeout(500); await page.keyboard.up('j');
    }
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
    await page.evaluate(() => { window.__G.P.x = 1305; });
    await page.waitForTimeout(300);
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); }
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}-8-end.png` });
    const fin = await page.evaluate(() => ({ mode: window.__G.S.mode, c: window.__G.S.c, bi: window.__G.S.bi }));
    errs.push(name + ' final ' + JSON.stringify(fin));
    await ctx.close();
  }
  await session('portrait', { width: 390, height: 844 });
  await session('land', { width: 844, height: 390 });
  await browser.close();
  console.log(errs.join('\n'));
})();
