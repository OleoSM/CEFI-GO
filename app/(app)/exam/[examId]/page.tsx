"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { unamExam, examQuestions } from "@/lib/mock-data";
import type { ExamQuestion } from "@/lib/mock-data";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default function ExamPage({ params }: PageProps) {
  const { examId } = use(params);

  const isNewExam = examId === unamExam.id;
  const questions: ExamQuestion[] = isNewExam
    ? unamExam.questions
    : examQuestions.map((q, i) => ({
        id: String(i),
        subject: "General",
        text: q.text,
        options: q.options,
        correctIndex: q.correct,
        explanation: "",
      }));

  const examTitle = isNewExam ? unamExam.title : "Simulacro UNAM · Área 2";
  const totalSeconds = isNewExam ? unamExam.timeMinutes * 60 : 2 * 60 * 60 + 30 * 60;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setTimeLeft(totalSeconds);
    setAnswers({});
    setMarked(new Set());
    setCurrent(0);
    setFinished(false);
  }, [examId]); // reset all state when exam changes

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished]);

  const question = questions[current];
  const totalQ = questions.length;
  const answered = Object.keys(answers).length;

  function selectAnswer(optIndex: number) {
    setAnswers((prev) => ({ ...prev, [current]: optIndex }));
  }

  function toggleMark() {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current); else next.add(current);
      return next;
    });
  }

  if (finished) {
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const pct = Math.round((correct / totalQ) * 100);
    const passed = pct >= (isNewExam ? unamExam.passingScore : 70);

    const subjects = [...new Set(questions.map((q) => q.subject))];
    const subjectStats = subjects.map((subj) => {
      const qs = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.subject === subj);
      const cor = qs.filter(({ q, i }) => answers[i] === q.correctIndex).length;
      return { subj, total: qs.length, correct: cor, pct: Math.round((cor / qs.length) * 100) };
    });

    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center text-5xl mb-3">{passed ? "🎉" : "📚"}</div>
          <h1 className="text-4xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
            {passed ? "¡Aprobado!" : "Sigue practicando"}
          </h1>
          <p className="text-white/50 text-sm">{examTitle}</p>
        </div>

        <div className="card text-center">
          <p className="text-6xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>
            <span className={pct >= 70 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}>
              {pct}%
            </span>
          </p>
          <p className="text-white/60">{correct} correctas de {totalQ} reactivos</p>
          {isNewExam && (
            <p className="text-xs text-white/35 mt-1">
              Aprobatorio: {unamExam.passingScore}% · {unamExam.area} — {unamExam.year}
            </p>
          )}
        </div>

        {isNewExam && (
          <div className="card space-y-3">
            <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Resultados por materia
            </h2>
            {subjectStats.map((s) => (
              <div key={s.subj}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-white/75">{s.subj}</span>
                  <span className={`font-bold ${s.pct >= 70 ? "text-emerald-400" : s.pct >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {s.correct}/{s.total} · {s.pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.pct >= 70 ? "bg-emerald-500" : s.pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card space-y-4">
          <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
            Revisión de respuestas
          </h2>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className="border-t border-white/5 pt-4 first:border-0 first:pt-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {isCorrect
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white/40 mb-0.5">{q.subject} · Pregunta {i + 1}</p>
                    <p className="text-sm text-white/80 leading-snug">{q.text}</p>
                  </div>
                </div>
                {!isCorrect && (
                  <div className="ml-7 space-y-1 text-xs">
                    {userAnswer !== undefined && (
                      <p className="text-red-400">Tu respuesta: {q.options[userAnswer]}</p>
                    )}
                    <p className="text-emerald-400">Correcta: {q.options[q.correctIndex]}</p>
                    {q.explanation && (
                      <p className="text-white/40 leading-relaxed mt-1">{q.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setFinished(false); setAnswers({}); setMarked(new Set()); setCurrent(0); setTimeLeft(totalSeconds); }}
            className="btn btn--ghost"
          >
            Repetir simulacro
          </button>
          <Link href="/courses/unam" className="btn btn--primary">
            Volver al curso
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
            {examTitle}
          </h1>
          <p className="text-sm text-white/45">
            {answered}/{totalQ} respondidas
            {isNewExam && <span className="ml-2 text-white/30">· {question.subject}</span>}
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border ${timeLeft < 300 ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-white"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatTime(timeLeft)}
        </div>

        <button onClick={() => setFinished(true)} className="btn btn--primary">Terminar</button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="badge badge--violet">Pregunta {current + 1} de {totalQ}</span>
                {isNewExam && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 rounded-full px-2.5 py-0.5 border border-white/8">
                    {question.subject}
                  </span>
                )}
              </div>
              <button
                onClick={toggleMark}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${marked.has(current) ? "text-amber-400" : "text-white/40 hover:text-amber-400"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={marked.has(current) ? "#F59E0B" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {marked.has(current) ? "Marcada" : "Marcar"}
              </button>
            </div>

            <p className="text-base leading-relaxed font-medium mb-8">{question.text}</p>

            <fieldset>
              <legend className="sr-only">Selecciona una respuesta</legend>
              <div className="space-y-3">
                {question.options.map((opt, i) => {
                  const isSelected = answers[current] === i;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-violet-500/15 border-violet-500/40 text-white"
                          : "bg-white/3 border-white/8 text-white/70 hover:bg-white/6 hover:border-white/15"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors ${isSelected ? "bg-violet-500 border-violet-400 text-white" : "border-white/20 text-white/40"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input type="radio" name="answer" value={i} checked={isSelected} onChange={() => selectAnswer(i)} className="sr-only" />
                      <span className="text-sm leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn btn--ghost disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Anterior
            </button>
            <span className="text-sm text-white/40">{current + 1} / {totalQ}</span>
            <button onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))} disabled={current === totalQ - 1} className="btn btn--ghost disabled:opacity-30">
              Siguiente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h2 className="font-black mb-4 text-sm" style={{ fontFamily: "var(--font-display)" }}>Mapa de preguntas</h2>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((_, i) => {
                const isCurrent = i === current;
                const isAnswered = i in answers;
                const isMarked = marked.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white scale-110 shadow-lg"
                        : isMarked
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : isAnswered
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/6 text-white/40 border border-white/8 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { color: "bg-gradient-to-br from-violet-500 to-pink-500", label: "Pregunta actual" },
                { color: "bg-emerald-500/20 border border-emerald-500/30", label: "Respondida" },
                { color: "bg-amber-500/20 border border-amber-500/30", label: "Marcada para revisar" },
                { color: "bg-white/6 border border-white/8", label: "Sin responder" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/45">
                  <span className={`w-4 h-4 rounded ${item.color} shrink-0`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="card text-sm">
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Total</span><span className="font-bold">{totalQ}</span></div>
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Respondidas</span><span className="font-bold text-emerald-400">{answered}</span></div>
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Marcadas</span><span className="font-bold text-amber-400">{marked.size}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-white/50">Sin responder</span><span className="font-bold text-white/40">{totalQ - answered}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
