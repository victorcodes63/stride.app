/** Mirrors Prisma enum `AccountsInvoicePaymentBank`. */
export type InvoicePaymentBankKind = 'payroll_only' | 'consultancy_fees';

export const INVOICE_PAYMENT_BANK_OPTIONS: {
  value: InvoicePaymentBankKind;
  label: string;
  shortLabel: string;
}[] = [
  {
    value: 'payroll_only',
    label: 'Payroll only (salary remittance & payroll-related payments)',
    shortLabel: 'Payroll only',
  },
  {
    value: 'consultancy_fees',
    label: 'Consultancy & other fees',
    shortLabel: 'Consultancy & other fees',
  },
];

export type EagleHrBankAccountDetails = {
  purposeTitle: string;
  accountName: string;
  bank: string;
  accountNumber: string;
  bankCode: string;
  branchCode: string;
  swiftCode: string;
};

/** Eagle HR Equity accounts shown on invoices (default figures; override via env if needed). */
export function getInvoiceBankDetails(kind: InvoicePaymentBankKind): EagleHrBankAccountDetails {
  const base = {
    accountName:
      process.env.EAGLE_HR_BANK_ACCOUNT_NAME?.trim() || 'Eagle HR Consultants Limited',
    bank: process.env.EAGLE_HR_BANK_NAME?.trim() || 'Equity Bank',
    bankCode: process.env.EAGLE_HR_BANK_CODE?.trim() || '068',
    branchCode: process.env.EAGLE_HR_BRANCH_CODE?.trim() || '140',
    swiftCode: process.env.EAGLE_HR_SWIFT?.trim() || 'EQBLKENYA',
  };

  if (kind === 'payroll_only') {
    return {
      purposeTitle: 'Payroll only — pay into this account',
      ...base,
      accountNumber:
        process.env.EAGLE_HR_BANK_PAYROLL_ACCOUNT?.trim() || '1400274191489',
    };
  }

  return {
    purposeTitle: 'Consultancy & other fees — pay into this account',
    ...base,
    accountNumber:
      process.env.EAGLE_HR_BANK_CONSULTANCY_ACCOUNT?.trim() || '1400284455199',
  };
}
