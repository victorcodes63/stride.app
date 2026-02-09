# Staff dashboard auth – reference & wiring

This document describes how staff dashboard authentication works and how to extend it (Microsoft sign-in, forgot password API, etc.).

---

## Overview

- **Purpose:** Protect `/dashboard` and all dashboard routes (applications, jobs, analytics) so only staff can access them.
- **Method:** Cookie-based session. No database or user table yet; auth is a single shared password (or dev bypass).
- **Public routes:** `/dashboard/login` and `/dashboard/forgot-password` are not protected.

---

## Environment variables

| Variable          | Required | Description |
|-------------------|----------|-------------|
| `STAFF_PASSWORD`  | **Production:** yes. **Development:** no (dev bypass used if unset) | Shared password for staff sign-in. |
| `STAFF_EMAIL`     | No | If set, only this email can sign in (e.g. `staff@eaglehr.co.ke`). Leave unset to allow any email. |

See `.env.example` for copy-paste. In production, always set `STAFF_PASSWORD`.

---

## Dev bypass (development only)

When `NODE_ENV !== 'production'` and `STAFF_PASSWORD` is **not** set:

- You can sign in with **any email** and password **`eaglehr`**.
- No `.env` auth config is required for local testing.

When `STAFF_PASSWORD` is set (or in production), the bypass is not used; only the configured password (and optional `STAFF_EMAIL`) apply.

---

## Files and routes

| Path / file | Purpose |
|-------------|--------|
| `src/app/dashboard/(auth)/login/page.tsx` | Login UI: email/password, “Sign in with Microsoft”, “Forgot password?”, “Remember me”. |
| `src/app/dashboard/(auth)/forgot-password/page.tsx` | Forgot-password UI. Submit is placeholder; no API yet. |
| `src/app/api/auth/login/route.ts` | `POST` – checks password (or dev bypass), sets session cookie, returns `{ success: true }` or 401/500. |
| `src/app/api/auth/logout/route.ts` | `POST` – clears session cookie. |
| `src/middleware.ts` | Redirects unauthenticated users from `/dashboard/*` (except login/forgot-password) to `/dashboard/login?from=...`. |

**Session cookie:** `staff_session`  
- Value: `authenticated`  
- Options: httpOnly, `secure` in production, sameSite `lax`, maxAge 7 days, path `/`.

---

## Flow (wiring reference)

1. **Sign in (email/password)**  
   - User submits email + password on login page.  
   - Front end: `POST /api/auth/login` with `{ email, password }` (and `rememberMe` if you use it later).  
   - Back end: validate password (or dev bypass), optionally `STAFF_EMAIL`; set `staff_session` cookie; return 200 or 401/500.  
   - Front end: on 200, redirect to `/dashboard` (or `from` query).

2. **Sign out**  
   - Dashboard sidebar “Sign out” calls `POST /api/auth/logout` then redirects to `/dashboard/login`.

3. **Protected routes**  
   - Middleware runs on `/dashboard` and `/dashboard/*`.  
   - If path is `/dashboard/login` or `/dashboard/forgot-password`, request continues.  
   - Else if `staff_session` cookie is missing → redirect to `/dashboard/login?from=<path>`.

4. **Forgot password (current)**  
   - UI only. “Send reset link” does not call an API yet; see below for wiring.

---

## Wiring for later

### 1. Microsoft sign-in (SSO)

- **Current:** Login page has “Sign in with Microsoft”; handler shows “Microsoft sign-in will be available soon.”  
- **To make functional:**  
  - Add a provider (e.g. NextAuth.js with Azure AD / Microsoft provider).  
  - Configure client ID/secret (Azure app registration).  
  - On success, create or recognise “staff” and set the same `staff_session` cookie (or switch to NextAuth session and keep protecting `/dashboard` with that).  
  - Replace or complement the email/password form; keep “Sign in with Microsoft” button pointing at the OAuth flow.

### 2. Forgot-password API

- **Current:** `/dashboard/forgot-password` submits email; no API; success message is static.  
- **To make functional:**  
  - Add `POST /api/auth/forgot-password` that accepts `{ email }`.  
  - If email is allowed (e.g. matches a staff list or `STAFF_EMAIL`), generate a secure reset token (store in DB or cache with short TTL), send link (e.g. `/dashboard/reset-password?token=...`) via your email (e.g. Nodemailer).  
  - Add `/dashboard/reset-password` page and `POST /api/auth/reset-password` with `{ token, newPassword }`; on success invalidate token and redirect to login.

### 3. Remember me

- **Current:** Checkbox state is sent as `rememberMe` in the login request; API does not use it.  
- **To use:** In `api/auth/login/route.ts`, if `rememberMe` is true, set a longer `maxAge` on `staff_session` (e.g. 30 days); otherwise keep 7 days (or session-only).

### 4. Full auth (NextAuth, user table, etc.)

- **Current:** Single shared password + cookie.  
- **To upgrade:** Introduce a proper auth solution (e.g. NextAuth) and optionally a `User` table (e.g. Prisma). Keep `staff_session` or migrate to NextAuth session; ensure middleware (or NextAuth middleware) still protects `/dashboard` the same way. Document new env vars (e.g. `NEXTAUTH_SECRET`, Azure client ID/secret) in this file and `.env.example`.

---

## Quick reference

| What | Where |
|------|--------|
| Login page | `/dashboard/login` |
| Forgot password page | `/dashboard/forgot-password` |
| Dev password (when `STAFF_PASSWORD` unset) | `eaglehr` |
| Cookie name | `staff_session` |
| Env vars | `STAFF_PASSWORD`, optional `STAFF_EMAIL` |
| Protect new dashboard route | No change; middleware already matches `/dashboard` and `/dashboard/*`. |
| Allow new public dashboard route | In `src/middleware.ts`, add path to `isAuthPage` (e.g. `/dashboard/reset-password`) or equivalent allow list. |

---

*Last updated: reflects cookie-based staff auth, dev bypass, and placeholder Microsoft / forgot-password UI.*
