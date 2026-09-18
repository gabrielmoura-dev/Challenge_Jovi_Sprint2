module.exports = {
  testDir: './tests',
  timeout: 15000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true,
    launchOptions: { executablePath: process.env.JOVI_BROWSER || 'C:/Program Files (x86)/Microsoft/EdgeCore/153.0.4234.32/msedge.exe' },
    screenshot: 'only-on-failure'
  },
  webServer: { command: 'node node_modules/http-server/bin/http-server . -p 4173 -c-1', port: 4173, reuseExistingServer: true }
};
