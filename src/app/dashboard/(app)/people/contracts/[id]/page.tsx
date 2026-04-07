import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contract | Eagle HR Dashboard',
};

export default async function PeopleContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
          <li>
            <Link href="/dashboard/people/contracts" className="hover:text-primary-700 transition-colors">
              Contracts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium truncate max-w-[12rem] sm:max-w-md" aria-current="page">
            Contract detail
          </li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-primary-900 tracking-tight">Contract</h1>
      <p className="mt-2 text-neutral-600 text-sm">
        Detail view for contract <span className="font-mono text-xs">{id}</span> — wire-up with Prisma and forms is
        next. Notifications link here after reminders run.
      </p>
    </div>
  );
}
