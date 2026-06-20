'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  type DashboardModuleDomain,
} from '@/lib/dashboard-module-domains';
import { useDashboardModuleOrder } from '@/contexts/dashboard-module-order';
import type { OverviewAttentionItem, OverviewDomainSnapshot } from '@/lib/dashboard-overview-personalization';
import { domainReadinessDotClass } from '@/lib/dashboard-nav-readiness';

type OverviewModuleCommandCenterProps = {
  attentionByDomain: Partial<Record<string, OverviewAttentionItem[]>>;
  domainSnapshots: OverviewDomainSnapshot[];
};

function ModuleCard({
  domain,
  items,
  snapshotLines,
}: {
  domain: DashboardModuleDomain;
  items: OverviewAttentionItem[];
  snapshotLines: string[];
}) {
  const Icon = domain.icon;
  const needsAction = items.length > 0;

  return (
    <Link
      href={domain.hubHref}
      className={`group flex flex-col rounded-xl border p-4 transition hover:shadow-md ${
        needsAction
          ? 'border-amber-200/80 bg-gradient-to-br from-white to-amber-50/40 hover:border-amber-300'
          : 'border-neutral-200/80 bg-white hover:border-primary-200 hover:bg-primary-50/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="dash-icon-well flex h-9 w-9 items-center justify-center rounded-lg">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        {needsAction ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-amber-900">
            {items.length}
          </span>
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="All clear" />
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{domain.shortLabel}</p>
      {needsAction ? (
        <ul className="mt-2 space-y-1">
          {items.slice(0, 2).map((item) => (
            <li key={item.id} className="text-[11px] leading-snug text-neutral-600">
              <span className="font-medium text-neutral-800">{item.label}</span>
              <span className="text-neutral-500"> — {item.detail}</span>
            </li>
          ))}
          {items.length > 2 ? (
            <li className="text-[11px] font-medium text-primary-700">+{items.length - 2} more</li>
          ) : null}
        </ul>
      ) : (
        <ul className="mt-2 space-y-0.5">
          {snapshotLines.slice(0, 2).map((line) => (
            <li key={line} className="text-[11px] text-neutral-500">
              {line}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-700 opacity-80 group-hover:opacity-100">
        Open module
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

export function OverviewModuleCommandCenter({
  attentionByDomain,
  domainSnapshots,
}: OverviewModuleCommandCenterProps) {
  const { orderedDomains } = useDashboardModuleOrder();
  const snapshotByDomain = Object.fromEntries(domainSnapshots.map((s) => [s.domainId, s.lines]));
  return (
    <section className="dashboard-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-secondary-800">Across your business</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            What needs you today, by module — click to jump in. Use the module switcher anytime to change context.
          </p>
        </div>
        <p className="flex items-center gap-3 text-[10px] text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${domainReadinessDotClass('live')}`} />
            Live
          </span>
          <span className="inline-flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${domainReadinessDotClass('partial')}`} />
            Partial
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {orderedDomains.map((domain) => (
          <ModuleCard
            key={domain.id}
            domain={domain}
            items={attentionByDomain[domain.id] ?? []}
            snapshotLines={snapshotByDomain[domain.id] ?? ['Open module']}
          />
        ))}
      </div>
    </section>
  );
}
