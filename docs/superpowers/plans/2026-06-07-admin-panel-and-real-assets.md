# Admin Panel + Real Assets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the real media files already in `public/` into the app, add `"Imagen"` resource type, and build a complete admin panel at `/admin` with its own layout, navigation, and five management pages (Lecciones+CheckpointEditor, Exámenes, Recursos, Pagos, Usuarios).

**Architecture:** Admin routes live in `app/(admin)/admin/` — a separate Next.js route group from `app/(app)/`, giving admins their own layout with no student sidebar. The admin shell uses an amber accent to clearly differentiate it from the student UI. `components/admin/` holds admin-only components. All data is mock (`lib/mock-data/admin-mock.ts`). The `CheckpointEditor` is a fully functional local-state client component that mirrors what the admin will eventually save to `public.video_checkpoints` in Supabase.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, `.card`/`.btn--primary`/`.badge--violet` design tokens (same globals.css), amber-400/500 for admin accent, `@/lib/data/profile` for auth check.

**Real files available in `public/`:**
- `/videos/tu-video.mp4` (289 MB) — wire to lesson `1-3`
- `/examenes/Examen 8 Area 2.pdf` (2.2 MB) — real UNAM exam
- `/recursos/Guerra_y_Revolución.pdf` (7.4 MB) — study resource
- `/recursos/Infografia.png` (1.4 MB) — infographic image

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `lib/mock-data/unam-course.ts` | Wire real paths; add `"Imagen"` to `StudyResource.type`; add 2 real resources |
| Modify | `components/courses/CourseTabs.tsx` | Handle `"Imagen"` type in badge and icon |
| Create | `lib/mock-data/admin-mock.ts` | Mock students, pending payments, upload history, dashboard stats |
| Modify | `lib/mock-data/index.ts` | Re-export admin mock data |
| Create | `components/admin/AdminSidebar.tsx` | Admin navigation (amber accent, 6 sections) |
| Create | `components/admin/CheckpointEditor.tsx` | Per-lesson checkpoint CRUD (local state, mirrors `video_checkpoints` schema) |
| Create | `app/(admin)/admin/layout.tsx` | Admin shell: role check + sidebar + content area |
| Create | `app/(admin)/admin/page.tsx` | Dashboard: stats cards + recent payments + upload log |
| Create | `app/(admin)/admin/lecciones/page.tsx` | Module accordion + inline CheckpointEditor per lesson |
| Create | `app/(admin)/admin/examenes/page.tsx` | Exam PDF viewer + question count overview |
| Create | `app/(admin)/admin/recursos/page.tsx` | Resource table with file size, type, preview |
| Create | `app/(admin)/admin/pagos/page.tsx` | Payment approval queue with approve/reject buttons |
| Create | `app/(admin)/admin/usuarios/page.tsx` | Student roster with plan, progress, last activity |

---

## Task 1: Wire real assets + add Imagen resource type

**Files:**
- Modify: `lib/mock-data/unam-course.ts`
- Modify: `components/courses/CourseTabs.tsx`

- [ ] **Step 1: Update `lib/mock-data/unam-course.ts`**

Make these targeted changes:

1. Update `StudyResource.type` union — find the interface and change it:
```typescript
export interface StudyResource {
  id: string;
  title: string;
  type: "PDF" | "PPT" | "Guía" | "Imagen";
  subject: string;
  description: string;
  fileSize: string;
  url: string;
}
```

2. In `unamModules`, find lesson `1-3` and update its `videoSrc`:
```typescript
{
  id: "1-3",
  title: "Organelos celulares",
  duration: "25 min",
  done: false,
  current: true,
  videoSrc: "/videos/tu-video.mp4",   // ← was "/videos/placeholder.mp4"
  description: "Mitocondria, retículo endoplásmico, aparato de Golgi, lisosomas y ribosomas: función y estructura. Este tema representa el 12% de Biología en el examen UNAM.",
},
```

