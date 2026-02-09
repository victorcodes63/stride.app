# Eagle HR ATS – Project Analysis & Next Steps

## Current state

### What you have

| Area | Status | Notes |
|------|--------|--------|
| **Website** | ✅ Complete | Next.js 15, Tailwind (primary `#043d4a`, secondary `#de8d00`), Figtree, Framer Motion |
| **Job board** | ✅ Working | `DynamicJobListings` loads mock jobs from `ats-api.ts` (4 sample jobs) |
| **Apply flow** | ✅ UI complete | `/careers/apply/[id]` + `JobApplicationForm` (3 steps: personal → professional/resume/cover letter → review) |
| **Form submission** | ⚠️ Mock only | Calls `createCandidate` + `submitApplication`; no API key → in-memory “success”, no persistence |
| **Staff dashboard** | ⚠️ UI only | `EmployerDashboard` exists but has no route; expects external API for applications |
| **Email** | ✅ Used elsewhere | Nodemailer in `api/contact/route.ts` (SMTP env vars) |
| **Persistence** | ❌ None | No DB or file store for jobs, candidates, or applications |

### Data flow today

1. **Jobs** – Hardcoded mock list in `ats-api.ts`; no create/update/delete.
2. **Apply** – Form → `createCandidate` (mock) → `submitApplication` (mock) → success; nothing is stored.
3. **Staff** – `EmployerDashboard` would call external ATS API; no local backend to call.

So the site is ready for an ATS **backend** that persists applications and sends emails; the **front-end** (design, form, dashboard shell) is already aligned with that.

---

## What’s missing for a working ATS

1. **Persistence** for:
   - Applications (linked to job id + candidate)
   - Candidates (name, email, phone, etc., resume reference)
   - Jobs can stay mock for now, or be moved to the same store later.

2. **API layer** in this Next.js app:
   - Submit application (create candidate + application, store resume reference, send “application received” email).
   - List applications for staff (filter by job, status).
   - Update application status and send “status update” email to applicant.

3. **Application form** wired to the new API:
   - POST to your new route instead of (or in addition to) the current mock client so submissions are stored and trigger emails.

4. **Staff UI**:
   - A route (e.g. `/staff` or `/dashboard`) that renders the existing dashboard and feeds it from the new APIs (applications list, status update).

5. **Resume handling**:
   - Store file on server (e.g. under `public/uploads` or a dedicated folder) or use a blob store later; save the path/URL in the application record.

6. **Email**:
   - Reuse existing Nodemailer setup.
   - Two templates: “Application received” and “Status updated” (e.g. shortlisted / rejected / hired).

---

## Suggested next steps (in order)

### Phase 1 – Persistence + submit flow + one email (1–2 days)

1. **Choose a simple store**
   - **Option A:** SQLite + Prisma (good for growth, easy to query).
   - **Option B:** JSON file(s) in the repo or a `data/` folder (fastest to implement, fine for low volume).

2. **Define schema**
   - **Candidate:** id, firstName, lastName, email, phone, location, experience, skills (JSON or text), resumePath/url, createdAt.
   - **Application:** id, jobId, candidateId, status (`pending` \| `reviewed` \| `shortlisted` \| `rejected` \| `hired`), coverLetter, appliedDate, (optional) internal notes.

3. **Add API routes**
   - `POST /api/applications` – Body: jobId + candidate fields + coverLetter + resume (multipart or base64). Create candidate, create application, store resume, respond with `applicationId`.
   - Optionally: `GET /api/jobs` – return current jobs (can still read from mock or from DB if you migrate jobs later).

4. **Application received email**
   - In `POST /api/applications`, after saving, send one email to the candidate: “We received your application for [Job title].”

5. **Wire the form**
   - In `JobApplicationForm`, on submit: call `POST /api/applications` (e.g. with FormData: jobId, candidate fields, cover letter, resume file). On success, call `onSuccess(applicationId)` as you do now. Keep existing UI/validation.

6. **Resume storage**
   - In the API route: save uploaded file to e.g. `public/uploads/resumes/<applicationId>_<filename>` (or outside `public` and serve via another route if you prefer). Store the path or URL in the application/candidate record.

### Phase 2 – Staff dashboard + status updates + email (1–2 days)

7. **Applications API for staff**
   - `GET /api/applications` – Query params: jobId, status. Return list of applications with candidate details (name, email, phone, resume link, applied date, status).
   - `PATCH /api/applications/[id]` – Body: `{ status }`. Update status and send “Status updated” email to the candidate (e.g. “Your application for [Job] is now [shortlisted/rejected/hired]”).

