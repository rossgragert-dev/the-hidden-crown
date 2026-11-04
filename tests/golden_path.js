// v0.7.1 GOLDEN PATH: natural-input playthrough of the 7-chapter opening through the visible on-screen
// buttons (synthetic multi-pointer PointerEvents), asserting completion, save persistence and no page errors.
// Natural-input playthrough of the 7-chapter opening. Inputs go through the on-screen
// buttons (synthetic multi-pointer PointerEvents), not through game API calls. State is
// only READ from window.__G. Usage: node play.js <w> <h> <tag>
const { chromium } = require('playwright');
const fs = require('fs');
const [VW, VH, TAG] = [+process.argv[2] || 390, +process.argv[3] || 844, process.argv[4] || 'portrait'];
const OUT = (process.env.SHOTS || '/tmp/golden') + '/' + TAG; fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href);
  await page.addInitScript(() => {});
  await page.evaluate(() => {
    window.__ptr = (sel, kind, id) => { const el = document.querySelector(sel); if (!el) return false;
      const r = el.getBoundingClientRect(); const o = { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, isPrimary: false };
      el.dispatchEvent(new PointerEvent(kind === 'down' ? 'pointerdown' : 'pointerup', o)); return true; };
  });
  const down = (s, id) => page.evaluate(([s, id]) => window.__ptr(s, 'down', id), [s, id]);
  const up = (s, id) => page.evaluate(([s, id]) => window.__ptr(s, 'up', id), [s, id]);
  const tap = async (s, id = 9, ms = 60) => { await down(s, id); await sleep(ms); await up(s, id); };
  const st = () => page.evaluate(() => { const g = window.__G, S = g.S, P = g.P, a = S.adv; return {
    mode: S.mode, talk: S.talk, choosing: S.choosing, x: P.x, py: P.py || 0, grounded: P.grounded, hp: P.hp, t: S.t, area: S.areaIndex,
    speed: a && a.mount ? a.mount.speed : null, mounted: !!(a && a.mount), arena: S.arena, en: g.enemies.length,
    joust: S.joust ? { phase: S.joust.phase, role: S.joust.role, round: S.joust.round, score: S.joust.score, foe: S.joust.foe, used: S.joust.used } : null,
    flags: Object.keys(g.G.flags), objs: a ? a.objects.map(o => ({ k: o.kind, x: o.x, y: o.y || 0, done: !!o.done, lab: o.label })) : [], bridge: a && a.bridge ? { c: a.bridge.collapsed, edge: a.bridge.edge } : null, w: g.P.w }; });
  const shot = async n => { await page.screenshot({ path: `${OUT}/${n}.png` }); };

  const stats = { chapters: [], words: [] };
  let taps = 0;
  async function talk() { // advance dialogue/choices like a quick reader
    let n = 0;
    while (true) {
      const s = await st();
      if (!s.talk) return n;
      if (s.choosing) { const o = await page.$('.opt'); if (o) await o.click(); await sleep(120); n++; continue; }
      await page.locator('#panel').click({ force: true, position: { x: 40, y: 10 } }).catch(() => {}); taps++; n++;
      await sleep(90);
      if (n > 400) return n;
    }
  }
  async function holdDir(dir, id = 1) { await down(dir === 'r' ? '[data-k=r]' : '[data-k=l]', id); }
  async function releaseDir(dir, id = 1) { await up(dir === 'r' ? '[data-k=r]' : '[data-k=l]', id); }
  async function walkTo(x, tol = 5) {
    let dirHeld = null, lim = 0;
    while (lim++ < 900) {
      const s = await st();
      if (s.talk) { if (dirHeld) { await releaseDir(dirHeld); dirHeld = null; } await talk(); continue; }
      if (s.mode !== 'play') break;
      const d = x - s.x, stop = s.mounted ? Math.abs(s.speed || 0) / 2.2 : 2;
      if (Math.abs(d) <= Math.max(tol, stop)) { if (dirHeld) await releaseDir(dirHeld); await sleep(s.mounted ? 450 : 30); break; }
      const want = d > 0 ? 'r' : 'l';
      if (dirHeld !== want) { if (dirHeld) await releaseDir(dirHeld); await holdDir(want); dirHeld = want; }
      await sleep(25);
    }
    if (dirHeld) await releaseDir(dirHeld);
  }
  async function climbTo(x, y) { // jump onto a platform at height y (negative) then walk to x
    const s0 = await st();
    if (y >= 0) return walkTo(x);
    // approach from left of platform edge
    const cand = await page.evaluate(([x, y]) => window.__G.S.adv.platforms.filter(p => p.y === y && x >= p.x && x <= p.x + p.w).map(p => ({ x: p.x, w: p.w })), [x, y]);
    const p = cand[0]; if (!p) return walkTo(x);
    let tries = 0;
    while (tries++ < 6) {
      const s = await st(); if (Math.abs(s.py - y) < 2 && s.grounded) break;
      await walkTo(p.x - 14 - (tries % 3) * 8);
      await holdDir('r', 1); await tap('[data-k=jump]', 3, 70);
      for (let i = 0; i < 60; i++) { await sleep(20); const q = await st(); if (q.grounded && q.py < -1) break; if (q.grounded && i > 5) break; if (q.x > p.x + 20) { /* keep going */ } }
      await releaseDir('r', 1); await sleep(80);
    }
    await walkTo(x);
  }
  async function useAt(o) { await climbTo(o.x, o.y); await talk(); await tap('[data-k=use]', 4, 50); await sleep(150); await talk(); }

  // Title -> New Game
  await shot('00-title');
  await page.click('#bnew'); await sleep(1300); await talk();
  const start = Date.now();
  async function chapter(n, label, fn) {
    const t0 = Date.now(), s0 = await st(); const gt0 = s0.t;
    await talk(); await sleep(300); await shot(`ch${n}-a-start`);
    let status = 'ok';
    try { await Promise.race([fn(), sleep(150000).then(() => { throw new Error('chapter timeout'); })]); } catch (e) { status = 'STUCK: ' + e.message; }
    const s1 = await st();
    stats.chapters.push({ n, label, status, realMs: Date.now() - t0, gameSec: +(s1.t - gt0).toFixed(1), area: s1.area, flags: s1.flags.length });
    console.log('CH', n, label, status, 'real', ((Date.now() - t0) / 1000).toFixed(1) + 's', 'game', (s1.t - gt0).toFixed(1) + 's');
    if (status !== 'ok') { console.log(JSON.stringify(s1)); await shot(`ch${n}-STUCK`); throw new Error('stop'); }
  }
  const O = async k => (await st()).objs.filter(o => o.k === k);
  const byLab = async s => (await st()).objs.find(o => o.lab && o.lab.indexOf(s) >= 0);

  try {
    await chapter(1, 'Road', async () => {
      const r = await byLab('REINS'); await walkTo(r.x, 8); await tap('[data-k=use]', 4); await talk();
      await holdDir('r'); await sleep(200); await shot('ch1-b-ride');
      while ((await st()).x < 520) { await sleep(60); await talk(); }
      await shot('ch1-c-canter');
      const ex = await byLab('HEARTHMOOR INN'); await releaseDir('r'); await walkTo(ex.x - 2, 14);
      await tap('[data-k=use]', 4); await sleep(1800); await talk();
    });
    await chapter(2, 'Inn', async () => {
      for (const l of ['TRAVEL CHEST', 'STOREROOM KEY', 'BREASTPLATE', 'TOURNAMENT HELM', 'POLISHING OIL']) { const o = await byLab(l); await useAt(o); if (l === 'BREASTPLATE') await shot('ch2-b-loft'); }
      const ex = await byLab('INN STABLES'); await useAt(ex); await sleep(1800); await talk();
    });
    await chapter(3, 'Stables', async () => {
      await walkTo(310); // trigger rats
      await down('[data-k=atk]', 5); for (let i = 0; i < 250; i++) { await sleep(40); const s = await st(); if (s.talk) await talk(); if (!s.arena && s.en === 0 && i > 8) break; const e = await page.evaluate(() => { const g = window.__G; return g.enemies[0] ? g.enemies[0].x - g.P.x : null; }); if (e !== null) { if (Math.abs(e) > 22) { await holdDir(e > 0 ? 'r' : 'l', 1); } else await releaseDir('r', 1), await releaseDir('l', 1); } }
      await up('[data-k=atk]', 5); await releaseDir('r', 1); await releaseDir('l', 1); await shot('ch3-b-rats');
      for (const l of ['TACK ROOM CHEST', 'GROOM HALVARD', 'TOURNAMENT SADDLE']) { const o = await byLab(l); if (!o) { console.log('MISSING', l, JSON.stringify(await st())); } await useAt(o); }
      const ex = await byLab('TO THE TOURNAMENT'); await useAt(ex); await sleep(1800); await talk();
    });
    await chapter(4, 'Tournament', async () => {
      await useAt(await byLab('ARMOR SER')); await useAt(await byLab('SPARE LANCES'));
      const j = await byLab('SERVE HALVARD'); await walkTo(j.x - 3, 6); await tap('[data-k=use]', 4); await sleep(200);
      // squire handoff autopilot via real USE taps, 3 passes
      let last = -1;
      for (let i = 0; i < 1500; i++) {
        const s = await st(); if (s.talk) { await talk(); continue; } if (!s.joust) { if (i > 30) break; await sleep(30); continue; }
        const r = await page.evaluate(() => { const J = window.__G.S.joust; if (!J) return null; return { ph: J.phase, used: J.used, dx: (J.anchor + 9) - (J.a.x + 14), v: J.a.v, round: J.round }; });
        if (r && r.ph === 'approach' && !r.used && r.v > 0 && r.dx / r.v < 0.22) await tap('[data-k=use]', 4, 40);
        if (r && r.round !== last) { last = r.round; if (r.round === 2) await shot('ch4-b-joust'); }
        await sleep(12);
      }
      await talk(); await useAt(await byLab('TOURNAMENT REWARD')); await useAt(await byLab('PRACTICE RING')); await sleep(1800); await talk();
    });
    await chapter(5, 'Practice ring', async () => {
      const j = await byLab('PRACTICE JOUST'); await walkTo(j.x - 4, 8); await tap('[data-k=use]', 4); await sleep(200);
      for (let i = 0; i < 1500; i++) {
        const s = await st(); if (s.talk) { await talk(); continue; } if (!s.joust) { if (i > 40) break; await sleep(30); continue; }
        const r = await page.evaluate(() => { const J = window.__G.S.joust; return J ? { ph: J.phase, set: J.set, gap: J.b.x - J.a.x, bset: J.b.set } : null; });
        if (r && r.ph === 'approach' && r.set < 0 && r.bset >= 0.12) await tap('[data-k=use]', 4, 40);
        if (i === 120) await shot('ch5-b-joust');
        await sleep(12);
      }
      await talk(); const ex = await byLab('TRAINING YARD'); await useAt(ex); await sleep(1800); await talk();
    });
    await chapter(6, 'Training yard', async () => {
      await useAt(await byLab('FIRST BOW'));
      await tap('[data-w="2"]', 6); const t = await byLab('ARCHERY BUTT'); await walkTo(t.x - 90, 6); await tap('[data-k=r]', 7, 10);
      for (let i = 0; i < 40 && !(await st()).flags.includes('squireArcheryHit'); i++) { await tap('[data-k=atk]', 5, 60); await sleep(550); await talk(); }
      await shot('ch6-b-archery');
      await useAt(await byLab('PRACTICE SHIELD'));
      const gt = await byLab('BRACE AND GUARD'); await walkTo(gt.x, 6); await down('[data-k=block]', 8); await sleep(200); await tap('[data-k=use]', 4); await sleep(150); await up('[data-k=block]', 8); await talk();
      await tap('[data-w="0"]', 6); const sw = await byLab('STRAW DUMMY'); await walkTo(sw.x - 20, 5);
      for (let i = 0; i < 20 && !(await st()).flags.includes('squireSwordHit'); i++) { await tap('[data-k=atk]', 5, 60); await sleep(450); await talk(); }
      await shot('ch6-c-sword');
      await walkTo(1000); // sparring partner
      await down('[data-k=atk]', 5); for (let i = 0; i < 400; i++) { await sleep(40); const q = await st(); if (q.talk) await talk(); if (!q.arena && q.en === 0 && i > 8) break; const e = await page.evaluate(() => { const g = window.__G; return g.enemies[0] ? g.enemies[0].x - g.P.x : null; }); if (e !== null) { if (Math.abs(e) > 30) { await holdDir(e > 0 ? 'r' : 'l', 1); } else await releaseDir('r', 1), await releaseDir('l', 1); } }
      await up('[data-k=atk]', 5); await releaseDir('r', 1); await releaseDir('l', 1); await shot('ch6-d-spar');
      await useAt(await byLab('BLUNT IRON')); await useAt(await byLab('RIDE HOME')); await sleep(1800); await talk();
    });
    await chapter(7, 'Bridge', async () => {
      await holdDir('r'); for (let i = 0; i < 400; i++) { await sleep(60); const s = await st(); if (s.talk) { await releaseDir('r'); await talk(); await holdDir('r'); } if (s.bridge && s.bridge.c) break; }
      await releaseDir('r'); await talk(); await shot('ch7-b-collapse');
      await useAt(await byLab('ROWAN STAFF'));
      const cr = await byLab('DAWN OR DUSK'); await walkTo(cr.x - 10, 6); await tap('[data-k=use]', 4); await sleep(200); await talk();
      await shot('ch7-c-choice');
      await tap('[data-w="1"]', 6); await walkTo(560, 5); await tap('[data-k=atk]', 5, 80); await sleep(900); await talk(); await shot('ch7-d-path');
      await walkTo(840, 8);
      const rn = await byLab('LIGHT RUNE'); await useAt(rn); await shot('ch7-e-rune');
      await useAt(await byLab('HOMEWARD')); await sleep(2500); await talk();
    });
  } catch (e) { if (e.message !== 'stop') console.log('ERR', e.message); }
  const fin = await st();
  console.log('FINAL mode', fin.mode, 'total real', ((Date.now() - start) / 1000).toFixed(0) + 's', 'dialogue taps', taps);
  console.log(JSON.stringify(stats));
  console.log(errs.join('\n') || 'no page errors');
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  ok(stats.chapters.length === 7 && stats.chapters.every(c => c.status === 'ok'), TAG + ': all 7 chapters completed through on-screen buttons (' + stats.chapters.length + ')');
  ok(fin.mode === 'hub', TAG + ': campaign reaches the mission hub after chapter 7 (mode ' + fin.mode + ')');
  const sv = await page.evaluate(() => { try { const j = JSON.parse(localStorage.getItem('hiddencrown.save.v2')); return { m0: !!(j.done && j.done.m0), ver: j.ver, lvl: j.lvl }; } catch (e) { return null; } });
  ok(sv && sv.m0 && sv.ver === 3, TAG + ': progress saved with version stamp ' + JSON.stringify(sv));
  ok(errs.length === 0, TAG + ': no page errors');
  await browser.close(); process.exit(fails ? 1 : 0);
})();
