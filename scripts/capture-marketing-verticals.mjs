/**
 * Capture dashboard screenshots for marketing vertical previews.
 * Usage: node scripts/capture-marketing-verticals.mjs
 * Reads credentials from .env.local (NEXT_PUBLIC_DEMO_ADMIN_EMAIL, NEXT_PUBLIC_DEMO_PASSWORD).
 */

import { chromium } from 'playwright';
import { mkdir, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'marketing');

const BASE_URL = process.env.MARKETING_CAPTURE_BASE_URL ?? 'https://app.getstride.co.ke';
const THEME_STORAGE_KEY = 'hris-dashboard:theme';

function applyDarkModeInitScript() {
  return `(() => {
    try {
      localStorage.setItem('${THEME_STORAGE_KEY}', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } catch (e) {}
  })();`;
}

function loadEnvLocal() {
  const path = join(ROOT, '.env.local');
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const SHOTS = [
  { id: 'logistics', file: 'stride-vertical-logistics.png', path: '/dashboard/fleet/trips' },
  { id: 'saccos', file: 'stride-vertical-saccos.png', path: '/dashboard/accounts/clients' },
  { id: 'healthcare', file: 'stride-vertical-healthcare.png', path: '/dashboard/rota' },
  { id: 'energy', file: 'stride-vertical-energy.png', path: '/dashboard/hse' },
  { id: 'construction', file: 'stride-vertical-construction.png', path: '/dashboard/assets' },
];

async function main() {
  const env = loadEnvLocal();
  const email = process.env.CAPTURE_EMAIL ?? env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL;
  const password = process.env.CAPTURE_PASSWORD ?? env.NEXT_PUBLIC_DEMO_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing NEXT_PUBLIC_DEMO_ADMIN_EMAIL or NEXT_PUBLIC_DEMO_PASSWORD in .env.local');
  }

  mkdir(OUT_DIR, { recursive: true }, () => {});

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  await context.addInitScript(applyDarkModeInitScript());
  const page = await context.newPage();

  console.log(`Signing in at ${BASE_URL}…`);
  await page.goto(`${BASE_URL}/dashboard/login`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByLabel('Email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL((url) => url.pathname.startsWith('/dashboard') && !url.pathname.includes('/login'), {
    timeout: 60_000,
  });

  await page.evaluate(() => {
    localStorage.setItem('hris-dashboard:theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  for (const shot of SHOTS) {
    const url = `${BASE_URL}${shot.path}`;
    console.log(`Capturing ${shot.id} → ${shot.file}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const main = page.locator('main').first();
    await main.waitFor({ state: 'visible', timeout: 30_000 });

    const outPath = join(OUT_DIR, shot.file);
    await main.screenshot({ path: outPath, type: 'png' });
    console.log(`  saved ${outPath}`);
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
