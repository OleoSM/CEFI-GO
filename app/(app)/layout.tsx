import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/profile";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
import AppShell from "@/components/layout/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <ProfileProvider profile={profile}>
      <AppShell>{children}</AppShell>
    </ProfileProvider>
  );
}
