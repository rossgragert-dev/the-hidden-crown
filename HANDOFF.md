# HANDOFF: The Hidden Crown

Everything a new assistant (Claude, ChatGPT or a human) needs to continue this project. Read this file first, then `docs/STORY_BIBLE.md`, then the code in `src/`.

Last updated: v0.4.0 (see CHANGELOG.md). Update the "Current state" and "Open work" sections whenever you hand off.

## 1. What this is

A medieval fantasy **mobile-first action RPG**, built as a **single self-contained HTML5 canvas file** with **no dependencies**. A young squire (Corin) becomes a knight and discovers he is the lost heir to the throne. The player knows from the start (dramatic irony). A single **Benevolent <-> Tyrant compass** decides what kind of king he becomes. Weapons: sword, staff, bow. Magic: Dawn and Dusk.

The owner is Ross. Working style and preferences:
- Self-contained single-file builds (HTML5 canvas or React JSX), no external dependencies.
- Deploys by pasting into StackBlitz or CodeSandbox for zero-setup sharing and mobile testing.
- **Iterates quickly with targeted change requests**, not full rebuilds. Prefer small, verified edits to the existing code over rewrites.
- Wants the playable area as large as possible on a phone in portrait (full-screen canvas, controls overlaid).

## 2. Decisions already made (do not re-ask)

| Topic | Decision |
| --- | --- |
| Tone | High fantasy, bright and mythic with real shadow |
| Central conflict | A usurper (Regent Maldric Vane) holds the throne; Corin is the hidden heir |
| Morality | One slider, -100 Tyrant to +100 Benevolent, visible to the player |
| Reveal | The player knows Corin is the heir from the prologue; Corin learns in Act II |
| Scope | 42 main missions in 3 acts, ~30 side quests, 6 endings, replayable |
| Combat | Real-time side-view; sword, staff (Dawn/Dusk toggle), bow; one ability per weapon |
| Progression | Level cap 30, 5 loot rarities with colors, 3 skill trees (Valor, Arcana, Wild) |
| Outfits | **Cosmetic only**, found in chests and dungeons and rare drops |
| World | Map of places joined by roads; roads open with story; missions start only at their location |
| Art style | Match the reference video: chunky low-detail pixels, bulky boxy torso, one oversized shoulder pauldron, thin pale legs, edge-lit shading, **no black outline**. Chosen variant **"H2"**: taller body, visible faces with clear eyes, brow, nose, mouth |

## 3. Current state (v0.4.0)

**Playable now:** all of Act I (M1-M12), 5 side quests, 4 dungeons (forest, cave, mine, keep). 21 missions total. A Playwright bot (`tests/bot.js`) plays all of them end to end with no errors.

**Systems implemented**
- Adaptive full-screen canvas (portrait and landscape), parallax backdrops, 4 moods plus 4 dungeon environments.
- Characters in the H2 style: hero, companions, NPCs, human enemies, blight creatures. Armor sets the body shape (cloth, mail, plate); outfits override colors, cape, tabard and plume.
- Combat: sword, staff (Dawn heals, Dusk hits harder and frightens), bow, 4 active abilities (Shield Bash, Whirlwind, Nova, Volley), shields, dodge, leech, crit.
- XP and levels (cap 30), loot with 5 rarity colors and affixes, bag, equipment, sell, outfits/wardrobe filter.
- 3 skill trees with 4 tiers each, respec for gold.
- Morality compass with tiers (display and dialogue reactions only; see gaps).
- Mission engine (data-driven steps), world map with route-finding and animated travel, results screen, replayable missions (choices skipped on replay), save/load in localStorage.
- Boot screen that shows "Loading..." and any startup error on screen.

**Known gaps and honest caveats**
- Not yet tested on a real phone (only headless Chromium at 390x844 and 844x390).
- Compass tiers do **not** yet change mechanics (e.g. "Dawn empowered at +70"). They are shown and used in dialogue only.
- Faction standing meters are in the design but **not implemented**; only flags and the compass exist.
- Companions follow and look right but do not fight.
- No New Game+, no random travel encounters, Hearthmoor looks the same after the siege.
- Audio is a few WebAudio blips; no music.
- Act II and III exist as locked titles on the map and in the bible only.

## 4. Repo layout

