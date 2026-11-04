# Tests

Playwright scripts that drive the built game (`../index.html`) in headless Chromium.

Setup: `npm i -D playwright && npx playwright install chromium`, then `mkdir -p /tmp/shots`.

| Script | What it does |
| --- | --- |
| `smoke.js` | Loads the title, starts a new game, checks for page errors |
| `boot.js` | Checks normal load, blocked localStorage and a sandboxed iframe |
| `run_all.js` | `npm test` / `npm run test:ci`: runs the fast regression list below sequentially with a summary |
| `save.js` | v0.7.1 save system: legacy and squire-era saves, export/import round trip, malformed data, corrupt-save backup, New Game confirmation, blocked/quota storage |
| `layout.js` | v0.7.1 control/HUD geometry in iPhone portrait/landscape, small phones and desktop (`STRICT=1` asserts) |
| `riding.js` | Holding forward walks, trots and canters; the canter lesson needs a sustained canter |
| `jump_consistency.js` | Airborne hero avoids ground hits identically in flat missions and the adventure engine |
| `fixes.js` | Weapon carry-over, Halvard's line, results label, Dusk/Dawn casting leaves the compass alone |
| `golden_path.js <w> <h> <tag>` | The seven chapters played to the results screen through the on-screen buttons only (`SHOTS=dir` for screenshots) |
| `bot.js` | Plays all 21 missions with a bot (teleports to beats, clears waves, clicks choices). Fails on any page error |
| `play.js [land]` | Older prologue/mission 1 screenshot run (superseded by `golden_path.js`) |
| `ui.js` | Board/bag/skills/brief screens and abilities, with screenshots |
| `map.js` | World map, travel, locked road, outfit equip, with screenshots |
| `dng.js`, `env.js`, `npcs.js` | Screenshots of dungeons/environments and NPC sprites |

The game exposes `window.__G` (state and helpers such as `startMission`, `openBoard`, `genItem`, `ACT`) for these scripts. Update the mission id list in `bot.js` whenever missions are added.
