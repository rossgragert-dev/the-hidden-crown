# Changelog

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
