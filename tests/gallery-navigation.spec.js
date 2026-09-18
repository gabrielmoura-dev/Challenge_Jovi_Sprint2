const { test, expect } = require('@playwright/test');

test('gallery navigation has working destinations and an active gallery', async ({ page }) => {
  const routes = { 'Início': 'tela-05-inicio.html', 'Nova foto': 'tela-13-camera.html', 'Estudo': 'tela-22-estudo.html', 'Configurações': 'tela-17-ajustes.html' };
  for (const [name, route] of Object.entries(routes)) {
    await page.goto('/telas/tela-06-galeria.html');
    await expect(page.getByRole('button', { name: 'Galeria', exact: true })).toHaveAttribute('aria-current', 'page');
    await page.getByRole('navigation').getByRole('button', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(route.replaceAll('.', '\\.')));
  }
});
