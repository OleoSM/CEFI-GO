export type Role = "student" | "admin";
export type Plan = "free" | "pro" | "elite";
export type Status = "active" | "inactive" | "pending" | "cancelled" | "suspended";

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  is_pro: boolean;
  streak_days: number;
  target_exam: string | null;
  exam_date: string | null;
  current_score: number;
  weekly_goal: number;
  created_at: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  accent: string;
  tag: string;
  enrolled: number;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: Plan;
  status: Status;
  started_at: string;
  ends_at: string | null;
  amount: number;
};
