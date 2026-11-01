const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  // 1) normal
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href); await page.waitForTimeout(500);
  console.log('boot hidden:', await page.evaluate(() => getComputedStyle(document.getElementById('boot')).display), 'title:', await page.evaluate(() => getComputedStyle(document.getElementById('title')).display));
  // 2) storage blocked (sandboxed iframe style)
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } }); });
  page.on('pageerror', e => errs.push('blocked-storage: ' + e.message));
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href); await page.waitForTimeout(500);
  console.log('storage-blocked title:', await page.evaluate(() => getComputedStyle(document.getElementById('title')).display));
  await page.click('#bnew'); await page.waitForTimeout(800);
  console.log('storage-blocked mode:', await page.evaluate(() => window.__G.S.mode));
  // 3) inside a sandboxed iframe like an artifact viewer
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  page.on('pageerror', e => errs.push('iframe: ' + e.message));
  const fs = require('fs'); const html = fs.readFileSync('/home/claude/game/hidden-crown.html', 'utf8');
  await page.setContent('<iframe id="f" sandbox="allow-scripts" style="width:390px;height:844px;border:0"></iframe>');
  await page.evaluate(h => { document.getElementById('f').srcdoc = h; }, html);
  await page.waitForTimeout(1200);
  const fr = page.frames()[1];
  console.log('iframe title:', await fr.evaluate(() => getComputedStyle(document.getElementById('title')).display));
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
