import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";

const extraCourses = [
  {
    slug: "ipn",
    title: "Examen IPN",
    tag: "Física-Matemáticas",
    duration: "5 meses",
    enrolled: "18,750",
    gradient: "from-pink-600 to-violet-600",
    progress: 0,
    module: "Módulo 1",
    lesson: "Introducción al IPN",
    lessonNum: 1,
    lessonTotal: 14,
    remainingMin: 45,
  },
  {
    slug: "comipems",
    title: "COMIPEMS",
    tag: "Bachillerato",
    duration: "3 meses",
    enrolled: "24,870",
    gradient: "from-cyan-500 to-blue-600",
    progress: 0,
    module: "Módulo 1",
    lesson: "Español y comunicación",
    lessonNum: 1,
    lessonTotal: 10,
    remainingMin: 30,
  },
  {
    slug: "quimica",
    title: "Química orgánica",
    tag: "Ciencias",
    duration: "6 semanas",
    enrolled: "8,400",
    gradient: "from-emerald-500 to-cyan-500",
    progress: 58,
    module: "Módulo 3",
    lesson: "Compuestos orgánicos",
    lessonNum: 3,
    lessonTotal: 8,
    remainingMin: 22,
  },
];

const allCourses = [...mockCourses, ...extraCourses];

const activeCourses = allCourses.filter((c) => c.progress > 0).length;

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mis cursos
          </h1>
          <p className="text-sm text-white/45 mt-1">
            Todos tus materiales de preparación en un solo lugar
          </p>
        </div>
        <span className="badge badge--violet text-sm px-3 py-1.5 font-bold">
          {activeCourses} activos
        </span>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => (
          <div key={course.slug} className="card flex flex-col gap-4 overflow-hidden">
            {/* Gradient header */}
            <div
              className={`-mx-6 -mt-6 px-6 pt-6 pb-5 bg-gradient-to-br ${course.gradient}`}
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest bg-black/20 text-white/80 rounded-full px-2.5 py-0.5 mb-3">
                {course.tag}
              </span>
              <h2
                className="text-xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {course.title}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-[12px] text-white/70">
                <span>⏱ {course.duration}</span>
                <span>·</span>
                <span>👥 {course.enrolled}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/45">Progreso</span>
                <span className="font-bold text-white/80">{course.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* Lesson info */}
            <div className="flex-1">
              <p className="text-xs text-white/40 mb-0.5">
                {course.module} · Lec {course.lessonNum}/{course.lessonTotal}
              </p>
              <p className="text-sm font-medium text-white/85 line-clamp-2">
                {course.lesson}
              </p>
              <p className="text-xs text-white/35 mt-1">
                {course.remainingMin} min restantes
              </p>
            </div>

            {/* CTA */}
            <Link
              href={`/courses/${course.slug}`}
              className="btn btn--primary text-sm text-center"
            >
              {course.progress > 0 ? "Continuar" : "Comenzar"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
