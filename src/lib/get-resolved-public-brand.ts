import { cookies } from 'next/headers';
import { loadCompanySetupSettings } from '@/lib/company-setup';
import { resolvePublicBrand } from '@/lib/resolve-public-brand';
import type { PublicBrand } from '@/lib/brand';
import { HRIS_ENTITY_COOKIE } from '@/lib/entity-constants';
import { parseDemoEntitySlug } from '@/lib/demo-entity-slug';

export async function getResolvedPublicBrand(): Promise<PublicBrand> {
  const cookieStore = await cookies();
  const entitySlug = cookieStore.get(HRIS_ENTITY_COOKIE)?.value ?? null;
  const { contextId } = parseDemoEntitySlug(entitySlug);
  const setup = await loadCompanySetupSettings(contextId);
  return resolvePublicBrand(setup);
}
