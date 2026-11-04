// Syntax-check every inline <script> of the built index.html and make sure no optional chaining
// slipped in (the game targets older iPhone Safari). Usage: node tools/check_syntax.js
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { console.error('no inline scripts found'); process.exit(1); }
let bad = 0;
scripts.forEach((code, i) => {
  const f = path.join(os.tmpdir(), 'hc_syntax_' + process.pid + '_' + i + '.js'); fs.writeFileSync(f, code);
  const r = cp.spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status !== 0) { bad++; console.error('SYNTAX ERROR in script #' + i + '\n' + r.stderr); } else console.log('script #' + i + ' (' + code.length + ' chars): syntax ok');
  if (/\?\.[A-Za-z_$\[(]/.test(code.replace(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g, ''))) { bad++; console.error('script #' + i + ' appears to use optional chaining'); }
  fs.unlinkSync(f);
});
process.exit(bad ? 1 : 0);
