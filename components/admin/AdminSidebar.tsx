"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";
import { adminStats } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  badge?: number;
  icon: React.ReactNode;
}

const DashIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const LessonsIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
const ExamIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const FolderIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;
const PayIcon       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UsersIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const BackIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const LogoutIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const navItems: NavItem[] = [
  { href: "/admin",              label: "Dashboard",   icon: <DashIcon /> },
  { href: "/admin/lecciones",    label: "Lecciones",   icon: <LessonsIcon />, badge: adminStats.totalLessons },
  { href: "/admin/examenes",     label: "Exámenes",    icon: <ExamIcon />,    badge: adminStats.totalExams },
  { href: "/admin/recursos",     label: "Recursos",    icon: <FolderIcon />,  badge: adminStats.totalResources },
  { href: "/admin/pagos",        label: "Pagos",       icon: <PayIcon />,     badge: adminStats.pendingPayments },
  { href: "/admin/usuarios",     label: "Usuarios",    icon: <UsersIcon />,   badge: adminStats.totalStudents },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-[#0d0d0f] border-r border-white/6 overflow-y-auto">
      {/* Logo + Admin label */}
      <div className="p-5 border-b border-white/5">
        <Logo />
        <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 12.14 2 8.27l6.91-1.01L12 1z"/></svg>
          Panel Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2" aria-label="Navegación admin">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const isPagos = item.href === "/admin/pagos";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                  : "text-white/55 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-amber-400" : "text-white/40"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    isPagos && item.badge > 0
                      ? "bg-red-500 text-white"
                      : isActive
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-white/8 text-white/35"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Exit actions */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all group"
        >
          <span className="text-violet-400 group-hover:text-violet-300 transition-colors">
            <BackIcon />
          </span>
          Volver al portal
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all group"
        >
          <span className="group-hover:text-red-300 transition-colors">
            <LogoutIcon />
          </span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