3. In `unamResources`, replace `r06` (Historia PPT placeholder) with the real file and add `r09` (infographic):
```typescript
// Replace r06:
{
  id: "r06",
  title: "Guerra y Revolución — Historia de México",
  type: "PDF",
  subject: "Historia",
  description: "Análisis del período revolucionario mexicano: causas, actores, batallas clave y consecuencias. Material de apoyo para el examen UNAM.",
  fileSize: "7.4 MB",
  url: "/recursos/Guerra_y_Revolución.pdf",
},
// Add r09 after r08:
{
  id: "r09",
  title: "Infografía — Línea del tiempo UNAM",
  type: "Imagen",
  subject: "General",
  description: "Infografía visual con los temas, porcentajes y frecuencia de aparición en los exámenes UNAM de los últimos 5 años.",
  fileSize: "1.4 MB",
  url: "/recursos/Infografia.png",
},
```

- [ ] **Step 2: Update `components/courses/CourseTabs.tsx` for `"Imagen"` type**

In `RESOURCE_BADGE` record, add the Imagen entry:
```typescript
const RESOURCE_BADGE: Record<string, string> = {
  PDF: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  PPT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Guía: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Imagen: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};
```

In the `ResourceIcon` function, add the Imagen case before the default PDF return:
```tsx
if (type === "Imagen")
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
```

For Imagen resources, the "Descargar" button should open in a new tab (it's an image, not a download). In the recursos tab, find the `<a>` tag for each resource card and update it to open real URLs:
```tsx
<a
  href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn--ghost text-sm text-center"
  onClick={resource.url === "#" ? (e) => e.preventDefault() : undefined}
>
  {resource.type === "Imagen" ? "Ver imagen" : "Descargar"}
  ...
</a>
```

- [ ] **Step 3: Verify TypeScript**
```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**
```bash
git add lib/mock-data/unam-course.ts components/courses/CourseTabs.tsx
git commit -m "feat: wire real assets — tu-video.mp4, Guerra_y_Revolución.pdf, Infografia.png; add Imagen resource type"
```

---

## Task 2: Admin mock data

**Files:**
- Create: `lib/mock-data/admin-mock.ts`
- Modify: `lib/mock-data/index.ts`

- [ ] **Step 1: Create `lib/mock-data/admin-mock.ts`**

```typescript
// lib/mock-data/admin-mock.ts

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  plan: "gratuito" | "mensual" | "semestral" | "anual";
  exam: string;
  progress: number;
  joinedAt: string;
  lastActivity: string;
}

export interface MockPayment {
  id: string;
  studentName: string;
  studentEmail: string;
  plan: "mensual" | "semestral" | "anual";
  amount: number;
  submittedAt: string;
  status: "pendiente" | "aprobado" | "rechazado";
  notes?: string;
}

export interface AdminStats {
  totalStudents: number;
  activeSubscriptions: number;
  pendingPayments: number;
  totalLessons: number;
  totalExams: number;
  totalResources: number;
}

export const adminStats: AdminStats = {
  totalStudents: 247,
  activeSubscriptions: 189,
  pendingPayments: 8,
  totalLessons: 19,
  totalExams: 1,
  totalResources: 9,
};

export const mockStudents: MockStudent[] = [
  { id: "s01", name: "Ana García",      email: "ana@correo.com",      plan: "anual",      exam: "UNAM",     progress: 34, joinedAt: "2026-04-10", lastActivity: "Hace 2 horas" },
  { id: "s02", name: "Carlos Mendoza",  email: "carlos@correo.com",   plan: "semestral",  exam: "UNAM",     progress: 58, joinedAt: "2026-03-22", lastActivity: "Hace 1 día" },
  { id: "s03", name: "Sofía Ramírez",   email: "sofia@correo.com",    plan: "mensual",    exam: "IPN",      progress: 12, joinedAt: "2026-05-01", lastActivity: "Hace 3 días" },
  { id: "s04", name: "Diego Torres",    email: "diego@correo.com",    plan: "anual",      exam: "UNAM",     progress: 71, joinedAt: "2026-02-15", lastActivity: "Hace 5 horas" },
  { id: "s05", name: "Valentina Cruz",  email: "vale@correo.com",     plan: "semestral",  exam: "COMIPEMS", progress: 45, joinedAt: "2026-04-28", lastActivity: "Ayer" },
  { id: "s06", name: "Rodrigo Peña",    email: "rodrigo@correo.com",  plan: "gratuito",   exam: "UNAM",     progress: 5,  joinedAt: "2026-06-01", lastActivity: "Hace 10 min" },
  { id: "s07", name: "Isabella Mora",   email: "isa@correo.com",      plan: "anual",      exam: "UNAM",     progress: 89, joinedAt: "2026-01-08", lastActivity: "Hace 1 hora" },
  { id: "s08", name: "Mateo Herrera",   email: "mateo@correo.com",    plan: "mensual",    exam: "IPN",      progress: 23, joinedAt: "2026-05-20", lastActivity: "Hace 2 días" },
  { id: "s09", name: "Camila Vega",     email: "camila@correo.com",   plan: "semestral",  exam: "UNAM",     progress: 62, joinedAt: "2026-03-05", lastActivity: "Hace 4 horas" },
  { id: "s10", name: "Sebastián León",  email: "seba@correo.com",     plan: "anual",      exam: "COMIPEMS", progress: 38, joinedAt: "2026-04-14", lastActivity: "Ayer" },
];

