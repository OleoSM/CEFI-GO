"use client";

import { useState } from "react";
import Link from "next/link";
import type { Module } from "@/lib/mock-data";

interface Props {
  slug: string;
  modules: Module[];
  accent?: string;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const QuizIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ExamIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

export default function CourseModulesAccordion({ slug, modules, accent = "#A78BFA" }: Props) {
  const firstOpen = modules.find((m) => m.lessons.some((l) => l.current))?.id ?? modules[0]?.id;
  const [openId, setOpenId] = useState<number | null>(firstOpen ?? null);

  return (
    <div className="space-y-3">
      {modules.map((mod) => {
        const open = openId === mod.id;
        const done = mod.lessons.filter((l) => l.done).length;
        const allDone = done === mod.lessons.length;

        return (
          <div key={mod.id} className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
            {/* Module header */}
            <button
              onClick={() => setOpenId(open ? null : mod.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/40 font-medium">Módulo {mod.id}</p>
                <p className="font-bold text-white text-sm leading-tight truncate">{mod.title}</p>
              </div>
              <span className="text-xs text-white/40 shrink-0">
                {done}/{mod.lessons.length}
              </span>
              <span className="text-white/50 shrink-0">
                <ChevronIcon open={open} />
              </span>
            </button>

            {/* Lessons + quizzes */}
            {open && (
              <div className="px-3 pb-3 space-y-1.5">
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="space-y-1.5">
                    {/* Lesson row */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/6">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          lesson.done
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-violet-500/15 text-violet-300"
                        }`}
                      >
                        {lesson.done ? <CheckIcon /> : <PlayIcon />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/85 truncate">{lesson.title}</p>
                        <p className="text-[11px] text-white/35">{lesson.duration}</p>
                      </div>
                      <Link
                        href={`/courses/${slug}/lessons/${lesson.id}`}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-all"
                      >
                        <PlayIcon />
                        Reproducir
                      </Link>
                    </div>

                    {/* Quiz row */}
                    {lesson.quiz && (
                      <div className="flex items-center gap-3 pl-6 pr-3 py-2 rounded-xl bg-white/[0.015] border border-white/5">
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white/40">
                          <QuizIcon />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/60">Cuestionario</p>
                          <p className="text-[11px] text-white/30">{lesson.quiz.questionsCount} preguntas</p>
                        </div>
                        {lesson.done ? (
                          <Link
                            href={`/courses/${slug}/lessons/${lesson.id}?quiz=${lesson.quiz.id}`}
                            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-all"
                          >
                            Iniciar
                          </Link>
                        ) : (
                          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/30 bg-white/[0.02] border border-white/6">
                            <LockIcon />
                            Bloqueado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Module exam row */}
                <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl bg-amber-500/8 border border-amber-500/25">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/15 text-amber-400">
                    <ExamIcon />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-amber-300">Examen de módulo</p>
                    <p className="text-[11px] text-amber-200/50">{mod.moduleExam.questionsCount} preguntas</p>
                  </div>
                  {allDone ? (
                    <Link
                      href={`/exam/${mod.moduleExam.id}`}
                      className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/35 text-amber-300 hover:bg-amber-500/30 transition-all"
                    >
                      Iniciar
                    </Link>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-200/40 bg-amber-500/5 border border-amber-500/15">
                      <LockIcon />
                      Bloqueado
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
