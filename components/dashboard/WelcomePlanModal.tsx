"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventManager, type CalendarEvent } from "@/components/ui/event-manager";

const PLANS = [
  {
    slug: "relaxed",
    name: "Plan Relajado",
    description: "3-4 días de estudio a la semana, sesiones de 1.5-2h enfocadas y estructuradas",
    days: "3-4 días/semana",
    hours: "1.5-2h por sesión",
    accent: "#10B981",
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
    accent: "#A78BFA",
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
    accent: "#F43F5E",
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
    description: "Tú decides los días y horas. Arma tu calendario con el planificador.",
    days: "Tú eliges",
    hours: "Tú eliges",
    accent: "#F59E0B",
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-300",
    schedule: [],
  },
] as const;

type PlanSlug = (typeof PLANS)[number]["slug"];

// Pre-populate the custom calendar with sample study blocks for the current week
function buildSampleEvents(): CalendarEvent[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const blocks: Array<{ dayOffset: number; hour: number; duration: number; title: string; category: string; color: string }> = [
    { dayOffset: 0, hour: 9, duration: 2, title: "Matemáticas", category: "Matemáticas", color: "blue" },
    { dayOffset: 1, hour: 10, duration: 2, title: "Español", category: "Español", color: "emerald" },
    { dayOffset: 2, hour: 9, duration: 3, title: "Biología", category: "Biología", color: "violet" },
    { dayOffset: 3, hour: 10, duration: 2, title: "Historia", category: "Historia", color: "amber" },
    { dayOffset: 4, hour: 9, duration: 2, title: "Química", category: "Química", color: "pink" },
  ];

  return blocks.map((b, i) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() + b.dayOffset);
    start.setHours(b.hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(b.hour + b.duration, 0, 0, 0);
    return { id: `sample-${i}`, title: b.title, category: b.category, color: b.color, startTime: start, endTime: end };
  });
}

