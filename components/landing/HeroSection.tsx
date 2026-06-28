"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// University brand colors — each gets its own identity
const ROTATING_WORDS = [
  { text: "UNAM", color: "#1565C0", prefix: "a la", label: "Universidad Nacional Autónoma de México" },
  { text: "IPN",  color: "#800020", prefix: "al",   label: "Instituto Politécnico Nacional" },
  { text: "UAM",  color: "#7B1FA2", prefix: "a la", label: "Universidad Autónoma Metropolitana" },
];

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlansIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Animated countdown for flash offer
function FlashCountdown() {
  const [secs, setSecs] = useState(47 * 60 + 33);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 47 * 60 + 33)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="font-black tabular-nums text-orange-400">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

// Live users counter animation
function LiveCounter({ base }: { base: number }) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-black text-emerald-400">{n.toLocaleString("es-MX")}</span>;
}

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const word = ROTATING_WORDS[wordIndex];

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="pt-36 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Nueva generación de preparación · 2026
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-6xl font-black leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Entra{" "}
            <span
              className="inline-flex flex-col overflow-hidden h-[1.1em] align-bottom"
              aria-label={`${word.prefix} ${word.text}`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block whitespace-nowrap"
                >
                  <span className="text-white">{word.prefix} </span>
                  <span style={{ color: word.color }}>{word.text}</span>
                </motion.span>
              </AnimatePresence>
            </span>
            <br />sin adivinar.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-white/55 mb-8 leading-relaxed">
            <span className="font-bold" style={{ background: "linear-gradient(90deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CEFI GO</span>{" "}
            combina cursos interactivos, simulacros con preguntas reales y mentores
            expertos para que domines tu examen de admisión y entres a la universidad que mereces.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/40"
            >
              Comienza gratis <ArrowIcon />
            </Link>
            <Link
              href="#planes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-white/6 border border-white/12 text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
            >
              <PlansIcon />
              Ver planes
            </Link>
          </motion.div>

          <motion.dl variants={itemVariants} className="flex gap-8">
            {[
              { label: "Reactivos respondidos", value: "14M+" },
              { label: "Tasa de ingreso",       value: "92%" },
              { label: "Preguntas reales",       value: "25,000+" },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-white/35 mb-1 uppercase tracking-wider">{s.label}</dt>
                <dd className="text-2xl font-black gradient-text">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Right — promo card */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Ofertas y próximos eventos"
        >
          <div className="relative rounded-2xl bg-white/4 border border-white/10 p-5 backdrop-blur-sm shadow-2xl shadow-violet-900/20">
            {/* Traffic lights */}
            <div className="flex gap-1.5 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>

            {/* Flash offer — most prominent element */}
            <div className="flash-offer-card rounded-xl bg-gradient-to-br from-violet-950/70 via-[#1a0a22] to-pink-950/50 p-4 mb-3 relative">
              {/* Badge + countdown */}
              <div className="flex items-center justify-between mb-3">
                <div className="flash-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-black text-[11px] font-black uppercase tracking-wider">
                  <ZapIcon /> Oferta relámpago
                </div>
                <div className="text-xs text-white/50">Termina en <FlashCountdown /></div>
              </div>

              <p className="text-white font-black text-lg leading-tight mb-1">Plan Pro · 3 meses</p>

              {/* Prices */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black bg-gradient-to-r from-violet-300 to-pink-400 bg-clip-text text-transparent">$599</span>
                <span className="text-white/35 text-base line-through">$897</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-bold">−33%</span>
              </div>

              {/* Lugares restantes — urgency bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-orange-300 font-bold">Solo 7 lugares disponibles</span>
                  <span className="text-white/40">23 vendidos</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    style={{ width: "77%" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/register"
                className="flash-cta flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-black uppercase tracking-wide text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:scale-105 transition-transform"
              >
                Aprovechar oferta <ArrowIcon />
              </Link>
            </div>

            {/* Upcoming simulacros */}
            <div className="rounded-xl bg-white/5 border border-white/8 p-4 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-violet-400 font-bold uppercase tracking-wider mb-3">
                <CalIcon /> Próximos simulacros
              </div>
              <div className="space-y-2">
                {[
                  { exam: "UNAM Área 2", date: "Sáb 28 Jun", spots: 12, color: "#1565C0" },
                  { exam: "IPN — Ingeniería", date: "Dom 29 Jun", spots: 5,  color: "#800020" },
                  { exam: "UAM — Azcapotzalco", date: "Sáb 5 Jul", spots: 28, color: "#7B1FA2" },
                ].map((s) => (
                  <motion.div
                    key={s.exam}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-white/75 font-medium">{s.exam}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/35">{s.date}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.spots <= 10 ? "bg-red-500/20 text-red-400 border border-red-500/25" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"}`}>
                        {s.spots} cupos
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live stat */}
            <div className="rounded-xl bg-white/5 border border-white/8 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Estudiando ahora
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <UsersIcon />
                <LiveCounter base={847} />
                <span className="text-white/35">alumnos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
