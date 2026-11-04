# Changelog

## v0.8.0 Combat Reborn (development, not merged; stacked on v0.7.1)

Details, test results and known limits in `docs/V0_8_0_COMBAT_REBORN.md`. All tuning lives in `COMBAT_CFG` (`src/44_combat_cfg.js`).

- **Sword combo.** Three timed stages (light, light, heavy finisher) with a buffered input window and a small bonus for well-timed follow-ups; slash arcs, hit-stop, knockback and screen shake scale with the stage.
- **Dodge / roll.** New ROLL button (key C): short invulnerable roll with a cooldown, on foot only. A button was chosen over a swipe gesture because it cannot collide with the fixed camera or on-screen cluster; a gesture remains untested.
- **Timed guard.** A block raised just before impact deflects the hit, staggers the attacker and opens a counter strike; late blocks only reduce damage. Hazards (fire) ignore guard.
- **Enemy archetypes.** Shield guard (front hits mostly blocked, back and counters break it), spearman (telegraphed thrust, keeps distance), torch raider (throws torches that leave a fire hazard you can jump), hound, and a training sparrer. Telegraph marks, stun stars and shield glints make the states readable. Several mission waves now mix archetypes.
- **Platform feel.** Coyote time (0.10 s), jump buffer (0.12 s), variable jump height and landing squash. Camera and platforms are unchanged.
- **Defeat.** Losing an encounter forfeits only what that encounter paid out (xp, gold, loot) and restores the snapshot taken at its start. No permadeath, no inventory loss, and no way to farm rewards by dying.
- **Chapter 6.** Adds a sparring bout after the straw dummy; the iron blade is awarded after winning it. Small narrative additions for Halvard, Corin and Ione.
- **Tests / CI.** New `combat` suite (combo, hit-stop, shield, spear, fire, dodge, parry, coyote/buffer, defeat, four-archetype encounter) added to `run_all`; golden path now plays the sparring bout.

## v0.7.1 Foundations Reforged (development, not merged)

Stability, saves and touch controls. No new combat or story content (that is v0.8.0). Details and test results in `docs/V0_7_1_FOUNDATIONS_REFORGED.md`.

- **Saves.** Storage is probed at boot; when the browser blocks it the title screen, a banner and the menu all say progress cannot be saved, and SAVE GAME reports failure instead of "Game saved". NEW GAME now asks before replacing an existing game and copies the old one to a backup slot first (RESTORE BACKUP on the title or in the save-code menu). New EXPORT / IMPORT SAVE screen: checksummed text code (copy or file), import validates and previews before replacing. Loaded data is validated and repaired (bad types, broken items) instead of crashing; a damaged save falls back to the backup. A `ver` field is stamped on writes and older saves migrate in memory. The key `hiddencrown.save.v2` is unchanged.
- **Controls / HUD.** Right-thumb cluster rebuilt bottom-up (ATK, JUMP, GUARD, SKILL) and a compact icon weapon row (sword / staff / bow / Dawn-Dusk) on the left above the move pad, all below the combat ground line. Landscape puts everything in one low row. All buttons are 44 px or larger; BAG / SKILLS / MENU get 44 px hit areas; the objective tracker no longer covers BAG/SKILLS (portrait) or the health bars (landscape); HP, MP and XP show numbers; choice buttons are at least 48 px; the ground line accounts for the iPhone home-indicator inset.
- **Horse.** Holding forward now accelerates through walk, trot and a true canter (it used to top out in a trot, so the canter animation was unreachable). The canter lesson needs a sustained canter past the marker. Speeds are in `MOUNT_CFG`.
- **Jumping.** Flat missions now use the same airborne rules as the adventure engine: a jump clears low ground hits and projectiles in both.
- **Fixes.** Each area starts with the sword drawn (no staff carry-over into the next mission); Halvard's "iron blade" line now refers to the training yard; outfits show "cosmetic" in the results list; casting Dusk or Dawn no longer moves the compass; `tests/bot.js` choice clicking (`page.$$`).
- **Tests / CI.** New `save`, `layout`, `riding`, `jump_consistency`, `fixes` and `golden_path` (seven chapters through on-screen buttons, portrait and landscape) tests, `npm test` runner, `tools/check_syntax.js`, and one consolidated `.github/workflows/ci.yml` for every branch and PR. `docs/INTEGRATION_PLAN.md` proposes (does not perform) a safe merge of the stack.

## v0.7.0 art & environment polish pass (development, not merged)

