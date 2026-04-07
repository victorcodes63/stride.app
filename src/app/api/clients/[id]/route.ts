import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getInMemoryClientById,
  updateInMemoryClient,
  deleteInMemoryClient,
} from '@/lib/clients-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Client id required' }, { status: 400 });

  try {
    if (process.env.DATABASE_URL) {
      const client = await prisma.client.findUnique({ where: { id } });
      if (client)
        return NextResponse.json({
          id: client.id,
          name: client.name,
          isAnonymous: client.isAnonymous,
          contactName: client.contactName ?? null,
          contactEmail: client.contactEmail ?? null,
          contactPhone: client.contactPhone ?? null,
        });
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
  } catch (_e) {
    // Fall through
  }
  const client = getInMemoryClientById(id);
  if (client) return NextResponse.json(client);
  return NextResponse.json({ error: 'Client not found' }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Client id required' }, { status: 400 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : undefined;
  const isAnonymous = typeof b.isAnonymous === 'boolean' ? b.isAnonymous : undefined;
  const contactName = b.contactName !== undefined ? (typeof b.contactName === 'string' ? b.contactName.trim() || null : null) : undefined;
  const contactEmail = b.contactEmail !== undefined ? (typeof b.contactEmail === 'string' ? b.contactEmail.trim() || null : null) : undefined;
  const contactPhone = b.contactPhone !== undefined ? (typeof b.contactPhone === 'string' ? b.contactPhone.trim() || null : null) : undefined;
  if (
    name === undefined &&
    isAnonymous === undefined &&
    contactName === undefined &&
    contactEmail === undefined &&
    contactPhone === undefined
  ) {
    return NextResponse.json({ error: 'Provide at least one field to update.' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (isAnonymous !== undefined) data.isAnonymous = isAnonymous;
  if (contactName !== undefined) data.contactName = contactName;
  if (contactEmail !== undefined) data.contactEmail = contactEmail;
  if (contactPhone !== undefined) data.contactPhone = contactPhone;

  try {
    if (process.env.DATABASE_URL) {
      const client = await prisma.client.update({
        where: { id },
        data,
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
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    // Fall through to in-memory
  }
  const updated = updateInMemoryClient(id, { name, isAnonymous, contactName, contactEmail, contactPhone });
  if (updated) return NextResponse.json(updated);
  return NextResponse.json({ error: 'Client not found' }, { status: 404 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Client id required' }, { status: 400 });

  try {
    if (process.env.DATABASE_URL) {
      await prisma.client.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    // Fall through
  }
  const deleted = deleteInMemoryClient(id);
  if (deleted) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: 'Client not found' }, { status: 404 });
}
