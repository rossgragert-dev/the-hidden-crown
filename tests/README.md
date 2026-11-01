# Tests

Playwright scripts that drive the built game (`../index.html`) in headless Chromium.

Setup: `npm i -D playwright && npx playwright install chromium`, then `mkdir -p /tmp/shots`.

| Script | What it does |
| --- | --- |
| `smoke.js` | Loads the title, starts a new game, checks for page errors |
| `boot.js` | Checks normal load, blocked localStorage and a sandboxed iframe |
| `bot.js` | Plays all 21 missions with a bot (teleports to beats, clears waves, clicks choices). Fails on any page error |
| `play.js [land]` | Prologue, mission 1, combat, results (portrait or landscape) with screenshots |
| `ui.js` | Board/bag/skills/brief screens and abilities, with screenshots |
| `map.js` | World map, travel, locked road, outfit equip, with screenshots |
| `dng.js`, `env.js`, `npcs.js` | Screenshots of dungeons/environments and NPC sprites |

The game exposes `window.__G` (state and helpers such as `startMission`, `openBoard`, `genItem`, `ACT`) for these scripts. Update the mission id list in `bot.js` whenever missions are added.
