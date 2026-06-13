import type { Metadata } from 'next';
import TrainingContent from './TrainingContent';

export const metadata: Metadata = {
 title: 'Training & Development | HRIS Demo Dashboard',
};

export default function TrainingPage() {
 return <TrainingContent />;
}
