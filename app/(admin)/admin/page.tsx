import { adminStats, mockPayments } from "@/lib/mock-data";

const pendingPayments = mockPayments.filter((p) => p.status === "pendiente");

export default function AdminDashboard() {
  const pendingRevenue = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const stats = [
    {
      label: "Alumnos registrados",
      value: adminStats.totalStudents,
      change: "+12 esta semana",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Suscripciones activas",
      value: adminStats.activeSubscriptions,
      change: "76% del total",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Pagos pendientes",
      value: adminStats.pendingPayments,
      change: "Requieren revisión",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      label: "Lecciones publicadas",
      value: adminStats.totalLessons,
      change: `${adminStats.totalExams} examen · ${adminStats.totalResources} recursos`,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  const planStats = [
    { plan: "Anual",     count: 87,  color: "bg-amber-500" },
    { plan: "Semestral", count: 64,  color: "bg-violet-500" },
    { plan: "Mensual",   count: 38,  color: "bg-sky-500" },
    { plan: "Gratuito",  count: 58,  color: "bg-white/20" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Panel de administración CEFIGO — visión general del sistema
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`card border ${s.bg} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>
                {s.value}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">{s.label}</p>
              <p className="text-[11px] text-white/35 mt-0.5">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending payments */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Pagos pendientes
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                ${pendingRevenue.toLocaleString("es-MX")} MXN en espera
              </span>
              <span className="text-xs bg-red-500 text-white font-bold rounded-full px-2 py-0.5">
                {pendingPayments.length}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {pendingPayments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {p.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.studentName}</p>
                  <p className="text-[11px] text-white/35">{p.submittedAt}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-amber-400">${p.amount.toLocaleString("es-MX")}</p>
                  <p className="text-[10px] text-white/35 capitalize">{p.plan}</p>
                </div>
              </div>
            ))}
            {pendingPayments.length > 5 && (
              <p className="text-xs text-white/35 text-center pt-1">
                +{pendingPayments.length - 5} más en cola
              </p>
            )}
          </div>
          <a href="/admin/pagos" className="btn btn--primary text-sm text-center block">
            Revisar pagos →
          </a>
        </div>

        {/* Content summary */}
        <div className="card space-y-4">
          <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
            Contenido publicado
          </h2>
          <div className="space-y-3">
            {[
              { label: "Lecciones en video", count: adminStats.totalLessons,    href: "/admin/lecciones", color: "bg-violet-500" },
              { label: "Exámenes",           count: adminStats.totalExams,      href: "/admin/examenes",  color: "bg-blue-500" },
              { label: "Recursos de estudio",count: adminStats.totalResources,  href: "/admin/recursos",  color: "bg-emerald-500" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-3 py-2 hover:bg-white/3 rounded-lg px-2 transition-colors group">
                <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <span className="flex-1 text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                <span className="text-sm font-bold text-white/60">{item.count}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Distribución por plan</p>
            {planStats.map((item) => (
              <div key={item.plan} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-white/50 w-20">{item.plan}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / adminStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white/50 w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
