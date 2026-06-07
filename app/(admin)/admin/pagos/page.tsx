"use client";

import { useState } from "react";
import { mockPayments, planLabels, planColors } from "@/lib/mock-data";
import type { MockPayment } from "@/lib/mock-data";

type Filter = "pendiente" | "aprobado" | "rechazado" | "todos";

const STATUS_BADGE: Record<string, string> = {
  pendiente: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  aprobado:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  rechazado: "text-red-400 bg-red-500/10 border-red-500/20",
};
const STATUS_LABEL: Record<string, string> = { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado" };

export default function AdminPagosPage() {
  const [payments, setPayments] = useState<MockPayment[]>(mockPayments);
  const [filter, setFilter] = useState<Filter>("pendiente");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const pendingCount = payments.filter((p) => p.status === "pendiente").length;
  const totalPendingRevenue = payments.filter((p) => p.status === "pendiente").reduce((acc, p) => acc + p.amount, 0);

  const filtered = filter === "todos" ? payments : payments.filter((p) => p.status === filter);

  function approve(id: string) {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "aprobado" as const, notes: notes[id] ?? "Comprobante verificado" } : p));
  }
  function reject(id: string) {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "rechazado" as const, notes: notes[id] ?? "Comprobante no válido" } : p));
  }

  const filterOptions: { key: Filter; label: string }[] = [
    { key: "pendiente", label: "Pendientes" },
    { key: "aprobado",  label: "Aprobados" },
    { key: "rechazado", label: "Rechazados" },
    { key: "todos",     label: "Todos" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>Pagos por transferencia</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {pendingCount > 0
              ? `${pendingCount} comprobante${pendingCount > 1 ? "s" : ""} esperando revisión · $${totalPendingRevenue.toLocaleString("es-MX")} MXN en espera`
              : "No hay pagos pendientes ✓"}
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="text-sm font-bold text-white bg-red-500 rounded-full px-3 py-1">
            {pendingCount} pendiente{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {filterOptions.map(({ key, label }) => {
          const count = key === "todos" ? payments.length : payments.filter((p) => p.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === key ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {label}
              <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${filter === key ? "bg-white/20" : "bg-white/8 text-white/35"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Payment cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-sm">No hay pagos en esta categoría.</p>
          </div>
        )}
        {filtered.map((payment) => (
          <div key={payment.id} className={`card border ${payment.status === "pendiente" ? "border-amber-500/15" : "border-white/6"}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {payment.studentName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-bold text-sm">{payment.studentName}</p>
                  <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${STATUS_BADGE[payment.status]}`}>
                    {STATUS_LABEL[payment.status]}
                  </span>
                </div>
                <p className="text-xs text-white/40">{payment.studentEmail}</p>
                <p className="text-xs text-white/30 mt-1">{payment.submittedAt}</p>
                {payment.notes && payment.status !== "pendiente" && (
                  <p className="text-xs text-white/35 italic mt-1">&ldquo;{payment.notes}&rdquo;</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-amber-400" style={{ fontFamily: "var(--font-display)" }}>
                  ${payment.amount.toLocaleString("es-MX")}
                </p>
                <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${planColors[payment.plan]}`}>
                  {planLabels[payment.plan]}
                </span>
              </div>
            </div>
            {payment.status === "pendiente" && (
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nota (opcional)…"
                  value={notes[payment.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [payment.id]: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
                />
                <button
                  onClick={() => reject(payment.id)}
                  className="text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-lg px-4 py-2 transition-all"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => approve(payment.id)}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-4 py-2 transition-all"
                >
                  Aprobar acceso
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
