import type { Metadata } from 'next';
import AnnouncementsContent from './AnnouncementsContent';

export const metadata: Metadata = {
 title: 'Announcements | HRIS Demo Dashboard',
};

export default function AnnouncementsPage() {
 return <AnnouncementsContent />;
}
