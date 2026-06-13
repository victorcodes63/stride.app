import type { Metadata } from 'next';
import FinancialReportsContent from './FinancialReportsContent';

export const metadata: Metadata = {
 title: 'Financial Reports | HRIS Demo (Finance)',
};

export default function FinancialReportsPage() {
 return <FinancialReportsContent />;
}