export default function WelcomePlanModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PlanSlug | null>(null);
  const [step, setStep] = useState<"select" | "custom-calendar" | "confirm">("select");
  const [customDays, setCustomDays] = useState(4);
  const [customHours, setCustomHours] = useState(2);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(buildSampleEvents());

  useEffect(() => {
    const stored = localStorage.getItem("cefigo_plan_selected");
    if (!stored) setOpen(true);
  }, []);

  function confirmPlan() {
    if (!selected) return;
    localStorage.setItem("cefigo_plan_selected", selected);
    setOpen(false);
  }

  function handleContinue() {
    if (!selected) return;
    if (selected === "custom") {
      setStep("custom-calendar");
    } else {
      setStep("confirm");
    }
  }

  const selectedPlan = PLANS.find(p => p.slug === selected);
  const isCustomExpanded = selected === "custom" && step === "custom-calendar";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0E0A18] border border-white/10 shadow-2xl shadow-black/60"
            style={{ maxWidth: step === "custom-calendar" ? "64rem" : "42rem" }}
          >
            {/* Header */}
            <div className="px-8 pt-7 pb-5 text-center border-b border-white/8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-3">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Personaliza tu experiencia
              </div>
              <h1 className="text-2xl font-black text-white mb-1.5" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
                Bienvenido a{" "}
                <span style={{ background: "linear-gradient(135deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  CEFI GO
                </span>
              </h1>
              <p className="text-white/45 text-sm">
                {step === "custom-calendar"
                  ? "Arma tu semana ideal — arrastra y crea bloques de estudio"
                  : "Elige tu ritmo de estudio — podrás ajustarlo en cualquier momento desde tu perfil"}
              </p>
            </div>

            {/* STEP: select plan */}
            {step === "select" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANS.map(plan => (
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

                      {/* Sliders for custom */}
                      {plan.slug === "custom" && selected === "custom" && (
                        <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-white/50">Días por semana</span>
                              <span className="font-bold text-amber-300">{customDays} días</span>
                            </div>
                            <input type="range" min={3} max={6} value={customDays}
                              onChange={e => setCustomDays(+e.target.value)}
                              className="w-full accent-amber-400 cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-white/50">Horas por día</span>
                              <span className="font-bold text-amber-300">{customHours}h</span>
                            </div>
                            <input type="range" min={1} max={5} value={customHours}
                              onChange={e => setCustomHours(+e.target.value)}
                              className="w-full accent-amber-400 cursor-pointer" />
                          </div>
                          <p className="text-[11px] text-amber-300/70 mt-2">
                            En el siguiente paso podrás agendar exactamente qué días y horas estudiar
                          </p>
                        </div>
                      )}

                      {/* Schedule preview for fixed plans */}
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
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-900/30"
                >
                  {selected === "custom" ? "Armar mi calendario" : "Continuar"}
                  <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {/* STEP: custom calendar */}
            {step === "custom-calendar" && (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <p className="text-xs text-amber-300/80">
                    <span className="font-bold text-amber-300">Crea tus bloques de estudio</span> — haz clic en "Nuevo" para agregar sesiones. Arrastra para moverlas.
                  </p>
                </div>

                <EventManager
                  events={customEvents}
                  onEventCreate={ev => setCustomEvents(prev => [...prev, { ...ev, id: Math.random().toString(36).slice(2) }])}
                  onEventUpdate={(id, ev) => setCustomEvents(prev => prev.map(e => e.id === id ? { ...e, ...ev } : e))}
                  onEventDelete={id => setCustomEvents(prev => prev.filter(e => e.id !== id))}
                  defaultView="week"
                  compact={true}
                />

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep("select")}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:bg-white/5 transition-all">
                    Volver
                  </button>
                  <button onClick={() => setStep("confirm")}
                    className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/30">
                    Confirmar horario
                    <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP: confirm */}
            {step === "confirm" && selectedPlan && (
              <div className="p-6 space-y-5">
                <div className={`p-5 rounded-xl ${selectedPlan.accentBg} border ${selectedPlan.accentBorder}`}>
                  <h2 className={`text-xl font-black mb-1 ${selectedPlan.accentText}`}>{selectedPlan.name}</h2>
                  <p className="text-sm text-white/55">{selectedPlan.description}</p>
                </div>

                {selectedPlan.slug === "custom" ? (
                  <div>
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Tu horario personalizado</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                        <p className="text-2xl font-black text-amber-300">{customDays}</p>
                        <p className="text-xs text-white/40 mt-0.5">días por semana</p>
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                        <p className="text-2xl font-black text-amber-300">{customHours}h</p>
                        <p className="text-xs text-white/40 mt-0.5">por día</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {customEvents.slice(0, 5).map((ev, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/6">
                          <div className="w-1.5 h-6 rounded-full shrink-0"
                            style={{ background: ev.color === "violet" ? "#7C3AED" : ev.color === "pink" ? "#EC4899" : ev.color === "blue" ? "#3B82F6" : ev.color === "emerald" ? "#10B981" : ev.color === "amber" ? "#F59E0B" : "#F43F5E" }} />
                          <span className="text-sm text-white/75 font-medium">{ev.title}</span>
                          <span className="ml-auto text-xs text-white/35">
                            {ev.startTime.toLocaleDateString("es-MX", { weekday: "short" })} {ev.startTime.getHours()}:00
                          </span>
                        </div>
                      ))}
                      {customEvents.length > 5 && <p className="text-xs text-white/30 text-center">+{customEvents.length - 5} bloques más</p>}
                    </div>
                  </div>
                ) : (
                  selectedPlan.schedule.length > 0 && (
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
                  )
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(selected === "custom" ? "custom-calendar" : "select")}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/50 hover:bg-white/5 transition-all">
                    Cambiar plan
                  </button>
                  <button onClick={confirmPlan}
                    className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/30">
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
