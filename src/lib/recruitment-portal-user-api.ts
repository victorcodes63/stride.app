import type { RecruitmentClientPortalUserSummary } from '@/types/dashboard';
import type { RecruitmentClientPortalUser } from '@prisma/client';

type RowWithClient = RecruitmentClientPortalUser & {
  client: { id: string; name: string };
};

export function recruitmentPortalUserToSummary(row: RowWithClient): RecruitmentClientPortalUserSummary {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    clientId: row.clientId,
    clientName: row.client.name,
    isActive: row.isActive,
    notes: row.notes ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
