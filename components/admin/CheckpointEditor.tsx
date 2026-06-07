"use client";

import { useState } from "react";
import { videoCheckpoints } from "@/lib/mock-data";
import type { VideoCheckpoint } from "@/lib/mock-data";

interface Props {
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
}

function emptyCheckpoint(lessonId: string): Omit<VideoCheckpoint, "id"> {
  return {
    lessonId,
    timestampSeconds: 0,
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  };
}

export default function CheckpointEditor({ lessonId, lessonTitle, onClose }: Props) {
  const [checkpoints, setCheckpoints] = useState<VideoCheckpoint[]>(
    videoCheckpoints.filter((cp) => cp.lessonId === lessonId)
  );
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyCheckpoint(lessonId));
  const [saved, setSaved] = useState(false);

  function handleAddConfirm() {
    if (!draft.question.trim() || draft.options.some((o) => !o.trim())) return;
    const newCp: VideoCheckpoint = {
      ...draft,
      id: `cp-${lessonId}-${Date.now()}`,
    };
    setCheckpoints((prev) => [...prev, newCp]);
    setDraft(emptyCheckpoint(lessonId));
    setAdding(false);
  }

  function handleRemove(id: string) {
    setCheckpoints((prev) => prev.filter((cp) => cp.id !== id));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateDraftOption(i: number, val: string) {
    setDraft((d) => {
      const opts = [...d.options];
      opts[i] = val;
      return { ...d, options: opts };
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 card border border-amber-500/20 shadow-2xl shadow-amber-900/20 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Checkpoints interactivos</span>
            </div>
            <h2 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
              {lessonTitle}
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Los timestamps se guardan en <code className="bg-white/5 px-1 rounded">video_checkpoints</code>. El video se pausará automáticamente en cada segundo configurado.
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Empty state */}
        {checkpoints.length === 0 && !adding && (
          <div className="text-center py-8 text-white/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm">Sin checkpoints. Agrega el primero.</p>
          </div>
        )}

        {/* Existing checkpoints list */}
        <div className="space-y-3">
          {checkpoints.map((cp, idx) => (
            <div key={cp.id} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                    ⏱ {cp.timestampSeconds}s
                  </span>
                  <span className="text-xs text-white/40">Checkpoint #{idx + 1}</span>
                </div>
                <button
                  onClick={() => handleRemove(cp.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Eliminar
                </button>
              </div>
              <p className="text-sm font-medium text-white/80">{cp.question}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {cp.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border ${
                      i === cp.correctIndex
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-white/3 border-white/8 text-white/45"
                    }`}
                  >
                    <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
              {cp.explanation && (
                <p className="text-[11px] text-white/35 italic leading-relaxed">{cp.explanation}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add new checkpoint form */}
        {adding && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-4">
            <p className="text-sm font-bold text-amber-300">Nuevo checkpoint</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1">Segundo del video (s)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.timestampSeconds}
                  onChange={(e) => setDraft((d) => ({ ...d, timestampSeconds: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                  placeholder="ej. 120"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Respuesta correcta</label>
                <select
                  value={draft.correctIndex}
                  onChange={(e) => setDraft((d) => ({ ...d, correctIndex: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                >
                  {["A", "B", "C", "D"].map((l, i) => (
                    <option key={i} value={i} className="bg-[#1a1a2e]">Opción {l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1">Pregunta</label>
              <textarea
                rows={2}
                value={draft.question}
                onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="¿Cuál es la función del...?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {draft.options.map((opt, i) => (
                <div key={i}>
                  <label className="block text-xs text-white/50 mb-1">Opción {String.fromCharCode(65 + i)}</label>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateDraftOption(i, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1">Explicación (opcional)</label>
              <textarea
                rows={2}
                value={draft.explanation}
                onChange={(e) => setDraft((d) => ({ ...d, explanation: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="Se muestra al alumno después de responder..."
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleAddConfirm} className="btn btn--primary text-sm">
                Agregar checkpoint
              </button>
              <button
                onClick={() => { setAdding(false); setDraft(emptyCheckpoint(lessonId)); }}
                className="btn btn--ghost text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Agregar checkpoint
            </button>
          )}
          <div className="ml-auto flex items-center gap-3">
            {saved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                Guardado
              </span>
            )}
            <button onClick={handleSave} className="btn btn--primary text-sm">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
