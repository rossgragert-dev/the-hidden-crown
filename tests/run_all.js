// Runs the fast regression suite sequentially and prints a summary. Exit 1 if any script fails.
// (golden_path.js and bot.js are slower and run as separate CI jobs: npm run test:golden / test:bot)
const { spawnSync } = require('child_process'); const path = require('path');
const LIST = ['smoke', 'boot', 'save', 'layout', 'riding', 'jump_consistency', 'fixes', 'adventure', 'magic_paths', 'opening_platforms', 'grounding', 'squire', 'polish', 'world', 'pixel_art', 'quest', 'zoom', 'joust', 'lab', 'art_pass', 'combat'];
let failed = [];
for (const t of LIST) {
  const t0 = Date.now(); const env = Object.assign({}, process.env, t === 'layout' ? { STRICT: '1' } : {});
  const r = spawnSync(process.execPath, [path.join(__dirname, t + '.js')], { encoding: 'utf8', env, timeout: 600000 });
  const ok = r.status === 0; console.log((ok ? 'PASS ' : 'FAIL ') + t + ' (' + ((Date.now() - t0) / 1000).toFixed(0) + 's)');
  if (!ok) { failed.push(t); console.log((r.stdout || '').split('\n').slice(-15).join('\n')); console.log((r.stderr || '').split('\n').slice(-15).join('\n')); }
}
console.log(failed.length ? 'FAILED: ' + failed.join(', ') : 'ALL ' + LIST.length + ' SCRIPTS PASSED'); process.exit(failed.length ? 1 : 0);
