# CEFI GO — Pending Implementation Tasks
# Loop prompt: read this file and execute ALL tasks in order. Mark each section [DONE] when complete.
# Model: claude-opus-4-6 | Effort: high | Repo: C:\Users\arcti\OneDrive\Escritorio\CEFIMAT\Plataforma_UNITIPS

---

## RULES (never break these)
- NO emojis anywhere in any file — sweep and remove all existing ones after implementing
- Brand is "CEFI GO" (display) / "CEFIGO" (slug/code) — zero tolerance for "CEFITIPS"
- Design system: bg #0B0617/#0E0A18, violet #A78BFA/#7C3AED, pink #EC4899, glassmorphism bg-white/5 border-white/10
- All mock data stays as-is (Supabase bypassed in dev)
- Commit each major section separately with descriptive messages

---

## TASK 1 — Branding: Eliminate CEFITIPS, enforce CEFI GO [ ]

Search and replace ALL occurrences of "CEFITIPS", "Cefi Tips", "CefiTips", "cefi-tips" across the entire codebase.
Replace with "CEFI GO" in display text, "cefigo" in slugs/code, "CEFIGO" in logos/brand marks.

The Logo component lives at components/layout/Logo.tsx.
Assets available at: /assets/ICO-mini.png, /assets/ICO.jpeg, /assets/cefigofull.png
Use the cefigofull.png for full logo and ICO-mini.png for icon-only variant.
Update the Logo component to use Next.js Image with the actual asset files from public/logos/.
Copy assets/ICO-mini.png → public/logos/icon.png
Copy assets/cefigofull.png → public/logos/full.png

In metadata (app/layout.tsx): title should be "CEFI GO — Plataforma de preparación universitaria"
In page titles, tab titles, og:title — all must say CEFI GO.

---

## TASK 2 — Landing: Hero rotating words [ ]

File: components/landing/HeroSection.tsx

Current ROTATING_WORDS has UNAM, IPN, UAM, COMIPEMS, CENEVAL.
KEEP ONLY: UNAM, IPN, UAM — remove COMIPEMS and CENEVAL entries.

The text that rotates is part of "Entra a la [WORD]" — for IPN use "Entra al IPN", for UNAM "Entra a la UNAM", for UAM "Entra a la UAM". Each word object should have a `prefix` field ("a la" or "al") so the sentence reads correctly.

CRITICAL: Remove ALL textShadow / glow / drop-shadow from the rotating word. ONLY the color of the text changes. No glowing, no blur, no shadow.
University colors (text only, no effects):
- UNAM: #1565C0 (azul universitario)
- IPN: #800020 (guinda politécnico)
- UAM: #7B1FA2 (violeta UAM)

---

## TASK 3 — Landing: Flash offer prominence [ ]

File: app/page.tsx and components/landing/HeroSection.tsx (FlashCountdown / promo card)

The flash offer / promotional card in the hero right panel must be the most visually dominant element on the page. Requirements:
- Animated pulsing border: use CSS keyframes for a glowing animated border (violet→pink cycling)
- "OFERTA RELAMPAGO" badge: bright amber/yellow with a lightning bolt icon, blinking animation
- Countdown timer: large numbers, each digit in its own box with flip-style animation
- Price crossed out (precio tachado) next to the real price
- A progress bar showing "X lugares restantes" that depletes visually
- "Disponible por tiempo limitado" text with a subtle shake animation
- CTA button: full-width gradient violet→pink with scale-up on hover and a subtle pulse animation
- Surrounding glow: box-shadow with violet/pink that pulses on a 2s cycle

This card must VISUALLY demand attention — it is the primary conversion element.

---

## TASK 4 — Install shadcn UI components [ ]

Working directory: C:\Users\arcti\OneDrive\Escritorio\CEFIMAT\Plataforma_UNITIPS

Install missing radix dependencies if not present:
```
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-select class-variance-authority
```

Create these files in components/ui/ (use the CEFI GO dark theme adaptation — dark backgrounds, violet accents, white/10 borders):

