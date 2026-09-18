// Requisito adicional: toda tela alcançável (exceto a primeira do onboarding,
// que não tem "anterior") precisa de um botão discreto de voltar no topo
// esquerdo. Este teste falha listando quais telas ainda não têm esse controle.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const EXCECOES = new Set(['tela-01-onboarding.html']); // primeira tela: não há "anterior"
const telas = fs.readdirSync('telas').filter(f => f.endsWith('.html') && !EXCECOES.has(f));

test('toda tela (exceto a primeira) tem um botão de voltar visível no topo esquerdo', async ({ page }) => {
  test.setTimeout(120000);
  const problemas = [];
  for (const file of telas) {
    await page.goto('/telas/' + file, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => {
      const candidatos = Array.from(document.querySelectorAll('button, a')).filter(el => {
        const rotulo = (el.getAttribute('aria-label') || '').trim();
        return /^(voltar|fechar|sair da sess[aã]o)/i.test(rotulo);
      });
      const visivel = el => {
        const r = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none';
      };
      const visiveis = candidatos.filter(visivel);
      if (!visiveis.length) return { achou: false };
      const frameSel = '.app-frame, .phone-frame, .lacar-phone-frame, .onboarding-screen, .tela03-screen';
      const frame = document.querySelector(frameSel);
      const fr = frame ? frame.getBoundingClientRect() : null;
      const el = visiveis[0];
      const r = el.getBoundingClientRect();
      return {
        achou: true,
        pertoDoTopoEsquerda: fr ? (r.left - fr.left) < 80 && (r.top - fr.top) < 80 : true
      };
    });
    if (!info.achou) problemas.push(file + ': nenhum botão de voltar encontrado');
    else if (!info.pertoDoTopoEsquerda) problemas.push(file + ': botão de voltar não está no topo esquerdo');
  }
  expect(problemas).toEqual([]);
});
