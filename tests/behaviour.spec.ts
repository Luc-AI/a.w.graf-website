import { expect, test } from '@playwright/test';
import { loadReady } from './helpers';

const widths = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];

for (const width of widths) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await loadReady(page);
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    }));
    expect(sizes.scroll).toBe(sizes.inner);
  });
}

test.describe('measurements at 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page);
    const logo = await page.locator('header img').boundingBox();
    expect(logo).toEqual({ x: 170, y: 32, width: 224, height: 60 });
    const h1 = await page.locator('h1').boundingBox();
    expect(h1?.y).toBe(265);
    const hero = await page.locator('main img').first().boundingBox();
    expect(hero).toMatchObject({ x: 170, width: 1100 });
    expect(Math.round(hero!.y)).toBe(581);
    expect(Math.round(hero!.height)).toBe(619);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(height).toBe(4314);
    await expect(page.locator('h1')).toHaveCount(1);
  });
});

test.describe('measurements at 390', () => {
  test.use({ viewport: { width: 390, height: 900 } });

  test('match the spec', async ({ page }) => {
    await loadReady(page);
    const logo = await page.locator('header img').boundingBox();
    expect(Math.round(logo!.width)).toBe(164);
    expect(logo!.height).toBe(44);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(height).toBe(4648);
    const wrap = await page.locator('header').boundingBox();
    expect(wrap!.height).toBe(84); // plus the 1px border on the wrapper = 85
  });
});

test.describe('mobile menu behaviour', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('focus handling, Escape and scroll lock', async ({ page }) => {
    await loadReady(page);
    const button = page.locator('button[aria-controls="mobile-menu"]');
    await expect(button).toHaveText('Menü');
    await button.click();
    await expect(button).toHaveText('Schliessen');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu a').first()).toBeFocused();
    await expect(page.locator('body')).toHaveClass(/menu-open/);

    // Tab stays inside header + panel.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest('header, #mobile-menu'),
      );
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(button).toHaveText('Menü');
    await expect(button).toBeFocused();
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('link tap closes the menu and lands below the header', async ({ page }) => {
    await loadReady(page);
    await page.locator('button[aria-controls="mobile-menu"]').click();
    await page.locator('#mobile-menu a', { hasText: 'Werte' }).click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page).toHaveURL(/#werte$/);
    await expect
      .poll(async () => Math.round((await page.locator('#werte').boundingBox())?.y ?? 0))
      .toBe(72);
  });

  test('closes on resize to desktop', async ({ page }) => {
    await loadReady(page);
    await page.locator('button[aria-controls="mobile-menu"]').click();
    await page.setViewportSize({ width: 900, height: 844 });
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });
});

test.describe('design chooser', () => {
  test('shows both designs; Design 1 opens the site', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a')).toHaveText(['Design 1', 'Design 2']);
    await page.getByRole('link', { name: 'Design 1' }).click();
    await expect(page).toHaveURL(/\/design-1$/);
    await expect(page.locator('h1')).toHaveText('Immobilien mit Bestand.');
  });

  test('Design 2 opens the second design', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Design 2' }).click();
    await expect(page).toHaveURL(/\/design-2$/);
    await expect(page.locator('h1')).toContainText('mit Bestand.');
  });

  test('legal page nav returns to Design 1', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/impressum');
    await page.getByRole('link', { name: 'Kontakt' }).click();
    await expect(page).toHaveURL(/\/design-1#kontakt$/);
  });
});

test.describe('anchors and stubs', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('header stays stuck while scrolling', async ({ page }) => {
    await loadReady(page);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect
      .poll(async () => (await page.locator('header').boundingBox())?.y)
      .toBe(0);
    await expect(page.locator('header img')).toHaveCSS('height', '44px');
  });

  test('logo returns to the top', async ({ page }) => {
    await loadReady(page);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.locator('header a').first().click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  for (const [path, title] of [['/impressum', 'Impressum'], ['/datenschutz', 'Datenschutz']]) {
    test(`${title} stub`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator('main')).toContainText('Inhalt folgt.');
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('keyboard reaches every link with a visible focus ring', async ({ page }) => {
    await loadReady(page);
    const expected = await page.locator('a:visible').count();
    const seen = new Set<string>();
    for (let i = 0; i < expected; i += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const style = getComputedStyle(el);
        return { key: `${el.getAttribute('href')}|${el.textContent}`, outline: style.outlineStyle, width: style.outlineWidth };
      });
      expect(focus.outline).toBe('solid');
      expect(focus.width).toBe('2px');
      seen.add(focus.key);
    }
    expect(seen.size).toBe(expected);
  });

  test('no external requests', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.hostname !== 'localhost' && url.protocol.startsWith('http')) external.push(req.url());
    });
    await loadReady(page);
    expect(external).toEqual([]);
  });
});
