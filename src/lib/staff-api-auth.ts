import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseStaffSession } from '@/lib/auth-session';

const COOKIE = 'staff_session';

export type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'viewer';
};

export async function requireStaffUser(request: NextRequest): Promise<StaffUser | null> {
  const raw = request.cookies.get(COOKIE)?.value;
  if (!raw || !process.env.DATABASE_URL) return null;
  const parsed = parseStaffSession(raw);
  let user = null as Awaited<ReturnType<typeof prisma.user.findUnique>> | null;
  if (parsed.userId) {
    user = await prisma.user.findUnique({ where: { id: parsed.userId } });
  }
  if (!user && parsed.email) {
    user = await prisma.user.findUnique({ where: { email: parsed.email.toLowerCase() } });
  }
  if (!user?.isActive) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as StaffUser['role'],
  };
}

export function isAdmin(u: StaffUser | null): boolean {
  return u?.role === 'admin';
}
