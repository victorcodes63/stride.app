/**
 * Demo login hints — configure per deployment to match seeded demo accounts.
 * Set NEXT_PUBLIC_DEMO_* in env (see .env.example).
 *
 * Use static process.env.NEXT_PUBLIC_* references (not process.env[key]) so
 * Next.js inlines the same values in client and SSR bundles and avoids hydration mismatches.
 */

function trimEnvValue(v: string | undefined): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

const DEMO_PASSWORD =
  trimEnvValue(process.env.NEXT_PUBLIC_DEMO_PASSWORD) ?? 'Demo@2026!';

const DEMO_ADMIN_EMAIL =
  trimEnvValue(process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL) ?? 'demo@example.com';

const DEMO_HR_EMAIL =
  trimEnvValue(process.env.NEXT_PUBLIC_DEMO_HR_EMAIL) ?? 'hr.demo@example.com';

const DEMO_FINANCE_EMAIL =
  trimEnvValue(process.env.NEXT_PUBLIC_DEMO_FINANCE_EMAIL) ?? 'finance.demo@example.com';

const DEMO_ESS_EMAIL =
  trimEnvValue(process.env.NEXT_PUBLIC_DEMO_ESS_EMAIL) ?? 'employee.demo@example.com';

export function getDemoPassword(): string {
  return DEMO_PASSWORD;
}

export type DemoCredentialRow = { role: string; email: string };

export function getStaffDemoCredentialRows(): DemoCredentialRow[] {
  return [
    { role: 'Admin', email: DEMO_ADMIN_EMAIL },
    { role: 'HR', email: DEMO_HR_EMAIL },
    { role: 'Finance', email: DEMO_FINANCE_EMAIL },
  ];
}

export function getEssDemoCredentialRow(): DemoCredentialRow {
  return {
    role: 'ESS (employee portal)',
    email: DEMO_ESS_EMAIL,
  };
}

export function getDemoLoginEmailPlaceholder(): string {
  return DEMO_ADMIN_EMAIL;
}
