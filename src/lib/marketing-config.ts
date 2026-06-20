/** Stride public marketing site — content and routing config. */

export const MARKETING_ROUTES = {
  home: '/',
  platform: '/platform',
  industries: '/industries',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  login: '/dashboard/login',
} as const;

/** Public marketing site hostname (no protocol). */
export const MARKETING_CANONICAL_DOMAIN =
  process.env.NEXT_PUBLIC_MARKETING_DOMAIN?.trim() || 'getstride.co.ke';

/** Client app origin shown in product mockups (dashboard login lives here). */
export const MARKETING_APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.trim()?.replace(/\/$/, '') ||
  'https://app.getstride.co.ke';

/** Host + optional path for mockup chrome bars, e.g. app.getstride.co.ke/dashboard */
export function marketingAppHostLabel(path = ''): string {
  try {
    const host = new URL(MARKETING_APP_ORIGIN).host;
    return path ? `${host}${path.startsWith('/') ? path : `/${path}`}` : host;
  } catch {
    return `app.${MARKETING_CANONICAL_DOMAIN}${path}`;
  }
}

export function getMarketingSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return `https://${MARKETING_CANONICAL_DOMAIN}`;
}

/** Public sales inbox for marketing site CTAs (forwards to team until getstride.co.ke mail is live). */
export const MARKETING_SALES_EMAIL = 'hello@getstride.co.ke';

/** Sales-led CTAs — no public self-service signup until provisioning exists. */
export const MARKETING_CTAS = {
  bookDemo: 'Book a demo',
  signIn: 'Sign in',
  talkToSales: 'Talk to sales',
  watchDemo: 'Watch demo',
  seeFleet: 'See the fleet module',
  joinWaitlist: 'Join the waitlist',
  explorePlatform: 'Explore the platform',
} as const;

export const MARKETING_NAV_LINKS = [
  { href: MARKETING_ROUTES.platform, label: 'Platform' },
  { href: MARKETING_ROUTES.industries, label: 'Industries' },
  { href: MARKETING_ROUTES.pricing, label: 'Pricing' },
  { href: MARKETING_ROUTES.about, label: 'About' },
] as const;

export const MARKETING_HERO = {
  eyebrow: 'Operations platform · East Africa',
  titleLines: ['Run your whole', 'business as one.'] as const,
  /** Final phrase on the accent line, rendered in brand coral. */
  titleAccent: 'as one.',
  sub:
    'Six modules on one platform — built for East Africa, with M-Pesa, KRA and NSSF from day one.',
  descriptionHighlight: 'M-Pesa, KRA and NSSF',
  trustBadge: 'Built for Kenya',
  trustTags: 'M-Pesa · KRA · NSSF',
} as const;

export const MARKETING_WHY_STRIDE = {
  badge: 'Why Stride',
  titleLines: ['Built for East Africa.', 'Not adapted for it.'] as const,
  body: 'Global ERPs were designed for other markets and retrofitted for Kenya. Stride is built from the ground up — M-Pesa disbursements, KRA compliance, multi-entity SACCO structures and East African payroll logic are first-class features, not afterthoughts.',
} as const;

export const MARKETING_INDUSTRIES_SECTION = {
  badge: 'Built for your industry',
  title: 'Then it gets specific.',
} as const;

/** Brand tokens for studio-craft (v3) — mirrors public-theme.css, no new colors. */
export const MARKETING_BRAND = {
  coral: '#FF5436',
  coralDeep: '#E63E22',
  ink: '#1A1714',
  inkMuted: '#3D3833',
  paper: '#FBF8F4',
  paper2: '#F4EFE8',
  line: '#E6DED4',
} as const;

/** Product screenshot for homepage hero showcase (native 1024px — use 2048px @2x PNG when available). */
export const MARKETING_DASHBOARD_HERO = {
  src: '/marketing/stride-dashboard-hero.png',
  width: 1024,
  height: 591,
  /** Crop height from top — sidebar, module banner, and “At a glance” row only. */
  visibleHeight: 352,
  alt: 'Stride HR and payroll dashboard for Amani Medical Centre',
} as const;

