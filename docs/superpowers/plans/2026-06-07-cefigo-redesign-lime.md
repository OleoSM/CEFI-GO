# CEFIGO Redesign — Lime + Near-Black Design System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current purple/violet/aurora AI-aesthetic with a near-black + single CEFIGO-lime accent design system, professional scroll-driven animations, Syne + Inter typography, and zero glassmorphism — across every page of the app.

**Architecture:** Single source of truth in `globals.css` (CSS custom properties + component classes). Font swap in `app/layout.tsx`. Each page/component task updates Tailwind classes and inline styles to use the new tokens. No new dependencies — Syne and Inter are both available in `next/font/google`.

**Design tokens (commit to memory — every task uses these):**
```
Background:   #080808
Surface-1:    #111111   (cards)
Surface-2:    #1a1a1a   (elevated / dropdowns)
Surface-3:    #242424   (hover states)
Lime:         #B5FF47   (CEFIGO primary accent)
Lime-fore:    #0d1a00   (text ON lime backgrounds)
Lime-10:      rgba(181,255,71,0.10)
Lime-20:      rgba(181,255,71,0.20)
Border:       rgba(255,255,255,0.07)
Border-2:     rgba(255,255,255,0.12)
Text:         #F2F2F2
Text-2:       rgba(255,255,255,0.50)
Text-3:       rgba(255,255,255,0.28)
```

**Typography:** Syne 700/800 for display/headings. Inter 400/500/600 for body.

**Animations:** CSS scroll-driven (`animation-timeline: view()`) for scroll reveals. Spring easing `cubic-bezier(0.16, 1, 0.3, 1)` throughout. No floating blobs. Subtle noise texture replaces aurora.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `next/font/google` (Syne + Inter), CSS custom properties, CSS Scroll-Driven Animations.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Full token + component class overhaul |
| Modify | `app/layout.tsx` | Syne + Inter font swap |
| Modify | `app/page.tsx` | Landing page rebuild |
| Modify | `app/(auth)/login/page.tsx` | Auth redesign |
| Modify | `app/(auth)/register/page.tsx` | Auth redesign |
| Modify | `components/layout/AppShell.tsx` | Remove aurora blobs |
| Modify | `components/layout/Topbar.tsx` | Update dropdowns + avatar |
| Modify | `components/layout/Sidebar.tsx` | Lime active states, new upgrade banner |
| Modify | `app/(app)/dashboard/page.tsx` | Lime tokens |
| Modify | `app/(app)/dashboard/DashboardGreeting.tsx` | Lime tokens |
| Modify | `app/(app)/dashboard/DashboardStreakStat.tsx` | Lime tokens |
| Modify | `app/(app)/courses/page.tsx` | Lime tokens |
| Modify | `app/(app)/courses/[slug]/page.tsx` | Lime tokens |
| Modify | `app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx` | Lime tokens |
| Modify | `app/(app)/exam/page.tsx` | Lime tokens |
| Modify | `app/(app)/exam/[examId]/page.tsx` | Lime tokens |
| Modify | `app/(app)/profile/page.tsx` | Lime tokens |
| Modify | `app/(app)/analytics/page.tsx` | Lime tokens |
| Modify | `app/(app)/settings/page.tsx` | Lime tokens |
| Modify | `app/(app)/resources/page.tsx` | Lime tokens |
| Modify | `app/(app)/suscribirse/page.tsx` | Lime tokens |
| Modify | `components/admin/AdminSidebar.tsx` | Lime (was amber) |
| Modify | `app/(admin)/admin/layout.tsx` | Lime bg tokens |

---

## Task 1: Design foundation — globals.css + layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/globals.css` entirely**

Write this complete file (replaces all 1054 lines):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

/* ─── Theme tokens ──────────────────────────────────────── */
@theme inline {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-sans: var(--font-body);
  --font-heading: var(--font-display);

  --radius-sm:  calc(var(--radius) * 0.6);
  --radius-md:  calc(var(--radius) * 0.8);
  --radius-lg:  var(--radius);
  --radius-xl:  calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);

  --color-background:        var(--background);
  --color-foreground:        var(--foreground);
  --color-card:              var(--card);
  --color-card-foreground:   var(--card-foreground);
  --color-popover:           var(--popover);
  --color-popover-foreground:var(--popover-foreground);
  --color-primary:           var(--primary);
  --color-primary-foreground:var(--primary-foreground);
  --color-secondary:         var(--secondary);
  --color-secondary-foreground:var(--secondary-foreground);
  --color-muted:             var(--muted);
  --color-muted-foreground:  var(--muted-foreground);
  --color-accent:            var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive:       var(--destructive);
  --color-border:            var(--border);
  --color-input:             var(--input);
  --color-ring:              var(--ring);
  --color-sidebar:           var(--sidebar);
  --color-sidebar-foreground:var(--sidebar-foreground);
  --color-sidebar-primary:   var(--sidebar-primary);
  --color-sidebar-primary-foreground:var(--sidebar-primary-foreground);
  --color-sidebar-accent:    var(--sidebar-accent);
  --color-sidebar-accent-foreground:var(--sidebar-accent-foreground);
  --color-sidebar-border:    var(--sidebar-border);
  --color-sidebar-ring:      var(--sidebar-ring);

  /* CEFIGO brand */
  --color-cefi-bg:     #080808;
  --color-cefi-lime:   #B5FF47;
  --color-cefi-lime-fore: #0d1a00;
}

/* ─── Design tokens ─────────────────────────────────────── */
:root {
  --background:          #080808;
  --foreground:          #F2F2F2;
  --card:                #111111;
  --card-foreground:     #F2F2F2;
  --popover:             #1a1a1a;
  --popover-foreground:  #F2F2F2;
  --primary:             #B5FF47;
  --primary-foreground:  #0d1a00;
  --secondary:           #1a1a1a;
  --secondary-foreground:#F2F2F2;
  --muted:               rgba(255,255,255,0.06);
  --muted-foreground:    rgba(255,255,255,0.50);
  --accent:              #B5FF47;
  --accent-foreground:   #0d1a00;
  --destructive:         #FF4D4D;
  --border:              rgba(255,255,255,0.07);
  --input:               rgba(255,255,255,0.07);
  --ring:                #B5FF47;
  --radius:              0.75rem;
  --sidebar:             #080808;
  --sidebar-foreground:  #F2F2F2;
  --sidebar-primary:     #B5FF47;
  --sidebar-primary-foreground: #0d1a00;
  --sidebar-accent:      rgba(181,255,71,0.10);
  --sidebar-accent-foreground: #B5FF47;
  --sidebar-border:      rgba(255,255,255,0.06);
  --sidebar-ring:        #B5FF47;
}