components/ui/button.tsx — shadcn Button with CEFI GO variants
components/ui/badge.tsx — shadcn Badge
components/ui/card.tsx — shadcn Card (dark bg-white/5 border-white/10)
components/ui/dialog.tsx — shadcn Dialog (dark overlay, glassmorphism content)
components/ui/select.tsx — shadcn Select (dark bg, violet focus)
components/ui/textarea.tsx — shadcn Textarea
components/ui/input.tsx — shadcn Input (already adapted)
components/ui/dropdown-menu.tsx — shadcn DropdownMenu

Then create: components/ui/event-manager.tsx
This is a full calendar event manager. Copy the full component from this task file's appendix.
Adapt it to CEFI GO dark theme: all Card backgrounds → bg-white/5 border-white/10, 
all "bg-background" → bg-[#0E0A18], all "text-muted-foreground" → text-white/40,
all borders → border-white/10, primary color → violet-600.

---

## TASK 5 — Dashboard: Welcome Plan Modal (first-visit popup) [ ]

File: components/dashboard/WelcomePlanModal.tsx (CREATE NEW)
File: app/(app)/dashboard/page.tsx (INTEGRATE)

Create a modal that appears on first visit to dashboard (use localStorage key "cefigo_plan_selected").
The modal should NOT show if plan already selected.

Modal design: centered, max-w-2xl, glassmorphism, dark. Two steps:
STEP 1: Plan selection
Header: "Bienvenido a CEFI GO" with the CEFI GO logo above it.
Subheader: "Elige tu ritmo de estudio — podrás ajustarlo en cualquier momento"

4 plan cards in a 2x2 grid:

PLAN 1 — "Plan Relajado" (slug: relaxed)
- Descripcion: "3-4 días de estudio a la semana, sesiones de 1.5-2h enfocadas y estructuradas"
- Dias/semana: 3-4
- Horas/día: 1.5-2h
- Materias por sesión: 2
- Color accent: emerald
- Schedule (hardcoded mock):
  Lunes: Matemáticas (álgebra básica) 2h
  Miércoles: Español (comprensión lectora) 1.5h
  Viernes: Biología (célula y organelos) 2h
  Sábado: Repaso general 1.5h

PLAN 2 — "Plan Óptimo" (slug: optimal) — BADGE: "RECOMENDADO" in violet
- Descripcion: "4-5 días balanceados, avance sostenido sin saturación"  
- Dias/semana: 4-5
- Horas/día: 2-3h
- Materias por sesión: 2-3
- Color accent: violet
- Schedule:
  Lunes: Matemáticas (álgebra + geometría) 2.5h
  Martes: Español + Historia 2h
  Jueves: Biología + Química 3h
  Viernes: Física 2h
  Sábado: Simulacro express 2h

PLAN 3 — "Máximo Esfuerzo" (slug: intensive)
- Descripcion: "5-6 días, alta carga estructurada con sesiones distribuidas en el día"
- Dias/semana: 5-6
- Horas/día: 4-5h (divididas en mañana y tarde)
- Materias por sesión: 3-4
- Color accent: rose
- Schedule:
  Lunes: Mañana Matemáticas 2h / Tarde Física 2h
  Martes: Español + Historia 3h
  Miércoles: Química + Biología 4h
  Jueves: Matemáticas avanzadas 3h / Tarde repaso 2h
  Viernes: Simulacro completo 3h
  Sábado: Análisis de errores + refuerzo 3h

PLAN 4 — "Personalizado" (slug: custom)
- Descripcion: "Tú decides los días y horas. Armaremos tu calendario con IA."
- Shows a mini form: slider para días/semana (3-6), slider para horas/día (1-5)
- Below the sliders shows the EventManager calendar component (month view, compact)
- The calendar pre-populates with the user's selected days as study blocks
- Color accent: amber

STEP 2: Confirmation screen
Shows the selected plan name, a preview of week 1, and a "Comenzar ahora" CTA.
On confirm: save to localStorage "cefigo_plan_selected" = planSlug, close modal, show dashboard.

The modal should have a subtle entry animation (scale + fade from 0.95 to 1).
Background overlay: bg-black/70 backdrop-blur-sm.

Integrate at the top of dashboard/page.tsx with dynamic import (no SSR).

---

## TASK 6 — Courses: Lesson + Quiz structure [ ]

File: app/(app)/courses/[slug]/page.tsx — course detail (modules list)
File: app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx — lesson player
File: components/video/InteractivePlayer.tsx — already has checkpoint logic

The course detail page ([slug]/page.tsx) should show module structure as:
MODULE TITLE (accordion)
  └─ Lesson title — X min — [Play button]
  └─ Cuestionario — 5 preguntas — [locked until lesson done]
  └─ Lesson title — X min — [Play button]
  └─ Cuestionario — 5 preguntas
  ...
  └─ EXAMEN DE MODULO — 15 preguntas — [locked until all lessons done] — distinct styling (amber border)

Add mock data for this structure in lib/mock-data/unam-course.ts.
Add a `quizzes` array to each module with: id, lessonId (links to lesson), questions count, done status.
Add a `moduleExam` object to each module: id, questionsCount: 15, done, locked.

In the sidebar of the lesson page, show the same structure with progress indicators.
After a video completes (simulate with a "Marcar como completado" button for now), unlock its quiz.
After all lessons + quizzes in a module done, unlock the module exam.

---

## TASK 7 — /exam page: Simulacros y tests [ ]

File: app/(app)/exam/page.tsx (CREATE or REWRITE)

NO EMOJIS. Zero.

Page layout: two main sections with tabs at top.

TAB 1: "Simulacros Generales"
- Grid of exam cards, each card shows:
  - Exam name (e.g., "Simulacro UNAM 2024 — Área 2")
  - Area/category badge
  - Questions count (128 preguntas)
  - Estimated duration (3h 30min)
  - Difficulty indicator (bar, not emoji)
  - "Iniciar simulacro" button (primary) / "Ver resultados" if completed
- Mock data: 4 simulacros — UNAM Área 1, UNAM Área 2, IPN, CENEVAL EXANI-II

TAB 2: "Tests por Unidad"
- Three-step selector (cascading):
  Step 1: Select subject (Matemáticas, Español, Biología, Historia, Química, Física)
  Step 2: Select module (based on subject — show 3-4 mock modules per subject)
  Step 3: Shows available tests for that module (2-3 tests per module)
- Each test card: test name, questions count (15-25), difficulty, estimated time, start button

HISTORY (popup, not inline section):
- Floating button "Ver historial" (bottom right or top right of page)
- Opens a Dialog/modal showing past attempts:
  Table with: Exam name, Date, Score %, Correct/Total, Time taken, "Ver detalles" link
- Mock 5-6 history entries

---

## TASK 8 — Remove /mentors [ ]

Delete: app/(app)/mentors/ directory if it exists
Remove all links to /mentors from: sidebar, dashboard, any nav component
In dashboard page.tsx: remove the "Tu mentor" card section (Javier Silva card)
In Sidebar component: remove mentors nav item

---

## TASK 9 — /analytics: KPI dashboard [ ]

File: app/(app)/analytics/page.tsx (CREATE or REWRITE)

NO EMOJIS. Zero.

Page title: "Mi desempeño"
Subtitle: "Seguimiento detallado de tu preparación"

KPI CARDS ROW (6 cards, 3+3 on desktop):
1. "Ultimo simulacro" — score % large number, date, vs previous (up/down arrow with color)
2. "Avance del curso" — % of total course completed, progress ring visual
3. "Racha de estudio" — days number, longest streak below
4. "Cumplimiento del plan" — % of daily study tasks completed this week (if had plan tasks today, did they study?)
5. "Promedio general" — average score across all exams
6. "Tiempo total estudiado" — hours, breakdown by week

MAIN SECTION — Progress por materia:
Horizontal bar chart (SVG, no external library) showing score % per subject:
Matemáticas, Español, Biología, Historia, Química, Física
Each bar: colored by subject (use university subject colors), shows current % and target %

SECOND SECTION — Historial de simulacros:
Line chart (SVG) showing score evolution over last 8 attempts (reuse PerformanceChart approach from StudyPlanPanel but bigger)

THIRD SECTION — Actividad semanal:
Bar chart of study minutes per day (Mon-Sun) for current week
Compare vs previous week (two overlaid bars, different opacity)

FOURTH SECTION — Plan de estudio compliance:
Calendar heatmap (like GitHub contributions) for the last 4 weeks
Green = studied as planned, amber = partial, red = missed, empty = no plan

All data from lib/mock-data/analytics.ts — add new exports as needed.

---

## TASK 10 — /profile: Customizable profile + themes [ ]

File: app/(app)/profile/page.tsx (CREATE or REWRITE)

Sections in a single-column layout with cards:

CARD 1 — "Mi perfil"
- Avatar display (large, centered): for now show initials in gradient circle
- Future avatars placeholder with "Próximamente" overlay on a grid of locked avatar slots
- Nickname field (editable inline) — max 20 chars, alphanumeric + underscores
- Full name (display only for now)
- Email (display only)
- Target exam badge (UNAM/IPN/UAM)
- Exam date display
- "Guardar cambios" button

CARD 2 — "Tema de la aplicación"
This is a THEME SWITCHER. Choosing a theme changes CSS custom properties via a class on the html/body element.
Save choice to localStorage "cefigo_theme".

4 theme options displayed as color swatches with name:

Theme 1: "CEFI GO" (default)
  Primary: #7C3AED (violet), Accent: #EC4899 (pink), BG: #0B0617

Theme 2: "UNAM"  
  Based on: Azul Universitario #003366, Oro Universitario #CC9933, White #FFFFFF
  Primary: #003366, Accent: #CC9933, BG: #001a33 (darker blue)
  Heading color: #CC9933, Link color: #CC9933

Theme 3: "IPN"
  Based on: Guinda #800020, Verde Politécnico #006633, Gris #E0E0E0
  Primary: #800020, Accent: #006633, BG: #1a0008 (dark guinda)
  Heading color: #800020, Button accent: #006633

Each theme option: a rectangular swatch showing 3 color dots + theme name below
Selected theme: ring highlight
On select: apply class "theme-unam" / "theme-ipn" / "theme-cefigo" to document.documentElement

In app/globals.css add CSS variables per theme:
.theme-unam { --primary: #003366; --accent: #CC9933; ... }
.theme-ipn { --primary: #800020; --accent: #006633; ... }
(default is already the violet/pink)

CARD 3 — "Plan de estudio activo"
Shows the current selected plan (from localStorage "cefigo_plan_selected")
A "Cambiar plan" button that opens the WelcomePlanModal again

CARD 4 — "Cuenta y seguridad"
Change password (placeholder, disabled with "Próximamente")
Delete account (placeholder, disabled)

---

## TASK 11 — Emoji sweep [ ]

After ALL other tasks are done, run a comprehensive search for emojis across the codebase.
Search in: app/, components/, lib/
Common offenders: 👋 🔥 ⭐ 📚 🎯 ✅ 📊 ⏱️ 🔬 💡 🏆
Replace each with appropriate SVG icon or plain text.
Specific known locations:
- dashboard/page.tsx: "¡Hola, {name}! 👋" → remove the 👋
- dashboard/page.tsx: "🔥 Racha de X días" → use the FlameIcon SVG already defined
- Any "✅" in activity feeds → use checkmark SVG
- StudyPlanPanel.tsx: "💡 IA sugiere:" → replace with inline SVG lightbulb

---

## TASK 12 — Git commit and push [ ]

After all tasks complete:
git add -A
git commit -m "feat: CEFI GO rebrand, dashboard plan modal, exam page, analytics, profile themes, emoji cleanup"
git push origin main
Report the commit hash.

---

## EXECUTION ORDER
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

Start immediately with Task 1. Work through each task completely before moving to the next.
After each task: verify the file compiles (check for obvious TS errors), then mark [DONE].
