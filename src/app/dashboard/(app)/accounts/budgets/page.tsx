import type { Metadata } from 'next';
import BudgetsContent from './BudgetsContent';

export const metadata: Metadata = {
 title: 'Budgets | HRIS Demo (Finance)',
};

export default function BudgetsPage() {
 return <BudgetsContent />;
}
