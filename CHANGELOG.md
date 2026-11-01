# Changelog

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
