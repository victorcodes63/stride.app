import type { Metadata } from 'next';
import PettyCashContent from './PettyCashContent';

export const metadata: Metadata = {
 title: 'Petty Cash | HRIS Demo (Finance)',
};

export default function PettyCashPage() {
 return <PettyCashContent />;
}
