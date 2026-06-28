# Interactive Learning System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete course learning experience with tabbed navigation (Videos, Exámenes, Recursos), an interactive video player (local file for now, Vimeo in production) that pauses at admin-configured checkpoints to show questions, a full exam system with metadata and scoring, and a study resources section.

**Architecture:** All data is mock (no Supabase calls yet). The course detail page gains three tabs rendered by a client `CourseTabs` component. The `InteractivePlayer` supports two modes: local video (`videoSrc` prop → HTML5 `<video>` element + `timeupdate` event) and Vimeo (`vimeoId` prop → `@vimeo/player` SDK). Checkpoint timestamps are stored in mock data simulating what an admin will configure in the `video_checkpoints` Supabase table when uploading a new lesson. A full-screen overlay pauses the video, forces an answer, shows feedback, then resumes. The exam system extends the existing `/exam/[examId]` page with richer question data.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS + existing design tokens (`.card`, `.btn--primary`, `gradient-text`, etc.), HTML5 `<video>` for local files, `@vimeo/player` for production, React state for all interactivity.

> **Admin note on checkpoints:** The `timestampSeconds` values in `videoCheckpoints` mock data represent what an admin sets via the admin panel when uploading a lesson (stored in `public.video_checkpoints` in Supabase). For now they are hardcoded in mock data; the admin UI to configure them is a future task.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/mock-data/unam-course.ts` | Full UNAM syllabus (modules + lessons), video checkpoints, exam questions, study resources |
| Modify | `lib/mock-data/index.ts` | Re-export everything from `unam-course.ts` |
| Create | `components/video/CheckpointOverlay.tsx` | Full-screen overlay: question + options + feedback + continue button |
| Create | `components/video/InteractivePlayer.tsx` | Unified player: local `<video>` (dev) or Vimeo SDK (prod) + checkpoint overlay trigger |
| Create | `components/courses/CourseTabs.tsx` | Client tab switcher for Videos / Exámenes / Recursos tabs |
| Modify | `app/(app)/courses/[slug]/page.tsx` | Use `CourseTabs` instead of the bare modules list |
| Modify | `app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx` | Use `InteractivePlayer` instead of bare `<iframe>` |

---

## Task 1: Mock data — full UNAM syllabus, exam, checkpoints, resources

**Files:**
- Create: `lib/mock-data/unam-course.ts`
- Modify: `lib/mock-data/index.ts`

- [ ] **Step 1: Create `lib/mock-data/unam-course.ts`**

```typescript
// lib/mock-data/unam-course.ts

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  done: boolean;
  current?: boolean;
  /** Local video path (e.g. "/videos/lesson-1-3.mp4") used during dev */
  videoSrc?: string;
  /** Vimeo numeric ID used in production (set by admin when uploading lesson) */
  vimeoId?: string;
  description: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface VideoCheckpoint {
  id: string;
  lessonId: string;
  timestampSeconds: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseExam {
  id: string;
  title: string;
  university: string;
  universityFull: string;
  area: string;
  areaFull: string;
  year: number;
  timeMinutes: number;
  passingScore: number;
  difficulty: "Fácil" | "Medio" | "Alto";
  subjects: string[];
  questions: ExamQuestion[];
}

export interface StudyResource {
  id: string;
  title: string;
  type: "PDF" | "PPT" | "Guía";
  subject: string;
  description: string;
  fileSize: string;
  url: string;
}

// ─── SYLLABUS ────────────────────────────────────────────────────────────────

export const unamModules: Module[] = [
  {
    id: 1,
    title: "Módulo 1 — Biología Celular",
    lessons: [
      {
        id: "1-1",
        title: "La célula: estructura y función",
        duration: "18 min",
        done: true,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Revisamos los componentes fundamentales de la célula eucariota y procariota, su organización interna y las diferencias clave que las distinguen.",
      },
      {
        id: "1-2",
        title: "Membrana plasmática y transporte",
        duration: "22 min",
        done: true,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Estructura lipoproteica de la membrana, transporte activo vs pasivo, ósmosis y difusión facilitada.",
      },
      {
        id: "1-3",
        title: "Organelos celulares",
        duration: "25 min",
        done: false,
        current: true,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Mitocondria, retículo endoplásmico, aparato de Golgi, lisosomas y ribosomas: función y estructura. Este tema representa el 12% de Biología en el examen UNAM.",
      },
      {
        id: "1-4",
        title: "Ciclo celular y mitosis",
        duration: "20 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Las cuatro fases del ciclo celular, control del ciclo y las etapas de la mitosis: profase, metafase, anafase y telofase.",
      },
      {
        id: "1-5",
        title: "Meiosis y reproducción sexual",
        duration: "24 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Meiosis I y II, diferencias con la mitosis, formación de gametos y variabilidad genética.",
      },
    ],
  },
  {
    id: 2,
    title: "Módulo 2 — Genética",
    lessons: [
      {
        id: "2-1",
        title: "ADN: estructura y replicación",
        duration: "28 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Modelo de doble hélice, nucleótidos, replicación semiconservativa y enzimas clave.",
      },
      {
        id: "2-2",
        title: "Transcripción y traducción",
        duration: "30 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Del ADN al ARNm (transcripción), del ARNm a proteína (traducción), código genético y ribosomas.",
      },
      {
        id: "2-3",
        title: "Leyes de Mendel",
        duration: "22 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Primera y segunda ley de Mendel, cruzas monohíbridas y dihíbridas, cuadro de Punnett.",
      },
      {
        id: "2-4",
        title: "Herencia no mendeliana",
        duration: "20 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Dominancia incompleta, codominancia, alelos múltiples y grupos sanguíneos ABO.",
      },
    ],
  },
  {
    id: 3,
    title: "Módulo 3 — Química General",
    lessons: [
      {
        id: "3-1",
        title: "Tabla periódica y propiedades",
        duration: "20 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Grupos y periodos, propiedades periódicas: electronegatividad, radio atómico, energía de ionización.",
      },
      {
        id: "3-2",
        title: "Enlace químico",
        duration: "25 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Enlace iónico, covalente y metálico. Geometría molecular y polaridad.",
      },
      {
        id: "3-3",
        title: "Estequiometría y mol",
        duration: "28 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Concepto de mol, número de Avogadro, masa molar, balanceo de ecuaciones y rendimiento de reacción.",
      },
      {
        id: "3-4",
        title: "Ácidos, bases y pH",
        duration: "22 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Teorías de Arrhenius y Brønsted-Lowry, escala de pH, indicadores y soluciones tampón.",
      },
    ],
  },
  {
    id: 4,
    title: "Módulo 4 — Física",
    lessons: [
      {
        id: "4-1",
        title: "Cinemática: movimiento rectilíneo",
        duration: "22 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "MRU y MRUV: ecuaciones de posición, velocidad y aceleración. Caída libre y tiro vertical.",
      },
      {
        id: "4-2",
        title: "Leyes de Newton",
        duration: "20 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Primera, segunda y tercera ley. Aplicaciones: planos inclinados, poleas y fricción.",
      },
      {
        id: "4-3",
        title: "Energía, trabajo y potencia",
        duration: "18 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Trabajo mecánico, energía cinética y potencial, conservación de la energía mecánica.",
      },
    ],
  },
  {
    id: 5,
    title: "Módulo 5 — Matemáticas",
    lessons: [
      {
        id: "5-1",
        title: "Álgebra: ecuaciones y sistemas",
        duration: "30 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Ecuaciones de primer y segundo grado, fórmula general, sistemas de dos ecuaciones.",
      },
      {
        id: "5-2",
        title: "Funciones y gráficas",
        duration: "25 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Funciones lineales, cuadráticas, exponenciales y logarítmicas. Dominio y rango.",
      },
      {
        id: "5-3",
        title: "Trigonometría",
        duration: "28 min",
        done: false,
        videoSrc: "/videos/placeholder.mp4",
        description:
          "Razones trigonométricas, identidades fundamentales, ley de senos y cosenos.",
      },
    ],
  },
];

// ─── VIDEO CHECKPOINTS ────────────────────────────────────────────────────────

export const videoCheckpoints: VideoCheckpoint[] = [
  // Lesson 1-3 (organelos celulares)
  {
    id: "cp-1-3-a",
    lessonId: "1-3",
    timestampSeconds: 25,
    question: "¿En qué organelo ocurre principalmente la síntesis de proteínas?",
    options: ["Mitocondria", "Ribosoma", "Aparato de Golgi", "Vacuola"],
    correctIndex: 1,
    explanation:
      "Los ribosomas son los organelos responsables de traducir el ARNm en proteínas. Pueden estar libres en el citoplasma o unidos al retículo endoplásmico rugoso.",
  },
  {
    id: "cp-1-3-b",
    lessonId: "1-3",
    timestampSeconds: 55,
    question: "¿Cuál es la función principal de la mitocondria?",
    options: [
      "Síntesis de lípidos",
      "Producción de ATP mediante respiración celular",
      "Digestión de partículas extracelulares",
      "Modificación y empaquetado de proteínas",
    ],
    correctIndex: 1,
    explanation:
      "La mitocondria es la 'central energética' de la célula. A través de la cadena respiratoria y la fosforilación oxidativa genera la mayor parte del ATP que la célula necesita.",
  },
  {
    id: "cp-1-3-c",
    lessonId: "1-3",
    timestampSeconds: 90,
    question: "¿Qué organelo modifica, empaqueta y distribuye proteínas hacia su destino final?",
    options: [
      "Retículo endoplásmico liso",
      "Lisosoma",
      "Aparato de Golgi",
      "Núcleo",
    ],
    correctIndex: 2,
    explanation:
      "El aparato de Golgi actúa como el sistema postal de la célula: recibe proteínas del retículo endoplásmico rugoso, las modifica (glucosilación, etc.) y las envía a la membrana, lisosomas o al exterior.",
  },
];

// ─── EXAM ─────────────────────────────────────────────────────────────────────

export const unamExam: CourseExam = {
  id: "unam-area2-2024",
  title: "Simulacro UNAM · Área 2 — 2024",
  university: "UNAM",
  universityFull: "Universidad Nacional Autónoma de México",
  area: "Área 2",
  areaFull: "Ciencias Biológicas, Químicas y de la Salud",
  year: 2024,
  timeMinutes: 30,
  passingScore: 70,
  difficulty: "Alto",
  subjects: ["Biología", "Química", "Física", "Matemáticas", "Español", "Historia"],
  questions: [
    // ── Biología ──
    {
      id: "q01",
      subject: "Biología",
      text: "¿Cuál de las siguientes estructuras es exclusiva de las células eucariotas?",
      options: ["Ribosoma", "ADN circular", "Núcleo con membrana", "Pared celular de peptidoglucano"],
      correctIndex: 2,
      explanation:
        "El núcleo rodeado por membrana nuclear (carioteca) es una característica definitoria de las células eucariotas. Los procariotas tienen su material genético disperso en el citoplasma (nucleoide).",
    },
    {
      id: "q02",
      subject: "Biología",
      text: "Durante la fotosíntesis, ¿en qué fase se produce el ATP y el NADPH que se usarán en el Ciclo de Calvin?",
      options: ["Ciclo de Calvin", "Fase luminosa", "Glucólisis", "Ciclo de Krebs"],
      correctIndex: 1,
      explanation:
        "En la fase luminosa (reacciones de la luz), la clorofila absorbe energía solar para dividir el agua (fotólisis), producir O₂, y generar ATP y NADPH que alimentan el Ciclo de Calvin.",
    },
    {
      id: "q03",
      subject: "Biología",
      text: "¿Qué tipo de división celular produce cuatro células haploides genéticamente diferentes a partir de una célula diploide?",
      options: ["Mitosis", "Amitosis", "Meiosis", "Fisión binaria"],
      correctIndex: 2,
      explanation:
        "La meiosis consiste en dos divisiones sucesivas (meiosis I y II) que reducen a la mitad el número de cromosomas y generan variabilidad por entrecruzamiento (crossing-over).",
    },
    // ── Química ──
    {
      id: "q04",
      subject: "Química",
      text: "¿Cuántos moles están contenidos en 88 g de dióxido de carbono (CO₂)? (C=12, O=16)",
      options: ["1 mol", "2 mol", "4 mol", "0.5 mol"],
      correctIndex: 1,
      explanation:
        "La masa molar del CO₂ es 12 + (2×16) = 44 g/mol. Moles = 88 g ÷ 44 g/mol = 2 mol.",
    },
    {
      id: "q05",
      subject: "Química",
      text: "Una solución acuosa tiene una concentración de iones hidrógeno [H⁺] = 10⁻³ M. ¿Cuál es su pH y cómo se clasifica?",
      options: [
        "pH = 3, ácida",
        "pH = 11, básica",
        "pH = 7, neutra",
        "pH = 3, básica",
      ],
      correctIndex: 0,
      explanation:
        "pH = −log[H⁺] = −log(10⁻³) = 3. Como pH < 7, la solución es ácida.",
    },
    {
      id: "q06",
      subject: "Química",
      text: "¿Cuáles son los productos de la reacción de neutralización entre el ácido clorhídrico (HCl) y el hidróxido de sodio (NaOH)?",
      options: [
        "Na₂O + H₂",
        "NaCl + H₂O",
        "NaH + Cl₂ + O₂",
        "NaOH₂Cl",
      ],
      correctIndex: 1,
      explanation:
        "HCl + NaOH → NaCl + H₂O. En toda neutralización ácido-base se forman una sal y agua.",
    },
    // ── Física ──
    {
      id: "q07",
      subject: "Física",
      text: "Un objeto cae libremente desde una altura de 45 m. Tomando g = 10 m/s², ¿con qué velocidad llega al suelo?",
      options: ["20 m/s", "25 m/s", "30 m/s", "45 m/s"],
      correctIndex: 2,
      explanation:
        "Con v² = 2gh → v = √(2 × 10 × 45) = √900 = 30 m/s.",
    },
    {
      id: "q08",
      subject: "Física",
      text: "Un bloque de 5 kg sobre una superficie sin fricción recibe una fuerza neta de 20 N. ¿Cuál es su aceleración?",
      options: ["0.25 m/s²", "2 m/s²", "4 m/s²", "100 m/s²"],
      correctIndex: 2,
      explanation:
        "Segunda Ley de Newton: a = F/m = 20 N ÷ 5 kg = 4 m/s².",
    },
    // ── Matemáticas ──
    {
      id: "q09",
      subject: "Matemáticas",
      text: "Resuelve la ecuación cuadrática 2x² − 7x + 3 = 0 usando la fórmula general.",
      options: [
        "x = 3 y x = 1/2",
        "x = −3 y x = −1/2",
        "x = 7 y x = 3",
        "x = 2 y x = 3/2",
      ],
      correctIndex: 0,
      explanation:
        "Discriminante: b² − 4ac = 49 − 24 = 25. x = (7 ± 5) / 4. Soluciones: x = 12/4 = 3 y x = 2/4 = 1/2.",
    },
    {
      id: "q10",
      subject: "Matemáticas",
      text: "Si f(x) = 3x³ − 4x² + 2x − 1, ¿cuál es la derivada f'(x)?",
      options: [
        "9x² − 8x + 2",
        "3x² − 4x + 2",
        "9x² − 8x − 1",
        "x³ − 4x + 2",
      ],
      correctIndex: 0,
      explanation:
        "f'(x) = 3·3x² − 4·2x + 2·1 = 9x² − 8x + 2. Se aplica la regla de la potencia término a término.",
    },
    {
      id: "q11",
      subject: "Matemáticas",
      text: "¿Cuál es el valor del límite lim(x→0) [sin(x)/x]?",
      options: ["1", "0", "∞", "No existe"],
      correctIndex: 0,
      explanation:
        "Este es el límite trigonométrico fundamental. lim(x→0) sin(x)/x = 1. Se demuestra geométricamente comparando áreas del círculo unitario.",
    },
    // ── Español ──
    {
      id: "q12",
      subject: "Español",
      text: "En la oración: 'Sus ojos son dos luceros brillantes', ¿qué figura retórica se emplea?",
      options: ["Hipérbole", "Metáfora", "Símil", "Personificación"],
      correctIndex: 1,
      explanation:
        "Es una metáfora: se identifica directamente 'ojos' con 'luceros' sin usar nexos comparativos (que sería un símil como 'sus ojos son como luceros').",
    },
    {
      id: "q13",
      subject: "Español",
      text: "¿Cuál de las siguientes palabras lleva tilde según las reglas de acentuación del español?",
      options: ["Examen", "Virgen", "Dificil", "Camion"],
      correctIndex: 2,
      explanation:
        "Difícil es una palabra esdrújula (acento en la antepenúltima sílaba DI-fí-cil) y las esdrújulas siempre llevan tilde. La forma correcta es 'difícil'.",
    },
    // ── Historia ──
    {
      id: "q14",
      subject: "Historia",
      text: "¿En qué año se promulgó la Constitución Política de los Estados Unidos Mexicanos que actualmente está vigente?",
      options: ["1917", "1824", "1857", "1910"],
      correctIndex: 0,
      explanation:
        "La Constitución de 1917, promulgada el 5 de febrero en Querétaro durante el gobierno de Venustiano Carranza, es la que sigue vigente, con numerosas reformas posteriores.",
    },
    {
      id: "q15",
      subject: "Historia",
      text: "¿Cuál fue el principal movimiento político-social que inició Francisco I. Madero en 1910?",
      options: [
        "La Reforma",
        "La Revolución Mexicana",
        "La Guerra de Independencia",
        "El Porfiriato",
      ],
      correctIndex: 1,
      explanation:
        "Madero lanzó el Plan de San Luis el 5 de octubre de 1910, llamando al pueblo a levantarse el 20 de noviembre, iniciando así la Revolución Mexicana contra la dictadura de Díaz.",
    },
  ],
};

// ─── STUDY RESOURCES ─────────────────────────────────────────────────────────

export const unamResources: StudyResource[] = [
  {
    id: "r01",
    title: "Resumen completo UNAM Área 2",
    type: "PDF",
    subject: "General",
    description: "Síntesis de todos los temas del examen con los reactivos más frecuentes de los últimos 5 años.",
    fileSize: "4.2 MB",
    url: "#",
  },
  {
    id: "r02",
    title: "Biología celular — mapa conceptual",
    type: "PDF",
    subject: "Biología",
    description: "Diagrama completo de la célula eucariota con todos sus organelos, función y características clave.",
    fileSize: "1.8 MB",
    url: "#",
  },
  {
    id: "r03",
    title: "Formulario de Química",
    type: "PDF",
    subject: "Química",
    description: "Tabla periódica comentada, fórmulas de estequiometría, tabla de pH y principales reacciones.",
    fileSize: "2.1 MB",
    url: "#",
  },
  {
    id: "r04",
    title: "Leyes de Newton y Cinemática",
    type: "PPT",
    subject: "Física",
    description: "Presentación animada con las 3 leyes de Newton, diagramas de cuerpo libre y 20 ejercicios resueltos.",
    fileSize: "8.5 MB",
    url: "#",
  },
  {
    id: "r05",
    title: "Álgebra y funciones para el UNAM",
    type: "PDF",
    subject: "Matemáticas",
    description: "Ecuaciones cuadráticas, sistemas de ecuaciones, funciones y sus gráficas con ejemplos tipo UNAM.",
    fileSize: "3.3 MB",
    url: "#",
  },
  {
    id: "r06",
    title: "Historia de México — Línea del tiempo",
    type: "PPT",
    subject: "Historia",
    description: "Desde la época prehispánica hasta la actualidad. Eventos clave, personajes y fechas con imágenes.",
    fileSize: "12.1 MB",
    url: "#",
  },
  {
    id: "r07",
    title: "Guía de redacción y análisis de texto",
    type: "Guía",
    subject: "Español",
    description: "Figuras retóricas, tipos de texto, análisis sintáctico y reglas de acentuación con ejercicios.",
    fileSize: "2.6 MB",
    url: "#",
  },
  {
    id: "r08",
    title: "100 reactivos resueltos — Biología",
    type: "PDF",
    subject: "Biología",
    description: "Banco de preguntas con respuesta y explicación detallada. Organizado por tema y dificultad.",
    fileSize: "5.0 MB",
    url: "#",
  },
];
```

- [ ] **Step 2: Add re-exports to `lib/mock-data/index.ts`**

Open `lib/mock-data/index.ts` and append at the end:

```typescript
export {
  unamModules,
  videoCheckpoints,
  unamExam,
  unamResources,
} from "./unam-course";
export type {
  Lesson,
  Module,
  VideoCheckpoint,
  ExamQuestion,
  CourseExam,
  StudyResource,
} from "./unam-course";
```

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/unam-course.ts lib/mock-data/index.ts
git commit -m "feat: add full UNAM mock data — syllabus, exam (15 questions), checkpoints, resources"
```

---

## Task 2: CheckpointOverlay component

**Files:**
- Create: `components/video/CheckpointOverlay.tsx`

- [ ] **Step 1: Create `components/video/CheckpointOverlay.tsx`**

```tsx
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

  function handleSelect(i: number) {
    if (revealed) return;
    setSelected(i);
  }

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
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg card border border-violet-500/30 shadow-2xl shadow-violet-900/40">
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
            let stateClass = "bg-white/3 border-white/8 text-white/70 hover:bg-white/6 hover:border-white/15";
            if (revealed) {
              if (i === checkpoint.correctIndex) {
                stateClass = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300";
              } else if (i === selected && !isCorrect) {
                stateClass = "bg-red-500/15 border-red-500/40 text-red-300";
              } else {
                stateClass = "bg-white/3 border-white/5 text-white/30";
              }
            } else if (selected === i) {
              stateClass = "bg-violet-500/15 border-violet-500/40 text-white";
            }

            return (
              <label
                key={i}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${stateClass}`}
              >
                <input
                  type="radio"
                  name="checkpoint-answer"
                  value={i}
                  checked={selected === i}
                  onChange={() => handleSelect(i)}
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
                <span className="text-sm leading-snug">{opt}</span>
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
              {isCorrect ? "¡Correcto! 🎉" : "Respuesta incorrecta"}
            </span>
            {checkpoint.explanation}
          </div>
        )}

        {/* Action buttons */}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/video/CheckpointOverlay.tsx