export const mockPayments: MockPayment[] = [
  { id: "p01", studentName: "Rodrigo Peña",     studentEmail: "rodrigo@correo.com",  plan: "mensual",    amount: 299,  submittedAt: "2026-06-07 09:14", status: "pendiente" },
  { id: "p02", studentName: "Laura Sánchez",    studentEmail: "laura@correo.com",    plan: "semestral",  amount: 1499, submittedAt: "2026-06-07 08:52", status: "pendiente" },
  { id: "p03", studentName: "Andrés Fuentes",   studentEmail: "andres@correo.com",   plan: "anual",      amount: 2499, submittedAt: "2026-06-06 22:30", status: "pendiente" },
  { id: "p04", studentName: "Natalia Ríos",     studentEmail: "natalia@correo.com",  plan: "mensual",    amount: 299,  submittedAt: "2026-06-06 18:45", status: "pendiente" },
  { id: "p05", studentName: "Hugo Castellanos", studentEmail: "hugo@correo.com",     plan: "semestral",  amount: 1499, submittedAt: "2026-06-06 14:20", status: "pendiente" },
  { id: "p06", studentName: "Elena Vargas",     studentEmail: "elena@correo.com",    plan: "anual",      amount: 2499, submittedAt: "2026-06-05 11:00", status: "pendiente" },
  { id: "p07", studentName: "Pablo Gutiérrez",  studentEmail: "pablo@correo.com",    plan: "mensual",    amount: 299,  submittedAt: "2026-06-05 09:15", status: "pendiente" },
  { id: "p08", studentName: "Mariana Leal",     studentEmail: "mariana@correo.com",  plan: "semestral",  amount: 1499, submittedAt: "2026-06-04 20:40", status: "pendiente" },
  // Historial ya procesado
  { id: "p09", studentName: "Diego Torres",     studentEmail: "diego@correo.com",    plan: "anual",      amount: 2499, submittedAt: "2026-06-01 10:00", status: "aprobado",  notes: "Comprobante verificado" },
  { id: "p10", studentName: "Valentina Cruz",   studentEmail: "vale@correo.com",     plan: "semestral",  amount: 1499, submittedAt: "2026-05-28 15:30", status: "aprobado",  notes: "Comprobante verificado" },
  { id: "p11", studentName: "Cuenta no válida", studentEmail: "spam@correo.com",     plan: "mensual",    amount: 299,  submittedAt: "2026-05-25 08:00", status: "rechazado", notes: "Comprobante ilegible" },
];

export const planLabels: Record<string, string> = {
  gratuito: "Gratuito",
  mensual: "Mensual",
  semestral: "Semestral",
  anual: "Anual",
};

export const planColors: Record<string, string> = {
  gratuito: "text-white/40 bg-white/5 border-white/10",
  mensual: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  semestral: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  anual: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};
```

- [ ] **Step 2: Append to `lib/mock-data/index.ts`**

Add at the end (do NOT remove any existing content):
```typescript
export {
  adminStats,
  mockStudents,
  mockPayments,
  planLabels,
  planColors,
} from "./admin-mock";
export type { MockStudent, MockPayment, AdminStats } from "./admin-mock";
```

- [ ] **Step 3: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add lib/mock-data/admin-mock.ts lib/mock-data/index.ts
git commit -m "feat: add admin mock data — students, payments, stats"
```

---

## Task 3: AdminSidebar + CheckpointEditor components

**Files:**
- Create: `components/admin/AdminSidebar.tsx`
- Create: `components/admin/CheckpointEditor.tsx`

