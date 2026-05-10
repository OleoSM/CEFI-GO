import Link from "next/link";
import { mockExams } from "@/lib/mock-data";

const availableExams = [
  {
    id: "unam-2024",
    title: "Simulacro UNAM · Área 2",
    questions: 120,
    minutes: 150,
    subject: "Múltiples materias",
    difficulty: "Alto",
    difficultyColor: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    id: "unam-bio",
    title: "Mini-test · Biología celular",
    questions: 20,
    minutes: 25,
    subject: "Biología",
    difficulty: "Medio",
    difficultyColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "unam-math",
    title: "Mini-test · Matemáticas",
    questions: 15,
    minutes: 20,
    subject: "Matemáticas",
    difficulty: "Medio",
    difficultyColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "diagnostico-2",
    title: "Diagnóstico completo",
    questions: 60,
    minutes: 75,
    subject: "Diagnóstico",
    difficulty: "Adaptativo",
    difficultyColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
];

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export default function ExamListPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulacros
          </h1>
          <p className="text-sm text-white/45 mt-1">
            Pon a prueba tu conocimiento antes del examen real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 uppercase tracking-wider">
            Disponible
          </span>
          <Link href="/exam/unam-2024" className="btn btn--primary">
            Nuevo simulacro
          </Link>
        </div>
      </header>

      {/* Available exams */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Simulacros disponibles
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {availableExams.map((exam) => (
            <div key={exam.id} className="card flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-sm leading-snug">{exam.title}</h3>
                <span
                  className={`shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${exam.difficultyColor}`}
                >
                  {exam.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>📋 {exam.questions} reactivos</span>
                <span>⏱ {exam.minutes} min</span>
                <span>📚 {exam.subject}</span>
              </div>

              <Link
                href={`/exam/${exam.id}`}
                className="btn btn--primary text-sm text-center mt-auto"
              >
                Iniciar simulacro
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mi historial
        </h2>
        <div className="card divide-y divide-white/5">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            <span>Simulacro</span>
            <span className="text-right">Reactivos</span>
            <span className="text-right">Score</span>
            <span className="text-right">Acción</span>
          </div>

          {mockExams.map((exam) => (
            <div
              key={exam.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-3"
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
              <Link
                href={`/exam/${exam.id}`}
                className="btn btn--ghost text-xs px-3 py-1.5"
              >
                Ver
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