git commit -m "feat: add CheckpointOverlay — interactive question popup for video pauses"
```

---

## Task 3: InteractivePlayer component

**Files:**
- Create: `components/video/InteractivePlayer.tsx`

**How the player works:**
- Props: `videoSrc?: string` (local file for dev) and `vimeoId?: string` (Vimeo for prod). Exactly one must be provided.
- **Local mode** (`videoSrc`): renders `<video>` element, listens to the native `timeupdate` event (fires ~4× per second). When current time crosses a checkpoint timestamp, pauses the video and shows the overlay.
- **Vimeo mode** (`vimeoId`): uses `@vimeo/player` SDK. Listens to the Vimeo `timeupdate` event the same way. Run `npm install @vimeo/player` before implementing.
- The `checkpoints` prop comes from mock data, which mirrors what the admin will store in `public.video_checkpoints` in Supabase. Each checkpoint has `timestampSeconds` set by the admin when uploading a lesson.
- A `useRef<Set<string>>(new Set())` (`answeredRef`) tracks which checkpoints the user has already answered so they are never triggered again even if the user seeks backward.

- [ ] **Step 0: Install Vimeo player SDK**

Run in the project root:
```bash
npm install @vimeo/player
```

- [ ] **Step 1: Create `components/video/InteractivePlayer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CheckpointOverlay from "./CheckpointOverlay";
import type { VideoCheckpoint } from "@/lib/mock-data";

