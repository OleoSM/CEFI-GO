import Link from "next/link";

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const universities = [
  "UNAM", "IPN", "UAM", "COMIPEMS", "EXANI-II", "CENEVAL",
  "Politécnico Nacional", "UNAM Licenciatura", "PREPA UNAM", "CCH",
  "UNAM", "IPN", "UAM", "COMIPEMS", "EXANI-II", "CENEVAL",
  "Politécnico Nacional", "UNAM Licenciatura", "PREPA UNAM", "CCH",
];

const features = [
  {
    icon: "📚",
    title: "Cursos estructurados",
    desc: "Lecciones en video + lectura ordenadas por el examen real. Sin relleno. Solo lo que entra.",
  },
  {
    icon: "🎯",
    title: "Simulacros oficiales",
    desc: "Más de 25,000 preguntas reales. Cronómetro, mapa de reactivos y análisis por materia al terminar.",
  },
  {
    icon: "🧭",
    title: "Plan personalizado con IA",
    desc: "Un diagnóstico detecta tus áreas débiles y genera una ruta semanal que se adapta a tu ritmo.",
  },
  {
    icon: "👩‍🏫",
    title: "Mentores expertos",
    desc: "Sesiones 1-a-1 y grupales con estudiantes que ya aprobaron el examen al que tú te preparas.",
  },
  {
    icon: "📊",
    title: "Analítica de progreso",
    desc: "Ve tu probabilidad de ingreso evolucionar semana a semana. Gráficas reales, no estimados vagos.",
  },
  {
    icon: "🔥",
    title: "Racha y gamificación",
    desc: "Logros, rachas y rankings que hacen que estudiar 30 minutos al día se vuelva un hábito imparable.",
  },
];

const courses = [
  { tag: "Licenciatura", duration: "6 meses", title: "Examen UNAM", desc: "120 reactivos de 6 áreas. Biología, Química, Matemáticas, Historia, Español y más. El banco más completo del país.", enrolled: "32,400", accent: "#A78BFA" },
  { tag: "Licenciatura", duration: "5 meses", title: "Examen IPN", desc: "Comipems + examen propio del Politécnico. Énfasis en razonamiento matemático y ciencias exactas.", enrolled: "21,200", accent: "#F43F5E" },
  { tag: "Licenciatura", duration: "4 meses", title: "Examen UAM", desc: "Distinto por unidad. Te preparamos para Azcapotzalco, Cuajimalpa, Iztapalapa, Lerma y Xochimilco.", enrolled: "9,120", accent: "#22D3EE" },
  { tag: "Bachillerato", duration: "3 meses", title: "COMIPEMS", desc: "128 reactivos para entrar a una de las 629 opciones de preparatoria en la Zona Metropolitana.", enrolled: "24,870", accent: "#F59E0B" },
  { tag: "Licenciatura", duration: "4 meses", title: "EXANI-II (CENEVAL)", desc: "Pensamiento matemático, analítico y comprensión lectora. Módulos específicos por universidad.", enrolled: "12,300", accent: "#10B981" },
  { tag: "Popular", duration: "30 días", title: "Intensivo 30 días", desc: "Recta final. Resumen ejecutivo, preguntas trampa y estrategia minuto a minuto para el día del examen.", enrolled: "6,890", accent: "#F43F5E" },
];

const testimonials = [
  { quote: "Empecé con 48 aciertos en el diagnóstico y terminé con 112 en el examen real. Los simulacros de CEFITIPS son idénticos al formato UNAM.", name: "Ximena Ríos", role: "Medicina · UNAM 2025", initials: "XR", gradient: "from-violet-600 to-pink-500" },
  { quote: "El plan personalizado me salvó. Trabajo medio tiempo y no tenía horario fijo para estudiar. La app acomodaba mis sesiones en los huecos libres.", name: "Diego Hernández", role: "Ing. Mecatrónica · IPN 2025", initials: "DH", gradient: "from-cyan-500 to-violet-600" },
  { quote: "Mi mentora también entró a la UAM hace dos años. Saber que alguien ya recorrió el camino cambió mi manera de estudiar por completo.", name: "Valeria Márquez", role: "Diseño · UAM Xochimilco 2025", initials: "VM", gradient: "from-pink-500 to-amber-500" },
];

