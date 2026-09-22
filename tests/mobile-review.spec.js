const { test, expect } = require('@playwright/test');

const boxOf = (page, sel) => page.locator(sel).first().boundingBox();

for (const [w, h] of [[360, 640], [360, 740], [390, 844]]) {
  test.describe(`revisão mobile ${w}x${h}`, () => {
    test.use({ viewport: { width: w, height: h } });

    test('tela 13: obturador e botões laterais visíveis', async ({ page }) => {
      await page.goto('/telas/tela-13-camera.html');
      for (const sel of ['.camera-shutter', '[data-camera-side] >> nth=0', '[data-camera-side] >> nth=1']) {
        const box = await boxOf(page, sel);
        expect(box.y + box.height).toBeLessThanOrEqual(h);
      }
    });

    test('tela 03: botão Começar não encosta nos cards', async ({ page }) => {
      await page.goto('/telas/tela-03-preferencias.html');
      const grid = await boxOf(page, '.tela03-grid');
      const btn = await boxOf(page, '.tela03-btn-primary');
      expect(btn.y - (grid.y + grid.height)).toBeGreaterThanOrEqual(16);
    });

    test('tela 05: cards não encostam na nav inferior', async ({ page }) => {
      await page.goto('/telas/tela-05-inicio.html');
      const cards = page.locator('.home-card');
      const last = await cards.nth(3).boundingBox();
      const nav = await boxOf(page, '.lacar-nav-bottom');
      expect(nav.y - (last.y + last.height)).toBeGreaterThanOrEqual(8);
    });

    test('telas 02, 03 e 20: voltar não cobre o horário', async ({ page }) => {
      for (const [rota, back, hora] of [
        ['tela-02-nome', '.jovi-back', '.status-time'],
        ['tela-03-preferencias', '.tela03-back', '.status-time'],
        ['tela-20-modo-farol-ativacao', '.jovi-back', '.lock-status span'],
      ]) {
        await page.goto(`/telas/${rota}.html`);
        const b = await boxOf(page, back);
        const t = await boxOf(page, hora);
        expect(b.y).toBeGreaterThanOrEqual(t.y + t.height);
      }
    });
  });
}

test.describe('fluxos', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('palestra: 08 → 14 → gravar/parar → 15 → 16', async ({ page }) => {
    await page.goto('/telas/tela-08-camera-estudo.html');
    await page.click('[data-intent=palestra]');
    await page.click('[data-camera-shutter]');
    await expect(page).toHaveURL(/tela-14-camera-viewfinder/);
    await page.click('[data-camera-shutter]');
    await expect(page).toHaveURL(/tela-14-camera-viewfinder/);
    await page.click('[data-camera-shutter]');
    await expect(page).toHaveURL(/tela-15-visualizador-midia/);
    await page.click('[aria-label="Transcrição por voz"]');
    await expect(page).toHaveURL(/tela-16-configuracao-traducao/);
  });

  test('tela 20: voltar leva à 19 mesmo depois de passar pela 21', async ({ page }) => {
    await page.goto('/telas/tela-19-modo-farol-configurar.html');
    await page.goto('/telas/tela-20-modo-farol-ativacao.html');
    await page.evaluate(() => { window.location.href = 'tela-21-modo-farol-contato.html'; });
    await page.waitForURL(/tela-21/);
    await page.click('.farol25-back');
    await page.waitForURL(/tela-20/);
    await page.click('.jovi-back');
    await expect(page).toHaveURL(/tela-19-modo-farol-configurar/);
  });

  test('tela 22: botão de câmera vai para a câmera de estudo (08)', async ({ page }) => {
    await page.goto('/telas/tela-22-estudo.html');
    await page.click('.lacar-nav-fab');
    await expect(page).toHaveURL(/tela-08-camera-estudo/);
  });
});
