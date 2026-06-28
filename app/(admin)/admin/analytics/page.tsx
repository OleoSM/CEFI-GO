import type { Metadata } from 'next';
import { TrendingUp, Users, CreditCard, ArrowUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_ADMIN_METRICS, MOCK_ADMIN_MONTHLY_USERS } from '@/lib/mock-data/analytics';

export const metadata: Metadata = {
  title: 'Analítica — Admin',
  description: 'Métricas de negocio de CEFI-GO.',
};

const CHURN_MONTHLY = [
  { month: 'Jun', rate: 5.2 },
  { month: 'Jul', rate: 4.8 },
  { month: 'Ago', rate: 4.1 },
  { month: 'Sep', rate: 3.9 },
  { month: 'Oct', rate: 3.5 },
  { month: 'Nov', rate: 3.2 },
];

const REVENUE_MONTHLY = [
  { month: 'Jun', revenue: 24000 },
  { month: 'Jul', revenue: 49000 },
  { month: 'Ago', revenue: 65000 },
  { month: 'Sep', revenue: 71200 },
  { month: 'Oct', revenue: 79800 },
  { month: 'Nov', revenue: 87600 },
];

const TOP_COURSES = [
  { name: 'Matemáticas', views: 4820, pct: 100 },
  { name: 'Español', views: 3910, pct: 81 },
  { name: 'Ciencias', views: 2640, pct: 55 },
  { name: 'Historia', views: 1890, pct: 39 },
  { name: 'Geografía', views: 1240, pct: 26 },
];

export default function AdminAnalyticsPage() {
  const m = MOCK_ADMIN_METRICS;
  const maxRevenue = Math.max(...REVENUE_MONTHLY.map(d => d.revenue));
  const maxUsers = Math.max(...MOCK_ADMIN_MONTHLY_USERS.map(d => d.users));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white font-display">Analítica de negocio</h1>
        <p className="text-slate-400 mt-1">Métricas y tendencias de la plataforma.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Usuarios totales" value={m.total_users.toLocaleString('es-MX')} icon={<Users size={18} style={{ color: '#A78BFA' }} />} accentColor="#A78BFA" trend={{ value: 13, label: 'este mes' }} />
        <StatCard title="Suscripciones Pro" value={m.active_subscriptions} icon={<CreditCard size={18} style={{ color: '#EC4899' }} />} accentColor="#EC4899" trend={{ value: 8, label: 'vs mes anterior' }} />
        <StatCard title="MRR" value={`$${(m.monthly_revenue / 1000).toFixed(0)}k`} icon={<TrendingUp size={18} style={{ color: '#10B981' }} />} accentColor="#10B981" subtitle="MXN" trend={{ value: 21, label: 'vs mes anterior' }} />
        <StatCard title="Churn rate" value={`${m.churn_rate}%`} icon={<ArrowUp size={18} style={{ color: '#F97316' }} />} accentColor="#F97316" subtitle="Meta: < 3.0%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ingresos mensuales */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white font-display mb-5">Ingresos mensuales (MXN)</h2>
          <div className="flex items-end gap-2 h-36">
            {REVENUE_MONTHLY.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-slate-600">${(d.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full rounded-t-lg" style={{
                  height: `${(d.revenue / maxRevenue) * 80}%`,
                  background: 'linear-gradient(to top, #10B981, #34D399)',
                  minHeight: 6,
                }} />
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 mt-3 border-t border-white/10 flex items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500">Total 2025</p>
              <p className="text-white font-semibold">${REVENUE_MONTHLY.reduce((s, d) => s + d.revenue, 0).toLocaleString('es-MX')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Crecimiento</p>
              <p className="text-emerald-400 font-semibold">+265% YoY</p>
            </div>
          </div>
        </div>

        {/* Crecimiento de usuarios */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white font-display mb-5">Crecimiento de usuarios</h2>
          <div className="flex items-end gap-2 h-36">
            {MOCK_ADMIN_MONTHLY_USERS.slice(-6).map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-slate-600">{(d.users / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-lg" style={{
                  height: `${(d.users / maxUsers) * 80}%`,
                  background: 'linear-gradient(to top, #7C3AED, #A78BFA)',
                  minHeight: 6,
                }} />
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Churn */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white font-display mb-5">Churn mensual (%)</h2>
          <div className="space-y-3">
            {CHURN_MONTHLY.map(d => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-8">{d.month}</span>
                <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${(d.rate / 6) * 100}%`,
                    background: d.rate > 4 ? '#EF4444' : d.rate > 3.5 ? '#F59E0B' : '#10B981',
                  }} />
                </div>
                <span className="text-xs font-medium text-white w-8 text-right">{d.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top materias */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white font-display mb-5">Materias más visitadas</h2>
          <div className="space-y-4">
            {TOP_COURSES.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                    <span className="text-sm text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{c.views.toLocaleString('es-MX')} vistas</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
