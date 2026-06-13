import type { DemoPack, DemoPackId } from './types';
import { genericPack } from './generic/pack';
import { petroleumRetailPack } from './petroleum-retail/pack';

const PACKS: Record<DemoPackId, DemoPack> = {
  generic: genericPack,
  'petroleum-retail': petroleumRetailPack,
};

export const DEMO_PACK_IDS = Object.keys(PACKS) as DemoPackId[];

export function resolveDemoPackId(raw?: string | null): DemoPackId {
  const value = (raw ?? process.env.DEMO_PACK ?? 'generic').trim().toLowerCase();
  if (value in PACKS) return value as DemoPackId;
  const available = DEMO_PACK_IDS.join(', ');
  throw new Error(`Unknown DEMO_PACK "${raw ?? value}". Available packs: ${available}`);
}

export function loadDemoPack(packId?: string | null): DemoPack {
  const id = resolveDemoPackId(packId);
  const pack = PACKS[id];
  console.log(`→ Demo pack: ${pack.label} (${pack.id})`);
  return pack;
}
