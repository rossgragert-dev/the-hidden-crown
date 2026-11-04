const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + require('path').resolve(__dirname,'../../../../index.html') + '';
(async () => {
  const browser = await chromium.launch();
  const out = {};
  async function fresh(w = 390, h = 844, qs = '') { const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); page.errs = []; page.on('pageerror', e => page.errs.push(e.message)); await page.goto(URL + qs); await sleep(500); return { ctx, page }; }
  const kit = () => { const g = window.__G; g.G.eq.sword = { id: 'sw', slot: 'sword', rar: 0, ilvl: 1, aff: [], name: 'Blunt Iron Sword', dmg: 9 }; g.G.eq.bow = { id: 'bw', slot: 'bow', rar: 0, ilvl: 1, aff: [], name: 'Field Bow', dmg: 9 }; g.G.eq.staff = { id: 'st', slot: 'staff', rar: 0, ilvl: 1, aff: [], name: 'Rowan', dmg: 12 }; g.G.shieldTier = 0; g.P.w = 0; g.calc(); };
  const autoTalk = () => { const g = window.__G; (function l() { if (g.S.talk && !g.S.choosing) g.adv(); if (g.S.choosing) { const o = document.querySelector('.opt'); if (o) o.click(); } requestAnimationFrame(l); })(); };

  // V3b: death in an arena
  { const { ctx, page } = await fresh(); await page.evaluate(kit); await page.evaluate(() => window.__G.startMission('m1')); await page.evaluate(autoTalk);
    for (let i = 0; i < 200; i++) { await sleep(100); if (await page.evaluate(() => window.__G.S.arena && window.__G.enemies.length > 0)) break; }
    const b = await page.evaluate(() => { const g = window.__G; return { hp: g.P.hp, max: g.P.max, gold: g.G.gold, xp: g.G.xp, lvl: g.G.lvl, en: g.enemies.length, px: Math.round(g.P.x), arena: g.S.arena }; });
    await page.evaluate(() => { window.__G.P.hp = 0; }); await sleep(200);
    const a = await page.evaluate(() => { const g = window.__G; return { hp: g.P.hp, max: g.P.max, gold: g.G.gold, xp: g.G.xp, lvl: g.G.lvl, en: g.enemies.length, px: Math.round(g.P.x), arena: g.S.arena, inv: g.P.inv }; });
    out.V3b_death = { before: b, after: a }; await ctx.close(); }

  // V10: Dusk spell spam moves the moral compass
  { const { ctx, page } = await fresh(); await page.evaluate(kit); await page.evaluate(() => { const g = window.__G; g.startMission('m1'); });
    await page.evaluate(autoTalk); await sleep(2500);
    const r = await page.evaluate(async () => { const g = window.__G; g.setW(1); g.G.c = 0; g.P.mp = 999; g.P.mmax = 999; if (!g.S.dusk) g.toggleMode(); const c0 = g.G.c; for (let i = 0; i < 20; i++) { g.P.cd = 0; g.P.mp = 999; g.attack(); } return { c0, c1: Math.round(g.G.c * 10) / 10, dusk: g.S.dusk }; });
    out.V10_duskSpam = r; await ctx.close(); }

  // V7: save / reload / resume at chapter boundary and mid-chapter
  { const { ctx, page } = await fresh(); await page.click('#bnew'); await sleep(1300);
    await page.evaluate(autoTalk); await sleep(500);
    // jump straight into chapter 3 via the game's own area loader (checkpoint is written by endMissionArea in real play)
    await page.evaluate(() => { const g = window.__G; g.G.checkpoint = { id: 'm0', area: 2, chapterVersion: 7 }; g.G.flags.squireChest = 1; g.G.flags.squireArmoryKey = 1; g.G.flags.squireArmor = 1; g.ACT.savegame(); });
    await page.reload(); await sleep(700);
    const hasCont = await page.evaluate(() => !!document.getElementById('bcont'));
    await page.click('#bcont'); await sleep(700);
    const brief = await page.evaluate(() => { const el = document.querySelector('[data-a="brief"][data-v="m0"]'); if (el) el.click(); return !!el; }); await sleep(300);
    const cpText = await page.evaluate(() => { const m = document.getElementById('mw').innerText; const i = m.indexOf('Checkpoint'); return i >= 0 ? m.slice(i, i + 60) : 'none'; });
    await page.evaluate(() => document.querySelector('[data-a="begin"]').click()); await sleep(1600);
    const st = await page.evaluate(() => { const g = window.__G; return { area: g.S.areaIndex, title: g.S.areaData && g.S.areaData.title, flags: Object.keys(g.G.flags).length, eqSword: g.G.eq.sword && g.G.eq.sword.name, outfit: g.G.eq.outfit && g.G.eq.outfit.name }; });
    out.V7_resume = { hasCont, brief, cpText, st, errs: page.errs }; await ctx.close(); }

  // V11: blocked storage: does the player get any warning that progress will not persist?
  { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); await page.goto(URL); await sleep(700);
    const txt = await page.evaluate(() => document.body.innerText.slice(0, 200).replace(/\n/g, ' | ')); out.V11_blockedStorage = { errs, title: txt }; await ctx.close(); }

  // V14: combat difficulty with natural kit, brute-force hold-ATK player, no guard, no healing
  async function fight(id, lvl, secs) {
    const { ctx, page } = await fresh(); await page.evaluate(kit); await page.evaluate(l => { const g = window.__G; g.G.lvl = l; g.calc(); g.startMission(arguments[0]); }, lvl);
    return { ctx, page };
  }
  for (const [id, lvl] of [['m1', 2], ['m3', 3], ['m5', 4], ['m8', 6]]) {
    const { ctx, page } = await fresh(); await page.evaluate(kit); await page.evaluate(([id, lvl]) => { const g = window.__G; g.G.lvl = lvl; g.calc(); g.startMission(id); }, [id, lvl]);
    await page.evaluate(autoTalk);
    // brute-force bot: walks to nearest enemy and holds ATK. No guard, no dodge, no healing. Samples HP.
    const res = await page.evaluate(([id]) => new Promise(resolve => { const g = window.__G; let minHp = 1e9, deaths = 0, last = null, taken = 0, t = 0; const T0 = performance.now();
      const iv = setInterval(() => { t = (performance.now() - T0) / 1000; const e = g.enemies.filter(x => !x.dead).sort((a, b) => Math.abs(a.x - g.P.x) - Math.abs(b.x - g.P.x))[0];
        if (g.P.hp < (last === null ? 1e9 : last)) taken += last - g.P.hp; if (last !== null && g.P.hp > last + 30) deaths++; last = g.P.hp; minHp = Math.min(minHp, g.P.hp);
        g.keys.atk = e ? 1 : 0; g.keys.l = 0; g.keys.r = 0; if (e) { const dx = e.x - g.P.x; if (Math.abs(dx) > 22) { if (dx > 0) g.keys.r = 1; else g.keys.l = 1; } } else if (!g.S.arena) g.keys.r = 1;
        if (g.S.mode === 'hub' || g.S.mode === 'done' || t > 150) { clearInterval(iv); g.keys.atk = 0; g.keys.l = 0; g.keys.r = 0; resolve({ finished: g.S.mode !== 'play', secs: +t.toFixed(0), minHp: Math.round(minHp), maxHp: g.P.max, deaths, dmgTaken: Math.round(taken) }); } }, 50); }), [id]);
    out['V14_' + id + '_lvl' + lvl] = res; await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
