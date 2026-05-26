// app/(app)/suscribirse/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5"
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

type PlanId = '6m' | '12m';

const plans: Array<{
  id: PlanId;
  label: string;
  price: string;
  priceNote: string;
  badge: string | null;
  featured: boolean;
  features: string[];
}> = [
  {
    id: '6m',
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
    id: '12m',
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
            aria-label="Cerrar notificación"
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
            transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-violet-400 rounded"
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
                'text-left transition-all duration-200 rounded-2xl p-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                selected === plan.id ? 'opacity-100' : selected ? 'opacity-50' : 'opacity-100',
              ].join(' ')}
              aria-pressed={selected === plan.id}
              aria-label={`Seleccionar plan ${plan.label}`}
            >
              <div
                className={[
                  plan.featured ? 'card-featured' : 'card',
                  'relative p-6 rounded-2xl h-full transition-all duration-200',
                  selected === plan.id ? 'ring-2 ring-violet-500' : '',
                ].join(' ')}
                style={plan.featured ? { background: 'rgba(12,6,28,0.75)', borderColor: 'transparent' } : {}}
              >
                {plan.badge && (
                  <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold
                    bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {plan.badge}
                  </span>
                )}

                <h2 className="text-lg font-bold text-white mb-1">{plan.label}</h2>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.priceNote}</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/75 text-violet-400">
                      <CheckIcon />
                      <span className="text-white/75">{f}</span>
                    </li>
                  ))}
                </ul>

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
          aria-disabled={!selected}
          className={[
            'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
            'font-semibold text-base transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
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
