"use client";

import { useState } from "react";
import { unamResources } from "@/lib/mock-data";

const TYPE_STYLE: Record<string, string> = {
  PDF:    "bg-red-500/15 text-red-400 border border-red-500/20",
  PPT:    "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  Guía:   "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Imagen: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
  Video:  "bg-violet-500/15 text-violet-400 border border-violet-500/20",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PDF: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  PPT: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  Guía: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Imagen: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Video: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
};

const SUBJECT_COLORS: Record<string, string> = {
  General:      "bg-white/5 text-white/50",
  Biología:     "bg-emerald-500/10 text-emerald-400",
  Química:      "bg-amber-500/10 text-amber-400",
  Física:       "bg-blue-500/10 text-blue-400",
  Matemáticas:  "bg-pink-500/10 text-pink-400",
  Historia:     "bg-orange-500/10 text-orange-400",
  Español:      "bg-violet-500/10 text-violet-400",
};

const allSubjects = ["Todos", ...Array.from(new Set(unamResources.map((r) => r.subject)))];

export default function ResourcesPage() {
  const [activeSubject, setActiveSubject] = useState("Todos");

  const filtered = activeSubject === "Todos"
    ? unamResources
    : unamResources.filter((r) => r.subject === activeSubject);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
          Recursos de estudio
        </h1>
        <p className="text-sm text-white/45 mt-1">
          Material de apoyo organizado por materia — PDFs, presentaciones y guías
        </p>
      </header>

      {/* Subject filter pills */}
      <div className="flex flex-wrap gap-2">
        {allSubjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeSubject === s
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white/5 border-white/10 text-white/55 hover:border-white/20 hover:text-white/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Resource slide-cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => (
          <article
            key={res.id}
            className="card flex flex-col gap-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Type + subject */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_STYLE[res.type] ?? "bg-white/5 text-white/40 border border-white/10"}`}>
                {TYPE_ICONS[res.type]}
                {res.type}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[res.subject] ?? "bg-white/5 text-white/40"}`}>
                {res.subject}
              </span>
            </div>

            {/* Title + description */}
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-2 leading-snug">{res.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed line-clamp-3">{res.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[11px] text-white/30 flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {res.fileSize}
              </span>
              <a
                href={res.url}
                className="btn btn--ghost text-xs py-1.5 px-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar
              </a>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-white/5 rounded-2xl">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white/20 mb-3">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p className="text-sm text-white/30">No hay recursos en esta categoría todavía.</p>
        </div>
      )}
    </div>
  );
}
