"use client";

import { useState } from "react";

const resources = [
  {
    type: "PDF",
    title: "Resumen UNAM Área 2",
    subject: "General",
    desc: "Resumen ejecutivo de todos los temas del examen",
  },
  {
    type: "PDF",
    title: "Formulario de Física",
    subject: "Física",
    desc: "Todas las fórmulas esenciales con ejemplos",
  },
  {
    type: "Guía",
    title: "Estrategia para el día del examen",
    subject: "Tips",
    desc: "Guía minuto a minuto para el día del examen",
  },
  {
    type: "PDF",
    title: "Biología celular — mapa conceptual",
    subject: "Biología",
    desc: "Diagrama completo de la célula y sus orgánulos",
  },
  {
    type: "Video",
    title: "Mitosis y meiosis explicadas",
    subject: "Biología",
    desc: "Video de 12 minutos con animaciones",
  },
  {
    type: "Guía",
    title: "Cómo estudiar 3 horas al día",
    subject: "Tips",
    desc: "Técnica Pomodoro adaptada al examen de admisión",
  },
  {
    type: "PDF",
    title: "Tabla periódica comentada",
    subject: "Química",
    desc: "Tabla periódica con propiedades y tendencias explicadas",
  },
  {
    type: "Video",
    title: "Álgebra desde cero — sesión 1",
    subject: "Matemáticas",
    desc: "Sesión completa de álgebra para principiantes",
  },
  {
    type: "Guía",
    title: "Cronología de historia de México",
    subject: "Historia",
    desc: "Línea del tiempo interactiva desde la época prehispánica",
  },
];

type Tab = "Todos" | "PDFs" | "Guías" | "Videos";
const tabs: Tab[] = ["Todos", "PDFs", "Guías", "Videos"];

const typeIcon: Record<string, string> = {
  PDF: "📄",
  Video: "🎬",
  Guía: "📋",
};

const typeLabel: Record<string, string> = {
  PDF: "PDF",
  Video: "Video",
  Guía: "Guía",
};

const typeBadge: Record<string, string> = {
  PDF: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Video: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Guía: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

function filterByTab(tab: Tab) {
  if (tab === "Todos") return resources;
  if (tab === "PDFs") return resources.filter((r) => r.type === "PDF");
  if (tab === "Guías") return resources.filter((r) => r.type === "Guía");
  if (tab === "Videos") return resources.filter((r) => r.type === "Video");
  return resources;
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Todos");
  const filtered = filterByTab(activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1
          className="text-3xl font-black gradient-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recursos de estudio
        </h1>
        <p className="text-sm text-white/45 mt-1">
          PDFs, guías y videos para reforzar tu preparación
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((resource) => (
          <div key={resource.title} className="card flex flex-col gap-3">
            {/* Icon + badge row */}
            <div className="flex items-center justify-between">
              <span className="text-3xl">{typeIcon[resource.type]}</span>
              <span
                className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${typeBadge[resource.type]}`}
              >
                {typeLabel[resource.type]}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="font-bold text-sm mb-1 leading-snug">{resource.title}</p>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                {resource.subject}
              </p>
              <p className="text-xs text-white/55 leading-relaxed">{resource.desc}</p>
            </div>

            {/* CTA */}
            <a
              href="#"
              className="btn btn--ghost text-sm text-center"
              onClick={(e) => e.preventDefault()}
            >
              Ver recurso
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">No hay recursos en esta categoría todavía.</p>
        </div>
      )}
    </div>
  );
}
