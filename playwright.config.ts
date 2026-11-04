import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  // Baselines are the design reference. They must never be overwritten by a test run.
  snapshotPathTemplate: 'reference/screenshots/{arg}{ext}',
  updateSnapshots: 'none',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3100', reducedMotion: 'reduce' },
  projects: [
    { name: 'design-1', testIgnore: /design-2/ },
    {
      name: 'design-2',
      testMatch: /design-2/,
      snapshotPathTemplate: 'reference/design-2/screenshots/{arg}{ext}',
    },
  ],
  webServer: { command: 'npx serve out -l 3100 -L', url: 'http://localhost:3100', reuseExistingServer: true },
});
