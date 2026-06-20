'use client';

import type { ReactNode } from 'react';
import { marketingAppHostLabel } from '@/lib/marketing-config';
import { FleetBoardWireframe } from './FleetBoardWireframe';

type IndustryWireframePreviewProps = {
  industryId: 'logistics' | 'saccos' | 'healthcare' | 'energy' | 'construction';
  className?: string;
};

function WireframeShell({
  moduleLabel,
  screenTitle,
  path,
  children,
}: {
  moduleLabel: string;
  screenTitle: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--sc-line)] bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-[var(--sc-line)] bg-[var(--sc-paper)] px-2.5 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" aria-hidden />
        <span className="ml-1 flex-1 truncate text-center text-[9px] text-[var(--sc-ink-subtle,#8A8076)]">
          {marketingAppHostLabel(path)}
        </span>
      </div>
      <div className="flex items-center justify-between border-b border-[var(--sc-line)] bg-white px-3 py-2">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--sc-ink-subtle,#8A8076)]">
            {moduleLabel}
          </p>
          <p className="text-xs font-medium text-[var(--sc-ink)]">{screenTitle}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--sc-coral)]" aria-hidden />
      </div>
      <div className="flex-1 bg-[var(--sc-paper-2)] p-2.5 sm:p-3">{children}</div>
    </div>
  );
}

function SaccosWireframe() {
  return (
    <div className="grid h-full min-h-[200px] gap-2 sm:grid-cols-2">
      <div className="rounded-lg border border-[var(--sc-line)] bg-white p-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
          Member
        </p>
        <p className="mt-1 text-xs font-medium text-[var(--sc-ink)]">Jane Wanjiku</p>
        <p className="text-[10px] text-[var(--sc-ink-muted)]">#MBR-4821 · BOSA</p>
        <div className="mt-2 flex justify-between border-t border-[var(--sc-line)] pt-2 text-[10px]">
          <span className="text-[var(--sc-ink-subtle,#8A8076)]">Shares</span>
          <span className="font-mono font-medium text-[var(--sc-ink)]">KES 124,500</span>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--sc-line)] bg-white p-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
          Dividend run
        </p>
        <p className="mt-1 text-xs font-medium text-[var(--sc-ink)]">Q2 2026</p>
        <div className="mt-2 space-y-1.5">
          {['Posted', 'Approved', 'Disbursed'].map((step, i) => (
            <div key={step} className="flex items-center gap-1.5 text-[10px]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${i < 2 ? 'bg-[var(--sc-coral)]' : 'bg-[var(--sc-line)]'}`}
              />
              <span className={i < 2 ? 'text-[var(--sc-ink)]' : 'text-[var(--sc-ink-subtle,#8A8076)]'}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IndustryWireframePreview({ industryId, className = '' }: IndustryWireframePreviewProps) {
  const previews: Record<IndustryWireframePreviewProps['industryId'], ReactNode> = {
    logistics: (
      <WireframeShell moduleLabel="Fleet & logistics" screenTitle="Trip board" path="/fleet/trips">
        <FleetBoardWireframe />
      </WireframeShell>
    ),
    saccos: (
      <WireframeShell moduleLabel="SACCOs" screenTitle="Member & ledger" path="/saccos/members">
        <SaccosWireframe />
      </WireframeShell>
    ),
    healthcare: (
      <WireframeShell moduleLabel="Healthcare" screenTitle="Rota grid" path="/rota">
        <div className="rounded-lg border border-[var(--sc-line)] bg-white p-2 text-[10px] text-[var(--sc-ink-muted)]">
          Shift scheduling wireframe
        </div>
      </WireframeShell>
    ),
    energy: (
      <WireframeShell moduleLabel="Energy" screenTitle="HSE panel" path="/hse">
        <div className="rounded-lg border border-[var(--sc-line)] bg-white p-2 text-[10px] text-[var(--sc-ink-muted)]">
          Incident tracking wireframe
        </div>
      </WireframeShell>
    ),
    construction: (
      <WireframeShell moduleLabel="Construction" screenTitle="Site tracker" path="/projects">
        <div className="rounded-lg border border-[var(--sc-line)] bg-white p-2 text-[10px] text-[var(--sc-ink-muted)]">
          Plant & site wireframe
        </div>
      </WireframeShell>
    ),
  };

  return <div className={`h-full ${className}`.trim()}>{previews[industryId]}</div>;
}
