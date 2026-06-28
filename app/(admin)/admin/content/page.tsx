import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MOCK_COURSES } from '@/lib/mock-data/courses';

export const metadata: Metadata = {
  title: 'Contenido — Admin',
  description: 'Gestión de contenido educativo en CEFI-GO.',
};

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Contenido</h1>
          <p className="text-slate-400 mt-1">Gestiona cursos, módulos y lecciones.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
        >
          <Plus size={16} /> Nuevo curso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white font-display">{MOCK_COURSES.length}</p>
          <p className="text-xs text-slate-500">Materias</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white font-display">10</p>
          <p className="text-xs text-slate-500">Módulos</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white font-display">8</p>
          <p className="text-xs text-slate-500">Lecciones</p>
        </div>
      </div>

      {/* Cursos */}
      <div className="space-y-3">
        {MOCK_COURSES.map(course => (
          <div key={course.id} className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${course.color_from}33, ${course.color_to}33)` }}>
              {course.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-white">{course.title}</h3>
                {course.is_pro && <StatusBadge variant="pro" />}
                <span className="text-xs text-slate-500 capitalize">{course.level}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                <span>{course.total_lessons} lecciones</span>
                <span>·</span>
                <span>{course.estimated_hours}h</span>
                <span>·</span>
                <span>Slug: /{course.slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/content/${course.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-white/10 text-xs text-slate-400 hover:text-white transition-colors">
                <Edit size={12} /> Editar
              </Link>
              <button className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors" aria-label="Eliminar curso">
                <Trash2 size={14} />
              </button>
              <Link href={`/admin/content/${course.id}`} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors" aria-label="Ver detalle">
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