- [ ] **Step 1: Create `components/admin/AdminSidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/layout/Logo";
import { adminStats } from "@/lib/mock-data";

interface NavItem {
  href: string;
  label: string;
  badge?: number;
  icon: React.ReactNode;
}

const DashIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const LessonsIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
const ExamIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const FolderIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;
const PayIcon       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UsersIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const BackIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;

const navItems: NavItem[] = [
  { href: "/admin",              label: "Dashboard",   icon: <DashIcon /> },
  { href: "/admin/lecciones",    label: "Lecciones",   icon: <LessonsIcon />, badge: adminStats.totalLessons },
  { href: "/admin/examenes",     label: "Exámenes",    icon: <ExamIcon />,    badge: adminStats.totalExams },
  { href: "/admin/recursos",     label: "Recursos",    icon: <FolderIcon />,  badge: adminStats.totalResources },
  { href: "/admin/pagos",        label: "Pagos",       icon: <PayIcon />,     badge: adminStats.pendingPayments },
  { href: "/admin/usuarios",     label: "Usuarios",    icon: <UsersIcon />,   badge: adminStats.totalStudents },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-[#0d0d0f] border-r border-white/6 overflow-y-auto">
      {/* Logo + Admin label */}
      <div className="p-5 border-b border-white/5">
        <Logo />
        <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 12.14 2 8.27l6.91-1.01L12 1z"/></svg>
          Panel Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2" aria-label="Navegación admin">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const isPagos = item.href === "/admin/pagos";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                  : "text-white/55 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-amber-400" : "text-white/40"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    isPagos && item.badge > 0
                      ? "bg-red-500 text-white"
                      : isActive
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-white/8 text-white/35"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to portal */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <BackIcon />
          Volver al portal
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create `components/admin/CheckpointEditor.tsx`**

This component shows and manages checkpoints for a single lesson. Changes are local state only (mock mode — no DB write). The schema mirrors `public.video_checkpoints`.

```tsx
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

        {/* Existing checkpoints */}
        {checkpoints.length === 0 && !adding && (
          <div className="text-center py-8 text-white/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm">Sin checkpoints. Agrega el primero.</p>
          </div>
        )}

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
              <button onClick={() => { setAdding(false); setDraft(emptyCheckpoint(lessonId)); }} className="btn btn--ghost text-sm">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
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
```

- [ ] **Step 3: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add components/admin/AdminSidebar.tsx components/admin/CheckpointEditor.tsx
git commit -m "feat: add AdminSidebar (amber accent nav) and CheckpointEditor (local-state checkpoint CRUD)"
```

---

## Task 4: Admin layout + dashboard page

**Files:**
- Create: `app/(admin)/admin/layout.tsx`
- Create: `app/(admin)/admin/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/layout.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/profile";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/(admin)/admin/page.tsx`**

