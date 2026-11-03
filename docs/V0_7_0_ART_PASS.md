# v0.7.0 Art & Environment Polish Pass

Branch `feature/v070-seven-chapter-squire` (PR #9). Chapter structure, story flags, mounted travel, joust/bow/sword/guard/magic gameplay and saves are unchanged.

## New art modules (concatenated in this order by `tools/build.sh`)
| File | Purpose |
|---|---|
| `src/48b_props.js` | Prop library: `bv` (bevelled block), `woodB` (grained wood), `ground` (contact shadow), `glint`, plus `propChest/Key/Breastplate/Helm/Oil/Saddle/Lances/ShieldRack/Door/ArcheryButt/Dummy/GuardStand/Weapon/Reins/RuneStone/Barrel/Crate/Sign/Bench/Banner`. Anchor: x = centre, py = ground line. |
| `src/48c_vistas.js` | Open-air scenes: `scenePractice`, `sceneTrainingYard`, `sceneStormGorge` and `sceneBridgeWorld` (wreckage, Dawn stones, Dusk causeway). Helpers `vRidge`, `vBlob`, `vOak`, `vFir`, `vSky`, `vClouds`, `vTiles`, `vStoneWall`, and `vLayer` (offscreen cache for static parallax layers). |
| `src/48d_dressing.js` | World-locked floor texture and clutter per chapter via `worldDressing(a,cam,y)`, called from `adventureWorldDraw` before platforms and objects. |

Also: `g` in `src/10_core.js` is now `let` so `vLayer` can paint into an offscreen canvas; `save()` honours `NOSAVE`; `tk:'knight'` in `src/46_horse.js`.

## Art rules to keep
- Edge-lit bevels (light top/left, dark bottom/right) and a contact shadow on every playable object, matching characters and horses.
- Each chapter owns its silhouettes. Do not reuse the arch-and-window pillar loop (still used by old missions) in opening chapters.
- Anything static and wide goes through `vLayer`; keep per-frame rect counts low (check with the counting harness: wrap `CanvasRenderingContext2D.prototype.fillRect` over 90 frames).
- Parallax layers must be painted with `cam = 0` inside `vLayer` and use world-hash noise (`vN`, `worldHash`) so tiling never repeats obviously.

## Chapter notes
1. Road: dirt road and ruts, Halvard's keep gate (start), milestones/hedges/shrine, inn facade at the finish. Distant hills/pines from the existing landscape layers.
2. Inn: plank floor, two rugs, hanging herbs/hams, lanterns, casks, bench-and-table, cloaks on pegs, vise/hammer/cloth/oil jar on the workbench.
3. Stables: straw and cobble floor, tack wall, wheelbarrow + pitchfork, feed sacks, hanging lantern, trough. Halvard's charger shows dirty, groomed and knight-tacked states.
4. Tournament: heraldic shields on the barrier, banner poles, bunting between stands.
5. Practice ring: quieter than ch.4 on purpose: no crowd, earth ring, timber stables, quintain, castle wall with tournament roofs beyond.
6. Training yard: ranger camp (Elowen), bow rack, archery lane and butts, stone wall with Halvard's cross banners, sword yard, home gate.
7. Bridge: storm sky with lightning, gorge and river, wrecked cart, ancient arch and garden, rune stone; Dawn = golden stepping stones with drifting light, Dusk = violet basalt causeway.

## Known issues / next steps
- Portrait phones show a lot of sky above the scene; add portrait-only sky storytelling (birds, distant smoke, a Hearthmoor silhouette on the road).
- The inn and stable walls are still the older art with new dressing on top. A fuller wall repaint (window light shafts, plaster/timber variation) would lift them further.
- Tournament stands and pavilions repeat every 210 px; add 2-3 more bay variants and a herald's platform.
- Horses: no new body variants (only tack); Corin's bay could get a blaze/sock variant and a distinct smaller body scale.
- `tests/bot.js` times out on mission m2. This also happens on the unmodified v0.7.0 build (pre-existing, not part of this pass).
- Not verified on a physical iPhone. Headless Chromium only.
