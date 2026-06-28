"use client";

import { useState } from "react";
import type { VideoCheckpoint } from "@/lib/mock-data";

interface Props {
  checkpoint: VideoCheckpoint;
  onContinue: (selectedIndex: number, isCorrect: boolean) => void;
}

export default function CheckpointOverlay({ checkpoint, onContinue }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    if (selected === null) return;
    setRevealed(true);
  }

  function handleContinue() {
    if (selected === null) return;
    onContinue(selected, selected === checkpoint.correctIndex);
  }

  const isCorrect = selected === checkpoint.correctIndex;

  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center bg-black/80 backdrop-blur-sm p-3 overflow-y-auto">
      <div className="w-full max-w-lg card border border-violet-500/30 shadow-2xl shadow-violet-900/40 my-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">
            Pausa · Pregunta interactiva
          </span>
        </div>

        {/* Question */}
        <p className="text-base font-semibold leading-snug mb-6">
          {checkpoint.question}
        </p>

        {/* Options */}
        <fieldset className="space-y-2.5 mb-5">
          <legend className="sr-only">Selecciona una respuesta</legend>
          {checkpoint.options.map((opt, i) => {
            let stateClass = "bg-white/3 border-white/8 text-white/70 hover:bg-white/6 hover:border-white/15 cursor-pointer";
            if (revealed) {
              if (i === checkpoint.correctIndex) {
                stateClass = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 cursor-default";
              } else if (i === selected && !isCorrect) {
                stateClass = "bg-red-500/15 border-red-500/40 text-red-300 cursor-default";
              } else {
                stateClass = "bg-white/3 border-white/5 text-white/30 cursor-default";
              }
            } else if (selected === i) {
              stateClass = "bg-violet-500/15 border-violet-500/40 text-white cursor-pointer";
            }

            return (
              <label
                key={i}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${stateClass}`}
              >
                <input
                  type="radio"
                  name="checkpoint-answer"
                  value={i}
                  checked={selected === i}
                  onChange={() => { if (!revealed) setSelected(i); }}
                  disabled={revealed}
                  className="sr-only"
                />
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-colors ${
                    revealed && i === checkpoint.correctIndex
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : revealed && i === selected && !isCorrect
                      ? "bg-red-500 border-red-400 text-white"
                      : selected === i
                      ? "bg-violet-500 border-violet-400 text-white"
                      : "border-white/20 text-white/40"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-snug flex-1">{opt}</span>
                {revealed && i === checkpoint.correctIndex && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-emerald-400 shrink-0" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                )}
              </label>
            );
          })}
        </fieldset>

        {/* Explanation */}
        {revealed && (
          <div
            className={`rounded-xl p-4 text-sm leading-relaxed mb-4 ${
              isCorrect
                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-200"
                : "bg-amber-500/10 border border-amber-500/25 text-amber-200"
            }`}
          >
            <span className="font-bold block mb-1">
              {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
            </span>
            {checkpoint.explanation}
          </div>
        )}

        {/* Action */}
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className="btn btn--primary w-full justify-center disabled:opacity-40"
          >
            Comprobar respuesta
          </button>
        ) : (
          <button onClick={handleContinue} className="btn btn--primary w-full justify-center">
            Continuar video
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
