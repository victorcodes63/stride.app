import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireDashboardAdmin } from '@/lib/require-dashboard-admin';
import { recruitmentPortalUserToSummary } from '@/lib/recruitment-portal-user-api';

const ROUNDS = 10;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminError = await requireDashboardAdmin(request);
  if (adminError) return adminError;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Id required' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : undefined;
  const clientId = typeof b.clientId === 'string' ? b.clientId.trim() : undefined;
  const notes =
    b.notes === null ? null : typeof b.notes === 'string' ? b.notes.trim() || null : undefined;
  const isActive = typeof b.isActive === 'boolean' ? b.isActive : undefined;
  const password = typeof b.password === 'string' ? b.password : undefined;

  if (password !== undefined && password !== '' && password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }

    const existing = await prisma.recruitmentClientPortalUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (clientId !== undefined) {
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) {
        return NextResponse.json({ error: 'Recruitment client not found.' }, { status: 400 });
      }
    }

    const data: {
      name?: string;
      clientId?: string;
      notes?: string | null;
      isActive?: boolean;
      passwordHash?: string;
    } = {};
    if (name !== undefined) {
      if (!name) {
        return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
      }
      data.name = name;
    }
    if (clientId !== undefined) data.clientId = clientId;
    if (notes !== undefined) data.notes = notes;
    if (isActive !== undefined) data.isActive = isActive;
    if (password && password.length >= 6) {
      data.passwordHash = await bcrypt.hash(password, ROUNDS);
    }

    if (Object.keys(data).length === 0) {
      const row = await prisma.recruitmentClientPortalUser.findUniqueOrThrow({
        where: { id },
        include: { client: { select: { id: true, name: true } } },
      });
      return NextResponse.json(recruitmentPortalUserToSummary(row));
    }

    const row = await prisma.recruitmentClientPortalUser.update({
      where: { id },
      data,
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(recruitmentPortalUserToSummary(row));
  } catch (e) {
    console.error('PATCH /api/recruitment-client-portal-users/[id] error:', e);
    return NextResponse.json({ error: 'Failed to update recruitment client login.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminError = await requireDashboardAdmin(request);
  if (adminError) return adminError;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Id required' }, { status: 400 });

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }
    await prisma.recruitmentClientPortalUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('DELETE /api/recruitment-client-portal-users/[id] error:', e);
    return NextResponse.json({ error: 'Failed to delete recruitment client login.' }, { status: 500 });
  }
}
