import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ClientDetailView from './ClientDetailView';

export default async function OutsourcingClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();
  return (
    <Suspense fallback={<div className="animate-pulse h-32 bg-neutral-100 rounded-2xl" />}>
      <ClientDetailView clientId={id} />
    </Suspense>
  );
}
