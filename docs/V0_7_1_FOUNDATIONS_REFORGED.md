# v0.7.1 — Foundations Reforged

Branch `development/v071-foundations-reforged`, built on the review branch (which carries the audit document) on top of `feature/v070-seven-chapter-squire` (08430e8, the latest approved baseline; no later approved art commits exist). Draft PR targets `feature/v070-seven-chapter-squire`. Nothing is merged into `main`, no existing branch or PR was touched.

Audit items V-5 (HUD collisions), V-6 (silent save failure) and V-7 (NEW GAME erases the save) are addressed by sections 'Save system' and 'Controls and HUD'. V-10 (death costs nothing) is deliberately left for v0.8.0.

Scope: reliable saves, touchscreen controls, verified bug fixes, tests and CI. No new combat or story content (that is v0.8.0).

**Physical device status: not tested on a physical iPhone.** Everything below was run in headless Chromium with touch emulation and synthetic multi-pointer events. Safari-specific behaviour (clipboard, file download, private-mode storage, the home-indicator inset) is covered by code paths and emulation only.

## 1. Baseline before any change

All 15 existing test scripts passed on the unmodified review branch (smoke, boot, adventure, magic_paths, opening_platforms, grounding, squire, polish, world, pixel_art, quest, zoom, joust, lab, art_pass). `tests/bot.js` was excluded because of its known `page.$` bug (fixed below); it was run after the fix. No pre-existing failures other than that test bug.

## 2. What changed

### Save system (`src/10_core.js`, `src/60_ui.js`)

| Requirement | Implementation |
| --- | --- |
| Detect unavailable / failing storage | `storageProbe()` at boot (write, read, remove); every `save()` reports success; a failing write flips `SAVESTAT.ok`. |
| Warn clearly | Title screen warning box; compact red "NOT SAVING" pill in the HUD plus a toast; a red card at the top of MENU and the save-code screen; SAVE GAME says "COULD NOT SAVE" instead of "Game saved". |
| Keep playing without storage | The latest state is kept in memory (`SAVESTAT.mem`), so CONTINUE and EXPORT still work for the session. |
| Confirm before overwrite | NEW GAME on an existing save opens a confirmation (shows level, gold, missions done) with START NEW GAME / KEEP MY GAME. |
| Backup before new game | `backupSave()` copies the existing save to `hiddencrown.save.v2.bak` before NEW GAME and before an import. RESTORE BACKUP on the title screen (when no main save) and in the save-code menu. |
| Export / import | `HC3-<base64 json>-<fnv1a>` text code, COPY CODE, SAVE AS FILE, paste or choose a file to import. Import validates, previews the contents and asks before replacing. Textarea is selectable so long-press copy works if the clipboard API is blocked. |
| Validate malformed data | `sanitizeSave()` repairs bad field types, clamps numbers, drops non-object inventory entries and repairs items (`aff` list, ids, names); unrecognisable data is rejected without touching the current game. A damaged save falls back to the backup. |
| Version migration | `ver` (now 3) is stamped on every write; `migrateSave()` brings older data forward in memory. |

### Controls and HUD (`src/00_head.html`, `src/10_core.js`, `src/50_game.js`)

- Control container is now bottom-anchored with absolutely placed clusters. **Portrait:** move pad bottom-left; weapon row (sword, staff, bow, Dawn/Dusk) above it; ATK bottom-right with JUMP to its left, SKILL above ATK, GUARD above JUMP. **Landscape and desktop:** one low row, move pad then weapon row on the left, GUARD / SKILL / JUMP / ATK on the right.
- Weapon switching uses 44 px icon chips (sword, staff, bow) with aria-labels; the Dawn/Dusk toggle is the fourth chip. Chips are still real `[data-w]` buttons, so switching behaves exactly as before.
- Nothing essential sits above the ground line any more: the game's ground reserve now includes the iPhone home-indicator inset (`#sabprobe`), and the layout test asserts no control touches the ground band.
- Objective tracker moved below both HUD columns in portrait and under the bars (narrower) in landscape; it no longer covers BAG/SKILLS or the health bars.
- BAG / SKILLS / MENU keep their look but have 44 px hit areas; choice buttons are at least 48 px tall.
- HP and MP bars show numbers; the level line shows XP percent.
- Dialogue was reviewed in portrait, landscape and small phones: text is large, stroked and clear of the HUD; tapping the panel or the canvas advances. No change was needed beyond the choice button height.

Before / after: `docs/evidence/v071/controls-before-*.jpg` and `controls-after-*.jpg` (iPhone portrait, iPhone landscape, small portrait).

### Verified bugs fixed

