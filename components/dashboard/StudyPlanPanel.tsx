"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Subject = "math" | "spanish" | "biology" | "history" | "chemistry" | "physics" | "rest";

interface DayEntry {
  day: string;
  shortDay: string;
  topic: string;
  subject: Subject;
  hours: number;
  done: boolean;
}

interface Week {
  week: number;
  theme: string;
  days: DayEntry[];
}

// ── Mock plan data ────────────────────────────────────────────────────────────
const SUBJECT_META: Record<Subject, { label: string; color: string; bg: string; dot: string }> = {
  math:      { label: "Matemáticas", color: "text-violet-300",  bg: "bg-violet-500/15 border-violet-500/30",  dot: "bg-violet-400" },
  spanish:   { label: "Español",     color: "text-pink-300",    bg: "bg-pink-500/15 border-pink-500/30",      dot: "bg-pink-400" },
  biology:   { label: "Biología",    color: "text-emerald-300", bg: "bg-emerald-500/15 border-emerald-500/30",dot: "bg-emerald-400" },
  history:   { label: "Historia",    color: "text-amber-300",   bg: "bg-amber-500/15 border-amber-500/30",    dot: "bg-amber-400" },
  chemistry: { label: "Química",     color: "text-cyan-300",    bg: "bg-cyan-500/15 border-cyan-500/30",      dot: "bg-cyan-400" },
  physics:   { label: "Física",      color: "text-blue-300",    bg: "bg-blue-500/15 border-blue-500/30",      dot: "bg-blue-400" },
  rest:      { label: "Descanso",    color: "text-white/30",    bg: "bg-white/5 border-white/8",              dot: "bg-white/20" },
};

const PLAN: Week[] = [
  {
    week: 1, theme: "Diagnóstico y bases matemáticas",
    days: [
      { day: "Lunes",     shortDay: "L", topic: "Álgebra: productos notables",        subject: "math",    hours: 2,   done: true  },
      { day: "Martes",    shortDay: "M", topic: "Comprensión lectora: estrategias",   subject: "spanish", hours: 1.5, done: true  },
      { day: "Miércoles", shortDay: "X", topic: "Biología celular: mitosis/meiosis",  subject: "biology", hours: 2,   done: true  },
      { day: "Jueves",    shortDay: "J", topic: "Historia: México independiente",      subject: "history", hours: 1.5, done: true  },
      { day: "Viernes",   shortDay: "V", topic: "Química: tabla periódica",           subject: "chemistry",hours: 2,  done: true  },
      { day: "Sábado",    shortDay: "S", topic: "Simulacro diagnóstico (40 reactivos)",subject: "math",   hours: 2,   done: true  },
      { day: "Domingo",   shortDay: "D", topic: "Descanso",                           subject: "rest",    hours: 0,   done: true  },
    ],
  },
  {
    week: 2, theme: "Aritmética y pensamiento matemático",
    days: [
      { day: "Lunes",     shortDay: "L", topic: "Fracciones, decimales y porcentajes", subject: "math",    hours: 2,   done: true  },
      { day: "Martes",    shortDay: "M", topic: "Texto argumentativo: identificación", subject: "spanish", hours: 1.5, done: true  },
      { day: "Miércoles", shortDay: "X", topic: "Genética: leyes de Mendel",           subject: "biology", hours: 2,   done: true  },
      { day: "Jueves",    shortDay: "J", topic: "Historia: Reforma y Porfiriato",      subject: "history", hours: 1.5, done: true  },
      { day: "Viernes",   shortDay: "V", topic: "Química orgánica: alcanos",           subject: "chemistry",hours: 2,  done: true  },
      { day: "Sábado",    shortDay: "S", topic: "Práctica express (matemáticas)",      subject: "math",    hours: 1.5, done: true  },
      { day: "Domingo",   shortDay: "D", topic: "Descanso",                            subject: "rest",    hours: 0,   done: true  },
    ],
  },
  {
    week: 3, theme: "Álgebra y ecuaciones",
    days: [
      { day: "Lunes",     shortDay: "L", topic: "Ecuaciones lineales y sistemas 2×2", subject: "math",    hours: 2,   done: true  },
      { day: "Martes",    shortDay: "M", topic: "Ortografía y puntuación",            subject: "spanish", hours: 1.5, done: true  },
      { day: "Miércoles", shortDay: "X", topic: "Ecología: cadenas alimentarias",     subject: "biology", hours: 2,   done: false },
      { day: "Jueves",    shortDay: "J", topic: "Revolución Mexicana",                subject: "history", hours: 1.5, done: false },
      { day: "Viernes",   shortDay: "V", topic: "Física: cinemática básica",          subject: "physics", hours: 2,   done: false },
      { day: "Sábado",    shortDay: "S", topic: "Simulacro 50 reactivos",             subject: "math",    hours: 2,   done: false },
      { day: "Domingo",   shortDay: "D", topic: "Descanso",                           subject: "rest",    hours: 0,   done: false },
    ],
  },
  {
    week: 4, theme: "Geometría y trigonometría",
    days: [
      { day: "Lunes",     shortDay: "L", topic: "Geometría analítica: rectas",        subject: "math",    hours: 2,   done: false },
      { day: "Martes",    shortDay: "M", topic: "Literatura: figuras retóricas",      subject: "spanish", hours: 1.5, done: false },
      { day: "Miércoles", shortDay: "X", topic: "Anatomía: sistemas del cuerpo",      subject: "biology", hours: 2,   done: false },
      { day: "Jueves",    shortDay: "J", topic: "México contemporáneo",               subject: "history", hours: 1.5, done: false },
      { day: "Viernes",   shortDay: "V", topic: "Física: dinámica y leyes de Newton", subject: "physics", hours: 2,   done: false },
      { day: "Sábado",    shortDay: "S", topic: "Práctica por áreas débiles",         subject: "math",    hours: 2,   done: false },
      { day: "Domingo",   shortDay: "D", topic: "Descanso",                           subject: "rest",    hours: 0,   done: false },
    ],
  },
  {
    week: 5, theme: "Física y química avanzada",
    days: [
      { day: "Lunes",     shortDay: "L", topic: "Trigonometría: funciones seno/cos",  subject: "math",    hours: 2,   done: false },
      { day: "Martes",    shortDay: "M", topic: "Sintaxis: oraciones compuestas",     subject: "spanish", hours: 1.5, done: false },
      { day: "Miércoles", shortDay: "X", topic: "Fisiología vegetal",                 subject: "biology", hours: 2,   done: false },
      { day: "Jueves",    shortDay: "J", topic: "Historia universal: S. XX",          subject: "history", hours: 1.5, done: false },
      { day: "Viernes",   shortDay: "V", topic: "Química: reacciones de óxido-red.",  subject: "chemistry",hours: 2,  done: false },
      { day: "Sábado",    shortDay: "S", topic: "Simulacro 70 reactivos",             subject: "math",    hours: 2.5, done: false },
      { day: "Domingo",   shortDay: "D", topic: "Descanso",                           subject: "rest",    hours: 0,   done: false },
    ],
  },
];

