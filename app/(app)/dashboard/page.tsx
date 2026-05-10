import Link from "next/link";
import { mockUser, mockCourses, mockExams } from "@/lib/mock-data";

function ScoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <section className="card bg-gradient-to-r from-violet-900/40 to-pink-900/20 border-violet-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg font-black text-white">
                {mockUser.initials}
              </div>
              <div>
                <p className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>
                  ¡Hola, {mockUser.name.split(" ")[0]}! 👋
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-400 font-semibold">
                    🔥 Racha de {mockUser.streak} días
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-sm text-white/50">
                    {mockUser.daysToExam} días para tu examen
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/55 mt-2">
              Continúas en{" "}
              <strong className="text-white">{mockCourses[0].module}</strong>{" "}
              — {mockCourses[0].lesson}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href={`/courses/${mockCourses[0].slug}`}
              className="btn btn--primary"
            >
              Continuar lección
            </Link>
            <Link href="/exam/unam-2024" className="btn btn--ghost">
              Hacer simulacro
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Lecciones completadas", value: "48", icon: "📚", color: "text-violet-400" },
            { label: "Simulacros realizados", value: "12", icon: "🎯", color: "text-pink-400" },
            { label: "Tiempo de estudio", value: "42h", icon: "⏱️", color: "text-cyan-400" },
            { label: "Racha actual", value: `${mockUser.streak} días`, icon: "🔥", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className={`text-2xl font-black mb-1 ${stat.color}`} style={{ fontFamily: "var(--font-display)" }}>
                {stat.value}
              </p>
              <p className="text-xs text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continuar aprendiendo */}
          <div>
            <h2
              className="text-lg font-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Continuar aprendiendo
            </h2>
            <div className="space-y-3">
              {mockCourses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="card flex items-center gap-4 hover:border-violet-500/30 transition-all block"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white text-xl shrink-0`}
                  >
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-0.5 truncate">{course.lesson}</p>
                    <p className="text-xs text-white/40 mb-2">
                      {course.module} · Lec {course.lessonNum}/{course.lessonTotal} · {course.remainingMin} min restantes
                    </p>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-violet-400 shrink-0">{course.progress}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Últimos simulacros */}
          <div>
            <h2
              className="text-lg font-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Últimos simulacros
            </h2>
            <div className="card divide-y divide-white/5">
              {mockExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{exam.title}</p>
                    <p className="text-xs text-white/40">{exam.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-black ${ScoreColor(exam.score)}`}>
                      {exam.score}%
                    </p>
                    <p className="text-xs text-white/40">
                      {exam.correct}/{exam.total}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-5">
          {/* Próximas clases */}
          <div className="card">
            <h3
              className="font-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Próximas clases en vivo
            </h3>
            <div className="space-y-3">
              {[
                { time: "Hoy · 6:00 pm", title: "Simulacro UNAM · Área 2", tag: "Simulacro" },
                { time: "Mañana · 5:00 pm", title: "Química orgánica — Ciclos", tag: "Clase" },
                { time: "Jue · 7:00 pm", title: "Mentoría grupal · Álgebra", tag: "Mentoría" },
              ].map((cls) => (
                <div key={cls.title} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-xs text-white/40">{cls.time}</p>
                    <p className="text-sm font-medium">{cls.title}</p>
                    <span className="badge badge--violet text-[10px]">{cls.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logro desbloqueado */}
          <div className="card border-amber-500/20 bg-amber-500/5">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-bold text-amber-400 text-sm mb-1">¡Logro desbloqueado!</p>
            <p className="font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Racha Quincenal
            </p>
            <p className="text-xs text-white/45">
              Estudiaste 15 días consecutivos. ¡Eres imparable!
            </p>
          </div>

          {/* Mentor */}
          <div className="card">
            <h3
              className="font-black mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tu mentor
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-lg font-black text-white shrink-0">
                JS
              </div>
              <div>
                <p className="font-bold text-sm">Javier Silva</p>
                <p className="text-xs text-white/40">Ing. Industrial · UNAM 2023</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z" />
                    </svg>
                  ))}
                  <span className="text-xs text-white/40 ml-1">4.9</span>
                </div>
              </div>
            </div>
            <Link href="/mentors" className="btn btn--ghost btn--full text-sm">
              Agendar sesión
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
