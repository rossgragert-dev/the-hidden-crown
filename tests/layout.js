// v0.7.1 mobile layout test: no overlapping essentials, >=44px targets, controls off the ground band.
// STRICT=0 prints only. Exit 1 on failures when asserting.
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const VPS = [['iphone-portrait', 390, 844, true], ['iphone-landscape', 844, 390, true], ['small-portrait', 375, 667, true], ['small-landscape', 667, 375, true], ['desktop', 1280, 800, false]];
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch();
  for (const [tag, w, h, touch] of VPS) for (const state of ['adventure', 'flat']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage(); page.errs = []; page.on('pageerror', e => page.errs.push(e.message));
    await page.goto(URL_ + (state === 'adventure' ? '?chapter=7' : '?chapter=7')); await page.waitForTimeout(900);
    await page.evaluate(st => {
      const g = window.__G, it = (s, n) => ({ id: s + '1', slot: s, rar: 0, ilvl: 1, aff: [], name: n, dmg: 5 });
      g.G.eq.staff = it('staff', 'S'); g.G.eq.bow = it('bow', 'B'); g.G.shieldTier = 0; g.calc();
      if (st === 'flat') { g.startMission('m1'); }
      g.S.q = []; g.S.talk = false; document.getElementById('cap').classList.remove('show'); document.getElementById('ch').innerHTML = ''; g.missionHud(true);
    }, state);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const g = window.__G; g.S.q = []; g.S.talk = false; document.getElementById('cap').classList.remove('show'); document.getElementById('ch').innerHTML = ''; g.missionHud(true); });
    await page.waitForTimeout(400);
    const geo = await page.evaluate(() => {
      const q = s => Array.from(document.querySelectorAll(s)).filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && e.getBoundingClientRect().width > 0; }).map(e => { const r = e.getBoundingClientRect(); return { id: e.id || e.dataset.k || e.dataset.w || e.dataset.m || e.className || e.tagName, x: r.x, y: r.y, w: r.width, h: r.height }; });
      const btns = q('#ctl .btn'), hud = q('#hud .bars, #cmp, #hb button'), trk = q('#objtrack');
      const over = (a, b) => !(a.x + a.w <= b.x + 0.5 || b.x + b.w <= a.x + 0.5 || a.y + a.h <= b.y + 0.5 || b.y + b.h <= a.y + 0.5);
      const pairs = []; for (let i = 0; i < btns.length; i++) for (let j = i + 1; j < btns.length; j++) if (over(btns[i], btns[j])) pairs.push(btns[i].id + '&' + btns[j].id);
      const trkHits = []; for (const t of trk) for (const hh of hud) if (over(t, hh)) trkHits.push(hh.id);
      const btnHud = []; for (const b of btns) for (const hh of hud) if (over(b, hh)) btnHud.push(b.id + '&' + hh.id);
      const gm = window.__G, SC = Math.max(2, Math.round(Math.min(innerWidth, innerHeight) / 200));
      const gy = gm.GY * SC; const band = { x: 0, y: gy - 60, w: innerWidth, h: 70 };
      const covered = btns.filter(b => over(b, band)).map(b => b.id);
      const small = btns.filter(b => Math.min(b.w, b.h) < 44).map(b => b.id + ':' + Math.round(Math.min(b.w, b.h)));
      const hbSmall = Array.from(document.querySelectorAll('#hb button')).filter(b => { const r = b.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2; const hit = d => { const e = document.elementFromPoint(cx, cy + d); return e === b; }; return !(hit(-21) && hit(21)); }).map(b => b.dataset.m);
      const off = btns.concat(hud, trk).filter(b => b.x < -1 || b.y < -1 || b.x + b.w > innerWidth + 1 || b.y + b.h > innerHeight + 1).map(b => b.id);
      return { ids: btns.map(b => b.id), pairs, trkHits, btnHud, covered, small, hbSmall, off, gyFrac: +(gy / innerHeight).toFixed(2) };
    });
    console.log(tag + '/' + state, JSON.stringify(geo));
    if (process.env.STRICT === '1') {
      ok(geo.pairs.length === 0, tag + '/' + state + ' no control overlaps ' + geo.pairs);
      ok(geo.btnHud.length === 0 && geo.trkHits.length === 0, tag + '/' + state + ' controls/tracker clear of HUD ' + geo.btnHud + geo.trkHits);
      ok(geo.hbSmall.length === 0, tag + '/' + state + ' HUD buttons have 44px hit area ' + geo.hbSmall);
      ok(geo.off.length === 0, tag + '/' + state + ' everything on screen ' + geo.off);
      if (touch) { ok(geo.small.length === 0, tag + '/' + state + ' targets >= 44px ' + geo.small); ok(geo.covered.length === 0, tag + '/' + state + ' controls off ground band ' + geo.covered); }
    }
    ok(page.errs.length === 0, tag + '/' + state + ' no page errors');
    await ctx.close();
  }
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
