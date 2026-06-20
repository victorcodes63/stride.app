'use client';

import { useState } from 'react';
import { MarketingEyebrow } from '@/components/marketing/MarketingEyebrow';

type FaqItem = { question: string; answer: string };

export function MarketingFaq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-pub-surface px-6 py-[72px] sm:px-12 lg:py-[110px]">
      <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[380px_1fr] lg:gap-20">
        <div>
          <MarketingEyebrow className="mb-5">FAQ</MarketingEyebrow>
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-1.5px] text-pub-ink">
            Questions, answered.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pub-ink-muted">
            Straight answers about compliance, modules, and getting started.
          </p>
        </div>

        <div>
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question} className="border-b border-pub-border first:border-t">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-5 py-6 text-left font-heading text-lg font-semibold tracking-tight text-pub-ink"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  {item.question}
                  <span
                    className="relative h-[18px] w-[18px] shrink-0 text-[var(--pub-primary)]"
                    aria-hidden
                  >
                    <span className="absolute left-0 top-[9px] h-0.5 w-5 rounded bg-current" />
                    <span
                      className={`absolute left-[9px] top-0 h-5 w-0.5 rounded bg-current transition-opacity ${
                        open ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all ${
                    open ? 'max-h-64 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed text-pub-ink-muted">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
