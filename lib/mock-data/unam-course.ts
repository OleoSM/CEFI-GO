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
// These timestamps are set by the admin in the video_checkpoints Supabase table
// when uploading a new lesson. Here they are hardcoded in mock data.

export const videoCheckpoints: VideoCheckpoint[] = [
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
