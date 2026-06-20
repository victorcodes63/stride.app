import type { Metadata } from 'next';

import { StudioCraftHomePage } from '@/components/marketing/v3/StudioCraftHomePage';
import { StudioCraftShell } from '@/components/marketing/v3/StudioCraftShell';

export const metadata: Metadata = {
  title: 'Stride — Move your business forward',
  description:
    'HR, finance, procurement, legal, projects and admin on one platform built for East African businesses. M-Pesa native. Compliance first.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Stride — Move your business forward',
    description:
      'HR, finance, procurement, legal, projects and admin on one platform built for East African businesses.',
    url: '/',
    type: 'website',
  },
};

export default function Home() {
  return (
    <StudioCraftShell>
      <main>
        <StudioCraftHomePage />
      </main>
    </StudioCraftShell>
  );
}
