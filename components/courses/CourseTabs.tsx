"use client";

import { useState } from "react";
import Link from "next/link";
import { unamModules, unamExam, unamResources } from "@/lib/mock-data";
import type { Module } from "@/lib/mock-data";

type Tab = "videos" | "examenes" | "recursos";

const RESOURCE_BADGE: Record<string, string> = {
  PDF: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  PPT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Guía: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Imagen: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

function ResourceIcon({ type }: { type: string }) {
  if (type === "PPT")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    );
  if (type === "Guía")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="11" y2="16"/>
      </svg>
    );
  if (type === "Imagen")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    );
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

interface Props {
  slug: string;
  modules: Module[];
}

export default function CourseTabs({ slug, modules }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([1]));

  function toggleModule(id: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.flatMap((m) => m.lessons).filter((l) => l.done).length;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {(
          [
            { key: "videos", label: "Videos", count: totalLessons },
            { key: "examenes", label: "Exámenes", count: unamExam.questions.length },
            { key: "recursos", label: "Recursos de Estudio", count: unamResources.length },
          ] as { key: Tab; label: string; count: number }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/8 text-white/40"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── VIDEOS TAB ── */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>
              Contenido del curso
            </h2>
            <span className="text-xs text-white/40">
              {completedLessons}/{totalLessons} lecciones completadas
            </span>
          </div>

          {modules.map((mod) => (
            <div key={mod.id} className="card overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-4 py-1 text-left select-none"
                aria-expanded={openModules.has(mod.id)}
              >
                <span className="font-bold text-sm">{mod.title}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/40">
                    {mod.lessons.filter((l) => l.done).length}/{mod.lessons.length} lecciones
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`text-white/40 transition-transform ${openModules.has(mod.id) ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openModules.has(mod.id) && (
                <ul className="mt-3 space-y-1 border-t border-white/5 pt-3">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${slug}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                          lesson.current
                            ? "bg-violet-500/15 text-violet-300"
                            : lesson.done
                            ? "text-white/50 hover:bg-white/5"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          lesson.done ? "bg-emerald-500/20 text-emerald-400"
                          : lesson.current ? "bg-violet-500/30 text-violet-300"
                          : "bg-white/8 text-white/30"
                        }`}>
                          {lesson.done
                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                            : lesson.current
                            ? <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                            : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>
                          }
                        </span>
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-white/30">{lesson.duration}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EXÁMENES TAB ── */}
      {activeTab === "examenes" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Simulacros disponibles
            </h2>
            <p className="text-sm text-white/45">Pon a prueba tu conocimiento antes del examen real</p>
          </div>

          <div className="card border border-violet-500/20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/25 rounded-full px-2.5 py-0.5">
                    {unamExam.difficulty}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/15 text-violet-400 border border-violet-500/25 rounded-full px-2.5 py-0.5">
                    {unamExam.area}
                  </span>
                </div>
                <h3 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
                  {unamExam.title}
                </h3>
                <p className="text-xs text-white/40 mt-1">{unamExam.universityFull} · {unamExam.areaFull}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: "📋", label: "Reactivos", value: unamExam.questions.length },
                { icon: "⏱", label: "Tiempo", value: `${unamExam.timeMinutes} min` },
                { icon: "🎯", label: "Aprobatorio", value: `${unamExam.passingScore}%` },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/4 rounded-xl p-3 text-center">
                  <p className="text-lg">{stat.icon}</p>
                  <p className="text-sm font-bold">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {unamExam.subjects.map((s) => (
                <span key={s} className="text-[10px] font-semibold bg-white/5 text-white/50 rounded-full px-2.5 py-0.5 border border-white/8">
                  {s}
                </span>
              ))}
            </div>

            <Link
              href={`/exam/${unamExam.id}`}
              className="btn btn--primary w-full justify-center"
            >
              Iniciar simulacro
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="card border-dashed border-white/10 text-center py-8">
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-sm font-semibold text-white/50">Más simulacros próximamente</p>
            <p className="text-xs text-white/30 mt-1">Mini-tests por materia y simulacros de años anteriores</p>
          </div>
        </div>
      )}

      {/* ── RECURSOS TAB ── */}
      {activeTab === "recursos" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Recursos de estudio
            </h2>
            <p className="text-sm text-white/45">PDFs, presentaciones y guías para complementar tu preparación</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {unamResources.map((resource) => (
              <div key={resource.id} className="card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">
                    <ResourceIcon type={resource.type} />
                  </span>
                  <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${RESOURCE_BADGE[resource.type]}`}>
                    {resource.type}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1 leading-snug">{resource.title}</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                    {resource.subject} · {resource.fileSize}
                  </p>
                  <p className="text-xs text-white/55 leading-relaxed">{resource.description}</p>
                </div>
                <a
                  href={resource.url}
                  className="btn btn--ghost text-sm text-center"
                  onClick={(e) => e.preventDefault()}
                >
                  {resource.type === "Imagen" ? "Ver imagen" : "Descargar"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
