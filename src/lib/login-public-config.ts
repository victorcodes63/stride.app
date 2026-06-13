import type { DemoCredentialRow } from '@/lib/demo-credentials';

/** Public login UI config — read on the server and passed as props to avoid hydration mismatches. */
export type LoginPublicConfig = {
  emailPlaceholder: string;
  showDemoHint: boolean;
  demoPassword: string;
  staffDemoRows: DemoCredentialRow[];
  essDemoRow: DemoCredentialRow;
};

function trimEnv(key: string): string | undefined {
  const v = process.env[key];
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function isDemoHintVisible(): boolean {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE;
  const showHint = process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN_HINT;
  if (demoMode === 'true') return true;
  if (demoMode === 'false') return false;
  if (showHint === 'false') return false;
  if (showHint === 'true') return true;
  return false;
}

export function getLoginPublicConfig(): LoginPublicConfig {
  return {
    emailPlaceholder: trimEnv('NEXT_PUBLIC_DEMO_ADMIN_EMAIL') ?? 'user@example.com',
    showDemoHint: isDemoHintVisible(),
    demoPassword: trimEnv('NEXT_PUBLIC_DEMO_PASSWORD') ?? 'Demo@2026!',
    staffDemoRows: [
      { role: 'Admin', email: trimEnv('NEXT_PUBLIC_DEMO_ADMIN_EMAIL') ?? 'demo@example.com' },
      { role: 'HR', email: trimEnv('NEXT_PUBLIC_DEMO_HR_EMAIL') ?? 'hr.demo@example.com' },
      {
        role: 'Finance',
        email: trimEnv('NEXT_PUBLIC_DEMO_FINANCE_EMAIL') ?? 'finance.demo@example.com',
      },
    ],
    essDemoRow: {
      role: 'ESS (employee portal)',
      email: trimEnv('NEXT_PUBLIC_DEMO_ESS_EMAIL') ?? 'employee.demo@example.com',
    },
  };
}
