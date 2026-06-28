import Link from "next/link";
import { mockCourses, unamModules } from "@/lib/mock-data";
import { getCourseTheme } from "@/lib/utils/course-theme";
import CourseModulesAccordion from "@/components/courses/CourseModulesAccordion";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getSubjectName(title: string) {
  return title.split("—")[1]?.trim() ?? title;
}

const SUBJECT_META: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "Biología Celular": {
    gradient: "from-emerald-600 to-cyan-600",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  },
  "Genética": {
    gradient: "from-violet-600 to-pink-600",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2c0 6 4 8 4 12s-4 6-4 12M22 2c0 6-4 8-4 12s4 6 4 12M6 8h12M6 16h12"/></svg>,
  },
  "Química General": {
    gradient: "from-amber-500 to-orange-600",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
  },
  "Física": {
    gradient: "from-blue-600 to-violet-600",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  "Matemáticas": {
    gradient: "from-pink-600 to-rose-600",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  },
};

const DEFAULT_META = {
  gradient: "from-slate-600 to-slate-700",
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug }  = await params;
  const course    = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];
  const theme     = getCourseTheme(slug);

  const totalLessons  = unamModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const currentLesson = unamModules.flatMap((m) => m.lessons).find((l) => l.current);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-white transition-colors">Mis cursos</Link>
        <span>/</span>
        <span className="text-white/70">{course.title}</span>
      </nav>

      {/* Course header — themed */}
      <header
        className="rounded-2xl border p-7 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}CC 0%, ${theme.primaryLight}99 60%, ${theme.primary}88 100%)`,
          borderColor: `${theme.primaryLight}40`,
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: theme.accent }}
        />
        {/* Accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.primaryLight})` }}
        />

        <div className="relative z-10">
          {/* Institution badge */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{
              background: `${theme.accent}20`,
              color: theme.accent,
              borderColor: `${theme.accent}40`,
            }}
          >
            {course.tag} · {theme.label}
          </span>

          <h1 className="text-3xl font-black mb-3 text-white" style={{ fontFamily: "var(--font-display)" }}>
            {course.title}
          </h1>
          <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-xl">
            Domina los temas que más se preguntan en el examen. Lecciones en video interactivo, exámenes y recursos de estudio integrados.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/65 mb-6">
            {[
              { icon: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2", label: course.duration },
              { icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z", label: `${course.enrolled} aspirantes` },
              { icon: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z", label: `${totalLessons} lecciones` },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white/60">Tu progreso</span>
              <span className="font-bold text-white">{course.progress}%</span>
            </div>
            <div className="w-full h-2 bg-black/25 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${course.progress}%`,
                  background: `linear-gradient(to right, ${theme.accent}, white)`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Subject cards grid */}
      <section>
        <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Materias
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unamModules.map((mod) => {
            const subjectName = getSubjectName(mod.title);
            const meta        = SUBJECT_META[subjectName] ?? DEFAULT_META;
            const done        = mod.lessons.filter((l) => l.done).length;
            const pct         = Math.round((done / mod.lessons.length) * 100);
            const nextLesson  = mod.lessons.find((l) => !l.done) ?? mod.lessons[0];

            return (
              <Link
                key={mod.id}
                href={`/courses/${slug}/lessons/${nextLesson.id}`}
                className="group rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-white/18 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                style={{ ["--glow" as string]: theme.glow }}
              >
                {/* Subject header gradient */}
                <div className={`px-5 pt-5 pb-4 bg-gradient-to-br ${meta.gradient} flex items-center gap-3`}>
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-white shrink-0">
                    {meta.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-white/60 font-medium">Módulo {mod.id}</p>
                    <p className="font-black text-white text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {subjectName}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="px-5 py-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{mod.lessons.length} lecciones</span>
                    <span>{done} completadas</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30">{pct}% completado</p>
                    <span
                      className="text-xs font-semibold transition-colors group-hover:opacity-100 opacity-60"
                      style={{ color: theme.accent }}
                    >
                      Ver lecciones →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Course content — accordion with lessons, quizzes & module exams */}
      <section>
        <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Contenido del curso
        </h2>
        <CourseModulesAccordion slug={slug} modules={unamModules} accent={theme.accent} />
      </section>

      {/* Continue CTA — themed */}
      {currentLesson && (
        <div className="flex justify-center">
          <Link
            href={`/courses/${slug}/lessons/${currentLesson.id}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 shadow-lg"
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryLight})`,
              color: "#fff",
              boxShadow: `0 8px 32px ${theme.glow}`,
            }}
          >
            Continuar — {currentLesson.title}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
