import { expect, test } from '@playwright/test';
import { loadReady } from './helpers';

const options = { maxDiffPixelRatio: 0.01, scale: 'device' as const };

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, scale: 1, clip: 140 },
  { name: 'tablet-768', width: 768, height: 900, scale: 1, clip: 140 },
  { name: 'mobile-390', width: 390, height: 900, scale: 2, clip: 260 },
];

for (const v of viewports) {
  test.describe(v.name, () => {
    test.use({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.scale });

    test('full page', async ({ page }) => {
      await loadReady(page);
      await expect(page).toHaveScreenshot(`${v.name}.png`, { ...options, fullPage: true });
    });

    test('above the fold', async ({ page }) => {
      await loadReady(page);
      await expect(page).toHaveScreenshot(`${v.name}-fold.png`, options);
    });

    test('scrolled header', async ({ browser }) => {
      // The reference was captured with smooth scrolling. An instant jump gets a different
      // final scrollY, because scroll anchoring compensates for the header shrinking.
      const context = await browser.newContext({
        baseURL: 'http://localhost:3100',
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: v.scale,
        reducedMotion: 'no-preference',
      });
      const page = await context.newPage();
      await loadReady(page);
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(1800);
      await expect(page).toHaveScreenshot(`${v.name}-header-scrolled.png`, {
        ...options,
        clip: { x: 0, y: 0, width: v.width, height: v.clip },
      });
    });
  });
}

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

  test('open', async ({ page }) => {
    await loadReady(page);
    await page.getByRole('button', { name: 'Menü' }).click();
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot('mobile-390-menu-open.png', options);
  });
});
