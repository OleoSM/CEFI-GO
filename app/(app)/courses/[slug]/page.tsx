import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";

const modules = [
  {
    id: 1,
    title: "Módulo 1 — Introducción",
    lessons: [
      { id: "1-1", title: "Bienvenida al curso", duration: "5 min", done: true },
      { id: "1-2", title: "Cómo usar la plataforma", duration: "8 min", done: true },
      { id: "1-3", title: "Plan de estudio personalizado", duration: "12 min", done: true },
    ],
  },
  {
    id: 2,
    title: "Módulo 2 — Biología Celular",
    lessons: [
      { id: "2-1", title: "La célula: estructura y función", duration: "20 min", done: true },
      { id: "2-2", title: "Tipos de células", duration: "18 min", done: true },
      { id: "2-3", title: "Membrana plasmática", duration: "22 min", done: false },
      { id: "2-4", title: "Organelos celulares", duration: "25 min", done: false },
    ],
  },
  {
    id: 3,
    title: "Módulo 3 — Genética",
    lessons: [
      { id: "3-1", title: "ADN y ARN", duration: "28 min", done: false },
      { id: "3-2", title: "Síntesis de proteínas", duration: "24 min", done: false },
      { id: "3-3", title: "Leyes de Mendel", duration: "30 min", done: false },
    ],
  },
  {
    id: 4,
    title: "Módulo 4 — Reproducción Celular",
    lessons: [
      { id: "4-1", title: "Ciclo celular", duration: "20 min", done: false },
      { id: "4-2", title: "Mitosis — Fases", duration: "22 min", done: false, current: true },
      { id: "4-3", title: "Meiosis — Diferencias", duration: "25 min", done: false },
    ],
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-white transition-colors">
          Mis cursos
        </Link>
        <span>/</span>
        <span className="text-white/70">{course.title}</span>
      </nav>

      {/* Course header */}
      <header
        className={`card bg-gradient-to-br ${course.gradient} border-0 text-white`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="badge badge--violet mb-3">{course.tag}</span>
            <h1
              className="text-3xl font-black mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {course.title}
            </h1>
            <p className="text-white/80 text-sm mb-4">
              Domina los temas que más se preguntan en el examen. Lecciones en video, ejercicios y simulacros integrados.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>⏱ {course.duration}</span>
              <span>👥 {course.enrolled} aspirantes</span>
              <span>📖 {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/70">Tu progreso</span>
            <span className="font-bold">{course.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white/80"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Modules list */}
      <div className="space-y-4">
        <h2
          className="text-xl font-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Contenido del curso
        </h2>

        {modules.map((mod) => (
          <details key={mod.id} open={mod.id === 4} className="card overflow-hidden">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-1 select-none">
              <span className="font-bold text-sm">{mod.title}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-white/40">
                  {mod.lessons.filter((l) => l.done).length}/{mod.lessons.length} lecciones
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/40 transition-transform">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </summary>
            <ul className="mt-3 space-y-1 border-t border-white/5 pt-3">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${course.slug}/lessons/${lesson.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      (lesson as { current?: boolean }).current
                        ? "bg-violet-500/15 text-violet-300"
                        : lesson.done
                        ? "text-white/50 hover:bg-white/5"
                        : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      lesson.done
                        ? "bg-emerald-500/20 text-emerald-400"
                        : (lesson as { current?: boolean }).current
                        ? "bg-violet-500/30 text-violet-300"
                        : "bg-white/8 text-white/30"
                    }`}>
                      {lesson.done ? "✓" : (lesson as { current?: boolean }).current ? "▶" : "○"}
                    </span>
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-xs text-white/30">{lesson.duration}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <Link
          href={`/courses/${course.slug}/lessons/4-2`}
          className="btn btn--primary btn--lg"
        >
          Continuar — {course.lesson}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
