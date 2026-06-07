"use client";

import { use } from "react";
import Link from "next/link";
import { mockCourses, unamModules, videoCheckpoints } from "@/lib/mock-data";
import InteractivePlayer from "@/components/video/InteractivePlayer";

interface PageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default function LessonPage({ params }: PageProps) {
  const { slug, lessonId } = use(params);
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];

  // Flatten all lessons from the UNAM modules
  const allLessons = unamModules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex] ?? allLessons[0];
  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];

  // Find which module this lesson belongs to
  const module = unamModules.find((m) => m.lessons.some((l) => l.id === lessonId));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">{course.title}</Link>
        <span>/</span>
        <span className="text-white/70">{lesson.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive video player — local file during dev, vimeoId in prod */}
          <InteractivePlayer
            videoSrc={lesson.videoSrc}
            vimeoId={lesson.vimeoId}
            lessonId={lessonId}
            checkpoints={videoCheckpoints}
          />

          {/* Lesson info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-violet-400 font-bold mb-1">
                  {module?.title ?? "Módulo"}
                </p>
                <h1
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lesson.title}
                </h1>
              </div>
              <span className="badge badge--violet shrink-0">{lesson.duration}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">{lesson.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {prev ? (
              <Link href={`/courses/${slug}/lessons/${prev.id}`} className="btn btn--ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {prev.title}
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/courses/${slug}/lessons/${next.id}`} className="btn btn--primary">
                {next.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link href={`/courses/${slug}`} className="btn btn--primary">
                Finalizar módulo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <aside className="space-y-4">
          <h2 className="font-black" style={{ fontFamily: "var(--font-display)" }}>
            {module?.title ?? "Lecciones"}
          </h2>
          <ul className="space-y-1">
            {(module?.lessons ?? allLessons.slice(0, 5)).map((l) => (
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
                    l.done ? "bg-emerald-500/20 text-emerald-400"
                    : l.id === lessonId ? "bg-violet-500/30 text-violet-300"
                    : "bg-white/8 text-white/30"
                  }`}>
                    {l.done
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                      : l.id === lessonId
                      ? <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                      : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>
                    }
                  </span>
                  <span className="flex-1 leading-snug">{l.title}</span>
                  <span className="text-xs text-white/30 shrink-0">{l.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