8. **Staff route and auth**
   - Add route e.g. `src/app/staff/page.tsx` (or `src/app/dashboard/page.tsx`) that renders `EmployerDashboard` (or a new “Applications” page).
   - Pass data from `GET /api/applications` into the dashboard. For now, keep the staff page **unprotected** (or protect with a simple env-based password or link secret); add proper auth (e.g. NextAuth) later.

9. **EmployerDashboard (or new Applications page)**
   - List applications with candidate name, email, job title, status, applied date.
   - Filters: by job, by status.
   - Per row: “Change status” → call `PATCH /api/applications/[id]` with new status; refresh list. Email is sent inside the API.

10. **Email template for status update**
    - One template (or a small set) for “Your application status has been updated to [status]” with job title and optional short message.

### Phase 3 – Polish (later)

- **Auth for staff** – e.g. NextAuth with credentials or Google.
- **Job management** – CRUD for jobs in DB and optional “Post a job” in dashboard.
- **Resume security** – serve resumes only for authenticated staff or signed URLs.
- **Duplicate detection** – same email applying twice to same job (e.g. update existing or block).

---

## Design and stack alignment

- **Design language** – Reuse existing Tailwind theme (primary/secondary, Figtree, spacing, buttons) for any new staff pages so the ATS feels part of the same site.
- **Form** – Keep using the current job application form; only change the submit target to your new API and ensure resume + fields match the API (e.g. `FormData` with same field names).
- **Email** – Reuse `api/contact/route.ts` Nodemailer pattern and env vars; add new routes or a shared `sendMail` helper for “application received” and “status updated”.

---

## Recommended immediate actions

1. **Choose storage:** SQLite + Prisma (recommended) or JSON file.
2. **Implement Phase 1:** schema, `POST /api/applications`, resume save, one “application received” email, and wire `JobApplicationForm` to it.
3. **Then Phase 2:** `GET`/`PATCH` applications, staff route, and status-update email.

---

## Implemented (UI-first phase)

- **Storage:** Prisma + **PostgreSQL** (scalable for 16k+ applications/year). Schema: `Job`, `Candidate`, `Application` with indexes on `jobId`, `status`, `appliedDate`, `candidateId`, `email`.
- **API contract:** `src/types/dashboard.ts` – `ApplicationWithDetails`, `ApplicationsListResponse`, `ApplicationsQueryParams`, `UpdateApplicationStatusBody`. Dashboard and API will use these shapes.
- **Dashboard URL:** `/dashboard` (redirects to `/dashboard/applications`).
- **Dashboard layout:** Sidebar with Eagle HR branding, nav: Overview (→ applications), Applications, Jobs, Analytics, Back to website. Active state via `DashboardNav` + `usePathname`.
- **Applications page:** `/dashboard/applications` – stats (Total, Pending, Shortlisted, Hired), search (name/email/job title), filters (job, status), table (candidate name, job, applied date, status dropdown, View). Detail drawer: full candidate + job + cover letter + internal notes + status update buttons. Data from `getMockApplications()` / `getMockJobOptions()` in `src/lib/dashboard-mock.ts`.
- **Placeholders:** `/dashboard/jobs`, `/dashboard/analytics` (coming soon).
- **Env:** `.env.example` – `DATABASE_URL` (PostgreSQL), SMTP vars for emails.

### Wiring order (when connecting backend)

1. **Database:** Set `DATABASE_URL` (PostgreSQL), run `npm run db:push` or `npm run db:migrate`.
2. **API routes:** Implement `POST /api/applications` (create candidate + application, store resume, send “application received” email), `GET /api/applications` (query params: jobId, status, page, limit), `PATCH /api/applications/[id]` (status + optional emailMessage, send “status updated” email).
3. **Form:** In `JobApplicationForm`, submit to `POST /api/applications` (e.g. FormData with jobId, candidate fields, cover letter, resume file). On success, call `onSuccess(applicationId)`.
4. **Dashboard:** In `/dashboard/applications`, replace `getMockApplications` / `getMockJobOptions()` with `fetch('/api/applications?...')`. Replace inline status change with `fetch('PATCH /api/applications/' + id, { body: { status } })` then refetch or update local state.
5. **Resume storage:** In `POST /api/applications`, save file to e.g. `public/uploads/resumes/<applicationId>_<filename>` or use Vercel Blob; store path/URL in `Candidate.resumePath` and `Application.resumePath`.