```
index.html            built single-file game (open this, or paste it into StackBlitz/CodeSandbox)
src/                  source modules, concatenated in this order by tools/build.sh
  00_head.html        HTML, CSS, HUD, modal markup, boot screen, error handler, opens the <script> and the IIFE
  10_core.js          helpers, layout(), audio, save/load, globals G (persistent), S (runtime), P (player)
  20_art.js           palettes, parallax layer builders, environments, sprite builders, drawing
  30_items.js         rarities, item generator, OUTFITS, skills (SK), stats calc(), XP
  40_story.js         enemy table EN, regions REG, missions MISSIONS, STUBS, location map LOC
  50_game.js          dialogue, mission flow, combat, update(), draw(), HUD
  60_ui.js            modals (map, brief, bag, skills, results, menu), world map data NODES/EDGES, title, input, loop
  99_tail.html        closes the IIFE and the document
tools/build.sh        cat src files into index.html
tools/make-handoff-bundle.sh   one-file bundle (this file + bible + all source) for pasting/uploading to another assistant
tools/design-lab/     character style experiments (options B-I) used to choose the art direction
tests/                Playwright scripts (see tests/README.md)
docs/STORY_BIBLE.md   full story and systems design
```

**Build:** `sh tools/build.sh` then open `index.html`. There is no bundler. Everything lives in one IIFE; files are plain concatenation, so a `const` must be defined before it is used at load time (functions are hoisted).

## 5. Architecture and data schemas

### Global state
- `G`: persistent save data. `{lvl,xp,pts,gold,sk:{skillId:rank},inv:[items],eq:{sword,staff,bow,armor,trinket,outfit},c:compass,flags:{},done:{missionId:1},kills,loc:'hearth',day,bhp,bmp}`. Saved to `localStorage['hiddencrown.save.v2']` by `save()`.
- `S`: runtime state. Important fields: `mode` ('title'|'prologue'|'play'|'hub'|'done'), `mission`, `beats`, `bi` (beat index), `arena/arenaL/arenaR` (wave lock), `talk/choosing`, `cam`, `pal`, `m` (derived stat modifiers from `calc()`), `dusk` (staff mode), `rew` (mission rewards).
- `P`: player `{x,face,hp,max,mp,mmax,w(0 sword,1 staff,2 bow),cd,atk,ab,shield,...}`.
- Arrays: `enemies, proj, parts (particles), drops, fxs (floating text/rings), FOL (followers)`.

### Rendering model
- `layout()` picks integer scale `SC = max(2, round(min(vw,vh)/200))` and an internal resolution `W x H = ceil(viewport / SC)`. The canvas fills the whole screen; controls overlay the bottom. `GY` = ground line (feet), `HZ = GY - 70` horizon. Everything is positioned from `W, H, GY`, never hard-coded.
- `buildLayers(palKey)` pre-renders parallax layers to offscreen canvases (cached by palette + size). Day-style palettes build sky, peaks, castle/mountains, forest, hills, village, near trees, ground, foreground. Palettes with `env` (`wood, cave, mine, keep`) use `buildEnvLayers`.
- `drawBackdrop(cam,t,pk)` composites layers with parallax factors; `draw()` then draws chests, drops, NPC, followers, enemies, hero, projectiles, particles, overlays.
- **Sprites** are lists of rectangles `[x, y, w, h, color, flag]` relative to the feet, +x = forward, y negative = up. Flags: `'n'` no bevel, `'f'` effect (translucent, no bevel). `drawBevel(parts, x, y, face, {bevel, k, white})` draws them with a light top/left edge and dark bottom/right edge, no outline. `personParts(o)` builds a humanoid from an options object `o`; `blightParts` builds the beasts.
- `personParts` options: `col, metal, trim, tab, cape, hair, skin, iris, beard, helm, crest ('plume'|'horns'|'hood'|'spikes'), crestC, look (0 cloth, 1 mail, 2 plate), robe, cloth, mask, scar, antler, quiver, nosh, aura, w (weapon: 0 sword, 1 staff, 2 bow, 4 dagger, -1 none), atk (remaining 0..1), mv, hurt, orb, wcol, wglow, carry`.
- `NPCS` holds presets for named characters (corin, halv, lysa, ione, wren, brannoch, guard, vill, armorer, child, cmdr, veska).

