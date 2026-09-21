// Read-only audit of every prototype route, including local requests and console errors.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.JOVI_BROWSER || undefined, headless: true });
  const results = [];
  for (const width of [1280, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 960 } });
    const page = await context.newPage();
    // External CDN failures are recorded separately; local failures remain failures.
    for (const file of fs.readdirSync('telas').filter(file => file.endsWith('.html'))) {
      const errors = [], failed = [];
      const onError = error => errors.push(error.message);
      const onResponse = response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); };
      const onFailed = request => failed.push({ url: request.url(), error: request.failure()?.errorText });
      page.on('pageerror', onError); page.on('response', onResponse); page.on('requestfailed', onFailed);
      await page.goto('http://127.0.0.1:4173/telas/' + file, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      const layout = await page.evaluate(() => {
        const selector = '.app-frame, .phone-frame, .lacar-phone-frame, .onboarding-screen, .tela03-screen';
        const frame = document.querySelector(selector);
        const rect = frame?.getBoundingClientRect();
        const visible = element => { const r = element.getBoundingClientRect(); const css = getComputedStyle(element); return r.width > 0 && r.height > 0 && css.visibility !== 'hidden' && css.display !== 'none'; };
        return {
          frame: rect?.toJSON(),
          overflow: document.documentElement.scrollWidth > innerWidth,
          externalControls: Array.from(document.querySelectorAll('a, button, input')).filter(el => !el.closest(selector) && visible(el)).map(el => el.textContent.trim() || el.getAttribute('aria-label')),
          presentationNodes: document.querySelectorAll('.theme-toggle, .jovi-story-rail').length,
          modes: Array.from(document.querySelectorAll('[data-camera-modes] button')).map(el => el.textContent.trim()),
          localImagesMissing: Array.from(document.images).filter(img => img.src.startsWith(location.origin) && (!img.complete || !img.naturalWidth)).map(img => img.getAttribute('src'))
        };
      });
      results.push({ file, width, ...layout, errors, failed });
      page.off('pageerror', onError); page.off('response', onResponse); page.off('requestfailed', onFailed);
      console.log(width, file, JSON.stringify({ overflow: layout.overflow, external: layout.externalControls, errors, missing: layout.localImagesMissing }));
    }
    await context.close();
  }
  await browser.close();
  fs.mkdirSync('docs/evidence', { recursive: true });
  fs.writeFileSync(path.join('docs/evidence', 'browser-audit.json'), JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
