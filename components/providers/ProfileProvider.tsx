"use client";

import { createContext, useContext } from "react";

export interface Profile {
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
}

const ProfileContext = createContext<Profile | null>(null);

export function ProfileProvider({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): Profile {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