const faqs = [
  { q: "¿Qué pasa después de los 7 días gratis?", a: "Si decides continuar, se cobra el plan elegido. Si no, el acceso simplemente pausa y no se te cobra nada. Te avisamos 48 h antes del cierre del trial." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cobro se ajusta de forma proporcional." },
  { q: "¿Los simulacros son exactamente iguales al examen real?", a: "Replicamos el formato, el número de reactivos, el tiempo y los tipos de preguntas oficiales. Nuestro banco se alimenta de exámenes pasados y se actualiza cada ciclo." },
  { q: "¿Qué dispositivos son compatibles?", a: "CEFITIPS funciona en cualquier navegador moderno (Chrome, Safari, Firefox, Edge) y tenemos apps nativas para iOS y Android. Tu progreso se sincroniza en todos." },
  { q: "¿Ofrecen beca o descuento?", a: "Tenemos un programa de becas CEFI para estudiantes con promedio de 9.0+ y situación económica limitada. Solicítala desde tu panel una vez registrado." },
  { q: "¿Cómo funciona la garantía del plan Elite?", a: "Si cumpliste con tu plan de estudio (al menos 80% de las actividades) y no apruebas, te devolvemos el 100% de lo pagado. Así de simple." },
];

export default function LandingPage() {
  return (
    <>
      {/* Aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
        <div className="grid-overlay" />
      </div>

      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>

      {/* Navbar */}
      <header className="navbar" id="navbar">
        <div className="navbar__inner">
          <Link href="/" className="flex items-center gap-2.5" aria-label="CEFITIPS inicio">
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <path d="M18 3 L33 11 L33 25 L18 33 L3 25 L3 11 Z" fill="url(#logoGrad)" />
              <path d="M12 14 L18 18 L24 14 M12 22 L18 18 L24 22" stroke="#0B0617" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>
              CEFI<span className="gradient-text">TIPS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/60 ml-8">
            {["#cursos", "#caracteristicas", "#planes", "#testimonios", "#faq"].map((href, i) => (
              <a key={href} href={href} className="hover:text-white transition-colors">
                {["Cursos", "Características", "Planes", "Testimonios", "Preguntas"][i]}
              </a>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn--ghost hidden sm:inline-flex">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn btn--primary">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
                <span className="pulse-dot" aria-hidden="true" />
                Nueva generación de preparación · 2026
              </div>

              <h1
                className="text-5xl lg:text-6xl font-black leading-tight mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Entra a la universidad{" "}
                <span className="gradient-text">de tus sueños</span>{" "}
                sin adivinar.
              </h1>

              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                CEFITIPS es la plataforma que combina cursos interactivos, simulacros con preguntas
                reales y mentores expertos para que domines tu examen de admisión a{" "}
                <strong className="text-white">UNAM, IPN, UAM y COMIPEMS</strong>.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/register" className="btn btn--primary btn--lg">
                  Comienza gratis <ArrowIcon />
                </Link>
                <Link href="/dashboard" className="btn btn--glass btn--lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  Ver demo · 1 min
                </Link>
              </div>

              <dl className="flex gap-8">
                {[
                  { label: "Estudiantes", value: "85,000+" },
                  { label: "Tasa de ingreso", value: "92%" },
                  { label: "Preguntas reales", value: "25,000+" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs text-white/40 mb-1">{s.label}</dt>
                    <dd className="text-2xl font-black gradient-text">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Device frame */}
            <div className="relative" aria-hidden="true">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                <div className="flex gap-1.5 mb-4">
                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>

                {/* Progress ring card */}
                <div className="rounded-xl bg-white/5 border border-white/8 p-5 mb-3">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Tu progreso · UNAM Área 2</p>
                      <p className="text-3xl font-black">
                        78<span className="text-base text-white/40">/100</span>
                      </p>
                    </div>
                    <span className="badge badge--success">+12 esta semana</span>
                  </div>
                  <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-600 to-pink-500" />
                  </div>
                </div>

                {/* Mini cards */}
                <div className="space-y-2">
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      📚
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Biología celular</p>
                      <p className="text-xs text-white/40">Lección 4 de 12</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                      🎯
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Simulacro UNAM 03</p>
                      <p className="text-xs text-white/40">Hoy · 6:00 pm</p>
                    </div>
                    <span className="pill--live">EN VIVO</span>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3 flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <p className="text-sm font-medium">Racha de 14 días</p>
                      <p className="text-xs text-white/40">¡Sigue así!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip / marquee */}
        <div className="py-8 border-y border-white/5 overflow-hidden">
          <div className="marquee-outer">
            <div className="marquee">
              {universities.map((u, i) => (
                <span key={i} className="flex items-center gap-3 text-white/30 text-sm font-semibold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="caracteristicas" className="section">
          <div className="container">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Por qué CEFITIPS
              </span>
              <h2
                className="text-4xl font-black mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Todo lo que necesitas para{" "}
                <span className="gradient-text">aprobar</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="card">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="cursos" className="section">
          <div className="container">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Cursos
              </span>
              <h2
                className="text-4xl font-black mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preparación para{" "}
                <span className="gradient-text">cada examen</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <Link
                  key={c.title}
                  href="/register"
                  className="card group hover:border-violet-500/30 transition-all block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${c.accent}22`,
                        color: c.accent,
                        border: `1px solid ${c.accent}33`,
                      }}
                    >
                      {c.tag}
                    </span>
                    <span className="text-xs text-white/40">{c.duration}</span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-sm text-white/55 mb-4 leading-relaxed">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{c.enrolled} aspirantes</span>
                    <span className="text-white/40 group-hover:text-violet-400 transition-colors">
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section">
          <div className="container">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Cómo funciona
              </span>
              <h2
                className="text-4xl font-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                De cero a aprobado en{" "}
                <span className="gradient-text">3 pasos</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Haz tu diagnóstico", desc: "Un examen inicial de 30 preguntas detecta exactamente en qué temas fallas y cuál es tu probabilidad de ingreso hoy." },
                { num: "02", title: "Recibe tu plan", desc: "Una ruta semanal diseñada con IA: cursos, lecturas, ejercicios y fechas clave. Se adapta cada semana a tu avance." },
                { num: "03", title: "Estudia y domina", desc: "Simulacros oficiales, mentorías y comunidad. Llegas al examen real con la confianza de quien ya lo presentó 20 veces." },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div
                    className="text-7xl font-black gradient-text mb-4 opacity-30"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonios" className="section">
          <div className="container">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Historias reales
              </span>
              <h2
                className="text-4xl font-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Miles ya entraron.{" "}
                <span className="gradient-text">Tú también puedes.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <figure key={t.name} className="card flex flex-col gap-4">
                  <div className="flex gap-1" aria-label="5 de 5 estrellas">
                    {Array(5).fill(0).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <blockquote className="text-white/75 text-sm leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="planes" className="section">
          <div className="container">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Planes simples
              </span>
              <h2
                className="text-4xl font-black mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Invierte en tu <span className="gradient-text">futuro</span>
              </h2>
              <p className="text-white/50">
                Prueba 7 días gratis. Cancela cuando quieras. Sin letras chiquitas.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Starter */}
              <div className="card flex flex-col">
                <h3
                  className="text-xl font-black mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Starter
                </h3>
                <p className="text-sm text-white/50 mb-4">Para empezar sin costo.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-white/40 text-sm ml-1">/siempre</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {["20 lecciones introductorias", "2 simulacros al mes", "Acceso a comunidad"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckIcon /> {f}
                    </li>
                  ))}
                  {["Mentorías 1-a-1", "Plan personalizado"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/30">
                      <XIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn btn--ghost btn--full">
                  Comienza gratis
                </Link>
              </div>

              {/* Pro — featured */}
              <div className="card flex flex-col border-violet-500/30 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-xs font-bold text-white">
                  Más elegido
                </div>
                <h3
                  className="text-xl font-black mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Pro
                </h3>
                <p className="text-sm text-white/50 mb-4">
                  Todo lo que necesitas para aprobar.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-black gradient-text">$299</span>
                  <span className="text-white/40 text-sm ml-1">/mes</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    "Acceso ilimitado a todos los cursos",
                    "Simulacros reales sin límite",
                    "Plan personalizado con IA",
                    "4 mentorías grupales/mes",
                    "Materiales descargables",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn btn--primary btn--full">
                  Empezar 7 días gratis
                </Link>
              </div>

              {/* Elite */}
              <div className="card flex flex-col">
                <h3
                  className="text-xl font-black mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Elite
                </h3>
                <p className="text-sm text-white/50 mb-4">Preparación premium dedicada.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black">$699</span>
                  <span className="text-white/40 text-sm ml-1">/mes</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    "Todo lo incluido en Pro",
                    "Mentor personal 1-a-1 semanal",
                    "Revisión de ensayos ilimitada",
                    "Garantía: aprueba o reembolso",
                    "Acceso anticipado a novedades",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn btn--glass btn--full">
                  Elegir Elite
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="container max-w-3xl">
            <div className="mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                Dudas frecuentes
              </span>
              <h2
                className="text-4xl font-black mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ¿Algo que quieras{" "}
                <span className="gradient-text">preguntar</span>?
              </h2>
              <p className="text-white/50">
                Si tu duda no está aquí, escríbenos a{" "}
                <a href="mailto:hola@cefitips.mx" className="text-violet-400 hover:underline">
                  hola@cefitips.mx
                </a>{" "}
                y te respondemos en menos de 24 h.
              </p>
            </div>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group card cursor-pointer select-none"
                >
                  <summary className="flex items-center justify-between gap-4 font-semibold text-white/85 list-none py-1">
                    {faq.q}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0 transition-transform group-open:rotate-180 text-white/40"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-white/55 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section">
          <div className="container">
            <div className="relative rounded-2xl overflow-hidden p-12 text-center border border-violet-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-pink-900/20" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
                  Empieza hoy
                </span>
                <h2
                  className="text-4xl font-black mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tu carrera soñada está a{" "}
                  <span className="gradient-text">un clic</span>
                </h2>
                <p className="text-white/55 mb-8 max-w-lg mx-auto">
                  Únete a más de 85,000 estudiantes que cambiaron su futuro con CEFITIPS. Sin
                  tarjeta. Sin compromisos. Solo resultados.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/register" className="btn btn--primary btn--lg">
                    Crear mi cuenta gratis
                  </Link>
                  <Link href="/login" className="btn btn--glass btn--lg">
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="container">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3" aria-label="CEFITIPS">
                <svg width="28" height="28" viewBox="0 0 36 36" aria-hidden="true">
                  <defs>
                    <linearGradient id="footerLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A78BFA" />
                      <stop offset="50%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                  <path d="M18 3 L33 11 L33 25 L18 33 L3 25 L3 11 Z" fill="url(#footerLogo)" />
                  <path d="M12 14 L18 18 L24 14 M12 22 L18 18 L24 22" stroke="#0B0617" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span className="font-black" style={{ fontFamily: "var(--font-display)" }}>
                  CEFI<span className="gradient-text">TIPS</span>
                </span>
              </Link>
              <p className="text-sm text-white/40 mb-4">
                Tu puerta a la universidad, con tecnología y mentores que sí la entienden.
              </p>
            </div>
            {[
              { title: "Plataforma", links: ["Cursos", "Simulacros", "Mentorías", "App móvil"] },
              { title: "Recursos", links: ["Blog", "Guía UNAM", "Guía IPN", "Centro de ayuda"] },
              { title: "Empresa", links: ["Sobre CEFITIPS", "Trabaja con nosotros", "Prensa", "Contacto"] },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  className="text-sm font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© 2026 CEFITIPS · Hecho con pasión en México.</p>
            <p>v1.0 — Éxito asegurado.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
