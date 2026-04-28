import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-primary-900 flex items-center gap-2 mb-2">
        <ClipboardList className="w-7 h-7 text-primary-600" />
        Tasks
      </h1>
      <p className="text-neutral-600 text-sm mb-6">Task assignment now lives in the onboarding workspace.</p>
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-600 text-sm">
        <p className="mb-3">Open workflows, templates, and assigned tasks from the onboarding module.</p>
        <Link href="/dashboard/onboarding" className="inline-flex rounded-md bg-primary-900 px-4 py-2 text-white">
          Go to onboarding
        </Link>
      </div>
    </div>
  );
}
