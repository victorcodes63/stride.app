import { ClipboardList } from 'lucide-react';

export default function AssignedTasksPage() {
  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-primary-900 flex items-center gap-2 mb-2">
        <ClipboardList className="w-7 h-7 text-primary-600" />
        Assigned tasks
      </h1>
      <p className="text-neutral-600 text-sm mb-6">
        Part of <strong>People & HR</strong> — task assignment and tracking for internal staff (coming next).
      </p>
      <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">
        Placeholder. Wire up tasks, due dates, and owners here.
      </div>
    </div>
  );
}
