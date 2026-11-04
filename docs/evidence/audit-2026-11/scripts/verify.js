const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + require('path').resolve(__dirname,'../../../../index.html') + '';
(async () => {
  const browser = await chromium.launch();
  async function fresh(w, h, qs = '') {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage(); page.errs = [];
    page.on('pageerror', e => page.errs.push(e.message));
    await page.goto(URL + qs); await sleep(500); return { ctx, page };
  }
  const out = {};

  // V1: gait and speeds while mounted (ch1) with real hold on the right button
  { const { ctx, page } = await fresh(390, 844, '?chapter=1'); await sleep(800);
    await page.evaluate(() => { let t = 0; const g = window.__G; (function loop() { if (g.S.talk) g.adv(); requestAnimationFrame(loop); })(); });
    await sleep(500);
    await page.evaluate(() => { const el = document.querySelector('[data-k=r]'), r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: r.x + 5, clientY: r.y + 5 })); });
    let maxSp = 0, gaits = new Set();
    for (let i = 0; i < 90; i++) { await sleep(60); const r = await page.evaluate(() => { const g = window.__G, m = g.S.adv && g.S.adv.mount; return m ? { sp: m.speed, ga: window.__G.HGAIT ? null : null, x: g.P.x } : null; }); if (r) maxSp = Math.max(maxSp, r.sp); }
    out.V1_maxMountedSpeed = +maxSp.toFixed(2); out.V1_canterThreshold = 95; out.V1_flagSquireCanter = await page.evaluate(() => !!window.__G.G.flags.squireCanter);
    out.V1_gaitAtMax = await page.evaluate(sp => { const v = Math.abs(sp); return v < 8 ? 'idle' : v < 50 ? 'walk' : v < 95 ? 'trot' : v < 150 ? 'canter' : 'gallop'; }, maxSp);
    out.V1_ch1Platforms = await page.evaluate(() => window.__G.S.adv.platforms.length);
    out.V1_ch1ObjectKinds = await page.evaluate(() => window.__G.S.adv.objects.map(o => o.kind).join(','));
    await ctx.close(); }

  // V2: jump apex, foot vs mounted (physics constants from adventureJump / adventureUpdate)
  out.V2_apexFoot = +((288 * 288) / (2 * 620)).toFixed(1); out.V2_apexMounted = +((235 * 235) / (2 * 620)).toFixed(1);

  // V3: death penalty
  { const { ctx, page } = await fresh(390, 844); await page.evaluate(() => { const g = window.__G; g.G.lvl = 3; g.calc(); g.startMission('m3'); }); await sleep(600);
    await page.evaluate(() => { const g = window.__G; let n = 0; (function loop() { if (g.S.talk) g.adv(); requestAnimationFrame(loop); })(); });
    await sleep(1500);
    const before = await page.evaluate(() => { const g = window.__G; return { gold: g.G.gold, xp: g.G.xp, lvl: g.G.lvl, inv: g.G.inv.length, c: g.G.c, mode: g.S.mode, hp: g.P.hp, max: g.P.max }; });
    await page.evaluate(() => { window.__G.P.hp = 0; }); await sleep(250);
    const after = await page.evaluate(() => { const g = window.__G; return { gold: g.G.gold, xp: g.G.xp, lvl: g.G.lvl, inv: g.G.inv.length, c: g.G.c, mode: g.S.mode, hp: g.P.hp, max: g.P.max }; });
    out.V3_death = { before, after }; await ctx.close(); }

  // V4: does jumping dodge melee? flat mission vs adventure room
  async function jumpDodge(setup) {
    const { ctx, page } = await fresh(390, 844); await setup(page); await sleep(800);
    await page.evaluate(() => { const g = window.__G; let n = 0; const l = () => { if (g.S.talk) g.adv(); requestAnimationFrame(l); }; l(); }); await sleep(800);
    const r = await page.evaluate(() => { const g = window.__G; g.P.x = Math.max(60, g.P.x); const e = { k: 'blight', def: { ...g.EN.blight }, x: g.P.x + 10, face: -1, hp: 22, max: 22, dmg: 8, cd: 5, wind: .01, hurt: 0, fear: 0, stun: 0, vx: 0, t: 0, mv: false, dead: false, boss: false, xpm: 1, atkA: 0, dashT: 0, in: true };
      g.enemies.push(e); g.P.inv = 0; g.P.py = -60; g.P.grounded = false; g.P.vy = -1; const hp0 = g.P.hp; g.P.hp = hp0; g.combatTick(.05); g.combatTick(.05); return { hp0, hp1: g.P.hp, adv: !!g.S.adv }; });
    await ctx.close(); return r; }
  out.V4_flat = await jumpDodge(p => p.evaluate(() => { const g = window.__G; g.startMission('m1'); }));
  out.V4_adventure = await jumpDodge(p => p.evaluate(() => { const g = window.__G; g.startMission('m0'); g.loadMissionArea(2); }));

  // V6: rotate mid-play, V8 overlaps, V13 control geometry
  for (const [w, h, tag] of [[390, 844, 'portrait'], [844, 390, 'landscape'], [375, 667, 'small-portrait'], [667, 375, 'small-landscape']]) {
    const { ctx, page } = await fresh(w, h, '?chapter=7'); await sleep(800);
    await page.evaluate(() => { const g = window.__G; g.G.eq.staff = { id: 's', slot: 'staff', rar: 0, ilvl: 1, aff: [], name: 'S', dmg: 5 }; g.G.eq.bow = { id: 'b', slot: 'bow', rar: 0, ilvl: 1, aff: [], name: 'B', dmg: 5 }; g.G.shieldTier = 0; g.calc(); g.S.talk = false; document.getElementById('cap').classList.remove('show'); });
    await page.evaluate(() => { const g = window.__G; g.S.q = []; g.S.talk = false; g.missionHud(true); });
    await sleep(600);
    const geo = await page.evaluate(() => {
      const q = s => Array.from(document.querySelectorAll(s)).filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && e.getBoundingClientRect().width > 0; }).map(e => { const r = e.getBoundingClientRect(); return { id: e.id || e.dataset.k || e.dataset.w || e.dataset.m || e.className, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
      const btns = q('#ctl .btn'), hud = q('#hud .bar, #hud .lv, #hb button, #cmp'), trk = q('#objtrack');
      const over = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
      const pairs = []; for (let i = 0; i < btns.length; i++) for (let j = i + 1; j < btns.length; j++) if (over(btns[i], btns[j])) pairs.push(btns[i].id + '&' + btns[j].id);
      const trkHits = []; for (const t of trk) for (const h of hud) if (over(t, h)) trkHits.push(t.id + '&' + h.id);
      const g = window.__G, SC = Math.max(2, Math.round(Math.min(innerWidth, innerHeight) / 200));
      const gy = g.GY * SC; const band = { x: 0, y: gy - 50, w: innerWidth, h: 60 };
      const covered = btns.filter(b => over(b, band)).map(b => b.id);
      const minBtn = Math.min(...btns.map(b => Math.min(b.w, b.h)));
      return { W: g.W, H: g.H, SC, GY: g.GY, groundFrac: +(g.GY / g.H).toFixed(2), minBtn, pairs, trkHits, coveredGround: covered, nBtns: btns.length };
    });
    out['V13_' + tag] = geo;
    if (tag === 'portrait') { // V6 rotate
      await page.setViewportSize({ width: 844, height: 390 }); await sleep(600);
      const a = await page.evaluate(() => { const g = window.__G; return { W: g.W, H: g.H, py: g.P.py, grounded: g.P.grounded }; });
      await page.setViewportSize({ width: 390, height: 844 }); await sleep(600);
      out.V6_rotate = { errs: page.errs.slice(), landscape: a };
    }
    await ctx.close();
  }

  // V9: CPU-throttled frame pacing per chapter (4x slowdown) and heap
  out.V9 = [];
  for (let n = 1; n <= 7; n++) {
    const { ctx, page } = await fresh(390, 844, '?chapter=' + n); await sleep(500);
    const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.evaluate(() => { const g = window.__G; (function l() { if (g.S.talk) g.adv(); requestAnimationFrame(l); })(); });
    await sleep(1200);
    const r = await page.evaluate(() => new Promise(res => { const ts = []; let last = performance.now(), n = 0; (function f(t) { ts.push(t - last); last = t; if (++n < 120) requestAnimationFrame(f); else { ts.shift(); ts.sort((a, b) => a - b); const m = ts.reduce((a, b) => a + b, 0) / ts.length; res({ avgMs: +m.toFixed(1), p95: +ts[Math.floor(ts.length * .95)].toFixed(1), max: +ts[ts.length - 1].toFixed(1), heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null, hcache: window.__G.HCACHE.size, pcache: window.__G.pixelCacheSize }); } })(last); }));
    out.V9.push({ ch: n, ...r, errs: page.errs.length }); await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