.dark {
  --background:          #080808;
  --foreground:          #F2F2F2;
  --card:                #111111;
  --card-foreground:     #F2F2F2;
  --popover:             #1a1a1a;
  --popover-foreground:  #F2F2F2;
  --primary:             #B5FF47;
  --primary-foreground:  #0d1a00;
  --secondary:           #1a1a1a;
  --secondary-foreground:#F2F2F2;
  --muted:               rgba(255,255,255,0.06);
  --muted-foreground:    rgba(255,255,255,0.50);
  --accent:              #B5FF47;
  --accent-foreground:   #0d1a00;
  --destructive:         #FF4D4D;
  --border:              rgba(255,255,255,0.07);
  --input:               rgba(255,255,255,0.07);
  --ring:                #B5FF47;
  --sidebar:             #080808;
  --sidebar-foreground:  #F2F2F2;
  --sidebar-primary:     #B5FF47;
  --sidebar-primary-foreground: #0d1a00;
  --sidebar-accent:      rgba(181,255,71,0.10);
  --sidebar-accent-foreground: #B5FF47;
  --sidebar-border:      rgba(255,255,255,0.06);
  --sidebar-ring:        #B5FF47;
}

/* ─── Base ──────────────────────────────────────────────── */
@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body, 'Inter', sans-serif);
  }
  html { scroll-behavior: smooth; }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display, 'Syne', sans-serif);
  }
}

/* ════════════════════════════════════════════════════════
   CEFIGO UTILITIES
   ════════════════════════════════════════════════════════ */

/* ─── Noise texture (replaces aurora) ───────────────────── */
.noise-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ─── Dot grid (subtle, not glowing) ────────────────────── */
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/* ─── Lime text highlight ────────────────────────────────── */
.text-lime { color: #B5FF47; }

.highlight {
  color: #B5FF47;
}

/* ─── App shell ──────────────────────────────────────────── */
.app-shell {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.app-content {
  flex: 1;
  padding: 2rem;
  max-width: 100%;
}

@media (max-width: 1279px) { .app-content { padding: 1.5rem; } }
@media (max-width: 767px)  { .app-content { padding: 1rem; }   }

/* ─── Sidebar ────────────────────────────────────────────── */
.sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  width: 256px;
  flex-shrink: 0;
  background: #080808;
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  z-index: 50;
  overflow-y: auto;
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
}

@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    transform: translateX(-100%);
  }
  .sidebar.is-open {
    transform: translateX(0);
    box-shadow: 8px 0 40px rgba(0,0,0,0.8);
  }
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0,0,0,0.65);
}

/* ─── Topbar ─────────────────────────────────────────────── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  background: rgba(8,8,8,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

@media (max-width: 767px) { .topbar { padding: 0 1rem; gap: 0.75rem; } }

/* ─── Nav items ──────────────────────────────────────────── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  transition: color 0.15s ease, background 0.15s ease;
  cursor: pointer;
  text-decoration: none;
}

.nav-item:hover {
  color: #F2F2F2;
  background: rgba(255,255,255,0.05);
}

.nav-item.is-active {
  color: #B5FF47;
  background: rgba(181,255,71,0.08);
  font-weight: 600;
}

.nav-item.is-active svg { color: #B5FF47; }

/* ─── Card ───────────────────────────────────────────────── */
.card {
  background: #111111;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 1.25rem;
}

.card:hover {
  border-color: rgba(255,255,255,0.11);
}

/* ─── Button system ──────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: var(--font-display, 'Syne', sans-serif);
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: filter 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.btn--primary {
  background: #B5FF47;
  color: #0d1a00;
}

.btn--primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn--ghost {
  background: transparent;
  color: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.12);
}

.btn--ghost:hover {
  background: rgba(255,255,255,0.05);
  color: #F2F2F2;
  border-color: rgba(255,255,255,0.2);
}

.btn--glass {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.10);
}

.btn--glass:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.16);
}

.btn--lg {
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  border-radius: 10px;
}

.btn--full { width: 100%; }

@media (max-width: 479px) {
  .btn--lg { padding: 0.625rem 1.25rem; font-size: 0.9375rem; }
}

/* ─── Auth layout ────────────────────────────────────────── */
.auth-layout {
  display: grid;
  grid-template-columns: minmax(320px, 480px) 1fr;
  min-height: 100vh;
}
@media (max-width: 1023px) { .auth-layout { grid-template-columns: 1fr; } }

.auth-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 1;
  background: #080808;
}
@media (max-width: 479px) {
  .auth-panel { padding: 2rem 1.25rem; justify-content: flex-start; padding-top: 3rem; }
}

.auth-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  background: #111111;
  border-left: 1px solid rgba(255,255,255,0.06);
  position: relative;
  overflow: hidden;
}
@media (max-width: 1023px) { .auth-hero { display: none; } }

/* ─── Marquee ────────────────────────────────────────────── */
.marquee-outer { overflow: hidden; width: 100%; }

.marquee-track {
  animation: marquee-track-scroll var(--marquee-duration, 35s) linear infinite;
}
.marquee-track--reverse { animation-direction: reverse; }

@keyframes marquee-track-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}

/* ─── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 1rem;
  background: rgba(8,8,8,0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  height: 60px;
  display: flex;
  align-items: center;
}
.navbar__inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── Badge / pill ───────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--success {
  background: rgba(34,197,94,0.12);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,0.18);
}

.badge--lime {
  background: rgba(181,255,71,0.12);
  color: #B5FF47;
  border: 1px solid rgba(181,255,71,0.22);
}

.badge--neutral {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.10);
}

/* ─── Tab buttons ────────────────────────────────────────── */
.tab-btn {
  padding: 0.5rem 1.125rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.40);
  transition: all 0.15s;
  font-family: var(--font-display, 'Syne', sans-serif);
}
.tab-btn.is-active {
  background: rgba(181,255,71,0.10);
  color: #B5FF47;
}

/* ─── Progress bar ───────────────────────────────────────── */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.07);
  border-radius: 999px;
  overflow: hidden;
}
.progress-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: #B5FF47;
  transition: width 0.6s ease;
}

/* ─── Card hover lift ────────────────────────────────────── */
.card-lift {
  transition: transform 0.22s cubic-bezier(0.16,1,0.3,1),
              border-color 0.2s ease;
}
.card-lift:hover {
  transform: translateY(-3px);
  border-color: rgba(181,255,71,0.14);
}

/* ─── Featured card (lime border glow) ───────────────────── */
.card-featured {
  position: relative;
  border-color: rgba(181,255,71,0.30) !important;
}

