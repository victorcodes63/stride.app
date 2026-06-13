/**
 * Commercial module licensing — each dedicated deployment enables/disables modules via env.
 * Unset or empty env vars default to enabled (full product). Set MODULE_*=false to disable.
 *
 * Company Setup `moduleAdminFlags` can hide licensed modules without redeploying.
 * Effective visibility = licensed (env) AND enabled (admin).
 */

export type ModuleKey =
  | 'core'
  | 'leave'
  | 'time'
  | 'payroll'
  | 'ats'
  | 'performance'
  | 'hse'
  | 'accounts'
  | 'disciplinary'
  | 'reports'
  | 'assets'
  | 'ess'
  | 'communications'
  | 'training'
  | 'documents';

export type ModuleDefinition = {
  key: ModuleKey;
  label: string;
  envVar: string;
  description: string;
  /** When false, the module cannot be disabled (always on). */
  canDisable: boolean;
};

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: 'core',
    label: 'Core HR',
    envVar: 'MODULE_CORE',
    description: 'Employee records, departments, onboarding, credentials, contracts.',
    canDisable: false,
  },
  {
    key: 'leave',
    label: 'Leave',
    envVar: 'MODULE_LEAVE',
    description: 'Employee and staff leave policies, balances, and approvals.',
    canDisable: true,
  },
  {
    key: 'time',
    label: 'Time & Attendance',
    envVar: 'MODULE_TIME',
    description: 'Rota, attendance, biometrics, and shift scheduling.',
    canDisable: true,
  },
  {
    key: 'payroll',
    label: 'Payroll',
    envVar: 'MODULE_PAYROLL',
    description: 'Payroll runs, payslips, statutory returns, and bank export.',
    canDisable: true,
  },
  {
    key: 'ats',
    label: 'Recruitment',
    envVar: 'MODULE_ATS',
    description: 'Careers site, job openings, applications, and interviews.',
    canDisable: true,
  },
  {
    key: 'performance',
    label: 'Performance',
    envVar: 'MODULE_PERFORMANCE',
    description: 'Goals, review cycles, and performance management.',
    canDisable: true,
  },
  {
    key: 'hse',
    label: 'HSE',
    envVar: 'MODULE_HSE',
    description: 'Health, safety, and environment incident tracking.',
    canDisable: true,
  },
  {
    key: 'accounts',
    label: 'Finance',
    envVar: 'MODULE_ACCOUNTS',
    description: 'Billing, invoices, expenses, budgets, petty cash, and financial reports.',
    canDisable: true,
  },
  {
    key: 'disciplinary',
    label: 'Disciplinary & Grievance',
    envVar: 'MODULE_DISCIPLINARY',
    description: 'Disciplinary cases and grievance workflows.',
    canDisable: true,
  },
  {
    key: 'reports',
    label: 'Reports & Analytics',
    envVar: 'MODULE_REPORTS',
    description: 'Workforce reports and executive analytics.',
    canDisable: true,
  },
  {
    key: 'assets',
    label: 'Asset Manager',
    envVar: 'MODULE_ASSETS',
    description: 'Company asset registry, assignments, and lifecycle tracking.',
    canDisable: true,
  },
  {
    key: 'ess',
    label: 'Employee Self-Service',
    envVar: 'MODULE_ESS',
    description: 'Employee portal for leave, payslips, attendance, and cases.',
    canDisable: true,
  },
  {
    key: 'communications',
    label: 'Communications',
    envVar: 'MODULE_COMMUNICATIONS',
    description: 'Company announcements, notices, and internal communications.',
    canDisable: true,
  },
  {
    key: 'training',
    label: 'Training & Development',
    envVar: 'MODULE_TRAINING',
    description: 'Training programs, enrollments, org chart, and skill development.',
    canDisable: true,
  },
  {
    key: 'documents',
    label: 'Document Management',
    envVar: 'MODULE_DOCUMENTS',
    description: 'Company policies, SOPs, handbooks, and shared documents.',
    canDisable: true,
  },
];

/** Cookie synced from deployment config so middleware can enforce admin module toggles. */
export const MODULE_ADMIN_COOKIE = 'hris_module_prefs';

export type ModuleUiGroup = {
  id: string;
  label: string;
  description: string;
  keys: ModuleKey[];
  /** Core HR — toggles disabled in UI */
  locked?: boolean;
};

