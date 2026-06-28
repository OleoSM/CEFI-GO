import { cache } from "react";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_pro: boolean;
  streak_days: number;
  target_exam: string | null;
  exam_date: string | null;
  current_score: number;
  weekly_goal: number;
};

// Dev mock — reemplazar con Supabase real en Fase 3 (Backend)
export const getProfile = cache(async (): Promise<Profile> => {
  return {
    id:            "dev-user-001",
    full_name:     "Alumno Demo",
    email:         "alumno@cefigo.mx",
    role:          "student",
    is_pro:        true,
    streak_days:   7,
    target_exam:   "UNAM",
    exam_date:     "2026-09-15",
    current_score: 72,
    weekly_goal:   80,
  };
});
