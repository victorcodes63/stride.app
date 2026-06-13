import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { DASHBOARD_PAGE_HEADER_CLASS } from '@/lib/dashboard-layout';

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export type DashboardPageHeaderVariant = 'default' | 'hero';

export type DashboardPageHeaderBadge = {
  label: ReactNode;
  icon?: LucideIcon;
  /** Shown before the label (e.g. entity flag emoji). */
  prefix?: ReactNode;
};

export type DashboardPageHeaderAction = {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
};

export type DashboardPageHeaderProps = {
  /** Page title or greeting (always rendered as h1). */
  title: ReactNode;
  /** Optional Lucide icon beside the title (default variant). */
  icon?: LucideIcon;
  iconClassName?: string;
  /** Supporting copy — keep internal-tool pages free of redundant entity names. */
  description?: ReactNode;
  /** Small uppercase label above the title (module area, e.g. "Finance & payroll"). */
  eyebrow?: string;
  /** Secondary line under description (date, counts, breadcrumbs text). */
  meta?: ReactNode;
  /** Hero-only context pills (role, entity, status). */
  badges?: DashboardPageHeaderBadge[];
  /** Custom action nodes, or declarative action links. */
  actions?: ReactNode | DashboardPageHeaderAction[];
  variant?: DashboardPageHeaderVariant;
  titleSuppressHydrationWarning?: boolean;
  metaSuppressHydrationWarning?: boolean;
  className?: string;
};

function HeaderActions({
  actions,
  variant,
}: {
  actions: ReactNode | DashboardPageHeaderAction[];
  variant: DashboardPageHeaderVariant;
}) {
  if (Array.isArray(actions)) {
    return (
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.variant !== 'secondary';
          const className =
            variant === 'hero'
              ? isPrimary
                ? 'inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-secondary-800 shadow-md transition hover:bg-primary-50'
                : 'inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15'
              : isPrimary
                ? 'btn-primary inline-flex items-center gap-2'
                : 'btn-secondary inline-flex items-center gap-2';

          return (
            <Link key={`${action.href}-${action.label}`} href={action.href} className={className}>
              {Icon ? <Icon className="h-4 w-4" strokeWidth={1.75} /> : null}
              {action.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return <div className="page-header-actions">{actions}</div>;
}

function HeaderBadges({ badges, variant }: { badges: DashboardPageHeaderBadge[]; variant: DashboardPageHeaderVariant }) {
  if (!badges.length) return null;

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
            >
              {badge.prefix ? <span aria-hidden>{badge.prefix}</span> : null}
              {Icon ? <Icon className="h-3 w-3 text-white/80" aria-hidden /> : null}
              {badge.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/60 bg-primary-50/80 px-2.5 py-1 text-[11px] font-medium text-primary-800"
          >
            {badge.prefix ? <span aria-hidden>{badge.prefix}</span> : null}
            {Icon ? <Icon className="h-3 w-3 text-primary-600" aria-hidden /> : null}
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Standard page header for dashboard routes.
 * - `default` — title block on the canvas (most list/detail pages)
 * - `hero` — navy gradient welcome band (Overview and module home pages)
 */
export function DashboardPageHeader({
  title,
  icon: TitleIcon,
  iconClassName,
  description,
  eyebrow,
  meta,
  badges = [],
  actions,
  variant = 'default',
  titleSuppressHydrationWarning,
  metaSuppressHydrationWarning,
  className,
}: DashboardPageHeaderProps) {
  const hasActions = actions != null && (Array.isArray(actions) ? actions.length > 0 : true);

  if (variant === 'hero') {
    return (
      <section
        className={cn(
          'dashboard-page-header-hero relative overflow-hidden rounded-2xl border border-secondary-700/20 bg-gradient-to-br from-secondary-800 via-secondary-700 to-primary-800 p-5 shadow-lg shadow-secondary-900/20 sm:p-6',
          className,
        )}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-primary-300/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{eyebrow}</p>
            ) : null}
            <HeaderBadges badges={badges} variant="hero" />
            <div>
              <h1
                className="text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]"
                suppressHydrationWarning={titleSuppressHydrationWarning}
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">{description}</p>
              ) : null}
            </div>
            {meta ? (
              <p className="text-xs text-white/70" suppressHydrationWarning={metaSuppressHydrationWarning}>
                {meta}
              </p>
            ) : null}
          </div>
          {hasActions && actions ? <HeaderActions actions={actions} variant="hero" /> : null}
        </div>
      </section>
    );
  }

  return (
    <header className={cn(DASHBOARD_PAGE_HEADER_CLASS, className)}>
      <div className="page-header-body min-w-0 space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700">{eyebrow}</p>
        ) : null}
        {badges.length > 0 ? <HeaderBadges badges={badges} variant="default" /> : null}
        <h1
          className={cn('page-title', TitleIcon && 'flex items-center gap-2')}
          suppressHydrationWarning={titleSuppressHydrationWarning}
        >
          {TitleIcon ? (
            <TitleIcon className={iconClassName ?? 'h-7 w-7 shrink-0 text-primary-600'} strokeWidth={1.75} aria-hidden />
          ) : null}
          {title}
        </h1>
        {description ? <p className="page-description max-w-2xl !mt-0">{description}</p> : null}
        {meta ? (
          <p className="text-xs text-neutral-500" suppressHydrationWarning={metaSuppressHydrationWarning}>
            {meta}
          </p>
        ) : null}
      </div>
      {hasActions && actions ? <HeaderActions actions={actions} variant="default" /> : null}
    </header>
  );
}
