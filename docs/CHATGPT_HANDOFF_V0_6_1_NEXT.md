# ChatGPT handoff — The Hidden Crown v0.6.1 (continue from here)

Repo: https://github.com/rossgragert-dev/the-hidden-crown
Branch: `feature/claude-v061-visuals-joust` (draft PR #3). Never merge to `main` without Ross's approval. Leave PR #1 and #2 alone.
Preview (private claude.ai artifact, built from the branch): https://claude.ai/artifact/MNzyPcFV2bS6sQ1iL3RXyD

## How the project works
- Single-file HTML5 canvas game. Edit `src/*`, then run `sh tools/build.sh` (concatenates in order: 00_head.html, 10_core.js, 20_art.js, 30_items.js, 40_story.js, 45_adventure.js, 46_horse.js, 47_joust.js, 48_scenes.js, 50_game.js, 60_ui.js, 99_tail.html) into `index.html`. Commit both `src/*` and the rebuilt `index.html`.
- Everything lives in one IIFE. No dependencies. Avoid optional chaining. Must work in a sandboxed iframe with blocked storage.
- Tests (Playwright; `NODE_PATH=$(npm root -g)`): `tests/smoke, boot, adventure, quest, zoom, joust, lab, squire`. All pass on the branch. `tests/evidence.js <outdir>` captures scene screenshots (before/after images are in `docs/evidence/`).
- Save key `hiddencrown.save.v2` must keep working. Old saves (no `G.sq` field) load as "already knighted" with their gear.
- iPhone Safari rules: no double-tap zoom, right-thumb JUMP, USE/GUARD/ATK/JUMP must not overlap, fixed interior cameras.
- Git commits need the Co-Authored-By / session trailers the environment asks for.

## What was built on this branch
1. **Horse rig** `src/46_horse.js`: vector shapes baked to pixel frames, cached in `HCACHE`. Gaits idle/walk/trot/canter/gallop/charge/halt/recoil/groom, coats, tack (halter, stable, saddled, tourney), dirty/groomed. `drawHorse`, `drawMounted`, `drawLance`.
2. **One joust engine** `src/47_joust.js`: deterministic 60 Hz sim. `joustCreate({role:'squire'|'rider',...})`, `joustAct`, `joustStep`, `joustDraw`, `joustHud`. Squire role = Corin hands a lance to Halvard (M0). Rider role = Corin mounted vs a seeded foe. Easy mode `G.opts.joustEasy`. Tuning constants in `JOUST_CFG`.
3. **Scenes** `src/48_scenes.js`: armory bays (heraldry, weapon wall, forge, armour stands), tournament lists (animated crowd, pavilion, tilt barrier). Stables have a real horse with grooming states (in `adventureWorldDraw`).
4. **Joust Lab**: MENU → JOUST LAB (PREVIEW), a hidden mission `joustlab` (`MBY.joustlab` in `40_story.js`). No story rewards.
5. **Squire kit**: new games start with a plain tunic + Wooden Practice Sword (6 dmg). Original kit is held in `G.stash`. Cellar Rats (`EN.rat`, new sprite) in armory and stables. Blunt Iron Sword (9 dmg) from Halvard after the tournament (`giveBluntSword`). Knighting (`knightCorin`, called when mission `KNIGHT_MISSION='m11'` completes) returns the stash and equips the Hearthmoor Heirloom Blade (18 dmg, House Hearthmoor lineage). Before knighting, outfits render as a plain tunic (colour/aura only).

## Ross's design intent (do not contradict)
- Corin is a squire raised by Ser Halvard. Intro mission M0: he serves lances on foot; later he rides his own horse and jousts using the same engine.
- Tunics can be swapped for colour/rarity until he is knighted by Halvard (end of Act I, when Halvard dies). Then the stashed gear returns.
- The Heirloom Blade belongs to Halvard's noble line. A separate, more important sword tied to Corin's hidden ancestry is given at the end of **Act II**. Do not use the Heirloom Blade for that.
- Keep the current pixel-art direction (H2 character style).

## Known gaps / suggested next work (in order)
1. **Phone playtest.** Nothing has been tested on a real iPhone. Check frame rate in the lists scene (scenery redraws per frame), touch layout, joust timing windows, rat difficulty and damage numbers (6 / 9 / 18).
2. **Story tournament mission** where Corin rides his own horse using `role:'rider'` (the Lab already runs it). Needs a scripted entry, rewards and a place in Act I or II.
3. **Knighting scene.** Currently knighting is a toast on M11 completion. Ross wants it tied to Halvard's death at the end of Act I: add a proper dialogue/cutscene and decide whether `KNIGHT_MISSION` should be M11 or M12. Check the M11/M12 branches (`halvardStands`, `halvardCarried`, `halvardBound`) before moving it.
4. **Portrait joust framing:** the opponent is partly off-screen at contact in the narrow view (an arrow indicator exists). Consider a zoomed-out camera for the rider role.
5. **Joust UI:** the HUD is at fixed position (6, 80). Consider also showing the opponent's lance state.
6. **Prop art:** armory/stable objects (chests, gear, keys) are still simple icons. Horse tack variants and a dismount/hit reaction are not done. No horse combat.
7. **Docs:** update `docs/SAGA_REFORGE_V0_6.md` and `docs/CLAUDE_HANDOFF_V0_6_1_VISUAL_JOUST.md` status sections to match `CHANGELOG.md` (0.6.1 entry).
8. **Preview hosting:** GitHub Pages has not been confirmed. Only the claude.ai artifact preview exists.

## Prompt to paste into ChatGPT
> Continue development of The Hidden Crown (https://github.com/rossgragert-dev/the-hidden-crown), branch `feature/claude-v061-visuals-joust`, draft PR #3. First read `docs/CHATGPT_HANDOFF_V0_6_1_NEXT.md`, then `HANDOFF.md`, `CHANGELOG.md` and the source in `src/`. Do not rebuild from scratch and do not merge to main. Preserve saves, platforming, fixed cameras, right-thumb jump and iPhone Safari controls. Run `sh tools/build.sh` and all tests in `tests/` before every commit, commit `index.html` with the sources, push to the branch and keep PR #3 updated. Start with item 3 (the knighting scene tied to Halvard's death) and item 2 (a story tournament where Corin rides his own horse), and be explicit about anything you did not test.
