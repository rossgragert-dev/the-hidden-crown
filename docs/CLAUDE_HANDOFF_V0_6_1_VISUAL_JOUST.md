# CLAUDE HANDOFF — The Hidden Crown v0.6.1
## The Living Kingdom: Horse, Jousting and Environmental Art Refit
**Date:** 2026-11-01
**Status:** implementation assignment / not yet implemented
**Owner approval:** Improve art and the horse; make the existing squire joust the first use of a future player-mounted jousting system.
**Repository (PUBLIC):** https://github.com/rossgragert-dev/the-hidden-crown
**Start branch:** feature/claude-v061-visuals-joust
**Parent baseline:** feature/squire-adventure (currently playable v0.6.0)
**Existing draft PR:** https://github.com/rossgragert-dev/the-hidden-crown/pull/2 — v0.6 against development/v0.5.0-living-quests. Leave existing PR and main untouched.
**Baseline preview (for comparison, not for publishing edits):** https://pristine-gate-g4m8zg4.shipstatic.com/?playtest=m0

## 0. Your assignment and working rules
You are continuing an EXISTING playable mobile side-scrolling fantasy RPG, not starting a different game or preparing only design notes. First read this file; README.md; HANDOFF.md; docs/STORY_BIBLE.md; docs/SAGA_REFORGE_V0_6.md; and CHANGELOG.md. Inspect the source and current screenshot/video evidence. Build from existing code, commit small increments and push to the branch above (or a new child branch if necessary), leaving main, the v0.5 branch and other development work intact.

**Highest priority:** hand-authored, distinguishable environments; a clearly recognizable, properly animated horse; and a shared, extensible jousting gameplay implementation. Corin still serves as a squire outside the lists in the opening mission. Later, Corin mounts his own horse and competes; build ONE reusable joust system supporting both roles, not two unrelated minigames.

No broad rewrite, no framework migration, no breaking save changes, and no changes that regress accepted iPhone portrait/landscape input, jump placement, the fixed-camera interiors, or the existing six-area siege.

**Important distinction:** Everything labeled "current" below exists in source. Everything labeled "requested / design target" must be built or explicitly left as future work; do not claim a design mockup or scripted bot constitutes a tested feature.

## 1. What already works in the public repository
The game's authoritative editor sources are modular and concatenate into one self-contained index.html with tools/build.sh:
- src/00_head.html: HTML/CSS, HUD, mobile buttons and safe-area layout.
- src/10_core.js: game state G, player P, runtime S, saves and layout.
- src/20_art.js: pixel/voxel-like 2D sprite drawing and backdrop utilities.
- src/30_items.js: equipment, loot, progression and abilities.
- src/40_story.js: missions, enemy archetypes and region palette data.
- src/45_adventure.js: solo exploratory platform rooms; jumping/collision; usable objects; temporary horse placeholder; the three-pass squire joust; room/road scenery.
- src/50_game.js: mission state, waves, combat, shields, area progression, rendering.
- src/60_ui.js: world map, multi-day playable travel, touch and keyboard input, menu, main loop.
- src/99_tail.html: HTML closure.
- tests/adventure.js: four-area M0 and travel regression.
- tests/quest.js: M10 six-area siege and object interaction regression.
- tests/zoom.js: rapid tap zoom prevention for mobile.
- tests/smoke.js, tests/boot.js: browser boot/fallback.
- tests/bot.js: older complete mission bot; campaign bot historically had timeouts, so do not infer all-mission verification merely from a green narrower CI workflow.

Current v0.6.0 M0 "The Knight's Squire" has four connected areas: Hearthmoor Armory, Castle Stables, Tournament Lists, Southern Patrol Road. It asks for Halvard's breastplate, tournament helm, polishing oil, bundle of lances, an iron key and Corin's practice shield; then he grooms Halvard's horse, collects tack, assists at a three-pass joust and sets off on a solo patrol. The armory's vertical camera is now LOCKED, so the platforms do not slide down when Corin jumps. The left thumb controls movement; right thumb JUMP is beside combat/guard; mobile double-tap Safari zoom is suppressed. Keep all of these improvements.

