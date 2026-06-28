export type MockExam = {
  id: string; title: string; subject: string; questions: number;
  duration: number; attempts: number; best_score: number | null; status: "pending" | "completed" | "in_progress";
};

export const mockExams: MockExam[] = [
  { id: "e1", title: "Simulacro UNAM Área 2 #03", subject: "Mixto", questions: 120, duration: 150, attempts: 2, best_score: 87,   status: "completed" },
  { id: "e2", title: "Práctica Matemáticas I",    subject: "Matemáticas", questions: 30, duration: 40, attempts: 1, best_score: 73, status: "completed" },
  { id: "e3", title: "Simulacro IPN COMIPEMS",    subject: "Mixto", questions: 128, duration: 180, attempts: 0, best_score: null, status: "pending" },
  { id: "e4", title: "Comprensión lectora avanzada", subject: "Español", questions: 25, duration: 30, attempts: 0, best_score: null, status: "pending" },
];
