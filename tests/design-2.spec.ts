import { expect, test } from '@playwright/test';
import { loadReady } from './helpers';

const PATH = '/design-2';
const options = { maxDiffPixelRatio: 0.01, scale: 'device' as const };

const viewports = [
  { name: 'desktop-1280', width: 1280, height: 900, scale: 1 },
  { name: 'desktop-1440', width: 1440, height: 900, scale: 1 },
  { name: 'tablet-768', width: 768, height: 1024, scale: 1 },
  { name: 'mobile-390', width: 390, height: 844, scale: 2 },
];

for (const v of viewports) {
  test.describe(v.name, () => {
    test.use({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.scale });

    test('full page', async ({ page }) => {
      await loadReady(page, PATH);
      await expect(page).toHaveScreenshot(`${v.name}.png`, { ...options, fullPage: true });
    });

    test('above the fold', async ({ page }) => {
      await loadReady(page, PATH);
      await expect(page).toHaveScreenshot(`${v.name}-fold.png`, options);
    });

    if (v.width < 768) {
      test('menu open', async ({ page }) => {
        await loadReady(page, PATH);
        await page.getByRole('button', { name: 'Menü öffnen' }).click();
        await expect(page).toHaveScreenshot(`${v.name}-menu-open.png`, options);
      });
    }
  });
}

for (const width of [320, 360, 375, 390, 414, 600, 768, 900, 1024, 1100, 1280, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await loadReady(page, PATH);
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    }));
    expect(sizes.scroll).toBe(sizes.inner);
  });
}

test.describe('spot checks at 1280', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page, PATH);
    const logo = (await page.locator('header img[src*="logo"]').boundingBox())!;
    expect([Math.round(logo.x), logo.y, Math.round(logo.width), logo.height]).toEqual([54, 28, 209, 56]);
    expect(Math.round((await page.locator('h1').boundingBox())!.y)).toBe(552);
    expect((await page.locator('header#top').boundingBox())!.height).toBe(800);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(3091);
    await expect(page.locator('h1')).toHaveCount(1);
  });
});

test.describe('spot checks at 390', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page, PATH);
    const logo = (await page.locator('header img[src*="logo"]').boundingBox())!;
    expect([Math.round(logo.x), logo.y, Math.round(logo.width), logo.height]).toEqual([17, 20, 149, 40]);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(3576);
  });
});

test.describe('menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('focus, trap, Escape and scroll lock', async ({ page }) => {
    await loadReady(page, PATH);
    const open = page.getByRole('button', { name: 'Menü öffnen' });
    await open.click();
    const close = page.getByRole('button', { name: 'Menü schliessen' });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu a').first()).toBeFocused();
    await expect(page.locator('body')).toHaveCSS('overflow-y', 'hidden');

    for (let i = 0; i < 16; i += 1) {
      await page.keyboard.press(i % 5 === 4 ? 'Shift+Tab' : 'Tab');
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest('#menu, button[aria-controls="menu"]'),
      );
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(open).toBeFocused();
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow-y', 'hidden');
  });

  test('takes focus with animations on as well', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: 'http://localhost:3100',
      viewport: { width: 390, height: 844 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(PATH);
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    await expect(page.locator('#menu a').first()).toBeFocused();
    await context.close();
  });

  test('closes when the window grows past the phone breakpoint', async ({ page }) => {
    await loadReady(page, PATH);
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    await page.setViewportSize({ width: 1024, height: 844 });
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow-y', 'hidden');
    await expect(page.locator('header nav a', { hasText: 'Kontakt' })).toBeVisible();
  });

  test('a link closes it and scrolls to the section', async ({ page }) => {
    await loadReady(page, PATH);
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    await page.locator('#menu a', { hasText: 'Werte' }).click();
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page).toHaveURL(/#werte$/);
    await expect
      .poll(async () => Math.round((await page.locator('#werte').boundingBox())!.y))
      .toBe(24);
  });

  test('all tap targets are at least 44px tall', async ({ page }) => {
    await loadReady(page, PATH);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('a, button')]
        .filter((el) => el.offsetParent !== null && !el.closest('#menu'))
        .filter((el) => {
          const after = parseFloat(getComputedStyle(el, '::after').height) || 0;
          return Math.round(Math.max(el.getBoundingClientRect().height, after)) < 44;
        })
        .map((el) => el.textContent),
    );
    expect(small).toEqual([]);
  });
});

test.describe('keyboard and network', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('reaches every link with a visible focus ring', async ({ page }) => {
    await loadReady(page, PATH);
    const expected = await page.locator('a:visible, button:visible').count();
    const seen = new Set<string>();
    for (let i = 0; i < expected; i += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const style = getComputedStyle(el);
        return {
          key: `${el.tagName}|${el.getAttribute('href')}|${el.textContent}`,
          outline: style.outlineStyle,
          width: style.outlineWidth,
        };
      });
      expect(focus.outline).toBe('solid');
      expect(focus.width).toBe('2px');
      seen.add(focus.key);
    }
    expect(seen.size).toBe(expected);
  });

  for (const path of [PATH, `${PATH}/impressum`, `${PATH}/datenschutz`]) {
    test(`no external requests on ${path}`, async ({ page }) => {
      const external: string[] = [];
      page.on('request', (req) => {
        const url = new URL(req.url());
        if (url.hostname !== 'localhost' && url.protocol.startsWith('http')) external.push(req.url());
      });
      await loadReady(page, path);
      expect(external).toEqual([]);
    });
  }

  test('legal stubs have the dark logo, the footer and link back', async ({ page }) => {
    await page.goto(PATH);
    await page.getByRole('link', { name: 'Impressum' }).click();
    await expect(page).toHaveURL(/\/design-2\/impressum$/);
    await expect(page.locator('h1')).toHaveText('Impressum');
    await expect(page.locator('main')).toContainText('Inhalt folgt.');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('header img')).toHaveCSS('height', '44px');
    await page.locator('header a').click();
    await expect(page).toHaveURL(/\/design-2$/);
  });
});
