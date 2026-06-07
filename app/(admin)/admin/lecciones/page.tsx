"use client";

import { useState } from "react";
import { unamModules, videoCheckpoints } from "@/lib/mock-data";
import CheckpointEditor from "@/components/admin/CheckpointEditor";

export default function AdminLeccionesPage() {
  const [editorLesson, setEditorLesson] = useState<{ id: string; title: string } | null>(null);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([1]));

  function toggleModule(id: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const totalLessons = unamModules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Lecciones
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {unamModules.length} módulos · {totalLessons} lecciones · gestiona videos y checkpoints interactivos
          </p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled title="Próximamente">
          + Subir lección
        </button>
      </header>

      <div className="space-y-3">
        {unamModules.map((mod) => {
          const isOpen = openModules.has(mod.id);
          const cpCount = videoCheckpoints.filter((cp) =>
            mod.lessons.some((l) => l.id === cp.lessonId)
          ).length;

          return (
            <div key={mod.id} className="card overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-4 py-1 text-left select-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                    {mod.id}
                  </span>
                  <span className="font-bold text-sm">{mod.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/35">{mod.lessons.length} lecciones</span>
                  {cpCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                      {cpCount} checkpoints
                    </span>
                  )}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    className={`text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 border-t border-white/5 pt-3 space-y-2">
                  {mod.lessons.map((lesson) => {
                    const lessonCps = videoCheckpoints.filter((cp) => cp.lessonId === lesson.id);
                    const hasRealVideo = lesson.videoSrc && !lesson.videoSrc.includes("placeholder");

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl bg-white/2 hover:bg-white/4 transition-colors"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${lesson.done ? "bg-emerald-500" : lesson.current ? "bg-amber-500" : "bg-white/15"}`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-white/80">{lesson.title}</span>
                            <span className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">{lesson.id}</span>
                            {lesson.current && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 rounded-full px-2 py-0.5">EN CURSO</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-white/35">{lesson.duration}</span>
                            {hasRealVideo ? (
                              <span className="text-[10px] text-emerald-400">
                                ▶ {lesson.videoSrc?.split("/").pop()}
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/25">Sin video</span>
                            )}
                            {lesson.vimeoId && (
                              <span className="text-[10px] text-sky-400">Vimeo: {lesson.vimeoId}</span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {lessonCps.length > 0 ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                              {lessonCps.length} checkpoint{lessonCps.length > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20">Sin checkpoints</span>
                          )}
                        </div>

                        <button
                          onClick={() => setEditorLesson({ id: lesson.id, title: lesson.title })}
                          className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all"
                        >
                          Checkpoints
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editorLesson && (
        <CheckpointEditor
          lessonId={editorLesson.id}
          lessonTitle={editorLesson.title}
          onClose={() => setEditorLesson(null)}
        />
      )}
    </div>
  );
}
