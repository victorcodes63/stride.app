import { PrismaClient } from '@prisma/client';
import {
  OPERATING_ENTITIES_SETTINGS_KEY,
  sanitizeOperatingEntitiesSettings,
} from '../src/lib/operating-entities';

const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.outsourcingClient.findMany({
    where: {
      OR: [{ entityCode: { endsWith: '__ke' } }, { entityCode: { endsWith: '__ug' } }],
    },
    orderBy: [{ entityCode: 'asc' }],
  });

  const entities = clients.map((client) => {
    const slug = client.entityCode!.toLowerCase();
    const countryCode = slug.endsWith('__ug') ? 'UG' : 'KE';
    return {
      id: slug,
      legalName: client.name,
      countryCode,
      currency: client.currency ?? (countryCode === 'UG' ? 'UGX' : 'KES'),
      employeeNumberPrefix: client.employeeNumberPrefix ?? 'EMP',
      isActive: true,
    };
  });

  const settings = sanitizeOperatingEntitiesSettings({
    multiEntityEnabled: true,
    defaultEntityId: entities[0]?.id ?? 'generic__ke',
    entities,
  });

  await prisma.systemSetting.upsert({
    where: { key: OPERATING_ENTITIES_SETTINGS_KEY },
    update: { value: settings },
    create: { key: OPERATING_ENTITIES_SETTINGS_KEY, value: settings },
  });

  console.log(`Updated switcher with ${entities.length} contexts:`);
  for (const e of entities) console.log(`  · ${e.legalName} (${e.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
