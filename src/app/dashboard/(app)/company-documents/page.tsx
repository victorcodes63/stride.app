import type { Metadata } from 'next';
import CompanyDocumentsContent from './CompanyDocumentsContent';

export const metadata: Metadata = {
 title: 'Company Documents | HRIS Demo Dashboard',
};

export default function CompanyDocumentsPage() {
 return <CompanyDocumentsContent />;
}
