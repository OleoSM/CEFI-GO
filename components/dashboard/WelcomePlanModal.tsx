"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 4 planes definidos con su schedule semanal
const PLANS = [
  {
    slug: "relaxed",
    name: "Plan Relajado",
    description: "3-4 días de estudio a la semana, sesiones de 1.5-2h enfocadas y estructuradas",
    days: "3-4 días/semana",
    hours: "1.5-2h por sesión",
    accent: "#10B981", // emerald
    accentBg: "bg-emerald-500/15",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-300",
    schedule: [
      { day: "Lunes", topics: "Matemáticas — Álgebra básica", hours: "2h" },
      { day: "Miércoles", topics: "Español — Comprensión lectora", hours: "1.5h" },
      { day: "Viernes", topics: "Biología — Célula y organelos", hours: "2h" },
      { day: "Sábado", topics: "Repaso general", hours: "1.5h" },
    ],
  },
  {
    slug: "optimal",
    name: "Plan Óptimo",
    description: "4-5 días balanceados, avance sostenido sin saturación",
    days: "4-5 días/semana",
    hours: "2-3h por sesión",
    accent: "#A78BFA", // violet
    accentBg: "bg-violet-500/15",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-300",
    badge: "RECOMENDADO",
    schedule: [
      { day: "Lunes", topics: "Matemáticas — Álgebra y Geometría", hours: "2.5h" },
      { day: "Martes", topics: "Español + Historia", hours: "2h" },
      { day: "Jueves", topics: "Biología + Química", hours: "3h" },
      { day: "Viernes", topics: "Física", hours: "2h" },
      { day: "Sábado", topics: "Simulacro express", hours: "2h" },
    ],
  },
  {
    slug: "intensive",
    name: "Máximo Esfuerzo",
    description: "5-6 días, alta carga estructurada con sesiones distribuidas en el día",
    days: "5-6 días/semana",
    hours: "4-5h divididas mañana/tarde",
    accent: "#F43F5E", // rose
    accentBg: "bg-rose-500/15",
    accentBorder: "border-rose-500/30",
    accentText: "text-rose-300",
    schedule: [
      { day: "Lunes", topics: "Matemáticas 2h / Física 2h", hours: "4h" },
      { day: "Martes", topics: "Español + Historia", hours: "3h" },
      { day: "Miércoles", topics: "Química + Biología", hours: "4h" },
      { day: "Jueves", topics: "Matemáticas avanzadas / Repaso", hours: "5h" },
      { day: "Viernes", topics: "Simulacro completo", hours: "3h" },
      { day: "Sábado", topics: "Análisis de errores + Refuerzo", hours: "3h" },
    ],
  },
  {
    slug: "custom",
    name: "Personalizado",
    description: "Tú decides los días y horas. Configuraremos tu calendario a medida.",
    days: "Tú eliges",
    hours: "Tú eliges",
    accent: "#F59E0B", // amber
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-300",
    schedule: [],
  },
];

export default function WelcomePlanModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [customDays, setCustomDays] = useState(4);
  const [customHours, setCustomHours] = useState(2);

  useEffect(() => {
    const stored = localStorage.getItem("cefigo_plan_selected");
    if (!stored) setOpen(true);
  }, []);

  function confirmPlan() {
    if (!selected) return;
    localStorage.setItem("cefigo_plan_selected", selected);
    setOpen(false);
  }

  const selectedPlan = PLANS.find(p => p.slug === selected);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0E0A18] border border-white/10 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-white/8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Personaliza tu experiencia
              </div>
              <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
                Bienvenido a <span style={{ background: "linear-gradient(135deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CEFI GO</span>
              </h1>
              <p className="text-white/50 text-sm">Elige tu ritmo de estudio — podrás ajustarlo en cualquier momento desde tu perfil</p>
            </div>

            {step === "select" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.slug}
                      onClick={() => setSelected(plan.slug)}
                      className={`relative text-left p-4 rounded-xl border transition-all ${
                        selected === plan.slug
                          ? `${plan.accentBg} ${plan.accentBorder} shadow-lg`
                          : "bg-white/[0.03] border-white/8 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
                          {plan.badge}
                        </span>
                      )}
                      <div className={`text-base font-black mb-1 ${selected === plan.slug ? plan.accentText : "text-white"}`}>
                        {plan.name}
                      </div>
                      <div className="text-xs text-white/50 mb-3 leading-relaxed">{plan.description}</div>
                      <div className="flex gap-3 text-xs">
                        <span className={`font-semibold ${selected === plan.slug ? plan.accentText : "text-white/60"}`}>{plan.days}</span>
                        <span className="text-white/25">·</span>
                        <span className="text-white/45">{plan.hours}</span>
                      </div>

                      {/* Custom plan sliders */}
                      {plan.slug === "custom" && selected === "custom" && (
                        <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/50">Días por semana</span>
                              <span className="font-bold text-amber-300">{customDays}</span>
                            </div>
                            <input type="range" min={3} max={6} value={customDays} onChange={e => setCustomDays(+e.target.value)}
                              className="w-full accent-amber-400 cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/50">Horas por día</span>
                              <span className="font-bold text-amber-300">{customHours}h</span>
                            </div>
                            <input type="range" min={1} max={5} value={customHours} onChange={e => setCustomHours(+e.target.value)}
                              className="w-full accent-amber-400 cursor-pointer" />
                          </div>
                        </div>
                      )}

                      {/* Schedule preview */}
                      {selected === plan.slug && plan.schedule.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-t border-white/8 pt-3">
                          {plan.schedule.slice(0, 3).map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-white/40 w-20 shrink-0">{s.day}</span>
                              <span className="text-white/65 flex-1">{s.topics}</span>
                              <span className={`shrink-0 ml-2 font-semibold ${plan.accentText}`}>{s.hours}</span>
                            </div>
                          ))}
                          {plan.schedule.length > 3 && (
                            <div className="text-xs text-white/30">+{plan.schedule.length - 3} días más</div>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selected}
                  onClick={() => setStep("confirm")}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-900/30"
                >
                  Continuar
                  <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {step === "confirm" && selectedPlan && (
              <div className="p-6 space-y-5">
                <div className={`p-5 rounded-xl ${selectedPlan.accentBg} border ${selectedPlan.accentBorder}`}>
                  <h2 className={`text-xl font-black mb-1 ${selectedPlan.accentText}`}>{selectedPlan.name}</h2>
                  <p className="text-sm text-white/55">{selectedPlan.description}</p>
                </div>

                {selectedPlan.schedule.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Vista previa — Semana 1</h3>
                    <div className="space-y-2">
                      {selectedPlan.schedule.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/6">
                          <div className="w-1 h-8 rounded-full" style={{ background: selectedPlan.accent }} />
                          <div>
                            <div className="text-xs text-white/40">{s.day}</div>
                            <div className="text-sm font-medium text-white/80">{s.topics}</div>
                          </div>
                          <span className={`ml-auto text-xs font-bold ${selectedPlan.accentText}`}>{s.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep("select")} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:bg-white/5 transition-all">
                    Cambiar plan
                  </button>
                  <button onClick={confirmPlan} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/30">
                    Comenzar ahora
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
