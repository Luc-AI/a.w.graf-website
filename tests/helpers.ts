import type { Page } from '@playwright/test';

/** Loads the page with fonts and all (also lazy) images ready, scrolled back to the top. */
export async function loadReady(page: Page, path = '/design-1') {
  // lab=off hides the Design Lab preview panel so screenshots stay comparable to the reference.
  const [base, hash] = path.split('#');
  const url = `${base}${base.includes('?') ? '&' : '?'}lab=off${hash ? `#${hash}` : ''}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await document.fonts.ready;
    document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
    await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(100);
}