export const MARKETING_DEMO_STEPS = [
  { number: 1, text: 'Tell us about your team' },
  { number: 2, text: 'Pick the modules you need' },
  { number: 3, text: 'Book your walkthrough' },
] as const;

/** Book-a-demo left panel — HLS stream with MP4 fallback. */
export const MARKETING_DEMO_VIDEO = {
  hls: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.m3u8',
  mp4: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4',
} as const;

/** Hero shader tuning — warm paper base with slow coral drift. */
export const MARKETING_HERO_SHADER = {
  swirl: {
    colorA: MARKETING_BRAND.paper,
    colorB: MARKETING_BRAND.paper2,
    detail: 1.35,
    speed: 0.32,
    blend: 42,
    colorSpace: 'oklch' as const,
  },
  chromaFlow: {
    baseColor: MARKETING_BRAND.paper,
    upColor: MARKETING_BRAND.paper2,
    downColor: MARKETING_BRAND.coral,
    leftColor: MARKETING_BRAND.paper2,
    rightColor: MARKETING_BRAND.coral,
    intensity: 0.58,
    momentum: 26,
    radius: 2.6,
  },
  flutedGlass: {
    aberration: 0.38,
    angle: 31,
    frequency: 7,
    highlight: 0.08,
    highlightSoftness: 0.45,
    lightAngle: -90,
    refraction: 2.8,
    shape: 'rounded' as const,
    softness: 1,
    speed: 0.07,
  },
  filmGrain: { strength: 0.035 },
} as const;

export const TRUST_CLIENTS = [
  'Nyati SACCO',
  'SwiftFreight',
  'Stabex',
  'Cape Media',
  "St. Paul's",
] as const;

export const CORE_MODULES = [
  {
    num: '01 — HR',
    name: 'HR & Payroll',
    description:
      'Payroll, leave, onboarding and employee self-service — KRA, NSSF and SHIF compliance built right in.',
  },
  {
    num: '02 — Finance',
    name: 'Finance',
    description:
      'Accounts, budgets, approvals and M-Pesa disbursements in one ledger. Real numbers, in real time.',
  },
  {
    num: '03 — Procurement',
    name: 'Procurement',
    description:
      'Purchase requests, vendor management, LPO generation and spend tracking — structured from day one.',
  },
  {
    num: '04 — Legal',
    name: 'Legal & Documents',
    description:
      'Contract registers, compliance tracking and document workflows. Never miss a renewal or obligation.',
  },
  {
    num: '05 — Projects',
    name: 'Projects',
    description:
      'Track deliverables, assign tasks and watch budgets against real execution — tied to your real team.',
  },
  {
    num: '06 — Admin',
    name: 'Admin',
    description:
      'Asset registers, fleet, facilities and board resolutions — the operational layer most platforms skip.',
  },
] as const;

export type IndustrySector =
  | 'logistics'
  | 'saccos'
  | 'healthcare'
  | 'energy'
  | 'construction';

