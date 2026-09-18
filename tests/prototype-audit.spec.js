const { test, expect } = require('@playwright/test');

const cameraRoutes = [
  ['tela-12-camera.html', 'camera-12.png'],
  ['tela-13-camera.html', 'camera-13.png'],
  ['tela-07-modo-esporte.html', 'camera-sport.png'],
  ['tela-08-camera-estudo.html', 'camera-study.png']
];

test('camera entries keep their controls inside a narrow phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route] of cameraRoutes) {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/telas/' + route);
    await expect(page.locator('[data-camera-modes]')).toBeVisible();
    await expect(page.locator('.theme-toggle')).toHaveCount(0);
    expect(errors).toEqual([]);
  }
});

test('gallery sheet is contained during its opening transition', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/telas/tela-06-galeria.html');
  await page.getByRole('button', { name: /criar álbum/i }).click();
  await page.waitForTimeout(80);
  const [phone, sheet] = await Promise.all([page.locator('.app-frame').boundingBox(), page.locator('#sheet-criar-album').boundingBox()]);
  expect(sheet.x).toBeGreaterThanOrEqual(phone.x);
  expect(sheet.x + sheet.width).toBeLessThanOrEqual(phone.x + phone.width + 1);
  expect(sheet.y).toBeGreaterThanOrEqual(phone.y);
  expect(sheet.y + sheet.height).toBeLessThanOrEqual(phone.y + phone.height + 1);
});

test('toasts render inside the phone frame on every frame family', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, frame] of [['tela-12-camera.html', '.app-frame'], ['tela-13-camera.html', '.phone-frame'], ['tela-08-camera-estudo.html', '.lacar-phone-frame']]) {
    await page.goto('/telas/' + route);
    await page.evaluate(() => window.JoviToast.show('Teste'));
    const toast = page.locator('.jovi-toast');
    await expect(toast).toBeVisible();
    await page.waitForTimeout(200);
    const [phone, box] = await Promise.all([page.locator(frame).boundingBox(), toast.boundingBox()]);
    expect(box, route).toBeTruthy();
    expect(box.x, route).toBeGreaterThanOrEqual(phone.x);
    expect(box.x + box.width, route).toBeLessThanOrEqual(phone.x + phone.width + 1);
    expect(box.y, route).toBeGreaterThanOrEqual(phone.y);
    expect(box.y + box.height, route).toBeLessThanOrEqual(phone.y + phone.height + 1);
  }
});
