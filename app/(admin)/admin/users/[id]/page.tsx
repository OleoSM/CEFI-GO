import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Mail, Target, Flame, Clock, BookOpen, Shield } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MOCK_USERS } from '@/lib/mock-data/users';
import { MOCK_USER_PROGRESS } from '@/lib/mock-data/courses';
import { MOCK_EXAM_ATTEMPTS } from '@/lib/mock-data/exams';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = MOCK_USERS.find(u => u.id === id);
  if (!user) return { title: 'Usuario no encontrado' };
  return { title: `${user.full_name} — Admin` };
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = MOCK_USERS.find(u => u.id === id);
  if (!user) notFound();

  const progress = MOCK_USER_PROGRESS.filter(p => p.user_id === id);
  const attempts = MOCK_EXAM_ATTEMPTS.filter(a => a.user_id === id);
  const totalHours = Math.round(user.total_study_minutes / 60);
  const initials = user.full_name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <div className="max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <Link href="/admin/users" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
        <ChevronLeft size={16} /> Volver a usuarios
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-display shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white font-display">{user.full_name}</h1>
              <StatusBadge variant={user.plan} />
              <StatusBadge variant={user.is_active ? 'active' : 'inactive'} />
              {user.role === 'admin' && (
                <span className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-400">
              <Mail size={14} /> {user.email}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
              <Target size={14} /> Objetivo: <span className="text-white font-medium">{user.university_target}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Registrado el {new Date(user.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Racha', value: `${user.study_streak}d`, icon: <Flame size={14} style={{ color: '#F97316' }} /> },
          { label: 'Horas', value: `${totalHours}h`, icon: <Clock size={14} style={{ color: '#A78BFA' }} /> },
          { label: 'Simulacros', value: attempts.length, icon: <BookOpen size={14} style={{ color: '#10B981' }} /> },
          { label: 'Cursos activos', value: progress.filter(p => p.completed_lessons > 0).length, icon: <BookOpen size={14} style={{ color: '#EC4899' }} /> },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-white font-display">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progreso */}
      {progress.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white font-display mb-4">Progreso en materias</h2>
          <div className="space-y-4">
            {progress.map(p => {
              const courseNames: Record<string, string> = { crs_matematicas: 'Matemáticas', crs_espanol: 'Español', crs_ciencias: 'Ciencias' };
              return (
                <div key={p.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{courseNames[p.course_id] ?? p.course_id}</span>
                    <span className="text-sm text-violet-300">{p.progress_pct}%</span>
                  </div>
                  <ProgressBar value={p.progress_pct} size="sm" color="violet" />
                  <p className="text-xs text-slate-600 mt-1">{p.completed_lessons} / {p.total_lessons} lecciones</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simulacros */}
      {attempts.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white font-display mb-4">Historial de simulacros</h2>
          <div className="space-y-3">
            {attempts.map(a => {
              const isPass = (a.score ?? 0) >= 60;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8">
                  <div>
                    <p className="text-sm text-white font-medium">Simulacro — {a.exam_id === 'exm_mat_01' ? 'Matemáticas básico' : 'Español'}</p>
                    <p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString('es-MX')}</p>
                  </div>
                  <span className="text-lg font-bold font-display" style={{ color: isPass ? '#10B981' : '#EF4444' }}>{a.score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Acciones admin */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white font-display mb-4">Acciones administrativas</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            Cambiar a Pro
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors">
            {user.is_active ? 'Suspender cuenta' : 'Reactivar cuenta'}
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors">
            Cambiar rol
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
