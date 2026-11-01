const { chromium } = require('playwright');
(async () => {
  const out = '/tmp/shots';
  const browser = await chromium.launch();
  const errs = [];
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(require('url').pathToFileURL(require('path').resolve(__dirname,'..','index.html')).href);
  await page.waitForTimeout(600);
  await page.screenshot({ path: out + '/a-title.png' });
  await page.click('#bnew');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out + '/b-prologue.png' });
  console.log(errs.join('\n') || 'no errors');
  await browser.close();
})();
