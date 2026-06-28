import Link from "next/link";
import Image from "next/image";
import NebulaBackground from "@/components/ui/nebula-background";
import NavbarClient    from "@/components/landing/NavbarClient";
import HeroSection     from "@/components/landing/HeroSection";
import MetricsStrip    from "@/components/landing/MetricsStrip";
import BentoFeatures   from "@/components/landing/BentoFeatures";
import TestimonialsGrid from "@/components/landing/TestimonialsGrid";
import { Pricing, type PricingPlan } from "@/components/ui/pricing";

// ─── Shared icons ──────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const universities = [
  { name: "UNAM",                 color: "#FABD00", glow: "#1565C0" },
  { name: "IPN",                  color: "#EF5350", glow: "#C62828" },
  { name: "UAM",                  color: "#CE93D8", glow: "#7B1FA2" },
  { name: "COMIPEMS",             color: "#A5D6A7", glow: "#2E7D32" },
  { name: "EXANI-II",             color: "#81D4FA", glow: "#0277BD" },
  { name: "CENEVAL",              color: "#80DEEA", glow: "#00838F" },
  { name: "Politécnico Nacional", color: "#EF9A9A", glow: "#C62828" },
  { name: "UNAM Licenciatura",    color: "#FFF176", glow: "#F9A825" },
  { name: "PREPA UNAM",           color: "#FABD00", glow: "#1565C0" },
  { name: "CCH",                  color: "#B0BEC5", glow: "#37474F" },
  // duplicate for seamless loop
  { name: "UNAM",                 color: "#FABD00", glow: "#1565C0" },
  { name: "IPN",                  color: "#EF5350", glow: "#C62828" },
  { name: "UAM",                  color: "#CE93D8", glow: "#7B1FA2" },
  { name: "COMIPEMS",             color: "#A5D6A7", glow: "#2E7D32" },
  { name: "EXANI-II",             color: "#81D4FA", glow: "#0277BD" },
  { name: "CENEVAL",              color: "#80DEEA", glow: "#00838F" },
  { name: "Politécnico Nacional", color: "#EF9A9A", glow: "#C62828" },
  { name: "UNAM Licenciatura",    color: "#FFF176", glow: "#F9A825" },
  { name: "PREPA UNAM",           color: "#FABD00", glow: "#1565C0" },
  { name: "CCH",                  color: "#B0BEC5", glow: "#37474F" },
];

const courses = [
  { tag: "Licenciatura", duration: "6 meses", title: "Examen UNAM",        desc: "120 reactivos de 6 áreas. El banco más completo del país.",             enrolled: "32,400", accent: "#A78BFA" },
  { tag: "Licenciatura", duration: "5 meses", title: "Examen IPN",         desc: "Comipems + examen propio del Politécnico. Énfasis en exactas.",          enrolled: "21,200", accent: "#F43F5E" },
  { tag: "Licenciatura", duration: "4 meses", title: "Examen UAM",         desc: "Preparación por unidad: Azcapotzalco, Iztapalapa, Xochimilco y más.",    enrolled: "9,120",  accent: "#22D3EE" },
  { tag: "Bachillerato", duration: "3 meses", title: "COMIPEMS",           desc: "128 reactivos para las 629 opciones de prepa en la Zona Metropolitana.", enrolled: "24,870", accent: "#F59E0B" },
  { tag: "Licenciatura", duration: "4 meses", title: "EXANI-II (CENEVAL)", desc: "Pensamiento matemático, analítico y comprensión lectora.",               enrolled: "12,300", accent: "#10B981" },
  { tag: "Popular",      duration: "30 días", title: "Intensivo 30 días",  desc: "Recta final. Resumen ejecutivo, preguntas trampa y estrategia total.",    enrolled: "6,890",  accent: "#F43F5E" },
];