```tsx
import { adminStats, mockPayments } from "@/lib/mock-data";

const pendingPayments = mockPayments.filter((p) => p.status === "pendiente");

const stats = [
  {
    label: "Alumnos registrados",
    value: adminStats.totalStudents,
    change: "+12 esta semana",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    label: "Suscripciones activas",
    value: adminStats.activeSubscriptions,
    change: "76% del total",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
  {
    label: "Pagos pendientes",
    value: adminStats.pendingPayments,
    change: "Requieren revisión",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    label: "Lecciones publicadas",
    value: adminStats.totalLessons,
    change: `${adminStats.totalExams} examen · ${adminStats.totalResources} recursos`,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  },
];

const planAmounts: Record<string, number> = { mensual: 299, semestral: 1499, anual: 2499 };

export default function AdminDashboard() {
  const pendingRevenue = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1
          className="text-3xl font-black text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Panel de administración CEFIGO — visión general del sistema
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`card border ${s.bg} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={s.color}>{s.icon}</span>
              <span className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>
                {s.value}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">{s.label}</p>
              <p className="text-[11px] text-white/35 mt-0.5">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending payments */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Pagos pendientes
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                ${pendingRevenue.toLocaleString("es-MX")} MXN en espera
              </span>
              <span className="text-xs bg-red-500 text-white font-bold rounded-full px-2 py-0.5">
                {pendingPayments.length}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {pendingPayments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {p.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.studentName}</p>
                  <p className="text-[11px] text-white/35">{p.submittedAt}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-amber-400">${p.amount.toLocaleString("es-MX")}</p>
                  <p className="text-[10px] text-white/35 capitalize">{p.plan}</p>
                </div>
              </div>
            ))}
            {pendingPayments.length > 5 && (
              <p className="text-xs text-white/35 text-center pt-1">
                +{pendingPayments.length - 5} más en cola
              </p>
            )}
          </div>
          <a href="/admin/pagos" className="btn btn--primary text-sm text-center block">
            Revisar pagos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        {/* Content summary */}
        <div className="card space-y-4">
          <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
            Contenido publicado
          </h2>
          <div className="space-y-3">
            {[
              { label: "Lecciones en video", count: adminStats.totalLessons, href: "/admin/lecciones", color: "bg-violet-500" },
              { label: "Exámenes", count: adminStats.totalExams, href: "/admin/examenes", color: "bg-blue-500" },
              { label: "Recursos de estudio", count: adminStats.totalResources, href: "/admin/recursos", color: "bg-emerald-500" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-3 py-2 hover:bg-white/3 rounded-lg px-2 transition-colors group">
                <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <span className="flex-1 text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                <span className="text-sm font-bold text-white/60">{item.count}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/20 group-hover:text-white/50 transition-colors"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </div>

          {/* Revenue breakdown */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Distribución por plan</p>
            {[
              { plan: "Anual", count: 87, color: "bg-amber-500" },
              { plan: "Semestral", count: 64, color: "bg-violet-500" },
              { plan: "Mensual", count: 38, color: "bg-sky-500" },
              { plan: "Gratuito", count: 58, color: "bg-white/20" },
            ].map((item) => (
              <div key={item.plan} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-white/50 w-20">{item.plan}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / adminStats.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white/50 w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/layout.tsx" "app/(admin)/admin/page.tsx"
git commit -m "feat: admin layout with role check and dashboard with stats + pending payments"
```

---

## Task 5: Admin lecciones page

**Files:**
- Create: `app/(admin)/admin/lecciones/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/lecciones/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { unamModules, videoCheckpoints } from "@/lib/mock-data";
import CheckpointEditor from "@/components/admin/CheckpointEditor";

export default function AdminLeccionesPage() {
  const [editorLesson, setEditorLesson] = useState<{ id: string; title: string } | null>(null);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([1]));

  function toggleModule(id: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const totalLessons = unamModules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Lecciones
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {unamModules.length} módulos · {totalLessons} lecciones · gestiona videos y checkpoints interactivos
          </p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled title="Próximamente">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Subir lección
        </button>
      </header>

      {/* Modules + lessons */}
      <div className="space-y-3">
        {unamModules.map((mod) => {
          const isOpen = openModules.has(mod.id);
          const cpCount = videoCheckpoints.filter((cp) =>
            mod.lessons.some((l) => l.id === cp.lessonId)
          ).length;

          return (
            <div key={mod.id} className="card overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-4 py-1 text-left select-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                    {mod.id}
                  </span>
                  <span className="font-bold text-sm">{mod.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/35">{mod.lessons.length} lecciones</span>
                  {cpCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                      {cpCount} checkpoints
                    </span>
                  )}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 border-t border-white/5 pt-3 space-y-2">
                  {mod.lessons.map((lesson) => {
                    const lessonCps = videoCheckpoints.filter((cp) => cp.lessonId === lesson.id);
                    const hasRealVideo = lesson.videoSrc && !lesson.videoSrc.includes("placeholder");

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl bg-white/2 hover:bg-white/4 transition-colors"
                      >
                        {/* Status dot */}
                        <span className={`w-2 h-2 rounded-full shrink-0 ${lesson.done ? "bg-emerald-500" : lesson.current ? "bg-amber-500" : "bg-white/15"}`} />

                        {/* Lesson info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-white/80">{lesson.title}</span>
                            <span className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">{lesson.id}</span>
                            {lesson.current && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 rounded-full px-2 py-0.5">EN CURSO</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-white/35">{lesson.duration}</span>
                            {hasRealVideo ? (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                {lesson.videoSrc?.split("/").pop()}
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/25">Sin video</span>
                            )}
                            {lesson.vimeoId && (
                              <span className="text-[10px] text-sky-400">Vimeo: {lesson.vimeoId}</span>
                            )}
                          </div>
                        </div>

                        {/* Checkpoints badge */}
                        <div className="shrink-0">
                          {lessonCps.length > 0 ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                              {lessonCps.length} checkpoint{lessonCps.length > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20">Sin checkpoints</span>
                          )}
                        </div>

                        {/* Actions */}
                        <button
                          onClick={() => setEditorLesson({ id: lesson.id, title: lesson.title })}
                          className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all"
                        >
                          Checkpoints
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Checkpoint editor modal */}
      {editorLesson && (
        <CheckpointEditor
          lessonId={editorLesson.id}
          lessonTitle={editorLesson.title}
          onClose={() => setEditorLesson(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/lecciones/page.tsx"
git commit -m "feat: admin lecciones page with module accordion and per-lesson checkpoint editor"
```

---

## Task 6: Admin exámenes page

**Files:**
- Create: `app/(admin)/admin/examenes/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/examenes/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { unamExam } from "@/lib/mock-data";

const subjectColors: Record<string, string> = {
  Biología:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Química:      "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Física:       "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Matemáticas:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Español:      "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Historia:     "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const subjectCounts = unamExam.subjects.map((s) => ({
  subject: s,
  count: unamExam.questions.filter((q) => q.subject === s).length,
}));

export default function AdminExamenesPage() {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Exámenes
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Gestiona simulacros y sus preguntas
          </p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Subir examen
        </button>
      </header>

      {/* Exam card */}
      <div className="card border border-amber-500/15 space-y-6">
        {/* Meta */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">{unamExam.university}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5">{unamExam.difficulty}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2.5 py-0.5">{unamExam.area}</span>
            </div>
            <h2 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
              {unamExam.title}
            </h2>
            <p className="text-xs text-white/40 mt-0.5">{unamExam.universityFull} · {unamExam.areaFull} · {unamExam.year}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Reactivos",    value: unamExam.questions.length },
            { label: "Tiempo",       value: `${unamExam.timeMinutes} min` },
            { label: "Aprobatorio",  value: `${unamExam.passingScore}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/6">
              <p className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Distribución por materia</p>
          <div className="space-y-2">
            {subjectCounts.map(({ subject, count }) => (
              <div key={subject} className="flex items-center gap-3">
                <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 shrink-0 w-24 text-center ${subjectColors[subject] ?? "text-white/50 bg-white/5 border-white/10"}`}>
                  {subject}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${(count / unamExam.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white/50 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source PDF */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Examen fuente (PDF original)</p>
          <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Examen 8 Area 2.pdf</p>
              <p className="text-xs text-white/35">2.2 MB · UNAM · Área 2</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfOpen(true)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all"
              >
                Ver PDF
              </button>
              <a
                href="/examenes/Examen 8 Area 2.pdf"
                download
                className="text-xs font-semibold text-white/50 hover:text-white bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 transition-all"
              >
                Descargar
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <a href={`/exam/${unamExam.id}`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost text-sm">
            Vista alumno
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
          <button className="btn btn--ghost text-sm opacity-40 cursor-not-allowed" disabled>
            Editar preguntas
          </button>
        </div>
      </div>

      {/* PDF viewer modal */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl h-[90vh] flex flex-col card border border-white/10">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="font-bold text-sm">Examen 8 Area 2.pdf — UNAM Área 2</h3>
              <button onClick={() => setPdfOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <iframe
              src="/examenes/Examen 8 Area 2.pdf"
              className="flex-1 rounded-xl border border-white/8"
              title="Examen UNAM Área 2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/examenes/page.tsx"
git commit -m "feat: admin exámenes page with PDF viewer, subject breakdown, and exam stats"
```

---

## Task 7: Admin recursos page

**Files:**
- Create: `app/(admin)/admin/recursos/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/recursos/page.tsx`**

```tsx
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

function isRealFile(url: string) {
  return REAL_FILES.has(url);
}

export default function AdminRecursosPage() {
  const [preview, setPreview] = useState<StudyResource | null>(null);

  const byType = unamResources.reduce<Record<string, StudyResource[]>>((acc, r) => {
    acc[r.type] = [...(acc[r.type] ?? []), r];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Recursos de estudio
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {unamResources.length} recursos · PDFs, presentaciones e imágenes
          </p>
        </div>
        <button className="btn btn--primary text-sm opacity-50 cursor-not-allowed" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Subir recurso
        </button>
      </header>

      {/* Summary by type */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(byType).map(([type, items]) => (
          <div key={type} className={`card border text-center py-3 ${TYPE_BADGE[type]?.split(" ").slice(1).join(" ") ?? "border-white/10"}`}>
            <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>{items.length}</p>
            <p className={`text-xs font-bold ${TYPE_BADGE[type]?.split(" ")[0]}`}>{type}</p>
          </div>
        ))}
      </div>

      {/* Resources table */}
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
              const real = isRealFile(resource.url);
              return (
                <tr key={resource.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-medium text-white/80 leading-snug">{resource.title}</p>
                      <p className="text-[11px] text-white/35 mt-0.5 hidden sm:block">{resource.description.slice(0, 60)}…</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <span className="text-xs text-white/50">{resource.subject}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${TYPE_BADGE[resource.type]}`}>
                      {resource.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <span className="text-xs text-white/40">{resource.fileSize}</span>
                  </td>
                  <td className="py-3 px-3">
                    {real ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        Archivo real
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/25 bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
                        Mock
                      </span>
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
                <img
                  src={preview.url}
                  alt={preview.title}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <iframe
                src={preview.url}
                className="flex-1 rounded-xl border border-white/8"
                title={preview.title}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/recursos/page.tsx"
git commit -m "feat: admin recursos page with table, real-file badges, and PDF/image preview modal"
```

---

## Task 8: Admin pagos page

**Files:**
- Create: `app/(admin)/admin/pagos/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/pagos/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { mockPayments, planLabels, planColors } from "@/lib/mock-data";
import type { MockPayment } from "@/lib/mock-data";

type Filter = "pendiente" | "aprobado" | "rechazado" | "todos";

const STATUS_BADGE: Record<string, string> = {
  pendiente:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  aprobado:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  rechazado:  "text-red-400 bg-red-500/10 border-red-500/20",
};

const STATUS_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado:  "Aprobado",
  rechazado: "Rechazado",
};

export default function AdminPagosPage() {
  const [payments, setPayments] = useState<MockPayment[]>(mockPayments);
  const [filter, setFilter] = useState<Filter>("pendiente");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const pendingCount = payments.filter((p) => p.status === "pendiente").length;

  const filtered = filter === "todos"
    ? payments
    : payments.filter((p) => p.status === filter);

  function approve(id: string) {
    setPayments((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: "aprobado", notes: notes[id] ?? "Comprobante verificado" } : p)
    );
  }

  function reject(id: string) {
    setPayments((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: "rechazado", notes: notes[id] ?? "Comprobante no válido" } : p)
    );
  }

  const totalPendingRevenue = payments
    .filter((p) => p.status === "pendiente")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Pagos por transferencia
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {pendingCount > 0
              ? `${pendingCount} comprobante${pendingCount > 1 ? "s" : ""} esperando revisión · $${totalPendingRevenue.toLocaleString("es-MX")} MXN en espera`
              : "No hay pagos pendientes ✓"}
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="text-sm font-bold text-white bg-red-500 rounded-full px-3 py-1">
            {pendingCount} pendiente{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {(["pendiente", "aprobado", "rechazado", "todos"] as Filter[]).map((f) => {
          const count = f === "todos" ? payments.length : payments.filter((p) => p.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {f === "pendiente" ? "Pendientes" : f === "aprobado" ? "Aprobados" : f === "rechazado" ? "Rechazados" : "Todos"}
              <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${filter === f ? "bg-white/20" : "bg-white/8 text-white/35"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Payment cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <p className="text-sm">No hay pagos en esta categoría.</p>
          </div>
        )}

        {filtered.map((payment) => (
          <div key={payment.id} className={`card border ${payment.status === "pendiente" ? "border-amber-500/15" : "border-white/6"}`}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {payment.studentName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-bold text-sm">{payment.studentName}</p>
                  <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${STATUS_BADGE[payment.status]}`}>
                    {STATUS_LABEL[payment.status]}
                  </span>
                </div>
                <p className="text-xs text-white/40">{payment.studentEmail}</p>
                <p className="text-xs text-white/30 mt-1">{payment.submittedAt}</p>
                {payment.notes && payment.status !== "pendiente" && (
                  <p className="text-xs text-white/35 italic mt-1">"{payment.notes}"</p>
                )}
              </div>

              {/* Amount + plan */}
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-amber-400" style={{ fontFamily: "var(--font-display)" }}>
                  ${payment.amount.toLocaleString("es-MX")}
                </p>
                <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${planColors[payment.plan]}`}>
                  {planLabels[payment.plan]}
                </span>
              </div>
            </div>

            {/* Actions — only for pending */}
            {payment.status === "pendiente" && (
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nota (opcional)…"
                  value={notes[payment.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [payment.id]: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
                />
                <button
                  onClick={() => reject(payment.id)}
                  className="text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-lg px-4 py-2 transition-all"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => approve(payment.id)}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-4 py-2 transition-all"
                >
                  Aprobar acceso
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/pagos/page.tsx"
git commit -m "feat: admin pagos page with approve/reject flow, filter tabs, and pending revenue summary"
```

---

## Task 9: Admin usuarios page

**Files:**
- Create: `app/(admin)/admin/usuarios/page.tsx`

- [ ] **Step 1: Create `app/(admin)/admin/usuarios/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { mockStudents, planLabels, planColors } from "@/lib/mock-data";

export default function AdminUsuariosPage() {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.exam.toLowerCase().includes(search.toLowerCase())
  );

  const planStats = (["anual", "semestral", "mensual", "gratuito"] as const).map((plan) => ({
    plan,
    count: mockStudents.filter((s) => s.plan === plan).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            Usuarios
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {mockStudents.length} alumnos registrados
          </p>
        </div>
      </header>

      {/* Plan distribution */}
      <div className="grid grid-cols-4 gap-3">
        {planStats.map(({ plan, count }) => (
          <div key={plan} className={`card border text-center py-3 ${planColors[plan].split(" ").slice(1).join(" ")}`}>
            <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>{count}</p>
            <p className={`text-xs font-bold capitalize ${planColors[plan].split(" ")[0]}`}>{planLabels[plan]}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Buscar por nombre, correo o examen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Alumno</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Examen</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30">Plan</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">Progreso</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">Última actividad</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-xs text-white/35 truncate">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 hidden md:table-cell">
                  <span className="text-xs text-white/50">{student.exam}</span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${planColors[student.plan]}`}>
                    {planLabels[student.plan]}
                  </span>
                </td>
                <td className="py-3 px-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${student.progress >= 70 ? "bg-emerald-500" : student.progress >= 30 ? "bg-amber-500" : "bg-white/20"}`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/40">{student.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 hidden sm:table-cell">
                  <span className="text-xs text-white/40">{student.lastActivity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-white/30">
            <p className="text-sm">No se encontraron alumnos con ese criterio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and commit**
```bash
npx tsc --noEmit
git add "app/(admin)/admin/usuarios/page.tsx"
git commit -m "feat: admin usuarios page with search, plan distribution, and progress table"
```

---

## Self-Review

**Spec coverage:**

| Requirement | Task |
|-------------|------|
| Wire `/videos/tu-video.mp4` to lesson 1-3 | Task 1 |
| Wire `/recursos/Guerra_y_Revolución.pdf` | Task 1 |
| Wire `/recursos/Infografia.png` as Imagen type | Task 1 |
| Wire `/examenes/Examen 8 Area 2.pdf` | Task 6 (admin exam page + PDF viewer) |
| Admin panel separate from student layout | Task 4 (route group `(admin)`, role check) |
| Admin amber accent visually distinct | Tasks 3, 4, 5, 6, 7, 8, 9 |
| Admin — gestión de lecciones | Task 5 |
| Admin — configurar checkpoints (timestamp, question, options, correct) | Task 3 (CheckpointEditor) |
| Admin — gestión de exámenes | Task 6 |
| Admin — gestión de recursos | Task 7 |
| Admin — validación de pagos (aprobar/rechazar) | Task 8 |
| Admin — lista de usuarios | Task 9 |
| Admin — dashboard con stats | Task 4 |
| Redirect if not admin | Task 4 layout |

**Placeholder scan:** No TBDs, TODOs, or incomplete steps found.

**Type consistency:**
- `MockPayment.status` is `"pendiente" | "aprobado" | "rechazado"` — used consistently in Task 8 ✓
- `StudyResource.type` updated to include `"Imagen"` in Task 1 — all consumers handle it (CourseTabs, admin recursos) ✓
- `VideoCheckpoint.id` used as the key in `CheckpointEditor` local state ✓
- `planColors` and `planLabels` imported correctly in Tasks 8 and 9 ✓
