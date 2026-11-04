# The Hidden Crown — Comprehensive Game Audit

**Audited build:** `feature/v070-seven-chapter-squire` @ `08430e8` (v0.7.0 + art pass), `index.html` 325,357 bytes, rebuilt from `src/` with no diff.
**Review branch:** `review/comprehensive-game-audit` (documentation and evidence only; no gameplay file was changed).
**Date:** 2026-11-04

> **Question this audit answers:** If The Hidden Crown were preparing for a public early-access release, what would prevent it from being a genuinely compelling game, and what should we improve first?

---

## 0. How this was tested, and what that does and does not prove

| Level | What I did | What it can show | What it cannot show |
|---|---|---|---|
| **Source reading** | Read `10_core`, `45_adventure`, `50_game`, `60_ui`, `30_items`, the chapter and enemy data in `40_story`, the joust engine, horse gait code, CI workflows and test scripts. Skimmed the art files; did not read every line of `20_art`, `49_world`, `49a_pixel_art`, `48*`. | Logic, constants, structure, dead code | Feel |
| **Automated browser (headless Chromium, Playwright)** | (a) Played chapters 1–7 end to end through the on-screen buttons using synthetic multi-pointer events (`scripts/play.js`), in 390×844 and 844×390. (b) Targeted probes (`verify.js`, `verify2.js`). (c) Ran the full 21-mission bot. (d) Screenshots of every chapter and several later missions. | Whether the game can be completed with real button input, geometry/overlap, state transitions, frame pacing under a 4× CPU throttle | Real thumb comfort, Safari quirks, GPU/canvas cost, audio on iOS, battery/thermal |
| **Physical iPhone** | **Not performed.** | — | Everything in the right-hand column above. Nothing in this document claims iPhone verification. |

Other limits you should weigh:

- The "players" are scripts. They know where objects are and do not hesitate, so my time-to-complete numbers are a **lower bound**. My statements about how combat, jumping and riding *feel* come from reading the constants and the telemetry, not from hands on a touchscreen. Where I judge feel, I say so.
- The brute-force combat bot holds ATK and walks at the nearest enemy; it never guards, dodges, heals, or switches weapons. Treat its numbers as a rough difficulty probe only.
- Headless Chromium uses software rendering. A 4× CPU throttle approximates a slower CPU but not an iPhone's compositor.

Evidence tags used below: **VERIFIED** (reproduced by a script or visible in a screenshot), **OBSERVED** (read in source, not run), **SUSPECTED** (plausible risk, not reproduced).

Evidence lives in `docs/evidence/audit-2026-11/` (13 compressed screenshots, 5 scripts, README).

---

## 1. Short answer

The Hidden Crown has an unusually good *first ten minutes of presentation* and a game underneath it that does not yet match. Five things stand between it and a compelling early-access release, in order of weight:

1. **The game changes identity at minute ~8.** Chapters 1–7 are a mounted, platforming, interact-and-serve adventure. Every one of the next 21 missions (m1–m12, s1–s5, d1–d4) is the older flat "dialogue → enemies walk in from the edges → chest" template. Only one mission uses the adventure engine. (VERIFIED: 8 `explore:` blocks in `40_story.js`, seven in `m0` plus the Joust Lab.)
2. **The opening has almost no play in it.** Seven chapters contain two rats as combat. The objectives are mostly "walk to the glowing label and tap USE". A fast player finishes all seven in about 170 s of input time plus roughly 3–4 minutes of reading. That is a 6–8 minute prologue, not a 15–30 minute opening. (VERIFIED run + estimate.)
3. **Combat is shallow and carries no risk.** One attack button, no dodge, no parry, no combo. Dying restores full HP and costs nothing. Fifteen enemy types are really three behaviours plus sprites. (VERIFIED/OBSERVED.)
4. **The people are not yet lovable.** Ser Halvard is a good teacher with no flaw, want or secret. Ranger Elowen has **three lines in the whole game**. Magister Ione has two lines in the opening. Corin wants nothing. (VERIFIED by counting.)
5. **Mobile controls cover the game.** In portrait the weapon buttons and GUARD sit on the right edge of the play band, where enemies enter and where the chapter-7 magic path appears. The objective tracker overlaps BAG/SKILLS. Small buttons are 40 px in landscape. (VERIFIED by geometry and screenshots.)

On top of that, a release-engineering problem: **`main` is still v0.4.0**, nine stacked draft PRs sit between it and this branch (161 commits, 218 files), and CI only runs on specific feature branches.

My recommendation on your milestone assumption ("polish gameplay and the existing seven chapters first"): **agree, with two changes.** Polish *feel and play*, not more art (the art is ahead of the game), and prove the engine can carry real missions by converting one later mission to it in the same milestone, before any new content is written. Section 12.

---

## A. Executive Game Review

### Strengths (real, and worth protecting)

- **Visual identity is strong and cohesive in the opening.** The pixel art, horse rig, tournament lists and the chapter-7 gorge read as one world. The joust scene in landscape is genuinely good (`evidence/l-ch5-joust.jpg`).
- **The one-button joust is a legible, readable mechanic.** Timing is read from the horse's position against a hand "reach window", not an abstract bar (`47_joust.js`). Deterministic fixed-step simulation, shared by both roles, with an easy mode.
- **The engine is robust for what it does.** Full 7-chapter run, both orientations, zero page errors. Rotation mid-chapter caused no errors (VERIFIED). Resuming from a saved checkpoint restores the right chapter and flags (VERIFIED; the probe wrote the checkpoint directly rather than reaching it by playing). The 21-mission campaign bot completes once its test bug is fixed (VERIFIED, §C).
- **Performance headroom looks good so far.** At a 4× CPU throttle, every opening chapter held 16.5–17.0 ms average frame time; JS heap 9.5–17.4 MB (VERIFIED, with the caveats in §0). One 50 ms hitch appeared once, at chapter 2 start.
- **Single-file, dependency-free, works with blocked storage.** That is a real design constraint honoured consistently.
- **Documentation and handoffs are unusually thorough** for a hobby-scale project.

### Weaknesses

