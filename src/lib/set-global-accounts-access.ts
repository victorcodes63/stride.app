import { prisma } from '@/lib/prisma';

export type GlobalAccountsPermInput = {
  canManageContracts: boolean;
  canManageInvoices: boolean;
  canManagePayments: boolean;
  canManageVendors: boolean;
};

/** Single global AccountsStaffAccess row (accountsClientId null). Removes row if all flags false. */
export async function setUserGlobalAccountsAccess(
  userId: string,
  perms: GlobalAccountsPermInput,
): Promise<void> {
  const any =
    perms.canManageContracts ||
    perms.canManageInvoices ||
    perms.canManagePayments ||
    perms.canManageVendors;

  const existing = await prisma.accountsStaffAccess.findFirst({
    where: { userId, accountsClientId: null },
  });

  if (!any) {
    if (existing) {
      await prisma.accountsStaffAccess.delete({ where: { id: existing.id } });
    }
    return;
  }

  if (existing) {
    await prisma.accountsStaffAccess.update({
      where: { id: existing.id },
      data: {
        canManageContracts: perms.canManageContracts,
        canManageInvoices: perms.canManageInvoices,
        canManagePayments: perms.canManagePayments,
        canManageVendors: perms.canManageVendors,
      },
    });
  } else {
    await prisma.accountsStaffAccess.create({
      data: {
        userId,
        accountsClientId: null,
        canManageContracts: perms.canManageContracts,
        canManageInvoices: perms.canManageInvoices,
        canManagePayments: perms.canManagePayments,
        canManageVendors: perms.canManageVendors,
      },
    });
  }
}

export async function deleteGlobalAccountsAccessIfExists(userId: string): Promise<void> {
  const existing = await prisma.accountsStaffAccess.findFirst({
    where: { userId, accountsClientId: null },
  });
  if (existing) {
    await prisma.accountsStaffAccess.delete({ where: { id: existing.id } });
  }
}
