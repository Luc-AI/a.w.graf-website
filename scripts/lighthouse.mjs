// Lighthouse mobile run against the static build.
// Usage: npm run build && npm run lighthouse [-- /design-2]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const server = spawn('npx', ['serve', 'out', '-l', '3101', '-L'], { stdio: 'ignore', detached: true });
await new Promise((resolve) => setTimeout(resolve, 2000));

const chrome = await chromeLauncher.launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox'],
});

let failed = false;
try {
  const result = await lighthouse(`http://localhost:3101${process.argv[2] ?? '/design-1'}`, {
    port: chrome.port,
    output: 'html',
    logLevel: 'error',
  });
  writeFileSync('lighthouse-report.html', result.report);
  const { categories, audits } = result.lhr;
  const minimums = { performance: 95, accessibility: 100, 'best-practices': 100, seo: 100 };
  for (const [id, minimum] of Object.entries(minimums)) {
    const score = Math.round(categories[id].score * 100);
    if (score < minimum) failed = true;
    console.log(`${id}: ${score} (min ${minimum})`);
  }
  for (const id of ['largest-contentful-paint', 'first-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift']) {
    console.log(`${id}: ${audits[id].displayValue}`);
  }
  if (audits['cumulative-layout-shift'].numericValue >= 0.02) failed = true;
  for (const category of Object.values(categories)) {
    for (const ref of category.auditRefs) {
      const audit = audits[ref.id];
      if (ref.weight > 0 && audit.score !== null && audit.score < 0.9) {
        console.log(`  needs work [${category.id}] ${audit.id}: ${audit.displayValue ?? audit.title}`);
      }
    }
  }
} finally {
  await chrome.kill();
  process.kill(-server.pid);
}
process.exit(failed ? 1 : 0);
