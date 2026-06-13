'use client';

import { usePublicBrand } from '@/components/BrandProvider';

const toneClasses = {
  info: 'bg-secondary-50 border-secondary-200 text-secondary-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
};

export function DashboardSetupBanner() {
  const brand = usePublicBrand();
  if (!brand.dashboardBannerEnabled || !brand.dashboardBannerText.trim()) return null;
  const tone = toneClasses[brand.dashboardBannerTone] ?? toneClasses.info;
  return (
    <div className={`mb-5 sm:mb-6 dashboard-surface px-4 py-3 text-sm shadow-sm ${tone}`} role="status">
      {brand.dashboardBannerText}
    </div>
  );
}
