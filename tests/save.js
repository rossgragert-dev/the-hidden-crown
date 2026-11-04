// v0.7.1 save-system acceptance test: asserts (exit 1 on failure).
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const LEGACY = { lvl: 4, xp: 20, pts: 1, gold: 55, sk: {}, inv: [{ id: 'x1', slot: 'sword', name: 'Old Blade', dmg: 9 }], eq: { sword: { id: 'x2', slot: 'sword', name: 'Iron', dmg: 7 }, staff: null, bow: null, armor: null, trinket: null }, loc: 'hearth', day: 3, c: 12, flags: { ionePathChoice: 'dusk' }, done: { m0: 1, m1: 1 }, kills: 9, ng: 0, hasSave: 1, checkpoint: null, shieldTier: 0 };
(async () => {
  const browser = await chromium.launch();
  const mk = async (init) => { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true }); const page = await ctx.newPage(); page.errs = []; page.on('pageerror', e => { page.errs.push(e.message); console.log('PAGEERR', e.message); }); if (init) await page.addInitScript(init.fn, init.arg); await page.goto(URL_); await page.waitForSelector('#tbtns button',{timeout:15000}); return page; };

  // 1 legacy save (no ver, no sq) loads, keeps progress, migrates in memory
  let page = await mk({ fn: s => { try { localStorage.setItem('hiddencrown.save.v2', s); } catch (e) {} }, arg: JSON.stringify(LEGACY) });
  ok(await page.evaluate(() => !!document.getElementById('bcont')), 'legacy save shows CONTINUE');
  await page.click('#bcont'); await page.waitForTimeout(400);
  let g = await page.evaluate(() => { const G = window.__G.G; return { lvl: G.lvl, gold: G.gold, ver: G.ver, kn: G.flags.knighted, dusk: G.flags.ionePathChoice, inv: G.inv.length, sw: G.eq.sword && G.eq.sword.name, done: Object.keys(G.done).join() }; });
  ok(g.lvl === 4 && g.gold === 55 && g.kn === 1 && g.dusk === 'dusk' && g.inv === 1 && g.sw === 'Iron' && g.done === 'm0,m1', 'legacy progress intact ' + JSON.stringify(g));
  ok(g.ver === 3, 'legacy save stamped with current version in memory');
  ok(await page.evaluate(() => JSON.parse(localStorage.getItem('hiddencrown.save.v2')).lvl === 4), 'stored legacy save not rewritten until the player saves');
  ok(page.errs.length === 0, 'no page errors (legacy)');

  // 1b a v0.7.0-era squire save (sq:1, stash, no ver) stays a squire; legacy save without 'sq' becomes knighted (checked above)
  const SQ = Object.assign({}, LEGACY, { sq: 1, stash: [{ id: 's1', slot: 'sword', name: 'Stashed Blade', dmg: 12 }], flags: {} });
  const pageSq = await mk({ fn: s => { try { localStorage.setItem('hiddencrown.save.v2', s); } catch (e) {} }, arg: JSON.stringify(SQ) });
  await pageSq.click('#bcont'); await pageSq.waitForTimeout(300);
  const gs = await pageSq.evaluate(() => { const G = window.__G.G; return { sq: G.sq, kn: G.flags.knighted || 0, stash: G.stash.length }; });
  ok(gs.sq === 1 && gs.kn === 0 && gs.stash === 1, 'squire-era save is not mistaken for a legacy save ' + JSON.stringify(gs));
  // 2 round trip: save -> export -> wipe -> import restores everything
  const code = await page.evaluate(() => window.__G.exportCode());
  ok(/^HC3-[A-Za-z0-9+/=]+-[0-9a-f]{8}$/.test(code), 'export code format');
  await page.evaluate(() => { window.__G.ACT.menu && 0; });
  const page2 = await mk();
  ok(!(await page2.evaluate(() => !!document.getElementById('bcont'))), 'fresh browser has no CONTINUE');
  await page2.click('#bcode'); await page2.waitForTimeout(150);
  await page2.fill('#scin', code); await page2.click('[data-a=scimport]'); await page2.waitForTimeout(150);
  ok(await page2.evaluate(() => /Level 4/.test(document.getElementById('mw').textContent)), 'import confirmation shows summary');
  await page2.click('[data-a=scconfirm]'); await page2.waitForTimeout(500);
  const g2 = await page2.evaluate(() => { const G = window.__G.G; return { lvl: G.lvl, gold: G.gold, dusk: G.flags.ionePathChoice, sw: G.eq.sword && G.eq.sword.name, inv: G.inv.length, done: Object.keys(G.done).join(), stored: !!localStorage.getItem('hiddencrown.save.v2') }; });
  ok(g2.lvl === 4 && g2.gold === 55 && g2.dusk === 'dusk' && g2.sw === 'Iron' && g2.inv === 1 && g2.done === 'm0,m1' && g2.stored, 'import restores inventory/character/missions/choices ' + JSON.stringify(g2));

  // 3 malformed codes / data are rejected without touching the save
  for (const [name, bad] of [['garbage', 'hello world'], ['truncated', code.slice(0, code.length - 20)], ['bad checksum', code.slice(0, -1) + (code.slice(-1) === '0' ? '1' : '0')], ['empty', '']]) {
    const r = await page2.evaluate(c => window.__G.importCode(c), bad);
    ok(r.ok === false && !!r.err, 'reject ' + name);
  }
  const notSave = await page2.evaluate(() => { const b64 = btoa(JSON.stringify({ hello: 1 })); const h = (() => { let x = 0x811c9dc5; for (let i = 0; i < b64.length; i++) { x ^= b64.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return ('00000000' + x.toString(16)).slice(-8); })(); return window.__G.importCode('HC3-' + b64 + '-' + h); });
  ok(notSave.ok === false, 'reject valid code with non-save payload');
  ok((await page2.evaluate(() => window.__G.G.lvl)) === 4, 'rejected imports leave the current game untouched');

  // 4 sanitize repairs bad field types instead of crashing
  const rep = await page2.evaluate(() => { const r = window.__G.parseSave(JSON.stringify({ lvl: 'x', inv: 'no', eq: 7, flags: [], gold: -5, c: 999, loc: 5 })); return r.ok && { lvl: r.g.lvl, inv: Array.isArray(r.g.inv), eq: typeof r.g.eq.sword, flags: Array.isArray(r.g.flags), gold: r.g.gold, c: r.g.c, loc: r.g.loc }; });
  ok(rep && rep.lvl === 1 && rep.inv && rep.eq === 'object' && rep.flags === false && rep.gold === 0 && rep.c === 100 && rep.loc === 'hearth', 'malformed fields repaired ' + JSON.stringify(rep));

  // 5 corrupt primary falls back to backup
  const page3 = await mk({ fn: a => { try { localStorage.setItem('hiddencrown.save.v2', '{not json'); localStorage.setItem('hiddencrown.save.v2.bak', a); } catch (e) {} }, arg: JSON.stringify(LEGACY) });
  ok(await page3.evaluate(() => !!document.getElementById('bcont')), 'corrupt save still offers CONTINUE');
  await page3.click('#bcont'); await page3.waitForTimeout(300);
  ok((await page3.evaluate(() => window.__G.G.lvl)) === 4, 'backup used when primary is corrupt');
  const page3b = await mk({ fn: () => { try { localStorage.setItem('hiddencrown.save.v2', '{not json'); } catch (e) {} } });
  await page3b.click('#bcont'); await page3b.waitForTimeout(300);
  ok(await page3b.evaluate(() => document.getElementById('title').style.display !== 'none'), 'corrupt save with no backup stays on title (no crash)');
  ok(page3.errs.length + page3b.errs.length === 0, 'no page errors (corrupt)');

  // 6 NEW GAME asks for confirmation and backs up
  const page4 = await mk({ fn: s => { try { localStorage.setItem('hiddencrown.save.v2', s); } catch (e) {} }, arg: JSON.stringify(LEGACY) });
  await page4.click('#bnew'); await page4.waitForTimeout(200);
  ok(await page4.evaluate(() => document.getElementById('modal').classList.contains('on') && /SAVED GAME EXISTS/.test(document.getElementById('mw').textContent)), 'NEW GAME shows overwrite confirmation');
  ok(await page4.evaluate(() => JSON.parse(localStorage.getItem('hiddencrown.save.v2')).lvl === 4 && !localStorage.getItem('hiddencrown.save.v2.bak')), 'nothing changed before confirming');
  await page4.click('[data-a=scclose]'); await page4.waitForTimeout(200);
  ok(await page4.evaluate(() => JSON.parse(localStorage.getItem('hiddencrown.save.v2')).lvl === 4), 'KEEP MY GAME leaves save alone');
  await page4.click('#bnew'); await page4.click('[data-a=newyes]'); await page4.waitForTimeout(1500);
  const n = await page4.evaluate(() => ({ cur: JSON.parse(localStorage.getItem('hiddencrown.save.v2')).lvl, bak: JSON.parse(localStorage.getItem('hiddencrown.save.v2.bak')).lvl, mode: window.__G.S.mode }));
  ok(n.cur === 1 && n.bak === 4, 'new game replaced save after confirm and backed up old one ' + JSON.stringify(n));
  // restore backup from the menu
  await page4.evaluate(() => window.__G.ACT.menu()); await page4.waitForTimeout(100);
  await page4.evaluate(() => window.__G.ACT.savecode()); await page4.waitForTimeout(100);
  await page4.click('[data-a=scbackup]'); await page4.waitForTimeout(400);
  ok((await page4.evaluate(() => window.__G.G.lvl)) === 4, 'RESTORE BACKUP brings the old game back');
  ok(page4.errs.length === 0, 'no page errors (new game/backup) ' + page4.errs.join('|'));

  // 7 blocked storage: detected, visible warning, game continues, export still works
  const page5 = await mk({ fn: () => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } }); } });
  ok(await page5.evaluate(() => window.__G.SAVESTAT.ok === false), 'blocked storage detected');
  ok(await page5.evaluate(() => /blocking storage/.test(document.getElementById('title').textContent)), 'title warns about blocked storage');
  await page5.click('#bnew'); await page5.waitForTimeout(1200);
  ok(await page5.evaluate(() => window.__G.S.mode === 'play' || window.__G.S.mode === 'board'), 'game starts with blocked storage');
  await page5.evaluate(() => window.__G.save()); await page5.waitForTimeout(100);
  ok(await page5.evaluate(() => document.getElementById('savewarn').classList.contains('on')), 'failed save in play shows banner');
  await page5.evaluate(() => window.__G.ACT.menu()); await page5.waitForTimeout(100);
  ok(await page5.evaluate(() => /CANNOT BE SAVED/.test(document.getElementById('mw').textContent)), 'menu shows persistent save warning');
  const c5 = await page5.evaluate(() => window.__G.exportCode()); ok(/^HC3-/.test(c5), 'export works with blocked storage');
  ok(page5.errs.length === 0, 'no page errors (blocked) ' + page5.errs.join('|'));

  // 8 quota failure mid-game: setItem throws after boot
  const page6 = await mk();
  await page6.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError'); }; });
  const r6 = await page6.evaluate(() => { const ret = window.__G.save(); return { ret, ok: window.__G.SAVESTAT.ok, banner: document.getElementById('savewarn').classList.contains('on') }; });
  ok(r6.ret === false && r6.ok === false && r6.banner, 'quota error reported and banner shown ' + JSON.stringify(r6));

  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
