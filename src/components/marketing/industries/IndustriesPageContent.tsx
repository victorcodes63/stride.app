import { IndustriesHero } from './IndustriesHero';
import { CoreVerticalPacks } from './CoreVerticalPacks';
import { IndustryDeepDiveSection } from './IndustryDeepDiveSection';
import { CoreCapabilitiesBand, StrideVsAlternativeStrip } from './IndustriesBands';
import { INDUSTRIES_CLOSING_CTA, INDUSTRY_DEEP_DIVES } from './industries-content';
import { IndustriesClosingCta } from './IndustriesClosingCta';

export function IndustriesPageContent() {
  return (
    <>
      <IndustriesHero />
      <CoreVerticalPacks />
      {INDUSTRY_DEEP_DIVES.map((industry, index) => (
        <IndustryDeepDiveSection key={industry.id} industry={industry} index={index} />
      ))}
      <CoreCapabilitiesBand />
      <StrideVsAlternativeStrip />
      <IndustriesClosingCta {...INDUSTRIES_CLOSING_CTA} />
    </>
  );
}
