import Link from 'next/link';

export default function AccountsModulePlaceholder({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 sm:mb-5" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard/accounts" className="hover:text-primary-700 transition-colors">
              Accounts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-primary-900 tracking-tight">{title}</h1>
      <p className="mt-3 text-neutral-600 text-sm leading-relaxed">{summary}</p>
    </div>
  );
}
