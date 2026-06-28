import type { Metadata } from 'next';
import { CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const metadata: Metadata = {
  title: 'Suscripciones — Admin',
  description: 'Gestión de suscripciones en CEFI-GO.',
};

const MOCK_SUBS = [
  { id: 'sub_01', user: 'Miguel Ángel Hernández', email: 'miguel.hernandez@example.com', plan: 'pro' as const, status: 'active' as const, started: '2025-10-03', ends: '2026-10-03', amount: 200 },
  { id: 'sub_02', user: 'Sofía Morales Ruiz', email: 'sofia.morales@example.com', plan: 'pro' as const, status: 'active' as const, started: '2025-08-22', ends: '2026-08-22', amount: 200 },
  { id: 'sub_03', user: 'Ana Torres Mendoza', email: 'ana.torres@example.com', plan: 'pro' as const, status: 'active' as const, started: '2025-07-10', ends: '2026-07-10', amount: 200 },
  { id: 'sub_04', user: 'Carlos Jiménez Ramírez', email: 'carlos.jimenez@example.com', plan: 'pro' as const, status: 'canceled' as const, started: '2025-11-01', ends: '2025-12-01', amount: 200 },
  { id: 'sub_05', user: 'Valentina Reyes', email: 'valentina.reyes@example.com', plan: 'pro' as const, status: 'past_due' as const, started: '2025-09-15', ends: '2025-12-15', amount: 200 },
];

const STATUS_ICON: Record<string, React.ReactNode> = {
  active:   <CheckCircle2 size={14} className="text-emerald-400" />,
  canceled: <XCircle size={14} className="text-red-400" />,
  past_due: <Clock size={14} className="text-amber-400" />,
};

export default function AdminSubscriptionsPage() {
  const active = MOCK_SUBS.filter(s => s.status === 'active').length;
  const monthlyRevenue = MOCK_SUBS.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-display">Suscripciones</h1>
        <p className="text-slate-400 mt-1">Gestiona las suscripciones Pro de la plataforma.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">{active}</p>
            <p className="text-xs text-slate-500">Activas</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <CreditCard size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">${monthlyRevenue.toLocaleString('es-MX')}</p>
            <p className="text-xs text-slate-500">MRR (MXN)</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <XCircle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">{MOCK_SUBS.filter(s => s.status === 'canceled').length}</p>
            <p className="text-xs text-slate-500">Canceladas</p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Usuario', 'Plan', 'Estado', 'Inicio', 'Vencimiento', 'Monto', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_SUBS.map(sub => (
                <tr key={sub.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-medium">{sub.user}</p>
                    <p className="text-xs text-slate-500">{sub.email}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge variant={sub.plan} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICON[sub.status]}
                      <StatusBadge variant={sub.status} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{sub.started}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{sub.ends}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">${sub.amount} MXN</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs px-2.5 py-1.5 rounded-lg glass border border-white/10 text-slate-400 hover:text-white transition-colors">
                        Extender
                      </button>
                      {sub.status === 'active' && (
                        <button className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