| Area | Verdict | Headline evidence |
|---|---|---|
| Core loop | Weak | One attack button; no dodge/parry; instant box hit detection; no hit-stop (`50_game.js:272–304`) |
| Stakes | Absent | Death → full HP, nothing lost (VERIFIED, V-10) |
| Enemy design | Thin | 15 enemies, 3 flags (`ranged`, `dash`, big). No code path for shield guard, spearman, bog lurker, hound or torch raider. Bosses are stat-scaled copies. |
| Level design | Opening only | 1 of 22 missions uses platforms/interaction |
| Narrative hook | Underplanted | No sign of Corin's secret, the crown, or any want in the opening |
| Choices | Mostly cosmetic scalar | One `G.c` number (−100…100) with tier names; spell spam moves it (V-11) |
| Mobile UX | Needs work | Control/HUD overlaps, 40 px buttons, empty portrait sky |
| Audio | Minimal | at least 18 oscillator `sfx()` calls in `50_game.js`; no music, no mute option |
| Process | Risky | Stacked drafts, per-branch CI, `main` at v0.4.0 |

### Readiness scorecard (my judgement, 1 = prototype, 5 = ship)

| Dimension | Score | Note |
|---|---|---|
| Presentation (art, scenes) | 4 | Opening only; later missions drop to 2 |
| Core combat feel | 2 | Functional, no depth, no risk |
| Movement / platforming | 3 | Solid constants, missing three standard forgiveness tools |
| Riding | 2 | One speed, no obstacle; strongest as joust |
| Content volume and variety | 2 | 21 missions on one template |
| Story and characters | 2.5 | Good premise and voice; thin on stakes and cast |
| Mobile UX | 3 | Works; collisions and reach issues |
| Technical stability | 3.5 | No crashes found; fragile architecture and release process |
| Audio | 1 | |
| **Early-access readiness** | **2.5 / 5** | Solid prototype and a beautiful vertical slice; not yet a game people replay |

---

## B. Chapter-by-Chapter Assessment

Timing is *game time* for a scripted fast player in my run (taps to skip text). Real first-time players add reading time (~775 words of chapter dialogue plus ~100 in pickups: about 3–4 min at 200–250 wpm).

| # | Chapter | Fast run | What the player actually does | New mechanic | Verdict |
|---|---|---|---|---|---|
| 1 | Road to Hearthmoor | 16 s | Seven text boxes, then hold RIGHT, tap USE at a marker, ride to the inn. **No obstacles** (`platforms:[]`). | Mounted movement | Pretty, passive |
| 2 | Inn storeroom | 20 s | Collect chest, key, 3 gear pieces on 3 platforms | Jump, USE | First real verb; still fetch quest |
| 3 | Stables | 26 s | Groom (one tap), saddle on loft, **2 rats** | Melee (first and only combat) | Rats are a speed bump |
| 4 | Tournament | 31 s | Armor, lances, 3 timed handoffs | Squire joust | Best chapter. Systems and fiction match |
| 5 | Practice ring | 27 s | 2 mounted passes, one tap each | Rider joust | Nice visuals; "balance, then aim" is not a mechanic |
| 6 | Training yard | 25 s | Bow→butt, shield→hold GUARD+USE on a marker, sword→dummy | Bow, guard, sword | Tutorial on props; no use against a foe |
| 7 | Broken bridge | 25 s | Bridge collapses, staff pickup, Dawn/Dusk choice, cast, cross | Staff, Dawn/Dusk | Best moment. Payoff partly hidden behind buttons (V-5) |

### What works

- Chapter 4 ties mechanic to character: the squire's job *is* the mechanic. Do more of this.
- Chapter 7's collapse is a proper set-piece; the Dawn/Dusk fork is a real, readable, authored choice with different art (golden stepping stones vs violet basalt).
- Mechanics are introduced in a sensible order (ride → jump → serve → ride-joust → ranged/guard/melee → magic).

### What does not

1. **Objectives are mostly "touch the label".** Chapter 2 is three USE taps on one shelf. Chapter 3's grooming is one tap. There is no skill expression, no choice, no consequence.
2. **Teaching happens on props, never on opposition.** Bow, guard and sword are all "pass" once and move on. Chapter 6 should end with a small fight where the skills matter.
3. **The first combat is two rats in chapter 3**, and the first *real* combat (m1) is ~20 seconds long and cost a hold-ATK bot at most 8 HP (VERIFIED).
4. **Chapter 1's first input is seven text boxes away**, and the lesson it describes does not exist: "tap JUMP to clear an obstacle" has nothing to jump (VERIFIED: `platforms:[]`, objects `reins,exit`).
5. **Chapter 1's "canter" is a trot** (V-1).
6. **No stakes, no foreshadowing.** Nothing in seven chapters hints at the crown, Corin's origin, the relic (which appears in m2), the blight, or a threat to Halvard.
7. **Continuity nit:** m1 has Halvard say "the iron blade you earned at the lists", but the blunt sword is awarded in chapter 6 at the training yard.

### Do I care about the four people?

| Character | Lines in the opening | Where else | Do I care? |
|---|---|---|---|
| Ser Halvard | 19 | 36 in story overall | **Partly.** Warm, competent, consistent voice. But no flaw, no regret, no fear, nothing he wants from Corin. A mentor, not yet a father. |
| Corin | 12 | 29 overall | **No.** Reacts, never wants. Lines are mostly "Yes, ser." |
| Ranger Elowen | **3** | **Nowhere** | No. She is a bow vendor with a nice first line. |
| Magister Ione | **2** | 18 later | Not yet. She arrives, gives a staff, comments on a choice. |

(Counts: `L('Name'` in `40_story.js` m0, plus `45_adventure.js`/`50_game.js` pickup lines; VERIFIED by grep.)

### Making the father–son bond carry the game

You told me the adoptive father dies at the end of Act I. The opening should therefore be *planting the loss*, and currently it only teaches. Cheap, high-value ways (all dialogue/state, no new engine):

