// Usa o Chromium que o próprio Playwright instala (`npx playwright install chromium`).
// Para usar outro navegador, defina JOVI_BROWSER com o caminho do executável.
const executablePath = process.env.JOVI_BROWSER || undefined;

module.exports = {
  testDir: './tests',
  timeout: 15000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'node node_modules/http-server/bin/http-server . -p 4173 -c-1',
    port: 4173,
    reuseExistingServer: true
  }
};
