# v0.8.0 Combat Reborn: milestone report

Branch `development/v080-combat-reborn`, built on `development/v071-foundations-reforged`. Nothing is merged; `main` and PR #1-#9 are untouched.

## Implemented
- Sword combo, hit feedback, dodge roll, timed guard/parry, counter, shield guard, spearman, torch raider, hound, sparrer (see CHANGELOG).
- Weapon differences via `COMBAT_CFG`: sword (fast, combo, heavy finisher), staff (slower, low knockback), bow (ranged, medium cooldown).
- Platform feel (coyote 0.10 s, buffer 0.12 s, variable jump). `jumpCutV` is -230 so a quick touch tap still reaches about 54 px platforms; hold height is only slightly higher (about 65 px vs 58 px). This favours touch forgiveness over fine control.
- Defeat: forfeits the encounter's rewards only; level-ups are kept. No permadeath or inventory loss.
- Chapter 6 sparring bout; extra narrative lines (Halvard, Corin, Ione); mixed archetype waves in two missions.

## Not done in this milestone
- Sapper and crossbowman archetypes (crossbow already exists; no new behaviour).
- Chapter 1 obstacle pace, chapter 2 puzzle, chapter 3 interactive horse care, chapter 4/5 timing feedback, chapter 7 optional encounter, deeper Corin/Elowen narrative. These remain recommendations.
- Dodge by swipe gesture was not built or evaluated on a device.

## Testing
- `node tests/run_all.js`: 21 scripts pass (includes `combat`, `layout` strict, `save`, `riding`, `jump_consistency`).
- `golden_path` (7 chapters through on-screen buttons, including the sparring bout): portrait 390x844 and landscape 844x390 both pass on the final build.
- `bot` (campaign missions): passes with the mixed waves.
- All of this ran in headless Chromium via Playwright with emulated touch. It was **not** tested on a physical iPhone or real Safari; touch feel, haptics-free timing and performance on device are unverified.

## Evidence
`docs/evidence/v080/`: portrait and landscape screenshots of the sparring approach and slash.

## Known issues / recommendations
- Chapter 6 intro dialogue is long and overlaps the quest panel in portrait (pre-existing layout, made slightly worse by two new lines).
- Tune `COMBAT_CFG` on a real device first (combo window, parry window 0.20 s, roll cooldown).
- Integration: merge the stack in order (#1-#9, review, v0.7.1 PR #10, v0.8.0) once approved; it is linear and fast-forwardable.