### Items
- `genItem(ilvl, rar, slot)` returns `{id,slot,rar,ilvl,name,dmg|def,aff:[{k,v}],look,col,leg}`. Slots: `sword, staff, bow, armor, trinket`; `outfit` returns `{slot:'outfit', oid}` from `OUTFITS`.
- Rarities `RAR[0..4]` = Common grey, Uncommon green, Rare blue, Epic purple, Legendary orange. `rollRar(boost)` rolls with weights `[60,26,10,3.4,.6]`.
- Affixes in `AFX`: dmg, crit, leech, hp, def, regen, mp, xp. `calc()` folds equipment and skills into `S.m` and recomputes `P.max/P.mmax`.
- **Outfits** (`OUTFITS`): `{id,n,r(rarity),col,tab,trim,cape,metal?,aura?,plume?}`. `heroOpts()` in 50_game.js applies the equipped outfit over the armor look.

### Skills
`SK` array of `{id,tr:'knight'|'arcana'|'wild',tier:1-4,n,max,req,d(rank),fx(m,rank)}`. Abilities (`bash, whirl, nova, volley`) have no `fx`; they are wired in `abilityId()/useAbility()`. Tier N needs `3*(N-1)` points in that tree.

### Enemies
`EN[kind] = {n,hp,dmg,spd,rng,xp,g:[goldMin,goldMax],drop,k(scale),big,h(human),w,ranged,dash,sp(sprite opts)}`. Kinds: `blight, hound, bandit, archer, ashen`. Scaling per mission level: hp `*(1+.16*(lvl-1))`, dmg `*(1+.1*(lvl-1))`.

### Missions (40_story.js)
```js
{id:'m9', type:'main'|'side'|'dungeon', act:1, title, reg:'chapel', lvl:6,
 req:'m8' /* main */ , after:'m4' /* side, dungeon */, loc:'hearth' /* map node */,
 endLoc:'green' /* optional: where the party ends up */, desc, steps:[ ... ]}
```
Step types (run in order as the player walks past each beat; beats are 270px apart):
- `{t:'say', lines:[L('Name','text'),N('narration')] | ()=>[...], npc:{k:'ione'}, flag:'knighted'}`. In text, `*word*` highlights one word (use one word per asterisk pair).
- `{t:'wave', list:[{k:'blight',s:1|-1 (side),d:delaySeconds, boss:1, name, hpm, dmgm, sp:{...}}], intro:[lines], outro:[lines]}` locks the camera into an arena until all enemies are dead.
- `{t:'choice', prompt, opts:[{label,desc,c:compassDelta,cl:'toast label',flag,heal,gold,xp,maxhp,maxmp,loot:{slot,rar},shake,lines}]}`. Skipped on replays.
- `{t:'chest', boost, out:outfitChance (0..1), lines}`, `{t:'loot', slot, rar, lines}`, `{t:'toast', text}`.
`REG[reg] = {n, pal}` maps a region key to a palette key in `PALS` (`day, fen, night, ash, wood, cave, mine, keep`). `LOC` maps mission id to a map node. `completeMission()` grants XP, gold, one guaranteed item and sets `G.loc`.

### World map (60_ui.js)
`NODES[id] = {n,x,y,t(icon type),lock?,d}` in a 360x470 SVG space. `EDGES = [{a,b,n,d(days),c:[ctrlX,ctrlY],open:()=>bool,why}]`. `findPath(from,to)` is a BFS over open edges. Add a road or place by editing these two tables; add missions by setting `loc`.

## 6. How to add things

| Task | Do this |
| --- | --- |
| New main mission | Append to `MISSIONS` with `req` of the previous one, set `loc` (add to `LOC` if not in the object), remove its title from `STUBS` |
| New side quest or dungeon | Same, with `type`, `after`, `loc`; dungeons use a `reg` with an env palette |
| New enemy | Add to `EN`; for humans give `h:1`, `w`, and `sp` options |
| New outfit | Add to `OUTFITS` with a rarity `r`; nothing else needed |
| New skill | Add to `SK`; add `fx` for passives, wire abilities in `abilityId/useAbility` |
| New place or road | Add to `NODES` / `EDGES` in 60_ui.js and an icon case in `nodeIcon` |
| New environment | Add a palette with `env`, then a branch in `buildEnvLayers` |
| New palette (daytime style) | Add to `PALS` with the standard keys (see `day`) |

