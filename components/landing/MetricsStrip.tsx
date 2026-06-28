"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
  color: string;
}

const METRICS: Metric[] = [
  { value: 14,    suffix: "M+", label: "Reactivos respondidos", sub: "Por alumnos en la plataforma",   color: "from-violet-400 to-pink-400" },
  { value: 92,    suffix: "%",  label: "Tasa de admisión",      sub: "Alumnos que aprueban su examen", color: "from-pink-400 to-rose-400" },
  { value: 25000, suffix: "+",  label: "Preguntas reales",      sub: "Actualizadas cada ciclo",        color: "from-cyan-400 to-violet-400" },
  { value: 4.9,   suffix: "",   label: "Calificación promedio", sub: "Basada en +12,000 reseñas",      color: "from-amber-400 to-orange-400" },
];

function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const isDecimal = target % 1 !== 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function MetricCard({ metric, delay }: { metric: Metric; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(metric.value, 1800, inView);

  const display = metric.value >= 10000
    ? `${(count / 1000).toFixed(1).replace(".0", "")}k`
    : metric.value % 1 !== 0
    ? count.toFixed(1)
    : count.toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-6 py-8 relative"
    >
      {/* Divider */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-white/8 hidden md:block" />

      <p className={`text-5xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
        {metric.prefix ?? ""}{display}{metric.suffix}
      </p>
      <p className="text-base font-bold text-white mb-1">{metric.label}</p>
      <p className="text-sm text-white/40">{metric.sub}</p>
    </motion.div>
  );
}

export default function MetricsStrip() {
  return (
    <section className="py-4 border-y border-white/6 bg-white/[0.015] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
