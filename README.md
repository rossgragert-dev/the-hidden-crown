# The Hidden Crown

> **Current Claude development handoff (Nov 1, 2026):** [Horse / environment art + reusable jousting engine](docs/CLAUDE_HANDOFF_V0_6_1_VISUAL_JOUST.md). Start from the public branch `feature/claude-v061-visuals-joust`, which inherits the playable v0.6.0 squire platformer. This is a **handoff-only** branch until implementation begins; `main` is preserved.

A medieval fantasy mobile action RPG in a single HTML file. A squire becomes a knight, then discovers he is the lost heir. Choose between a benevolent and a monstrous reign.

## Play it

- **Open `index.html`** in a browser (best on a phone; works in portrait and landscape).
- **StackBlitz:** https://stackblitz.com/github/rossgragert-dev/the-hidden-crown, or create a new StackBlitz/CodeSandbox HTML project and paste the contents of `index.html`.
- **GitHub Pages:** if this repo is public, enable Pages (Settings > Pages > deploy from `main`, root) and open the page URL.

Progress saves in the browser (localStorage). If a viewer blocks storage, the game still runs but will not save.

## Develop

```
sh tools/build.sh      # builds index.html from src/
npm i -D playwright && npx playwright install chromium
node tests/bot.js      # plays every mission end to end
```

Start with `HANDOFF.md` (architecture, schemas, rules, open work) and `docs/STORY_BIBLE.md` (story and systems). `CHATGPT_KICKOFF.md` and `tools/make-handoff-bundle.sh` support moving work between AI assistants.
