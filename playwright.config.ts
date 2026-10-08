import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
  webServer: {
    command: 'python3 -m http.server 4321 --bind 127.0.0.1 --directory dist',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
