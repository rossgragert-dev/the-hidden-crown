# The Hidden Crown

A medieval fantasy mobile action RPG in a single HTML file. A squire becomes a knight, then discovers he is the lost heir. Choose between a benevolent and a monstrous reign.

## Play it

- **Open `index.html`** in a browser (best on a phone; works in portrait and landscape).
- **StackBlitz:** `https://stackblitz.com/github/<owner>/<repo>` (replace with this repo's path), or create a new StackBlitz/CodeSandbox HTML project and paste the contents of `index.html`.
- **GitHub Pages:** if this repo is public, enable Pages (Settings > Pages > deploy from `main`, root) and open the page URL.

Progress saves in the browser (localStorage). If a viewer blocks storage, the game still runs but will not save.

## Develop

```
sh tools/build.sh      # builds index.html from src/
npm i -D playwright && npx playwright install chromium
node tests/bot.js      # plays every mission end to end
```

Start with `HANDOFF.md` (architecture, schemas, rules, open work) and `docs/STORY_BIBLE.md` (story and systems). `CHATGPT_KICKOFF.md` and `tools/make-handoff-bundle.sh` support moving work between AI assistants.