export const MODULE_UI_GROUPS: ModuleUiGroup[] = [
  {
    id: 'core',
    label: 'Core HR',
    description: 'Employee records, departments, contracts, and onboarding.',
    keys: ['core'],
    locked: true,
  },
  {
    id: 'people-ops',
    label: 'People operations',
    description: 'Day-to-day HR workflows your team runs in the dashboard.',
    keys: ['leave', 'time', 'payroll', 'performance', 'disciplinary', 'ess', 'reports'],
  },
  {
    id: 'workplace',
    label: 'Workplace & development',
    description: 'Internal comms, training, and company knowledge management.',
    keys: ['communications', 'training', 'documents'],
  },
  {
    id: 'extended',
    label: 'Extended modules',
    description: 'Recruitment, safety, finance, and assets — hide these for a pure HRIS.',
    keys: ['ats', 'hse', 'accounts', 'assets'],
  },
];

const MODULE_BY_KEY = Object.fromEntries(MODULE_DEFINITIONS.map((m) => [m.key, m])) as Record<
  ModuleKey,
  ModuleDefinition
>;

function parseBoolean(v: string | undefined, defaultValue: boolean): boolean {
  if (v === undefined || v === '') return defaultValue;
  const n = v.trim().toLowerCase();
  if (n === '1' || n === 'true' || n === 'yes' || n === 'on') return true;
  if (n === '0' || n === 'false' || n === 'no' || n === 'off') return false;
  return defaultValue;
}

/** All admin toggles on — used when migrating saved company setup without moduleAdminFlags. */
export function allModulesAdminEnabled(): Record<ModuleKey, boolean> {
  return MODULE_DEFINITIONS.reduce(
    (acc, def) => {
      acc[def.key] = true;
      return acc;
    },
    {} as Record<ModuleKey, boolean>,
  );
}

/** Defaults for new deployments: HR-focused (Finance & Assets off). */
export function defaultModuleAdminFlags(): Record<ModuleKey, boolean> {
  return MODULE_DEFINITIONS.reduce(
    (acc, def) => {
      if (def.key === 'core') acc[def.key] = true;
      else if (def.key === 'accounts' || def.key === 'assets') acc[def.key] = false;
      else acc[def.key] = true;
      return acc;
    },
    {} as Record<ModuleKey, boolean>,
  );
}

/** Preset: hide non-HR extended modules (Finance, Assets, Recruitment). */
export function hrEssentialsModuleAdminFlags(
  current: Record<ModuleKey, boolean>,
): Record<ModuleKey, boolean> {
  return {
    ...current,
    accounts: false,
    assets: false,
    ats: false,
  };
}

export function sanitizeModuleAdminFlags(value: unknown): Record<ModuleKey, boolean> {
  if (!value || typeof value !== 'object') return allModulesAdminEnabled();
  const raw = value as Record<string, unknown>;
  return MODULE_DEFINITIONS.reduce(
    (acc, def) => {
      if (def.key === 'core') {
        acc[def.key] = true;
        return acc;
      }
      const v = raw[def.key];
      acc[def.key] = typeof v === 'boolean' ? v : true;
      return acc;
    },
    {} as Record<ModuleKey, boolean>,
  );
}

/** Env / deployment license — cannot be overridden from Company Setup. */
export function isModuleLicensed(key: ModuleKey): boolean {
  const def = MODULE_BY_KEY[key];
  if (!def.canDisable) return true;
  return parseBoolean(process.env[def.envVar], true);
}

export function listLicensedModules(): Record<ModuleKey, boolean> {
  return MODULE_DEFINITIONS.reduce(
    (acc, def) => {
      acc[def.key] = isModuleLicensed(def.key);
      return acc;
    },
    {} as Record<ModuleKey, boolean>,
  );
}

/** Merge deployment license with Company Setup admin toggles. */
export function resolveEffectiveModules(
  adminFlags: Record<ModuleKey, boolean>,
): Record<ModuleKey, boolean> {
  const licensed = listLicensedModules();
  return MODULE_DEFINITIONS.reduce(
    (acc, def) => {
      acc[def.key] = licensed[def.key] && (def.key === 'core' ? true : adminFlags[def.key] !== false);
      return acc;
    },
    {} as Record<ModuleKey, boolean>,
  );
}

/** @deprecated Use isModuleLicensed or resolveEffectiveModules. Env license only. */
export function isModuleEnabled(key: ModuleKey): boolean {
  return isModuleLicensed(key);
}

/** @deprecated Use resolveEffectiveModules with admin flags. Env license only. */
export function listEnabledModules(): Record<ModuleKey, boolean> {
  return listLicensedModules();
}

export function getModuleDefinition(key: ModuleKey): ModuleDefinition {
  return MODULE_BY_KEY[key];
}

/** Human-readable label for error messages and UI. */
export function getModuleLabel(key: ModuleKey): string {
  return MODULE_BY_KEY[key]?.label ?? key;
}
