"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   STYLE DEMOS
   Each style uses the same violet+gold palette so comparisons are fair.
   What changes: card treatment, typography, spacing, depth, background.
───────────────────────────────────────────────────────────────────── */

/* ── Style 1: Academia Editorial ──
   Inspiration: Premium university textbooks, Notion, Linear
   - Warm dark background (not pure cold black)
   - Serif display headings
   - Crisp ruled-line borders instead of glowing blurs
   - Cards feel like pages, not floating glass
   - No aurora blobs — subtle diagonal gradient mesh instead
*/
function StyleAcademiaEditorial() {
  return (
    <div style={{
      background: "#110E08",
      fontFamily: "system-ui, sans-serif",
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Subtle warm tint mesh (no blobs) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(120,80,20,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(80,40,120,0.10) 0%, transparent 70%)",
      }} aria-hidden />

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>

        {/* Navbar — ruled bottom border, no blur */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingBottom: 16, marginBottom: 28,
          borderBottom: "1px solid rgba(255,220,140,0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "white",
            }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#F5F0E8", letterSpacing: "-0.5px" }}>
              CEFI<span style={{ color: "#E9A93A" }}>GO</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Dashboard", "Cursos", "Exámenes", "Recursos"].map((l, i) => (
              <span key={l} style={{
                fontSize: 12, fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? "#E9A93A" : "rgba(245,240,232,0.45)",
                borderBottom: i === 0 ? "1.5px solid #E9A93A" : "none",
                paddingBottom: 2,
                cursor: "pointer",
              }}>{l}</span>
            ))}
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(233,169,58,0.15)",
            border: "1.5px solid rgba(233,169,58,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "#E9A93A",
          }}>AG</div>
        </nav>

        {/* Hero — editorial heading style */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "rgba(245,240,232,0.35)",
            marginBottom: 10,
          }}>Lunes · 95 días para el examen</div>
          <h2 style={{
            fontSize: 28, fontWeight: 900, color: "#F5F0E8",
            lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.8px",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>
            Tu preparación, <span style={{ color: "#E9A93A" }}>capítulo a capítulo.</span>
          </h2>
          <p style={{ fontSize: 13, color: "rgba(245,240,232,0.45)", marginBottom: 18, maxWidth: 400 }}>
            Retoma donde lo dejaste · Módulo 4 · Biología celular
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              background: "#7C3AED",
              color: "white", border: "none", borderRadius: 10,
              padding: "9px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "-0.2px",
            }}>Continuar estudio →</button>
            <button style={{
              background: "transparent", color: "rgba(245,240,232,0.55)",
              border: "1px solid rgba(245,240,232,0.12)", borderRadius: 10,
              padding: "9px 18px", fontSize: 13, cursor: "pointer",
            }}>Ver simulacros</button>
          </div>
        </div>

        {/* Stats — editorial ruled rows, not cards */}
        <div style={{
          borderTop: "1px solid rgba(255,220,140,0.1)",
          marginBottom: 22,
        }}>
          {[
            { label: "Racha actual", value: "14 días", note: "+2 esta semana" },
            { label: "Puntaje diagnóstico", value: "78 / 120", note: "Objetivo: 82" },
            { label: "Tiempo hoy", value: "1h 24min", note: "Meta: 2h diarias" },
            { label: "Cursos activos", value: "4 cursos", note: "1 por completar" },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 0",
              borderBottom: "1px solid rgba(245,240,232,0.06)",
            }}>
              <span style={{ fontSize: 12, color: "rgba(245,240,232,0.45)", minWidth: 180 }}>{s.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#F5F0E8", flex: 1, textAlign: "center" }}>{s.value}</span>
              <span style={{ fontSize: 11, color: "#E9A93A", opacity: 0.8, minWidth: 120, textAlign: "right" }}>{s.note}</span>
            </div>
          ))}
        </div>

        {/* Course card — book cover style */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
          <div style={{
            background: "linear-gradient(160deg, #2D1B69 0%, #1E3A5F 100%)",
            borderRadius: 14, padding: "20px 18px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: 160,
          }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Examen UNAM</div>
              <div style={{
                fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1.2,
                fontFamily: "Georgia, serif",
              }}>Biología<br/>Celular</div>
            </div>
            <div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: "100%", width: "34%", background: "#E9A93A", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>34% · Módulo 4</div>
            </div>
          </div>

          <div style={{
            background: "rgba(245,240,232,0.03)",
            border: "1px solid rgba(245,240,232,0.08)",
            borderRadius: 14, padding: "16px 20px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,240,232,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Próximas lecciones</div>
            {[
              { label: "Mitosis y meiosis — Fases", active: true },
              { label: "División celular: ejercicios", done: false },
              { label: "ADN y replicación", done: false },
            ].map((l, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                borderBottom: "1px solid rgba(245,240,232,0.05)",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: l.active ? "#E9A93A" : "rgba(245,240,232,0.2)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 12, color: l.active ? "#F5F0E8" : "rgba(245,240,232,0.4)",
                  fontWeight: l.active ? 600 : 400,
                }}>{l.label}</span>
                {l.active && <span style={{
                  marginLeft: "auto", fontSize: 10, fontWeight: 700,
                  color: "#E9A93A", background: "rgba(233,169,58,0.12)",
                  padding: "2px 8px", borderRadius: 6,
                }}>Continuar</span>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Style 2: Glass Moderno ──
   Inspiration: Apple visionOS, Figma, Arc Browser
   - Pure glassmorphism with backdrop-blur
   - Gradient mesh background (not blobs)
   - Cards look like frosted panels floating in space
   - Elegant and very premium
*/
function StyleGlassModerno() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0D0620 0%, #0A1628 40%, #150D2A 70%, #0F0A1A 100%)",
      fontFamily: "system-ui, sans-serif",
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Gradient mesh — static, intentional */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: "conic-gradient(from 180deg at 50% 50%, #7C3AED22 0deg, #EC489922 90deg, #F9731622 180deg, #7C3AED22 360deg)",
          opacity: 0.4,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>

        {/* Navbar — glass pill */}
        <nav style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14, padding: "10px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: "white",
              }}>C</div>
              <span style={{ fontSize: 15, fontWeight: 900, color: "white", letterSpacing: "-0.3px" }}>
                CEFI<span style={{
                  background: "linear-gradient(90deg, #A78BFA, #F9A8D4)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>GO</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Dashboard", "Cursos", "Exámenes"].map((l, i) => (
                <span key={l} style={{
                  fontSize: 12, fontWeight: 500,
                  color: i === 0 ? "white" : "rgba(255,255,255,0.45)",
                  background: i === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                  borderRadius: 8, padding: "5px 12px",
                  cursor: "pointer",
                }}>{l}</span>
              ))}
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED60, #EC489960)",
              border: "1px solid rgba(167,139,250,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#C4B5FD",
            }}>AG</div>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #A78BFA, #F9A8D4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "inline-block", marginBottom: 10,
          }}>95 días · Examen UNAM</div>
          <h2 style={{
            fontSize: 26, fontWeight: 900, color: "white",
            lineHeight: 1.15, marginBottom: 8, letterSpacing: "-0.7px",
          }}>
            Hola, Ana{" "}
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #FB923C 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>¿lista para hoy?</span>
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
            Módulo 4 · Biología celular te espera
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              background: "linear-gradient(135deg, #7C3AED, #C026D3, #EC4899)",
              color: "white", border: "none", borderRadius: 12,
              padding: "9px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}>Continuar →</button>
            <button style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12,
              padding: "9px 18px", fontSize: 13, cursor: "pointer",
            }}>Simulacros</button>
          </div>
        </div>

        {/* Stats — glass cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Racha", value: "14", unit: "días", color: "#F59E0B" },
            { label: "Puntaje", value: "78", unit: "pts", color: "#A78BFA" },
            { label: "Activos", value: "4", unit: "cursos", color: "#34D399" },
            { label: "Hoy", value: "1h 24", unit: "min", color: "#FB923C" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14, padding: "14px 14px",
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 12 }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(76,29,149,0.8), rgba(131,24,67,0.8))",
              padding: "16px 18px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Examen UNAM · Licenciatura</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>Biología celular</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>6 meses · 32,400 inscritos</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 10 }}>
                <div style={{ height: "100%", width: "34%", background: "linear-gradient(90deg, #7C3AED, #A78BFA)", borderRadius: 2, boxShadow: "0 0 8px rgba(124,58,237,0.6)" }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Módulo 4 · Lección 4 de 12</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Mitosis y meiosis — Fases celulares</div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 16, padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Badges</div>
            {[
              { label: "Plan Pro", bg: "rgba(124,58,237,0.2)", color: "#C4B5FD" },
              { label: "3 activos", bg: "rgba(249,115,22,0.2)", color: "#FED7AA" },
              { label: "Racha", bg: "rgba(245,158,11,0.15)", color: "#FCD34D" },
            ].map(b => (
              <span key={b.label} style={{
                display: "inline-block", background: b.bg, color: b.color,
                borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                width: "fit-content",
              }}>{b.label}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Style 3: Cálido Estructurado ──
   Inspiration: Notion dark, Obsidian, premium note apps
   - Very dark warm background (#131008 — almost black but with warmth)
   - More generous padding & white space
   - Cards with subtle amber/warm borders (not pure white)
   - Less gradient noise, more intentional color touches
   - Feels like a premium study journal / notebook
*/
function StyleCalidoEstructurado() {
  return (
    <div style={{
      background: "#0F0C08",
      fontFamily: "system-ui, sans-serif",
      borderRadius: 20, overflow: "hidden",
      position: "relative",
    }}>
      {/* Very subtle warm gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(251,191,36,0.04) 0%, transparent 60%)",
      }} aria-hidden />

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>

        {/* Sidebar hint + main content layout */}
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20 }}>

          {/* Mini sidebar */}
          <div style={{
            borderRight: "1px solid rgba(251,191,36,0.08)",
            paddingRight: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: "white",
              }}>C</div>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#FAF5E8", letterSpacing: "-0.3px" }}>
                CEFI<span style={{ color: "#FBBF24" }}>GO</span>
              </span>
            </div>
            {[
              { icon: "▪", label: "Dashboard", active: true },
              { icon: "▪", label: "Cursos", active: false },
              { icon: "▪", label: "Exámenes", active: false },
              { icon: "▪", label: "Recursos", active: false },
              { icon: "▪", label: "Perfil", active: false },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 8px", borderRadius: 8, marginBottom: 2,
                background: item.active ? "rgba(251,191,36,0.08)" : "transparent",
                cursor: "pointer",
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: item.active ? "#FBBF24" : "rgba(250,245,232,0.2)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 12, fontWeight: item.active ? 700 : 400,
                  color: item.active ? "#FAF5E8" : "rgba(250,245,232,0.4)",
                }}>{item.label}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(251,191,36,0.08)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,245,232,0.25)", marginBottom: 8 }}>Mis cursos</div>
              {["UNAM", "Matemáticas", "Historia"].map(c => (
                <div key={c} style={{
                  fontSize: 11, color: "rgba(250,245,232,0.4)", padding: "5px 8px",
                  cursor: "pointer",
                }}>{c}</div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(250,245,232,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Lunes, 10 de mayo · 95 días</div>
              <h2 style={{
                fontSize: 24, fontWeight: 900, color: "#FAF5E8",
                letterSpacing: "-0.7px", lineHeight: 1.2, marginBottom: 6,
              }}>
                Buenos días, Ana.{" "}
                <span style={{ color: "#FBBF24" }}>Retoma el paso.</span>
              </h2>
              <p style={{ fontSize: 12, color: "rgba(250,245,232,0.4)" }}>
                Tienes 3 lecciones pendientes y 1 simulacro listo.
              </p>
            </div>

            {/* Stat row — warm ruled style */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16,
            }}>
              {[
                { label: "Racha", value: "14 días", color: "#F59E0B" },
                { label: "Puntaje", value: "78 pts", color: "#A78BFA" },
                { label: "Tiempo hoy", value: "1h 24m", color: "#6EE7B7" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(250,245,232,0.03)",
                  border: "1px solid rgba(250,245,232,0.07)",
                  borderLeft: `3px solid ${s.color}`,
                  borderRadius: "0 10px 10px 0",
                  padding: "10px 14px",
                }}>
                  <div style={{ fontSize: 10, color: "rgba(250,245,232,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Course card — warm notebook card */}
            <div style={{
              background: "rgba(250,245,232,0.03)",
              border: "1px solid rgba(250,245,232,0.08)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #1E1240, #2D1B10)",
                padding: "14px 16px",
                borderBottom: "1px solid rgba(250,245,232,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Examen UNAM · Módulo 4</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>Biología celular</div>
                </div>
                <div style={{
                  background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)",
                  borderRadius: 8, padding: "6px 12px",
                  fontSize: 11, fontWeight: 700, color: "#FBBF24",
                }}>34%</div>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(250,245,232,0.75)" }}>Mitosis y meiosis — Fases celulares</span>
                  <span style={{ fontSize: 11, color: "rgba(250,245,232,0.35)" }}>18 min restantes</span>
                </div>
                <div style={{ height: 4, background: "rgba(250,245,232,0.07)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: "34%", background: "linear-gradient(90deg, #7C3AED, #FBBF24)", borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Style 4: Bold & Colorido ──
   Inspiration: Duolingo dark, Headspace, Kahoot
   - More color, more life, more energy
   - Rounded chunky shapes
   - Colored section backgrounds
   - Feels engaging and motivating — not techy
   - Could feel "too young" but shows the spectrum
*/
function StyleBoldColorido() {
  return (
    <div style={{
      background: "#0D0D12",
      fontFamily: "system-ui, sans-serif",
      borderRadius: 20, overflow: "hidden",
      position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "#7C3AED", opacity: 0.1, filter: "blur(60px)", top: -50, left: -50 }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "#059669", opacity: 0.08, filter: "blur(60px)", top: 0, right: -30 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "#D97706", opacity: 0.08, filter: "blur(50px)", bottom: 20, left: "40%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "24px 28px 28px" }}>

        {/* Navbar */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "white",
            }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: "-0.3px" }}>
              CEFI<span style={{ background: "linear-gradient(90deg, #A78BFA, #34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GO</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Inicio", "Cursos", "Práctica", "Datos"].map((icon, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: 10,
                background: i === 0 ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                border: i === 0 ? "1.5px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, cursor: "pointer",
              }}>{icon}</div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "6px 12px 6px 6px",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: "white",
            }}>AG</div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Ana G.</span>
          </div>
        </nav>

        {/* Colorful stat pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "14 días de racha", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#FCD34D" },
            { label: "78 puntos", bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)", color: "#C4B5FD" },
            { label: "4 cursos activos", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", color: "#6EE7B7" },
            { label: "1h 24m hoy", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", color: "#FED7AA" },
          ].map(s => (
            <span key={s.label} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              color: s.color, borderRadius: 20,
              padding: "6px 14px", fontSize: 12, fontWeight: 700,
            }}>{s.label}</span>
          ))}
        </div>

        {/* Hero card — big and colorful */}
        <div style={{
          background: "linear-gradient(135deg, #4C1D95 0%, #831843 60%, #7C2D12 100%)",
          borderRadius: 18, padding: "20px 22px", marginBottom: 14,
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: 60, opacity: 0.15, pointerEvents: "none",
          }} aria-hidden />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontWeight: 600 }}>Continúa donde lo dejaste</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "white", marginBottom: 6, lineHeight: 1.2 }}>Mitosis y meiosis — Fases celulares</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>Módulo 4 · Lección 4/12 · 18 min restantes</div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, marginBottom: 14, width: "70%" }}>
            <div style={{ height: "100%", width: "34%", background: "rgba(255,255,255,0.8)", borderRadius: 3 }} />
          </div>
          <button style={{
            background: "white", color: "#4C1D95",
            border: "none", borderRadius: 12,
            padding: "10px 22px", fontSize: 13, fontWeight: 800,
            cursor: "pointer",
          }}>Continuar lección →</button>
        </div>

        {/* Mini cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Matemáticas", sub: "Módulo 2 · 20%", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
            { label: "Historia MX", sub: "Módulo 1 · 12%", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
            { label: "Simulacro UNAM", sub: "Disponible · 120 items", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 14, padding: "14px 14px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{c.sub}</div>
              <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: "30%", background: c.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
const styles = [
  {
    id: 1,
    name: "Academia Editorial",
    tag: "Recomendado",
    desc: "Inspirado en revistas académicas y apps premium como Notion o Linear. Fondo cálido oscuro, tipografía serif en headings, bordes finos tipo regla. Transmite autoridad y profundidad sin gritar.",
    pros: ["Se siente premium y serio", "Muy legible", "Diferente a todo fintech"],
    cons: ["Menos 'wow' al primer vistazo"],
    component: StyleAcademiaEditorial,
  },
  {
    id: 2,
    name: "Glass Moderno",
    tag: "Elegante",
    desc: "Glassmorphism real con backdrop-blur. Inspirado en Apple visionOS y Arc Browser. Las tarjetas flotan como paneles de vidrio esmerilado sobre un fondo con malla de gradiente.",
    pros: ["Visual impact inmediato", "Muy premium", "Moderno sin ser frío"],
    cons: ["Puede verse como 'crypto app'", "Performance leve en blur"],
    component: StyleGlassModerno,
  },
  {
    id: 3,
    name: "Cálido Estructurado",
    tag: "Calidez",
    desc: "Inspirado en Notion dark, Obsidian y apps de notas premium. Fondo casi-negro con tinte cálido, sidebar visible, bordes ámbar sutiles. Siente como estudiar con un cuaderno elegante.",
    pros: ["Muy cálido y acogedor", "Layout con sidebar", "No se siente tech en absoluto"],
    cons: ["Menos colorido", "Puede verse apagado sin iconos"],
    component: StyleCalidoEstructurado,
  },
  {
    id: 4,
    name: "Bold & Colorido",
    tag: "Energético",
    desc: "Inspirado en Duolingo dark y Kahoot. Más color, formas redondeadas, pills de colores. Muy motivador y accesible. Puede sentirse más juvenil que académico pero tiene mucha energía.",
    pros: ["Muy motivador", "Fácil de escanear", "Los estudiantes lo aman"],
    cons: ["Puede verse 'app de juegos'", "Menos serio/académico"],
    component: StyleBoldColorido,
  },
];

export default function StylesDemoPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "32px 24px 64px",
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            marginBottom: 12,
          }}>CEFIGO · Comparación de estilos</div>
          <h1 style={{
            fontSize: 30, fontWeight: 900, color: "white",
            letterSpacing: "-1px", marginBottom: 10,
          }}>4 estilos, misma plataforma</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto" }}>
            Cada demo usa los mismos colores (violeta + dorado) pero con un estilo visual distinto. Elige el que más encaje con cómo quieres que se sienta CEFIGO.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            <a href="/palettes" style={{
              fontSize: 12, color: "rgba(255,255,255,0.45)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 14px",
              textDecoration: "none",
            }}>← Ver demos de paletas</a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
          {styles.map(s => {
            const Component = s.component;
            return (
              <div key={s.id} id={`style-${s.id}`}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                    }}>Estilo {s.id}</span>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>{s.name}</h2>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      background: "rgba(124,58,237,0.2)",
                      color: "#C4B5FD",
                      border: "1px solid rgba(124,58,237,0.3)",
                      borderRadius: 20, padding: "2px 10px",
                    }}>{s.tag}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 10px" }}>{s.desc}</p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      {s.pros.map(p => (
                        <span key={p} style={{ fontSize: 11, color: "rgba(110,231,183,0.8)", marginRight: 12 }}>+ {p}</span>
                      ))}
                    </div>
                    <div>
                      {s.cons.map(c => (
                        <span key={c} style={{ fontSize: 11, color: "rgba(251,191,36,0.6)", marginRight: 12 }}>· {c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <Component />
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 56, textAlign: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "32px 24px",
        }}>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
            ¿Ya elegiste un estilo? Dime el número (1–4) y lo aplico globalmente.
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            También puedes mezclar: "el layout del 3 con las tarjetas del 1", etc.
          </p>
        </div>

      </div>
    </div>
  );
}
