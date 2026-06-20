'use client';

import type { ReactNode } from 'react';
import {
  MARKETING_VERTICAL_SCREENSHOTS,
  marketingAppHostLabel,
  type MarketingVerticalScreenshotId,
} from '@/lib/marketing-config';

type IndustryWireframePreviewProps = {
  industryId: MarketingVerticalScreenshotId;
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#12100E] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#1C1916] px-2.5 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" aria-hidden />
        <span className="ml-1 flex-1 truncate text-center text-[9px] text-white/45">
          {marketingAppHostLabel(path)}
        </span>
      </div>
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#1C1916] px-3 py-2">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/40">
            {moduleLabel}
          </p>
          <p className="text-xs font-medium text-white/90">{screenTitle}</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--sc-coral)]" aria-hidden />
      </div>
      <div className="flex-1 bg-[#12100E] p-2.5 sm:p-3">{children}</div>
    </div>
  );
}

export function IndustryWireframePreview({ industryId, className = '' }: IndustryWireframePreviewProps) {
  const shot = MARKETING_VERTICAL_SCREENSHOTS[industryId];

  return (
    <div className={`h-full ${className}`.trim()}>
      <WireframeShell
        moduleLabel={shot.moduleLabel}
        screenTitle={shot.screenTitle}
        path={shot.path}
      >
        <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-[#1C1916]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt={shot.alt}
            className="h-full w-full object-cover object-top"
            decoding="async"
          />
        </div>
      </WireframeShell>
    </div>
  );
}
