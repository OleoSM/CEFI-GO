import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";

const lessonList = [
  { id: "4-1", title: "Ciclo celular", duration: "20 min", done: false },
  { id: "4-2", title: "Mitosis — Fases", duration: "22 min", done: false, current: true },
  { id: "4-3", title: "Meiosis — Diferencias", duration: "25 min", done: false },
];

interface PageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonId } = await params;
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];
  const currentIndex = lessonList.findIndex((l) => l.id === lessonId);
  const lesson = lessonList[currentIndex] ?? lessonList[1];
  const prev = lessonList[currentIndex - 1];
  const next = lessonList[currentIndex + 1];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-white/70">{lesson.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video player */}
          <div className="rounded-2xl overflow-hidden bg-black border border-white/8">
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Lesson info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-violet-400 font-bold mb-1">{course.module}</p>
                <h1
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lesson.title}
                </h1>
              </div>
              <span className="badge badge--violet shrink-0">{lesson.duration}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              En esta lección estudiaremos las fases de la mitosis: profase, metafase, anafase y telofase.
              Aprenderás a identificar cada etapa, el comportamiento de los cromosomas y la importancia de
              este proceso para el crecimiento y la reproducción celular. Este tema representa aproximadamente
              el 8% de las preguntas de Biología en el examen UNAM.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {prev ? (
              <Link
                href={`/courses/${slug}/lessons/${prev.id}`}
                className="btn btn--ghost"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {prev.title}
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/courses/${slug}/lessons/${next.id}`}
                className="btn btn--primary"
              >
                {next.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link href={`/courses/${slug}`} className="btn btn--primary">
                Finalizar módulo ✓
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <aside className="space-y-4">
          <h2
            className="font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Módulo 4 — Reproducción Celular
          </h2>
          <ul className="space-y-1">
            {lessonList.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/courses/${slug}/lessons/${l.id}`}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                    l.id === lessonId
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : l.done
                      ? "text-white/50 hover:bg-white/5"
                      : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    l.done
                      ? "bg-emerald-500/20 text-emerald-400"
                      : l.id === lessonId
                      ? "bg-violet-500/30 text-violet-300"
                      : "bg-white/8 text-white/30"
                  }`}>
                    {l.done ? "✓" : l.id === lessonId ? "▶" : "○"}
                  </span>
                  <span className="flex-1 leading-snug">{l.title}</span>
                  <span className="text-xs text-white/30 shrink-0">{l.duration}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Resources */}
          <div className="card mt-4">
            <h3
              className="font-bold text-sm mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recursos de esta lección
            </h3>
            <ul className="space-y-2">
              {["Resumen en PDF", "Ejercicios de práctica", "Mapa conceptual"].map((r) => (
                <li key={r}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-violet-400 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