- **Environments.** New hand-authored, layered scenes: Practice Ring (timber stable block, quintain, ring fence, castle wall and tournament roofs beyond), Training Yard (Elowen's ranger camp and fire, archery lane, hay butts, Halvard's stone wall and banners, sword yard, home gate), and the Broken Bridge storm gorge (lightning, gorge and river with foam/spray, wrecked cart, ancient arch and glowing garden, Dawn stepping stones, Dusk basalt causeway). The generic arch-and-window pillars that used to show behind chapter 7 are gone.
- **Set dressing** (`src/48d_dressing.js`): dirt road with ruts, Halvard's keep gate, milestones, hedges, wayside shrine and the Hearthmoor inn facade (ch.1); plank floor, rugs, hanging herbs/hams, lanterns, casks, tables (ch.2); straw/cobble floor, tack wall, wheelbarrow, feed sacks, lantern (ch.3); heraldic shields on the barrier, banner poles and bunting (ch.4).
- **Foreground props** (`src/48b_props.js`): every interactable (chests, keys, breastplate, helm, oil, saddle, lances, shield rack, doors, archery butt, training dummy, guard stand, weapons, reins post, rune stone, signs, benches, crates, barrels) redrawn with edge-lit bevels, wood grain and contact shadows. Platform tops, workbench tools and labels share the same language. Labels now sit on dark pills, stack when neighbours overlap and clamp to the screen.
- **Horses.** Halvard's grey charger wears a navy-and-gold travelling caparison with chamfron (`tk:'knight'`); Corin's bay gelding keeps plain russet tack.
- **Performance.** Static parallax layers (ridges, tree lines, walls, storm clouds) are cached offscreen (`vLayer`); worst chapter is about 1.7k rects/frame, down from the 4.4k first draft.
- **Test shortcut.** `?chapter=N` (or `#chapter=N`) starts a fresh unsaved run at opening chapter N and never writes a save.
- New `tests/art_pass.js`, `tests/chapter_shots.js` (before/after screenshots in `docs/evidence/v070-before|after`). See `docs/V0_7_0_ART_PASS.md`.

## v0.7.0 — The Road to Hearthmoor (development, not merged)

- Replaced M0's previous five-area opening with **seven sequential chapters**: mounted ride to the Hearthmoor tournament; inn equipment room; visiting stables; armor preparation and tournament handoffs; Corin's practice joust against Halvard; ranger bow and knight sword/shield training; broken bridge and Ione's first magic.
- Corin rides a **bay gelding**, distinct in tack and coat from Halvard's armored grey charger. Hold RIGHT to gather speed and JUMP to leap; canter and reins tasks are part of the first chapter.
- Reused the horse animation and jousting simulations, with Halvard as the mounted practice opponent.
- Bow, shield and blunt iron sword now require appropriate lessons; the archery target requires a real arrow hit, the sword dummy requires a melee hit, and the shield brace requires holding GUARD.
- At the broken bridge, a player-chosen Dawn cast reveals hidden stepping stones while Dusk creates a rock crossing; both paths are blocked until the matching staff spell is cast.
- Added an original inn, practice lists, training-yard and mystical garden art; preserved all earlier scenery, M1–M12 quest IDs, and a legacy chapter-checkpoint migration.
- See `docs/V0_7_0_SEVEN_CHAPTER_OPENING.md` for full narrative, QA and constraints.


## v0.6.3 — Living Roads and Magic (development, not merged)

- Mission-aware backgrounds for Act I and the six Hearthmoor siege stages: visible drawbridge and defenders, burning village and keep, distinctive Greenmarch, Veilfen, library and mountain scenes.
- Sun position and sky color change across playable travel. Seeded regional weather adds rain, wind, fog, storms, snow and siege embers.
- Magister Ione now introduces magic after the tournament, in a new rune garden; Corin receives his first Rowan Staff through interaction, learns Dawn basics and confronts wisps.
- JUMP is now available and works in legacy horizontal missions, in addition to the vertical platforming areas.
- Nine new enemy archetypes and role-appropriate weapon/creature silhouettes, used by rebalanced early Act I and siege encounters.
- Added `tests/world.js`, extended the adventure test, and validated all 10 GitHub Actions regression tasks. See `docs/V0_6_3_LIVING_WORLD.md` for limits and next steps.

