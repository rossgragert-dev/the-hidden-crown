// v0.7.1: airborne damage avoidance is the same in flat missions and the adventure engine.
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch();
  for (const [name, setup] of [['flat m1', () => { window.__G.startMission('m1'); }], ['adventure ch2', () => { const g = window.__G; g.startMission('m0'); g.loadMissionArea(2); }]]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(URL_ + '?chapter=7'); await page.waitForTimeout(700);
    await page.evaluate(setup); await page.waitForTimeout(900);
    await page.evaluate(() => { const g = window.__G; (function l() { if (g.S.talk) g.adv(); requestAnimationFrame(l); })(); }); await page.waitForTimeout(800);
    const probe = air => page.evaluate(a => { const g = window.__G; g.P.x = Math.max(60, g.P.x); g.enemies.length = 0;
      const e = { k: 'blight', def: { ...g.EN.blight }, x: g.P.x + 10, face: -1, hp: 22, max: 22, dmg: 8, cd: 5, wind: .01, hurt: 0, fear: 0, stun: 0, vx: 0, t: 0, mv: false, dead: false, boss: false, xpm: 1, atkA: 0, dashT: 0, in: true };
      g.enemies.push(e); g.P.inv = 0; g.P.hp = g.P.max; if (a) { g.P.py = -60; g.P.grounded = false; g.P.vy = -1; } else { g.P.py = 0; g.P.grounded = true; g.P.vy = 0; }
      const hp0 = g.P.hp; g.combatTick(.05); g.combatTick(.05); return { hp0, hp1: g.P.hp }; }, air);
    const ground = await probe(false), air = await probe(true);
    ok(ground.hp1 < ground.hp0, name + ': grounded hero is hit ' + JSON.stringify(ground));
    ok(air.hp1 === air.hp0, name + ': airborne hero avoids the ground hit ' + JSON.stringify(air));
    ok(errs.length === 0, name + ' no page errors');
    await ctx.close();
  }
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