| ID (audit) | Fix |
| --- | --- |
| V-1 canter unreachable | Free-riding top speed raised from 94 to 124 px/s (`MOUNT_CFG` in `src/46_horse.js`), inside the canter band (95 to 150), with a slower ramp so walk, trot and canter are all seen. The canter lesson now needs a canter gait held for 1 s past the marker; a trot no longer completes it. |
| V-2 jump inconsistent | Kept JUMP everywhere (flat-mission jumping was an approved v0.6.3 feature) and made the rules identical: airborne heroes avoid ground melee hits and hostile projectiles in flat missions exactly as in the adventure engine. |
| V-3 outfit shown as "trinket" | Results list now shows "cosmetic" for outfits (`itemStatText`). |
| V-4 weapon carry-over | Each area starts with the sword drawn (falls back to staff or bow if no sword). |
| V-9 iron-blade line | Halvard now says "the iron blade from our training in the yard". |
| V-11 Dusk drift | Staff bolts and the Dusk nova no longer move the compass; Dawn and Dusk are different approaches. Authored story choices still shift it. |
| V-8 `tests/bot.js` | `page.$` replaced with `page.$$`; the full 21-mission campaign run now passes. |

### Tests and CI

New: `save.js`, `layout.js`, `riding.js`, `jump_consistency.js`, `fixes.js`, `golden_path.js`, `run_all.js` (`npm test`), `tools/check_syntax.js` (`npm run check`). Updated: `adventure.js` (its old canter check teleported a trot-speed horse and encoded the bug), `bot.js`, `tests/README.md`.

`.github/workflows/ci.yml` runs on every push and every pull request with three jobs: build and regression (build, committed-index diff, syntax and optional-chaining check, 20-script suite), golden path (portrait and landscape matrix), campaign bot (21 missions). The nine older per-branch workflows are left in place; retirement is part of `docs/INTEGRATION_PLAN.md`.

The golden-path test plays the seven chapters through the visible buttons only (movement, USE, JUMP, ATK, weapon chips, GUARD, dialogue taps) and then asserts completion, arrival at the mission hub, a version-stamped save and zero page errors.

## 3. Save-compatibility report

Key unchanged (`hiddencrown.save.v2`); format change is additive (`ver`). Verified by `tests/save.js` with real storage in Chromium:

| Case | Result |
| --- | --- |
| Pre-squire-kit save (no `sq`, no `ver`) | Loads; level, gold, inventory, equipment, Dusk choice and missions intact; migrated to knighted as before; stored copy untouched until the next save. Caught a real regression during development (the default `sq:1` was masking the legacy check); fixed and covered. |
| v0.7.0 squire-era save (`sq:1`, stash) | Stays a squire, stash preserved. |
| Current save, export code, import in a fresh browser | Restores inventory, character progress, mission completion and choice flags. |
| Damaged JSON, truncated code, bad checksum, empty text, valid code with non-save payload | Rejected with a message; current game unchanged. |
| Wrong field types (`lvl:"x"`, `inv:"no"`, `flags:[]`, negative gold, out-of-range compass) | Repaired to safe values. |
| Item records missing `aff` (crashed boot before) | Repaired. |
| Corrupt main save with a backup / without a backup | Backup loaded with a notice / stays on title without crashing. |
| NEW GAME | Confirmation first; backup written only after confirming; RESTORE BACKUP brings the old game back. |
| Storage blocked at boot / quota error mid-game | Detected; warnings shown; game runs; export works. |
| v0.7.1 save opened by an older build | Extra `ver` field is ignored (older code does `Object.assign` of known data). Not run against an old build in a browser; reasoned from the old loader only. |

No incompatible save migration is required for v0.8.0.

## 4. Test results

Run on the final commit in headless Chromium (Playwright):

- `npm run check`: both inline scripts parse; no optional chaining.
- `npm run test:ci`: 20 of 20 scripts pass (smoke, boot, save, layout, riding, jump_consistency, fixes, adventure, magic_paths, opening_platforms, grounding, squire, polish, world, pixel_art, quest, zoom, joust, lab, art_pass).
- `layout.js` strict: 5 viewports (390x844, 844x390, 375x667, 667x375, 1280x800) in two HUD states each: no control overlaps, controls clear of the HUD and tracker, everything on screen, 44 px targets and ground band free on touch viewports.
- Golden path: 7 of 7 chapters in portrait (about 167 s) and in landscape, 103 dialogue taps, 0 page errors, save stamped `ver:3`.
- Campaign bot: all 21 missions complete, 0 errors (about 13 minutes).

## 5. Known remaining issues

- Not run on a physical iPhone. Clipboard, file download/upload and storage behaviour in iOS Safari and in embedded viewers are untested (a selectable textarea is the fallback). Real thumb ergonomics are unverified.
- The Dusk nova change (no compass drift) was verified by reading the code; the automated check covers staff bolts in both modes.
- The Ione Dusk choice still applies an authored compass shift of -3 labelled "DUSK POWER". Left alone as an authored decision; it belongs with the v0.8.0 narrative pass.
- The compass bar and title ("The Wanderer" and so on) remain in the HUD.
- Airborne rules are now shared, so a hero attacking from high in the air over a low enemy in a flat mission can miss, as in the adventure engine.
- The sword chip icon is a simple glyph and may be worth a redraw.
- Some tests rewrite files under `docs/evidence/after/` when run locally (image noise, not committed).
- The nine older workflows still exist beside `ci.yml` (some trigger on a single branch each).

## 6. Handoff to v0.8.0

No critical defects and no incompatible save migration were found, so v0.8.0 can start from this commit. Constants are named (`MOUNT_CFG`, `JOUST_CFG`); the golden-path and layout tests will catch control regressions from combat work.
