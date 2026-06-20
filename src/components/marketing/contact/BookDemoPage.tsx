'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronDown, Loader2, Mail, X } from 'lucide-react';
import { StrideLogo } from '@/components/marketing/StrideMark';
import {
  CORE_MODULES,
  MARKETING_CTAS,
  MARKETING_DEMO_STEPS,
  MARKETING_ROUTES,
  MARKETING_SALES_EMAIL,
  getMarketingLoginUrl,
} from '@/lib/marketing-config';
import './book-demo.css';

const TOTAL_STEPS = MARKETING_DEMO_STEPS.length;

type StepItemProps = {
  number: number;
  text: string;
  state: 'active' | 'complete' | 'upcoming';
};

function StepItem({ number, text, state }: StepItemProps) {
  const active = state === 'active';
  const complete = state === 'complete';

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium transition-all duration-300 ${
        active
          ? 'bg-[#fbf8f4] text-[#1a1714] shadow-[0_12px_40px_rgba(26,23,20,0.18)]'
          : complete
            ? 'border border-white/15 bg-white/[0.1] text-[#fbf8f4]'
            : 'border border-white/10 bg-white/[0.05] text-[#fbf8f4]/55'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          active
            ? 'bg-[var(--sc-coral)] text-white'
            : complete
              ? 'bg-white/20 text-[#fbf8f4]'
              : 'bg-white/10 text-[#fbf8f4]/50'
        }`}
      >
        {complete ? <Check className="h-3.5 w-3.5" aria-hidden /> : number}
      </span>
      <span className="leading-snug">{text}</span>
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
      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-[#fbf8f4] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
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
  min?: string;
};

function InputGroup({
  label,
  placeholder,
  type = 'text',
  name,
  value,
  onChange,
  required,
  min,
}: InputGroupProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[#fbf8f4]/90">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-[#fbf8f4] placeholder:text-white/30 transition-shadow duration-300 focus:border-[var(--sc-coral)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/15"
      />
    </label>
  );
}

const TEAM_SIZE_OPTIONS = [
  { value: '', label: 'Select team size' },
  { value: '1-25', label: '1–25 staff' },
  { value: '26-100', label: '26–100 staff' },
  { value: '101-300', label: '101–300 staff' },
  { value: '300+', label: '300+ staff' },
] as const;

const TIME_OPTIONS = [
  { value: '', label: 'Any time works' },
  { value: 'Morning (8am – 12pm EAT)', label: 'Morning (8am – 12pm EAT)' },
  { value: 'Afternoon (12pm – 5pm EAT)', label: 'Afternoon (12pm – 5pm EAT)' },
] as const;

const STEP_COPY = [
  {
    title: 'Tell us about your team',
    description: 'We will use this to tailor your walkthrough.',
  },
  {
    title: 'Pick the modules you need',
    description: 'Select everything you want to see — you can always add more later.',
  },
  {
    title: 'Book your walkthrough',
    description: 'Choose a preferred date and add any context for our team.',
  },
] as const;

const fieldClass =
  'h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-[#fbf8f4] transition-shadow focus:border-[var(--sc-coral)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/15';

function stepState(stepNumber: number, currentStep: number): StepItemProps['state'] {
  if (stepNumber === currentStep) return 'active';
  if (stepNumber < currentStep) return 'complete';
  return 'upcoming';
}

function BookDemoLeftPanel({ currentStep }: { currentStep: number }) {
  return (
    <section className="bd-demo-panel relative flex min-h-[min(320px,42vh)] flex-col overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[28px] lg:min-h-0">
      <div
        className="pointer-events-none absolute -right-[10%] top-[5%] h-[55%] w-[55%] rounded-full opacity-30 blur-[80px] bd-demo-drift-a"
        style={{ background: 'radial-gradient(circle, var(--sc-coral) 0%, transparent 68%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[8%] bottom-[10%] h-[45%] w-[45%] rounded-full opacity-20 blur-[70px] bd-demo-drift-b"
        style={{ background: 'radial-gradient(circle, var(--sc-coral-deep) 0%, transparent 70%)' }}
        aria-hidden
      />

      <Link
        href={MARKETING_ROUTES.home}
        className="relative z-10 p-8 pb-0 xl:p-10 xl:pb-0"
        aria-label="Stride home"
      >
        <StrideLogo heightClass="h-7 sm:h-8" className="brightness-0 invert" />
      </Link>

      <div className="bd-demo-copy relative z-10 flex flex-1 flex-col justify-end p-8 pt-10 xl:p-10 xl:pb-12">
        <div className="space-y-3">
          <h1 className="text-[clamp(1.75rem,3.5vw,2.375rem)] font-normal leading-[1.08] tracking-tight">
            Get Stride
          </h1>
          <p className="max-w-[30ch] text-[14px] leading-relaxed">
            Follow these three quick steps to see Stride configured for your team.
          </p>
        </div>

        <div className="bd-demo-steps mt-8 space-y-2">
          {MARKETING_DEMO_STEPS.map((step) => (
            <StepItem
              key={step.number}
              number={step.number}
              text={step.text}
              state={stepState(step.number, currentStep)}
            />
          ))}
        </div>

        <p className="bd-demo-tagline mt-8 text-[11px] font-medium uppercase tracking-[0.12em]">
          M-Pesa native · KRA ready · Built for East Africa
        </p>
      </div>
    </section>
  );
}

export function BookDemoPage() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [modules, setModules] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const stepMeta = STEP_COPY[step - 1];

  function toggleModule(name: string) {
    setModules((current) =>
      current.includes(name) ? current.filter((m) => m !== name) : [...current, name],
    );
  }

  function validateStep(targetStep: number): string | null {
    if (targetStep >= 2) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !company.trim()) {
        return 'First name, last name, email, and company are required.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return 'Enter a valid work email.';
      }
    }
    if (targetStep >= 3 && modules.length === 0) {
      return 'Select at least one module to continue.';
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep(step + 1);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < TOTAL_STEPS) {
      goNext();
      return;
    }

    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!preferredDate) {
      setError('Choose a preferred date for your walkthrough.');
      return;
    }

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
          interest: 'Booking a demo',
          modules,
          preferredDate,
          preferredTime,
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
    <main className="flex min-h-[100dvh] w-full max-w-[100vw] flex-col gap-2 overflow-x-clip bg-[var(--sc-ink)] p-2 selection:bg-[var(--sc-coral)]/25 sm:gap-3 sm:p-3 lg:grid lg:h-screen lg:grid-cols-2 lg:overflow-hidden lg:p-4">
      <BookDemoLeftPanel currentStep={step} />

      <section className="relative flex min-h-0 flex-col overflow-y-auto rounded-[20px] bg-[var(--sc-ink)] sm:rounded-[28px] lg:overflow-hidden">
        <Link
          href={MARKETING_ROUTES.home}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#fbf8f4]/70 transition-colors hover:border-white/20 hover:text-[#fbf8f4] sm:right-8 sm:top-8"
          aria-label="Close and return home"
        >
          <X className="h-4 w-4" aria-hidden />
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-14 sm:px-10 lg:px-14 lg:py-10 xl:px-20">
          <motion.div
            className="bd-demo-form w-full max-w-md space-y-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sc-coral)]/15 text-[var(--sc-coral)]">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <h2 className="text-3xl font-normal tracking-tight text-[#fbf8f4]">
                  Request received
                </h2>
                <p className="text-[15px] leading-relaxed text-[#fbf8f4]/75">
                  Thanks, {firstName}. We will confirm your walkthrough for{' '}
                  {new Date(`${preferredDate}T12:00:00`).toLocaleDateString('en-KE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                  {preferredTime ? ` (${preferredTime})` : ''}.
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
                <div className="space-y-2 pr-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--sc-coral)]">
                    Step {step} of {TOTAL_STEPS}
                  </p>
                  <h2 className="text-[clamp(1.5rem,3.5vw,2rem)] font-normal leading-tight tracking-tight text-[#fbf8f4]">
                    {stepMeta.title}
                  </h2>
                  <p className="text-[14px] text-[#fbf8f4]/65">{stepMeta.description}</p>
                </div>

                {step === 1 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                ) : null}

                {step === 1 ? (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-x-0 border-t border-white/10" />
                    <span className="relative bg-[var(--sc-ink)] px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/35">
                      Or send a request
                    </span>
                  </div>
                ) : null}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <InputGroup
                            label="First name"
                            name="firstName"
                            placeholder="Jane"
                            value={firstName}
                            onChange={setFirstName}
                            required
                          />
                          <InputGroup
                            label="Last name"
                            name="lastName"
                            placeholder="Kamau"
                            value={lastName}
                            onChange={setLastName}
                            required
                          />
                        </div>
                        <InputGroup
                          label="Work email"
                          name="email"
                          type="email"
                          placeholder="jane@company.co.ke"
                          value={email}
                          onChange={setEmail}
                          required
                        />
                        <InputGroup
                          label="Company"
                          name="company"
                          placeholder="Your organisation"
                          value={company}
                          onChange={setCompany}
                          required
                        />
                        <label className="block space-y-2">
                          <span className="text-[13px] font-medium text-[#fbf8f4]/90">Team size</span>
                          <div className="relative">
                            <select
                              name="teamSize"
                              value={teamSize}
                              onChange={(event) => setTeamSize(event.target.value)}
                              className={`${fieldClass} appearance-none`}
                            >
                              {TEAM_SIZE_OPTIONS.map((option) => (
                                <option
                                  key={option.value || 'empty'}
                                  value={option.value}
                                  className="bg-[#1A1714]"
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                              aria-hidden
                            />
                          </div>
                        </label>
                      </motion.div>
                    ) : null}

                    {step === 2 ? (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-2"
                      >
                        {CORE_MODULES.map((mod) => {
                          const selected = modules.includes(mod.name);
                          return (
                            <label
                              key={mod.name}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                                selected
                                  ? 'border-[var(--sc-coral)]/40 bg-[var(--sc-coral)]/10'
                                  : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--sc-coral)]"
                                checked={selected}
                                onChange={() => toggleModule(mod.name)}
                              />
                              <span>
                                <span className="block text-sm font-medium text-[#fbf8f4]">
                                  {mod.name}
                                </span>
                                <span className="mt-0.5 block text-[12px] leading-relaxed text-[#fbf8f4]/55">
                                  {mod.description}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </motion.div>
                    ) : null}

                    {step === 3 ? (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                      >
                        <InputGroup
                          label="Preferred date"
                          name="preferredDate"
                          type="date"
                          placeholder=""
                          value={preferredDate}
                          onChange={setPreferredDate}
                          required
                          min={minDate}
                        />
                        <label className="block space-y-2">
                          <span className="text-[13px] font-medium text-[#fbf8f4]/90">
                            Preferred time (EAT)
                          </span>
                          <div className="relative">
                            <select
                              name="preferredTime"
                              value={preferredTime}
                              onChange={(event) => setPreferredTime(event.target.value)}
                              className={`${fieldClass} appearance-none`}
                            >
                              {TIME_OPTIONS.map((option) => (
                                <option key={option.value || 'any'} value={option.value} className="bg-[#1A1714]">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                              aria-hidden
                            />
                          </div>
                        </label>
                        <label className="block space-y-2">
                          <span className="text-[13px] font-medium text-[#fbf8f4]/90">
                            Anything else?
                          </span>
                          <textarea
                            name="message"
                            value={message}
                            rows={3}
                            placeholder="Entities, timelines, logistics needs..."
                            onChange={(event) => setMessage(event.target.value)}
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[#fbf8f4] placeholder:text-white/30 transition-shadow focus:border-[var(--sc-coral)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--sc-coral)]/15"
                          />
                        </label>
                        {modules.length > 0 ? (
                          <p className="text-[12px] text-[#fbf8f4]/50">
                            Modules selected: {modules.join(', ')}
                          </p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {error ? (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex gap-3 pt-1">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-medium text-[#fbf8f4] transition hover:bg-white/[0.06]"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Back
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#fbf8f4] text-[14px] font-semibold text-[#1a1714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : step < TOTAL_STEPS ? (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </>
                      ) : (
                        MARKETING_CTAS.bookDemo
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center text-sm text-[#fbf8f4]/55">
                  Already on Stride?{' '}
                  <Link
                    href={getMarketingLoginUrl()}
                    className="font-medium text-[#fbf8f4] underline-offset-4 hover:text-[var(--sc-coral)] hover:underline"
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