The game is a *mostly solo* Corin adventure. Halvard, Lysa, Ione, rivals, potential rescued princess and other NPCs are present for scripted story moments and occasional temporary escorts, not a permanent three-member battle party. The user wants sprawling multi-room castles, caves and dungeons with doors, keys, treasure and meaningful platforming, later flight, actual traversable world-map roads with terrain-specific threats, horse riding and horseback combat, shields and eventually projectile-reflecting wards. Preserve this long-term direction without trying to implement the entire saga in this milestone.

The v0.5.0 engine supports multi-area missions and M10 "The Fall of Hearthmoor" has six battlefields. v0.6.0 adds exploration as opt-in area.explore; existing flat missions still need later conversion. The story/lore remains Corin Ashdown (the concealed Prince Corwen Aldaris), adoptive father/knight Ser Halvard, regent Maldric Vane; Act I squire/knight, Act II the hidden heir, Act III the crown, with benevolent-to-tyrant morality outcomes. Follow docs/STORY_BIBLE.md for canon.

The save key is hiddencrown.save.v2. Preserve old saves and existing world-map/mission flags. Do not require any network or external runtime dependencies for normal play. Keep the build and preview usable in iPhone Safari.

## 2. User feedback from actual iPhone screen recording (Nov 1, 2026)
The owner has played the v0.6.0 opening in portrait Safari and says the game is on the right track but the **horse and new backgrounds need a substantial quality pass**. Review the supplied recording if available; the owner can attach "ScreenRecording_11-01-2026 07-56-11_1.mp4" in Claude. Actual visible issues:
- Armory: repeated rectangular stone courses, simple identical arch/pillar treatment and basic weapon silhouettes. Better than the old generic scene, but still reads as repeated tiles rather than a purposeful inhabited castle armory.
- Stables: broad brown plank wall, square stalls, boxy props; little visual storytelling or depth. The "GROOM HALVARD HORSE" world object is currently code-drawn from a few rectangles; anatomically and visually it reads like a placeholder.
- Tournament: sparse blue sky, blocky grandstands, flags and fencing; the jousting participant is a very small, simple rider above a prominent timing bar. It lacks scale, excitement, motion, audience and convincing horse/lance/rider animation.
- Across scenes: props and prompts are sometimes difficult to read at gameplay zoom or overlap the player; improve hierarchy, shadows and visual affordances without crowding the controls.
- The owner LIKES the general side-scrolling pixel-art direction. Refine within that aesthetic; **do not replace with photorealism or a visually incompatible art style**. The main experience must remain legible on an iPhone at actual game scale, not just in enlarged concept art.

Visual reference in code: adventureBackdrop() and adventureWorldDraw() in src/45_adventure.js; adventure "horse" object rectangle code, and S.joust timer/mini-rider code. These are the areas to replace with higher-quality art and animation.

## 3. Main deliverable A — Art bible and scene overhaul
Create or update a concise **pixel-art visual bible** (palette, scale, illumination, silhouettes, tile size, character/horse scale, pixel density, shadow style, contrast, UI icon sizing). Preserve Corin's accepted character identity and the medieval fantasy/Arthurian feel of Auremark. Important objects must be recognizable at natural phone zoom.