## 7. Compatibility rules (keep the game running everywhere)

- No optional chaining (`?.`), no `??`, no CSS `inset`, no dependency on `aspect-ratio` alone (a `min-height` fallback exists). The game must start inside a **sandboxed iframe** and with `localStorage` blocked (`tests/boot.js` checks both).
- All storage calls are wrapped in try/catch. Audio starts only after a user gesture.
- The page shows a visible "Loading..." screen and prints startup errors on screen via `window.onerror`; if the user reports "stuck on loading", ask for that message.
- `viewport-fit=cover` is used together with `env(safe-area-inset-*)` padding.

## 8. Testing

Install once: `npm i -D playwright && npx playwright install chromium`. Then:
- `node tests/smoke.js` loads the title and starts the prologue.
- `node tests/boot.js` checks normal load, blocked storage and sandboxed iframe.
- `node tests/bot.js` plays all 21 missions with a bot and fails on any page error.
- `play.js`, `ui.js`, `map.js`, `dng.js`, `npcs.js`, `env.js` write screenshots to `/tmp/shots` for visual review. `window.__G` exposes state and helpers for tests.

Always run the bot after changing story, combat or UI code, and look at screenshots after changing art.

## 9. Open work (priority order)

1. **Make the compass matter mechanically:** Dawn/Dusk empowerment at the tier thresholds, companion reactions that change availability, gated dialogue lines.
2. **Faction standing meters** (Order, Collegium, Hammerguilds, Marshkin, Regency) driven by choices.
3. **Act II** missions 13-28 with the refugee camp hub, the reveal in M14, faction envoys and the two-of-four alliance lock at M26. Unlock the locked roads on the map as they come in.
4. **Companions that fight** and a party UI.
5. **Real-phone pass:** touch comfort, button sizes, performance on older phones, safe areas.
6. Hearthmoor "burned" visual state after M10; random travel encounters; day counter effects.
7. New Game+ "Crowned Mode", hidden sixth ending, Act III.
8. Music and better sound effects; a settings menu (volume, left-handed controls).
9. More outfits and a dye system (data only).

## 10. Periodic handoff protocol (Claude <-> ChatGPT)

**Before switching assistants (the one leaving does this):**
1. Make sure `index.html` is built from `src/` (`sh tools/build.sh`) and the bot test passes.
2. Update section 3 (Current state) and section 9 (Open work) in this file, and add an entry to `CHANGELOG.md`.
3. Run `sh tools/make-handoff-bundle.sh`. It writes `handoff-bundle.md` (this file + story bible + every source file).
4. Commit and push to GitHub (the repo is the source of truth).

**Starting in the other assistant:**
1. Upload `handoff-bundle.md` (or paste it) and send the message in `CHATGPT_KICKOFF.md`.
2. Ask for work in small steps. The assistant should return **complete replacement contents for each changed file in `src/`** (or a clear patch), plus any new test.

**Handing back (the assistant that did the work ends with this block):**
```
HANDOFF UPDATE
Version: x.y.z
Changed files: src/...
What changed: ...
New decisions from the owner: ...
Known issues introduced or found: ...
Next suggested steps: ...
```
Paste that block into the next session and into `CHANGELOG.md`.

## 11. Conventions

- Dialogue: short lines, one highlighted word per `*...*`, narration with `N('...')`, speech with `L('Name','...')`. Characters say "Ser Corin" only after M9.
- Compass deltas: small (+/-4 to 6) for minor choices, +/-10 to 15 for major ones. Both ends must stay powerful and playable.
- Keep each mission to roughly 3-6 steps; side quests have exactly one real choice.
- Do not add dependencies. Keep the game one HTML file. Keep code compatible with older iOS Safari (see section 7).
- Prefer data over code: new content should be additions to the tables above, not new logic.

## 12. Links

- Hosted copy of the game: the claude.ai artifact published from `index.html` (ask the owner for the current link; republish after each release).
- Story bible (claude.ai doc, same content as `docs/STORY_BIBLE.md`): https://claude.ai/artifact/1j8tzvdqXUggP3kD6tBDvM
- StackBlitz (after the repo exists on GitHub): `https://stackblitz.com/github/<owner>/<repo>` opens the repo directly.
