// Requisito 8: nada fora do celular. Percorre todas as telas e garante que não
// existe nenhum controle de apresentação (toggle de tema, link "Telas",
// trilho da história) nem CDN externo obrigatório.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const telas = fs.readdirSync('telas').filter(f => f.endsWith('.html'));
const FRAME = '.app-frame, .phone-frame, .lacar-phone-frame, .onboarding-screen, .tela03-screen';

test('nenhuma tela contém controles fora do frame do celular', async ({ page }) => {
  test.setTimeout(120000);
  const problems = [];
  for (const file of telas) {
    const errors = [];
    const onError = e => errors.push(file + ': ' + e.message);
    page.on('pageerror', onError);
    await page.goto('/telas/' + file, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    const info = await page.evaluate((FRAME) => {
      const out = { presentation: document.querySelectorAll('.theme-toggle, [data-theme-toggle], .jovi-story-rail').length };
      out.storyScripts = Array.from(document.scripts).filter(s => /jovi-story/.test(s.src)).length;
      out.cdn = Array.from(document.querySelectorAll('link[href], script[src]')).map(el => el.href || el.src).filter(u => /jsdelivr|bootstrapcdn/.test(u));
      const visible = el => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none'; };
      out.external = Array.from(document.querySelectorAll('a, button, input, select, textarea')).filter(el => !el.closest(FRAME) && visible(el)).map(el => (el.textContent.trim() || el.getAttribute('aria-label') || el.tagName));
      out.overflow = document.documentElement.scrollWidth > innerWidth;
      return out;
    }, FRAME);
    page.off('pageerror', onError);
    if (info.presentation) problems.push(`${file}: ${info.presentation} presentation node(s)`);
    if (info.storyScripts) problems.push(`${file}: jovi-story.js still loaded`);
    if (info.cdn.length) problems.push(`${file}: CDN ${info.cdn.join(', ')}`);
    if (info.external.length) problems.push(`${file}: external controls ${JSON.stringify(info.external)}`);
    if (info.overflow) problems.push(`${file}: horizontal overflow`);
    problems.push(...errors);
  }
  expect(problems).toEqual([]);
});
