'use client';

import { CalendarDays } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function OutsourcingLeavePage() {
 return (
 <div className="page-shell">
 <DashboardPageHeader
 title="Leave Management"
 description="Leave types, balances, and applications."
 />

 <div className="dashboard-surface shadow-sm p-8 text-center">
 <CalendarDays className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
 <h2 className="text-lg font-semibold text-neutral-800 mb-2">Coming soon</h2>
 <p className="text-neutral-600 text-sm max-w-md mx-auto">
 Annual, sick, maternity, paternity, and compassionate leave with balance tracking and
 approvals will be available here.
 </p>
 </div>
 </div>
 );
}
