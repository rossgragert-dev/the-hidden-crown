const { chromium } = require('playwright');
require('fs').mkdirSync('/tmp/shots',{recursive:true});
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(400);
  await page.evaluate(() => { const g = window.__G; g.G.lvl = 12; g.calc(); g.openBoard(); });
  const ids = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','s1','s2','s3','s4','s5','d1','d2','d3','d4'];
  for (const id of ids) {
    await page.evaluate(id => window.__G.startMission(id), id);
    let res = 'timeout', ch = 0;
    for (let i = 0; i < 1500; i++) {
      const st = await page.evaluate(() => { const g = window.__G; g.P.hp = g.P.max; g.P.mp = g.P.mmax; const nb = g.S.beats.length; return { mode: g.S.mode, talk: g.S.talk, ch: g.S.choosing, en: g.enemies.length, arena: g.S.arena, interact: !!g.S.activeInteract, area:g.S.areaIndex, bi: g.S.bi, nb, bx: g.S.beats[g.S.bi] ? g.S.beats[g.S.bi].x : -1 }; });
      if (st.mode === 'hub') { res = 'done'; break; }
      if (st.ch) { const o = await page.$$('.opt'); if (o.length) { await o[ch++ % o.length].click(); } }
      else if (st.talk) { await page.evaluate(() => window.__G.adv()); }
      else if (st.interact) { await page.evaluate(() => { const g=window.__G;g.P.x=g.S.activeInteract.x;g.useMissionObject(); }); }
      else if (st.en) { await page.evaluate(() => { const g = window.__G, e = g.enemies[0]; if (e) { g.P.x = Math.max(g.S.arenaL + 14, Math.min(g.S.arenaR - 14, e.x - 16)); g.keys.atk = 1; } }); await page.waitForTimeout(40); await page.evaluate(()=>{window.__G.keys.atk=0;}); }
      else if (st.bx >= 0) { await page.evaluate(x => { window.__G.P.x = x + 1; }, st.bx); await page.waitForTimeout(40); }
      else await page.waitForTimeout(80);
      await page.waitForTimeout(15);
    }
    const info = await page.evaluate(() => ({ lvl: window.__G.G.lvl, c: Math.round(window.__G.G.c), inv: window.__G.G.inv.length, gold: window.__G.G.gold }));
    console.log(id, res, JSON.stringify(info));
    if (id === 'm7') await page.screenshot({ path: '/tmp/shots/B-m7-results.png' });
    if (res !== 'done') { errs.push('Mission '+id+' failed to finish: '+res); break; }
    await page.evaluate(() => window.__G.openBoard());
  }
  console.log(errs.join('\n') || 'no errors');
  if (errs.length) process.exitCode=1;
  await browser.close();
})();