interface Props {
  /** Local video file path, e.g. "/videos/lesson-1-3.mp4". Used during dev. */
  videoSrc?: string;
  /** Vimeo numeric ID. Used in production once admin uploads to Vimeo. */
  vimeoId?: string;
  lessonId: string;
  /** All checkpoints — component filters to those matching lessonId. */
  checkpoints: VideoCheckpoint[];
}

export default function InteractivePlayer({ videoSrc, vimeoId, lessonId, checkpoints }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vimeoPlayerRef = useRef<any>(null);
  const answeredRef = useRef<Set<string>>(new Set());

  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<
    Map<string, { selected: number; isCorrect: boolean }>
  >(new Map());

  const lessonCheckpoints = checkpoints.filter((cp) => cp.lessonId === lessonId);

  function findTriggered(currentSeconds: number): VideoCheckpoint | undefined {
    return lessonCheckpoints.find(
      (cp) =>
        !answeredRef.current.has(cp.id) &&
        currentSeconds >= cp.timestampSeconds &&
        currentSeconds < cp.timestampSeconds + 2
    );
  }

  // ── Local video mode ──────────────────────────────────────────────────────
  function handleTimeUpdate() {
    if (!videoRef.current || activeCheckpoint) return;
    const triggered = findTriggered(videoRef.current.currentTime);
    if (triggered) {
      videoRef.current.pause();
      setActiveCheckpoint(triggered);
    }
  }

  // ── Vimeo mode ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!vimeoId || !vimeoContainerRef.current) return;

    let destroyed = false;

    import("@vimeo/player").then(({ default: VimeoPlayer }) => {
      if (destroyed || !vimeoContainerRef.current) return;

      const player = new VimeoPlayer(vimeoContainerRef.current, {
        id: Number(vimeoId),
        responsive: true,
        dnt: true,
      });

      vimeoPlayerRef.current = player;

      player.on("timeupdate", ({ seconds }: { seconds: number }) => {
        if (activeCheckpoint) return;
        const triggered = findTriggered(seconds);
        if (triggered) {
          player.pause();
          setActiveCheckpoint(triggered);
        }
      });
    });

    return () => {
      destroyed = true;
      vimeoPlayerRef.current?.destroy().catch(() => {});
      vimeoPlayerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeoId, lessonId]);

  // ── Checkpoint answer handler ─────────────────────────────────────────────
  function handleContinue(selectedIndex: number, isCorrect: boolean) {
    if (!activeCheckpoint) return;
    answeredRef.current.add(activeCheckpoint.id);
    setAnsweredCheckpoints((prev) =>
      new Map(prev).set(activeCheckpoint.id, { selected: selectedIndex, isCorrect })
    );
    setActiveCheckpoint(null);

    // Resume whichever player is active
    if (videoRef.current) videoRef.current.play();
    if (vimeoPlayerRef.current) vimeoPlayerRef.current.play();
  }

  const totalCheckpoints = lessonCheckpoints.length;
  const answeredCount = answeredCheckpoints.size;
  const correctCount = [...answeredCheckpoints.values()].filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-3">
      {/* Player wrapper */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/8">
        <div style={{ paddingBottom: "56.25%" }} className="relative">

          {/* Local video */}
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Vimeo embed container */}
          {vimeoId && (
            <div ref={vimeoContainerRef} className="absolute inset-0 w-full h-full" />
          )}

          {/* Checkpoint overlay — covers both player types */}
          {activeCheckpoint && (
            <CheckpointOverlay
              checkpoint={activeCheckpoint}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>

      {/* Checkpoint status bar */}
      {totalCheckpoints > 0 && (
        <div className="flex items-center gap-3 text-xs text-white/50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            {answeredCount === 0
              ? `Este video tiene ${totalCheckpoints} pregunta${totalCheckpoints > 1 ? "s" : ""} interactiva${totalCheckpoints > 1 ? "s" : ""}`
              : `${correctCount}/${answeredCount} correcta${correctCount !== 1 ? "s" : ""} · ${totalCheckpoints - answeredCount} restante${totalCheckpoints - answeredCount !== 1 ? "s" : ""}`}
          </span>
          <div className="flex-1 flex gap-1">
            {lessonCheckpoints.map((cp) => {
              const result = answeredCheckpoints.get(cp.id);
              return (
                <div
                  key={cp.id}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    !result ? "bg-white/15" : result.isCorrect ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/video/InteractivePlayer.tsx
git commit -m "feat: add InteractivePlayer — YouTube IFrame API with checkpoint polling and pause overlay"
```

---

## Task 4: Update lesson page to use InteractivePlayer

**Files:**
- Modify: `app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx`

The page must become a **client component** because `InteractivePlayer` uses browser APIs. We pass the lesson's `youtubeId`, the `lessonId`, and the `videoCheckpoints` array.

- [ ] **Step 1: Rewrite `app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx`**

Replace the entire file with:

```tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { mockCourses, unamModules, videoCheckpoints } from "@/lib/mock-data";
import InteractivePlayer from "@/components/video/InteractivePlayer";

interface PageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default function LessonPage({ params }: PageProps) {
  const { slug, lessonId } = use(params);
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];

  // Flatten all lessons from the UNAM modules
  const allLessons = unamModules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex] ?? allLessons[0];
  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];

  // Find which module this lesson belongs to
  const module = unamModules.find((m) => m.lessons.some((l) => l.id === lessonId));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">{course.title}</Link>
        <span>/</span>
        <span className="text-white/70">{lesson.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive video player — local file during dev, vimeoId in prod */}
          <InteractivePlayer
            videoSrc={lesson.videoSrc}
            vimeoId={lesson.vimeoId}
            lessonId={lessonId}
            checkpoints={videoCheckpoints}
          />

          {/* Lesson info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-violet-400 font-bold mb-1">
                  {module?.title ?? "Módulo"}
                </p>
                <h1
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lesson.title}
                </h1>
              </div>
              <span className="badge badge--violet shrink-0">{lesson.duration}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">{lesson.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {prev ? (
              <Link href={`/courses/${slug}/lessons/${prev.id}`} className="btn btn--ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {prev.title}
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/courses/${slug}/lessons/${next.id}`} className="btn btn--primary">
                {next.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link href={`/courses/${slug}`} className="btn btn--primary">
                Finalizar módulo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <aside className="space-y-4">
          <h2 className="font-black" style={{ fontFamily: "var(--font-display)" }}>
            {module?.title ?? "Lecciones"}
          </h2>
          <ul className="space-y-1">
            {(module?.lessons ?? allLessons.slice(0, 5)).map((l) => (
              <li key={l.id}>
                <Link
                  href={`/courses/${slug}/lessons/${l.id}`}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                    l.id === lessonId
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : l.done
                      ? "text-white/50 hover:bg-white/5"
                      : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    l.done ? "bg-emerald-500/20 text-emerald-400"
                    : l.id === lessonId ? "bg-violet-500/30 text-violet-300"
                    : "bg-white/8 text-white/30"
                  }`}>
                    {l.done
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                      : l.id === lessonId
                      ? <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                      : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>
                    }
                  </span>
                  <span className="flex-1 leading-snug">{l.title}</span>
                  <span className="text-xs text-white/30 shrink-0">{l.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/courses/[slug]/lessons/[lessonId]/page.tsx"
git commit -m "feat: lesson page now uses InteractivePlayer with YouTube API and checkpoint pauses"
```

---

## Task 5: CourseTabs component and course detail page

**Files:**
- Create: `components/courses/CourseTabs.tsx`
- Modify: `app/(app)/courses/[slug]/page.tsx`

The tabs are: **Videos** (full syllabus), **Exámenes** (course exams), **Recursos de Estudio** (PDFs + PPTs).

- [ ] **Step 1: Create `components/courses/CourseTabs.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { unamModules, unamExam, unamResources } from "@/lib/mock-data";
import type { Module } from "@/lib/mock-data";

type Tab = "videos" | "examenes" | "recursos";

const RESOURCE_BADGE: Record<string, string> = {
  PDF: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  PPT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Guía: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

function ResourceIcon({ type }: { type: string }) {
  if (type === "PPT")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    );
  if (type === "Guía")
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="11" y2="16"/>
      </svg>
    );
  // PDF
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

interface Props {
  slug: string;
  modules: Module[];
}

export default function CourseTabs({ slug, modules }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([1]));

  function toggleModule(id: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.flatMap((m) => m.lessons).filter((l) => l.done).length;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {(
          [
            { key: "videos", label: "Videos", count: totalLessons },
            { key: "examenes", label: "Exámenes", count: unamExam.questions.length },
            { key: "recursos", label: "Recursos de Estudio", count: unamResources.length },
          ] as { key: Tab; label: string; count: number }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/8 text-white/40"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── VIDEOS TAB ── */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>
              Contenido del curso
            </h2>
            <span className="text-xs text-white/40">
              {completedLessons}/{totalLessons} lecciones completadas
            </span>
          </div>

          {modules.map((mod) => (
            <div key={mod.id} className="card overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between gap-4 py-1 text-left select-none"
                aria-expanded={openModules.has(mod.id)}
              >
                <span className="font-bold text-sm">{mod.title}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/40">
                    {mod.lessons.filter((l) => l.done).length}/{mod.lessons.length} lecciones
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`text-white/40 transition-transform ${openModules.has(mod.id) ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openModules.has(mod.id) && (
                <ul className="mt-3 space-y-1 border-t border-white/5 pt-3">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${slug}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                          lesson.current
                            ? "bg-violet-500/15 text-violet-300"
                            : lesson.done
                            ? "text-white/50 hover:bg-white/5"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          lesson.done ? "bg-emerald-500/20 text-emerald-400"
                          : lesson.current ? "bg-violet-500/30 text-violet-300"
                          : "bg-white/8 text-white/30"
                        }`}>
                          {lesson.done
                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                            : lesson.current
                            ? <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                            : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>
                          }
                        </span>
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-white/30">{lesson.duration}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EXÁMENES TAB ── */}
      {activeTab === "examenes" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Simulacros disponibles
            </h2>
            <p className="text-sm text-white/45">Pon a prueba tu conocimiento antes del examen real</p>
          </div>

          {/* Exam card */}
          <div className="card border border-violet-500/20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/25 rounded-full px-2.5 py-0.5">
                    {unamExam.difficulty}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/15 text-violet-400 border border-violet-500/25 rounded-full px-2.5 py-0.5">
                    {unamExam.area}
                  </span>
                </div>
                <h3 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
                  {unamExam.title}
                </h3>
                <p className="text-xs text-white/40 mt-1">{unamExam.universityFull} · {unamExam.areaFull}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: "📋", label: "Reactivos", value: unamExam.questions.length },
                { icon: "⏱", label: "Tiempo", value: `${unamExam.timeMinutes} min` },
                { icon: "🎯", label: "Aprobatorio", value: `${unamExam.passingScore}%` },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/4 rounded-xl p-3 text-center">
                  <p className="text-lg">{stat.icon}</p>
                  <p className="text-sm font-bold">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {unamExam.subjects.map((s) => (
                <span key={s} className="text-[10px] font-semibold bg-white/5 text-white/50 rounded-full px-2.5 py-0.5 border border-white/8">
                  {s}
                </span>
              ))}
            </div>

            <Link
              href={`/exam/${unamExam.id}`}
              className="btn btn--primary w-full justify-center"
            >
              Iniciar simulacro
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Coming soon */}
          <div className="card border-dashed border-white/10 text-center py-8">
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-sm font-semibold text-white/50">Más simulacros próximamente</p>
            <p className="text-xs text-white/30 mt-1">Mini-tests por materia y simulacros de años anteriores</p>
          </div>
        </div>
      )}

      {/* ── RECURSOS TAB ── */}
      {activeTab === "recursos" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Recursos de estudio
            </h2>
            <p className="text-sm text-white/45">PDFs, presentaciones y guías para complementar tu preparación</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {unamResources.map((resource) => (
              <div key={resource.id} className="card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">
                    <ResourceIcon type={resource.type} />
                  </span>
                  <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${RESOURCE_BADGE[resource.type]}`}>
                    {resource.type}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1 leading-snug">{resource.title}</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                    {resource.subject} · {resource.fileSize}
                  </p>
                  <p className="text-xs text-white/55 leading-relaxed">{resource.description}</p>
                </div>
                <a
                  href={resource.url}
                  className="btn btn--ghost text-sm text-center"
                  onClick={(e) => e.preventDefault()}
                >
                  Descargar
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/(app)/courses/[slug]/page.tsx`**

Replace the entire file with:

```tsx
import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";
import { unamModules } from "@/lib/mock-data";
import CourseTabs from "@/components/courses/CourseTabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug) ?? mockCourses[0];

  const totalLessons = unamModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const currentLesson = unamModules.flatMap((m) => m.lessons).find((l) => l.current);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-white transition-colors">Mis cursos</Link>
        <span>/</span>
        <span className="text-white/70">{course.title}</span>
      </nav>

      {/* Course header */}
      <header className={`card bg-gradient-to-br ${course.gradient} border-0 text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="badge badge--violet mb-3">{course.tag}</span>
            <h1
              className="text-3xl font-black mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {course.title}
            </h1>
            <p className="text-white/80 text-sm mb-4">
              Domina los temas que más se preguntan en el examen. Lecciones en video interactivo, exámenes y recursos de estudio integrados.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                {course.enrolled} aspirantes
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                {totalLessons} lecciones
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/70">Tu progreso</span>
            <span className="font-bold">{course.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-white/80" style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <CourseTabs slug={slug} modules={unamModules} />

      {/* Continue button */}
      {currentLesson && (
        <div className="flex justify-center">
          <Link
            href={`/courses/${slug}/lessons/${currentLesson.id}`}
            className="btn btn--primary btn--lg"
          >
            Continuar — {currentLesson.title}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/courses/CourseTabs.tsx "app/(app)/courses/[slug]/page.tsx"
git commit -m "feat: course detail page with Videos/Exámenes/Recursos tabs and full UNAM syllabus"
```

---

## Task 6: Update exam page to support new exam data

**Files:**
- Modify: `app/(app)/exam/[examId]/page.tsx`
- Modify: `lib/mock-data/index.ts`

The exam page needs to load `unamExam` when `examId === "unam-area2-2024"` and use `ExamQuestion` type (which has `subject` and `explanation` fields). The results screen should show per-subject breakdown.

- [ ] **Step 1: Add `unamExam` to `lib/mock-data/index.ts` exports (already done in Task 1)**

Verify that `unamExam` is exported from `lib/mock-data/index.ts`. If Task 1 was completed this is already done.

- [ ] **Step 2: Rewrite `app/(app)/exam/[examId]/page.tsx`**

Replace the entire file with:

```tsx
"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { unamExam, examQuestions } from "@/lib/mock-data";
import type { ExamQuestion } from "@/lib/mock-data";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default function ExamPage({ params }: PageProps) {
  const { examId } = use(params);

  // Load the right exam data
  const isNewExam = examId === unamExam.id;
  const questions: ExamQuestion[] = isNewExam
    ? unamExam.questions
    : examQuestions.map((q, i) => ({
        id: String(i),
        subject: "General",
        text: q.text,
        options: q.options,
        correctIndex: q.correct,
        explanation: "",
      }));

  const examTitle = isNewExam ? unamExam.title : "Simulacro UNAM · Área 2";
  const totalSeconds = isNewExam ? unamExam.timeMinutes * 60 : 2 * 60 * 60 + 30 * 60;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished]);

  const question = questions[current];
  const totalQ = questions.length;
  const answered = Object.keys(answers).length;

  function selectAnswer(optIndex: number) {
    setAnswers((prev) => ({ ...prev, [current]: optIndex }));
  }

  function toggleMark() {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current); else next.add(current);
      return next;
    });
  }

  // Results screen
  if (finished) {
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const pct = Math.round((correct / totalQ) * 100);
    const passed = pct >= (isNewExam ? unamExam.passingScore : 70);

    // Per-subject breakdown
    const subjects = [...new Set(questions.map((q) => q.subject))];
    const subjectStats = subjects.map((subj) => {
      const qs = questions.filter((q) => q.subject === subj);
      const cor = qs.filter((q, _) => {
        const idx = questions.indexOf(q);
        return answers[idx] === q.correctIndex;
      }).length;
      return { subj, total: qs.length, correct: cor, pct: Math.round((cor / qs.length) * 100) };
    });

    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center text-5xl mb-3">{passed ? "🎉" : "📚"}</div>
          <h1 className="text-4xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
            {passed ? "¡Aprobado!" : "Sigue practicando"}
          </h1>
          <p className="text-white/50 text-sm">{examTitle}</p>
        </div>

        {/* Score */}
        <div className="card text-center">
          <p className="text-6xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>
            <span className={pct >= 70 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}>
              {pct}%
            </span>
          </p>
          <p className="text-white/60">
            {correct} correctas de {totalQ} reactivos
          </p>
          {isNewExam && (
            <p className="text-xs text-white/35 mt-1">
              Aprobatorio: {unamExam.passingScore}% · {unamExam.area} — {unamExam.year}
            </p>
          )}
        </div>

        {/* Per-subject breakdown */}
        {isNewExam && (
          <div className="card space-y-3">
            <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Resultados por materia
            </h2>
            {subjectStats.map((s) => (
              <div key={s.subj}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-white/75">{s.subj}</span>
                  <span className={`font-bold ${s.pct >= 70 ? "text-emerald-400" : s.pct >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {s.correct}/{s.total} · {s.pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.pct >= 70 ? "bg-emerald-500" : s.pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Answer review */}
        <div className="card space-y-4">
          <h2 className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
            Revisión de respuestas
          </h2>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className="border-t border-white/5 pt-4 first:border-0 first:pt-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {isCorrect
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white/40 mb-0.5">{q.subject} · Pregunta {i + 1}</p>
                    <p className="text-sm text-white/80 leading-snug">{q.text}</p>
                  </div>
                </div>
                {!isCorrect && (
                  <div className="ml-7 space-y-1 text-xs">
                    {userAnswer !== undefined && (
                      <p className="text-red-400">Tu respuesta: {q.options[userAnswer]}</p>
                    )}
                    <p className="text-emerald-400">Correcta: {q.options[q.correctIndex]}</p>
                    {q.explanation && (
                      <p className="text-white/40 leading-relaxed mt-1">{q.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setFinished(false); setAnswers({}); setMarked(new Set()); setCurrent(0); setTimeLeft(totalSeconds); }}
            className="btn btn--ghost"
          >
            Repetir simulacro
          </button>
          <Link href="/courses/unam" className="btn btn--primary">
            Volver al curso
          </Link>
        </div>
      </div>
    );
  }

  // Exam screen
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header bar */}
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
            {examTitle}
          </h1>
          <p className="text-sm text-white/45">
            {answered}/{totalQ} respondidas
            {isNewExam && (
              <span className="ml-2 text-white/30">· {question.subject}</span>
            )}
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border ${timeLeft < 300 ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-white"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatTime(timeLeft)}
        </div>

        <button onClick={() => setFinished(true)} className="btn btn--primary">
          Terminar
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question area — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="badge badge--violet">Pregunta {current + 1} de {totalQ}</span>
                {isNewExam && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 rounded-full px-2.5 py-0.5 border border-white/8">
                    {question.subject}
                  </span>
                )}
              </div>
              <button
                onClick={toggleMark}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${marked.has(current) ? "text-amber-400" : "text-white/40 hover:text-amber-400"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={marked.has(current) ? "#F59E0B" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {marked.has(current) ? "Marcada" : "Marcar"}
              </button>
            </div>

            <p className="text-base leading-relaxed font-medium mb-8">{question.text}</p>

            <fieldset>
              <legend className="sr-only">Selecciona una respuesta</legend>
              <div className="space-y-3">
                {question.options.map((opt, i) => {
                  const isSelected = answers[current] === i;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-violet-500/15 border-violet-500/40 text-white"
                          : "bg-white/3 border-white/8 text-white/70 hover:bg-white/6 hover:border-white/15"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors ${isSelected ? "bg-violet-500 border-violet-400 text-white" : "border-white/20 text-white/40"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input type="radio" name="answer" value={i} checked={isSelected} onChange={() => selectAnswer(i)} className="sr-only" />
                      <span className="text-sm leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn btn--ghost disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Anterior
            </button>
            <span className="text-sm text-white/40">{current + 1} / {totalQ}</span>
            <button onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))} disabled={current === totalQ - 1} className="btn btn--ghost disabled:opacity-30">
              Siguiente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* Question map — 1/3 */}
        <aside className="space-y-4">
          <div className="card">
            <h2 className="font-black mb-4 text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Mapa de preguntas
            </h2>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((_, i) => {
                const isCurrent = i === current;
                const isAnswered = i in answers;
                const isMarked = marked.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white scale-110 shadow-lg"
                        : isMarked
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : isAnswered
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/6 text-white/40 border border-white/8 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { color: "bg-gradient-to-br from-violet-500 to-pink-500", label: "Pregunta actual" },
                { color: "bg-emerald-500/20 border border-emerald-500/30", label: "Respondida" },
                { color: "bg-amber-500/20 border border-amber-500/30", label: "Marcada para revisar" },
                { color: "bg-white/6 border border-white/8", label: "Sin responder" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/45">
                  <span className={`w-4 h-4 rounded ${item.color} shrink-0`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="card text-sm">
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Total</span><span className="font-bold">{totalQ}</span></div>
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Respondidas</span><span className="font-bold text-emerald-400">{answered}</span></div>
            <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-white/50">Marcadas</span><span className="font-bold text-amber-400">{marked.size}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-white/50">Sin responder</span><span className="font-bold text-white/40">{totalQ - answered}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/exam/[examId]/page.tsx"
git commit -m "feat: exam page supports new ExamQuestion format with subject labels, explanations, and per-subject results breakdown"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Covered by |
|-------------|-----------|
| Mis cursos → Selecciona curso | Existing courses page + modified course detail |
| Cursos con 3 secciones: Videos, Exámenes, Recursos | Task 5 — CourseTabs |
| Videos: temario completo inventado | Task 1 — unamModules (5 módulos, 19 lecciones) |
| Videos interactivos con pausa y pregunta | Tasks 2, 3, 4 — CheckpointOverlay + InteractivePlayer |
| Overlay obliga al alumno a responder | CheckpointOverlay: no se puede cerrar sin seleccionar |
| Feedback independientemente de si es correcto | CheckpointOverlay: muestra explanation y continua siempre |
| Examen en JSON con Universidad/Área | Task 1 — unamExam (university, area, areaFull, year) |
| Examen inmersivo e interactivo | Task 6 — inherited from existing exam UI |
| Examen registra puntaje | Task 6 — local state pct + per-subject breakdown |
| Recursos de estudio (PDFs, PPTs) | Task 1 — unamResources; Task 5 — recursos tab |

**Placeholder scan:** No TBDs, TODOs, or incomplete steps found.

**Type consistency check:**
- `VideoCheckpoint` uses `lessonId: string` — `InteractivePlayer` filters by `lessonId` ✓
- `ExamQuestion.correctIndex` used consistently (not `correct`) — Task 6 uses `q.correctIndex` ✓  
- `unamExam.questions` is `ExamQuestion[]` — Task 6 maps it correctly ✓
- `Module.lessons` is `Lesson[]` — CourseTabs iterates `mod.lessons` ✓
