import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { MarketingFaq } from '@/components/marketing/sections/MarketingFaq';
import { MarketingFinalCta } from '@/components/marketing/sections/MarketingFinalCta';
import { MarketingHowSection } from '@/components/marketing/sections/MarketingHowSection';
import { MarketingPricingSection } from '@/components/marketing/sections/MarketingPricingSection';
import { FAQ_ITEMS } from '@/lib/marketing-config';
import { StudioCraftHero } from './StudioCraftHero';
import { StudioCraftIndustriesSection } from './StudioCraftIndustriesSection';
import { StudioCraftWhySection } from './StudioCraftWhySection';

export function StudioCraftHomePage() {
  return (
    <>
      <StudioCraftHero />
      <StudioCraftWhySection />
      <StudioCraftIndustriesSection />
      <MarketingHowSection />
      <MarketingPricingSection />
      <MarketingFaq items={FAQ_ITEMS} />
      <MarketingFinalCta />
      <MarketingFooter />
    </>
  );
}
