# Payment UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three payment UI surfaces — `PaywallOverlay` component, `/suscribirse` plan selector page, and `/bienvenida` post-payment success page — fully styled and ready to wire up to Stripe during backend implementation.

**Architecture:** Pure frontend implementation using existing design system (glassmorphism cards, brand colors, animations). No Stripe SDK yet — placeholder prices hardcoded, CTA button annotated for future wiring. All three surfaces live inside the `(app)` layout shell (sidebar + topbar visible).

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, TypeScript. No new dependencies.

---

## File Map

| File | Status | Responsibility |
|------|--------|---------------|
| `components/ui/paywall-overlay.tsx` | CREATE | Inline paywall shown over locked content |
| `app/(app)/suscribirse/page.tsx` | CREATE | Plan selector page with Stripe CTA |
| `app/(app)/bienvenida/page.tsx` | CREATE | Post-payment success page with suggestions |

---

## Task 1: PaywallOverlay Component

**Files:**
- Create: `components/ui/paywall-overlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/ui/paywall-overlay.tsx
'use client';

import Link from 'next/link';

interface PaywallOverlayProps {
  contentType: 'lesson' | 'exam' | 'resource';
}

const headlines: Record<PaywallOverlayProps['contentType'], string> = {
  lesson: 'Este tema es Pro',
  exam: 'Este examen es Pro',
  resource: 'Este recurso es Pro',
};

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="#A78BFA" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PaywallOverlay({ contentType }: PaywallOverlayProps) {
  return (
    <div className="relative w-full min-h-[320px] flex items-center justify-center">
      {/* Blurred placeholder behind */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-white/5 backdrop-blur-sm" />
      </div>

      {/* Paywall card */}
      <div className="card relative z-10 w-full max-w-sm mx-auto p-8 flex flex-col items-center text-center gap-5">
        {/* Lock icon */}
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <LockIcon />
        </div>

        {/* Headline */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {headlines[contentType]}
          </h3>
          <p className="text-sm text-white/50">Desbloquea todo con un plan Pro</p>
        </div>

        {/* Free tier info */}
        <div className="w-full rounded-lg bg-white/5 border border-white/8 p-4 text-left">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
            Tu plan gratuito incluye
          </p>
          <ul className="space-y-1">
            <li className="text-sm text-white/60">· 2 temas de 1 materia</li>
            <li className="text-sm text-white/60">· 1 examen de práctica</li>
          </ul>
        </div>

        {/* Pro checklist */}
        <div className="w-full text-left">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
            Con Pro desbloqueas
          </p>
          <ul className="space-y-1.5">
            {['Todos los cursos y materias', 'Exámenes ilimitados', 'Recursos y materiales'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/suscribirse"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm
            transition-colors duration-150"
        >
          Ver planes
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Secondary */}
        <Link
          href="/login"
          className="text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          Ya soy Pro · Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/paywall-overlay.tsx
git commit -m "feat: add PaywallOverlay component for locked content"
```

---

## Task 2: `/suscribirse` Plan Selector Page

**Files:**
- Create: `app/(app)/suscribirse/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// app/(app)/suscribirse/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="#A78BFA" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const plans = [
  {
    id: '6m' as const,
    label: '6 meses',
    price: '$XXX MXN',
    priceNote: '/6 meses',
    badge: null,
    featured: false,
    features: [
      'Todos los cursos y materias',
      'Exámenes ilimitados',
      'Recursos y materiales',
      'Acceso por 6 meses',
    ],
  },
  {
    id: '12m' as const,
    label: '12 meses',
    price: '$XXX MXN',
    priceNote: '/año',
    badge: '★ Más popular',
    featured: true,
    features: [
      'Todo lo del plan semestral',
      '2 meses adicionales de acceso',
      'Mejor precio por mes',
    ],
  },
];

type PlanId = '6m' | '12m';

export default function SuscribirsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  // TODO(backend): replace with Stripe Checkout session creation
  const handleCheckout = () => {
    if (!selected) return;
    alert(`Próximamente: Stripe checkout para plan ${selected}`);
  };

  return (
    <div className="min-h-full px-4 py-10">
      {/* Cancelled toast */}
      {showToast && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
            px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300
            text-sm font-medium shadow-lg"
        >
          <span>Pago cancelado — puedes intentarlo de nuevo.</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-red-300/60 hover:text-red-300 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-[700px] mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70
            transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver
        </button>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Elige tu plan</h1>
          <p className="text-white/50">Acceso completo a todo CEFIGO</p>
        </div>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={[
                'text-left transition-all duration-200 rounded-2xl p-0 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-violet-500',
                selected === plan.id ? 'opacity-100' : selected ? 'opacity-50' : 'opacity-100',
              ].join(' ')}
              aria-pressed={selected === plan.id}
            >
              <div
                className={[
                  plan.featured ? 'card-featured' : 'card',
                  'relative p-6 rounded-2xl h-full transition-all duration-200',
                  selected === plan.id
                    ? 'ring-2 ring-violet-500'
                    : '',
                ].join(' ')}
                style={plan.featured ? { background: 'rgba(12,6,28,0.75)', borderColor: 'transparent' } : {}}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold
                    bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {plan.badge}
                  </span>
                )}

                {/* Plan name + price */}
                <h2 className="text-lg font-bold text-white mb-1">{plan.label}</h2>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.priceNote}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/75">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Selected indicator */}
                {selected === plan.id && (
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-violet-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Seleccionado
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={!selected}
          className={[
            'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
            'font-semibold text-base transition-all duration-200',
            selected
              ? 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer'
              : 'bg-violet-600/30 text-white/30 cursor-not-allowed',
          ].join(' ')}
          aria-describedby="trust-line"
        >
          Continuar con Stripe
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Trust */}
        <p
          id="trust-line"
          className="flex items-center justify-center gap-2 mt-4 text-xs text-white/30"
        >
          <LockIcon />
          Pago seguro · SSL · Stripe
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/(app)/suscribirse/page.tsx
git commit -m "feat: add /suscribirse plan selector page"
```

