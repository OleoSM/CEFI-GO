"use client";

import { useState } from "react";
import Image from "next/image";

/* ─── Palette definitions ─────────────────────────────────────────── */
const palettes = [
  {
    id: 1,
    name: "Azul académico + Dorado",
    desc: "Autoridad universitaria clásica — azul cobalto con toques de oro",
    bg: "#0A0F1E",
    cardBg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    gradientText: "linear-gradient(135deg, #60A5FA 0%, #818CF8 50%, #FBBF24 100%)",
    btnGradient: "linear-gradient(135deg, #1D4ED8 0%, #4F46E5 80%)",
    badgeBg: "rgba(37,99,235,0.2)",
    badgeText: "#93C5FD",
    accentBg: "rgba(212,160,23,0.15)",
    accentText: "#FCD34D",
    blob1: "#1E40AF",
    blob2: "#4F46E5",
    blob3: "#92400E",
    statAccent: "#3B82F6",
    progressFill: "linear-gradient(90deg, #2563EB, #818CF8)",
    tagBg: "rgba(37,99,235,0.25)",
    tagText: "#BFDBFE",
    courseGradient: "linear-gradient(135deg, #1E3A8A, #4338CA)",
  },
  {
    id: 2,
    name: "Índigo + Esmeralda",
    desc: "Equilibrio entre rigor académico y vitalidad — tecnología educativa moderna",
    bg: "#0D0E1F",
    cardBg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    gradientText: "linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #34D399 100%)",
    btnGradient: "linear-gradient(135deg, #4338CA 0%, #059669 100%)",
    badgeBg: "rgba(79,70,229,0.2)",
    badgeText: "#A5B4FC",
    accentBg: "rgba(16,185,129,0.15)",
    accentText: "#6EE7B7",
    blob1: "#3730A3",
    blob2: "#6D28D9",
    blob3: "#065F46",
    statAccent: "#6366F1",
    progressFill: "linear-gradient(90deg, #4F46E5, #10B981)",
    tagBg: "rgba(79,70,229,0.25)",
    tagText: "#C7D2FE",
    courseGradient: "linear-gradient(135deg, #312E81, #047857)",
  },
  {
    id: 3,
    name: "Guinda + Ámbar",
    desc: "Orgullo mexicano — colores de la academia nacional con calidez artesanal",
    bg: "#100818",
    cardBg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    gradientText: "linear-gradient(135deg, #FB7185 0%, #F43F5E 40%, #FBBF24 100%)",
    btnGradient: "linear-gradient(135deg, #9F1239 0%, #C2410C 100%)",
    badgeBg: "rgba(159,18,57,0.25)",
    badgeText: "#FDA4AF",
    accentBg: "rgba(217,119,6,0.15)",
    accentText: "#FCD34D",
    blob1: "#881337",
    blob2: "#BE185D",
    blob3: "#92400E",
    statAccent: "#E11D48",
    progressFill: "linear-gradient(90deg, #9F1239, #D97706)",
    tagBg: "rgba(159,18,57,0.25)",
    tagText: "#FECDD3",
    courseGradient: "linear-gradient(135deg, #7F1D1D, #78350F)",
  },
  {
    id: 4,
    name: "Noche + Oro (actual refinada)",
    desc: "La paleta actual, refinada — violeta profundo con toques de oro en vez de naranja",
    bg: "#0E0A18",
    cardBg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    gradientText: "linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #CA8A04 100%)",
    btnGradient: "linear-gradient(135deg, #6D28D9 0%, #9333EA 60%, #A16207 100%)",
    badgeBg: "rgba(124,58,237,0.2)",
    badgeText: "#C4B5FD",
    accentBg: "rgba(202,138,4,0.15)",
    accentText: "#FDE68A",
    blob1: "#6D28D9",
    blob2: "#BE185D",
    blob3: "#C2410C",
    statAccent: "#8B5CF6",
    progressFill: "linear-gradient(90deg, #7C3AED, #CA8A04)",
    tagBg: "rgba(124,58,237,0.2)",
    tagText: "#DDD6FE",
    courseGradient: "linear-gradient(135deg, #4C1D95, #831843)",
  },
];

