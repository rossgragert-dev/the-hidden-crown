# The Hidden Crown v0.6.3 — Living Roads, Regional Enemies and Ione's First Lesson

**Development branch:** `feature/v063-living-roads-magic` (based on `feature/v062-opening-height-geometry`).
**Baseline:** v0.6.2 fixed-camera platforming, shared joust engine and iPhone right-thumb JUMP.
**Status:** first playable environment/content refit; NOT merged into main.

## What was implemented

- Added `src/49_world.js`: mission-aware Canvas environment rendering, a different scene identity for major Act I quests and all six areas of the M10 siege. Areas include the Greenmarch farm road, grain depot, Veilfen marsh, Ione's garden, library, castle gate, trial courtyard, chapel, forest night escape, frontier, caves, mines, ruins, and burning city.
- Removed generic castle/tower backdrop **from active story missions that use the new world renderer**. Claud​​e's more detailed armory/stables/tournament art is intentionally preserved.
- M10 now displays a moat and raised defense, stone gate, drawbridge, defenders, attacking siege equipment, burning village homes, interior chapel, and a damaged keep rather than repeating the same road scene.
- Traversable world-map roads cycle from dawn through daylight to sunset and night according to route progress. Road segments use seeded silhouettes and region-appropriate rain, wind, storms, fog, snow or other weather. Day/night and weather are visual in this version and do not yet affect combat stats or visibility.
- The M0 opening now has an extra stage immediately after the tournament: `magegarden`. Magister Ione gives Corin the **Rowan Staff**, and he finds a light rune, learns basic Dawn magic and faces wisps before Halvard assigns his road patrol. Staff item and tutorial completion persist in `G.flags`/`G.eq`. Existing save key is unchanged.
- Older flat missions now expose a usable JUMP button and ground/air physics; only areas with explicit `explore.platforms` provide raised landings.
- Nine new EN types: Greenmarch Scout, Regency Spearman, Torch Raider, Regency Crossbowman, Gate Sapper, Fen Wisp, Bog Lurker, Ashen Acolyte, Regency Shield Guard. Each has configured health/movement/attack role, and new human armament or creature rendering. Act I encounter tables now distribute them more intentionally.
- `tests/world.js` validates distinct scenes, changing journey daylight, weather selections, old mission jumping, siege geography and roster variety; `tests/adventure.js` checks the Ione/staff stage. Existing M10, zoom, squire, mounted joust and opening regressions remain.

## Intended playtest
- Start a fresh game: complete armory, stables, tournament and then new Magister Ione garden before Greenmarch.
- Use staff at the garden terrace; cast with ATK. Continue across the road with shield and sword.
- Test M10 gatehouse and village backgrounds: drawbridge and city fire should be visible.
- Try old flat Act I missions to confirm JUMP appears and physically works.
- Review daylight/weather in world-map travel, notably fog in Veilfen and rain or wind on roads.

## Known limitations and next steps
- This is the **first substantial graphics pass**, not a promise that every road segment has its own separately painted asset. Several sections use a shared landscape renderer with distinct authored landmarks, seeds, sun positions and weather. Continue hand-authoring distinctive individual mission set pieces and non-repeating travel geography.
- New enemy roster is expanded, but AI still reuses existing melee/ranged/dash behaviors. Add specialized AI (shield facing, sapper gate priority, wisp evasions, crossbow reload) and animation/VFX later.
- The original early mission format remains largely horizontal for M1–M9; JUMP works, but real platforms and multiroom layouts are still needed there. Preserve player safety on raised floors.
- Weather is a visual simulation with lightweight particles; it does not yet wet terrain, change enemy awareness, obscure visibility or cause slippery movement.
- M6's advanced Dawn/Dusk explanation now follows Ione's earlier basic magic lesson.
- Existing saves remain compatible, but a save already past M0 will not be forced into the new garden lesson. Consider offering an optional tutorial replay and ensuring established players without staffs receive an appropriate quest.
- Browser tests run in Chromium mobile viewports, not on physical iPhone Safari. Real device review, visual screenshots and frame-time measurements remain release acceptance gates.

## Verified automated checks
`npm run build`, clean generated index.html, then
`npm run test:smoke`, `npm run test:boot`, `npm run test:opening`,
`npm run test:world`, `npm run test:adventure`, `npm run test:quest`,
`npm run test:zoom`, `npm run test:joust`, `node tests/lab.js`,
`node tests/squire.js`.
All 10 test tasks passed on code commit `7e993be6` (GitHub Actions run 41368772154).

## Integration
Current development branch is `feature/v063-living-roads-magic`. Its parent is v0.6.2 rather than main. Preserve older draft PRs and do not merge to main before review. Continue new art in `src/49_world.js`; keep `tools/build.sh` and standalone `index.html` synchronized.
