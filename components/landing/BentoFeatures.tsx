"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

const BookIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const TargetIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const MapIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
const UsersIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const ChartIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const FlameIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;

type FeatureCard = CardStackItem & {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  accentGlow: string;
  tag?: string;
  tagColor?: string;
  stat?: { value: string; label: string };
};

const FEATURES: FeatureCard[] = [
  {
    id: "simulacros",
    title: "Simulacros oficiales",
    description: "25,000+ preguntas reales con cronómetro, mapa de reactivos y análisis por materia al terminar. El formato exacto del examen.",
    icon: <TargetIcon />,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15",
    accentGlow: "#EC4899",
    tag: "Más usado",
    tagColor: "text-pink-400 bg-pink-500/10 border-pink-500/25",
    stat: { value: "25,000+", label: "preguntas reales" },
  },
  {
    id: "cursos",
    title: "Cursos estructurados",
    description: "Lecciones en video ordenadas por el examen real. Sin relleno, sin teoría innecesaria. Solo lo que entra al examen.",
    icon: <BookIcon />,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    accentGlow: "#A78BFA",
    stat: { value: "6 áreas", label: "cubiertas completamente" },
  },
  {
    id: "ia",
    title: "Plan con IA",
    description: "Diagnóstico inicial de 30 preguntas + ruta semanal adaptada a tu ritmo, tu fecha de examen y tus puntos débiles.",
    icon: <MapIcon />,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    accentGlow: "#10B981",
    tag: "IA",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    stat: { value: "Adapta", label: "tu plan cada semana" },
  },
  {
    id: "analitica",
    title: "Analítica de progreso",
    description: "Ve tu probabilidad de ingreso evolucionar semana a semana. Gráficas reales, predicción de puntaje y comparativa histórica.",
    icon: <ChartIcon />,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
    accentGlow: "#22D3EE",
    stat: { value: "92%", label: "tasa de admisión" },
  },
  {
    id: "racha",
    title: "Racha y gamificación",
    description: "Logros, rachas diarias y rankings que hacen que estudiar 30 minutos al día sea imparable. El hábito que te lleva al examen.",
    icon: <FlameIcon />,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    accentGlow: "#F59E0B",
    stat: { value: "14 días", label: "racha promedio activa" },
  },
  {
    id: "mentores",
    title: "Mentores expertos",
    description: "Sesiones con egresados que ya aprobaron exactamente el examen al que tú te preparas. Estrategia real, no teoría.",
    icon: <UsersIcon />,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/15",
    accentGlow: "#FB7185",
    stat: { value: "4 sesiones", label: "grupales por mes" },
  },
];

function FeatureCardRenderer(item: FeatureCard, { active }: { active: boolean }) {
  return (
    <div
      className="relative h-full w-full flex flex-col justify-between p-6 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top left, ${item.accentGlow}18 0%, #0B0617 60%)`,
        border: `1px solid ${active ? item.accentGlow + "44" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: item.accentGlow }}
      />

      <div>
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
            {item.icon}
          </div>
          {item.tag && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${item.tagColor}`}>
              {item.tag}
            </span>
          )}
        </div>
        <h3 className="text-xl font-black mb-3 text-white" style={{ fontFamily: "var(--font-display)" }}>
          {item.title}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed">{item.description}</p>
      </div>

      {item.stat && (
        <div
          className="mt-6 pt-4 border-t flex items-center justify-between"
          style={{ borderColor: `${item.accentGlow}22` }}
        >
          <span className="text-2xl font-black" style={{ color: item.accentGlow }}>
            {item.stat.value}
          </span>
          <span className="text-xs text-white/35 text-right max-w-[120px] leading-snug">
            {item.stat.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function BentoFeatures() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="caracteristicas" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
            Por qué{" "}
            <span style={{ background: "linear-gradient(90deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CEFI GO
            </span>
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Todo lo que necesitas para{" "}
            <span className="gradient-text">aprobar</span>
          </h2>
          <p className="text-white/40 text-sm">Arrastra · Haz clic para explorar cada característica</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <CardStack
            items={FEATURES}
            renderCard={(item, state) => FeatureCardRenderer(item as FeatureCard, state)}
            cardWidth={460}
            cardHeight={290}
            maxVisible={5}
            autoAdvance
            intervalMs={3200}
            pauseOnHover
            showDots
            overlap={0.52}
            spreadDeg={38}
            activeScale={1.02}
            inactiveScale={0.93}
          />
        </motion.div>
      </div>
    </section>
  );
}