/* ─── Mini UI pieces ─────────────────────────────────────────────── */
function PalettePreview({ p }: { p: typeof palettes[0] }) {
  return (
    <div
      style={{ background: p.bg, fontFamily: "system-ui, sans-serif" }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Aurora blobs */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        }}
        aria-hidden
      >
        <div style={{
          position: "absolute", width: 420, height: 420, borderRadius: "50%",
          background: p.blob1, opacity: 0.18, filter: "blur(80px)",
          top: -60, left: -80,
        }} />
        <div style={{
          position: "absolute", width: 380, height: 380, borderRadius: "50%",
          background: p.blob2, opacity: 0.14, filter: "blur(90px)",
          top: 40, right: -60,
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: p.blob3, opacity: 0.12, filter: "blur(70px)",
          bottom: 20, left: "40%",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>

        {/* Navbar */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "white",
            }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
              CEFI<span style={{ background: p.gradientText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GO</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Dashboard", "Cursos", "Exámenes"].map(label => (
              <span key={label} style={{
                fontSize: 12, color: "rgba(255,255,255,0.5)",
                padding: "5px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${p.border}`,
              }}>{label}</span>
            ))}
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: p.btnGradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "white",
          }}>AG</div>
        </nav>

        {/* Hero text */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.4)", marginBottom: 10,
          }}>Bienvenida de vuelta, Ana</div>
          <h2 style={{
            fontSize: 30, fontWeight: 900, lineHeight: 1.1,
            color: "white", marginBottom: 6, letterSpacing: "-1px",
          }}>
            Tu pase directo{" "}
            <span style={{
              background: p.gradientText,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>está cerca.</span>
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
            95 días para el examen · Simulacro UNAM disponible
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              background: p.btnGradient,
              color: "white", border: "none", borderRadius: 12,
              padding: "10px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            }}>
              Continuar estudio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>
            <button style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)", border: `1px solid ${p.border}`,
              borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}>
              Ver simulacros
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Racha", value: "14 días", sub: "+2 esta semana" },
            { label: "Puntaje", value: "78 pts", sub: "Objetivo: 82" },
            { label: "Cursos activos", value: "4", sub: "1 por terminar" },
            { label: "Tiempo hoy", value: "1h 24m", sub: "Meta: 2h" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: p.cardBg,
              border: `1px solid ${p.border}`,
              borderRadius: 14, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
              <div style={{
                fontSize: 20, fontWeight: 900, color: "white", marginBottom: 2,
                background: p.gradientText,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Course cards + lesson panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {/* Course card */}
          <div style={{
            background: p.cardBg,
            border: `1px solid ${p.border}`,
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{
              background: p.courseGradient,
              padding: "18px 18px 16px",
              position: "relative",
            }}>
              <span style={{
                display: "inline-block", fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em",
                background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.8)",
                borderRadius: 20, padding: "3px 10px", marginBottom: 8,
              }}>Licenciatura</span>
              <div style={{ fontSize: 16, fontWeight: 900, color: "white", lineHeight: 1.2 }}>Examen UNAM</div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                <span>6 meses</span>
                <span>·</span>
                <span>32,400 inscritos</span>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Progreso</span>
                <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>34%</span>
              </div>
              <div style={{
                height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginBottom: 12,
              }}>
                <div style={{
                  height: "100%", width: "34%", borderRadius: 3,
                  background: p.progressFill,
                }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Módulo 4 · Lec 4/12</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Mitosis y meiosis</div>
              <button style={{
                marginTop: 12, width: "100%",
                background: p.btnGradient,
                color: "white", border: "none", borderRadius: 10,
                padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Continuar →</button>
            </div>
          </div>

          {/* Right column: badge examples + mini lesson */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Badges */}
            <div style={{
              background: p.cardBg, border: `1px solid ${p.border}`,
              borderRadius: 14, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Etiquetas y badges</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ background: p.badgeBg, color: p.badgeText, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>Pro</span>
                <span style={{ background: p.accentBg, color: p.accentText, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>3 activos</span>
                <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: `1px solid ${p.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 11 }}>Matemáticas</span>
                <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: `1px solid ${p.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 11 }}>Historia</span>
              </div>
            </div>

            {/* Lesson item */}
            <div style={{
              background: p.cardBg, border: `1px solid ${p.border}`,
              borderRadius: 14, padding: "14px 16px", flex: 1,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Próxima lección</div>
              {[
                { n: "L1", title: "Introducción", done: true },
                { n: "L2", title: "Conceptos clave", done: true },
                { n: "L3", title: "Mitosis y meiosis", done: false, active: true },
                { n: "L4", title: "Práctica guiada", done: false },
              ].map(l => (
                <div key={l.n} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: l.done ? p.statAccent : l.active ? "rgba(255,255,255,0.1)" : "transparent",
                    border: l.done ? "none" : `1.5px solid ${l.active ? p.statAccent : "rgba(255,255,255,0.2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {l.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    {l.active && !l.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>}
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: l.active ? "white" : l.done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.35)",
                    fontWeight: l.active ? 600 : 400,
                    textDecoration: l.done ? "line-through" : "none",
                  }}>{l.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colors swatch row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: p.cardBg, border: `1px solid ${p.border}`,
          borderRadius: 12, padding: "12px 16px",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>COLORES:</span>
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            {[p.blob1, p.blob2, p.blob3].map((c, i) => (
              <div key={i} style={{
                height: 20, borderRadius: 6,
                background: c, opacity: 0.9,
                flex: 1,
              }} />
            ))}
          </div>
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${p.border}`,
            borderRadius: 8, padding: "4px 10px",
          }}>bg {p.bg}</div>
        </div>

      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function PalettesPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "32px 24px 64px",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
            marginBottom: 12,
          }}>CEFIGO · Selección de paleta</div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, color: "white",
            letterSpacing: "-1px", marginBottom: 8,
          }}>Elige tu paleta académica</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto 16px" }}>
            Cada sección muestra la misma interfaz con una paleta distinta. Desplázate para comparar y elige la que más te guste.
          </p>
          <a href="/styles-demo" style={{
            fontSize: 12, color: "rgba(255,255,255,0.45)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "6px 14px",
            textDecoration: "none", display: "inline-block",
          }}>También puedes comparar estilos visuales →</a>
        </div>

        {/* Quick jump */}
        <div style={{
          display: "flex", gap: 10, justifyContent: "center",
          marginBottom: 40, flexWrap: "wrap",
        }}>
          {palettes.map(p => (
            <button
              key={p.id}
              onClick={() => {
                document.getElementById(`palette-${p.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "8px 16px",
                fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p.id}. {p.name}
            </button>
          ))}
        </div>

        {/* Palette sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {palettes.map(p => (
            <div key={p.id} id={`palette-${p.id}`}>
              {/* Label */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                  }}>Paleta {p.id}</span>
                  <h2 style={{
                    fontSize: 20, fontWeight: 900, color: "white", margin: 0,
                  }}>{p.name}</h2>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{p.desc}</p>
              </div>

              <PalettePreview p={p} />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: 56, textAlign: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "32px 24px",
        }}>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
            ¿Ya elegiste? Dime el número de paleta (1–4) o el nombre y lo aplico en toda la plataforma.
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            También puedes pedir ajustes: "la 2 pero con el fondo de la 3", etc.
          </p>
        </div>

      </div>
    </div>
  );
}