/* ─── Section helpers ────────────────────────────────────── */
.section { padding: 5rem 0; }
@media (max-width: 1023px) { .section { padding: 3.5rem 0; } }
@media (max-width: 767px)  { .section { padding: 2.5rem 0; } }

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
@media (max-width: 767px) { .container { padding: 0 1rem; } }

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(181,255,71,0.18), transparent);
  margin: 2rem 0;
}

/* ─── Nav links ──────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
@media (max-width: 767px) { .nav-links { display: none; } }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}
@media (max-width: 479px) { .nav-actions .btn--ghost { display: none; } }

/* ─── Card responsive ────────────────────────────────────── */
@media (max-width: 767px) {
  .card { padding: 1rem; border-radius: 12px; }
}

/* ─── Scrollbar ──────────────────────────────────────────── */
* { scrollbar-width: thin; scrollbar-color: rgba(181,255,71,0.15) transparent; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(181,255,71,0.15); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(181,255,71,0.28); }

/* ─── Skip link ──────────────────────────────────────────── */
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: #B5FF47;
  color: #0d1a00;
  font-weight: 700;
  border-radius: 0 0 8px 8px;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }

/* ════════════════════════════════════════════════════════
   PROFESSIONAL ANIMATIONS
   ════════════════════════════════════════════════════════ */

/* ─── Core keyframes ─────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fade-right {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes lime-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(181,255,71,0); }
  50%       { box-shadow: 0 0 0 8px rgba(181,255,71,0.06); }
}

/* ─── Hero entrance ──────────────────────────────────────── */
.hero-enter {
  opacity: 0;
  animation: fade-up 0.75s cubic-bezier(0.16,1,0.3,1) forwards;
}
.hero-enter-scale {
  opacity: 0;
  animation: scale-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
}

/* Stagger delays */
.delay-0  { animation-delay: 0s;    }
.delay-1  { animation-delay: 0.10s; }
.delay-2  { animation-delay: 0.20s; }
.delay-3  { animation-delay: 0.32s; }
.delay-4  { animation-delay: 0.44s; }
.delay-5  { animation-delay: 0.58s; }
.delay-6  { animation-delay: 0.72s; }

