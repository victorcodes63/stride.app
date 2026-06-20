import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { StudioCraftHero } from './StudioCraftHero';
import { StudioCraftIndustriesSection } from './StudioCraftIndustriesSection';
import { StudioCraftWhySection } from './StudioCraftWhySection';

export function StudioCraftHomePage() {
  return (
    <>
      <StudioCraftHero />
      <StudioCraftWhySection />
      <StudioCraftIndustriesSection />
      <MarketingFooter />
    </>
  );
}
