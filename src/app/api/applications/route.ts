import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createInMemoryApplication,
  getInMemoryApplications,
} from '@/lib/applications-store';
import { getInMemoryJobSummary } from '@/lib/jobs-store';
import type { ApplicationWithDetails } from '@/types/dashboard';

function jobToSummary(job: {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  postedDate: string;
  isActive: boolean;
  clientId?: string | null;
  clientName?: string | null;
}) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    category: job.category,
    postedDate: job.postedDate,
    isActive: job.isActive,
    clientId: job.clientId ?? null,
    clientName: job.clientName ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId') || undefined;
  const clientId = searchParams.get('clientId') || undefined;
  const status = searchParams.get('status') || undefined;
  const nationality = searchParams.get('nationality') || undefined;
  const homeCounty = searchParams.get('homeCounty') || undefined;
  const educationLevel = searchParams.get('educationLevel') || undefined;
  const employmentType = searchParams.get('employmentType') || undefined;

  try {
    if (process.env.DATABASE_URL) {
      const applications = await prisma.application.findMany({
        where: {
          ...(jobId ? { jobId } : {}),
          ...(clientId ? { job: { clientId } } : {}),
          ...(status ? { status: status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired' } : {}),
          ...(nationality?.trim() || homeCounty?.trim()
            ? {
                candidate: {
                  ...(nationality?.trim()
                    ? { nationality: { contains: nationality.trim(), mode: 'insensitive' as const } }
                    : {}),
                  ...(homeCounty?.trim()
                    ? { homeCounty: { contains: homeCounty.trim(), mode: 'insensitive' as const } }
                    : {}),
                },
              }
            : {}),
        },
        include: {
          candidate: true,
          job: { include: { client: true } },
        },
        orderBy: { appliedDate: 'desc' },
      });
      let filtered = applications;
      if (educationLevel?.trim()) {
        const level = educationLevel.trim();
        filtered = filtered.filter((a) => {
          const fd = a.formData as { education?: { level: string }[] } | null;
          return fd?.education?.some((e) => e.level === level) ?? false;
        });
      }
      if (employmentType?.trim()) {
        const type = employmentType.trim();
        filtered = filtered.filter((a) => {
          const fd = a.formData as { employmentHistory?: { employmentType: string }[] } | null;
          return fd?.employmentHistory?.some((e) => e.employmentType === type) ?? false;
        });
      }
      const list: ApplicationWithDetails[] = filtered.map((a) => ({
        id: a.id,
        jobId: a.jobId,
        candidateId: a.candidateId,
        status: a.status,
        appliedDate: a.appliedDate.toISOString(),
        coverLetter: a.coverLetter,
        resumePath: a.resumePath,
        notes: a.notes,
        formData: a.formData as ApplicationWithDetails['formData'],
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        candidate: {
          id: a.candidate.id,
          firstName: a.candidate.firstName,
          lastName: a.candidate.lastName,
          email: a.candidate.email,
          phone: a.candidate.phone,
          location: a.candidate.location,
          nationality: a.candidate.nationality ?? null,
          homeCounty: a.candidate.homeCounty ?? null,
          experience: a.candidate.experience,
          education: a.candidate.education,
          skills: (Array.isArray(a.candidate.skills) ? a.candidate.skills : []) as string[],
          resumePath: a.candidate.resumePath,
          createdAt: a.candidate.createdAt.toISOString(),
        },
        job: jobToSummary({
          id: a.job.id,
          title: a.job.title,
          company: a.job.company,
          location: a.job.location,
          type: a.job.type,
          category: a.job.category,
          postedDate: a.job.postedDate.toISOString(),
          isActive: a.job.isActive,
          clientId: a.job.clientId ?? null,
          clientName: a.job.client?.name ?? null,
        }),
      }));
      return NextResponse.json(list);
    }
  } catch (_e) {
    // fall through to in-memory
  }

  const list = getInMemoryApplications({
    jobId,
    clientId: clientId || undefined,
    status: status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired' | undefined,
    nationality: nationality?.trim() || undefined,
    homeCounty: homeCounty?.trim() || undefined,
    educationLevel: educationLevel?.trim() || undefined,
    employmentType: employmentType?.trim() || undefined,
  });
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const jobId = typeof b.jobId === 'string' ? b.jobId.trim() : '';
  const coverLetter = typeof b.coverLetter === 'string' ? b.coverLetter.trim() || undefined : undefined;
  const resumePath = typeof b.resumePath === 'string' ? b.resumePath.trim() || undefined : undefined;
  const formDataRaw = b.formData;

  const cand = b.candidate as Record<string, unknown> | undefined;
  if (!cand || typeof cand.email !== 'string' || !cand.email.trim()) {
    return NextResponse.json({ error: 'Candidate email is required.' }, { status: 400 });
  }

  const firstName = typeof cand.firstName === 'string' ? cand.firstName.trim() : '';
  const lastName = typeof cand.lastName === 'string' ? cand.lastName.trim() : '';
  const email = cand.email.trim();
  const phone = typeof cand.phone === 'string' ? cand.phone.trim() || undefined : undefined;
  const location = typeof cand.location === 'string' ? cand.location.trim() || undefined : undefined;
  const nationality = typeof cand.nationality === 'string' ? cand.nationality.trim() || undefined : undefined;
  const homeCounty = typeof cand.homeCounty === 'string' ? cand.homeCounty.trim() || undefined : undefined;
  const experience = typeof cand.experience === 'number' ? cand.experience : Number(cand.experience) || 0;
  const education = typeof cand.education === 'string' ? cand.education.trim() || undefined : undefined;
  const skills = Array.isArray(cand.skills)
    ? (cand.skills as unknown[]).map((s) => (typeof s === 'string' ? s.trim() : String(s))).filter(Boolean)
    : [];

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required.' }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'Candidate first name and last name are required.' }, { status: 400 });
  }

  try {
    if (process.env.DATABASE_URL) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
      }

      const candidate = await prisma.candidate.upsert({
        where: { email },
        create: {
          firstName,
          lastName,
          email,
          phone: phone ?? null,
          location: location ?? null,
          nationality: nationality ?? null,
          homeCounty: homeCounty ?? null,
          experience,
          education: education ?? null,
          skills,
          resumePath: resumePath ?? null,
        },
        update: {
          firstName,
          lastName,
          phone: phone ?? undefined,
          location: location ?? undefined,
          nationality: nationality ?? undefined,
          homeCounty: homeCounty ?? undefined,
          experience,
          education: education ?? undefined,
          skills,
          ...(resumePath !== undefined && { resumePath: resumePath ?? null }),
        },
      });

      const formData =
        formDataRaw && typeof formDataRaw === 'object' && formDataRaw !== null
          ? (formDataRaw as Record<string, unknown>)
          : undefined;

      const application = await prisma.application.create({
        data: {
          jobId,
          candidateId: candidate.id,
          coverLetter: coverLetter ?? null,
          resumePath: resumePath ?? candidate.resumePath,
          formData: formData ?? undefined,
        },
        include: { candidate: true, job: { include: { client: true } } },
      });

      const result: ApplicationWithDetails = {
        id: application.id,
        jobId: application.jobId,
        candidateId: application.candidateId,
        status: application.status,
        appliedDate: application.appliedDate.toISOString(),
        coverLetter: application.coverLetter,
        resumePath: application.resumePath,
        notes: application.notes,
        formData: (application.formData as ApplicationWithDetails['formData']) ?? null,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
        candidate: {
          id: application.candidate.id,
          firstName: application.candidate.firstName,
          lastName: application.candidate.lastName,
          email: application.candidate.email,
          phone: application.candidate.phone,
          location: application.candidate.location,
          nationality: application.candidate.nationality ?? null,
          homeCounty: application.candidate.homeCounty ?? null,
          experience: application.candidate.experience,
          education: application.candidate.education,
          skills: (Array.isArray(application.candidate.skills) ? application.candidate.skills : []) as string[],
          resumePath: application.candidate.resumePath,
          createdAt: application.candidate.createdAt.toISOString(),
        },
        job: jobToSummary({
          id: application.job.id,
          title: application.job.title,
          company: application.job.company,
          location: application.job.location,
          type: application.job.type,
          category: application.job.category,
          postedDate: application.job.postedDate.toISOString(),
          isActive: application.job.isActive,
          clientId: application.job.clientId ?? null,
          clientName: application.job.client?.name ?? null,
        }),
      };
      return NextResponse.json(result);
    }
  } catch (e) {
    console.error('POST /api/applications error:', e);
    return NextResponse.json({ error: 'Failed to create application.' }, { status: 500 });
  }

  // In-memory fallback
  const jobSummary = getInMemoryJobSummary(jobId);
  if (!jobSummary) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
  }

  const app = createInMemoryApplication({
    jobId,
    job: jobSummary,
    candidate: {
      id: '',
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      location: location ?? null,
      nationality: nationality ?? null,
      homeCounty: homeCounty ?? null,
      experience,
      education: education ?? null,
      skills,
      resumePath: resumePath ?? null,
      createdAt: new Date().toISOString(),
    },
    coverLetter,
    resumePath,
    formData: formData as ApplicationWithDetails['formData'] | undefined,
  });
  return NextResponse.json(app);
}