Build actual in-engine visual improvements for THREE distinct places, not one castle wall recolored:
### Hearthmoor Armory
- Indoor dressed stone architecture, deep arches and alcoves, timber roof structure where visible, warm torches and forge glow, castle heraldry, nonuniform worn masonry and convincing floor/wall perspective.
- Recognizable armor stands (breastplate and helmet visibly distinct), sword/shield racks, lance bundle, repair station and polishing oils.
- A functional upper loft/catwalk and locked storage: visible supports, ladders or stairs when appropriate, collision platform alignment, no floating platforms or visual confusion over which surfaces can be landed on.
- Use handcrafted local landmarks that progress from storage to forge to loft to locked equipment room. Avoid a single repeated wallpaper.
### Castle Stables
- Real stable architecture: stall partitions, hanging tack, troughs, straw/hay, saddle stands, door openings, wood grain, sunlight through openings and distinct near/far layers.
- A plausible life-sized side-profile horse near the grooming objective, not a tiny yellow/brown rectangle. Horse must remain visibly horse-shaped even when Corin is nearby.
### Tournament Lists
- Distinct outdoor arena with proper jousting tilt/rail, banners of competing houses, spectator stands, visible spectators, castle silhouette, daylight shadows and ceremonial dressing.
- An on-world rider approaching along the lists, readable lance alignment and impact/handoff location; retain a modest timing cue but DO NOT let a floating progress bar be the entire joust.

Backgrounds should be deterministic, performant and composed of recognizable authored rooms/segments with restrained variation (lighting, banners, prop arrangements and wear), not a randomized repeating forest/castle paint strip. Keep the armory/stables camera vertically static for normal jumps. Enable vertical following only for much taller spaces that explicitly request it; no moving platforms caused by camera behavior. Preserve movement and collision.

Aim for comparable crispness and depth between Corin, the horse, props and background. If adding assets, keep the existing single-file, self-contained HTML export functional (inline or embed as needed); do not hotlink any third-party imagery or import copyrighted game assets.

## 4. Main deliverable B — Proper reusable horse model and animations
Treat the horse as a first-class world entity with its own sprite and animation interface, NOT a static object rectangle. It must support:
- Side-on silhouette: realistic proportions for head/neck/ears, barrel, chest, hindquarters and FOUR legs with articulated joints/hooves, distinct mane and tail.
- Saddles, bridle, reins, stirrups, harness and tournament caparison; Hearthmoor livery and alternate colors/tack available from data.
- At minimum idle breathing/ear/tail motion, walk, trot, gallop, halt, lance-run charge, and hit/recoil poses. Rider attachment points (saddle seat, hand/lance anchor, stirrup positions) stay stable across animations.
- Different visual configurations: Halvard's warhorse (fully tacked); groomable horse in stable; later Corin's own mount. Same core horse asset/rig can be reused.
- Correct sizes relative to Corin. Avoid the existing tiny rectangle combination and avoid a horse that looks like a toy, dog, deer or block of wood.
- Silhouette tests at playable portrait and landscape widths; sprites or rig should be visually inspected in the actual engine, not only offscreen generated art.

## 5. Main deliverable C — ONE jousting engine, two perspectives of play
Architect shared joust simulation *before* polishing the training minigame; the introductory assistant role must be the first teaching step of the eventual mounted activity.

**Reusable joust model** (data-driven; propose/implement reasonable equivalent fields):
- Participants: rider (id, horse, speed, armor, lance, crest, skill), opponent, and optional squire/ground crew.
- Course: start line, tilt barrier, rail lanes, track length and safe reset zones; participant positions and velocities.
- State phases: PREPARATION -> APPROACH -> LANCE_READY -> CONTACT_OR_HANDOFF -> RESOLUTION -> RESET/NEXT_PASS -> RESULTS.
- Shared charge progression, real positions, animation triggers, timing windows and audio cues. Prefer velocity/distance or normalized approach parameter rather than arbitrary duplicated timers. Slow-mo if useful but not required.
- Scoring: assist quality and mounted collision hit quality are different scoring rules ON THE SAME simulation/events. Favor data config/role flags over entirely separate code paths.
- Hooks for later horse acceleration, speed management, lane positioning, lance angle/height, shield angle, aim stability, stamina and rider/horse status.
- Deterministic tests with fixed seeds/speeds. Easy mode accessibility window on touch.
- A genuine gameplay loop, not one animation playing while a progress meter decides success.

