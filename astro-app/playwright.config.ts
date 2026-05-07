import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  use: {
    baseURL: 'http://localhost:4321',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      threshold: 0.01,
      maxDiffPixelRatio: 0.01,
    },
  },
  webServer: {
    command: 'pnpm preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
