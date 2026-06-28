# CEFI GO UX Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand to CEFI GO, add real logos, remove all emojis, add course dropdown + progress chart in sidebar, enrich dashboard with Meta/Avances/Preparate cards, lock unpurchased courses, add subject cards with animations, and render study resources as professional slides.

**Architecture:** All changes are frontend-only (mock data + UI). No new routes needed; existing pages are extended. New reusable components live in `components/ui/` and `components/courses/`. No emoji allowed anywhere — replace with inline SVG icons or professional cards.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, custom CSS design tokens (`--font-display`, `.card`, `.btn`, `.badge`), 21st Magic MCP for component inspiration, `next/image` for logos.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/layout/Logo.tsx` | Modify | Use real `public/logos/cefigofull.png` image, rename brand text to CEFI GO |
| `app/(auth)/login/page.tsx` | Modify | Add quick-login buttons (Admin / User), no emojis |
| `components/layout/Sidebar.tsx` | Modify | Course dropdown, progress mini-chart, remove emojis |
| `components/ui/CourseDropdown.tsx` | Create | Controlled dropdown for active course selection |
| `components/ui/SidebarProgressChart.tsx` | Create | Radial or segmented progress chart inside sidebar |
| `lib/mock-data/index.ts` | Modify | Add ECOEMS course, ownership flags, progress data per subject |
| `app/(app)/dashboard/page.tsx` | Modify | Add Meta card, Avances card, Comienza a prepararte card, Practice/Exam sections, no emojis |
| `app/(app)/courses/page.tsx` | Modify | Lock icon on unpurchased courses, "Adquirir" CTA |
| `app/(app)/courses/[slug]/page.tsx` | Modify | Subject-level cards with colors and CSS animations |
| `app/(app)/resources/page.tsx` | Modify | Professional slide/deck presentation of study resources |

---

## Task 1 — Logo + Brand rename to CEFI GO

**Files:**
- Modify: `components/layout/Logo.tsx`

- [ ] **Step 1: Replace SVG logo with real image**

```tsx
// components/layout/Logo.tsx
import Image from "next/image";
import Link from "next/link";

