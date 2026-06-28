import Link from "next/link";
import { mockUser, mockCourses, mockExams, mockProgress, mockMeta } from "@/lib/mock-data";
import StudyPlanPanel from "@/components/dashboard/StudyPlanPanel";
import WelcomePlanModal from "@/components/dashboard/WelcomePlanModal";

function ScoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const MonitorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
    <path d="M4 22h16M10 14.66V17a1 1 0 01-.88.98L8 18h8l-1.12-.02A1 1 0 0114 17v-2.34"/>
    <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
  </svg>
);

const stats = [
  { label: "Lecciones completadas", value: "48",                           color: "text-violet-400", icon: <BookIcon /> },
  { label: "Simulacros realizados",  value: "12",                           color: "text-pink-400",   icon: <ClockIcon /> },
  { label: "Tiempo de estudio",      value: "42h",                          color: "text-cyan-400",   icon: <MonitorIcon /> },
  { label: "Racha actual",           value: `${mockUser.streak} días`,      color: "text-amber-400",  icon: <FlameIcon /> },
  {
    label: `Meta ${mockMeta.course}`,
    value: `${mockMeta.current}/${mockMeta.target}`,
    sublabel: "aciertos",
    color: mockMeta.current >= mockMeta.target ? "text-emerald-400" : "text-amber-400",
    icon: <TargetIcon />,
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <WelcomePlanModal />

      {/* Welcome banner */}
      <section className="card bg-gradient-to-r from-violet-900/40 to-pink-900/20 border-violet-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg font-black text-white">
                {mockUser.initials}
              </div>
              <div>
                <p className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>
                  Bienvenido, {mockUser.name.split(" ")[0]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-amber-400 font-semibold">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Racha de {mockUser.streak} días
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-sm text-white/50">
                    {mockUser.daysToExam} días para tu examen
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/55 mt-2">
              Continúas en{" "}
              <strong className="text-white">{mockCourses[0].module}</strong>{" "}
              — {mockCourses[0].lesson}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href={`/courses/${mockCourses[0].slug}`} className="btn btn--primary">
              Continuar lección
            </Link>
            <Link href="/exam/unam-2024" className="btn btn--ghost">
              Hacer simulacro
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className={`mb-2 flex justify-center ${stat.color}`}>{stat.icon}</div>
              <p className={`text-2xl font-black mb-0.5 ${stat.color}`} style={{ fontFamily: "var(--font-display)" }}>
                {stat.value}
              </p>
              {"sublabel" in stat && stat.sublabel && (
                <p className="text-[11px] text-white/30 mb-0.5">{stat.sublabel}</p>
              )}
              <p className="text-xs text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Study Plan */}
      <StudyPlanPanel />

      {/* Main grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continuar aprendiendo */}
          <div>
            <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Continuar aprendiendo
            </h2>
            <div className="space-y-3">
              {mockCourses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="card flex items-center gap-4 hover:border-violet-500/30 transition-all block"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white shrink-0`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-0.5 truncate">{course.lesson}</p>
                    <p className="text-xs text-white/40 mb-2">
                      {course.module} · Lec {course.lessonNum}/{course.lessonTotal} · {course.remainingMin} min restantes
                    </p>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-violet-400 shrink-0">{course.progress}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Comienza a prepararte */}
          <div className="card bg-gradient-to-br from-violet-900/40 to-pink-900/20 border-violet-500/20">
            <h2 className="font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Comienza a prepararte
            </h2>
            <p className="text-sm text-white/50 mb-4">
              Elige por dónde empezar tu sesión de hoy.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/courses/unam"
                className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-violet-500/30 hover:bg-white/8 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                <span className="text-sm font-semibold text-white/85">Lecciones</span>
                <span className="text-[11px] text-white/40">Video interactivo</span>
              </Link>
              <Link
                href="/resources"
                className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-pink-500/30 hover:bg-white/8 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-sm font-semibold text-white/85">Material</span>
                <span className="text-[11px] text-white/40">PDFs y diapositivas</span>
              </Link>
            </div>
          </div>

          {/* Practica y examenes */}
          <div>
            <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Practica y examenes
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/exam"
                className="card flex items-center gap-3 hover:border-violet-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Simulacro</p>
                  <p className="text-[11px] text-white/40">Examen completo</p>
                </div>
              </Link>
              <Link
                href="/exam"
                className="card flex items-center gap-3 hover:border-pink-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Practica rapida</p>
                  <p className="text-[11px] text-white/40">10 reactivos</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Últimos simulacros */}
          <div>
            <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Últimos simulacros
            </h2>
            <div className="card divide-y divide-white/5">
              {mockExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{exam.title}</p>
                    <p className="text-xs text-white/40">{exam.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-black ${ScoreColor(exam.score)}`}>
                      {exam.score}%
                    </p>
                    <p className="text-xs text-white/40">
                      {exam.correct}/{exam.total}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-5">
          {/* Avances */}
          <div className="card">
            <h3 className="font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Avances
            </h3>
            <div className="space-y-3">
              {[
                { label: "Unidades",     done: mockProgress.unidades.done,    total: mockProgress.unidades.total,    color: "from-violet-500 to-pink-500" },
                { label: "Examenes",     done: mockProgress.examenes.done,    total: mockProgress.examenes.total,    color: "from-pink-500 to-rose-500" },
                { label: "Clases",       done: mockProgress.clases.done,      total: mockProgress.clases.total,      color: "from-cyan-500 to-violet-500" },
                { label: "Actividades",  done: mockProgress.actividades.done, total: mockProgress.actividades.total, color: "from-amber-500 to-pink-500" },
              ].map((item) => {
                const pct = Math.round((item.done / item.total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/55">{item.label}</span>
                      <span className="font-bold text-white/80">{item.done}/{item.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximas clases */}
          <div className="card">
            <h3 className="font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Próximas clases en vivo
            </h3>
            <div className="space-y-3">
              {[
                { time: "Hoy · 6:00 pm",      title: "Simulacro UNAM · Área 2",     tag: "Simulacro" },
                { time: "Mañana · 5:00 pm",   title: "Química orgánica — Ciclos",   tag: "Clase" },
                { time: "Jue · 7:00 pm",      title: "Mentoría grupal · Álgebra",   tag: "Mentoría" },
              ].map((cls) => (
                <div key={cls.title} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-xs text-white/40">{cls.time}</p>
                    <p className="text-sm font-medium">{cls.title}</p>
                    <span className="badge badge--violet text-[10px]">{cls.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logro desbloqueado */}
          <div className="card border-amber-500/20 bg-amber-500/5">
            <div className="text-amber-400 mb-2">
              <TrophyIcon />
            </div>
            <p className="font-bold text-amber-400 text-sm mb-1">Logro desbloqueado</p>
            <p className="font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Racha Quincenal
            </p>
            <p className="text-xs text-white/45">
              Estudiaste 15 días consecutivos. Eres imparable.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
