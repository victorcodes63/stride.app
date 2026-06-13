'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthSplitShell, LoginCard } from '@/components/auth/AuthSplitShell';
import { usePublicBrand } from '@/components/BrandProvider';

export default function ForgotPasswordPage() {
 const { orgName } = usePublicBrand();
 const [email, setEmail] = useState('');
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 await new Promise((r) => setTimeout(r, 800));
 setSubmitted(true);
 } catch {
 setError('Something went wrong. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <AuthSplitShell
 eyebrow="Staff dashboard"
 title="Reset your password"
 subtitle={`Enter your work email and we'll send reset instructions for your ${orgName} account.`}
 >
 <LoginCard>
 <h2 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-[#0a2540]">
 Forgot your password?
 </h2>
 <p className="mt-1.5 text-[0.8125rem] text-[#425466]">
 Enter your work email and we&apos;ll send you a link to reset your password.
 </p>

 {submitted ? (
 <div className="mt-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[0.8125rem] leading-snug text-emerald-800">
 <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
 <span>If an account exists for that email, we&apos;ve sent reset instructions. Check your inbox.</span>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="mt-6 space-y-4">
 {error ? (
 <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[0.8125rem] leading-snug text-red-700">
 <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400" />
 <span>{error}</span>
 </div>
 ) : null}

 <div>
 <label htmlFor="email" className="mb-1.5 block text-[0.8125rem] font-medium text-[#0a2540]">
 Email
 </label>
 <input
 id="email"
 type="email"
 autoComplete="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="h-10 w-full rounded-md border border-[#d5dae1] bg-white px-3 text-sm text-[#0a2540] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all placeholder:text-[#9ca8b7] hover:border-[#b4bcc6] focus:border-[#635bff] focus:outline-none focus:ring-2 focus:ring-[#635bff]/12"
 placeholder="you@company.com"
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#635bff] text-sm font-semibold text-white transition-all hover:bg-[#4b45c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
 style={{
 boxShadow: '0 0 0 1px rgba(99,91,255,0.5), 0 2px 5px rgba(99,91,255,0.2)',
 }}
 >
 {loading ? 'Sending…' : 'Send reset link'}
 </button>
 </form>
 )}

 <p className="mt-5 text-center text-[0.8125rem] text-[#425466]">
 <Link href="/dashboard/login" className="font-medium text-[#635bff] hover:text-[#4b45c6]">
 ← Back to sign in
 </Link>
 </p>
 </LoginCard>
 </AuthSplitShell>
 );
}