### Opening chapter (IMPLEMENT NOW): Corin assists Halvard
Corin stands to the side as a squire. Halvard gallops past on the rendered warhorse; the player tracks his approach and taps USE/LANCE to hand off a spare lance when he enters the handoff zone. The handoff should visually go from Corin's arm/rack to Halvard's hand (or be believably handed at the track boundary), then Halvard lowers it toward an opponent. Show a pass from approach through contact/resolution and recovery; make the actual horse/rider movement the focal point. A squire mistakes a pass without breaking mission completion; use existing "three passes" contract and preserve G.flags.squireJoust and reward semantics.

### Later mounted mode (BUILD ARCHITECTURE + OPTIONAL CONTROLLED LAB NOW; full story campaign later)
When Corin earns or acquires his own horse, he should ride, steer/accelerate, orient and brace his lance, choose the moment of impact, use a shield, and receive a scored outcome against other riders. The same horse entity and charge/joust events are reused. Do not silently promise mounted jousting is completed if only a scaffold or a local demo exists. If feasible, provide a separate accessible debug/demo mode or controlled preview allowing owner to test mounted joust mechanics without unlocking later story progression. Keep the M0 story logically a squire-on-foot event.

For longer-term development: mounted travel, charging enemy infantry or beasts, fighting with one-handed weapons while riding, mounting/dismounting and horse stamina should share the mount entity. Full horseback combat is not required to call this visual/joust milestone complete; document exactly what is deferred.

## 6. Input, physics, game state and portability: DON'T REGRESS
- Corin is mainly SOLO. No followers permanently alongside him. Preserve temporary scripted companions.
- LEFT THUMB: horizontal movement. RIGHT THUMB: JUMP adjacent to ATK plus USE for relevant interactions and GUARD (move controls only as necessary to solve overlap). Two-finger move+jump works in portrait and landscape; no tap target interference.
- Don't reintroduce Safari double-tap zoom. Keep touch listeners preventDefault and touch-action rules.
- Indoor rooms stay fixed vertically while jumping. Platforms stay anchored; hero jumps against them. Camera following for special tall caves/towers only.
- Keep jumping/collision and chests/keys/locked doors functional as currently accepted. Horse must not clip through platform objects.
- Existing shield: acquired wooden shield, guard stamina, later steel shield and projectile-reflecting ward unlock progression. Don't remove for jousting.
- Keep the mobile HUD readable, especially when JUMP, ATK, GUARD and USE appear together; avoid text/objective label overlapping actors or touch controls.
- Keep world-map travel as playable seeded segments with biome-specific enemies. Future work includes non-repeating authored background pieces and resume mid-journey; don't break current travel.
- Saves: hiddencrown.save.v2; old save loads, no corruption when new mount state omitted, avoid requiring reset for old players.
- Build stays deterministic, offline-capable (as currently designed) and high-performing on iPhone Safari.

## 7. Long saga plans (context, not current acceptance scope)
We approved expanding quests into multi-objective, multi-location adventures rather than brief dialogue/combat/reward corridors. M10's siege is a first six-area proof of concept. Rebuild the rest in stages. The proposed Act I arc is early squire errands, tournament preparation, real competition and riding, village and road journeys, dungeon exploration, rivalry, knighthood, Hearthmoor's fall and the escape; Acts II/III retain Corin's identity reveal, factions and crown consequences. Later rescue missions (including a princess) may include temporary escorts, locked dungeons and castle exploration. Eventually magical traversal/flight can add vertical shortcuts. Do not expand the story at the cost of finishing this graphics and jousting milestone; do not unexpectedly rename or overwrite legacy mission IDs or flags.

## 8. Implementation plan and acceptance gates
Work iteratively. **Do not report screenshots, tests, commits or deployments that you have not produced.**