// ── Performance data (scores per week) ────────────────────────────────────────
const PERF_DATA = [
  { week: "Sem 1", score: 44 },
  { week: "Sem 2", score: 53 },
  { week: "Sem 3", score: 61 },
  { week: "Sem 4", score: 58 },
  { week: "Sem 5", score: 67 },
  { week: "Sem 6", score: 72 },
  { week: "Sem 7", score: 78 },
  { week: "Sem 8", score: 75 },
];

const TARGET_SCORE = 90;

// ── Materials ─────────────────────────────────────────────────────────────────
const MATERIALS = [
  { subject: "math"    as Subject, title: "Álgebra lineal — UNAM guía 2024",       type: "PDF",    pages: 42, hot: true  },
  { subject: "biology" as Subject, title: "Biología: ecología y evolución",         type: "Video",  pages: 28, hot: false },
  { subject: "physics" as Subject, title: "Física: cinemática resuelta paso a paso",type: "PDF",    pages: 36, hot: true  },
  { subject: "spanish" as Subject, title: "Comprensión lectora: 200 ejercicios",    type: "PDF",    pages: 55, hot: false },
];

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
function PerformanceChart() {
  const W = 320, H = 140;
  const PAD = { top: 16, right: 12, bottom: 28, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const minScore = 0, maxScore = 100;
  const xStep = chartW / (PERF_DATA.length - 1);
  const toY = (s: number) => PAD.top + chartH - ((s - minScore) / (maxScore - minScore)) * chartH;
  const toX = (i: number) => PAD.left + i * xStep;

  const points = PERF_DATA.map((d, i) => ({ x: toX(i), y: toY(d.score) }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`;

  const targetY = toY(TARGET_SCORE);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
          <text x={PAD.left - 6} y={toY(v) + 4} fontSize="9" fill="rgba(255,255,255,0.25)" textAnchor="end">{v}</text>
        </g>
      ))}

      {/* Target line */}
      <line x1={PAD.left} y1={targetY} x2={W - PAD.right} y2={targetY} stroke="#A78BFA" strokeWidth="1" strokeDasharray="6,3" opacity="0.5" />
      <text x={W - PAD.right + 2} y={targetY + 4} fontSize="8" fill="#A78BFA" opacity="0.7">Meta</text>

      {/* Area fill */}
      <path d={areaD} fill="url(#chartGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0B0617" stroke="#A78BFA" strokeWidth="2" />
          {i === PERF_DATA.length - 1 && (
            <>
              <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.6" />
              <text x={p.x} y={p.y - 10} fontSize="9" fill="#EC4899" textAnchor="middle" fontWeight="bold">{PERF_DATA[i].score}%</text>
            </>
          )}
        </g>
      ))}

      {/* X-axis labels */}
      {PERF_DATA.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="middle">{d.week}</text>
      ))}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function StudyPlanPanel() {
  const [activeWeek, setActiveWeek] = useState(2); // 0-indexed → semana 3

  const week = PLAN[activeWeek];
  const currentDayIdx = 2; // miércoles (simula hoy)

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-black text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Plan de estudio · UNAM
            </h2>
            <p className="text-[11px] text-white/40">Ingeniería en Computación · Examen sep 2026</p>
          </div>
          <span className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 border border-violet-500/25 text-violet-300">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Generado por IA
          </span>
        </div>
        <button
          disabled
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/30 cursor-not-allowed"
          title="Disponible en tu plan Pro"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Modificar plan
        </button>
      </div>

      {/* Body: calendar + sidebar */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Calendar — 2/3 */}
        <div className="lg:col-span-2 space-y-4">

          {/* Week selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {PLAN.map((w, i) => (
              <button
                key={i}
                onClick={() => setActiveWeek(i)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeWeek === i
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "bg-white/5 border border-white/8 text-white/45 hover:border-white/20 hover:text-white/70"
                }`}
              >
                Sem {w.week}
                {i < 2 && (
                  <svg className="inline-block ml-1.5 text-emerald-400" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
                {i === 2 && <span className="ml-1.5 text-[9px] text-amber-400">●</span>}
              </button>
            ))}
          </div>

          {/* Week theme */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-pink-400" />
            <p className="text-sm font-bold text-white/80">{week.theme}</p>
          </div>

          {/* Day cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {week.days.map((day, i) => {
              const meta = SUBJECT_META[day.subject];
              const isToday = activeWeek === 2 && i === currentDayIdx;
              const isPast = day.done;

              return (
                <div
                  key={i}
                  className={`relative rounded-xl p-3.5 border transition-all ${
                    isToday
                      ? "bg-violet-500/10 border-violet-500/40 shadow-lg shadow-violet-900/20"
                      : isPast
                      ? "bg-white/[0.03] border-white/6 opacity-60"
                      : "bg-white/[0.025] border-white/6 hover:border-white/15"
                  } ${day.subject === "rest" ? "sm:col-span-2 opacity-40" : ""}`}
                >
                  {isToday && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    {/* Day label */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isToday ? "bg-violet-500 text-white" : "bg-white/5 text-white/40"
                    }`}>
                      {day.shortDay}
                    </div>

                    {day.subject === "rest" ? (
                      <p className="text-xs text-white/25 pt-2">Descanso · sin actividades</p>
                    ) : (
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.bg} ${meta.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </div>
                        <p className="text-xs font-medium text-white/85 leading-snug line-clamp-2">{day.topic}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/30">{day.hours}h de estudio</span>
                          {isPast && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                              Completado
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[10px] text-violet-300 font-semibold">Hoy →</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: chart + materials */}
        <div className="space-y-4">

          {/* Performance chart */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black" style={{ fontFamily: "var(--font-display)" }}>
                Performance
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/40">Meta</span>
                <span className="text-xs font-bold text-violet-300">{TARGET_SCORE}%</span>
              </div>
            </div>

            <PerformanceChart />

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
              <div className="text-center">
                <p className="text-xs text-white/35">Actual</p>
                <p className="text-base font-black text-pink-400">75%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/35">Mejor</p>
                <p className="text-base font-black text-emerald-400">78%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/35">Faltan</p>
                <p className="text-base font-black text-violet-300">+15pts</p>
              </div>
            </div>
          </div>

          {/* Material suggestions */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black flex-1" style={{ fontFamily: "var(--font-display)" }}>
                Material sugerido
              </h3>
              <span className="text-[10px] text-white/30 font-medium">Esta semana</span>
            </div>

            <div className="space-y-2">
              {MATERIALS.map((m, i) => {
                const meta = SUBJECT_META[m.subject];
                return (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/15 hover:bg-white/5 transition-all text-left group"
                  >
                    {/* Type icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.bg} border`}>
                      {m.type === "PDF" ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={meta.color}>
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={meta.color}>
                          <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/80 leading-snug line-clamp-1 group-hover:text-white transition-colors">
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                        <span className="text-[10px] text-white/25">{m.pages} págs.</span>
                        {m.hot && (
                          <span className="text-[10px] text-amber-400 font-bold">Popular</span>
                        )}
                      </div>
                    </div>

                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-white/60 shrink-0 transition-colors">
                      <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* AI insight */}
            <div className="mt-1 p-3 rounded-xl bg-violet-500/8 border border-violet-500/20">
              <p className="text-[11px] text-violet-300 leading-relaxed">
                <span className="font-bold">Sugerencia IA:</span> Tu rendimiento en Física bajó vs la semana pasada. Dedica 30 min extra esta semana a cinemática antes del simulacro.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