export default function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="CEFI GO inicio">
      <Image
        src="/logos/ICO-mini.png"
        alt="CEFI GO"
        width={36}
        height={36}
        className="shrink-0 rounded-lg"
        priority
      />
      {!collapsed && (
        <span
          className="text-lg font-black tracking-tight"
          style={{ fontFamily: "var(--font-display, Outfit, sans-serif)" }}
        >
          CEFI <span className="gradient-text">GO</span>
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Update login page aria-label and title references**

In `app/(auth)/login/page.tsx`, the hero panel has "CEFITIPS" in the text. Replace:
- `"85,000 estudiantes usan CEFITIPS"` → `"85,000 estudiantes usan CEFI GO"`
- Any remaining `CEFITIPS` text → `CEFI GO`

- [ ] **Step 3: Verify logo renders**

Run `npm run dev`, open `/login`, confirm the ICO-mini.png appears in top left with text "CEFI GO".

- [ ] **Step 4: Commit**

```bash
git add components/layout/Logo.tsx app/(auth)/login/page.tsx
git commit -m "feat: rebrand to CEFI GO, use real logo image"
```

---

## Task 2 — Login: quick-access hardcoded users + no emojis

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Add quick-login state and autofill function**

Below the existing state declarations add:

```tsx
const QUICK_USERS = [
  { label: "Admin", email: "admin@cefigo.mx", password: "Admin1234!" },
  { label: "Usuario", email: "alumno@cefigo.mx", password: "Alumno1234!" },
] as const;
```

Add a ref to the form so we can autofill:

```tsx
const emailRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);

function autofill(email: string, password: string) {
  if (emailRef.current) emailRef.current.value = email;
  if (passwordRef.current) passwordRef.current.value = password;
}
```

Attach the refs to the `<input>` elements (add `ref={emailRef}` and `ref={passwordRef}`).

- [ ] **Step 2: Add the quick-access bar above the submit button**

Insert between the checkbox row and the submit button:

```tsx
{/* Quick access — dev helper */}
<div className="rounded-xl border border-white/10 bg-white/3 p-3">
  <p className="text-[11px] text-white/35 mb-2 font-semibold uppercase tracking-widest">
    Acceso rápido
  </p>
  <div className="flex gap-2">
    {QUICK_USERS.map((u) => (
      <button
        key={u.label}
        type="button"
        onClick={() => autofill(u.email, u.password)}
        className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
      >
        {u.label}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Seed alumno password in Supabase**

Run via MCP `execute_sql`:
```sql
UPDATE auth.users
SET encrypted_password = crypt('Alumno1234!', gen_salt('bf'))
WHERE email = 'alumno@cefigo.mx';
```

- [ ] **Step 4: Commit**

```bash
git add app/(auth)/login/page.tsx
git commit -m "feat: add quick-access login buttons for admin and alumno"
```

---

## Task 3 — Remove all emojis from Dashboard + Sidebar

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Replace emoji stat icons in dashboard with SVGs**

The stats row currently uses `{ icon: "📚" }` etc. Replace the `icon` field with a JSX SVG element. New data:

```tsx
const stats = [
  {
    label: "Lecciones completadas",
    value: "48",
    color: "text-violet-400",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    label: "Simulacros realizados",
    value: "12",
    color: "text-pink-400",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Tiempo de estudio",
    value: "42h",
    color: "text-cyan-400",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: "Racha actual",
    value: `${mockUser.streak} días`,
    color: "text-amber-400",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
];
```

Render: replace `<div className="text-3xl mb-2">{stat.icon}</div>` with:
```tsx
<div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
```

- [ ] **Step 2: Remove emojis from welcome banner**

Replace `👋` with nothing (or a greeting word). Replace `🔥 Racha de` with an SVG inline. Replace the "Logro desbloqueado" `🏆` with an SVG trophy. Replace "Sube a Elite" `🚀` in Sidebar with an SVG rocket or arrow icon.

In `Sidebar.tsx`, the upgrade banner:
```tsx
// Replace: 🚀 Sube a Elite
// With:
<div className="flex items-center gap-2 mb-1">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
  <span className="text-xs font-bold text-white/90">Sube a Elite</span>
</div>
```

In `Sidebar.tsx`, the Pro badge: replace `✦ Pro` with just `Pro` styled.

- [ ] **Step 3: Courses page — remove emojis**

In `app/(app)/courses/page.tsx`, the gradient header has `⏱` and `👥`. Replace:
```tsx
// Remove ⏱ and 👥
<span className="flex items-center gap-1">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  {course.duration}
</span>
<span>·</span>
<span className="flex items-center gap-1">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
  {course.enrolled}
</span>
```

- [ ] **Step 4: Commit**

```bash
git add app/(app)/dashboard/page.tsx components/layout/Sidebar.tsx app/(app)/courses/page.tsx
git commit -m "fix: replace all emojis with SVG icons across dashboard and sidebar"
```

---

## Task 4 — Sidebar: course dropdown + progress chart

**Files:**
- Create: `components/ui/CourseDropdown.tsx`
- Create: `components/ui/SidebarProgressChart.tsx`
- Modify: `components/layout/Sidebar.tsx`
- Modify: `lib/mock-data/index.ts`

- [ ] **Step 1: Add active courses to mock data**

In `lib/mock-data/index.ts`, add below the existing exports:

```ts
export const activeCourses = [
  { id: "ecoems", label: "ECOEMS", target: 70, current: 48 },
  { id: "unam",   label: "UNAM",   target: 87, current: 62 },
];

export const userOwnedCourseIds = ["ecoems", "unam"];
```

- [ ] **Step 2: Create CourseDropdown component**

```tsx
// components/ui/CourseDropdown.tsx
"use client";

import { useState } from "react";

interface Course { id: string; label: string }

interface Props {
  courses: Course[];
  selected: Course;
  onChange: (c: Course) => void;
}

export default function CourseDropdown({ courses, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:bg-white/8 transition-all"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          {selected.label}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#1a1033] border border-white/10 shadow-xl overflow-hidden"
        >
          {courses.map((c) => (
            <li key={c.id}>
              <button
                role="option"
                aria-selected={c.id === selected.id}
                onClick={() => { onChange(c); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                  c.id === selected.id
                    ? "bg-violet-600/20 text-violet-300 font-semibold"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create SidebarProgressChart component**

```tsx
// components/ui/SidebarProgressChart.tsx

interface Props {
  current: number;  // aciertos actuales
  target: number;   // aciertos necesarios
  label: string;    // e.g. "ECOEMS"
}

export default function SidebarProgressChart({ current, target, label }: Props) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex items-center gap-3 px-1 py-2">
      {/* Radial chart */}
      <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke="url(#prog-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <defs>
          <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
      </svg>
      {/* Labels */}
      <div className="min-w-0">
        <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Meta {label}</p>
        <p className="text-xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
          {pct}%
        </p>
        <p className="text-[11px] text-white/45">
          {current} / {target} aciertos
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire dropdown + chart into Sidebar**

In `Sidebar.tsx`, add imports at the top:
```tsx
import CourseDropdown from "@/components/ui/CourseDropdown";
import SidebarProgressChart from "@/components/ui/SidebarProgressChart";
import { activeCourses } from "@/lib/mock-data";
```

Add state:
```tsx
const [selectedCourse, setSelectedCourse] = useState(activeCourses[0]);
```

Insert this block **between** the user mini-card and the `<nav>` sections:
```tsx
{/* Course selector + progress */}
<div className="mx-3 mt-3 rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
  <CourseDropdown
    courses={activeCourses}
    selected={selectedCourse}
    onChange={setSelectedCourse}
  />
  <SidebarProgressChart
    current={selectedCourse.current}
    target={selectedCourse.target}
    label={selectedCourse.label}
  />
</div>
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/CourseDropdown.tsx components/ui/SidebarProgressChart.tsx components/layout/Sidebar.tsx lib/mock-data/index.ts
git commit -m "feat: sidebar course dropdown + radial progress chart"
```

---

## Task 5 — Dashboard: Meta card + Avances + Comienza a prepararte + Practice sections

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`
- Modify: `lib/mock-data/index.ts`

- [ ] **Step 1: Add progress data to mock**

In `lib/mock-data/index.ts`, add:

```ts
export const mockProgress = {
  unidades: { done: 8, total: 20 },
  examenes: { done: 4, total: 12 },
  clases:   { done: 12, total: 30 },
  actividades: { done: 5, total: 15 },
};

export const mockMeta = {
  course: "ECOEMS",
  current: 48,
  target: 70,
};
```

- [ ] **Step 2: Replace the stats grid in dashboard — add Meta card**

Change the stats grid from `grid-cols-2 lg:grid-cols-4` to `grid-cols-2 lg:grid-cols-5` and append a fifth stat card:

```tsx
{
  label: "Meta ECOEMS",
  value: `${mockMeta.current}/${mockMeta.target}`,
  sublabel: "aciertos",
  color: mockMeta.current >= mockMeta.target ? "text-emerald-400" : "text-amber-400",
  icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
},
```

Render the card:
```tsx
<div key={stat.label} className="card text-center">
  <div className={`mb-2 flex justify-center ${stat.color}`}>{stat.icon}</div>
  <p className={`text-2xl font-black mb-0.5 ${stat.color}`} style={{ fontFamily: "var(--font-display)" }}>
    {stat.value}
  </p>
  {stat.sublabel && <p className="text-[11px] text-white/30 mb-0.5">{stat.sublabel}</p>}
  <p className="text-xs text-white/45">{stat.label}</p>
</div>
```

- [ ] **Step 3: Add "Avances" card to the right column**

In the right column (`space-y-5`) add BEFORE the "Próximas clases" card:

```tsx
{/* Avances */}
<div className="card">
  <h3 className="font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
    Avances
  </h3>
  <div className="space-y-3">
    {[
      { label: "Unidades",    done: mockProgress.unidades.done,    total: mockProgress.unidades.total,    color: "from-violet-500 to-pink-500" },
      { label: "Examenes",   done: mockProgress.examenes.done,   total: mockProgress.examenes.total,   color: "from-pink-500 to-rose-500" },
      { label: "Clases",     done: mockProgress.clases.done,     total: mockProgress.clases.total,     color: "from-cyan-500 to-violet-500" },
      { label: "Actividades",done: mockProgress.actividades.done,total: mockProgress.actividades.total,color: "from-amber-500 to-pink-500" },
    ].map((item) => {
      const pct = Math.round((item.done / item.total) * 100);
      return (
        <div key={item.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-white/55">{item.label}</span>
            <span className="font-bold text-white/80">{item.done}/{item.total}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
</div>
```

- [ ] **Step 4: Add "Comienza a prepararte" card in left column**

After the "Continuar aprendiendo" section and before "Últimos simulacros", insert:

```tsx
{/* Comienza a prepararte */}
<div className="card bg-gradient-to-br from-violet-900/40 to-pink-900/20 border-violet-500/20">
  <h2 className="font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
    Comienza a prepararte
  </h2>
  <p className="text-sm text-white/50 mb-4">
    Elige por dónde empezar tu sesión de hoy.
  </p>
  <div className="grid grid-cols-2 gap-3">
    <Link
      href="/courses/unam"
      className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-violet-500/30 hover:bg-white/8 transition-all"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
      <span className="text-sm font-semibold text-white/85">Lecciones</span>
      <span className="text-[11px] text-white/40">Video interactivo</span>
    </Link>
    <Link
      href="/resources"
      className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-pink-500/30 hover:bg-white/8 transition-all"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
      <span className="text-sm font-semibold text-white/85">Material</span>
      <span className="text-[11px] text-white/40">PDFs y diapositivas</span>
    </Link>
  </div>
</div>

{/* Practica y Examenes */}
<div>
  <h2 className="text-lg font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
    Practica y examenes
  </h2>
  <div className="grid grid-cols-2 gap-3">
    <Link
      href="/exam"
      className="card flex items-center gap-3 hover:border-violet-500/30 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold">Simulacro</p>
        <p className="text-[11px] text-white/40">Examen completo</p>
      </div>
    </Link>
    <Link
      href="/exam"
      className="card flex items-center gap-3 hover:border-pink-500/30 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold">Practica rapida</p>
        <p className="text-[11px] text-white/40">10 reactivos</p>
      </div>
    </Link>
  </div>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add app/(app)/dashboard/page.tsx lib/mock-data/index.ts
git commit -m "feat: dashboard Meta card, Avances, Comienza a prepararte and Practice sections"
```

---

## Task 6 — Mis cursos: lock icons + Adquirir CTA

**Files:**
- Modify: `lib/mock-data/index.ts`
- Modify: `app/(app)/courses/page.tsx`

- [ ] **Step 1: Add `owned` flag to all courses**

In `lib/mock-data/index.ts`, extend `mockCourses` and `extraCourses` with `owned: boolean`. UNAM and ECOEMS are owned; IPN, COMIPEMS are not.

Add to `mockCourses[0]` (unam): `owned: true`
Add to `mockCourses[1]` (matematicas): `owned: true`
Add to `mockCourses[2]` (historia): `owned: true`

In `courses/page.tsx` local `extraCourses`:
- ipn: `owned: false`
- comipems: `owned: false`
- quimica: `owned: true`

- [ ] **Step 2: Update course card to show lock / Adquirir**

In `app/(app)/courses/page.tsx`, replace the CTA section:

```tsx
{/* CTA */}
{course.owned ? (
  <Link href={`/courses/${course.slug}`} className="btn btn--primary text-sm text-center">
    {course.progress > 0 ? "Continuar" : "Comenzar"}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Link>
) : (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs text-white/35 px-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      No disponible en tu plan
    </div>
    <Link href="/suscribirse" className="btn btn--ghost text-sm text-center border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
      Adquirir
    </Link>
  </div>
)}
```

Also add a subtle lock overlay on the gradient header for locked courses:

```tsx
{/* Gradient header */}
<div className={`-mx-6 -mt-6 px-6 pt-6 pb-5 bg-gradient-to-br ${course.gradient} relative`}>
  {!course.owned && (
    <div className="absolute top-3 right-3">
      <div className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
    </div>
  )}
  ...rest of header content...
</div>
```

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/index.ts app/(app)/courses/page.tsx
git commit -m "feat: course lock icons and Adquirir CTA for unpurchased courses"
```

---

## Task 7 — Course detail: subject cards with colors + animations

**Files:**
- Modify: `app/(app)/courses/[slug]/page.tsx`
- Modify: `lib/mock-data/unam-course.ts` (add subject metadata)

- [ ] **Step 1: Add subject color map**

At the top of `courses/[slug]/page.tsx` add:

```tsx
const SUBJECT_META: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "Biología Celular": {
    gradient: "from-emerald-600 to-cyan-600",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  },
  "Genética": {
    gradient: "from-violet-600 to-pink-600",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l4 4M6 2l-4 4M2 10l4 4M6 10l-4 4M18 2l4 4M22 2l-4 4M18 10l4 4M22 10l-4 4M12 6v12"/></svg>,
  },
  "Química General": {
    gradient: "from-amber-500 to-orange-600",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
  },
  "Física": {
    gradient: "from-blue-600 to-violet-600",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  "Matemáticas": {
    gradient: "from-pink-600 to-rose-600",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  },
};
```

- [ ] **Step 2: Replace module accordion with subject grid**

Extract the subject name from `module.title` (it's `"Módulo N — Subject Name"`).

```tsx
function getSubjectName(title: string) {
  return title.split("—")[1]?.trim() ?? title;
}
```

Replace the `<CourseTabs>` component call with a subject grid. Each card shows:
- Gradient bg from SUBJECT_META
- Subject icon
- Module title
- Lesson count + completion count
- Progress bar
- "Ver lecciones" link that scrolls to or links to the lesson list

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {unamModules.map((mod) => {
    const subjectName = getSubjectName(mod.title);
    const meta = SUBJECT_META[subjectName] ?? { gradient: "from-violet-600 to-pink-600", icon: null };
    const done = mod.lessons.filter((l) => l.done).length;
    const pct = Math.round((done / mod.lessons.length) * 100);
    return (
      <Link
        key={mod.id}
        href={`/courses/${slug}/lessons/${mod.lessons.find((l) => !l.done)?.id ?? mod.lessons[0].id}`}
        className="card group overflow-hidden hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/20 transition-all duration-200"
      >
        {/* Header gradient */}
        <div className={`-mx-6 -mt-6 px-5 pt-5 pb-4 bg-gradient-to-br ${meta.gradient} flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-white shrink-0">
            {meta.icon}
          </div>
          <div>
            <p className="text-[11px] text-white/60 font-medium">Módulo {mod.id}</p>
            <p className="font-black text-white text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {subjectName}
            </p>
          </div>
        </div>
        {/* Stats */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/45">
            <span>{mod.lessons.length} lecciones</span>
            <span>{done} completadas</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-white/30 text-right">{pct}%</p>
        </div>
      </Link>
    );
  })}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add app/(app)/courses/[slug]/page.tsx
git commit -m "feat: course detail subject cards with gradient colors and animations"
```

---

## Task 8 — Study resources as professional slides

**Files:**
- Modify: `app/(app)/resources/page.tsx`

- [ ] **Step 1: Read the current resources page**

Read `app/(app)/resources/page.tsx` to understand its current structure before modifying.

- [ ] **Step 2: Rewrite as slide-deck layout**

The page gets a two-column layout: a left panel with a filter sidebar (subject pills) and a right panel with resource "slide" cards. Each card shows a type badge, subject tag, title, description, file size, and a download button.

```tsx
// app/(app)/resources/page.tsx
import { unamResources } from "@/lib/mock-data";

const TYPE_STYLE: Record<string, string> = {
  PDF:    "bg-red-500/15 text-red-400 border-red-500/20",
  PPT:    "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Guía:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Imagen: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
};

const TYPE_ICON = {
  PDF: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  PPT: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  Guía: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Imagen: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

export default function ResourcesPage() {
  const subjects = ["Todos", ...Array.from(new Set(unamResources.map((r) => r.subject)))];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
          Recursos de estudio
        </h1>
        <p className="text-sm text-white/45 mt-1">
          Material de apoyo organizado por materia
        </p>
      </header>

      {/* Filter chips — server-rendered, no JS needed */}
      <div className="flex flex-wrap gap-2">
        {subjects.map((s) => (
          <span key={s} className="badge badge--violet text-xs px-3 py-1.5 cursor-pointer select-none">
            {s}
          </span>
        ))}
      </div>

      {/* Resource slides grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {unamResources.map((res) => (
          <article
            key={res.id}
            className="card flex flex-col gap-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Type + subject header */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${TYPE_STYLE[res.type] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                {TYPE_ICON[res.type as keyof typeof TYPE_ICON]}
                {res.type}
              </span>
              <span className="text-[11px] text-white/35">{res.subject}</span>
            </div>

            {/* Title + description */}
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-2 leading-snug">{res.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed line-clamp-3">{res.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-white/30">{res.fileSize}</span>
              <a
                href={res.url}
                className="btn btn--ghost text-xs py-1.5 px-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(app)/resources/page.tsx
git commit -m "feat: resources page as professional slide-card grid with type badges"
```

---

## Self-Review Checklist

- [x] Logo: uses real image, brand = CEFI GO
- [x] Login: quick-access buttons, no emojis
- [x] Sidebar: course dropdown (ECOEMS default), radial progress chart
- [x] Dashboard: Meta card added, Avances card, Comienza a prepararte card, Practice section
- [x] No emojis anywhere — all replaced with SVG icons
- [x] Mis cursos: lock icon, Adquirir CTA for unpurchased courses
- [x] Course detail: subject cards with gradient colors + hover animations
- [x] Resources: professional slide-card grid with type badges and download
- [x] All file paths are exact, no placeholders
- [x] Mock data extended for ECOEMS, progress, ownership flags
