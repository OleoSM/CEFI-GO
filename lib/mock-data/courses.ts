export type MockLesson = { id: string; title: string; duration: string; completed: boolean; vimeo_id?: string };
export type MockModule = { id: string; title: string; lessons: MockLesson[] };
export type MockCourse = {
  id: string; slug: string; title: string; description: string;
  accent: string; tag: string; enrolled: number; status: string; modules: MockModule[];
};

export const MOCK_LESSONS: MockLesson[] = [
  { id: "l1", title: "Álgebra básica", duration: "18 min", completed: true },
  { id: "l2", title: "Geometría analítica", duration: "22 min", completed: false },
  { id: "l3", title: "Comprensión lectora", duration: "15 min", completed: false },
  { id: "l4", title: "Cinemática", duration: "20 min", completed: false },
];

export const MOCK_MODULES: MockModule[] = [
  { id: "m1", title: "Matemáticas", lessons: [MOCK_LESSONS[0], MOCK_LESSONS[1]] },
  { id: "m2", title: "Español",     lessons: [MOCK_LESSONS[2]] },
  { id: "m3", title: "Física",      lessons: [MOCK_LESSONS[3]] },
];

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "c1", slug: "unam", title: "Examen UNAM", status: "published",
    description: "120 reactivos de 6 áreas. El banco más completo del país.",
    accent: "#A78BFA", tag: "Licenciatura", enrolled: 32400,
    modules: [MOCK_MODULES[0], MOCK_MODULES[1]],
  },
  {
    id: "c2", slug: "ipn", title: "Examen IPN", status: "published",
    description: "COMIPEMS + examen propio del Politécnico. Énfasis en exactas.",
    accent: "#F43F5E", tag: "Licenciatura", enrolled: 21200,
    modules: [MOCK_MODULES[2]],
  },
  {
    id: "c3", slug: "uam", title: "Examen UAM", status: "draft",
    description: "Preparación por unidad: Azcapotzalco, Iztapalapa, Xochimilco.",
    accent: "#22D3EE", tag: "Licenciatura", enrolled: 9120, modules: [],
  },
];

// aliases
export const mockCourses = MOCK_COURSES;