## 0.6.1 (development branch — not merged)
- New `src/46_horse.js`: vector horse rig baked to palette-true pixel frames (cached) with 2-bone IK legs and idle/walk/trot/canter/gallop/charge/halt/recoil/groom poses, coats, tack states (halter, stable blanket, saddled, tourney caparison), dirty/groomed look and rider anchors.
- New `src/47_joust.js`: ONE deterministic fixed-step joust engine used by both roles. `squire` (Corin on foot hands Halvard a lance; positional reach test) and `rider` (mounted lance-vs-lance with seeded opponent). Easy mode via `G.opts.joustEasy`. Replaces the old timing bar; M0 flags, 3 passes and +35 gold on 2+ handoffs unchanged.
- Stables: real horse replaces the rectangle, with hay, bucket, grooming animation and dirty→groomed→saddled states. Seated-rider legs in `personParts`.
- Tests: `tests/joust.js` (determinism, misses, easy mode, rider role); `tests/adventure.js` drives the new engine; `tests/evidence.js` captures before/after scene screenshots.
- New `src/48_scenes.js`: redrawn armory (heraldry hall, weapon wall, forge with embers and anvil, plate-armour stands, torch light pools, rug runner) and tournament lists (sky/hills/castle parallax, timber stands with animated crowd that cheers during passes, striped pavilion, tilt barrier, hoof-marked sand).
- MENU → JOUST LAB (PREVIEW): Corin on his own horse rides three passes against a seeded foe using the same engine (hidden `joustlab` mission, no story or reward side effects). MENU → EASY JOUSTING toggle. Joust HUD moved clear of the mission tracker; `tests/lab.js` added.
- Squire kit: new games start with a plain squire tunic and a Wooden Practice Sword (6 dmg); staff/bow buttons and the Dawn/Dusk toggle appear only when those items are owned. The old starting kit (Squire's Sword, Practice Staff, Hunting Bow, Squire's Tunic) is held in `G.stash` and returned at the knighting.
- Until knighted, any outfit shows as a simple tunic (colour and aura only, no cape/plume/metal). M0 chests now give tunics (uncommon / rare) to swap colour and rarity.
- Cellar Rat enemies (new sprite) in the armory and stables. Ser Halvard gives a Blunt Iron Sword (9 dmg) at the end of the tournament.
- Knighting (`KNIGHT_MISSION='m11'`, easy to move): returns the stash and equips the Hearthmoor Heirloom Blade (House Hearthmoor lineage, separate from the planned Act II bloodline sword). Saves from before this change keep all gear and count as already knighted. `tests/squire.js` added.
- Deferred: mounted joust inside the story (tournament mission), horse combat, stable/armory prop-level object art, iPhone Safari playtest.

## 0.5.0 (development branch — not merged)
- Added opt-in multi-area quest data format with per-area maps, objectives, scene changes and checkpoint saves, preserving existing single-area missions.
- Rebuilt M10 Fire at Hearthmoor into six connected battlefields and a richer siege narrative.
- New interactable world-object objectives (USE / X), defendable structures with health and retry, and a compact mission objective tracker.
- Added checkpoint resume from the world-map mission briefing without changing the existing save key.
- Added a Playwright quest regression and branch-only GitHub Actions workflow; corrected bot timeout behavior and the boot test's old absolute path.
- See `docs/LIVING_QUEST_ENGINE_V0_5_0.md`. Still requires green CI and iPhone playtesting before release.

## 0.4.0 (current)
- World map with story-gated roads, route-finding and animated travel; missions start only at their location.
- Four dungeons with their own environments (Thornwood forest, Hollowdeep caves, Greywatch mine, Ashfall keep).
- Outfit loot (14 cosmetic outfits across 5 rarities) with a wardrobe filter in the Bag.
- Act I missions 9-12 (The Vigil, Fire at Hearthmoor, The Long Night, The Southern Road), with choices that change later dialogue and whether Halvard survives (Ione takes his place if he dies).
- Boot screen with visible error reporting; older-browser CSS fallbacks; removed optional chaining. Tested in a sandboxed iframe and with blocked storage.
- Repo, handoff package, story bible export and test scripts added.

## 0.3.0
- Characters redrawn in the "H2" style (reference-video look, visible faces, edge-lit shading, no outline).
- Armor changes the body shape (cloth, mail, plate); weapon rarity tints blades and bows.

## 0.2.0
- Full-screen adaptive canvas so portrait uses the whole screen; richer parallax art and moods.
- XP and levels, loot with 5 rarity colors, bag and equipment, 3 skill trees with abilities.
- Data-driven mission board; 8 main missions and 5 side quests; save/load.
- Expanded story bible to the full saga outline.

## 0.1.0
- First vertical slice: parallax pixel village, prologue, three weapon styles, Dawn/Dusk staff, morality compass, two choices.

## Handoff log
(Add a "HANDOFF UPDATE" block from the other assistant here after each switch.)