---

## Task 3: `/bienvenida` Post-Payment Success Page

**Files:**
- Create: `app/(app)/bienvenida/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// app/(app)/bienvenida/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface BienvenidaPageProps {
  searchParams: Promise<{ session_id?: string; plan?: string }>;
}

// TODO(backend): replace with real Stripe session verification
async function verifySession(sessionId: string | undefined): Promise<{
  valid: boolean;
  planLabel: string;
  price: string;
  expiresAt: Date;
} | null> {
  if (!sessionId) return null;
  // Mock: any non-empty session_id is treated as valid during frontend-only phase
  const months = sessionId.includes('12') ? 12 : 6;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);
  return {
    valid: true,
    planLabel: months === 12 ? '12 meses' : '6 meses',
    price: '$XXX MXN',
    expiresAt,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const suggestions = [
  {
    href: '/courses',
    label: 'Cursos',
    description: 'Empieza a estudiar',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    href: '/exam',
    label: 'Exámenes',
    description: 'Pon a prueba tu nivel',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: '/resources',
    label: 'Recursos',
    description: 'Material de estudio',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default async function BienvenidaPage({ searchParams }: BienvenidaPageProps) {
  const params = await searchParams;
  const session = await verifySession(params.session_id);

  if (!session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-full flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Hero */}
        <div className="hero-enter delay-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium mb-6">
            <span>✦</span>
            <span>¡Ya eres Pro!</span>
            <span>✦</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Bienvenido a{' '}
            <span className="gradient-text">CEFIGO Pro</span>
          </h1>
          <p className="text-white/50 text-base">
            Tu acceso está activo hasta{' '}
            <span className="text-white/80 font-medium">{formatDate(session.expiresAt)}</span>
          </p>
        </div>

        {/* Plan chip */}
        <div className="hero-enter delay-1 mt-5 mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-white/5 border border-white/10 text-sm text-white/60">
            Plan: {session.planLabel} · {session.price}
          </span>
        </div>

        {/* Suggestions */}
        <div className="hero-enter delay-2">
          <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
            ¿Por dónde empezar?
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {suggestions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="card card-lift p-4 rounded-xl flex flex-col items-center gap-2
                  text-center transition-all duration-200 group"
              >
                <span className="text-violet-400 group-hover:text-violet-300 transition-colors">
                  {s.icon}
                </span>
                <span className="text-sm font-semibold text-white">{s.label}</span>
                <span className="text-xs text-white/40">{s.description}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div className="hero-enter delay-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
              bg-violet-600 hover:bg-violet-500 text-white font-semibold
              transition-colors duration-150"
          >
            Ir a mi dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/bienvenida/page.tsx"
git commit -m "feat: add /bienvenida post-payment success page"
```

---

## Task 4: Final build check

- [ ] **Step 1: Full build**

```bash
npx next build
```

Expected: `✓ Compiled successfully` with no TypeScript or lint errors.

- [ ] **Step 2: Manual smoke test**

Visit the following routes in the browser (dev server: `npx next dev`):

| Route | What to verify |
|-------|---------------|
| `/suscribirse` | Both plan cards render, selecting one highlights it and enables CTA button |
| `/suscribirse?cancelled=true` | Toast "Pago cancelado" appears and auto-dismisses after 5s |
| `/bienvenida?session_id=test-6m` | Shows Pro welcome, expiry date 6 months from today, 3 suggestion cards |
| `/bienvenida?session_id=test-12m` | Shows Pro welcome, expiry date 12 months from today |
| `/bienvenida` (no session_id) | Redirects to `/dashboard` |
| Any page using `<PaywallOverlay contentType="lesson" />` | Lock card centered over blurred background, "Este tema es Pro" headline |

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify payment UI build and smoke test complete"
```

---

## Notes for Backend Wiring (future)

When Stripe backend is implemented, replace these two stubs:

1. **`handleCheckout` in `/suscribirse`** — call a Server Action that creates a Stripe Checkout Session and redirects to `session.url`. Remove the `alert()`.

2. **`verifySession` in `/bienvenida`** — call Stripe's `stripe.checkout.sessions.retrieve(sessionId)` and return real plan/price/expiry from the session metadata.