**Phase 1: Baseline + asset review**
1. Check out feature/claude-v061-visuals-joust from the public repo.
2. Audit the existing horse/object drawing and the joust state in src/45_adventure.js and M0 data in src/40_story.js. Read current layout and UI.
3. Run the existing build, smoke, boot, adventure, quest and zoom tests. Confirm expected baseline; record caveats about legacy mission bot.
4. Produce a side-by-side visual review of three scenes and horse at actual phone scale (before and after). Ask for visual selection only if materially distinct alternative designs are needed; otherwise choose a coherent style and implement.

**Phase 2: Visual refit**
1. Implement higher-quality horse sprite/rig and separate stable/tournament horse variants; validate pose and leg animations.
2. Refactor repeated environment decoration into authored modules for armory, stable, lists with separate geometry, palette, prop silhouettes and lighting.
3. Keep collisions, interactive object alignment and vertical camera fixed for M0 interiors.
4. Attach stable equipment preparation to the real horse entity visually (groomed/tacked states) while preserving existing mission flags.

**Phase 3: Shared jousting**
1. Introduce single reusable joust state machine and participant/horse interfaces.
2. Migrate M0 squire handoff into that simulation while keeping its story role, three passes, timing and progress flag.
3. Build a controlled mounted-role prototype or data hooks; label unfinished parts honestly.
4. Integrate in-world animations, sound, cues and fair scoring; no misleading placeholder progress bar acting as gameplay by itself.

**Phase 4: Hard verification and public preview**
- Rebuild: sh tools/build.sh; ensure index.html matches source (git diff --exit-code -- index.html).
- Run: npm install; npx playwright install chromium; npm run test:smoke; npm run test:boot; npm run test:adventure; npm run test:quest; npm run test:zoom. Fix failed tests, don't disable them. Add joust tests and horse/scene assertion coverage. A separate legacy campaign bot may remain red; document existing state rather than hiding failures.
- Test 390x844 portrait and 844x390 landscape with touch emulation; manual device review on iPhone Safari when available. Move+jump; GUARD; USE; opening chest; key/door; horse grooming; three passes; midgame save/reload; wave combat; M10; zoom prevention.
- Provide screenshots and short videos FROM the actual running build: armory overview and loft, stable horse close and normal zoom, tournament mounted pass with Corin on sideline, portrait and landscape controls.
- Publish a separate preview for this branch, ideally a stable path such as /preview/hidden-crown-v061/, without replacing any previous playable version. Verify URL, date and version; don't claim a GitHub Pages site is live unless actually enabled.
- Commit all changes, tests, screenshots/links and documentation to GitHub and push. Update CHANGELOG.md, docs/SAGA_REFORGE_V0_6.md and this handoff with accurate remaining gaps.
- Give a concise completion report: tested URL, branch, commit SHA, summary, test outcomes, observed performance, visual references, known limitations, suggested next milestone. Leave PR in draft for owner review.

## 9. Definition of done for this assignment
- The owner can see a *recognizably better horse*, with correct anatomy, tack and convincing movement in the stables and as Halvard's mount.
- Armory, stables and tournament are visually distinct at gameplay scale, not the same generic backdrop. Hand-authored points of interest align with objectives and platforms.
- Squire handoff visually uses a real on-screen galloping rider/horse and an in-world lance handoff, with a coherent staged joust simulation.
- There is one reusable joust model suitable for a later player-mounted mode; a separate future mounted joust cannot require discarding the squire event's engine.
- Solo movement/JUMP, the fixed interior camera, basic shield, keyed exploration, save data, playable roads and M10 still work.
- Portrait/landscape real button hit testing, automated regressions and actual gameplay evidence support the release.
- Fully committed to the PUBLIC repository branch, with a tested preview. Do not merge to main without the owner's explicit approval.

**Suggested next version:** v0.6.1 — "The Lists and the Living World".