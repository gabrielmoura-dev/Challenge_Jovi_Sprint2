// Captura evidências visuais das telas corrigidas (390x844, como no celular).
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.JOVI_BROWSER || 'C:/Program Files (x86)/Microsoft/EdgeCore/153.0.4234.32/msedge.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  fs.mkdirSync('docs/evidence', { recursive: true });
  const shots = [
    ['tela-06-galeria.html', 'gallery.png', null],
    ['tela-06-galeria.html', 'gallery-sheet.png', async () => { await page.getByRole('button', { name: /criar álbum/i }).click(); await page.waitForTimeout(350); }],
    ['tela-07-modo-esporte.html', 'camera-sport.png', null],
    ['tela-08-camera-estudo.html', 'camera-study.png', null],
    ['tela-12-camera.html', 'camera-12.png', null],
    ['tela-12-camera.html?modo=video', 'camera-12-video.png', null],
    ['tela-13-camera.html', 'camera-13.png', null],
    ['tela-14-camera-viewfinder.html', 'camera-14.png', null],
    ['tela-09-selecao-fotos-ia.html', 'camera-09.png', null],
    ['tela-34-modo-blindagem.html', 'blindagem-34.png', null]
  ];
  for (const [route, file, action] of shots) {
    await page.goto('http://127.0.0.1:4173/telas/' + route);
    await page.waitForTimeout(400);
    if (action) await action();
    await page.screenshot({ path: 'docs/evidence/' + file, fullPage: true });
    console.log('saved', file);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
