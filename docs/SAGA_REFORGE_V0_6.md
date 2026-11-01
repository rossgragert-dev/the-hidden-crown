# The Hidden Crown — Saga Reforge v0.6 (design and implementation)

Status: prototype branch feature/squire-adventure. Main and the previous v0.5 branch remain intact.

## Central direction
Corin adventures alone in the ordinary game; Halvard, Lysa, rescued royalty, companions and other characters appear only during story-specific missions, scenes or short escorts. Platforming replaces flat corridors as the target primary experience, with castles, caves, roads, keys, doors, chests, vertical rooms, jousting, mounts, and later flight.

## Implemented in the first foundation build
- M0 The Knight's Squire: armory, castle stables, tournament lists and patrol road.
- Gravity-based jumping and platform collisions in newly built exploration areas.
- Interactable items, locked exits, keys, task prerequisites, chests and chest rewards.
- An animated three-pass lance-handoff timing minigame while Halvard jousts. Player-mounted jousting is planned, NOT yet implemented.
- Wooden guard shield available in the armory, steel shield awarded at M8 and projectile-reflecting ward at M12. A proper shield equipment slot is still planned.
- World-map travel now loads traversable, seeded road or wilderness segments with biome-specific enemies. Repetition is reduced with deterministic, day-specific scenery variation, not yet a fully nonrepeating level generator.
- Companions no longer follow throughout normal gameplay.
- Old flat missions and existing save key are preserved.

## Revised Act I campaign target
M0 — The Knight's Squire: prepare armor, horse and lances; assist in a tournament; earn an independent road patrol. Prototype implemented.
M1 — First Blood on the Greenmarch: scouting, protecting farmsteads and escorting provisions along varied woodland roads.
M2 — Tournament of Thorns: actual player jousting, training, rival knight and a longer tournament arc.
M3 — The Granary and the Hungry: village, mills and stores, with rescue and supply outcomes.
M4 — Into the Veilfen: several marsh routes, flooded caves and optional puzzle passages.
M5 — A Rival's Debt: Brannoch, a pursuit across the town, multiple enemies and moral consequences.
M6 — Beneath the Chapel: vertical crypt and magical Dawn/Dusk mechanisms and keys.
M7 — Knives in the Keep: infiltrated rooftops, towers, rescued captives and an assassin pursuit.
M8 — Trial of the Thorn: riding, jousting, archery, platforming and steel shield unlock.
M9 — The Vigil: character-driven vows, crypt exploration and knighthood.
M10 — The Fall of Hearthmoor: expand the existing six battlefield siege into explorable multi-level castle maps.
M11 — The Long Night: road escape, broken bridges, a temporary injured-ally escort and multiple routes.
M12 — The Southern Road: multi-day pursuit, mounted encounters, an assassin boss and reflective ward unlock.

## Later story goals
Act II — discover the Hidden Heir, build faction alliances, journey to Ironvale and the Collegium, rescue a princess in a substantial multi-room fortress mission, unlock ascent and limited magical mobility.
Act III — royal capital, contested territories and interconnected castle complexes, final mounted combat, flight traversal, faction reckonings and six consequence-driven endings.
These are proposed designs, NOT implemented missions. Preserve canonical reveal timing, character identities, story flags and choices when rewriting.

## Gaps and acceptance requirements
- The existing three weapon styles and game art remain; collision is now vertical in exploration zones but not yet full solid-tile walls or portals to branching rooms.
- Current long areas have area checkpoints, not mid-room checkpoints; journey recovery after reload is not yet implemented.
- All existing dungeons and M1–M12 are legacy layouts except v0.5's M10 siege. Each should be converted incrementally.
- Travel scenery varies by route/day/terrain but does not yet guarantee a fully nonrepeating painted background.
- Horses are represented during the squire tasks; riding and mounted jousting/combat require a dedicated future implementation.
- Shields are tiered combat abilities, not yet fully configurable inventory equipment.
- iPhone Safari portrait/landscape, no accidental double-tap zoom, and old save compatibility are release gates.

## Architecture
New src/45_adventure.js contains physics, objects, timed joust, scenery and road environments. src/40_story.js contains new M0. src/50_game.js integrates combat, shield and area transitions. src/60_ui.js generates traversable travel and handles touch input. tools/build.sh generates self-contained index.html. tests/adventure.js covers the new adventure and travel.

## Next focus
Playtest this prototype on an iPhone, revise platform heights and touch controls, build a truly interconnected cave dungeon, implement horseback movement and jousting, enhance shields and wards, and then expand M1–M9 while maintaining the longer M10 arc.
