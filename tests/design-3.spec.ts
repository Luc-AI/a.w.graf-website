import { expect, test } from '@playwright/test';
import { loadReady } from './helpers';

const PATH = '/design-3';
const options = { maxDiffPixelRatio: 0.01, scale: 'device' as const };

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, scale: 1 },
  { name: 'desktop-1280', width: 1280, height: 900, scale: 1 },
  { name: 'tablet-1024', width: 1024, height: 768, scale: 1 },
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
        await page.getByRole('button', { name: 'Menü' }).click();
        await expect(page).toHaveScreenshot(`${v.name}-menu-open.png`, options);
      });
    }
  });
}

test.describe('original artboard', () => {
  test.use({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

  test('matches at 1280', async ({ page }) => {
    await loadReady(page, PATH);
    await expect(page).toHaveScreenshot('original-artboard-1280.png', { ...options, fullPage: true });
  });
});

for (const width of [320, 360, 375, 390, 414, 600, 768, 900, 1024, 1100, 1280, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await loadReady(page, PATH);
    const overflowing = await page.evaluate(() => {
      const inner = window.innerWidth;
      return {
        scroll: document.documentElement.scrollWidth - inner,
        /* The theme clips overflow, so also look for anything being cut off by that. */
        elements: [...document.querySelectorAll('main *, #kontakt *')]
          .filter((el) => el.getBoundingClientRect().right > inner + 0.5)
          .filter((el) => !el.closest('#menu'))
          .map((el) => el.tagName),
      };
    });
    expect(overflowing).toEqual({ scroll: 0, elements: [] });
  });
}

test.describe('spot checks at 1280', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page, PATH);
    const logo = (await page.locator('header img').first().boundingBox())!;
    expect([logo.x, logo.y, Math.round(logo.width), logo.height]).toEqual([64, 32, 224, 60]);
    const card = (await page.locator('#top > div').nth(1).boundingBox())!;
    expect([card.x, Math.round(card.y), card.width, Math.round(card.height)]).toEqual([64, 459, 640, 421]);
    const h1 = (await page.locator('h1').boundingBox())!;
    expect([h1.x, Math.round(h1.y)]).toEqual([120, 515]);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(3722);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('cards overlap their photos as drawn', async ({ page }) => {
    await loadReady(page, PATH);
    const work = (await page.locator('#taetigkeit > div').nth(1).boundingBox())!;
    expect([work.x, work.width]).toEqual([64, 520]);
    const team = (await page.locator('#team > div').nth(1).boundingBox())!;
    expect([team.x, team.width]).toEqual([736, 480]);
  });
});

test.describe('spot checks at 390', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page, PATH);
    const logo = (await page.locator('header img').first().boundingBox())!;
    expect([logo.x, logo.y, Math.round(logo.width), logo.height]).toEqual([24, 20, 149, 40]);
    const card = (await page.locator('#top > div').nth(1).boundingBox())!;
    expect([card.x, card.width]).toEqual([0, 366]);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(Math.abs(height - 4018)).toBeLessThanOrEqual(4);
  });
});

test.describe('wide screens', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('photos run full-bleed while the content stays on the 1280 frame', async ({ page }) => {
    await loadReady(page, PATH);
    const box = (selector: string) => page.locator(selector).boundingBox();
    expect((await box('#top > div >> nth=0'))!.width).toBe(1920);
    const work = (await box('#taetigkeit > div >> nth=0'))!;
    expect(work.x + work.width).toBe(1920);
    expect((await box('#team > div >> nth=0'))!.x).toBe(0);
    expect((await box('#top > div >> nth=1'))!.x).toBe(320 + 64);
  });
});

test.describe('menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('focus, trap, Escape and scroll lock', async ({ page }) => {
    await loadReady(page, PATH);
    const button = page.locator('button[aria-controls="menu"]');
    await expect(button).toHaveText('Menü');
    await button.click();
    await expect(button).toHaveText('Schliessen');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
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
    await expect(button).toBeFocused();
    await expect(button).toHaveText('Menü');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow-y', 'hidden');
  });

  test('takes focus with animations on as well', async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(PATH);
    await page.locator('button[aria-controls="menu"]').click();
    await expect(page.locator('#menu a').first()).toBeFocused();
    await context.close();
  });

  test('closes when the window grows past the phone breakpoint', async ({ page }) => {
    await loadReady(page, PATH);
    await page.locator('button[aria-controls="menu"]').click();
    await page.setViewportSize({ width: 1024, height: 844 });
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow-y', 'hidden');
    await expect(page.locator('header nav a', { hasText: 'Kontakt' })).toBeVisible();
  });

  test('a link closes it and scrolls to the section', async ({ page }) => {
    await loadReady(page, PATH);
    await page.locator('button[aria-controls="menu"]').click();
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
    await expect(page).toHaveURL(/\/design-3\/impressum$/);
    await expect(page.locator('h1')).toHaveText('Impressum');
    await expect(page.locator('main')).toContainText('Inhalt folgt.');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('header img').first()).toHaveAttribute('src', /logo-dark/);
    await page.locator('header a').click();
    await expect(page).toHaveURL(/\/design-3$/);
  });
});

test.describe('Design Lab', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('its choices change this design', async ({ page }) => {
    await page.goto(`${PATH}?logo=a&heading=archivo&body=dm-sans&accent=forest&bg=white`, {
      waitUntil: 'networkidle',
    });
    const css = (selector: string, property: string) =>
      page.locator(selector).first().evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

    await expect(page.locator('header img[data-variant="a"]')).toBeVisible();
    await expect(page.locator('header img[data-variant="current"]')).toBeHidden();
    expect(await css('h1', 'font-family')).toContain('Archivo');
    expect(await css('h1', 'text-transform')).toBe('uppercase');
    expect(await css('#ueber-uns h2', 'font-family')).toContain('Archivo');
    expect(await css('#ueber-uns p', 'font-family')).toContain('DM Sans');
    expect(await css('#kontakt', 'background-color')).toBe('rgb(0, 66, 37)');
    expect(await css('#team > div:nth-child(2)', 'background-color')).toBe('rgb(0, 66, 37)');
    expect(await css('#top > div:nth-child(2)', 'background-color')).toBe('rgb(255, 255, 255)');
  });

  test('its panel opens on this design and is gone with lab=off', async ({ page }) => {
    await page.goto(PATH, { waitUntil: 'networkidle' });
    const before = await page.locator('button:visible').count();
    expect(before).toBeGreaterThan(0);
    await page.goto(`${PATH}?lab=off`, { waitUntil: 'networkidle' });
    expect(await page.locator('button:visible').count()).toBe(before - 1);
  });
});
