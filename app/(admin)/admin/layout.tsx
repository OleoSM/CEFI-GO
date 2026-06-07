import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/profile";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  // En desarrollo se omite la verificación de rol para probar sin perfil admin en Supabase.
  if (process.env.NODE_ENV !== "development" && profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen bg-[#0B0617]">
      {/* Aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
        <div className="grid-overlay" />
      </div>
      <AdminSidebar />
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
