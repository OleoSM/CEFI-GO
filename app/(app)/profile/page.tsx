"use client";
import { useState, useEffect } from "react";

const THEMES = [
  {
    slug: "cefigo",
    name: "CEFI GO",
    description: "Tema por defecto",
    colors: ["#7C3AED", "#EC4899", "#0B0617"],
    cssClass: "",
  },
  {
    slug: "unam",
    name: "UNAM",
    description: "Azul universitario",
    colors: ["#003366", "#CC9933", "#001a33"],
    cssClass: "theme-unam",
  },
  {
    slug: "ipn",
    name: "IPN",
    description: "Guinda politécnico",
    colors: ["#800020", "#006633", "#1a0008"],
    cssClass: "theme-ipn",
  },
] as const;

type ThemeSlug = (typeof THEMES)[number]["slug"];

const AVATARS_LOCKED = Array.from({ length: 8 }, (_, i) => i);

// Mock user
const MOCK_USER = {
  name: "Carlos Mendoza",
  email: "alumno@cefigo.mx",
  target: "UNAM",
  examDate: "13 Mar 2027",
};

export default function ProfilePage() {
  const [nickname, setNickname] = useState("carlos_m");
  const [editingNick, setEditingNick] = useState(false);
  const [nickDraft, setNickDraft] = useState(nickname);
  const [activeTheme, setActiveTheme] = useState<ThemeSlug>("cefigo");
  const [planSlug, setPlanSlug] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cefigo_theme") as ThemeSlug | null;
    if (stored) setActiveTheme(stored);
    const plan = localStorage.getItem("cefigo_plan_selected");
    if (plan) setPlanSlug(plan);
  }, []);

  function applyTheme(slug: ThemeSlug) {
    const theme = THEMES.find(t => t.slug === slug)!;
    // Remove all theme classes
    THEMES.forEach(t => { if (t.cssClass) document.documentElement.classList.remove(t.cssClass); });
    if (theme.cssClass) document.documentElement.classList.add(theme.cssClass);
    localStorage.setItem("cefigo_theme", slug);
    setActiveTheme(slug);
  }

  const initials = MOCK_USER.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const PLAN_NAMES: Record<string, string> = {
    relaxed: "Plan Relajado",
    optimal: "Plan Óptimo",
    intensive: "Máximo Esfuerzo",
    custom: "Plan Personalizado",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <header>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
          Mi perfil
        </h1>
        <p className="text-sm text-white/45 mt-1">Personaliza tu experiencia en CEFI GO</p>
      </header>

      {/* Card 1: Perfil */}
      <div className="card p-6 space-y-6">
        <h2 className="text-base font-black text-white">Mi perfil</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
            {initials}
          </div>

          {/* Locked avatars grid */}
          <div>
            <p className="text-xs text-white/35 text-center mb-2">Avatares — Próximamente</p>
            <div className="grid grid-cols-8 gap-1.5">
              {AVATARS_LOCKED.map(i => (
                <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nickname */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Nickname</p>
          {editingNick ? (
            <div className="flex gap-2">
              <input
                value={nickDraft}
                onChange={e => setNickDraft(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20))}
                className="flex-1 bg-white/5 border border-violet-500/40 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/25"
                autoFocus
                maxLength={20}
              />
              <button onClick={() => { setNickname(nickDraft); setEditingNick(false); }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-violet-600 text-white hover:opacity-90 transition-opacity">
                Guardar
              </button>
              <button onClick={() => { setNickDraft(nickname); setEditingNick(false); }}
                className="px-3 py-2 rounded-xl text-sm text-white/40 border border-white/10 hover:bg-white/5 transition-all">
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8">
              <span className="text-sm text-white font-medium">@{nickname}</span>
              <button onClick={() => setEditingNick(true)} className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Editar
              </button>
            </div>
          )}
          <p className="text-xs text-white/25">Solo letras, números y guiones bajos. Máx. 20 caracteres.</p>
        </div>

        {/* Info fields */}
        {[
          { label: "Nombre completo", value: MOCK_USER.name },
          { label: "Correo electrónico", value: MOCK_USER.email },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{f.label}</p>
            <div className="px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/6 text-sm text-white/50">{f.value}</div>
          </div>
        ))}

        {/* Target */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Meta de examen</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/25 text-blue-300">
              {MOCK_USER.target}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Fecha del examen</p>
            <p className="text-sm font-bold text-white/70">{MOCK_USER.examDate}</p>
          </div>
        </div>
      </div>

      {/* Card 2: Tema */}
      <div className="card p-6 space-y-4">
        <h2 className="text-base font-black text-white">Tema de la aplicación</h2>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(theme => (
            <button
              key={theme.slug}
              onClick={() => applyTheme(theme.slug)}
              className={`relative p-4 rounded-xl text-left transition-all border ${
                activeTheme === theme.slug
                  ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-900/20"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {activeTheme === theme.slug && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
              <div className="flex gap-1.5 mb-3">
                {theme.colors.map((c, ci) => (
                  <div key={ci} className="w-5 h-5 rounded-full border border-white/10" style={{ background: c }} />
                ))}
              </div>
              <p className="text-sm font-bold text-white">{theme.name}</p>
              <p className="text-xs text-white/35 mt-0.5">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Card 3: Plan activo */}
      <div className="card p-6 space-y-3">
        <h2 className="text-base font-black text-white">Plan de estudio activo</h2>
        {planSlug ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div>
              <p className="text-sm font-bold text-violet-300">{PLAN_NAMES[planSlug] ?? planSlug}</p>
              <p className="text-xs text-white/35 mt-0.5">Activo desde el registro</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("cefigo_plan_selected");
                setPlanSlug(null);
                window.location.href = "/dashboard";
              }}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Cambiar plan
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8">
            <p className="text-sm text-white/40 flex-1">Sin plan seleccionado</p>
            <button
              onClick={() => { localStorage.removeItem("cefigo_plan_selected"); window.location.href = "/dashboard"; }}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Seleccionar plan
            </button>
          </div>
        )}
      </div>

      {/* Card 4: Cuenta */}
      <div className="card p-6 space-y-3">
        <h2 className="text-base font-black text-white">Cuenta y seguridad</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.025] border border-white/6">
            <div>
              <p className="text-sm font-medium text-white/50">Cambiar contraseña</p>
              <p className="text-xs text-white/25 mt-0.5">Próximamente disponible</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/25 font-semibold">Pronto</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.025] border border-white/6">
            <div>
              <p className="text-sm font-medium text-white/50">Eliminar cuenta</p>
              <p className="text-xs text-white/25 mt-0.5">Esta acción es permanente</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/25 font-semibold">Pronto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
