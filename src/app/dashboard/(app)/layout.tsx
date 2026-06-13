import DashboardAppLayoutClient from './DashboardAppLayoutClient';
import DashboardSidebarBrand from '@/components/dashboard/DashboardSidebarBrand';

export default function DashboardAppLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <DashboardAppLayoutClient sidebarBrand={<DashboardSidebarBrand />}>
 {children}
 </DashboardAppLayoutClient>
 );
}
