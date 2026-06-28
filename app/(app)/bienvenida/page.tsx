// app/(app)/bienvenida/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface BienvenidaPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

// TODO(backend): replace with real Stripe session verification via stripe.checkout.sessions.retrieve()
async function verifySession(sessionId: string | undefined): Promise<{
  planLabel: string;
  price: string;
  expiresAt: Date;
} | null> {
  if (!sessionId) return null;
  const months = sessionId.includes('12') ? 12 : 6;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);
  return {
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

const CoursesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const ExamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ResourcesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const suggestions = [
  { href: '/courses', label: 'Cursos', description: 'Empieza a estudiar', icon: <CoursesIcon /> },
  { href: '/exam', label: 'Exámenes', description: 'Pon a prueba tu nivel', icon: <ExamIcon /> },
  { href: '/resources', label: 'Recursos', description: 'Material de estudio', icon: <ResourcesIcon /> },
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
            bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium mb-6"
            role="status"
            aria-label="Plan activo"
          >
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-violet-300" />
            <span>¡Ya eres Pro!</span>
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-violet-300" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Bienvenido a{' '}
            <span className="gradient-text">CEFIGO Pro</span>
          </h1>
          <p className="text-white/50 text-base">
            Tu acceso está activo hasta{' '}
            <time
              className="text-white/80 font-medium"
              dateTime={session.expiresAt.toISOString()}
            >
              {formatDate(session.expiresAt)}
            </time>
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
          <div className="grid grid-cols-3 gap-3 mb-8" role="list">
            {suggestions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                role="listitem"
                className="card card-lift p-4 rounded-xl flex flex-col items-center gap-2
                  text-center group focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-violet-400 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#0E0A18]"
                aria-label={s.label}
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
              transition-colors duration-150 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
              focus-visible:ring-offset-[#0E0A18]"
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
