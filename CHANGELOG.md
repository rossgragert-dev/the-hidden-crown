# Changelog

## 0.6.1 (development branch — not merged)
- New `src/46_horse.js`: vector horse rig baked to palette-true pixel frames (cached) with 2-bone IK legs and idle/walk/trot/canter/gallop/charge/halt/recoil/groom poses, coats, tack states (halter, stable blanket, saddled, tourney caparison), dirty/groomed look and rider anchors.
- New `src/47_joust.js`: ONE deterministic fixed-step joust engine used by both roles. `squire` (Corin on foot hands Halvard a lance; positional reach test) and `rider` (mounted lance-vs-lance with seeded opponent). Easy mode via `G.opts.joustEasy`. Replaces the old timing bar; M0 flags, 3 passes and +35 gold on 2+ handoffs unchanged.
- Stables: real horse replaces the rectangle, with hay, bucket, grooming animation and dirty→groomed→saddled states. Seated-rider legs in `personParts`.
- Tests: `tests/joust.js` (determinism, misses, easy mode, rider role); `tests/adventure.js` drives the new engine; `tests/evidence.js` captures before/after scene screenshots.
- Deferred: mounted joust is engine-level only (no menu "Joust Lab" or story scene yet); armory and tournament-stand scenery redraw; horse combat.

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
