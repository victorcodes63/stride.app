import type { ReactNode } from 'react';
import { DASHBOARD_PAGE_SHELL_CLASS } from '@/lib/dashboard-layout';

export { DashboardPageHeader } from './DashboardPageHeader';
export type {
  DashboardPageHeaderAction,
  DashboardPageHeaderBadge,
  DashboardPageHeaderProps,
  DashboardPageHeaderVariant,
} from './DashboardPageHeader';

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

/** Standard vertical rhythm wrapper for dashboard routes. */
export function DashboardPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(DASHBOARD_PAGE_SHELL_CLASS, className)}>{children}</div>;
}

/** @deprecated Prefer `DashboardPageHeader` with `title` and `description` props. */
export function DashboardPageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h1 className={cn('page-title', className)}>{children}</h1>;
}

/** @deprecated Prefer `DashboardPageHeader` with `description` prop. */
export function DashboardPageDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn('page-description', className)}>{children}</p>;
}
