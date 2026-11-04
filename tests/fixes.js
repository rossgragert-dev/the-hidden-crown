// v0.7.1 verified-bug regression checks.
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL_ + '?chapter=6'); await page.waitForTimeout(900);
  // V-4 weapon carry-over: staff active at end of a scene must not leak into the next mission/area
  await page.evaluate(() => { const g = window.__G; g.G.eq.staff = { id: 's', slot: 'staff', rar: 0, ilvl: 1, aff: [], name: 'S', dmg: 5 }; g.P.w = 1; g.startMission('m1'); });
  await page.waitForTimeout(700);
  ok(await page.evaluate(() => window.__G.P.w === 0), 'new mission starts with the sword drawn');
  // V-9 dialogue
  const src = await page.evaluate(() => document.documentElement.innerHTML);
  ok(!/iron blade you earned at the lists/.test(src), 'Halvard no longer says the iron blade was earned at the lists');
  ok(/iron blade from our training in the yard/.test(src), 'Halvard refers to the training-yard lesson');
  // V-3 outfit label
  ok(await page.evaluate(() => { const f = window.__G.itemStatText; return f({ slot: 'outfit' }) === 'cosmetic' && f({ slot: 'sword', dmg: 9 }) === '9 dmg' && f({ slot: 'armor', def: 4 }) === '4 def' && f({ slot: 'trinket' }) === 'trinket'; }), 'results label: outfit=cosmetic, weapon/armor/trinket unchanged');
  // Dusk is a different approach, not a penalty: repeated casts leave the compass alone
  const c = await page.evaluate(() => { const g = window.__G; g.startMission('m1'); g.S.q = []; g.S.talk = false; g.P.w = 1; g.S.dusk = true; g.P.mp = 500; g.P.mmax = 500; g.G.c = 0; for (let i = 0; i < 20; i++) { g.P.cd = 0; g.attack(); } g.P.ab = 0; g.G.sk = Object.assign({}, g.G.sk); const c1 = g.G.c; g.S.dusk = false; for (let i = 0; i < 20; i++) { g.P.cd = 0; g.attack(); } return [c1, g.G.c]; });
  ok(c[0] === 0 && c[1] === 0, 'casting Dusk or Dawn 20x does not move the compass ' + JSON.stringify(c));
  ok(errs.length === 0, 'no page errors ' + errs.join('|'));
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
