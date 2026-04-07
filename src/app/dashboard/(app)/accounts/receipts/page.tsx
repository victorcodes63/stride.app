import type { Metadata } from 'next';
import AccountsModulePlaceholder from '@/components/dashboard/accounts/AccountsModulePlaceholder';

export const metadata: Metadata = {
  title: 'Receipts | Eagle HR Accounts',
};

export default function AccountsReceiptsPage() {
  return (
    <AccountsModulePlaceholder
      title="Receipts & allocations"
      summary="Record client payments and allocate them to one or more invoices (including partial allocations) to keep debtor balances accurate."
    />
  );
}
