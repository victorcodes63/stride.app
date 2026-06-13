/** Client-safe brand constants (no server imports). */

export const DEFAULT_BRAND_LOGO_SRC = '/brand/platform-logo.png';

/** Legacy platform marks — remapped to {@link DEFAULT_BRAND_LOGO_SRC} at resolve time. */
const LEGACY_LOGO_SUFFIXES = ['hris-demo-mark.svg', 'hris-demo-mark.png'] as const;

export function isLegacyPlatformLogo(src: string): boolean {
  const t = src.trim().replace(/^\//, '');
  return LEGACY_LOGO_SUFFIXES.some((suffix) => t.endsWith(suffix));
}

/** Normalize logo paths so seeded / env defaults pick up the current platform mark. */
export function normalizeLogoSrc(src: string): string {
  const t = src.trim();
  if (!t || isLegacyPlatformLogo(t)) return DEFAULT_BRAND_LOGO_SRC;
  return t.startsWith('/') ? t : `/${t}`;
}

export const DEFAULT_LANDING_PATH = '/dashboard';

export const LANDING_PATH_OPTIONS = [
  { value: '/dashboard', label: 'Dashboard home' },
  { value: '/dashboard/employees', label: 'Employees' },
  { value: '/dashboard/leave', label: 'Leave' },
  { value: '/dashboard/payroll', label: 'Payroll' },
] as const;
