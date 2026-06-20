'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  Clock,
  Pin,
  type LucideIcon,
} from 'lucide-react';
import { useEntity } from '@/components/EntitySwitcher';
import { useDashboardSession } from '@/contexts/dashboard-session';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import {
  ALL_MODULES_ENABLED,
  buildDashboardNavSections,
  resolveDashboardNavItems,
} from '@/lib/dashboard-nav-catalog';
import {
  buildAttentionItems,
  buildCrossModuleKpis,
  buildDefaultShortcuts,
  buildDomainSnapshots,
  getOverviewGreeting,
  getOverviewPrimaryAction,
  getOverviewRoleLabel,
  getOverviewSecondaryAction,
  getOverviewSubtitle,
  groupAttentionByDomain,
  pickTopAttentionAction,
  resolveOverviewPersona,
  shouldExpandHrDetails,
  shouldShowPayrollBlock,
  type OverviewAttentionItem,
  type OverviewCrossModuleMetrics,
  type OverviewShortcut,
} from '@/lib/dashboard-overview-personalization';
import { useDashboardModuleOrder } from '@/contexts/dashboard-module-order';
import { OverviewModuleCommandCenter } from '@/components/dashboard/overview/OverviewModuleCommandCenter';
import type { ModuleKey } from '@/lib/modules';
import {
  attentionSwatchClass,
  DASHBOARD_KPI_CLASSES,
  type DashboardKpiVariant,
} from '@/lib/platform-swatches';
import type { UserSummary } from '@/types/dashboard';

type AttendanceRow = {
  id: string;
  employee?: { firstName?: string; lastName?: string };
  workDate: string;
  firstInAt?: string | null;
  lateMinutes?: number;
};

type MyTaskRow = {
  id: string;
  title: string;
  dueDate?: string | null;
  status: string;
  workflow: { employee: { firstName: string; lastName: string } };
};

type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  unread: boolean;
  createdAt: string;
};

