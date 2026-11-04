// v0.8.0 combat mechanics: combo, hit-stop, guard/parry, dodge, archetypes, platform feel, defeat. Exit 1 on failure.
const { chromium } = require('playwright');
const path = require('path'), url = require('url');
const URL_ = url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL_ + '?chapter=7'); await page.waitForTimeout(800);
  // A flat mission field with a knight's kit (sword, shield) and no dialogue.
  const setup = () => page.evaluate(() => {
    const g = window.__G; g.G.shieldTier = 0; g.G.eq.sword = { id: 'sw', slot: 'sword', rar: 0, ilvl: 1, aff: [], name: 'T', dmg: 10 }; g.calc();
    g.startMission('m1'); g.S.q = []; g.S.talk = false; g.S.paused = false; document.getElementById('cap').classList.remove('show'); document.getElementById('ch').innerHTML = '';
    g.S.beats.length = 0; g.S.arena = false; g.P.x = 100; g.P.py = 0; g.P.grounded = true; g.P.hp = g.P.max; g.P.inv = 0; g.P.cd = 0; g.P.w = 0; g.enemies.length = 0; g.S.haz = [];
    g.keys.block = 0; g.keys.atk = 0; g.keys.l = 0; g.keys.r = 0;
    window.mk = (k, dx, extra) => { const g = window.__G; const e = Object.assign({ k, def: Object.assign({}, g.EN[k]), x: g.P.x + dx, face: -1, hp: 400, max: 400, dmg: g.EN[k].dmg, cd: 5, wind: 0, hurt: 0, fear: 0, stun: 0, vx: 0, t: 0, mv: false, dead: false, boss: false, xpm: 1, atkA: 0, dashT: 0, in: true, recov: 0, throwPend: false }, extra || {}); g.enemies.push(e); return e; };
    window.tick = (n, dt) => { const g = window.__G; for (let i = 0; i < n; i++) { g.S.t += dt; g.combatTick(dt); } };
  });
  await setup(); await page.waitForTimeout(1500); await setup();

  // 1. sword combo: three stages, finisher heavier, window resets
  const combo = await page.evaluate(() => { const g = window.__G, P = g.P, out = []; window.mk('bandit', 20);
    for (let i = 0; i < 4; i++) { P.cd = 0; g.attack(); out.push({ stage: P.stage, cd: +P.cd.toFixed(2), next: P.combo }); P.cd = 0; }
    // let the window lapse, then swing again -> back to stage 0
    P.comboT = 0; P.cd = 0; g.attack(); out.push({ stage: P.stage, afterLapse: true }); return out; });
  ok(combo[0].stage === 0 && combo[1].stage === 1 && combo[2].stage === 2 && combo[3].stage === 0, 'swings chain 1-2-3 then loop ' + JSON.stringify(combo.map(c => c.stage)));
  ok(combo[2].cd > combo[0].cd, 'finisher has longer recovery (' + combo[2].cd + ' vs ' + combo[0].cd + ')');
  ok(combo[4].stage === 0, 'letting the window lapse restarts the combo');
  const dmg = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; const e = window.mk('bandit', 20); const hp = []; P.comboT = 0; P.combo = 0;
    for (let i = 0; i < 3; i++) { const h0 = e.hp; P.cd = 0; g.attack(); hp.push(h0 - e.hp); e.hurt = 0; } return hp; });
  ok(dmg[2] > dmg[0] * 1.4, 'finisher hits much harder than the opener ' + JSON.stringify(dmg));
  const hs = await page.evaluate(() => { const g = window.__G; g.S.hitStop = 0; g.enemies.length = 0; window.mk('bandit', 20); g.P.comboT = 0; g.P.combo = 2; g.P.comboT = 1; g.P.cd = 0; g.attack(); return { stop: g.S.hitStop, shake: g.S.shake }; });
  ok(hs.stop > 0.08 && hs.shake > 0, 'heavy finisher triggers hit-stop and shake ' + JSON.stringify(hs));

  // 2. shield guard: frontal blows blocked, finisher breaks, attacking opens him up
  const sg = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; const e = window.mk('sentry', 20, { hp: 1000, max: 1000 }); P.comboT = 0; P.combo = 0; P.cd = 0; g.attack(); const light = 1000 - e.hp;
    e.hp = 1000; P.combo = 2; P.comboT = 1; P.cd = 0; g.attack(); const heavy = 1000 - e.hp; const stunned = e.stun > 1;
    g.enemies.length = 0; const f = window.mk('sentry', -20, { hp: 1000, max: 1000, face: -1 }); P.face = -1; P.comboT = 0; P.combo = 0; P.cd = 0; g.attack(); const back = 1000 - f.hp; return { light, heavy, stunned, back }; });
  ok(sg.light < sg.back * 0.5, 'shield guard blunts frontal hits, not hits from behind ' + JSON.stringify(sg));
  ok(sg.stunned, 'heavy finisher breaks the guard and staggers');

  // 3. spearman telegraphs a longer thrust; torch raider throws fire; warhound lunges
  const sp = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; P.x = 100; const e = window.mk('spearman', 30, { cd: 0 }); window.tick(2, .016); return { wind: e.wind }; });
  ok(sp.wind >= 0.5, 'spearman winds up a slow, readable thrust ' + JSON.stringify(sp));
  const tr = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; P.x = 100; g.S.haz = []; const e = window.mk('torchraider', 100, { cd: 0 }); let seen = false; for (let i = 0; i < 400 && !g.S.haz.length; i++) { window.tick(1, .016); if (e.throwPend) seen = true; if (e.dashPend) { e.cd = 0; } }
    return { thrown: seen, hazards: g.S.haz.length, dbg: [Math.round(e.x), +e.wind.toFixed(2), +e.cd.toFixed(2), e.stun, g.S.arena, !!g.S.guard, e.in, g.enemies.length, Math.round(P.x)] }; });
  ok(tr.hazards >= 1, 'torch raider throws a torch that leaves a fire patch ' + JSON.stringify(tr));
  const fire = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; P.inv = 0; P.hp = P.max; P.x = 100; P.py = 0; g.S.haz = [{ x: 100, t: 2, tick: 0, dmg: 10, hazard: 1 }]; window.tick(3, .016); const hurt = P.hp < P.max;
    g.S.haz = [{ x: 100, t: 2, tick: 0, dmg: 10, hazard: 1 }]; P.hp = P.max; P.inv = 0; P.py = -30; P.grounded = false; window.tick(3, .016); const jumped = P.hp === P.max; P.py = 0; P.grounded = true; return { hurt, jumped }; });
  ok(fire.hurt && fire.jumped, 'standing in fire hurts; being airborne avoids it ' + JSON.stringify(fire));

  // 4. dodge roll: burst, i-frames, cooldown, recovery
  const dg = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; P.x = 100; P.inv = 0; P.hp = P.max; P.cd = 0; P.rollCd = 0; P.roll = 0; g.keys.r = 1; const x0 = P.x; const did = g.dodge(); g.keys.r = 0;
    const second = g.dodge(); const invOn = P.inv > 0; g.hurtPlayer(20, 1); const safe = P.hp === P.max; for (let i = 0; i < 20; i++) g.S.t += .016, g.update(.016); const moved = P.x - x0;
    return { did, second, invOn, safe, moved: Math.round(moved), cd: P.rollCd > 0 }; });
  ok(dg.did && !dg.second, 'roll starts and cannot be spammed ' + JSON.stringify(dg));
  ok(dg.invOn && dg.safe, 'roll grants invulnerability frames');
  ok(dg.moved > 40, 'roll is a real burst of movement (' + dg.moved + 'px)');
  const dgLate = await page.evaluate(() => { const g = window.__G, P = g.P; P.hp = P.max; P.inv = 0; P.roll = 0; P.rollCd = 0; g.dodge(); P.inv = 0; /* i-frames over, still rolling/recovering */ g.hurtPlayer(20, 1); return P.hp < P.max; });
  ok(dgLate, 'after the i-frames end the hero can be hit (limited invulnerability)');
  const dgMount = await page.evaluate(() => { const g = window.__G; g.startChapter(1); return null; }); await page.waitForTimeout(900);
  ok(await page.evaluate(() => { const g = window.__G; g.S.q = []; g.S.talk = false; g.P.rollCd = 0; return g.dodge() === false; }), 'no dodge while riding');
  await setup(); await page.waitForTimeout(300); await setup();

  // 5. timed guard: early press parries (stagger + counter), late press only blocks
  const pr = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; P.x = 100; P.face = 1; const e = window.mk('bandit', 15, { face: -1, wind: .3 }); P.inv = 0; P.hp = P.max; P.guard = 50;
    g.keys.block = 1; P.guardT = .05; g.hurtPlayer(20, -1, e); const parried = P.hp === P.max && e.stun > .8 && e.wind === 0 && P.counter > 0;
    P.inv = 0; P.guardT = .6; P.counter = 0; const g0 = P.guard; g.hurtPlayer(20, -1, e); const blocked = P.hp < P.max && P.hp > P.max - 20 && P.guard < g0; g.keys.block = 0; return { parried, blocked }; });
  ok(pr.parried, 'guard pressed in time deflects the blow, staggers the attacker and opens a counter');
  ok(pr.blocked, 'late guard still reduces damage but does not parry');
  const cnt = await page.evaluate(() => { const g = window.__G, P = g.P; g.enemies.length = 0; const e = window.mk('bandit', 20); P.comboT = 0; P.combo = 0; P.cd = 0; g.attack(); const n = 400 - e.hp; e.hp = 400; P.comboT = 0; P.combo = 0; P.cd = 0; P.counter = 1; g.attack(); const c = 400 - e.hp; return { n, c }; });
  ok(cnt.c > cnt.n * 1.4, 'a counter after a parry hits harder ' + JSON.stringify(cnt));

  // 6. platform feel
  await setup(); await page.waitForTimeout(200);
  const pf = await page.evaluate(() => { const g = window.__G, P = g.P, out = {}; const step = n => { for (let i = 0; i < n; i++) { g.S.t += .016; g.update(.016); } };
    // coyote: walk off a ledge then jump within the window
    P.grounded = false; P.coyote = .08; P.py = -6; P.vy = 30; out.coyoteJump = g.adventureJump(); P.coyote = 0; P.grounded = false; P.vy = 100; out.lateJump = g.adventureJump();
    // jump buffer: press in the air, land, jump fires
    P.grounded = false; P.py = -4; P.vy = 120; P.coyote = 0; g.adventureJump(); out.buffered = P.jbuf > 0; step(8); out.firedOnLanding = P.vy < 0 || !P.grounded;
    // variable height
    const apex = hold => { P.py = 0; P.vy = 0; P.grounded = true; P.jcut = 0; step(2); g.keys.jump = 1; g.adventureJump(); let top = 0; for (let i = 0; i < 90; i++) { if (!hold && i === 3) g.keys.jump = 0; step(1); top = Math.min(top, P.py); if (P.grounded && i > 5) break; } g.keys.jump = 0; return -top; };
    out.hold = Math.round(apex(true)); out.tap = Math.round(apex(false)); return out; });
  ok(pf.coyoteJump && !pf.lateJump, 'coyote time allows a late jump only inside the window ' + JSON.stringify(pf));
  ok(pf.buffered && pf.firedOnLanding, 'a jump pressed just before landing is buffered');
  ok(pf.hold > pf.tap + 5 && pf.tap > 25, 'holding jumps higher than tapping (' + pf.hold + 'px vs ' + pf.tap + 'px)');

  // 7. defeat: encounter resets, rewards forfeited, nothing permanent lost
  const df = await page.evaluate(() => { const g = window.__G, G = g.G, P = g.P, S = g.S; g.startMission('m1'); S.q = []; S.talk = false; S.paused = false; document.getElementById('cap').classList.remove('show');
    G.lvl = 3; G.xp = 5; G.gold = 100; G.kills = 7; g.calc(); g.wave([{ k: 'bandit', s: 1, d: 0 }, { k: 'bandit', s: 1, d: 1 }], () => {}); const invLen = G.inv.length;
    G.xp += 20; G.gold += 40; G.kills += 2; const it = g.genItem(3, 1); g.addItem(it, true); S.encSnap.items.push(it.id);
    P.hp = 0; S.t += .016; g.update(.016);
    return { xp: G.xp, gold: G.gold, kills: G.kills, inv: G.inv.length - invLen, lvl: G.lvl, hp: P.hp === P.max, queue: S.spawnQ.length }; });
  ok(df.xp === 5 && df.gold === 100 && df.kills === 7 && df.inv === 0, 'defeat forfeits the encounter\'s XP, gold and loot ' + JSON.stringify(df));
  ok(df.lvl === 3 && df.hp && df.queue === 2, 'defeat keeps level, restores health and restarts the encounter');

  // 8. multi-enemy encounter composed of archetypes is survivable by a competent (scripted) player and finishes
  const multi = await page.evaluate(() => { const g = window.__G, P = g.P, S = g.S; g.startMission('m1'); S.q = []; S.talk = false; S.paused = false; g.G.lvl = 6; g.calc(); P.hp = P.max;
    let done = false; g.wave([{ k: 'sentry', s: 1, d: 0 }, { k: 'spearman', s: 1, d: .5 }, { k: 'warhound', s: -1, d: 1 }, { k: 'torchraider', s: -1, d: 1.5 }], () => { done = true; });
    let minHp = P.hp, deaths = 0;
    for (let t = 0; t < 6000 && !done; t++) { g.S.t += .016; g.update(.016); const e = g.enemies.filter(x => !x.dead).sort((a, b) => Math.abs(a.x - P.x) - Math.abs(b.x - P.x))[0];
      if (e) { const d = e.x - P.x; if (Math.abs(d) > 26) { g.keys.r = d > 0 ? 1 : 0; g.keys.l = d < 0 ? 1 : 0; } else { g.keys.r = g.keys.l = 0; P.face = d >= 0 ? 1 : -1; } g.keys.atk = Math.abs(d) < 40 ? 1 : 0; if (e.wind > 0 && Math.abs(d) < 60 && P.rollCd <= 0 && Math.abs(d) > 0) g.dodge(); }
      if (P.hp < minHp) minHp = P.hp; if (P.hp >= P.max && minHp < P.max * .3) { deaths++; minHp = P.hp; } }
    g.keys.r = g.keys.l = g.keys.atk = 0; return { done, deaths, minHp: Math.round(minHp), left: g.enemies.length }; });
  ok(multi.done, 'four-archetype encounter can be completed ' + JSON.stringify(multi));
  ok(errs.length === 0, 'no page errors ' + errs.join('|'));
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
