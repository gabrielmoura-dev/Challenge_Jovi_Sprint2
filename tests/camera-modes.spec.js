// Requisitos 3, 4/5, 6 e 7 — seletor global de modos, barras opacas e
// intenções do modo Estudo.
const { test, expect } = require('@playwright/test');

const ORDER = ['Blindagem', 'Estudo', 'Esporte', 'Foto', 'Retrato', 'Vídeo'];
const DEST = {
  Blindagem: /tela-34-modo-blindagem\.html/,
  Estudo: /tela-08-camera-estudo\.html/,
  Esporte: /tela-07-modo-esporte\.html/,
  Foto: /tela-12-camera\.html(?!\?modo=video)/,
  Retrato: /tela-13-camera\.html/,
  Vídeo: /tela-12-camera\.html\?modo=video/
};
const CAMERAS = [
  ['tela-07-modo-esporte.html', 'Esporte'],
  ['tela-08-camera-estudo.html', 'Estudo'],
  ['tela-12-camera.html', 'Foto'],
  ['tela-12-camera.html?modo=video', 'Vídeo'],
  ['tela-13-camera.html', 'Retrato'],
  ['tela-14-camera-viewfinder.html', 'Estudo'],
  ['tela-09-selecao-fotos-ia.html', 'Estudo'],
  ['tela-34-modo-blindagem.html', 'Blindagem']
];

for (const [route, active] of CAMERAS) {
  test(`${route}: ordem canônica, modo ativo "${active}" e navegação`, async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/telas/' + route);
    const strip = page.locator('[data-camera-modes]');
    const modes = strip.locator('[data-camera-mode]');
    await expect(modes).toHaveText(ORDER);
    await expect(strip.locator('.is-active')).toHaveText(active);
    await expect(strip.locator('[aria-pressed="true"]')).toHaveCount(1);
    // O modo ativo precisa estar visível dentro da faixa (sem cortes).
    const [s, a] = await Promise.all([strip.boundingBox(), strip.locator('.is-active').boundingBox()]);
    expect(a.x).toBeGreaterThanOrEqual(s.x - 1);
    expect(a.x + a.width).toBeLessThanOrEqual(s.x + s.width + 1);
    // Sem overflow da página e sem rótulo espremido.
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    for (const label of ORDER) {
      const b = strip.locator('[data-camera-mode]', { hasText: label });
      expect(await b.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    }
    // Cada modo navega para o destino correto (o ativo não recarrega).
    for (const label of ORDER) {
      if (label === active) continue;
      await page.goto('/telas/' + route);
      await page.locator('[data-camera-modes] [data-camera-mode]', { hasText: label }).click();
      await expect(page).toHaveURL(DEST[label]);
    }
  });
}

test('tela-12 em modo Vídeo troca o obturador para gravação', async ({ page }) => {
  await page.goto('/telas/tela-12-camera.html?modo=video');
  const shutter = page.locator('[data-camera-shutter]');
  await expect(shutter).toHaveAttribute('aria-label', /gravar/i);
  await expect(shutter).toHaveClass(/is-video/);
  await shutter.click();
  await expect(page.locator('.jovi-toast')).toContainText(/víd/i);
  await page.goto('/telas/tela-12-camera.html');
  await expect(shutter).toHaveAttribute('aria-label', /tirar foto/i);
});

test('faixa de modos rola na horizontal com teclado, roda do mouse e arraste', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/telas/tela-07-modo-esporte.html');
  const strip = page.locator('[data-camera-modes]');
  expect(await strip.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await strip.locator('[data-camera-mode]').first().focus();
  await page.keyboard.press('End');
  await expect(strip.locator('[data-camera-mode]').last()).toBeFocused();
  expect(await strip.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await strip.evaluate(el => { el.scrollLeft = 0; });
  await strip.hover();
  await page.mouse.wheel(0, 120);
  await expect.poll(() => strip.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await strip.evaluate(el => { el.scrollLeft = 0; });
  const box = await strip.boundingBox();
  await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => strip.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  // O arraste não deve ter navegado.
  await expect(page).toHaveURL(/tela-07-modo-esporte/);
});

test('barras inferiores e botões laterais são opacos e iguais em todos os modos', async ({ page }) => {
  test.setTimeout(60000);
  const seen = [];
  for (const [route] of CAMERAS) {
    await page.goto('/telas/' + route);
    const info = await page.evaluate(() => {
      const bar = document.querySelector('[data-camera-bar]');
      const side = document.querySelector('[data-camera-side]');
      const cs = el => { const c = getComputedStyle(el); return { bg: c.backgroundColor, blur: c.backdropFilter || 'none', border: c.borderTopColor }; };
      return { bar: cs(bar), side: cs(side) };
    });
    seen.push(info);
  }
  for (const s of seen) {
    expect(s.bar.blur).toBe('none');
    expect(s.side.blur).toBe('none');
    expect(s.bar.bg).toBe(seen[0].bar.bg);
    expect(s.side.bg).toBe(seen[0].side.bg);
    expect(/rgba?\((\d+), (\d+), (\d+)(, 1)?\)/.test(s.bar.bg)).toBe(true);
  }
});

test('modo Estudo oferece Chat, Palestra e Exercício com ação própria', async ({ page }) => {
  await page.goto('/telas/tela-08-camera-estudo.html');
  const intents = page.locator('[data-study-intent] button');
  await expect(intents).toHaveText(['Chat', 'Palestra', 'Exercício']);
  await expect(page.locator('[data-study-intent] .is-active')).toHaveText('Chat');
  await intents.nth(2).click();
  await expect(page.locator('[data-study-intent] .is-active')).toHaveText('Exercício');
  await expect(page.locator('[data-study-intent-label]')).toContainText(/exerc/i);
  await expect(page.locator('[data-camera-shutter]')).toHaveAttribute('aria-label', /exerc/i);
  await page.reload();
  await expect(page.locator('[data-study-intent] .is-active')).toHaveText('Exercício');
  await page.locator('[data-camera-shutter]').click();
  await expect(page).toHaveURL(/tela-24-estudo-tentativa/);
  await page.goto('/telas/tela-08-camera-estudo.html');
  await intents.nth(1).click();
  await page.locator('[data-camera-shutter]').click();
  await expect(page).toHaveURL(/tela-14-camera-viewfinder/);
  await page.goto('/telas/tela-08-camera-estudo.html');
  await intents.nth(0).click();
  await page.locator('[data-camera-shutter]').click();
  await expect(page).toHaveURL(/tela-09-selecao-fotos-ia/);
  // Tela de câmera fora do Estudo não mostra as intenções.
  await page.goto('/telas/tela-13-camera.html');
  await expect(page.locator('[data-study-intent]')).toHaveCount(0);
});
