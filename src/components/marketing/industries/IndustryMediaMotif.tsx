'use client';

import type { ReactNode } from 'react';
import { FleetBoardMockup } from '@/components/marketing/mockups/FleetBoardMockup';
import type { IndustryDeepDive } from './industries-content';

type IndustryMediaMotifProps = {
  mediaKey: IndustryDeepDive['mediaKey'];
  className?: string;
};

function MotifFrame({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-paper-2)] shadow-[0_24px_60px_-24px_rgba(26,23,20,0.2)] ${className}`.trim()}
      role="img"
      aria-label={`${title} — ${subtitle}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--sc-line)] bg-white/60 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--sc-ink-subtle,#8A8076)]">
            {title}
          </p>
          <p className="text-sm font-medium text-[var(--sc-ink)]">{subtitle}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--sc-coral)]" aria-hidden />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function SaccosMotif({ className }: { className?: string }) {
  return (
    <MotifFrame title="SACCOs" subtitle="Member & ledger view" className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--sc-line)] bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
            Member
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--sc-ink)]">Jane Wanjiku</p>
          <p className="text-xs text-[var(--sc-ink-muted)]">#MBR-4821 · BOSA</p>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-[var(--sc-ink-subtle,#8A8076)]">Shares</span>
            <span className="font-mono font-medium text-[var(--sc-ink)]">KES 124,500</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--sc-line)] bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
            Dividend run
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--sc-ink)]">Q2 2026</p>
          <div className="mt-3 space-y-2">
            {['Posted', 'Approved', 'Disbursed'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs">
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
    </MotifFrame>
  );
}

function HealthcareMotif({ className }: { className?: string }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const shifts = [
    ['AM', 'PM', '—', 'AM', 'PM'],
    ['PM', '—', 'AM', 'PM', '—'],
    ['—', 'AM', 'PM', '—', 'AM'],
  ];

  return (
    <MotifFrame title="Healthcare" subtitle="Rota grid" className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[260px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="pb-2 text-left font-medium text-[var(--sc-ink-subtle,#8A8076)]">Unit</th>
              {days.map((d) => (
                <th key={d} className="pb-2 text-center font-medium text-[var(--sc-ink-subtle,#8A8076)]">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((row, ri) => (
              <tr key={ri}>
                <td className="py-1.5 pr-2 font-medium text-[var(--sc-ink)]">Ward {ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-0.5 text-center">
                    <span
                      className={`inline-block min-w-[2rem] rounded-md px-1.5 py-1 font-mono text-[10px] ${
                        cell === '—'
                          ? 'bg-[var(--sc-paper)] text-[var(--sc-ink-subtle,#8A8076)]'
                          : 'bg-[var(--sc-coral)]/15 text-[var(--sc-coral)]'
                      }`}
                    >
                      {cell}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotifFrame>
  );
}

function EnergyMotif({ className }: { className?: string }) {
  return (
    <MotifFrame title="Energy" subtitle="HSE & incident panel" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-[var(--sc-line)] bg-white px-3 py-2">
          <span className="text-xs font-medium text-[var(--sc-ink)]">Open incidents</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
            2 active
          </span>
        </div>
        <div className="rounded-lg border border-[var(--sc-line)] bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
            INC-204 · Kenya depot
          </p>
          <p className="mt-1 text-sm text-[var(--sc-ink)]">Spill containment — under review</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sc-paper)]">
            <div className="h-full w-2/3 rounded-full bg-[var(--sc-coral)]" />
          </div>
        </div>
        <div className="flex gap-2 text-[10px]">
          {['Kenya', 'Uganda', 'Tanzania'].map((c) => (
            <span
              key={c}
              className="rounded-full border border-[var(--sc-line)] bg-white px-2 py-1 text-[var(--sc-ink-muted)]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </MotifFrame>
  );
}

function ConstructionMotif({ className }: { className?: string }) {
  const tasks = [
    { name: 'Foundation', progress: 100 },
    { name: 'Structure', progress: 68 },
    { name: 'MEP', progress: 24 },
  ];

  return (
    <MotifFrame title="Construction" subtitle="Site & plant tracker" className={className}>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-[var(--sc-ink)]">{t.name}</span>
              <span className="font-mono text-[var(--sc-ink-subtle,#8A8076)]">{t.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--sc-paper)]">
              <div
                className="h-full rounded-full bg-[var(--sc-ink)]"
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Excavator', 'Mixer', 'Crane'].map((p, i) => (
            <div
              key={p}
              className="rounded-lg border border-[var(--sc-line)] bg-white p-2 text-center"
            >
              <p className="text-[9px] uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
                Plant
              </p>
              <p className="text-[11px] font-medium text-[var(--sc-ink)]">{p}</p>
              <p className="mt-1 font-mono text-[10px] text-[var(--sc-coral)]">
                {i === 0 ? '92%' : i === 1 ? '74%' : '41%'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MotifFrame>
  );
}

function LogisticsRouteMotif({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ''}`.trim()}>
      <FleetBoardMockup className="h-full min-h-[280px]" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 240"
        aria-hidden
      >
        <path
          d="M 40 180 Q 120 60 200 100 T 360 80"
          fill="none"
          stroke="var(--sc-coral)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <circle cx="40" cy="180" r="5" fill="var(--sc-coral)" />
        <circle cx="360" cy="80" r="5" fill="var(--sc-ink)" />
      </svg>
    </div>
  );
}

export function IndustryMediaMotif({ mediaKey, className = '' }: IndustryMediaMotifProps) {
  switch (mediaKey) {
    case 'logistics':
      return <LogisticsRouteMotif className={className} />;
    case 'saccos':
      return <SaccosMotif className={className} />;
    case 'healthcare':
      return <HealthcareMotif className={className} />;
    case 'energy':
      return <EnergyMotif className={className} />;
    case 'construction':
      return <ConstructionMotif className={className} />;
    default:
      return null;
  }
}
