const { test, expect } = require('@playwright/test');

test('created albums persist and modal manages validation and focus', async ({ page }) => {
  await page.goto('/telas/tela-06-galeria.html');
  const open = page.locator('[data-open-sheet]');
  const sheet = page.getByRole('dialog');
  await open.click();
  const input = page.getByLabel('Nome do álbum');
  await expect(input).toBeFocused();
  await input.fill('   ');
  await expect(sheet.getByRole('button', { name: 'Criar', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await open.click();
  await input.fill('Viagem de setembro');
  await sheet.getByRole('button', { name: 'Criar', exact: true }).click();
  await expect(page.locator('[data-created-album]')).toHaveText(['Viagem de setembro']);
  await page.reload();
  await expect(page.locator('[data-created-album]')).toHaveText(['Viagem de setembro']);
  await open.click();
  await sheet.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(open).toBeFocused();
  await open.click();
  await sheet.getByRole('button', { name: 'Fechar', exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(sheet.getByRole('button', { name: 'Cancelar', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#sheet-criar-album')).toHaveAttribute('inert', '');
});
