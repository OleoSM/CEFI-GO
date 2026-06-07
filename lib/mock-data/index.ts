export const mockUser = {
  name: "Ana García",
  initials: "AG",
  email: "ana@correo.com",
  plan: "Pro",
  streak: 14,
  exam: "UNAM",
  daysToExam: 95,
  score: 78,
  weeklyGoal: 82,
};

export const mockCourses = [
  {
    slug: "unam",
    title: "Examen UNAM",
    tag: "Licenciatura",
    duration: "6 meses",
    enrolled: "32,400",
    gradient: "from-violet-600 to-pink-500",
    progress: 34,
    module: "Módulo 4",
    lesson: "Mitosis y meiosis — Fases celulares",
    lessonNum: 4,
    lessonTotal: 12,
    remainingMin: 18,
  },
  {
    slug: "matematicas",
    title: "Funciones trigonométricas",
    tag: "Matemáticas",
    duration: "Módulo 2",
    enrolled: "18,750",
    gradient: "from-blue-500 to-violet-600",
    progress: 20,
    module: "Módulo 2",
    lesson: "Funciones trigonométricas",
    lessonNum: 2,
    lessonTotal: 10,
    remainingMin: 25,
  },
  {
    slug: "historia",
    title: "México prehispánico",
    tag: "Historia",
    duration: "Módulo 1",
    enrolled: "9,120",
    gradient: "from-amber-500 to-pink-500",
    progress: 12,
    module: "Módulo 1",
    lesson: "México prehispánico",
    lessonNum: 1,
    lessonTotal: 8,
    remainingMin: 32,
  },
];

export const mockExams = [
  {
    id: "unam-2024",
    title: "Simulacro UNAM · Área 2",
    subtitle: "Examen real 2024 · 120 reactivos",
    date: "Ayer · 2h 15min",
    score: 92,
    correct: 110,
    total: 120,
  },
  {
    id: "unam-2024-2",
    title: "Simulacro UNAM · Área 2",
    subtitle: "",
    date: "Hace 3 días · 2h 08min",
    score: 78,
    correct: 94,
    total: 120,
  },
  {
    id: "quimica",
    title: "Mini-test · Química orgánica",
    subtitle: "",
    date: "Hace 5 días · 32 min",
    score: 85,
    correct: 17,
    total: 20,
  },
  {
    id: "diagnostico",
    title: "Diagnóstico inicial",
    subtitle: "",
    date: "Hace 2 semanas · 1h 45min",
    score: 48,
    correct: 58,
    total: 120,
  },
];

export const examQuestions = [
  {
    text: "¿Cuál de las siguientes estructuras celulares es responsable de la síntesis de proteínas a partir de la información genética del ARNm?",
    options: ["Mitocondria", "Ribosoma", "Aparato de Golgi", "Lisosoma"],
    correct: 1,
  },
  {
    text: "En un movimiento rectilíneo uniformemente acelerado, si un objeto parte del reposo y alcanza una velocidad de 20 m/s en 4 segundos, ¿cuál es su aceleración?",
    options: ["2 m/s²", "4 m/s²", "5 m/s²", "80 m/s²"],
    correct: 2,
  },
  {
    text: "¿Cuál es el producto de la reacción entre un ácido y una base según la teoría de Arrhenius?",
    options: [
      "Un gas y agua",
      "Una sal y agua",
      "Un óxido y un metal",
      "Un compuesto orgánico",
    ],
    correct: 1,
  },
  {
    text: "En la siguiente oración: 'El estudiante que ganó el concurso viajará a Cambridge', ¿qué función sintáctica desempeña 'que ganó el concurso'?",
    options: [
      "Proposición subordinada adjetiva",
      "Proposición subordinada sustantiva",
      "Proposición subordinada adverbial",
      "Proposición coordinada copulativa",
    ],
    correct: 0,
  },
  {
    text: "¿Cuál fue la principal causa inmediata de la Revolución Mexicana de 1910?",
    options: [
      "La invasión estadounidense de 1846",
      "La promulgación de la Constitución de 1857",
      "La reelección de Porfirio Díaz y el descontento social",
      "La guerra de los Pasteles",
    ],
    correct: 2,
  },
];

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

export {
  adminStats,
  mockStudents,
  mockPayments,
  planLabels,
  planColors,
} from "./admin-mock";
export type { MockStudent, MockPayment, AdminStats } from "./admin-mock";
