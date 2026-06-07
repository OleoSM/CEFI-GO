"use client";

import { useState } from "react";
import { mockStudents, planLabels, planColors } from "@/lib/mock-data";

export default function AdminUsuariosPage() {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.exam.toLowerCase().includes(search.toLowerCase())
  );

  const planOrder = ["anual", "semestral", "mensual", "gratuito"] as const;
  const planStats = planOrder.map((plan) => ({
    plan,
    count: mockStudents.filter((s) => s.plan === plan).length,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>Usuarios</h1>
        <p className="text-sm text-white/40 mt-0.5">{mockStudents.length} alumnos registrados</p>
      </header>

      {/* Plan distribution */}
      <div className="grid grid-cols-4 gap-3">
        {planStats.map(({ plan, count }) => {
          const parts = planColors[plan]?.split(" ") ?? [];
          const textColor = parts[0] ?? "text-white/50";
          const bgBorder = parts.slice(1).join(" ") ?? "bg-white/5 border-white/10";
          return (
            <div key={plan} className={`card border text-center py-3 ${bgBorder}`}>
              <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>{count}</p>
              <p className={`text-xs font-bold capitalize ${textColor}`}>{planLabels[plan]}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Buscar por nombre, correo o examen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Alumno</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Examen</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Plan</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">Progreso</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">Última actividad</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-xs text-white/35 truncate">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 hidden md:table-cell">
                  <span className="text-xs text-white/50">{student.exam}</span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${planColors[student.plan]}`}>
                    {planLabels[student.plan]}
                  </span>
                </td>
                <td className="py-3 px-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${student.progress >= 70 ? "bg-emerald-500" : student.progress >= 30 ? "bg-amber-500" : "bg-white/20"}`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/40">{student.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 hidden sm:table-cell">
                  <span className="text-xs text-white/40">{student.lastActivity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-white/30">
            <p className="text-sm">No se encontraron alumnos con ese criterio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
