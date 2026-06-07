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
