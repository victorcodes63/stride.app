import { TrendingUp } from 'lucide-react';

export default function PerformancePage() {
  return (
    <div className="w-full min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-primary-900 flex items-center gap-2 mb-2">
        <TrendingUp className="w-7 h-7 text-primary-600" />
        Performance management
      </h1>
      <p className="text-neutral-600 text-sm mb-6">
        Part of <strong>People & HR</strong> — goals, reviews, and cycles (coming next).
      </p>
      <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">
        Placeholder. Add review cycles, OKRs, or 1:1 notes here.
      </div>
    </div>
  );
}
