const { test, expect } = require('@playwright/test');

test('gallery sheet stays inside the phone and creates an album', async ({ page }) => {
  await page.goto('/telas/tela-06-galeria.html');
  await page.getByRole('button', { name: /criar álbum/i }).click();
  const frame = page.locator('.app-frame');
  const sheet = page.locator('#sheet-criar-album');
  await expect(sheet).toBeVisible();
  const [frameBox, sheetBox] = await Promise.all([frame.boundingBox(), sheet.boundingBox()]);
  expect(sheetBox.x).toBeGreaterThanOrEqual(frameBox.x);
  expect(sheetBox.x + sheetBox.width).toBeLessThanOrEqual(frameBox.x + frameBox.width + 1);
  await page.getByLabel(/nome do álbum/i).fill('Viagem');
  await page.getByRole('button', { name: /^criar$/i }).click();
  await expect(page.getByText('Álbum “Viagem” criado')).toBeVisible();
});

test('camera modes use canonical order and navigate', async ({ page }) => {
  await page.goto('/telas/tela-12-camera.html');
  const modes = page.locator('[data-camera-modes] button');
  await expect(modes).toHaveText(['Blindagem', 'Estudo', 'Esporte', 'Foto', 'Retrato', 'Vídeo']);
  await modes.filter({ hasText: 'Esporte' }).click();
  await expect(page).toHaveURL(/tela-07-modo-esporte/);
});