1. **Give Halvard a want that is about Corin.** E.g. he is quietly assessing whether Corin is ready for something he is afraid of (the squire-to-knight step, or telling Corin the truth). One recurring line pattern ("Not yet, lad.") that pays off at the knighting.
2. **Give Halvard a small vulnerability on screen.** At the tournament he is stiff getting into his armour, or unseats himself from a pass he should have won. Corin notices. Chapter 4 already has the armour step.
3. **Let Corin make one choice for Halvard in the opening** (e.g. at the stables: use the good saddle for the tournament or keep it clean for the road home). Echo it in m1 and again at the knighting. This is the cheapest way to make a "consequence" real without a morality meter.
4. **A shared object that returns.** The practice sword/lance token/horse brush Halvard hands Corin in chapter 3 or 5 and which Corin carries until the knighting.
5. **Plant the hook.** One unexplained thing in chapter 1 or 7: a horse that flinches at Corin's belt pouch; Ione staring at Corin for a beat too long before a line about "Dusk answers a name it does not know".
6. **Elowen needs a second scene.** Even one: she is gone from the yard, her bow-stand empty, a note. Or she appears in m1 on the wall. Right now she cannot be mourned or missed.

---

## C. Technical Code Audit

### C.1 Architecture map (as read)

- 18 source files concatenated by `tools/build.sh` into one IIFE (`10_core` → `20_art` → `30_items` → `40_story` → `45_adventure` → `46_horse` → `47_joust` → `48*` scenes/props/vistas/dressing → `49*` world/pixel art → `50_game` → `60_ui`). All state is shared module-scope: `G` (save), `S` (session), `P` (player), `enemies/proj/parts/drops/fxs` arrays.
- Loop: `frame(now)` → `update(dt)` → `draw()` → `hud()` (`60_ui.js:354`). `dt = min(.05, Δ)` variable timestep. The joust has its own fixed 60 Hz sim (`47_joust.js`), which is the right pattern and the only one.
- Mission data is a list of `steps` (`say/wave/choice/chest/...`); the adventure engine is opt-in per area via `explore:{platforms, objects, scenery, mount, bridge, combatAt}`.

### C.2 Can this carry "dozens of interconnected locations and missions"?

**Not as it stands, but it is closer than it looks.** The adventure engine's data model (`explore:{...}`) is the right shape. What blocks scale:

| Blocker | Where | Why it matters |
|---|---|---|
| Two mission engines | `40_story.js` m0 vs m1+ | 21 missions cannot use platforms, objects, mounts |
| Scene art chosen by string, per-scene code | `adventureBackdrop` (`45_adventure.js:207`), `storyWorldBackdrop` (`49_world.js:369`), `drawBackdrop` (`20_art.js:222`), `49a_pixel_art.js`, plus `48b/c/d` | Four-plus background pipelines with different camera conventions (`interiorBackCam`'s 0.74 factor). Each new location is bespoke code |
| Scene staging hard-coded in game logic | NPC positions `106, 728, 514, 170` in `50_game.js:467–483`; Ione cast gate `P.x>=515` and `bridge.edge+10` in `attack()` (`50_game.js:277–291`) | Cannot add a new "magic path" or NPC without editing `attack()` / `drawScene()` |
| Interactions are a `kind` switch | `adventureUse` (`45_adventure.js:41–120`) | Every new interactable adds a branch; no data-driven triggers |
| No room graph | `loadMissionArea(idx)` is a linear index | No doors between rooms, no keys, shortcuts, back-tracking, persistent room state |
| Flags are an unstructured bag | `G.flags` | 35 flags by end of m0; no namespacing, no cleanup, no schema |
| `window.__G` exposes internals | `60_ui.js:360` | Tests depend on it; production has a full cheat console |

### C.3 Verified bugs

| ID | Bug | Repro | Location |
|---|---|---|---|
| **V-1** | The "canter" lesson teaches a trot. Mounted speed tops out at **94**; canter starts at **95**. `squireCanter` and the toast "STEADY CANTER LEARNED" fire at speed > 66 (a trot). Chapter 1 also has no obstacles to jump. | New game → ch1 → hold RIGHT. Max measured speed 94; `gaitForSpeed(94)='trot'`. | `45_adventure.js:149`, `46_horse.js:24`, `50_game.js:388`, `40_story.js` ch1 |
| **V-2** | JUMP is shown in flat missions but does nothing useful: `heroEnemyOverlap` returns `true` when `!S.adv` so jumping never evades melee. In adventure rooms the same jump evades (HP 100→92 vs 100→100 in the probe). | `verify.js` V4 | `50_game.js:229–234`, `45_adventure.js:7` |
| **V-3** | Results screen labels outfits as "trinket" ("Greenmarch Ranger — Uncommon Outfit · trinket"). | Finish m0 | `60_ui.js:246` |
| **V-4** | Weapon selection leaks into the next mission: m1 starts with the staff active though the dialogue says "take your shield and iron blade". | Finish m0 → m1 (`evidence/p-m1-fight.jpg`) | `startMission` does not reset `P.w` |
| **V-5** | HUD/control collisions. Objective tracker overlaps BAG/SKILLS in portrait (390×844 and 375×667) and the XP bar in landscape. Weapon buttons (SWORD/STAFF, DAWN) and GUARD/SKILL sit on the ground band at the right edge, hiding enemy entry points and the ch7 crossing. | Screenshots `p-ch7-path`, `l-ch7-path`, `p-m1-fight`; geometry in `verify.js` V13 | `00_head.html` CSS |
| **V-6** | **Silent save failure.** With storage blocked, the game boots and plays normally with no indication that nothing will be saved. This is exactly the situation inside a sandboxed iframe or a private Safari tab. | `verify2.js` V11 | `10_core.js:36–40` |
| **V-7** | `NEW GAME` (second tap) erases the only save immediately, before the new run has produced anything. No backup, no export. | Title with a save | `60_ui.js:299` |
| **V-8** | `tests/bot.js` "times out on m2" is a **test bug**: `page.$('.opt')` returns one handle, then `.length` is `undefined`, so choices are never clicked. With `$$`, all 21 missions complete. | `scripts/bot_fixed.js` → `m1…d4 done, no errors` | `tests/bot.js` |
| **V-9** | Continuity: m1 line "the iron blade you earned at the lists" (awarded in ch6). | read | `40_story.js:171` |
| **V-10** | Death has no cost: set HP 0 → full HP, same XP/gold/loot, arena restarts. | `verify2.js` V3b | `50_game.js:415–416` |
| **V-11** | Dusk magic moves the moral compass mechanically: each Dusk bolt −1.5, Nova −3. Twenty bolts took the compass from 0 to −30, which flips the tier to "The Iron Hand", independent of any story context. | `verify2.js` V10 | `50_game.js:302,317` |

### C.4 Suspected risks (not reproduced)

| ID | Risk | Why I suspect it | Check |
|---|---|---|---|
| S-1 | Quest-critical weapons can be sold or replaced in the Bag. Elowen's bow and Ione's staff are normal inventory items, objects are one-shot via flags, and `sellItem` has no quest guard. Losing the bow before the archery butt softlocks chapter 6 on a first run. | `45_adventure.js:81–90`, `30_items.js:69` | Unlikely in first play (chest drops are outfit/trinket only), possible on replay |
| S-2 | `fade(cb)` runs `cb` after 850 ms unconditionally (`50_game.js:33`). Double-tapping BEGIN/CONTINUE queues two `startMission` calls. | read | Rapid-tap test |
| S-3 | Replays re-arm every object (`done:!S.replay&&...`) so each replay re-rolls chest loot and gold. Possibly intended; will matter for economy. | `45_adventure.js:11` | Replay m0 ×3 |
| S-4 | `Object.assign(G,p)` of an unvalidated save; a hand-edited `flags:null` would crash. | `10_core.js:37` | fuzz |
| S-5 | Real iPhone frame cost unknown. ~1.7k `fillRect`/frame in the busiest scene (from the art pass) plus offscreen composites at SC=2. | no device | Instruments / Web Inspector on device |
| S-6 | `VCACHE` flushes everything when >28 keys (`48c_vistas.js:41`), including the layers in use, so a rotation burst could hitch. | read | Rotate ×10, watch frame times |
| S-7 | Per-frame array churn: `filter` on timers, particles, fx, projectiles, drops, enemies (`50_game.js:358–359,367–369`). | read | Allocation profile on device |

### C.5 Code quality notes (OBSERVED)

- **Dead/legacy code:** `magegarden` branches remain in `45_adventure.js:426`, `49_world.js:42,349`, `49a_pixel_art.js:22`, `50_game.js:467`; the area no longer exists.
- **Combat is one function** (`updateCombat`, `50_game.js:321–360`). AI is flags + distance checks; there is no state machine, no per-enemy behaviour table, no boss branch.
- **Duplication:** two vertical-hit-test families (`heroEnemyOverlap`, `hostileProjectileHitsHero`, `projectileHitsEnemy`) with slightly different tolerances.
- **Magic numbers everywhere** (jump `-288/-235`, gravity `620`, walking `64`, mounted `94/-43`, attack `.36`), none named or in a config object.
- **Good:** deterministic seeded RNG (`rnd` seeded `11`) makes tests reproducible; the joust fixed-step engine is clean; build is a few lines of shell and the CI "index.html is up to date" check is right.

### C.6 Tests, CI and release process

- **25 test scripts, 1,374 lines.** Most drive the game through `window.__G` (teleport `P.x`, call `useMissionObject`). A few click title/menu buttons and `zoom.js` fires synthetic touches at the double-tap guard, but **none plays a chapter by holding the on-screen movement/JUMP/USE/ATK buttons.** My `play.js` is the first, and it found nothing broken, which is itself a useful result; keep it as the golden-path smoke test.
- **Nine workflows, each bound to one feature branch** (`seven-chapters-v070.yml` triggers on pushes to its branch and PRs into `feature/v0651-armory-grounding`). Nothing runs on `main`, and a new branch such as this review branch gets no CI.
- `npm run test:bot` (the 21-mission run) is in **no** workflow. Its README description says "plays all 21 missions" but it currently fails because of V-8.
- **Release:** `main` is v0.4.0. PRs #1→#9 form a nine-deep stacked chain of drafts; this branch is 161 commits / 218 files ahead. Every PR rewrites `index.html` wholesale, so merging out of strict order will conflict. The longer this waits, the more expensive the merge.
- `.nojekyll` suggests GitHub Pages: if so, the public build is v0.4.0.

---

## D. Gameplay Improvement Proposals

For each: why it helps *this* game, how it would work, and what it costs. I deliberately do not propose a feature unless it fixes a verified weakness.

### D.1 Combat

**Problem (VERIFIED/OBSERVED):** one attack, instant hit box, no risk, no read on enemies; the brute-force bot cleared m1 (18–22 s, ≤8 HP lost) and m5 (18 s) trivially, while m3's hound boss and m8 killed it 1 and 3 times: difficulty comes from stat spikes, not skill.

**Proposal (small, in this order):**
1. **Hit feedback first** (hit-stop 50–70 ms, short shake on heavy hits, enemy flinch frame, directional knockback). It is cheap and changes feel more than any new move. *Cost: Low. Files: `hitEnemy`, `drawEnemy`.*
2. **A dodge/roll with i-frames on the SKILL button's position or a swipe** (one more verb, because JUMP already exists). Pair it with enemy **telegraphs** (a visible wind-up the player can read; the `wind` timer already exists). *Cost: Medium.*
3. **A timed guard ("brace")**: tap GUARD just before a hit for a deflect plus a free counter; holding keeps the current soft block. This turns the shield (introduced in ch6 and otherwise passive) into a decision and uses Halvard's "turn a blow" fiction. *Cost: Medium.*
4. **Two-hit sword string with a finisher** (not a combo system): attack 1, attack 2 within 0.4 s with extra knockback. It gives rhythm without more buttons. *Cost: Low–Medium.*
5. **Real death consequence that fits the story**: not permadeath. Option: *Halvard's rebuke.* A defeat loses the wave's loot and costs a "supplies" resource, or sets a flag Halvard references. The point is that retrying must cost something small and narrative. *Cost: Low.*

**Do not** add generic ARPG depth (more stat trees, affix pools). The skill tree is 21 nodes of `+x%` stats and four active abilities; it is already the least story-connected system.

### D.2 Movement and platforming (OBSERVED + computed)

- Jump apex is 66.9 px on foot (`288²/(2·620)`) and 44.5 px mounted; the tallest opening platform is the inn loft at 54 px, so the margin is 12 px.
- Missing, and standard for a touch platformer: **variable jump height**, **coyote time** (`standing` fails the instant the feet leave the ledge, `45_adventure.js:171–175`), **input buffering** (`adventureJump` needs `P.grounded`, `:28`). Together these remove most "I pressed it" frustration on a thumb. *Cost: Low. Acceptance: 100 ms coyote and 120 ms buffer verified by unit test.*
- All platforms are one-way and the hero is a point (`±4 px` tolerance). That is fine for the current rooms, but it rules out ceilings, walls and overhangs. Decide early whether "castles, caves, ruins" need solid geometry (Medium–High) before authoring more rooms.
- The camera is fixed vertically unless a map opts in; keep that.

### D.3 Horses

**Problem (VERIFIED V-1):** riding is one speed (94), no gallop, no stamina, no obstacle, no reason to prefer it to walking except speed. Horses are best in the joust.

**Proposal:** make a recurring "road" mission verb: *pace control*. Hold to gather, release to coast; three gaits with real thresholds (walk 46 / trot 92 / canter 132 / gallop 176 already exist in `JOUST_CFG.speed`); obstacle types (hedge, ditch, fallen log) that need a timed JUMP at canter; a stamina bar that makes the gallop a choice. Tie horse difference to fiction: Corin's gelding is steady (forgiving), Halvard's charger is fast but spooks. Later horses unlock as *story* rewards, not drops. *Cost: Medium. Reuses horse rig and joust speeds.*

### D.4 Enemies and encounters

**Problem (VERIFIED by grep):** `sentry` (shield guard), `spearman`, `boglurker`, `hound`, `torchraider` have **zero** type-specific code. Archetypes are only melee-chaser, ranged-kiter, dasher and "big".

**Proposal:** give each of the first six enemies *one* defining rule, and make levels mix them:
- Shield guard: blocks frontal hits; needs the dodge/behind or a bash.
- Spearman: long reach, slow wind-up; punishable up close.
- Torch raider: dash + ground fire patch.
- Sapper: runs at the ward (`S.guard`) and explodes (you already have a defend mode).
- Hound: lunge with a visible crouch; the boss version adds a second phase (howl summons two blightlings).
- Bog lurker: grab/stun if you are idle.
Then encounter design is "which two of these together?" rather than "more of the same". Region identity (`green`, `fen`, `keep`) can assign the deck. *Cost: Medium; the `wind/dash/stun` fields are already per-enemy.*

### D.5 Magic

- Dawn/Dusk is the best idea in the game and the weakest implementation. A toggle plus a `G.c` nudge per cast (V-11) turns it into a stat modifier and punishes the player for using a spell. **Decouple compass from casting.** Let Dusk have *world* effects (fear, passing through blighted barriers, taking shortcuts that scar the land) and let consequences land in dialogue and map state.
- The chapter-7 path is the template: same spell, different crossing, different relationship with Ione. Build 3–4 more of those **magic interactions in the world** (reveal, force, mend, banish) and make Dawn/Dusk a *choice with a tell*, not a mode.

### D.6 Equipment and progression

- Random affix loot (`genItem`, 28-slot bag, sell-all-commons) belongs to a different game. For an Arthurian story: **authored items with names and histories** (the heirloom blade, Halvard's lance token, Ione's staff) and a small number of upgrades (a smith, a sharpener), with outfits as cosmetics. Keep numbers small.
- Chapter rewards: the entire opening yields **Lv 2** (101 XP) and a loot screen of 5 random items including a duplicate "Blunt Iron Sword" (`evidence/p-m0-results.jpg`). Give seven chapters a bigger, hand-chosen reward.
- Skill tree: keep Valor/Arcana/Wild as identity, but cut it to the ~10 nodes that change play (the four abilities and a few passives) and delete the `+x%` filler.

### D.7 Exploration and world structure

- Introduce a **room graph** (rooms with named exits, locked/unlocked states, keys, persistent room flags). It is a small data change on top of `loadMissionArea` and unlocks castles, caves, ruins. *Cost: Medium–High; highest leverage after combat.*
- The current "travel" legs are **procedurally assembled generic roads** (`60_ui.js:123–173`): 890–1,180 px, two scripted waves, one cache. Replace with authored short roads or with a *one-screen events* system; right now travel is the most repetitive content in the game.
- The map is attractive and clear (`evidence/p-worldmap.jpg`), but at that point every road is locked (red X markers) and 30 "later chapter" stubs are listed. For early access, show only what exists.

### D.8 Choices and consequences (without a morality meter)

You asked for meaningful choices without an oath-management system. The current system is a single scalar with titles from "The Beloved" to "The Monster King" and a HUD slider.

- **Replace the scalar with named relationship/consequence flags** stored where they matter: `halvardTrust`, `ioneWary`, a settlement's `fed`/`burned`. Surface them in dialogue and map state ("the guard you spared is at the gate"), never as a title.
- Offer **three-to-five major choices in Act I whose consequences are visible at the knighting/death scene**. Right now m2 (spare/rob/kill), m3 (share/ration/seize) and the Dawn/Dusk fork all move the same number.
- **Remove the +12/−14 numbers from the toast** ("Mercy +12").

---

## E. Visual and Audio Assessment

### E.1 Visual: what to keep

Keep the established direction: edge-lit bevels, grain, contact shadows, horse rig, parallax. It works.

### E.2 Remaining opportunities (in order of impact)

1. **Portrait composition.** At 390×844 the ground line is at 77 % of canvas height (`GY=323` of `H=422`). Chapters 1 and 6 leave roughly the upper 45 % as empty sky (`evidence/p-ch1-canter.jpg`, `p-ch6-archery.jpg`). Either push the camera up and add a mid-layer, or move the objective and joust UI into that space, or raise the horizon with a taller foreground band. *Cost: Medium.*
2. **Later missions look like a different game.** m3 is a flat, muted barn with an empty green slab below it (`l-m3-flat.jpg`); d2 (caves) is three grey boxes, cyan rectangles and **rain streaks in a cave** (`p-d2-cave.jpg`). The opening's bar is 4/5; the rest is ~2/5. This is the main visual risk for early access. Do not repaint everything; define a reusable **scene template** (sky, three parallax bands, ground, 6–8 props) and generate a distinct look per region from it.
3. **Weapon buttons are text** ("SWORD/STAFF/BOW/DAWN") and large. Icons plus a radial or swap button would free the right edge.
4. **Inn and stable walls are still older art** with new dressing on top; tournament stands repeat every 210 px; horses differ by tack only (no body variants). Known from the art-pass notes; keep as P2.
5. **Combat VFX:** hits are a number plus 5 green pixels, and a ring for abilities. No slash arcs, no impact frames, no death animation beyond disappear; bolts are small rectangles. Weather exists as overlay only (no interaction with the player/world).
6. **Enemy readability:** with 15 types and 3 behaviours, silhouette should signal behaviour (shield = wide frontal, spear = long line, dash = lowered).

### E.3 Audio (VERIFIED/OBSERVED)

- One `AudioContext` and at least 18 `sfx()` oscillator calls in `50_game.js`. **No music, no ambience, no mute/volume.** For a story game on a phone this is the single biggest emotional lever you are not using.
- Single-file/no-asset constraint → **procedural music** (a tiny WebAudio sequencer with 6–8 hand-written loops: road, inn, tournament, practice, night, danger, Dawn/Dusk motifs) and layered ambience (wind, crowd, horse hooves). *Cost: Medium; no asset pipeline needed.*
- Add: **Mute / music / SFX sliders** in MENU, and honour iOS silent-switch behaviour (document it).

### E.4 Accessibility

- No audio controls; no text-speed or text-size option; screen shake is not optional (`S.shake`), colour carries meaning (HP red/MP blue, rarity colours) with no shape cue; 40 px buttons in landscape; one-handed play is impossible by design (that is okay; say so).
- Add: reduce-shake toggle, dialogue speed, larger HUD toggle, left-handed layout swap (movement/combat sides), and ≥44 px targets.

---

## F. Prioritised Improvement Backlog

Complexity: Low (≤1 day), Medium (days), High (1–2 weeks), Very High (multi-week). Dependencies in brackets.

### P0 — Critical (reliable play, data, release integrity)

**P0-1 · Make save status visible and recoverable** (V-6, V-7)
- *Problem:* storage can fail silently; NEW GAME erases the only save immediately; no backup/export.
- *Evidence:* `verify2.js` V11; `10_core.js:36–40`; `60_ui.js:299`.
- *Solution:* detect storage failure at boot and show a persistent "Progress will not be saved here" banner with a copy-code export/import; save with a `ver` field and migration table; keep a rotating backup (`...v2.bak`); NEW GAME writes only after the first mission step and keeps the old save as backup.
- *Benefit:* players never lose hours silently, and the preview in a sandboxed iframe stops lying.
- *Complexity:* Low–Medium. *Modules:* `10_core`, `60_ui`. *Deps:* none.
- *Acceptance:* with blocked storage a banner appears within 1 s and export/import round-trips a full save; NEW GAME retains a restorable backup; unit test loads saves from v0.4, v0.6, v0.7 fixtures.

**P0-2 · One CI that guards `main` and every branch; unify the test run** (§C.6)
- *Problem:* nine per-branch workflows; none on `main`; bot test not in CI and wrongly "failing".
- *Solution:* single `ci.yml` on all pushes/PRs: build + `git diff` check, boot/smoke, the real-input golden path (`play.js`), full-campaign bot (fix `$$`), joust, zoom. Delete the nine old workflows after parity.
- *Complexity:* Low–Medium. *Modules:* `.github/workflows`, `tests/bot.js`. *Deps:* none.
- *Acceptance:* a PR to any base triggers the suite; the suite passes on this branch; a deliberately broken commit fails it.

**P0-3 · Collapse the nine-deep stacked PRs into a mergeable release path**
- *Problem:* `main` is v0.4.0; every PR rewrites `index.html`; merging in any non-strict order conflicts; the public build is probably stale.
- *Solution (needs your approval; I did not do any of it):* decide the release candidate branch; merge the stack *bottom-up* via fast-forward-style merges or squash into one `develop`; stop committing `index.html` (build it in CI and publish as an artifact/Pages deployment); tag `v0.7.0`.
- *Complexity:* Medium (mostly care). *Deps:* P0-2. *Acceptance:* `main` serves the playable v0.7.x; a tag exists; one source of truth for `index.html`.

### P1 — High impact

**P1-1 · Make the opening playable, not just narrated**
- *Problem:* two rats of combat; 24 of the 30 interactables in chapters 1–7 resolve with a single USE tap (the exceptions are the two joust scenes, the archery and sword targets, the guard test and the Dawn/Dusk crossing); ~6–8 min total.
- *Solution:* (a) ch2: add a ledge puzzle (a missing ladder, a swinging lantern timing) instead of three taps; (b) ch3: a stable-rat scramble with a pitchfork-and-grain objective (defend the grain with `S.guard`, already implemented); (c) ch6: end with a 3-enemy "practice melee" that requires guard + bow + sword; (d) ch7: one blightling skirmish on the near bank before Ione. (e) cut ch1's seven text boxes to two and add a hedge obstacle so JUMP is taught.
- *Benefit:* skills are used, the opening reaches 12–15 minutes of real play.
- *Complexity:* Medium. *Modules:* `40_story` (data), `45_adventure` (hazards), `50_game`. *Deps:* P1-2, P1-4.
- *Acceptance:* median first-time completion (self-playtest) ≥ 12 min; at least one chapter-6/7 fight where each of bow, guard and sword is *needed*; zero chapter objectives that are only "tap USE once".

**P1-2 · Combat feel pass** (D.1 steps 1–4)
- Hit-stop, flinch, telegraphs, dodge, timed guard, 2-hit sword string.
- *Complexity:* Medium. *Modules:* `50_game.updateCombat/attack/hurtPlayer`, `20_art.drawEnemy`, `60_ui` input.
- *Acceptance:* a scripted player who never guards or dodges loses ≥25 % HP on m1 and ≥50 % on m3 at the recommended level; a player who uses guard/dodge correctly loses ≤10 %; every enemy has a visible 0.3–0.6 s wind-up.

**P1-3 · Give death and failure a small narrative cost** (V-10)
- *Solution:* defeat reverts to the last beat, costs the wave's drops, and Halvard comments once per mission. No permadeath, no gold loss spiral.
- *Complexity:* Low. *Modules:* `50_game.js:415`. *Acceptance:* `verify2.js` V3b shows a state change after death; retry works at every checkpoint.

**P1-4 · Fix the thumb layout** (V-5)
- Move the weapon cluster off the ground band; make weapon swap a single tap-to-cycle with an icon; keep minimum 44 px targets; move the objective tracker clear of BAG/SKILLS and the XP bar; offer a left-hand swap. Keep movement left, jump/combat right.
- *Complexity:* Low–Medium. *Modules:* `00_head.html` CSS, `60_ui` input. *Deps:* none.
- *Acceptance:* `verify.js` V13 shows `pairs: []`, `trkHits: []`, `coveredGround: []` in the four test viewports, min button ≥ 44 px, and a real iPhone check (still owed).

**P1-5 · Decide what the game is: unify mission engines**
- *Problem:* 21 of 22 missions cannot use platforms, mounts, objects or room travel.
- *Solution:* teach the adventure engine to host `wave` steps (a `combatAt` already exists) and convert **m1** (castle gates) as a vertical slice, then m2. Keep the old flat runner behind the same data schema as a "simple mission" so no content is lost.
- *Complexity:* High. *Modules:* `40_story`, `45_adventure`, `50_game`. *Deps:* P1-2.
- *Acceptance:* m1 plays in the adventure engine with at least two platform heights and one interactable; the bot still completes all 21 missions; no regression in `test:adventure/opening/squire`.

**P1-6 · Make the cast matter in the opening** (Elowen, Ione, Halvard, Corin) (§B)
- 8–12 lines of new dialogue and 3 state flags give each of the four a want and a return. No engine work.
- *Complexity:* Low. *Modules:* `40_story`, `45_adventure` (pickup lines). *Acceptance:* Elowen and Ione each appear in ≥2 distinct scenes; Halvard has an on-screen vulnerability; one Corin choice in the opening is referenced later.

### P2 — Important

| ID | Item | Problem / evidence | Solution | Cx | Modules | Acceptance |
|---|---|---|---|---|---|---|
| P2-1 | Jump forgiveness | No variable height, coyote, or buffer (`45_adventure.js:27–29,171`) | Add 100 ms coyote, 120 ms buffer, short-hop on early release | Low | `45_adventure` | Unit test: press 100 ms after leaving a ledge still jumps |
| P2-2 | Fix the "canter" lesson (V-1) | Max speed 94 < 95; toast says canter | Raise speed target to a real canter (≈132) and add a hedge obstacle; or relabel to "steady trot" | Low | `50_game:388`, `45_adventure:149`, `40_story` | Gait reaches `canter`; obstacle exists; flag fires at canter |
| P2-3 | JUMP in flat missions (V-2) | Shown, no effect | Hide it in flat missions, or give flat missions the same vertical hit test | Low | `45_adventure:7`, `50_game:229` | `verify.js` V4 flat = adventure behaviour, or button hidden |
| P2-4 | Results labels (V-3), weapon carry-over (V-4), line fix (V-9) | See §C.3 | one-line fixes | Low | `60_ui:246`, `startMission`, `40_story:171` | Screenshots re-taken |
| P2-5 | Enemy behaviours | 5 enemies have no code | One rule each (D.4) | Medium | `50_game`, `40_story` | Each rule has a test with a spawn and a measurable outcome |
| P2-6 | Decouple compass from spellcasting (V-11) | 20 Dusk bolts = tier flip | Remove per-cast drift; keep authored story shifts only | Low | `50_game:302,317` | `verify2.js` V10 shows no drift |
| P2-7 | Procedural music + ambience + mute (E.3) | No music; no volume | WebAudio loop sequencer, MENU sliders | Medium | `10_core`, new `65_audio.js` | 6 loops; mute persists; no audio errors on blocked storage |
| P2-8 | Portrait composition (E.2-1) | 45 % empty sky | Re-frame horizon, use sky for UI | Medium | `10_core.layout`, scenes | Screenshot review in 390×844 and 375×667 |
| P2-9 | Scene template for later missions (E.2-2) | m3/d2 far below opening bar | Region templates + props, kill rain-in-cave | Medium–High | `20_art`, `48*` | Side-by-side review: m3/d2 match the opening's craft level |
| P2-10 | Remove dead `magegarden` and consolidate backgrounds (C.5, C.2) | Four pipelines | One `SceneDef` renderer | High | `45/48/49` | One entry point; art regression screenshots pixel-compare ≤0.5 % |
| P2-11 | Production debug surface | `window.__G` | Gate behind `?debug` and a test build flag | Low | `60_ui:360`, tests | Prod build has no `__G`; tests build with it |
| P2-12 | Replace scalar compass with consequence flags (D.8) | Single number | Named flags surfaced in dialogue | Medium | `40_story`, `50_game`, `60_ui` | Three choices in Act I have visible later consequences |

### P3 — Future

| ID | Item | Why | Cost |
|---|---|---|---|
| P3-1 | **Room graph** (rooms, keys, shortcuts, persistent room state) | Needed for castles/caves/ruins | High |
| P3-2 | Solid geometry (walls, ceilings, overhangs) | Opens true dungeons | High |
| P3-3 | Replace procedural roads with authored short roads/events | Travel is the most repetitive content | Medium |
| P3-4 | Mounted combat and rider-vs-rider duels beyond the one-button joust (aim/balance) | Makes horsemanship recurring | High |
| P3-5 | Authored gear + smith/upgrade, cut the affix pool | Fits the fiction | Medium |
| P3-6 | Cloud-less save sync via copy-code QR | Device hopping without a backend | Medium |
| P3-7 | Localisation hooks (strings out of code) | Later | Medium |
| P3-8 | Bosses with phases | After P1-2/P2-5 | Medium |
| P3-9 | Second-playthrough layer (Dawn vs Dusk playthrough variants, hard mode) | Replayability | High |

**Maintenance/perf costs to budget:** every new scene needs art, a collision pass and a screenshot test; every new enemy rule needs a test; audio adds download size unless procedural; the offscreen layer cache (`VCACHE`) needs a bounded LRU before more scenes are added (S-6).

---

## G. Proposed Development Roadmap

Principle: **no milestone changes more than two systems at once.** Each has a test that fails before and passes after.

| M | Name | Scope | Depends on | Tests | Definition of done |
|---|---|---|---|---|---|
| **M0** | **Safety net** | P0-1, P0-2, P0-3 (with your approval), P2-11 | — | New `ci.yml`; save-fixture tests; real-input golden path in CI | CI green on every branch; save banner and export work; `main` serves the current game; v0.7.0 tagged |
| **M1** | **Feel** | P1-2, P1-3, P1-4, P2-1, P2-3, P2-4 | M0 | `verify.js` V4/V13; new combat probes (enemy telegraphs, dodge, guard) | Brute-force bot loses meaningful HP on m1/m3; control geometry has no overlaps; jump forgiveness unit-tested; ≥44 px targets |
| **M2** | **Make the opening a game** | P1-1, P1-6, P2-2, P2-5 (first six enemies), P2-6 | M1 | Chapter-by-chapter real-input run with expected combat; flag/line tests | Opening takes ≥12 min median; each chapter has ≥1 non-USE challenge; Elowen/Ione/Halvard have returns |
| **M3** | **Engine proof** | P1-5: convert m1 (then m2) to the adventure engine; P2-10 start | M2 | Bot completes all 21 missions; `test:adventure/opening/squire` unchanged | m1/m2 use platforms and an interactable; the opening and m1 feel like the same game |
| **M4** | **Sound and portrait polish** | P2-7, P2-8, P2-9 first slice (one region) | M3 | Audio smoke; screenshot review in 4 viewports | Music/mute in; portrait uses the whole screen; one non-opening region at opening quality |
| **M5** | **World structure** | P3-1 room graph, P3-3 authored roads, P2-12 | M3 | Room-graph tests; save migration | One castle with ≥6 connected rooms, a key, a shortcut and persistent flags |
| **M6** | **Early-access candidate** | Real iPhone matrix, performance on device, accessibility pass, store of bug reports | M4–M5 | Device test log; Instruments traces | 15–30 minute first session with a hook, real stakes and a satisfying ending beat |

**Challenge to the assumption:** I agree M1 should be polish, but I would not do the *art* polish the project has been doing. The art is ahead of the game (the last two passes were art/environment). The evidence says the next dollar of effort should go to feel, risk, the opening's play, and proving the engine on one more mission. Writing new missions before M3 would multiply the flat template.

---

## H. Top Ten Recommendations

Ranked by impact on the player's experience, then feasibility.

1. **Give death and failure a small, story-flavoured cost** (P1-3). Highest impact per hour; nothing else matters while nothing is at risk.
2. **Combat feel pass: hit-stop, telegraphs, dodge, timed guard** (P1-2). One afternoon of work changes every fight.
3. **Make the opening a game: add real challenges to chapters 2, 3, 6, 7 and cut chapter 1's preamble** (P1-1). Gets you from ~7 to 12–15 minutes of *play*.
4. **Fix the thumb layout** (P1-4). Players meet this in the first second; it hides your best set-piece (chapter 7).
5. **Convert m1 to the adventure engine as a vertical slice** (P1-5). Decides whether the game's identity survives minute 8.
6. **Give Elowen, Ione, Halvard and Corin a want and a return** (P1-6). Eight lines and three flags; makes the death at the end of Act I land.
7. **Show save status and add export/backup** (P0-1). Protects every other improvement from invisible loss.
8. **Collapse the PR stack and run CI on everything** (P0-2/P0-3). Without it nothing here ships.
9. **Add music, ambience and a mute control** (P2-7). The cheapest big jump in atmosphere, and procedural so it fits the single-file rule.
10. **Replace the single moral number with consequences you can see** (D.8, P2-12, P2-6). It is the right answer to "choices without an oath system".

---

## Appendix 1 — Measurements

| Measurement | Result |
|---|---|
| 7-chapter real-input run | Portrait 170 s, landscape 172 s; per-chapter game time 16.4 / 20.2 / 25.7 / 31.4 / 26.7 / 24.5 / 24.7 s; 103 dialogue taps; 0 page errors |
| Opening dialogue | ≈775 words in chapter data (+~100 in pickup lines); 25 `L()` lines in m0 data |
| Mission formats | 8 `explore:` blocks (7 in m0 + Joust Lab); 21 flat missions |
| Waves per mission | m1–m6: 1 each; m7: 2; m8: 3; m9: 1; m10: 6 + 2 defend + 5 interact; m11–m12: 2; sides: 1; dungeons: 3 |
| Enemy table | 15 types; behaviour flags: `ranged`, `dash`, `k/big`, `rat` |
| Jump apex | 66.9 px on foot, 44.5 px mounted; airtime ≈ 0.93 s |
| Mounted speed | 94 max (gaits: walk <50, trot <95, canter <150, gallop ≥150) |
| Death | HP → full, XP/gold/inventory unchanged |
| Dusk drift | 20 bolts: compass 0 → −30 |
| Jump vs melee | flat mission HP 100→92; adventure room 100→100 |
| Control geometry | Portrait min button 46 px; landscape small buttons 40 px; tracker overlaps BAG/SKILLS (portrait) or XP bar (landscape); weapon buttons + GUARD overlap ground band |
| Frame pacing, 4× CPU throttle, headless | 16.5–17.0 ms avg, p95 16.7–16.8, one 50.1 ms max (ch2), heap 9.5–17.4 MB |
| Brute-force bot, natural kit | m1 L2: 18 s, min HP 101/109. m3 L3: 25 s, min HP 25/137, 1 death. m5 L4: 18 s, min HP 113/127. m8 L6: 73 s, min HP 11/154, 3 deaths |
| Campaign bot (with `$$` fix) | m1…d4 all `done`, no errors (the bot's HP refill makes it a flow test, not a difficulty test) |
| Resume | Saved checkpoint → "RESUME"; area and flags restored (checkpoint written directly by the probe) |
| Rotation mid-chapter | No errors |
| Blocked storage | Boots; no warning to the player |

## Appendix 2 — Evidence index

All in `docs/evidence/audit-2026-11/`:

`p-ch1-canter.jpg` (empty portrait sky, "canter" toast) · `p-ch2-loft.jpg` · `p-ch4-joust.jpg` · `p-ch6-archery.jpg` · `p-ch7-path.jpg` and `l-ch7-path.jpg` (crossing under buttons) · `l-ch5-joust.jpg` · `p-m1-fight.jpg` (staff leaks into m1; GUARD over the enemy entry) · `p-m0-results.jpg` ("· trinket" label, duplicate sword) · `p-worldmap.jpg` · `l-m3-flat.jpg`, `p-m8-flat.jpg`, `p-d2-cave.jpg` (later-mission art bar).

## Appendix 3 — What I did not do

No gameplay code was modified. I did not open a PR, merge anything, or touch `main`, PR #1–#9, or any save data. I did not test on a physical iPhone. I did not play the game "by hand" as a human; all interaction was scripted through the real on-screen controls. A human first-time playtest of the opening is the most valuable thing still missing.
