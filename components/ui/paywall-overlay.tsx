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

const PRO_FEATURES = ['Todos los cursos y materias', 'Exámenes ilimitados', 'Recursos y materiales'];

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PaywallOverlay({ contentType }: PaywallOverlayProps) {
  return (
    <div className="relative w-full min-h-80 flex items-center justify-center">
      {/* Blurred placeholder behind */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-white/5 backdrop-blur-sm" />
      </div>

      {/* Paywall card */}
      <div
        role="region"
        aria-label="Contenido exclusivo para usuarios Pro"
        className="card relative z-10 w-full max-w-sm mx-auto p-8 flex flex-col items-center text-center gap-5"
      >
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
        <div className="w-full rounded-lg bg-white/5 border border-white/10 p-4 text-left">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
            Tu plan gratuito incluye
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li className="text-sm text-white/60">2 temas de 1 materia</li>
            <li className="text-sm text-white/60">1 examen de práctica</li>
          </ul>
        </div>

        {/* Pro checklist */}
        <div className="w-full text-left">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
            Con Pro desbloqueas
          </p>
          <ul className="space-y-1.5">
            {PRO_FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/80 [&>svg]:text-violet-400">
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
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0A18]"
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
          className="text-xs text-white/40 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1"
        >
          Ya soy Pro · Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
