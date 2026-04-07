import type { Metadata } from 'next';
import Link from 'next/link';
import { FileSignature } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contracts | Eagle HR',
};

export default function PeopleContractsListPage() {
  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 sm:mb-5" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard" className="hover:text-primary-700 transition-colors">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/dashboard/staff-leave" className="hover:text-primary-700 transition-colors">
              People & HR
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            Contracts
          </li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-primary-900 tracking-tight flex items-center gap-2">
        <FileSignature className="w-8 h-8 text-primary-600 hidden sm:block" />
        Contracts
      </h1>
      <p className="mt-3 text-neutral-600 text-sm leading-relaxed">
        Monitor engagement end dates, assign contract managers, and use automated in-app reminders (milestones
        and weekly after expiry until disabled).
      </p>
    </div>
  );
}
