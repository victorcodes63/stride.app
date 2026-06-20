'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, ChevronDown, Loader2, Mail } from 'lucide-react';
import { StudioCraftNav } from '@/components/marketing/v3/StudioCraftNav';
import { BookDemoVideoBackground } from './BookDemoVideoBackground';
import {
  MARKETING_CTAS,
  MARKETING_DEMO_STEPS,
  MARKETING_ROUTES,
  MARKETING_SALES_EMAIL,
} from '@/lib/marketing-config';
import './book-demo.css';

type StepItemProps = {
  number: number;
  text: string;
  active?: boolean;
};

function StepItem({ number, text, active = false }: StepItemProps) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-[var(--sc-paper)] text-[var(--sc-ink)] shadow-[0_12px_40px_rgba(26,23,20,0.18)]'
          : 'border border-white/10 bg-white/[0.07] text-[var(--sc-paper)] backdrop-blur-md'
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          active
            ? 'bg-[var(--sc-coral)] text-white'
            : 'bg-white/10 text-[var(--sc-paper-2)]/70'
        }`}
      >
        {number}
      </span>
      <span>{text}</span>
    </div>
  );
}

type SocialButtonProps = {
  icon: ReactNode;
  label: string;
  href: string;
};

function SocialButton({ icon, label, href }: SocialButtonProps) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--sc-line)] bg-white px-4 py-3 text-sm font-medium text-[var(--sc-ink)] transition-all duration-300 hover:border-[var(--sc-coral)]/30 hover:shadow-[0_4px_20px_rgba(255,84,54,0.08)]"
    >
      {icon}
      {label}
    </a>
  );
}

type InputGroupProps = {
  label: string;
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function InputGroup({
  label,
  placeholder,
  type = 'text',
  name,
  value,
  onChange,
  required,
}: InputGroupProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[var(--sc-ink)]">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-[var(--sc-line)] bg-white px-4 text-[var(--sc-ink)] shadow-[0_1px_2px_rgba(26,23,20,0.03)] placeholder:text-[var(--sc-ink-subtle,#8A8076)]/50 transition-shadow duration-300 focus:border-[var(--sc-coral)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/10"
      />
    </label>
  );
}

const INTEREST_OPTIONS = [
  { value: 'demo', label: 'Booking a demo' },
  { value: 'pricing', label: 'Pricing & plans' },
  { value: 'logistics', label: 'Logistics vertical' },
  { value: 'waitlist', label: 'Industry waitlist' },
  { value: 'other', label: 'Something else' },
] as const;

const TEAM_SIZE_OPTIONS = [
  { value: '', label: 'Select team size' },
  { value: '1-25', label: '1–25 staff' },
  { value: '26-100', label: '26–100 staff' },
  { value: '101-300', label: '101–300 staff' },
  { value: '300+', label: '300+ staff' },
] as const;

const childMotion = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fieldMotion = {
  hidden: { opacity: 0, y: 10 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08 + index * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function BookDemoPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [interest, setInterest] = useState('demo');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/marketing/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company,
          teamSize,
          interest:
            INTEREST_OPTIONS.find((option) => option.value === interest)?.label ?? interest,
          message,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to send your request right now.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your request right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col gap-3 bg-[var(--sc-ink)] p-3 transition-all duration-500 selection:bg-[var(--sc-coral)]/25 lg:h-screen lg:flex-row lg:overflow-hidden lg:p-4">
      <div className="shrink-0 pt-1 lg:hidden">
        <StudioCraftNav />
      </div>

      <section className="relative hidden h-full w-[52%] overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.35)] lg:block">
        <BookDemoVideoBackground />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--sc-ink)]/85 via-[var(--sc-ink)]/15 to-transparent"
          aria-hidden
        />

        <header className="absolute inset-x-8 top-8 z-20 xl:inset-x-10">
          <StudioCraftNav />
        </header>

        <motion.div
          className="absolute bottom-0 left-0 z-10 w-full max-w-md space-y-8 p-8 xl:p-10 xl:pb-12"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
          }}
        >
          <motion.div variants={childMotion} className="space-y-4">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--sc-paper-2)] backdrop-blur-sm">
              Stride · Book a walkthrough
            </span>
            <div className="space-y-3">
              <h1 className="text-[38px] font-normal leading-[1.05] tracking-tight text-[var(--sc-paper)] xl:text-[42px]">
                See your operations on one platform.
              </h1>
              <p className="max-w-[32ch] text-[15px] leading-relaxed text-[var(--sc-paper-2)]/85">
                Three quick steps to see Stride configured for your team.
              </p>
            </div>
          </motion.div>

          <motion.div variants={childMotion} className="space-y-2.5">
            {MARKETING_DEMO_STEPS.map((step) => (
              <StepItem
                key={step.number}
                number={step.number}
                text={step.text}
                active={'active' in step ? step.active : false}
              />
            ))}
          </motion.div>

          <motion.p
            variants={childMotion}
            className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--sc-paper-2)]/50"
          >
            M-Pesa native · KRA ready · Built for East Africa
          </motion.p>
        </motion.div>
      </section>

      <section className="flex flex-1 flex-col overflow-y-auto rounded-[28px] bg-[var(--sc-paper)] shadow-[0_8px_40px_rgba(26,23,20,0.06)] lg:overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-10 lg:px-14 lg:py-8 xl:px-20">
          <motion.div
            className="w-full max-w-lg space-y-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <div className="space-y-5 rounded-2xl border border-[var(--sc-line)] bg-white p-8 shadow-[0_8px_32px_rgba(26,23,20,0.05)]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sc-coral)]/10 text-[var(--sc-coral)]">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <h2 className="text-3xl font-normal tracking-tight text-[var(--sc-ink)]">
                  Request received
                </h2>
                <p className="text-[15px] leading-relaxed text-[var(--sc-ink-muted)]">
                  Thanks, {firstName}. Our team will reach out within one business day to schedule
                  your Stride walkthrough.
                </p>
                <Link
                  href={MARKETING_ROUTES.home}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sc-coral)] transition-colors hover:text-[var(--sc-coral-deep)]"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
                  Back to homepage
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden items-center justify-end lg:flex">
                  <Link
                    href={MARKETING_ROUTES.login}
                    className="text-[13px] font-medium text-[var(--sc-ink-muted)] transition-colors hover:text-[var(--sc-ink)]"
                  >
                    {MARKETING_CTAS.signIn}
                  </Link>
                </div>

                <div className="space-y-2">
                  <h2 className="text-[32px] font-normal leading-tight tracking-tight text-[var(--sc-ink)] sm:text-4xl">
                    Tell us about your team
                  </h2>
                  <p className="text-[15px] text-[var(--sc-ink-muted)]">
                    Share a few details and we&apos;ll route your request to the right person.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SocialButton
                    icon={<Mail className="h-4 w-4 text-[var(--sc-coral)]" aria-hidden />}
                    label="Email us"
                    href={`mailto:${MARKETING_SALES_EMAIL}`}
                  />
                  <SocialButton
                    icon={<Calendar className="h-4 w-4 text-[var(--sc-coral)]" aria-hidden />}
                    label="Talk to sales"
                    href={`mailto:${MARKETING_SALES_EMAIL}?subject=${encodeURIComponent('Stride sales enquiry')}`}
                  />
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 border-t border-[var(--sc-line)]" />
                  <span className="relative bg-[var(--sc-paper)] px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--sc-ink-subtle,#8A8076)]">
                    Or send a request
                  </span>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <motion.div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                  >
                    <motion.div custom={0} variants={fieldMotion}>
                      <InputGroup
                        label="First name"
                        name="firstName"
                        placeholder="Jane"
                        value={firstName}
                        onChange={setFirstName}
                        required
                      />
                    </motion.div>
                    <motion.div custom={1} variants={fieldMotion}>
                      <InputGroup
                        label="Last name"
                        name="lastName"
                        placeholder="Kamau"
                        value={lastName}
                        onChange={setLastName}
                        required
                      />
                    </motion.div>
                  </motion.div>

                  {[
                    {
                      label: 'Work email',
                      name: 'email',
                      type: 'email',
                      placeholder: 'jane@company.co.ke',
                      value: email,
                      onChange: setEmail,
                      index: 2,
                    },
                    {
                      label: 'Company',
                      name: 'company',
                      placeholder: 'Your organisation',
                      value: company,
                      onChange: setCompany,
                      index: 3,
                    },
                  ].map((field) => {
                    const { index, ...inputProps } = field;
                    return (
                      <motion.div
                        key={field.name}
                        custom={index}
                        initial="hidden"
                        animate="show"
                        variants={fieldMotion}
                      >
                        <InputGroup {...inputProps} required />
                      </motion.div>
                    );
                  })}

                  <motion.label
                    custom={4}
                    initial="hidden"
                    animate="show"
                    variants={fieldMotion}
                    className="block space-y-2"
                  >
                    <span className="text-[13px] font-medium text-[var(--sc-ink)]">Team size</span>
                    <div className="relative">
                      <select
                        name="teamSize"
                        value={teamSize}
                        onChange={(event) => setTeamSize(event.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-[var(--sc-line)] bg-white px-4 text-[var(--sc-ink)] shadow-[0_1px_2px_rgba(26,23,20,0.03)] transition-shadow focus:border-[var(--sc-coral)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/10"
                      >
                        {TEAM_SIZE_OPTIONS.map((option) => (
                          <option key={option.value || 'empty'} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sc-ink-subtle,#8A8076)]"
                        aria-hidden
                      />
                    </div>
                  </motion.label>

                  <motion.label
                    custom={5}
                    initial="hidden"
                    animate="show"
                    variants={fieldMotion}
                    className="block space-y-2"
                  >
                    <span className="text-[13px] font-medium text-[var(--sc-ink)]">I am interested in</span>
                    <div className="relative">
                      <select
                        name="interest"
                        value={interest}
                        onChange={(event) => setInterest(event.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-[var(--sc-line)] bg-white px-4 text-[var(--sc-ink)] shadow-[0_1px_2px_rgba(26,23,20,0.03)] transition-shadow focus:border-[var(--sc-coral)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/10"
                      >
                        {INTEREST_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sc-ink-subtle,#8A8076)]"
                        aria-hidden
                      />
                    </div>
                  </motion.label>

                  <motion.label
                    custom={6}
                    initial="hidden"
                    animate="show"
                    variants={fieldMotion}
                    className="block space-y-2"
                  >
                    <span className="text-[13px] font-medium text-[var(--sc-ink)]">Anything else?</span>
                    <textarea
                      name="message"
                      value={message}
                      rows={3}
                      placeholder="Modules you need, entities, timelines..."
                      onChange={(event) => setMessage(event.target.value)}
                      className="w-full resize-none rounded-xl border border-[var(--sc-line)] bg-white px-4 py-3 text-[var(--sc-ink)] shadow-[0_1px_2px_rgba(26,23,20,0.03)] placeholder:text-[var(--sc-ink-subtle,#8A8076)]/50 transition-shadow focus:border-[var(--sc-coral)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/10"
                    />
                  </motion.label>

                  {error ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <motion.button
                    custom={7}
                    initial="hidden"
                    animate="show"
                    variants={fieldMotion}
                    type="submit"
                    disabled={submitting}
                    className="group mt-2 flex h-14 w-full items-center justify-between rounded-full bg-[var(--sc-ink)] px-5 text-[15px] font-medium text-white transition-all duration-500 hover:bg-[var(--sc-ink-muted)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span>{submitting ? 'Sending...' : MARKETING_CTAS.bookDemo}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--sc-ink)] transition-transform duration-500 group-hover:-rotate-45">
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                  </motion.button>
                </form>

                <p className="text-center text-sm text-[var(--sc-ink-muted)]">
                  Already on Stride?{' '}
                  <Link
                    href={MARKETING_ROUTES.login}
                    className="font-medium text-[var(--sc-ink)] underline-offset-4 hover:text-[var(--sc-coral)] hover:underline"
                  >
                    {MARKETING_CTAS.signIn}
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
