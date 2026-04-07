import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryClients,
  createInMemoryClient,
  CreateClientInput,
} from '@/lib/clients-store';
import { getInMemoryJobCountByClient } from '@/lib/jobs-store';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const list = await prisma.client.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { jobs: true } } },
      });
      return NextResponse.json(
        list.map((c) => ({
          id: c.id,
          name: c.name,
          isAnonymous: c.isAnonymous,
          contactName: c.contactName ?? null,
          contactEmail: c.contactEmail ?? null,
          contactPhone: c.contactPhone ?? null,
          jobCount: c._count.jobs,
        }))
      );
    }
  } catch (_e) {
    // Fall through to in-memory
  }
  const list = getInMemoryClients();
  const jobCountByClient = getInMemoryJobCountByClient();
  return NextResponse.json(
    list.map((c) => ({
      ...c,
      jobCount: jobCountByClient[c.id] ?? 0,
    }))
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const isAnonymous = b.isAnonymous === true;
  const contactName = typeof b.contactName === 'string' ? b.contactName.trim() || null : null;
  const contactEmail = typeof b.contactEmail === 'string' ? b.contactEmail.trim() || null : null;
  const contactPhone = typeof b.contactPhone === 'string' ? b.contactPhone.trim() || null : null;
  if (!name) {
    return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
  }
  const input: CreateClientInput = { name, isAnonymous, contactName, contactEmail, contactPhone };

  try {
    if (process.env.DATABASE_URL) {
      const client = await prisma.client.create({
        data: {
          name: input.name,
          isAnonymous: input.isAnonymous,
          contactName: input.contactName ?? undefined,
          contactEmail: input.contactEmail ?? undefined,
          contactPhone: input.contactPhone ?? undefined,
        },
      });
      return NextResponse.json({
        id: client.id,
        name: client.name,
        isAnonymous: client.isAnonymous,
        contactName: client.contactName ?? null,
        contactEmail: client.contactEmail ?? null,
        contactPhone: client.contactPhone ?? null,
      });
    }
  } catch (_e) {
    // Fall through to in-memory
  }
  const client = createInMemoryClient(input);
  return NextResponse.json(client);
}