/* ─── Scroll-driven reveal ───────────────────────────────── */
/*
  CSS Scroll-Driven Animations — Chrome 115+, Edge 115+, Safari 17.2+
  Graceful fallback: visible in all other browsers.
*/
@supports (animation-timeline: view()) {
  .reveal {
    opacity: 0;
    transform: translateY(22px);
    animation: fade-up 0.65s cubic-bezier(0.16,1,0.3,1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 28%;
  }

  .reveal-fade {
    opacity: 0;
    animation: fade-in 0.55s ease both;
    animation-timeline: view();
    animation-range: entry 0% entry 25%;
  }

  .reveal-scale {
    opacity: 0;
    transform: scale(0.95);
    animation: scale-in 0.6s cubic-bezier(0.16,1,0.3,1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 28%;
  }

  /* Grid stagger offsets */
  .reveal-s1 { animation-delay: 0s;    }
  .reveal-s2 { animation-delay: 0.07s; }
  .reveal-s3 { animation-delay: 0.14s; }
  .reveal-s4 { animation-delay: 0.0s;  }
  .reveal-s5 { animation-delay: 0.07s; }
  .reveal-s6 { animation-delay: 0.14s; }
}

@supports not (animation-timeline: view()) {
  .reveal, .reveal-fade, .reveal-scale { opacity: 1; transform: none; }
}

/* ─── Dropdown entrance ──────────────────────────────────── */
.dropdown-enter {
  animation: slide-down 0.18s cubic-bezier(0.16,1,0.3,1) both;
}

/* ─── Lime pulse (CTA buttons) ───────────────────────────── */
.lime-pulse { animation: lime-pulse 3s ease-in-out infinite; }

/* ─── Respect reduced motion ─────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-enter, .hero-enter-scale, .reveal, .reveal-fade,
  .reveal-scale, .dropdown-enter, .lime-pulse {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Update `app/layout.tsx`**

Replace the entire file:

```tsx
import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "CEFIGO — Entra a la universidad de tus sueños",
  description:
    "La plataforma #1 en México para preparar tu examen de admisión a UNAM, IPN, UAM y COMIPEMS.",
  icons: {
    icon: [{ url: "/logos/ICO-mini.png" }],
    apple: [{ url: "/logos/ICO-mini.png" }],
    shortcut: [{ url: "/logos/ICO-mini.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${syne.variable} ${inter.variable} bg-[#080808] text-[#F2F2F2] antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: TypeScript check and commit**

```bash
npx tsc --noEmit
git add app/globals.css app/layout.tsx
git commit -m "design: near-black + lime foundation — Syne+Inter fonts, new CSS tokens, professional animations"
```

---

## Task 2: Landing page rebuild

**Files:**
- Modify: `app/page.tsx`

Read the current `app/page.tsx` first, then replace it entirely with the following. Keep all the same data arrays (`universities`, `features`, `courses`, `testimonials`, `faqs`) and SVG icon components unchanged. Only the JSX layout/styling changes.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// ── Icon components (unchanged from original) ─────────────
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#B5FF47" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12l5 5L20 7" stroke="#B5FF47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const FlameIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2z"/>
  </svg>
);

const universities = [
  "UNAM", "IPN", "UAM", "COMIPEMS", "EXANI-II", "CENEVAL",
  "Politécnico Nacional", "UNAM Licenciatura", "PREPA UNAM", "CCH",
  "UNAM", "IPN", "UAM", "COMIPEMS", "EXANI-II", "CENEVAL",
  "Politécnico Nacional", "UNAM Licenciatura", "PREPA UNAM", "CCH",
];

const features = [
  { icon: <BookIcon />, title: "Cursos estructurados", desc: "Lecciones en video ordenadas por el examen real. Sin relleno. Solo lo que entra." },
  { icon: <TargetIcon />, title: "Simulacros oficiales", desc: "Más de 25,000 preguntas reales. Cronómetro, mapa de reactivos y análisis por materia." },
  { icon: <CompassIcon />, title: "Plan personalizado con IA", desc: "Un diagnóstico detecta tus áreas débiles y genera una ruta semanal adaptada." },
  { icon: <UsersIcon />, title: "Mentores expertos", desc: "Sesiones 1-a-1 con estudiantes que ya aprobaron el examen al que tú te preparas." },
  { icon: <ChartIcon />, title: "Analítica de progreso", desc: "Ve tu probabilidad de ingreso evolucionar semana a semana. Gráficas reales." },
  { icon: <FlameIcon />, title: "Racha y gamificación", desc: "Logros, rachas y rankings que hacen que estudiar 30 min al día sea un hábito." },
];

const courses = [
  { slug: "unam",     tag: "Licenciatura", duration: "6 meses",  title: "Examen UNAM",        desc: "120 reactivos de 6 áreas. El banco más completo del país.",                     enrolled: "32,400" },
  { slug: "ipn",      tag: "Licenciatura", duration: "5 meses",  title: "Examen IPN",         desc: "Comipems + examen propio. Énfasis en razonamiento matemático y ciencias.",     enrolled: "21,200" },
  { slug: "uam",      tag: "Licenciatura", duration: "4 meses",  title: "Examen UAM",         desc: "Distinto por unidad. Cuajimalpa, Iztapalapa, Lerma, Xochimilco y más.",        enrolled: "9,120"  },
  { slug: "comipems", tag: "Bachillerato", duration: "3 meses",  title: "COMIPEMS",           desc: "128 reactivos para entrar a preparatoria en la Zona Metropolitana.",          enrolled: "24,870" },
  { slug: "exani",    tag: "Licenciatura", duration: "4 meses",  title: "EXANI-II (CENEVAL)", desc: "Pensamiento matemático, analítico y comprensión lectora.",                     enrolled: "12,300" },
  { slug: "intensivo",tag: "Popular",      duration: "30 días",  title: "Intensivo 30 días",  desc: "Recta final. Resumen ejecutivo y estrategia minuto a minuto para el examen.", enrolled: "6,890"  },
];

const testimonials = [
  { quote: "Empecé con 48 aciertos en el diagnóstico y terminé con 112 en el examen real. Los simulacros de CEFIGO son idénticos al formato UNAM.", name: "Ximena Ríos",       role: "Medicina · UNAM 2025",              initials: "XR" },
  { quote: "El plan personalizado me salvó. Trabajo medio tiempo y la app acomodaba mis sesiones en los huecos libres. Lo que más me ayudó.",          name: "Diego Hernández", role: "Ing. Mecatrónica · IPN 2025",       initials: "DH" },
  { quote: "Mi mentora también entró a la UAM hace dos años. Saber que alguien ya recorrió el camino cambió mi manera de estudiar por completo.",       name: "Valeria Márquez", role: "Diseño · UAM Xochimilco 2025",      initials: "VM" },
];

const faqs = [
  { q: "¿Qué pasa después de los 7 días gratis?",            a: "Si decides continuar, se cobra el plan elegido. Si no, el acceso simplemente pausa y no se te cobra nada. Te avisamos 48 h antes." },
  { q: "¿Puedo cambiar de plan después?",                     a: "Sí. Puedes subir o bajar de plan en cualquier momento. El cobro se ajusta proporcionalmente." },
  { q: "¿Los simulacros son exactamente iguales al real?",    a: "Replicamos el formato, número de reactivos, tiempo y tipos de preguntas oficiales. Banco actualizado cada ciclo." },
  { q: "¿Qué dispositivos son compatibles?",                  a: "Cualquier navegador moderno y apps nativas para iOS y Android. Tu progreso se sincroniza en todos." },
  { q: "¿Ofrecen beca o descuento?",                          a: "Programa de becas CEFI para estudiantes con promedio 9.0+ y situación económica limitada. Solicítala desde tu panel." },
  { q: "¿Cómo funciona la garantía Elite?",                   a: "Si cumpliste el 80% de tu plan y no apruebas, devolvemos el 100% de lo pagado." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F2F2F2]">
      {/* Noise texture */}
      <div className="noise-bg" aria-hidden="true" />

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="navbar" aria-label="Navegación principal">
        <div className="navbar__inner">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              CEFI<span className="text-[#B5FF47]">GO</span>
            </span>
          </Link>

          <div className="nav-links">
            {["Cursos", "Simulacros", "Mentores", "Precios"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-3 py-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <Link href="/login" className="btn btn--ghost text-sm py-2 px-4">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn btn--primary text-sm py-2 px-4">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        {/* Lime glow spot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(181,255,71,0.05) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 text-center">
          {/* Social proof pill */}
          <div className="hero-enter delay-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8">
            <span className="flex gap-0.5">
              {[0,1,2,3,4].map((i) => <StarIcon key={i} />)}
            </span>
            <span>+12,000 alumnos ya ingresaron</span>
          </div>

          {/* Main headline */}
          <h1
            className="hero-enter delay-1 text-5xl sm:text-6xl lg:text-[80px] xl:text-[96px] font-black leading-[0.95] tracking-tight mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Entra a la{" "}
            <span className="text-[#B5FF47]">universidad</span>
            <br />
            de tus sueños.
          </h1>

          <p className="hero-enter delay-2 text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            La plataforma de preparación #1 en México. Simulacros reales, plan personalizado y mentores que ya pasaron el examen.
          </p>

          <div className="hero-enter delay-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn btn--primary btn--lg lime-pulse">
              Empezar 7 días gratis
              <ArrowIcon />
            </Link>
            <Link href="/login" className="btn btn--ghost btn--lg">
              Ya tengo cuenta
            </Link>
          </div>

          <p className="hero-enter delay-4 text-xs text-white/25 mt-4">
            Sin tarjeta de crédito · Cancela en cualquier momento
          </p>
        </div>
      </section>

      {/* ── Universities marquee ─────────────────────────────── */}
      <div className="py-10 border-y border-white/6 overflow-hidden">
        <Marquee
          items={universities.map((u) => (
            <span key={u} className="text-sm font-semibold text-white/30 uppercase tracking-widest px-8 whitespace-nowrap">
              {u}
            </span>
          ))}
          duration={40}
        />
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/6">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/6">
            {[
              { value: 12000, suffix: "+", label: "Alumnos activos" },
              { value: 25000, suffix: "+", label: "Preguntas en el banco" },
              { value: 89, suffix: "%",   label: "Tasa de ingreso" },
              { value: 6,   suffix: "x",  label: "Más rápido que solo" },
            ].map((s) => (
              <div key={s.label} className="reveal reveal-s1 bg-[#080808] p-8 text-center">
                <p className="text-4xl font-black text-[#B5FF47] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="cursos" className="section">
        <div className="container">
          <div className="mb-14 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-3">Por qué CEFIGO</p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Todo lo que necesitas,<br />
              <span className="text-white/40">nada que no.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-s${(i % 3) + 1} card card-lift p-6 space-y-3`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60">
                  {f.icon}
                </div>
                <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ─────────────────────────────────────────── */}
      <section id="simulacros" className="section border-t border-white/6">
        <div className="container">
          <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-3">Rutas de preparación</p>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Elige tu examen.
              </h2>
            </div>
            <Link href="/register" className="btn btn--ghost text-sm shrink-0">
              Ver todos <ArrowIcon />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c, i) => (
              <Link
                key={c.slug}
                href="/register"
                className={`reveal reveal-s${(i % 3) + 1} card card-lift p-6 block group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5FF47] bg-[rgba(181,255,71,0.08)] border border-[rgba(181,255,71,0.18)] rounded-full px-2.5 py-1">
                    {c.tag}
                  </span>
                  <span className="text-xs text-white/30">{c.duration}</span>
                </div>
                <h3 className="font-black text-lg mb-2 group-hover:text-[#B5FF47] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {c.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed mb-4">{c.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  {c.enrolled} alumnos
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="section border-t border-white/6">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-3">Resultados reales</p>
            <h2 className="text-4xl lg:text-5xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              Ellos ya ingresaron.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`reveal reveal-s${i + 1} card p-6 space-y-4`}>
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map((s) => <StarIcon key={s} />)}
                </div>
                <p className="text-sm text-white/65 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/6">
                  <div className="w-8 h-8 rounded-full bg-[#B5FF47] flex items-center justify-center text-xs font-black text-[#0d1a00] shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="precios" className="section border-t border-white/6">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-3">Planes</p>
            <h2 className="text-4xl lg:text-5xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              Sin letra chica.
            </h2>
            <p className="text-white/40 mt-3 text-base">7 días gratis en cualquier plan. Sin tarjeta de crédito.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name: "Básico", price: "$299", period: "/mes", featured: false,
                features: ["Cursos en video", "10 simulacros/mes", "Analítica básica", "Comunidad CEFIGO"],
                missing: ["Mentores 1-a-1", "Garantía de ingreso"],
              },
              {
                name: "Elite", price: "$1,499", period: "/6 meses", featured: true,
                features: ["Todo en Básico", "Simulacros ilimitados", "Plan IA personalizado", "2 mentorías/mes", "Garantía de ingreso"],
                missing: [],
              },
              {
                name: "Anual", price: "$2,499", period: "/año", featured: false,
                features: ["Todo en Elite", "Mentorías ilimitadas", "Acceso a todos los exámenes", "Recursos descargables"],
                missing: [],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`reveal card p-6 space-y-5 ${plan.featured ? "card-featured border-[rgba(181,255,71,0.30)]" : ""}`}
              >
                {plan.featured && (
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#0d1a00] bg-[#B5FF47] rounded-full px-2.5 py-1 w-fit">
                    Más popular
                  </div>
                )}
                <div>
                  <p className="text-sm text-white/45 mb-1">{plan.name}</p>
                  <p className="text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                    {plan.price}
                    <span className="text-base font-medium text-white/35">{plan.period}</span>
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckIcon /> {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/25">
                      <XIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn btn--full text-sm py-2.5 ${plan.featured ? "btn--primary" : "btn--ghost"}`}
                >
                  Empezar gratis
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="section border-t border-white/6">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-3">FAQ</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              Preguntas frecuentes
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group border border-white/7 rounded-xl overflow-hidden bg-[#111111]">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-sm font-semibold text-white/80 hover:text-white transition-colors list-none">
                  {f.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30 group-open:rotate-180 transition-transform" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/6 pt-3">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="section border-t border-white/6">
        <div className="container text-center max-w-2xl mx-auto">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B5FF47] mb-4">Empieza hoy</p>
            <h2 className="text-5xl lg:text-6xl font-black leading-[1] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Tu lugar en la<br />
              universidad te espera.
            </h2>
            <p className="text-white/40 mb-8 text-base">
              7 días gratis. Sin tarjeta. Cancela cuando quieras.
            </p>
            <Link href="/register" className="btn btn--primary btn--lg lime-pulse inline-flex">
              Empezar ahora <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            CEFI<span className="text-[#B5FF47]">GO</span>
          </span>
          <p className="text-xs text-white/25 text-center">
            © 2026 CEFIGO · Todos los derechos reservados · México
          </p>
          <div className="flex gap-4">
            {["Privacidad", "Términos", "Contacto"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check and commit**

```bash
npx tsc --noEmit
git add app/page.tsx
git commit -m "design: landing page rebuild — lime hero, clean grid, professional reveal animations"
```

---

## Task 3: Auth pages

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/register/page.tsx`

Read both files first, then apply the styling updates. The auth logic (form handlers, Server Actions) stays unchanged — only classes and colors change.

- [ ] **Step 1: Update `app/(auth)/login/page.tsx`**

Find and replace ALL of these patterns:
1. `bg-[#0B0617]` or `bg-\[#0E0A18\]` → `bg-[#080808]`
2. `from-violet-600` / `to-pink-500` / `from-violet-500` gradient classes on `.auth-hero` or background → remove, replace with `bg-[#111111]`
3. `border-violet-500/20` → `border-[rgba(181,255,71,0.18)]`
4. `text-violet-400` → `text-[#B5FF47]`
5. `focus:border-violet-500` → `focus:border-[#B5FF47]/50`
6. `bg-violet-600` on buttons → `bg-[#B5FF47]` + `text-[#0d1a00]`
7. Aurora blob divs → remove entirely
8. `gradient-text` class → remove the class, wrap the text in `<span className="text-[#B5FF47]">`
9. `.btn--primary` already handles color from globals — just keep the class

Additionally, in the right panel (`.auth-hero`):
- Remove any `from-violet/to-pink` gradient background
- Replace with: `bg-[#111111]`
- The decorative element: a large centered text displaying `"CEFI"` + `"GO"` in Syne 800 with the GO in lime, at ~120px

- [ ] **Step 2: Apply same changes to `app/(auth)/register/page.tsx`**

Same find-and-replace pattern. The register page likely has the same auth shell structure.

- [ ] **Step 3: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "app/(auth)/login/page.tsx" "app/(auth)/register/page.tsx"
git commit -m "design: auth pages — lime accents, dark surface, remove purple gradients"
```

---

## Task 4: AppShell + Topbar

**Files:**
- Modify: `components/layout/AppShell.tsx`
- Modify: `components/layout/Topbar.tsx`

- [ ] **Step 1: Replace `components/layout/AppShell.tsx`**

Remove the aurora background entirely. Add the noise texture instead:

```tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ProfileProvider, type Profile } from "@/components/providers/ProfileProvider";

interface AppShellProps {
  children: React.ReactNode;
  profile: Profile;
}

export default function AppShell({ children, profile }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProfileProvider profile={profile}>
      <div className="relative min-h-screen bg-[#080808]">
        {/* Subtle noise texture */}
        <div className="noise-bg" aria-hidden="true" />

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="app-shell">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} profile={profile} />
          <div className="app-main">
            <Topbar onMenuClick={() => setSidebarOpen(true)} profile={profile} />
            <div className="app-content">{children}</div>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
```

- [ ] **Step 2: Replace `components/layout/Topbar.tsx`**

Keep all the logic (notifRef, userRef, handleLogout, initials) unchanged. Update only the JSX styling:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils/initials";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_pro: boolean;
  streak_days: number;
}

interface TopbarProps {
  onMenuClick: () => void;
  profile: Profile;
}

export default function Topbar({ onMenuClick, profile }: TopbarProps) {
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  const initials  = getInitials(profile.full_name);
  const firstName = profile.full_name.split(" ")[0];

  return (
    <header className="topbar">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="lg:hidden flex flex-col gap-1.5 p-1.5 rounded-lg hover:bg-white/6 transition-colors shrink-0"
      >
        <span className="block w-5 h-0.5 bg-white/60 rounded-full" />
        <span className="block w-5 h-0.5 bg-white/60 rounded-full" />
        <span className="block w-5 h-0.5 bg-white/60 rounded-full" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/7 text-white/35 text-sm cursor-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-xs">Buscar...</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            aria-label="Notificaciones"
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/45 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#B5FF47] rounded-full" />
          </button>

          {notifOpen && (
            <div className="dropdown-enter absolute right-0 top-12 w-72 rounded-2xl bg-[#1a1a1a] border border-white/8 shadow-2xl shadow-black/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/7 flex items-center justify-between">
                <p className="text-sm font-semibold">Notificaciones</p>
                <span className="text-[10px] text-white/35 bg-white/5 px-2 py-0.5 rounded-full">0 nuevas</span>
              </div>
              <div className="py-10 text-center">
                <p className="text-sm text-white/35">Sin notificaciones</p>
                <p className="text-xs text-white/20 mt-1">Te avisaremos cuando haya novedades</p>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 ml-1 border-l border-white/7 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#B5FF47] flex items-center justify-center text-xs font-black text-[#0d1a00] select-none shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white/75 leading-none">{firstName}</p>
              {profile.role === "admin" && (
                <p className="text-[10px] text-[#B5FF47] leading-none mt-0.5">Admin</p>
              )}
            </div>
            <svg className="hidden sm:block w-3 h-3 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {userOpen && (
            <div className="dropdown-enter absolute right-0 top-12 w-52 rounded-2xl bg-[#1a1a1a] border border-white/8 shadow-2xl shadow-black/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/7">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B5FF47] flex items-center justify-center text-xs font-black text-[#0d1a00] shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{profile.full_name}</p>
                    <p className="text-xs text-white/35 truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {profile.is_pro ? (
                    <span className="badge badge--lime text-[10px]">Pro</span>
                  ) : (
                    <span className="badge badge--neutral text-[10px]">Gratuito</span>
                  )}
                </div>
              </div>

              <div className="py-1">
                {[
                  { href: "/profile",  label: "Mi perfil" },
                  { href: "/settings", label: "Configuración" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/4 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {profile.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#B5FF47] hover:bg-[rgba(181,255,71,0.06)] transition-colors"
                  >
                    Panel Admin
                  </Link>
                )}

                <div className="border-t border-white/7 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/6 transition-colors disabled:opacity-40"
                  >
                    {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: TypeScript check and commit**

```bash
npx tsc --noEmit
git add components/layout/AppShell.tsx components/layout/Topbar.tsx
git commit -m "design: AppShell removes aurora, Topbar gets lime avatar + dark dropdowns"
```

---

## Task 5: Sidebar

**Files:**
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Replace `components/layout/Sidebar.tsx`**

Keep all nav section data, icon components, and logic. Replace only the JSX/styling:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils/initials";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_pro: boolean;
  streak_days: number;
}

interface NavItem    { href: string; label: string; icon: React.ReactNode; }
interface NavSection { title: string; items: NavItem[]; }

const DashIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const CoursesIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const ExamIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const MentorIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const ChartIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const TrophyIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16M10 14.66V17a1 1 0 01-.88.98L8 18h8l-1.12-.02A1 1 0 0114 17v-2.34"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>;
const ResourcesIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const ProfileIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SettingsIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const AdminIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const LogoutIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const navSections: NavSection[] = [
  {
    title: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard",  icon: <DashIcon /> },
      { href: "/courses",   label: "Mis cursos", icon: <CoursesIcon /> },
      { href: "/exam",      label: "Simulacros", icon: <ExamIcon /> },
      { href: "/mentors",   label: "Mentorías",  icon: <MentorIcon /> },
    ],
  },
  {
    title: "Mi progreso",
    items: [
      { href: "/analytics", label: "Analítica", icon: <ChartIcon /> },
      { href: "/profile",   label: "Logros",    icon: <TrophyIcon /> },
      { href: "/resources", label: "Recursos",  icon: <ResourcesIcon /> },
    ],
  },
  {
    title: "Cuenta",
    items: [
      { href: "/profile",  label: "Perfil",        icon: <ProfileIcon /> },
      { href: "/settings", label: "Configuración", icon: <SettingsIcon /> },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function Sidebar({ open, onClose, profile }: SidebarProps) {
  const pathname  = usePathname();
  const [loading, setLoading] = useState(false);
  const initials  = getInitials(profile.full_name);

  async function handleLogout() {
    setLoading(true);
    onClose();
    await logout();
  }

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/6">
        <span className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          CEFI<span className="text-[#B5FF47]">GO</span>
        </span>
      </div>

      {/* User mini-card */}
      <div className="mx-3 mt-3 p-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#B5FF47] flex items-center justify-center text-xs font-black text-[#0d1a00] shrink-0 select-none">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate leading-snug">{profile.full_name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {profile.is_pro ? (
              <span className="text-[10px] text-[#B5FF47] font-semibold">Pro</span>
            ) : (
              <span className="text-[10px] text-white/30">Gratuito</span>
            )}
            {profile.role === "admin" && (
              <span className="text-[10px] text-[#B5FF47]/60">· Admin</span>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto mt-2" aria-label="Navegación principal">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/20">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-item ${isActive ? "is-active" : ""}`}
                      onClick={onClose}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Admin */}
        {profile.role === "admin" && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#B5FF47]/40">
              Administración
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/admin"
                  className={`nav-item ${pathname.startsWith("/admin") ? "is-active" : ""}`}
                  onClick={onClose}
                >
                  <AdminIcon />
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Logout */}
        <div>
          <button
            className="nav-item w-full text-left text-red-400/70 hover:text-red-400 hover:bg-red-500/8 disabled:opacity-40"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogoutIcon />
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </nav>

      {/* Upgrade banner */}
      {!profile.is_pro && (
        <div className="p-3">
          <div className="rounded-xl p-4 bg-[#111111] border border-white/7">
            <p className="text-xs font-bold text-white/80 mb-1">Sube a Elite</p>
            <p className="text-[11px] text-white/35 mb-3 leading-snug">
              Mentores en vivo y simulacros sin límite
            </p>
            <Link
              href="/suscribirse"
              className="block text-center text-xs font-bold py-2 px-3 rounded-lg bg-[#B5FF47] text-[#0d1a00] hover:brightness-105 transition-all"
            >
              Ver planes
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: TypeScript check and commit**

```bash
npx tsc --noEmit
git add components/layout/Sidebar.tsx
git commit -m "design: sidebar — lime active states, lime avatar, clean upgrade banner"
```

---

## Task 6: Dashboard page

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`
- Modify: `app/(app)/dashboard/DashboardGreeting.tsx`
- Modify: `app/(app)/dashboard/DashboardStreakStat.tsx`

Read all three files first.

- [ ] **Step 1: Update `app/(app)/dashboard/page.tsx`**

The dashboard page uses `.card` and color classes. Apply these replacements:
1. `text-violet-400` → `text-[#B5FF47]`
2. `text-pink-400` → `text-white/60`
3. `text-cyan-400` → `text-white/60`
4. Stat card icons: all use `text-[#B5FF47]` for one key stat, rest use `text-white/50`
5. Progress bar fills: replace `from-[#7C3AED] to-[#A78BFA]` with `bg-[#B5FF47]`
6. Any `bg-violet-500/10` → `bg-[rgba(181,255,71,0.08)]`
7. `.card` classes: already handled by globals.css — just keep as-is
8. "Continuar curso" buttons: keep `.btn--primary` class (now lime from globals)

- [ ] **Step 2: Update `app/(app)/dashboard/DashboardGreeting.tsx`**

Read and replace:
1. Gradient text (`gradient-text` class) → plain white text, with `<span className="text-[#B5FF47]">` on the user's name
2. `from-violet` / `to-pink` background gradients → `bg-[#111111]`
3. Streak counter: replace amber color with `text-[#B5FF47]`
4. CTA button: keep `.btn--primary`

- [ ] **Step 3: Update `app/(app)/dashboard/DashboardStreakStat.tsx`**

Read and replace:
1. Flame/streak icon colors: `text-amber-400` or `text-orange-400` → `text-[#B5FF47]`
2. Progress fills: `bg-amber-500` → `bg-[#B5FF47]`
3. Ring stroke colors: `stroke="[#F59E0B]"` → `stroke="#B5FF47"`

- [ ] **Step 4: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/dashboard/page.tsx" "app/(app)/dashboard/DashboardGreeting.tsx" "app/(app)/dashboard/DashboardStreakStat.tsx"
git commit -m "design: dashboard — lime stats, clean cards, remove violet/pink/cyan accents"
```

---

## Task 7: Course and lesson pages

**Files:**
- Modify: `app/(app)/courses/page.tsx`
- Modify: `app/(app)/courses/[slug]/page.tsx`
- Modify: `app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx`
- Modify: `components/courses/CourseTabs.tsx`

Read each file, then apply:

- [ ] **Step 1: Color pass on all four files**

For each file, find and replace:
1. `text-violet-400` / `text-violet-300` → `text-[#B5FF47]`
2. `bg-violet-500/10` → `bg-[rgba(181,255,71,0.08)]`
3. `border-violet-500/20` → `border-[rgba(181,255,71,0.18)]`
4. `text-violet-600` / `bg-violet-600` → `bg-[#B5FF47]` + `text-[#0d1a00]`
5. `from-violet-600 to-pink-500` gradient buttons → remove gradient, use `bg-[#B5FF47] text-[#0d1a00]` or keep `.btn--primary`
6. Progress bars `background: linear-gradient(90deg, #7C3AED, #A78BFA)` → `background: #B5FF47`
7. Tab buttons `.tab-btn.is-active` is handled in globals.css — just keep the `is-active` class
8. Course accent colors in course cards: The individual course `accent` colors (`#A78BFA`, `#F97316`, etc.) can be simplified — use a single `text-[#B5FF47]` for the tag/icon on hover, or keep course-specific accents if they are not violet (orange, cyan, amber are fine; replace violet `#A78BFA` with `#B5FF47`)
9. `backdrop-filter` / `backdrop-blur` inline styles → remove
10. Video player container: keep dark bg `#000` with lime progress bar

- [ ] **Step 2: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/courses/page.tsx" "app/(app)/courses/[slug]/page.tsx" "app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx" components/courses/CourseTabs.tsx
git commit -m "design: course pages — lime accents, clean progress bars, no violet"
```

---

## Task 8: Exam pages

**Files:**
- Modify: `app/(app)/exam/page.tsx`
- Modify: `app/(app)/exam/[examId]/page.tsx`

Read both files, then apply:

- [ ] **Step 1: Color pass on exam pages**

1. `text-violet-400` → `text-[#B5FF47]`
2. `bg-violet-500/10` → `bg-[rgba(181,255,71,0.08)]`
3. `border-violet-500/20` → `border-[rgba(181,255,71,0.18)]`
4. Timer circle stroke: `stroke="#A78BFA"` → `stroke="#B5FF47"`
5. Correct answer highlight: `bg-emerald-500/10 border-emerald-500/30 text-emerald-300` → keep emerald (green = correct is universal)
6. Wrong answer highlight: `bg-red-500/10 border-red-500/30 text-red-400` → keep red
7. Selected option border: `border-violet-500` → `border-[#B5FF47]`
8. "Comprobar" button: `.btn--primary` class (lime from globals)
9. Progress bar fill: `bg-violet-600` → `bg-[#B5FF47]`
10. Subject breakdown bars: per-subject colors (emerald, blue, violet, amber, pink, orange) — replace violet with `#B5FF47`, keep others
11. Score/results display: lime for passing score number
12. `from-[#1a0f2e]` or similar purple-tinted backgrounds → `bg-[#111111]`

- [ ] **Step 2: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/exam/page.tsx" "app/(app)/exam/[examId]/page.tsx"
git commit -m "design: exam pages — lime timer, lime selected state, clean subject bars"
```

---

## Task 9: Remaining app pages

**Files:**
- Modify: `app/(app)/profile/page.tsx`
- Modify: `app/(app)/analytics/page.tsx`
- Modify: `app/(app)/settings/page.tsx`
- Modify: `app/(app)/resources/page.tsx`
- Modify: `app/(app)/suscribirse/page.tsx`

Read each file. Apply the same color pass:

- [ ] **Step 1: Universal color replacements (all 5 files)**

Search-and-replace in every file:
- `text-violet-400` / `text-violet-300` → `text-[#B5FF47]`
- `bg-violet-500/10` / `bg-violet-600/10` → `bg-[rgba(181,255,71,0.08)]`
- `border-violet-500/20` → `border-[rgba(181,255,71,0.18)]`
- `bg-violet-600` (filled button) → `bg-[#B5FF47]` + ensure `text-[#0d1a00]`
- `from-violet-600 to-pink-500` / `from-violet-500 to-pink-500` gradients → remove, use `bg-[#B5FF47]`
- `gradient-text` class → replace with plain text + `<span className="text-[#B5FF47]">` on the key word
- `aurora-bg` / `aurora-blob` divs → remove
- `#0B0617` / `#0E0A18` background → `#080808`
- `#1a0f2e` dropdown/popover bg → `#1a1a1a`
- Stripe/payment button: keep orange or neutral color, NOT violet
- `badge--violet` → `badge--lime`

**Suscribirse page specifically:**
- Featured plan card: replace violet gradient border with lime border (`card-featured` class)
- Plan cards: keep white/neutral for basic, lime for featured, dark for annual
- CTA: `.btn--primary` (lime)
- Remove `gradient-text-shimmer` shimmer animation from any heading
- Transfer payment icon: neutral white/dark, not violet

- [ ] **Step 2: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/profile/page.tsx" "app/(app)/analytics/page.tsx" "app/(app)/settings/page.tsx" "app/(app)/resources/page.tsx" "app/(app)/suscribirse/page.tsx"
git commit -m "design: app pages — lime accents throughout, remove all purple/violet"
```

---

## Task 10: Admin panel — lime accent

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `app/(admin)/admin/layout.tsx`
- Modify: `app/(admin)/admin/page.tsx`
- Modify: `app/(admin)/admin/lecciones/page.tsx`
- Modify: `app/(admin)/admin/examenes/page.tsx`
- Modify: `app/(admin)/admin/recursos/page.tsx`
- Modify: `app/(admin)/admin/pagos/page.tsx`
- Modify: `app/(admin)/admin/usuarios/page.tsx`
- Modify: `components/admin/CheckpointEditor.tsx`

The admin panel was designed with amber (`#F59E0B`) accent. Replace amber with lime (`#B5FF47`) for visual consistency across the app.

- [ ] **Step 1: Amber → Lime replacement (all admin files)**

In every admin file, search-and-replace:
- `text-amber-400` → `text-[#B5FF47]`
- `bg-amber-500/10` → `bg-[rgba(181,255,71,0.08)]`
- `bg-amber-500/15` → `bg-[rgba(181,255,71,0.10)]`
- `bg-amber-500/20` → `bg-[rgba(181,255,71,0.12)]`
- `border-amber-500/20` → `border-[rgba(181,255,71,0.18)]`
- `border-amber-500/15` → `border-[rgba(181,255,71,0.14)]`
- `text-amber-300` → `text-[#B5FF47]`
- `hover:text-amber-300` → `hover:text-[#CBFF6A]`
- `bg-amber-500` (filled) → `bg-[#B5FF47]`
- `text-amber-400 bg-amber-500/10 border-amber-500/20` (the common badge pattern) → `text-[#B5FF47] bg-[rgba(181,255,71,0.08)] border-[rgba(181,255,71,0.18)]`
- `shadow-amber-900/20` → `shadow-black/30`
- `"Panel Admin"` label badge: was amber, now lime
- `AdminSidebar.tsx` active state: was amber gradient → now lime (same as main sidebar)

- [ ] **Step 2: Admin layout background**

In `app/(admin)/admin/layout.tsx`, update `bg-[#0a0a0f]` → `bg-[#080808]`.
In `components/admin/AdminSidebar.tsx`, update `bg-[#0d0d0f]` → `bg-[#080808]`.

- [ ] **Step 3: TypeScript check and commit**

```bash
npx tsc --noEmit
git add "components/admin/AdminSidebar.tsx" "app/(admin)/admin/layout.tsx" "app/(admin)/admin/page.tsx" "app/(admin)/admin/lecciones/page.tsx" "app/(admin)/admin/examenes/page.tsx" "app/(admin)/admin/recursos/page.tsx" "app/(admin)/admin/pagos/page.tsx" "app/(admin)/admin/usuarios/page.tsx" "components/admin/CheckpointEditor.tsx"
git commit -m "design: admin panel — amber → lime accent, consistent with main app"
```

---

## Self-Review

**Spec coverage:**

| Requirement | Task |
|-------------|------|
| Near-black background `#080808` everywhere | Task 1 (tokens), Task 4-10 (page-by-page) |
| Single lime `#B5FF47` accent | Task 1 (tokens), all tasks |
| Remove aurora blobs | Task 1 (CSS removed), Task 4 (AppShell) |
| Remove glassmorphism / backdrop-filter | Task 1 (CSS), Task 4 (shell), Task 7-9 (inline styles) |
| Syne 800 display font | Task 1 (layout.tsx) |
| Inter body font | Task 1 (layout.tsx) |
| Scroll-driven reveal animations | Task 1 (globals.css `.reveal`) |
| Professional stagger animations | Task 1 (`.delay-*`, `.reveal-s*`) |
| No gradient text shimmer | Task 1 (removed), Task 9 (suscribirse) |
| Landing page rebuild | Task 2 |
| Auth pages lime | Task 3 |
| Topbar dark dropdowns + lime avatar | Task 4 |
| Sidebar lime active states | Task 5 |
| Dashboard lime | Task 6 |
| Course pages lime | Task 7 |
| Exam pages lime | Task 8 |
| Profile/Analytics/Settings/Resources/Suscribirse | Task 9 |
| Admin amber → lime | Task 10 |

**Placeholder scan:** Tasks 3, 6, 7, 8, 9 use "read and replace" instructions rather than full code — this is intentional since those files are large and the changes are systematic find-and-replace operations that a subagent can execute reliably. Critical new code (globals.css, layout.tsx, landing page, AppShell, Topbar, Sidebar) is given in full.

**Type consistency:** `#B5FF47` and `#0d1a00` used consistently as the lime/lime-foreground pair throughout. No mixing of `text-lime` utility class and inline `text-[#B5FF47]` — all inline for precision.
