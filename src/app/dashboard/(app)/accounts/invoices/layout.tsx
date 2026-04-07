import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | Eagle HR Accounts',
  description: 'Accounts invoices and VAT',
};

export default function AccountsInvoicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
