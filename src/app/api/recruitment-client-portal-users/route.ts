import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireDashboardAdmin } from '@/lib/require-dashboard-admin';
import { recruitmentPortalUserToSummary } from '@/lib/recruitment-portal-user-api';

const ROUNDS = 10;

export async function GET(request: NextRequest) {
  const adminError = await requireDashboardAdmin(request);
  if (adminError) return adminError;

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }
    const rows = await prisma.recruitmentClientPortalUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(rows.map(recruitmentPortalUserToSummary));
  } catch (e) {
    console.error('GET /api/recruitment-client-portal-users error:', e);
    return NextResponse.json({ error: 'Failed to load recruitment client logins.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminError = await requireDashboardAdmin(request);
  if (adminError) return adminError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const password = typeof b.password === 'string' ? b.password : '';
  const clientId = typeof b.clientId === 'string' ? b.clientId.trim() : '';
  const notes = typeof b.notes === 'string' ? b.notes.trim() || null : null;
  const isActive = typeof b.isActive === 'boolean' ? b.isActive : true;

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }
  if (!clientId) {
    return NextResponse.json({ error: 'Recruitment client is required.' }, { status: 400 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json({ error: 'Recruitment client not found.' }, { status: 400 });
    }

    const existingPortal = await prisma.recruitmentClientPortalUser.findUnique({ where: { email } });
    if (existingPortal) {
      return NextResponse.json(
        { error: 'A recruitment portal user with this email already exists.' },
        { status: 409 },
      );
    }

    const dupInternal = await prisma.user.findUnique({ where: { email } });
    if (dupInternal) {
      return NextResponse.json(
        { error: 'This email is already used for an internal staff account.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, ROUNDS);
    const row = await prisma.recruitmentClientPortalUser.create({
      data: { email, name, passwordHash, clientId, notes, isActive },
      include: { client: { select: { id: true, name: true } } },
    });
    return NextResponse.json(recruitmentPortalUserToSummary(row));
  } catch (e) {
    console.error('POST /api/recruitment-client-portal-users error:', e);
    return NextResponse.json({ error: 'Failed to create recruitment client login.' }, { status: 500 });
  }
}
