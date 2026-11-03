# The Hidden Crown v0.7.0 — The Road to Hearthmoor

**Status:** Implemented on `feature/v070-seven-chapter-squire`, unmerged draft pending owner and iPhone review.
**Based on:** v0.6.5.1; preserve current multi-area siege, later missions, progress, item progression and world-map travel.

## Seven playable opening chapters

| Chapter | Stage ID | Location and gameplay | New reward / state |
|---|---|---|---|
| 1. The Road from Halvard's Keep | `rideout` | Corin rides a **bay gelding** beside Halvard's grey warhorse. Hold right to accelerate toward a canter; left to rein back; JUMP clears small obstacles. Halvard explains horsemanship and tournament rules on the road to Castle Hearthmoor. End at Hearthmoor's inn. | `squireReins`, `squireCanter` |
| 2. The Hearthmoor Inn | `inn` | Workbench, upper storeroom and key, retrieve visiting knight's breastplate, tournament helm and polishing oil. | `squireArmoryKey`, `squireArmor`, `squireHelmet`, `squireOil` |
| 3. Inn Stables | `stables` | Groom Halvard's charger, collect saddle from raised hayloft, clear rats from the grain. | `squireHorse`, `squireSaddle` |
| 4. Tournament of Hearthmoor | `lists` | Fasten the knight's armor before he rides; collect three spare lances; time a squire-side handoff through the **same** reusable jousting engine. | `squireHalvardArmored`, `squireLances`, `squireJoust` |
| 5. Practice Ring | `practicelists` | Mounted joust with Corin on his bay and Halvard on his charger using blunted lances; two scored passes with Halvard as the actual opponent. | `squirePracticeJoust` |
| 6. Ranger and Sword | `trainingyard` | Meet Ranger Elowen, Halvard's friend, who grants a field bow. Fire a **real arrow** into a target. Halvard then gives Corin a wooden shield, demonstrates guarding, and guides a sword-dummy strike before awarding the blunt iron blade. | `squireFirstBow`, `squireArcheryHit`, `squireShield`, `squireGuardLearned`, `squireSwordHit`, `bluntSword` |
| 7. Broken Bridge and Ione | `returnroad` | Corin and Halvard begin the return ride in deteriorating weather. The bridge collapses, physically dismounting and separating them. Corin meets Ione and receives a Rowan Staff. Player chooses **Dawn** to reveal ancient stepping stones or **Dusk** to raise a new rock causeway, then must select STAFF and cast matching magic to cross. | `squireBridgeBroken`, `ioneFirstStaff`, `ionePathChoice`, `ionePathMade`, `ioneLightRune` |

This is **one seven-area M0 mission**, not seven new top-level mission IDs. It retains existing M1–M12 quest IDs and saves, while the in-game HUD displays CHAPTER 1 / 7 through CHAPTER 7 / 7. Existing completed M0 saves are not reset; legacy partial checkpoints map conservatively to the nearest new chapter, though equipment/quest objectives need player review.

## Canon clarification
Ser Halvard's own keep (his rural home and training hold) is **separate from Castle Hearthmoor**, the tournament destination. It has deliberately been left unnamed beyond "Halvard's Keep" rather than introducing a permanent location name without owner approval. Corin spends the tournament at Hearthmoor and rides home with Halvard afterward. The old Story Bible's assertion that Corin lives at Castle Hearthmoor describes the earlier prototype; this revision governs the new opening.

Ranger **Elowen** is a trusted friend of Halvard and Corin's first archery teacher. The later Marshkin and ranger characters remain part of Act I. **Magister Ione Veyra** first appears after the bridge disaster, not immediately after the tournament. Her later library encounters assume their introduction has already taken place.

## Reused implementation
- `src/46_horse.js`: articulated mounts, saddles, reins and gait animations, used for both Corin and Halvard.
- `src/47_joust.js`: one squire/ride jousting simulation with configurable opponent and number of passes. Halvard is drawn as the riding opponent during practice.
- `src/45_adventure.js`: chapter-specific interactions, mount progress, auto-dismount on bridge collapse, magic branch flags and physical crossing constraint.
- `src/50_game.js`: mounted movement and rendering; real bow projectile to archery target; actual sword strike on dummy; staff casting that opens a chosen bridge.
- `src/48a_chapters.js`: original pixel-art sets for inn, practice ring, training grounds and Ione's grove.
- `src/49_world.js`: journey time/weather associations.

## Controller behavior
- While riding, hold RIGHT to increase speed to a steady canter; release to decelerate. LEFT reins back and changes facing, and JUMP still provides a small horse jump.
- During the joust, use the in-world practice marker and COUCH at the approach; the existing simulation scores contact/timing. Missing a pass does not fail training.
- During archery, select BOW then ATK so an actual arrow connects with the target. With sword, select SWORD and strike within reach. Hold GUARD while tapping USE at Halvard's defense station.
- At the bridge, choose Dawn or Dusk, select STAFF and match the selected mode. The terrain remains blocked until this spell is cast.

## Known limits
- The bay gelding and Halvard's charger reuse the same articulated rig; Corin's mount has different coat and ordinary tack rather than tournament barding. More detailed distinct body-size proportions could be part of a future fidelity pass.
- The mounted road sim is a side-view acceleration, deceleration and jump tutorial; it does not yet model turning radius, terrain stamina, obstacle collision or full horseback melee combat.
- The bridge is an area-boundary and magical-crossing gate, rather than a fully simulated destructible rope/stone-bridge physics structure. It includes a visible broken span and path geometry after casting.
- Old mid-M0 saves resume at the nearest new chapter, not an exact object-level migration from five chapters to seven.
- Browser tests use emulated mobile Chromium, not physical iPhone Safari. Real device visual and performance review remain required.

## QA
The automated suite includes seven-chapter full progression, both Dawn and Dusk outcomes, platform safety, existing squire kit, save compatibility, existing M10 siege, jousting, world art, zoom prevention, and browser boot. See GitHub Actions `v0.7.0 Seven Chapter Opening` for current completion status. Do not declare device acceptance until an iPhone test.
