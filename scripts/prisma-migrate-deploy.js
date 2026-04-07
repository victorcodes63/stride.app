const { spawnSync } = require('child_process');

/**
 * When to run `prisma migrate deploy` during `npm run build`:
 * - Always on Vercel Production builds (VERCEL_ENV=production), unless opted out with RUN_MIGRATIONS_ON_BUILD=false
 * - Or when RUN_MIGRATIONS_ON_BUILD is true / 1 (any environment, e.g. local CI)
 * - Skip when RUN_MIGRATIONS_ON_BUILD=false
 *
 * Preview deployments use VERCEL_ENV=preview — they do NOT auto-migrate (use a separate DEV Neon URL there).
 */
function shouldRunMigrations() {
  const raw = (process.env.RUN_MIGRATIONS_ON_BUILD || '').trim().toLowerCase();
  if (raw === 'false' || raw === '0' || raw === 'no') {
    return { run: false, reason: 'RUN_MIGRATIONS_ON_BUILD disables migrations.' };
  }
  if (raw === 'true' || raw === '1' || raw === 'yes') {
    return { run: true, reason: 'RUN_MIGRATIONS_ON_BUILD enabled.' };
  }
  if (process.env.VERCEL_ENV === 'production') {
    return { run: true, reason: 'Vercel Production build (VERCEL_ENV=production).' };
  }
  return {
    run: false,
    reason:
      'Not Vercel Production and RUN_MIGRATIONS_ON_BUILD not set. ' +
      'Set RUN_MIGRATIONS_ON_BUILD=true for CI, or deploy to Vercel Production.',
  };
}

function run() {
  const { run: doMigrate, reason } = shouldRunMigrations();

  if (!doMigrate) {
    console.log(`[prisma-migrate-deploy] Skipping prisma migrate deploy — ${reason}`);
    return;
  }

  console.log(`[prisma-migrate-deploy] Running prisma migrate deploy (${reason})`);
  if (!process.env.DATABASE_URL) {
    console.error('[prisma-migrate-deploy] DATABASE_URL is missing — cannot migrate.');
    process.exit(1);
  }

  const result = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const output = `${stdout}\n${stderr}`.trim();

  if (result.status === 0) {
    process.stdout.write(stdout);
    return;
  }

  // If the production DB already contains a previously failed migration record (P3009),
  // we don't want to block Next.js builds. We log the output and continue.
  if (output.includes('P3009')) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    console.warn(
      '\n[prisma-migrate-deploy] Detected P3009 (failed migration present). ' +
        'Continuing so Vercel can complete `next build`. ' +
        'You should resolve the failed migration record separately.'
    );
    return;
  }

  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exit(result.status ?? 1);
}

run();
