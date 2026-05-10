"use client";

import { useState } from "react";
import { mockUser } from "@/lib/mock-data";

const subjects = [
  { name: "Biología", pct: 78, color: "from-violet-500 to-purple-600" },
  { name: "Matemáticas", pct: 65, color: "from-cyan-500 to-blue-600" },
  { name: "Historia", pct: 45, color: "from-amber-500 to-orange-600" },
  { name: "Química", pct: 58, color: "from-pink-500 to-rose-600" },
  { name: "Español", pct: 72, color: "from-emerald-500 to-teal-600" },
];

const achievements = [
  { icon: "🔥", title: "Racha Quincenal", desc: "15 días consecutivos", unlocked: true },
  { icon: "🎯", title: "Primer Simulacro", desc: "Completaste tu primer examen", unlocked: true },
  { icon: "📚", title: "Maratón", desc: "10 lecciones en un día", unlocked: true },
  { icon: "🏆", title: "Top 10%", desc: "Puntaje en top 10% de usuarios", unlocked: false },
  { icon: "⚡", title: "Velocista", desc: "Termina un simulacro en tiempo récord", unlocked: false },
  { icon: "💎", title: "Elite", desc: "Alcanza 90%+ en 3 simulacros", unlocked: false },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"account" | "progress" | "achievements">("account");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <section className="card">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shrink-0">
            {mockUser.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-2xl font-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {mockUser.name}
              </h1>
              <span className="badge badge--violet">{mockUser.plan}</span>
            </div>
            <p className="text-white/50 text-sm">{mockUser.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-amber-400 font-semibold">
                🔥 Racha de {mockUser.streak} días
              </span>
              <span className="text-white/40">
                Examen: {mockUser.exam} · {mockUser.daysToExam} días restantes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["account", "progress", "achievements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? "is-active" : ""}`}
          >
            {tab === "account" && "Mi cuenta"}
            {tab === "progress" && "Progreso"}
            {tab === "achievements" && "Logros"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "account" && (
        <section className="card space-y-5">
          <h2
            className="font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Información de cuenta
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-white/70">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                defaultValue={mockUser.name}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                defaultValue={mockUser.email}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="exam" className="text-sm font-medium text-white/70">
                Examen objetivo
              </label>
              <select
                id="exam"
                defaultValue={mockUser.exam.toLowerCase()}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/80 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none"
              >
                <option value="unam" className="bg-[#110a24]">UNAM — Licenciatura</option>
                <option value="ipn" className="bg-[#110a24]">IPN — Licenciatura</option>
                <option value="uam" className="bg-[#110a24]">UAM — Licenciatura</option>
                <option value="comipems" className="bg-[#110a24]">COMIPEMS — Bachillerato</option>
                <option value="exani" className="bg-[#110a24]">EXANI-II (CENEVAL)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="btn btn--primary">
              Guardar cambios
            </button>
            <button className="btn btn--ghost">
              Cancelar
            </button>
          </div>
        </section>
      )}

      {activeTab === "progress" && (
        <section className="card space-y-6">
          <h2
            className="font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Progreso por materia
          </h2>

          <div className="space-y-5">
            {subjects.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-sm font-bold text-white/70">{s.pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    style={{ width: `${s.pct}%`, transition: "width 0.8s ease" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Score summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            {[
              { label: "Puntuación actual", value: `${mockUser.score}/100`, color: "text-violet-400" },
              { label: "Meta semanal", value: `${mockUser.weeklyGoal}/100`, color: "text-cyan-400" },
              { label: "Días al examen", value: mockUser.daysToExam.toString(), color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className={`text-2xl font-black mb-1 ${s.color}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "achievements" && (
        <section className="space-y-4">
          <h2
            className="font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mis logros
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div
                key={a.title}
                className={`card flex items-center gap-4 ${
                  !a.unlocked ? "opacity-40 grayscale" : ""
                }`}
              >
                <span className="text-3xl shrink-0">{a.icon}</span>
                <div>
                  <p className="font-bold text-sm">{a.title}</p>
                  <p className="text-xs text-white/45">{a.desc}</p>
                  {a.unlocked && (
                    <span className="badge badge--success text-[10px] mt-1">
                      Desbloqueado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
