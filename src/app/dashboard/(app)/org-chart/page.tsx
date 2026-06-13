import type { Metadata } from 'next';
import OrgChartContent from './OrgChartContent';

export const metadata: Metadata = {
 title: 'Org Chart | HRIS Demo Dashboard',
};

export default function OrgChartPage() {
 return <OrgChartContent />;
}
