# Audit scripts (2026-11)

Scratch scripts used for `docs/THE_HIDDEN_CROWN_COMPREHENSIVE_GAME_AUDIT.md`. They only read the built `index.html`; they change nothing in the game.

Run from the repo root after `npm run build`: `NODE_PATH=$(npm root -g) node docs/evidence/audit-2026-11/scripts/<script>`.

| Script | Purpose |
| --- | --- |
| `play.js <w> <h> <tag>` | Plays chapters 1-7 through the on-screen buttons (synthetic multi-pointer events). `COMBAT=1` then fights m1. Screenshots go to `/tmp/shots/<tag>/`. |
| `verify.js` | Mounted gait/speed, platform counts, jump apex, melee-vs-jump test, control geometry/overlaps in 4 viewports, 4x CPU-throttle frame pacing per chapter. |
| `verify2.js` | Death penalty, Dusk-spam compass drift, checkpoint resume, blocked storage, brute-force combat bot on m1/m3/m5/m8. |
| `shots_flat.js` | Screenshots of m3/m8/d2 (flat missions) in both orientations. |
| `bot_fixed.js` | `tests/bot.js` with `page.$('.opt')` changed to `page.$$('.opt')`; the full 21-mission run then passes. |
