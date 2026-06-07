"use client";

import { useState } from "react";
import { unamResources } from "@/lib/mock-data";
import type { StudyResource } from "@/lib/mock-data";

const TYPE_BADGE: Record<string, string> = {
  PDF:    "text-pink-400 bg-pink-500/10 border-pink-500/20",
  PPT:    "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Guía:   "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Imagen: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const REAL_FILES = new Set([
  "/recursos/Guerra_y_Revolución.pdf",
  "/recursos/Infografia.png",
]);

export default function AdminRecursosPage() {
  const [preview, setPreview] = useState<StudyResource | null>(null);

  const byType = unamResources.reduce<Record<string, StudyResource[]>>((acc, r) => {
    acc[r.type] = [...(acc[r.type] ?? []), r];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>Recursos de estudio</h1>
          <p className="text-sm text-white/40 mt-0.5">{unamResources.length} recursos · PDFs, presentaciones e imágenes</p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled>+ Subir recurso</button>
      </header>

      {/* Summary by type */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(byType).map(([type, items]) => {
          const badgeParts = TYPE_BADGE[type]?.split(" ") ?? [];
          const textColor = badgeParts[0] ?? "text-white/50";
          const bgBorder = badgeParts.slice(1).join(" ") ?? "bg-white/5 border-white/10";
          return (
            <div key={type} className={`card border text-center py-3 ${bgBorder}`}>
              <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>{items.length}</p>
              <p className={`text-xs font-bold ${textColor}`}>{type}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Recurso</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Materia</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Tipo</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">Tamaño</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Estado</th>
              <th className="py-3 px-3" />
            </tr>
          </thead>
          <tbody>
            {unamResources.map((resource) => {
              const real = REAL_FILES.has(resource.url);
              return (
                <tr key={resource.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-white/80">{resource.title}</p>
                    <p className="text-[11px] text-white/35 mt-0.5 hidden sm:block">{resource.description.slice(0, 60)}…</p>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <span className="text-xs text-white/50">{resource.subject}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${TYPE_BADGE[resource.type] ?? "text-white/50 bg-white/5 border-white/10"}`}>
                      {resource.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <span className="text-xs text-white/40">{resource.fileSize}</span>
                  </td>
                  <td className="py-3 px-3">
                    {real ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">Archivo real</span>
                    ) : (
                      <span className="text-[10px] text-white/25 bg-white/5 border border-white/8 rounded-full px-2 py-0.5">Mock</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      {real && (
                        <button
                          onClick={() => setPreview(resource)}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 transition-all"
                        >
                          Vista previa
                        </button>
                      )}
                      <a
                        href={real ? resource.url : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={!real ? (e) => e.preventDefault() : undefined}
                        className={`text-xs font-semibold bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 transition-all ${real ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"}`}
                      >
                        {resource.type === "Imagen" ? "Ver" : "Descargar"}
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl h-[90vh] flex flex-col card border border-white/10">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <p className="font-bold text-sm">{preview.title}</p>
                <p className="text-xs text-white/35">{preview.fileSize} · {preview.type}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {preview.type === "Imagen" ? (
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt={preview.title} className="max-w-full max-h-full object-contain rounded-xl" />
              </div>
            ) : (
              <iframe src={preview.url} className="flex-1 rounded-xl border border-white/8" title={preview.title} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
