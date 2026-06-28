"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(
  name: string,
  email: string,
  password: string,
  targetExam: string
) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, target_exam: targetExam || null },
    },
  });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function logout() {
  redirect("/login");
}

