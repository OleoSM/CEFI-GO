"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const SIMULACROS = [
  { id: "unam-area1-2024", name: "Simulacro UNAM 2024 — Área 1 (Físico-Matemáticas)", area: "Área 1", questions: 128, duration: "3h 30min", difficulty: 75, completed: false, score: null },
  { id: "unam-area2-2024", name: "Simulacro UNAM 2024 — Área 2 (Ciencias Biológicas)", area: "Área 2", questions: 128, duration: "3h 30min", difficulty: 72, completed: true, score: 71 },
  { id: "ipn-2024", name: "Simulacro IPN 2024 — Admisión General", area: "IPN", questions: 128, duration: "3h 00min", difficulty: 78, completed: false, score: null },
  { id: "ceneval-exani-2024", name: "CENEVAL EXANI-II — Simulacro Completo", area: "CENEVAL", questions: 120, duration: "3h 00min", difficulty: 70, completed: false, score: null },
];

const SUBJECTS = ["Matemáticas", "Español", "Biología", "Historia", "Química", "Física"];

const MODULES_BY_SUBJECT: Record<string, string[]> = {
  "Matemáticas": ["Álgebra y ecuaciones", "Geometría analítica", "Trigonometría", "Estadística"],
  "Español": ["Comprensión lectora", "Gramática y ortografía", "Literatura", "Redacción"],
  "Biología": ["Célula y organelos", "Genética", "Ecología", "Fisiología"],
  "Historia": ["México independiente", "Reforma y Porfiriato", "Revolución Mexicana", "México contemporáneo"],
  "Química": ["Tabla periódica", "Enlace químico", "Reacciones químicas", "Química orgánica"],
  "Física": ["Cinemática", "Dinámica", "Termodinámica", "Electromagnetismo"],
};

const HISTORY = [
  { exam: "Simulacro UNAM Área 2", date: "14 Jun 2026", score: 71, correct: 91, total: 128, time: "3h 12min" },
  { exam: "Test Álgebra — Módulo 2", date: "11 Jun 2026", score: 85, correct: 17, total: 20, time: "22min" },
  { exam: "Simulacro IPN", date: "07 Jun 2026", score: 64, correct: 82, total: 128, time: "2h 58min" },
  { exam: "Test Biología — Célula", date: "03 Jun 2026", score: 90, correct: 18, total: 20, time: "18min" },
  { exam: "Test Matemáticas — Álgebra 1", date: "29 May 2026", score: 78, correct: 16, total: 20, time: "25min" },
];

export default function ExamPage() {
  const [tab, setTab] = useState<"simulacros" | "tests">("simulacros");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
            Examenes y simulacros
          </h1>
          <p className="text-sm text-white/45 mt-1">Pon a prueba tu preparación con exámenes reales y tests por unidad</p>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/8 hover:text-white transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Historial
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8 w-fit">
        {(["simulacros", "tests"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              tab === t ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "text-white/45 hover:text-white/70"
            }`}
          >
            {t === "simulacros" ? "Simulacros generales" : "Tests por unidad"}
          </button>
        ))}
      </div>

      {/* TAB: Simulacros */}
      {tab === "simulacros" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {SIMULACROS.map(sim => (
            <div key={sim.id} className="card flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 mb-2">
                    {sim.area}
                  </span>
                  <h2 className="text-sm font-bold text-white/90 leading-snug">{sim.name}</h2>
                </div>
                {sim.completed && (
                  <span className="shrink-0 text-[11px] font-bold px-2 py-1 rounded-lg text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                    Completado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  {sim.questions} preguntas
                </span>
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {sim.duration}
                </span>
              </div>

              {/* Difficulty bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/35">
                  <span>Dificultad</span>
                  <span>{sim.difficulty}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" style={{ width: `${sim.difficulty}%` }} />
                </div>
              </div>

              {sim.completed && sim.score !== null && (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                  <span className="text-xs text-white/45">Tu resultado</span>
                  <span className={`text-lg font-black ${sim.score >= 80 ? "text-emerald-400" : sim.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                    {sim.score}%
                  </span>
                </div>
              )}

              <Link
                href={`/exam/${sim.id}`}
                className="text-center py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/20"
              >
                {sim.completed ? "Repetir simulacro" : "Iniciar simulacro"}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Tests por unidad */}
      {tab === "tests" && (
        <div className="space-y-5">
          {/* Step 1: Materia */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">1. Selecciona la materia</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSubject(s); setSelectedModule(null); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    selectedSubject === s
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "bg-white/[0.03] border-white/8 text-white/50 hover:border-white/20 hover:text-white/75"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Módulo */}
          {selectedSubject && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">2. Selecciona el módulo</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {(MODULES_BY_SUBJECT[selectedSubject] || []).map(mod => (
                  <button
                    key={mod}
                    onClick={() => setSelectedModule(mod)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                      selectedModule === mod
                        ? "bg-violet-500/15 border-violet-500/35 text-violet-300"
                        : "bg-white/[0.025] border-white/6 text-white/60 hover:border-white/15 hover:text-white/80"
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Tests disponibles */}
          {selectedSubject && selectedModule && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">3. Tests disponibles</p>
              {[
                { name: `Test 1 — ${selectedModule}`, questions: 20, time: "25 min", difficulty: 60, done: true, score: 85 },
                { name: `Test 2 — ${selectedModule} avanzado`, questions: 25, time: "30 min", difficulty: 72, done: false, score: null },
                { name: `Test 3 — ${selectedModule} repaso integral`, questions: 15, time: "20 min", difficulty: 65, done: false, score: null },
              ].map((test, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/85">{test.name}</p>
                    <div className="flex gap-3 mt-1 text-xs text-white/35">
                      <span>{test.questions} preguntas</span>
                      <span>·</span>
                      <span>{test.time}</span>
                    </div>
                  </div>
                  {test.done && test.score !== null && (
                    <span className={`text-base font-black shrink-0 ${test.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                      {test.score}%
                    </span>
                  )}
                  <Link
                    href={`/exam/test-${selectedSubject.toLowerCase()}-${i}`}
                    className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-all"
                  >
                    {test.done ? "Repetir" : "Iniciar"}
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-[#0E0A18] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <h2 className="font-black text-white">Historial de examenes</h2>
                <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
                {HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/85 truncate">{h.exam}</p>
                      <p className="text-xs text-white/35 mt-0.5">{h.date} · {h.time}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-black ${h.score >= 80 ? "text-emerald-400" : h.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                        {h.score}%
                      </p>
                      <p className="text-xs text-white/30">{h.correct}/{h.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