export const INDUSTRY_VERTICALS: {
  id: IndustrySector;
  name: string;
  status: 'available' | 'coming_soon';
  description: string;
  features: string[];
  href: string;
}[] = [
  {
    id: 'logistics',
    name: 'Logistics & Cargo',
    status: 'available',
    description:
      'Order intake, route & trip planning, vehicle and driver allocation, pre-trip compliance, in-transit monitoring, proof of delivery, settlement and billing — the full fleet workflow on one platform.',
    features: [
      'Fleet & vehicle register',
      'Route & trip planning',
      'Driver records & compliance',
      'Fuel & maintenance logs',
      'Delivery tracking & POD',
    ],
    href: '/industries/logistics',
  },
  {
    id: 'saccos',
    name: 'SACCOs',
    status: 'coming_soon',
    description: 'Member management, dividends, BOSA/FOSA and regulatory reporting — built for regulated cooperatives.',
    features: ['Member management', 'Dividends', 'BOSA / FOSA', 'Regulatory reporting'],
    href: '/industries/saccos',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    status: 'coming_soon',
    description: 'Rota, biometric clock-in, and shift scheduling for clinical and non-clinical teams.',
    features: ['Shift rota', 'Biometric clock-in', 'Licence tracking', 'NHIF-ready payroll'],
    href: '/industries/healthcare',
  },
  {
    id: 'energy',
    name: 'Oil & Gas / Energy',
    status: 'coming_soon',
    description: 'HSE and compliance, incident reporting, and multi-entity operations for energy operators.',
    features: ['HSE & compliance', 'Incident reporting', 'Multi-entity', 'Permit tracking'],
    href: '/industries/energy',
  },
  {
    id: 'construction',
    name: 'Construction',
    status: 'coming_soon',
    description: 'Site and project management, plant tracking, and subcontractor workflows.',
    features: ['Site management', 'Asset / plant tracking', 'Subcontractors', 'Project budgets'],
    href: '/industries/construction',
  },
];

export const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'KES 18K',
    unit: 'per month · up to 25 staff',
    description: 'For small teams and consultancies getting their operations onto one platform.',
    features: [
      '2 core modules included',
      'Up to 25 employees',
      'M-Pesa disbursements',
      'KRA / NSSF / SHIF compliance',
      'Email support',
    ],
    cta: 'Book a demo',
    featured: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 'KES 55K',
    unit: 'per month · up to 100 staff',
    description: 'For growing organisations running multiple functions across one or more entities.',
    features: [
      '4 core modules included',
      'Up to 100 employees',
      'Multi-entity support',
      'Advanced approvals & workflows',
      'Priority support + onboarding',
    ],
    cta: 'Book a demo',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    unit: '100+ staff · multi-entity',
    description: 'For SACCOs and regulated mid-market needing the full platform and bespoke rollout.',
    features: [
      'All six modules',
      'Unlimited employees',
      'Dedicated success manager',
      'Custom integrations & SLAs',
      'On-site implementation',
    ],
    cta: 'Talk to sales',
    featured: false,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'Is Stride compliant with Kenyan payroll regulations?',
    answer:
      'Yes. KRA PAYE, NSSF, SHIF and statutory deductions are built in from day one — not bolted on as an afterthought. Payslips, P9s and filing exports are included.',
  },
  {
    question: 'Can we start with one module and add more later?',
    answer:
      'Absolutely. Most teams begin with HR and Finance, then turn on Procurement, Projects or vertical packs when they are ready. One login, one data layer throughout.',
  },
  {
    question: 'Do you support M-Pesa for salary disbursements?',
    answer:
      'M-Pesa bulk disbursements and reconciliation are first-class — designed for how Kenyan businesses actually pay people.',
  },
  {
    question: 'How long does onboarding take?',
    answer:
      'Most teams go live in days, not months. Guided onboarding, data import templates and local support are included on Growth and Enterprise plans.',
  },
  {
    question: 'Where is our data stored? Is it secure?',
    answer:
      'Data is hosted on modern cloud infrastructure with encryption in transit and at rest. We follow Kenya Data Protection Act (ODPC) principles and provide audit trails for sensitive actions.',
  },
  {
    question: 'Do you support my industry?',
    answer:
      'The horizontal core works for any business. Logistics & Cargo is available today as the first vertical pack; SACCOs, Healthcare, Energy and Construction are on the roadmap — join the waitlist for your sector.',
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 'Step 01',
    title: 'Start with what you need',
    body: 'Turn on one module or all six. Most teams begin with HR and Finance, then expand. No forced bundles, no shelfware.',
  },
  {
    step: 'Step 02',
    title: 'Configure for your context',
    body: 'Multi-entity, multi-currency, Kenya and Uganda compliance built in. Your structure, your accounts, your workflows.',
  },
  {
    step: 'Step 03',
    title: 'Live in days',
    body: 'Guided onboarding, data import and local support from a team that knows your market — not a queue in another timezone.',
  },
] as const;