const faqs = [
  { q: "¿Qué pasa después de los 7 días gratis?", a: "Si decides continuar, se cobra el plan elegido. Si no, el acceso simplemente pausa. Te avisamos 48 h antes." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cobro se ajusta de forma proporcional." },
  { q: "¿Los simulacros son exactamente iguales al examen real?", a: "Replicamos el formato, el número de reactivos, el tiempo y los tipos de preguntas oficiales. Se actualiza cada ciclo." },
  { q: "¿Qué dispositivos son compatibles?", a: "CEFI GO funciona en cualquier navegador moderno. Tu progreso se sincroniza en todos tus dispositivos." },
  { q: "¿Ofrecen beca o descuento?", a: "Tenemos un programa de becas CEFI para estudiantes con promedio de 9.0+ y situación económica limitada." },
  { q: "¿Cómo funciona la garantía del plan Elite?", a: "Si cumpliste con tu plan de estudio (al menos 80% de las actividades) y no apruebas, te devolvemos el 100% de lo pagado." },
];

const PRICING: PricingPlan[] = [
  {
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    period: "siempre",
    description: "Para explorar la plataforma sin costo.",
    buttonText: "Comienza gratis",
    href: "/register",
    isPopular: false,
    features: ["20 lecciones introductorias", "2 simulacros al mes", "Comunidad de estudio"],
    excluded: ["Plan personalizado con IA", "Mentorías", "Simulacros ilimitados"],
  },
  {
    name: "Pro",
    price: 299,
    yearlyPrice: 239,
    period: "mes",
    description: "Todo lo que necesitas para aprobar tu examen de admisión.",
    buttonText: "Empezar 7 días gratis",
    href: "/register",
    isPopular: true,
    features: ["Acceso ilimitado a todos los cursos", "Simulacros reales sin límite", "Plan personalizado con IA", "4 mentorías grupales/mes", "Materiales descargables"],
  },
  {
    name: "Elite",
    price: 699,
    yearlyPrice: 559,
    period: "mes",
    description: "Preparación premium con garantía de resultados.",
    buttonText: "Elegir Elite",
    href: "/register",
    isPopular: false,
    features: ["Todo lo incluido en Pro", "Mentor personal 1-a-1 semanal", "Revisión de ensayos ilimitada", "Acceso anticipado a novedades", "Garantía: aprueba o reembolso"],
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <NebulaBackground />
      <div className="grid-overlay fixed inset-0 pointer-events-none" aria-hidden="true" />
      <a className="skip-link" href="#main">Saltar al contenido</a>

      {/* Navbar with scroll blur */}
      <NavbarClient />

      <main id="main" className="relative z-10">

        {/* Hero — rotating text + animated device frame */}
        <HeroSection />

        {/* Trust marquee — university colors */}
        <div className="py-5 border-y border-white/5 overflow-hidden">
          <div className="marquee-outer">
            <div className="marquee">
              {universities.map((u, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 text-sm font-bold whitespace-nowrap"
                  style={{ color: u.color }}
                >
                  {/* Color dot with glow */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: u.color,
                      boxShadow: `0 0 8px ${u.glow}`,
                    }}
                  />
                  {u.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Animated metrics strip */}
        <MetricsStrip />

        {/* Bento features grid */}
        <BentoFeatures />

        {/* Courses */}
        <section id="cursos" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Cursos</span>
              <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Preparación para{" "}
                <span className="gradient-text">cada examen</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <Link
                  key={c.title}
                  href="/register"
                  className="group rounded-2xl bg-white/[0.03] border border-white/8 p-6 hover:border-white/16 hover:bg-white/[0.05] transition-all duration-300 block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}33` }}
                    >
                      {c.tag}
                    </span>
                    <span className="text-xs text-white/35">{c.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{c.title}</h3>
                  <p className="text-sm text-white/50 mb-5 leading-relaxed">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/35">{c.enrolled} aspirantes</span>
                    <span className="text-white/25 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-200">
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Cómo funciona</span>
              <h2 className="text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                De cero a aprobado en{" "}
                <span className="gradient-text">3 pasos</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
              {[
                { num: "01", title: "Haz tu diagnóstico", desc: "Un examen inicial de 30 preguntas detecta exactamente en qué temas fallas y cuál es tu probabilidad de ingreso hoy." },
                { num: "02", title: "Recibe tu plan",     desc: "Ruta semanal diseñada con IA: cursos, lecturas, ejercicios y fechas clave. Se adapta cada semana a tu avance." },
                { num: "03", title: "Estudia y domina",   desc: "Simulacros oficiales, mentorías y comunidad. Llegas al examen real con la confianza de quien ya lo presentó 20 veces." },
              ].map((step) => (
                <div key={step.num} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials — asymmetric grid */}
        <TestimonialsGrid />

        {/* Pricing */}
        <section id="planes" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Planes simples</span>
              <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Invierte en tu <span className="gradient-text">futuro</span>
              </h2>
              <p className="text-white/45 text-sm">Prueba 7 días gratis. Cancela cuando quieras. Sin letras chiquitas.</p>
            </div>
            <Pricing plans={PRICING} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Dudas frecuentes</span>
              <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
                ¿Algo que quieras <span className="gradient-text">preguntar</span>?
              </h2>
              <p className="text-white/45">
                Si tu duda no está aquí, escríbenos a{" "}
                <a href="mailto:hola@cefigo.mx" className="text-violet-400 hover:underline">hola@cefigo.mx</a>{" "}
                y te respondemos en menos de 24 h.
              </p>
            </div>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl bg-white/[0.03] border border-white/8 px-6 py-5 cursor-pointer hover:border-white/14 transition-colors">
                  <summary className="flex items-center justify-between gap-4 font-semibold text-white/80 list-none">
                    {faq.q}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-white/35">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden p-16 text-center border border-violet-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#0B0617] to-pink-900/30" />
              {/* Glow orbs */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-10 right-1/4 w-60 h-60 bg-pink-600/15 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 block">Empieza hoy</span>
                <h2 className="text-5xl font-black mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Tu carrera soñada está a{" "}
                  <span className="gradient-text">un clic</span>
                </h2>
                <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg">
                  Únete a los estudiantes que ya respondieron más de 14 millones de reactivos con{" "}
                  <span style={{ background: "linear-gradient(90deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>CEFI GO</span>.
                  Sin tarjeta. Sin compromisos. Solo resultados.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-xl shadow-violet-900/40"
                  >
                    Crear mi cuenta gratis <ArrowIcon />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white/6 border border-white/12 text-white/75 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label="CEFI GO">
                <Image src="/logos/ICO-mini.png" alt="" width={28} height={28} className="rounded-lg" />
                <span className="font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  CEFI <span className="gradient-text">GO</span>
                </span>
              </Link>
              <p className="text-sm text-white/35 mb-6 leading-relaxed max-w-xs">
                Tu puerta a la universidad, con tecnología y mentores que sí la entienden.
              </p>
              <div className="flex gap-3">
                {/* Social links placeholder */}
                {["TW", "IG", "YT"].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-xs text-white/35 hover:text-white hover:bg-white/10 transition-all font-bold">
                    {s}
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Plataforma", links: ["Cursos", "Simulacros", "Mentorías", "Plan con IA"] },
              { title: "Recursos",   links: ["Blog", "Guía UNAM", "Guía IPN", "Centro de ayuda"] },
              { title: "Empresa",    links: ["Sobre CEFI GO", "Trabaja con nosotros", "Prensa", "Contacto"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="h-px bg-white/6 mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
            <p>© 2026 CEFI GO · Hecho con pasión en México.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white/50 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white/50 transition-colors">Términos</a>
              <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
