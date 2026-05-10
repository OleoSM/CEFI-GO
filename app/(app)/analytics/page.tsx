import { mockExams } from "@/lib/mock-data";

const stats = [
  { label: "Lecciones completadas", value: "48", icon: "📚", color: "text-violet-400" },
  { label: "Simulacros realizados", value: "12", icon: "🎯", color: "text-pink-400" },
  { label: "Horas de estudio", value: "42h", icon: "⏱️", color: "text-cyan-400" },
  { label: "Racha actual", value: "14 días", icon: "🔥", color: "text-amber-400" },
];

const subjects = [
  { name: "Biología", pct: 78, color: "bg-violet-500" },
  { name: "Matemáticas", pct: 65, color: "bg-cyan-500" },
  { name: "Historia", pct: 45, color: "bg-amber-500" },
  { name: "Química", pct: 58, color: "bg-pink-500" },
  { name: "Español", pct: 72, color: "bg-emerald-500" },
  { name: "Física", pct: 51, color: "bg-blue-500" },
];

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

// 30-day activity grid — some days active, some not
const activityDays = Array.from({ length: 30 }, (_, i) => {
  const active = [0, 1, 2, 4, 5, 7, 8, 9, 11, 13, 14, 15, 16, 18, 20, 21, 22, 23, 25, 26, 27, 28, 29].includes(i);
  const high = [1, 5, 8, 14, 16, 22, 26, 29].includes(i);
  return { day: i + 1, active, high };
});

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <h1
          className="text-3xl font-black gradient-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mi analítica
        </h1>
        <p className="text-sm text-white/45 mt-1">
          Visualiza tu progreso y detecta áreas de oportunidad
        </p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p
              className={`text-2xl font-black mb-1 ${stat.color}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-white/45">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Progress by subject */}
      <section>
        <h2
          className="text-lg font-black mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Progreso por materia
        </h2>
        <div className="card space-y-5">
          {subjects.map((subject) => (
            <div key={subject.name}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">{subject.name}</span>
                <span className="font-bold text-white/70">{subject.pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${subject.color} transition-all`}
                  style={{ width: `${subject.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exam history table */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Evolución de simulacros
        </h2>
        <div className="card divide-y divide-white/5">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            <span>Simulacro</span>
            <span className="text-right">Reactivos</span>
            <span className="text-right">Score</span>
          </div>
          {mockExams.map((exam) => (
            <div
              key={exam.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3"
            >
              <div>
                <p className="text-sm font-semibold">{exam.title}</p>
                <p className="text-xs text-white/40">{exam.date}</p>
              </div>
              <span className="text-sm text-white/55 text-right">
                {exam.correct}/{exam.total}
              </span>
              <span
                className={`text-lg font-black text-right ${scoreColor(exam.score)}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {exam.score}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Activity streak grid */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Racha de actividad — últimos 30 días
        </h2>
        <div className="card">
          <div className="grid grid-cols-10 gap-2">
            {activityDays.map(({ day, active, high }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg transition-colors ${
                    !active
                      ? "bg-white/5 border border-white/8"
                      : high
                      ? "bg-violet-500/70 border border-violet-400/50"
                      : "bg-emerald-500/40 border border-emerald-500/30"
                  }`}
                  title={`Día ${day}${active ? " — estudiaste" : ""}`}
                />
                <span className="text-[9px] text-white/25">{day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/8" />
              Sin actividad
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/30" />
              Activo
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-violet-500/70 border border-violet-400/50" />
              Día intenso
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
