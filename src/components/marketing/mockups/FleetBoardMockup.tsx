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
    cards: [
      { ref: 'TRP-2836', route: 'Thika → Malaba', vehicle: 'KBY 903R', active: true },
    ],
  },
  {
    id: 'delivered',
    label: 'Delivered',
    cards: [{ ref: 'TRP-2829', route: 'Nairobi CBD → JKIA', vehicle: 'KCF 771M' }],
  },
] as const;

export function FleetBoardMockup({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#E6DED4] bg-[#1A1714] shadow-[0_24px_60px_-24px_rgba(26,23,20,0.35)] ${className}`.trim()}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
            Fleet & Logistics
          </p>
          <p className="text-xs font-medium text-white">Trip board</p>
        </div>
        <span className="rounded-full bg-[#FF5436]/20 px-2 py-0.5 text-[9px] font-medium text-[#FF8A6E]">
          6 active
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto p-2.5 sm:p-3">
        {COLUMNS.map((column) => (
          <section
            key={column.id}
            className="min-w-[108px] flex-1 rounded-lg border border-white/10 bg-white/[0.04]"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
              <h3 className="text-[8px] font-semibold uppercase tracking-wide text-white/55">
                {column.label}
              </h3>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] text-white/60">
                {column.cards.length}
              </span>
            </header>
            <ul className="space-y-1.5 p-1.5">
              {column.cards.map((card) => (
                <li
                  key={card.ref}
                  className={`rounded-md border px-2 py-1.5 ${
                    'active' in card && card.active
                      ? 'border-[#FF5436]/40 bg-[#FF5436]/10'
                      : 'border-white/10 bg-white/[0.06]'
                  }`}
                >
                  <p className="text-[9px] font-semibold text-white">{card.ref}</p>
                  <p className="mt-0.5 text-[8px] leading-snug text-white/60">{card.route}</p>
                  <p className="mt-1 text-[8px] font-medium text-[#FF8A6E]">{card.vehicle}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
