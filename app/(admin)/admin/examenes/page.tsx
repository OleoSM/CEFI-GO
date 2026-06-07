"use client";

import { useState } from "react";
import { unamExam } from "@/lib/mock-data";

const subjectColors: Record<string, string> = {
  Biología:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Química:     "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Física:      "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Matemáticas: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Español:     "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Historia:    "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function AdminExamenesPage() {
  const [pdfOpen, setPdfOpen] = useState(false);

  const subjectCounts = unamExam.subjects.map((s) => ({
    subject: s,
    count: unamExam.questions.filter((q) => q.subject === s).length,
  }));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>Exámenes</h1>
          <p className="text-sm text-white/40 mt-0.5">Gestiona simulacros y sus preguntas</p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled>+ Subir examen</button>
      </header>

      <div className="card border border-amber-500/15 space-y-6">
        {/* Meta badges */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">{unamExam.university}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5">{unamExam.difficulty}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2.5 py-0.5">{unamExam.area}</span>
            </div>
            <h2 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>{unamExam.title}</h2>
            <p className="text-xs text-white/40 mt-0.5">{unamExam.universityFull} · {unamExam.areaFull} · {unamExam.year}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Reactivos",   value: unamExam.questions.length },
            { label: "Tiempo",      value: `${unamExam.timeMinutes} min` },
            { label: "Aprobatorio", value: `${unamExam.passingScore}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/6">
              <p className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Distribución por materia</p>
          <div className="space-y-2">
            {subjectCounts.map(({ subject, count }) => (
              <div key={subject} className="flex items-center gap-3">
                <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 shrink-0 w-24 text-center ${subjectColors[subject] ?? "text-white/50 bg-white/5 border-white/10"}`}>
                  {subject}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${(count / unamExam.questions.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-white/50 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source PDF */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Examen fuente (PDF original)</p>
          <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Examen 8 Area 2.pdf</p>
              <p className="text-xs text-white/35">2.2 MB · UNAM · Área 2</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfOpen(true)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all"
              >
                Ver PDF
              </button>
              <a
                href="/examenes/Examen 8 Area 2.pdf"
                download
                className="text-xs font-semibold text-white/50 hover:text-white bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 transition-all"
              >
                Descargar
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <a href={`/exam/${unamExam.id}`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost text-sm">
            Vista alumno ↗
          </a>
          <button className="btn btn--ghost text-sm opacity-40 cursor-not-allowed" disabled>Editar preguntas</button>
        </div>
      </div>

      {/* PDF viewer modal */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl h-[90vh] flex flex-col card border border-white/10">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="font-bold text-sm">Examen 8 Area 2.pdf — UNAM Área 2</h3>
              <button onClick={() => setPdfOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <iframe src="/examenes/Examen 8 Area 2.pdf" className="flex-1 rounded-xl border border-white/8" title="Examen UNAM Área 2" />
          </div>
        </div>
      )}
    </div>
  );
}
