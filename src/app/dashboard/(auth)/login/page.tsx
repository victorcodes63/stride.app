'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const STAFF_LOGIN_PATH = '/api/auth/login';
const hasMicrosoftOAuth = Boolean(process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID?.trim());
const hasGoogleOAuth = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim());

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#f25022" d="M1 1h9v9H1z" />
      <path fill="#00a4ef" d="M11 1h9v9h-9z" />
      <path fill="#7fba00" d="M1 11h9v9H1z" />
      <path fill="#ffb900" d="M11 11h9v9h-9z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function StaffLoginContent({ initialError }: { initialError: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(STAFF_LOGIN_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = () => {
    window.location.href = '/api/auth/microsoft/start';
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google/start';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src="/brand/3rd-park-reception.webp"
        alt="3rd Park reception"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a6b80]/70 via-[#0a6b80]/60 to-[#085f72]/70" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#00a2c9]/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#00a2c9]/25 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 pb-24 pt-8 sm:px-6"
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/45 bg-white/78 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-white/20 to-white/10" />
          <div className="relative">
          <div className="mb-8 flex items-center justify-center">
            <Link href="/careers" className="inline-block">
              <Image
                src="/brand/3rd-park-logo.webp"
                alt="3rd Park HRIS"
                width={180}
                height={56}
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>
          </div>

            <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.15rem]">
              Staff Sign In
            </h1>
            <p className="mb-7 mt-2 text-center text-sm text-slate-500">
              Use your hospital account to continue.
            </p>

          {(hasMicrosoftOAuth || hasGoogleOAuth) && (
            <>
              <div className="space-y-2.5">
                {hasMicrosoftOAuth && (
                  <button
                    type="button"
                    onClick={handleMicrosoftSignIn}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#b8e7f2] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#00a2c9] hover:bg-[#e6f7fb]"
                  >
                    <MicrosoftIcon className="h-5 w-5" />
                    Continue with Microsoft
                  </button>
                )}
                {hasGoogleOAuth && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#b8e7f2] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#00a2c9] hover:bg-[#e6f7fb]"
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Continue with Google
                  </button>
                )}
              </div>

              <div className="relative my-5">
                <span className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#d5eef5]" />
                </span>
                <span className="relative flex justify-center text-xs uppercase tracking-[0.18em]">
                  <span className="bg-white px-3 text-[#00a2c9]">Or use email</span>
                </span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#b8e7f2] bg-white/92 py-3 pl-10 pr-4 text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] focus:border-[#00a2c9] focus:outline-none focus:ring-2 focus:ring-[#00a2c9]/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#b8e7f2] bg-white/92 py-3 pl-10 pr-4 text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] focus:border-[#00a2c9] focus:outline-none focus:ring-2 focus:ring-[#00a2c9]/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#00a2c9] focus:ring-[#00a2c9]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                    Remember me
                  </label>
                </div>
                <Link href="/dashboard/forgot-password" className="text-sm font-medium text-[#00a2c9] hover:text-[#008eb1]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00a2c9] px-4 py-3 font-semibold text-white shadow-md transition hover:bg-[#0093b7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
          </form>
          </div>
        </div>
      </motion.div>

      <footer className="absolute inset-x-0 bottom-0 z-20 border-t border-white/20 bg-primary-900/35 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-white/90 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} 3rd Park Hospital</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="transition hover:text-[#00a2c9]">
              Public Home
            </Link>
            <Link href="/careers" className="transition hover:text-[#00a2c9]">
              Careers
            </Link>
            <a
              href="https://3rdparkhospital.com/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#00a2c9]"
            >
              Main Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StaffLoginWithSearchParams() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');
  let initialError = '';
  if (oauthError === 'domain') initialError = 'Use your hospital-issued work account (Microsoft or Google) to sign in.';
  else if (oauthError === 'no_account') initialError = 'No active staff account exists for this email. Ask an admin to add you.';
  else if (oauthError === 'inactive') initialError = 'Your staff account is inactive. Contact an administrator.';
  else if (oauthError === 'oauth') initialError = 'Sign-in with Microsoft or Google failed. Please try again.';
  return <StaffLoginContent initialError={initialError} />;
}

export default function StaffLoginPage() {
  return (
    <Suspense fallback={<StaffLoginContent initialError="" />}>
      <StaffLoginWithSearchParams />
    </Suspense>
  );
}