const ALL_MODULES_ON: Record<ModuleKey, boolean> = {
  core: true,
  leave: true,
  time: true,
  payroll: true,
  ats: true,
  performance: true,
  hse: true,
  accounts: true,
  disciplinary: true,
  reports: true,
  assets: true,
  ess: true,
  communications: true,
  training: true,
  documents: true,
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(currency === 'UGX' ? 'en-UG' : 'en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'UGX' ? 0 : 2,
      maximumFractionDigits: currency === 'UGX' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function attentionToneClass(tone: OverviewAttentionItem['tone']) {
  if (tone === 'amber' || tone === 'rose' || tone === 'sky') {
    return attentionSwatchClass(tone);
  }
  return attentionSwatchClass('neutral');
}

type KpiVariant = DashboardKpiVariant;

const KPI_STYLES = DASHBOARD_KPI_CLASSES;

function OverviewPanel({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`dashboard-panel ${className}`}>
      <div className="dashboard-panel-header flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-secondary-800">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function OverviewPanelFlush({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-secondary-800">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-36 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="skeleton h-80 rounded-xl xl:col-span-8" />
        <div className="skeleton h-80 rounded-xl xl:col-span-4" />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  href,
  variant = 'primary',
}: {
  label: string;
  value: number | string;
  note: string;
  icon: LucideIcon;
  href?: string;
  variant?: KpiVariant;
}) {
  const styles = KPI_STYLES[variant];
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="dash-icon-well flex h-10 w-10 items-center justify-center rounded-xl">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        {href ? <ArrowUpRight className="h-4 w-4 text-neutral-300 transition group-hover:text-primary-500" aria-hidden /> : null}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">{label}</p>
      <p className={`dash-overview-kpi-value mt-1 text-3xl font-semibold leading-none tracking-tight tabular-nums ${styles.value}`}>{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">{note}</p>
    </>
  );

  const className = `group block rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.card}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

function ShortcutTile({ item, pinned = false }: { item: OverviewShortcut; pinned?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="dash-workspace-link flex items-start gap-3 rounded-xl border p-3.5 shadow-sm"
    >
      <span className="dash-icon-well flex h-9 w-9 items-center justify-center rounded-xl">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-ink">{item.label}</p>
          {pinned ? <Pin className="dash-shortcut-pin h-3 w-3 flex-shrink-0" aria-label="Pinned" /> : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-neutral-500">{item.desc}</p>
      </div>
      <ChevronRight className="dash-workspace-chevron h-4 w-4" />
    </Link>
  );
}

function OverviewMetricsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="skeleton h-80 rounded-xl xl:col-span-8" />
        <div className="skeleton h-80 rounded-xl xl:col-span-4" />
      </div>
    </>
  );
}

export default function DashboardOverviewContent() {
  const { user: sessionUser, modules: sessionModules } = useDashboardSession();
  const { orderedDomains } = useDashboardModuleOrder();
  const { activeEntity, loading: entityLoading } = useEntity();
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [totalStaff, setTotalStaff] = useState(0);
  const [onDuty, setOnDuty] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [openAttendanceExceptions, setOpenAttendanceExceptions] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [deductionsTotal, setDeductionsTotal] = useState(0);
  const [payrollDenied, setPayrollDenied] = useState(false);
  const [myOnboardingTasks, setMyOnboardingTasks] = useState<MyTaskRow[]>([]);
  const [credentialsExpiring, setCredentialsExpiring] = useState(0);
  const [credentialsExpired, setCredentialsExpired] = useState(0);
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [crossModule, setCrossModule] = useState<OverviewCrossModuleMetrics>({
    invoicesOutstanding: 0,
    vendorBillsOutstanding: 0,
    activeFleetTrips: 0,
    openFleetIncidents: 0,
    pendingPurchaseRequests: 0,
  });
  const [hrDetailsOpen, setHrDetailsOpen] = useState(false);

  useEffect(() => {
    if (entityLoading) return;

    let cancelled = false;
    setMetricsLoading(true);

    const run = async () => {
      try {
        const res = await fetch('/api/dashboard/overview?metricsOnly=1', { credentials: 'include' });
        if (cancelled) return;
        if (!res.ok) return;

        const data = (await res.json()) as {
          totalStaff?: number;
          onDuty?: number;
          pendingApprovals?: number;
          attendanceRows?: AttendanceRow[];
          openAttendanceExceptions?: number;
          payroll?: {
            denied?: boolean;
            grossTotal?: number;
            netTotal?: number;
            deductionsTotal?: number;
          };
          myOnboardingTasks?: MyTaskRow[];
          credentialsExpiring?: number;
          credentialsExpired?: number;
          pinnedHrefs?: string[];
          notifications?: NotificationRow[];
          unreadNotifications?: number;
          crossModule?: OverviewCrossModuleMetrics;
        };

        setTotalStaff(data.totalStaff ?? 0);
        setOnDuty(data.onDuty ?? 0);
        setPendingApprovals(data.pendingApprovals ?? 0);
        setAttendanceRows(Array.isArray(data.attendanceRows) ? data.attendanceRows : []);
        setOpenAttendanceExceptions(data.openAttendanceExceptions ?? 0);
        setPayrollDenied(Boolean(data.payroll?.denied));
        setGrossTotal(data.payroll?.grossTotal ?? 0);
        setNetTotal(data.payroll?.netTotal ?? 0);
        setDeductionsTotal(data.payroll?.deductionsTotal ?? 0);
        setMyOnboardingTasks(Array.isArray(data.myOnboardingTasks) ? data.myOnboardingTasks : []);
        setCredentialsExpiring(data.credentialsExpiring ?? 0);
        setCredentialsExpired(data.credentialsExpired ?? 0);
        setPinnedHrefs(Array.isArray(data.pinnedHrefs) ? data.pinnedHrefs : []);
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadNotifications(data.unreadNotifications ?? 0);
        setCrossModule({
          invoicesOutstanding: data.crossModule?.invoicesOutstanding ?? 0,
          vendorBillsOutstanding: data.crossModule?.vendorBillsOutstanding ?? 0,
          activeFleetTrips: data.crossModule?.activeFleetTrips ?? 0,
          openFleetIncidents: data.crossModule?.openFleetIncidents ?? 0,
          pendingPurchaseRequests: data.crossModule?.pendingPurchaseRequests ?? 0,
        });
      } finally {
        if (!cancelled) setMetricsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [activeEntity.id, entityLoading]);

  const me = sessionUser;
  const modules = sessionModules;
  const persona = useMemo(() => resolveOverviewPersona(me), [me]);

  useEffect(() => {
    setHrDetailsOpen(shouldExpandHrDetails(persona));
  }, [persona]);
  const fx = useMemo(
    () => (amount: number) => formatMoney(amount, activeEntity.currency),
    [activeEntity.currency],
  );
  const [periodLabel, setPeriodLabel] = useState('');
  const [todayLabel, setTodayLabel] = useState('');

  useEffect(() => {
    setPeriodLabel(new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }));
    setTodayLabel(
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    );
  }, []);

  const navSections = useMemo(
    () =>
      buildDashboardNavSections({
        currentUserRole: me?.role ?? null,
        hasAccountsAccess: me?.hasAccountsAccess ?? false,
        canViewSystemAnalytics: me?.canViewSystemAnalytics ?? false,
        enabledModules: modules ?? ALL_MODULES_ENABLED,
      }),
    [me, modules],
  );

  const pinnedShortcuts = useMemo(() => {
    const items = resolveDashboardNavItems(pinnedHrefs, navSections);
    return items.map((item) => ({
      href: item.href,
      label: item.label,
      desc: 'Pinned shortcut',
      icon: item.icon,
    }));
  }, [pinnedHrefs, navSections]);

  const defaultShortcuts = useMemo(
    () => buildDefaultShortcuts(me, persona, modules),
    [me, persona, modules],
  );

  const shortcuts = useMemo(() => {
    const seen = new Set<string>();
    const merged: OverviewShortcut[] = [];
    for (const item of [...pinnedShortcuts, ...defaultShortcuts]) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      merged.push(item);
      if (merged.length >= 6) break;
    }
    return merged;
  }, [pinnedShortcuts, defaultShortcuts]);

  const pinnedHrefSet = useMemo(() => new Set(pinnedHrefs), [pinnedHrefs]);

  const attentionItems = useMemo(
    () =>
      buildAttentionItems({
        pendingLeave: pendingApprovals,
        openAttendanceExceptions,
        credentialsExpiring,
        credentialsExpired,
        myOnboardingCount: myOnboardingTasks.length,
        unreadNotifications,
        crossModule,
        persona,
        modules,
      }),
    [
      pendingApprovals,
      openAttendanceExceptions,
      credentialsExpiring,
      credentialsExpired,
      myOnboardingTasks.length,
      unreadNotifications,
      crossModule,
      persona,
      modules,
    ],
  );

  const domainSnapshots = useMemo(
    () =>
      buildDomainSnapshots({
        totalStaff,
        pendingLeave: pendingApprovals,
        onDuty,
        credentialsExpiring,
        credentialsExpired,
        crossModule,
        modules,
      }),
    [
      totalStaff,
      pendingApprovals,
      onDuty,
      credentialsExpiring,
      credentialsExpired,
      crossModule,
      modules,
    ],
  );

  const attentionByDomain = useMemo(() => groupAttentionByDomain(attentionItems), [attentionItems]);

  const primaryAction = useMemo(() => {
    const urgent = pickTopAttentionAction(attentionItems);
    if (urgent) return urgent;
    return getOverviewPrimaryAction(me, persona, pendingApprovals);
  }, [attentionItems, me, persona, pendingApprovals]);
  const secondaryAction = useMemo(() => getOverviewSecondaryAction(me, persona), [me, persona]);

  const greeting = getOverviewGreeting(me?.name ?? 'there');
  const roleLabel = getOverviewRoleLabel(me);
  const subtitle = getOverviewSubtitle(persona);

  const headerActions = useMemo(() => {
    const items = [
      {
        href: primaryAction.href,
        label: primaryAction.label,
        icon: primaryAction.icon,
        variant: primaryAction.variant,
      },
    ];
    if (secondaryAction) {
      items.push({
        href: secondaryAction.href,
        label: secondaryAction.label,
        icon: secondaryAction.icon,
        variant: secondaryAction.variant,
      });
    }
    return items;
  }, [primaryAction, secondaryAction]);

  const showPayroll = shouldShowPayrollBlock(persona, payrollDenied);
  const showAttendance = modules.time !== false;
  const showHrSection = modules.core !== false || modules.time !== false || modules.payroll !== false;

  const kpiCards = useMemo(
    () =>
      buildCrossModuleKpis({
        totalStaff,
        pendingLeave: pendingApprovals,
        credentialsExpiring,
        credentialsExpired,
        crossModule,
        persona,
        modules,
      }),
    [totalStaff, pendingApprovals, credentialsExpiring, credentialsExpired, crossModule, persona, modules],
  );

  if (!me) return <OverviewSkeleton />;

  return (
    <div className="page-shell">
      <DashboardPageHeader
        variant="hero"
        badges={[
          { label: roleLabel },
          { label: activeEntity.name, icon: Building2 },
        ]}
        title={greeting}
        description={subtitle}
        meta={todayLabel || undefined}
        actions={headerActions}
        titleSuppressHydrationWarning
        metaSuppressHydrationWarning
      />

      <OverviewModuleCommandCenter
        attentionByDomain={attentionByDomain}
        domainSnapshots={domainSnapshots}
      />

      {metricsLoading ? (
        <OverviewMetricsSkeleton />
      ) : (
        <>
      {/* Needs attention */}
      {attentionItems.length > 0 ? (
        <section className="dashboard-panel p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-secondary-800">Needs attention now</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-amber-800">
              {attentionItems.length}
            </span>
          </div>
          <div className="space-y-4">
            {orderedDomains.filter((d) => (attentionByDomain[d.id]?.length ?? 0) > 0).map(
              (domain) => {
                const items = attentionByDomain[domain.id] ?? [];
                const DomainIcon = domain.icon;
                return (
                  <div key={domain.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <DomainIcon className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.75} />
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                        {domain.shortLabel}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm transition hover:opacity-90 ${attentionToneClass(item.tone)}`}
                        >
                          <div className="min-w-0">
                            <p className="font-medium">{item.label}</p>
                            <p className="mt-0.5 text-xs opacity-80">{item.detail}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      ) : null}

      {/* Cross-module KPIs */}
      {kpiCards.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between gap-3 px-0.5">
            <h2 className="text-sm font-semibold text-secondary-800">Business snapshot</h2>
            <p className="text-[11px] text-neutral-400">One signal per module</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {kpiCards.map((tile) => (
              <KpiCard key={tile.domainId} {...tile} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Main grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          {showHrSection ? (
            <div className="dashboard-panel overflow-hidden">
              <button
                type="button"
                onClick={() => setHrDetailsOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                aria-expanded={hrDetailsOpen}
              >
                <div>
                  <h2 className="text-sm font-semibold text-secondary-800">HR & Payroll details</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Attendance, payroll run, and onboarding — expand when you need people depth
                  </p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform ${hrDetailsOpen ? 'rotate-90' : ''}`}
                />
              </button>
              {hrDetailsOpen ? (
                <div className="space-y-6 border-t border-neutral-100 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
          {showAttendance ? (
            <OverviewPanelFlush
              title="Today's attendance"
              subtitle={`Live clock-ins for ${activeEntity.name}`}
              action={
                <Link
                  href="/dashboard/attendance"
                  className="text-xs font-medium text-primary-700 hover:text-primary-800"
                >
                  View all
                </Link>
              }
            >
              {attendanceRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 ring-1 ring-primary-200/50">
                    <Clock className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-700">No clock-ins yet today</p>
                  <p className="mt-1 max-w-sm text-xs text-neutral-500">
                    Staff appear here after clock-in or biometric device sync.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table dashboard-data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th className="col-center">Clock in</th>
                        <th className="col-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRows.map((r) => (
                        <tr key={r.id}>
                          <td className="col-primary font-medium text-ink">
                            {`${r.employee?.firstName ?? ''} ${r.employee?.lastName ?? ''}`.trim() || 'Unknown'}
                          </td>
                          <td className="col-center tabular-nums text-neutral-600">
                            {r.firstInAt
                              ? new Date(r.firstInAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </td>
                          <td className="col-center">
                            <span
                              className={`badge-status ${
                                Number(r.lateMinutes ?? 0) > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {Number(r.lateMinutes ?? 0) > 0 ? 'Late' : 'On time'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </OverviewPanelFlush>
          ) : null}

          {showPayroll && modules.payroll !== false ? (
            <OverviewPanel
              title="Payroll summary"
              subtitle={`${periodLabel} · ${activeEntity.currency}`}
              action={
                !payrollDenied ? (
                  <Link href="/dashboard/payroll" className="text-xs font-medium text-primary-700 hover:text-primary-800">
                    Open payroll →
                  </Link>
                ) : undefined
              }
            >
              {payrollDenied ? (
                <p className="text-sm text-neutral-600">
                  Payroll totals are restricted for your account. Contact finance or an administrator for access to{' '}
                  {activeEntity.name} payroll data.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Gross pay', value: fx(grossTotal), tint: 'from-primary-50 to-white border-primary-100 text-primary-900' },
                    { label: 'Net pay', value: fx(netTotal), tint: 'from-emerald-50 to-white border-emerald-100 text-emerald-900' },
                    { label: 'Statutory & taxes', value: fx(deductionsTotal), tint: 'from-amber-50 to-white border-amber-100 text-amber-900' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={`rounded-xl border bg-gradient-to-br px-4 py-3.5 ${row.tint}`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">{row.label}</p>
                      <p className="mt-1.5 text-xl font-semibold tabular-nums">{row.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </OverviewPanel>
          ) : null}

          {modules.core !== false ? (
            <OverviewPanel
              title="My onboarding tasks"
              action={
                <Link href="/dashboard/onboarding" className="text-xs font-medium text-primary-700 hover:text-primary-800">
                  Workspace →
                </Link>
              }
            >
              <p className="-mt-2 mb-3 text-xs tabular-nums text-neutral-400">{myOnboardingTasks.length} pending</p>
              <div className="space-y-2">
                {myOnboardingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-neutral-100/80 bg-gradient-to-r from-neutral-50/80 to-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {task.title}
                        <span className="font-normal text-neutral-500">
                          {' '}
                          · {task.workflow.employee.firstName} {task.workflow.employee.lastName}
                        </span>
                      </p>
                      <p className={`mt-0.5 text-xs tabular-nums ${task.status === 'OVERDUE' ? 'text-red-600' : 'text-neutral-500'}`}>
                        {task.status}
                        {task.dueDate ? ` · Due ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    {task.status === 'OVERDUE' ? (
                      <span className="flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">
                        Overdue
                      </span>
                    ) : null}
                  </div>
                ))}
                {myOnboardingTasks.length === 0 ? (
                  <p className="py-4 text-center text-sm text-neutral-500">You&apos;re all caught up — no pending onboarding tasks.</p>
                ) : null}
              </div>
            </OverviewPanel>
          ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <div className="dashboard-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-secondary-800">Jump to a module</h2>
              {pinnedShortcuts.length > 0 ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  <Pin className="h-3 w-3" /> Pinned first
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              {shortcuts.map((item) => (
                <ShortcutTile key={item.href} item={item} pinned={pinnedHrefSet.has(item.href)} />
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
              Pin any sidebar link to surface it here — hover a nav item and click the pin icon.
            </p>
          </div>

          <div className="dashboard-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-secondary-800">Recent updates</h2>
              {unreadNotifications > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium tabular-nums text-primary-700">
                  <Bell className="h-3 w-3" />
                  {unreadNotifications}
                </span>
              ) : null}
            </div>
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">No recent notifications.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        className={`block rounded-xl border px-3 py-2.5 transition hover:shadow-sm ${
                          n.unread
                            ? 'border-primary-200/60 bg-gradient-to-r from-primary-50/80 to-white hover:border-primary-300/60'
                            : 'border-neutral-100/80 bg-white/50 hover:border-neutral-200 hover:bg-white'
                        }`}
                      >
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        {n.body ? <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{n.body}</p> : null}
                        <p className="mt-1 text-[11px] tabular-nums text-neutral-400">{formatRelativeTime(n.createdAt)}</p>
                      </Link>
                    ) : (
                      <div
                        className={`rounded-xl border px-3 py-2.5 ${
                          n.unread
                            ? 'border-primary-200/60 bg-gradient-to-r from-primary-50/80 to-white'
                            : 'border-neutral-100/80 bg-white/50'
                        }`}
                      >
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        {n.body ? <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{n.body}</p> : null}
                        <p className="mt-1 text-[11px] tabular-nums text-neutral-400">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(credentialsExpiring > 0 || credentialsExpired > 0) && modules.core !== false ? (
            <div className="rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-50 via-amber-50/80 to-orange-50/40 p-4 shadow-sm shadow-amber-100/30">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-950">Credential compliance</p>
                  <p className="mt-1 text-xs text-amber-900/80">
                    {credentialsExpiring > 0 ? `${credentialsExpiring} expiring soon` : null}
                    {credentialsExpiring > 0 && credentialsExpired > 0 ? ' · ' : null}
                    {credentialsExpired > 0 ? `${credentialsExpired} expired` : null}
                  </p>
                  <Link href="/dashboard/credentials?status=expiring_soon" className="mt-2 inline-flex text-xs font-medium text-amber-950 underline-offset-2 hover:underline">
                    Review credentials →
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </section>
        </>
      )}
    </div>
  );
}
