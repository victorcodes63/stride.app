'use client';

import { Briefcase, CalendarCheck, ClipboardText } from '@phosphor-icons/react';
import { PubFeatureCallout } from '@/components/public/PubDuotoneIcon';

const HIGHLIGHTS = [
  {
    icon: Briefcase,
    title: 'Open roles only',
    description: 'Every listing is an active vacancy with department, location, and type.',
  },
  {
    icon: CalendarCheck,
    title: 'Clear deadlines',
    description: 'Closing dates are shown upfront so candidates know when to apply.',
  },
  {
    icon: ClipboardText,
    title: 'Structured hiring',
    description: 'Applications follow a consistent screening and interview workflow.',
  },
] as const;

export default function CareersHighlights() {
  return (
    <section className="border-b border-pub-border bg-white py-10 md:py-12">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title}>
              <PubFeatureCallout {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
