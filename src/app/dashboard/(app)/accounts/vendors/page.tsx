import type { Metadata } from 'next';
import AccountsModulePlaceholder from '@/components/dashboard/accounts/AccountsModulePlaceholder';

export const metadata: Metadata = {
  title: 'Vendors | Eagle HR Accounts',
};

export default function AccountsVendorsPage() {
  return (
    <AccountsModulePlaceholder
      title="Vendors & bills"
      summary="Creditors: vendor master data, bills with lines, payments, and allocations—parallel to the client/debtor side."
    />
  );
}
