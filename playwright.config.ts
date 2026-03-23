import { defineConfig } from '@playwright/test';

const usePreviewServer = process.env.PLAYWRIGHT_USE_PREVIEW === '1';
const webServerCommand = usePreviewServer
  ? 'npm run preview -- --host 127.0.0.1 --port 4173'
  : 'npm run dev -- --host 127.0.0.1 --port 4173';

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: {
    command: webServerCommand,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI
  }
});
