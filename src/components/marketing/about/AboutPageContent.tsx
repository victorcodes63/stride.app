import { AboutFinalCta } from './AboutFinalCta';
import { AboutHero } from './AboutHero';
import {
  AboutPrinciplesSection,
  AboutRolloutSection,
  AboutStatsBand,
  AboutStorySection,
} from './AboutSections';

export function AboutPageContent() {
  return (
    <>
      <AboutHero />
      <AboutStorySection />
      <AboutStatsBand />
      <AboutPrinciplesSection />
      <AboutRolloutSection />
      <AboutFinalCta />
    </>
  );
}
