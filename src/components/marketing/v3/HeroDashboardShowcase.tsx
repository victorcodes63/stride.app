import { MARKETING_BRAND, MARKETING_DASHBOARD_HERO } from '@/lib/marketing-config';

/** Static hero screenshot — cropped to the top band so it stays inside the hero section. */
export function HeroDashboardShowcase() {
  const { src, width, height, alt } = MARKETING_DASHBOARD_HERO;

  return (
      <div className="sc-hero-dashboard-frame relative mx-auto w-full max-w-[1024px] overflow-hidden rounded-t-2xl border border-x border-t border-[#E6DED4] bg-[#12100E] shadow-[0_-12px_40px_-20px_rgba(26,23,20,0.12)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          fetchPriority="high"
          className="absolute left-0 top-0 block h-auto w-full max-w-none"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 sm:h-8"
          aria-hidden
          style={{
            background: `linear-gradient(to top, ${MARKETING_BRAND.paper2} 0%, transparent 100%)`,
          }}
        />
      </div>
  );
}
