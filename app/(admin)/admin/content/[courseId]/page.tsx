import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, Edit, GripVertical, Trash2 } from 'lucide-react';
import { MOCK_COURSES, MOCK_MODULES, MOCK_LESSONS } from '@/lib/mock-data/courses';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = MOCK_COURSES.find(c => c.id === courseId);
  return { title: course ? `Editar ${course.title} — Admin` : 'Curso no encontrado' };
}

export default async function AdminCourseEditorPage({ params }: Props) {
  const { courseId } = await params;
  const course = MOCK_COURSES.find(c => c.id === courseId);
  if (!course) notFound();

  const modules = MOCK_MODULES.filter(m => m.course_id === courseId);
  const modulesWithLessons = modules.map(mod => ({
    ...mod,
    lessons: MOCK_LESSONS.filter(l => l.module_id === mod.id),
  }));

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/admin/content" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
        <ChevronLeft size={16} /> Volver a contenido
      </Link>

      {/* Course info editor */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `linear-gradient(135deg, ${course.color_from}33, ${course.color_to}33)` }}>
            {course.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white font-display">{course.title}</h1>
            <p className="text-xs text-slate-500">ID: {course.id} · /{course.slug}</p>
          </div>
          <StatusBadge variant={course.is_pro ? 'pro' : 'gratis'} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Título</label>
            <input defaultValue={course.title} className="w-full px-3 py-2 rounded-lg glass text-sm text-slate-200 border border-white/10 outline-none focus:border-violet-500/50 transition" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Slug (URL)</label>
            <input defaultValue={course.slug} className="w-full px-3 py-2 rounded-lg glass text-sm text-slate-200 border border-white/10 outline-none focus:border-violet-500/50 transition" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1.5">Descripción</label>
            <textarea defaultValue={course.description} rows={2} className="w-full px-3 py-2 rounded-lg glass text-sm text-slate-200 border border-white/10 outline-none focus:border-violet-500/50 transition resize-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Nivel</label>
            <select defaultValue={course.level} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 border border-white/10 outline-none" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Acceso</label>
            <select defaultValue={course.is_pro ? 'pro' : 'gratis'} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 border border-white/10 outline-none" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <option value="gratis">Gratis</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Módulos y lecciones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white font-display">Módulos y lecciones</h2>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-xs text-slate-400 hover:text-white transition-colors">
            <Plus size={14} /> Nuevo módulo
          </button>
        </div>

        {modulesWithLessons.map((mod, mi) => (
          <div key={mod.id} className="glass rounded-2xl overflow-hidden">
            {/* Module header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <GripVertical size={16} className="text-slate-600 cursor-grab" />
              <span className="w-6 h-6 rounded bg-violet-500/20 text-violet-300 text-xs font-bold flex items-center justify-center">{mi + 1}</span>
              <span className="flex-1 text-sm font-medium text-white">{mod.title}</span>
              {mod.is_pro && <StatusBadge variant="pro" />}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors" aria-label="Editar módulo">
                  <Edit size={13} />
                </button>
                <button className="p-1.5 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors" aria-label="Eliminar módulo">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-white/5">
              {mod.lessons.map((lesson, li) => (
                <div key={lesson.id} className="flex items-center gap-3 px-6 py-2.5">
                  <GripVertical size={14} className="text-slate-700 cursor-grab shrink-0" />
                  <span className="text-xs text-slate-600 w-4">{li + 1}</span>
                  <span className="flex-1 text-sm text-slate-300 truncate">{lesson.title}</span>
                  <span className="text-xs text-slate-600">{lesson.duration_minutes}m</span>
                  {lesson.has_quiz && <span className="text-xs text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">Quiz</span>}
                  {lesson.is_pro && <StatusBadge variant="pro" />}
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-white/10 text-slate-600 hover:text-slate-300 transition-colors" aria-label="Editar lección">
                      <Edit size={12} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-red-500/10 text-slate-700 hover:text-red-400 transition-colors" aria-label="Eliminar lección">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              <button className="flex items-center gap-2 px-6 py-2.5 w-full text-xs text-slate-600 hover:text-violet-400 hover:bg-violet-500/5 transition-colors">
                <Plus size={12} /> Agregar lección
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
