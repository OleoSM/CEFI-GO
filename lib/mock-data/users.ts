export type MockUser = {
  id: string; full_name: string; email: string; role: "student" | "admin";
  is_pro: boolean; status: "active" | "inactive" | "suspended";
  created_at: string; streak_days: number; target_exam: string;
};

export const mockUsers: MockUser[] = [
  { id: "u1", full_name: "Ximena Ríos",      email: "ximena@cefigo.mx",  role: "student", is_pro: true,  status: "active",   created_at: "2026-01-15", streak_days: 42, target_exam: "UNAM" },
  { id: "u2", full_name: "Diego Hernández",   email: "diego@cefigo.mx",   role: "student", is_pro: true,  status: "active",   created_at: "2026-02-03", streak_days: 28, target_exam: "IPN" },
  { id: "u3", full_name: "Valeria Márquez",   email: "valeria@cefigo.mx", role: "student", is_pro: false, status: "active",   created_at: "2026-03-11", streak_days: 7,  target_exam: "UAM" },
  { id: "u4", full_name: "Carlos Mendoza",    email: "carlos@cefigo.mx",  role: "student", is_pro: true,  status: "active",   created_at: "2026-01-28", streak_days: 61, target_exam: "UNAM" },
  { id: "u5", full_name: "Admin CEFI",        email: "admin@cefigo.mx",   role: "admin",   is_pro: true,  status: "active",   created_at: "2025-12-01", streak_days: 0,  target_exam: "" },
  { id: "u6", full_name: "Luis Torres",       email: "luis@cefigo.mx",    role: "student", is_pro: false, status: "inactive", created_at: "2026-04-02", streak_days: 0,  target_exam: "COMIPEMS" },
];
