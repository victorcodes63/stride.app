import { cookies } from 'next/headers';
import { loadCompanySetupSettings, toPublicCompanySetup } from '@/lib/company-setup';
import { HRIS_ENTITY_COOKIE } from '@/lib/entity-constants';
import { parseDemoEntitySlug } from '@/lib/demo-entity-slug';

export type LoginWelcomeCopy = {
  staff: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    emailLoginEnabled: boolean;
  };
  ess: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    portalTitle: string;
    emailLoginEnabled: boolean;
  };
};

export async function getLoginWelcomeCopy(): Promise<LoginWelcomeCopy> {
  const cookieStore = await cookies();
  const entitySlug = cookieStore.get(HRIS_ENTITY_COOKIE)?.value ?? null;
  const { contextId } = parseDemoEntitySlug(entitySlug);
  const setup = await loadCompanySetupSettings(contextId);
  const pub = toPublicCompanySetup(setup);
  return {
    staff: {
      welcomeTitle: pub.staff.welcomeTitle,
      welcomeSubtitle: pub.staff.welcomeSubtitle,
      emailLoginEnabled: pub.staff.emailLoginEnabled,
    },
    ess: {
      welcomeTitle: pub.ess.welcomeTitle,
      welcomeSubtitle: pub.ess.welcomeSubtitle,
      portalTitle: pub.ess.portalTitle,
      emailLoginEnabled: pub.ess.emailLoginEnabled,
    },
  };
}
