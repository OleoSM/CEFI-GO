import Link from "next/link";
import { mockCourses, unamModules } from "@/lib/mock-data";
import CourseTabs from "@/components/courses/CourseTabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];

  const totalLessons = unamModules.reduce((acc, m) => acc + m.lessons.length, 0);
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

      {/* Course header */}
      <header className={`card bg-gradient-to-br ${course.gradient} border-0 text-white`}>
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
              Domina los temas que más se preguntan en el examen. Lecciones en video interactivo, exámenes y recursos de estudio integrados.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                {course.enrolled} aspirantes
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                {totalLessons} lecciones
              </span>
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
            <div className="h-full rounded-full bg-white/80" style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <CourseTabs slug={slug} modules={unamModules} />

      {/* Continue button */}
      {currentLesson && (
        <div className="flex justify-center">
          <Link
            href={`/courses/${slug}/lessons/${currentLesson.id}`}
            className="btn btn--primary btn--lg"
          >
            Continuar — {currentLesson.title}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
