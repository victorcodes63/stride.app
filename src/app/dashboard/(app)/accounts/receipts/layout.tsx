import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Receipts & allocations | Eagle HR Accounts',
  description: 'Record client receipts and allocate to invoices',
};

export default function AccountsReceiptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
