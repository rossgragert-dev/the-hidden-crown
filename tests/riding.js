// v0.7.1: horseback riding - holding forward reaches a true canter gait; flag + exit gate work.
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL_ + '?chapter=1'); await page.waitForTimeout(900);
  await page.evaluate(() => { const g = window.__G; (function l() { if (g.S.talk) g.adv(); requestAnimationFrame(l); })(); });
  await page.waitForTimeout(500);
  const gaits = new Set(); let maxSp = 0;
  await page.evaluate(() => { const el = document.querySelector('[data-k=r]'), r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: r.x + 5, clientY: r.y + 5 })); });
  let flagAt = null;
  for (let i = 0; i < 160; i++) {
    await page.waitForTimeout(50);
    const r = await page.evaluate(() => { const g = window.__G, m = g.S.adv && g.S.adv.mount; return m ? { sp: m.speed, ga: g.gaitForSpeed(m.speed), x: g.P.x, f: !!g.G.flags.squireCanter } : null; });
    if (!r) break; gaits.add(r.ga); maxSp = Math.max(maxSp, r.sp); if (r.f && flagAt === null) flagAt = r.x;
  }
  console.log('gaits seen', [...gaits].join(','), 'max speed', Math.round(maxSp), 'flag at x', flagAt);
  ok(gaits.has('walk') && gaits.has('trot') && gaits.has('canter'), 'holding forward progresses walk -> trot -> canter');
  ok(flagAt !== null && flagAt > 340, 'canter lesson completes only after sustained canter past the marker');
  // releasing slows to idle (no free canter lock)
  await page.evaluate(() => { const el = document.querySelector('[data-k=r]'); el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })); });
  await page.waitForTimeout(2500);
  ok(await page.evaluate(() => { const m = window.__G.S.adv.mount; return !m || Math.abs(m.speed) < 20; }), 'releasing the button slows the horse');
  // no premature flag: fresh run, walk only
  await page.goto(URL_ + '?chapter=1'); await page.waitForTimeout(900);
  await page.evaluate(() => { const g = window.__G; (function l() { if (g.S.talk) g.adv(); requestAnimationFrame(l); })(); g.P.x = 400; g.S.adv.mount.speed = 70; });
  await page.waitForTimeout(600);
  ok(await page.evaluate(() => !window.__G.G.flags.squireCanter), 'trot speed past the marker does not count as canter');
  ok(errs.length === 0, 'no page errors ' + errs.join('|'));
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
