'use client';

const COLUMNS = [
  {
    id: 'planned',
    label: 'Planned',
    cards: [
      { ref: 'TRP-2841', route: 'Nairobi → Mombasa', vehicle: 'KCA 482K' },
      { ref: 'TRP-2844', route: 'Kisumu → Eldoret', vehicle: 'KDG 119A' },
    ],
  },
  {
    id: 'in_transit',
    label: 'In transit',
    cards: [{ ref: 'TRP-2836', route: 'Thika → Malaba', vehicle: 'KBY 903R', active: true }],
  },
  {
    id: 'delivered',
    label: 'Delivered',
    cards: [{ ref: 'TRP-2829', route: 'Nairobi CBD → JKIA', vehicle: 'KCF 771M' }],
  },
] as const;

export function FleetBoardWireframe({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-full min-h-[200px] gap-2 overflow-x-auto ${className}`.trim()}>
      {COLUMNS.map((column) => (
        <section
          key={column.id}
          className="min-w-[100px] flex-1 rounded-lg border border-[var(--sc-line)] bg-[var(--sc-paper)]"
        >
          <header className="flex items-center justify-between border-b border-[var(--sc-line)] px-2 py-1.5">
            <h3 className="text-[8px] font-semibold uppercase tracking-wide text-[var(--sc-ink-subtle,#8A8076)]">
              {column.label}
            </h3>
            <span className="rounded-full bg-[var(--sc-paper-2)] px-1.5 py-0.5 text-[8px] text-[var(--sc-ink-muted)]">
              {column.cards.length}
            </span>
          </header>
          <ul className="space-y-1.5 p-1.5">
            {column.cards.map((card) => (
              <li
                key={card.ref}
                className={`rounded-md border px-2 py-1.5 ${
                  'active' in card && card.active
                    ? 'border-[var(--sc-coral)]/35 bg-[var(--sc-coral)]/10'
                    : 'border-[var(--sc-line)] bg-white'
                }`}
              >
                <p className="text-[9px] font-semibold text-[var(--sc-ink)]">{card.ref}</p>
                <p className="mt-0.5 text-[8px] leading-snug text-[var(--sc-ink-muted)]">{card.route}</p>
                <p className="mt-1 text-[8px] font-medium text-[var(--sc-coral)]">{card.vehicle}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
