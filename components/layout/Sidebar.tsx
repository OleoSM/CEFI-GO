"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils/initials";
import { useProfile } from "@/components/providers/ProfileProvider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const DashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const CoursesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const ExamIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);

const MentorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
    <path d="M4 22h16M10 14.66V17a1 1 0 01-.88.98L8 18h8l-1.12-.02A1 1 0 0114 17v-2.34"/>
    <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
  </svg>
);

const ResourcesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const navSections: NavSection[] = [
  {
    title: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: <DashIcon /> },
      { href: "/courses", label: "Mis cursos", icon: <CoursesIcon /> },
      { href: "/exam", label: "Simulacros", icon: <ExamIcon /> },
      { href: "/mentors", label: "Mentorías", icon: <MentorIcon /> },
    ],
  },
  {
    title: "Mi progreso",
    items: [
      { href: "/analytics", label: "Analítica", icon: <ChartIcon /> },
      { href: "/profile", label: "Logros", icon: <TrophyIcon /> },
      { href: "/resources", label: "Recursos", icon: <ResourcesIcon /> },
    ],
  },
  {
    title: "Cuenta",
    items: [
      { href: "/profile", label: "Perfil", icon: <ProfileIcon /> },
      { href: "/settings", label: "Configuración", icon: <SettingsIcon /> },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const profile   = useProfile();
  const pathname  = usePathname();
  const [loading, setLoading] = useState(false);
  const initials  = getInitials(profile.full_name);

  async function handleLogout() {
    setLoading(true);
    onClose();
    await logout();
  }

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Logo />
      </div>

      {/* User mini-card */}
      <div className="mx-3 mt-3 p-3 rounded-xl bg-white/4 border border-white/8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0 select-none">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate leading-snug">{profile.full_name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {profile.is_pro ? (
              <span className="text-[10px] text-violet-400 font-semibold">✦ Pro</span>
            ) : (
              <span className="text-[10px] text-white/30">Gratuito</span>
            )}
            {profile.role === "admin" && (
              <span className="text-[10px] text-violet-400/60">· Admin</span>
            )}
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto mt-2" aria-label="Navegación principal">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/30">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-item ${isActive ? "is-active" : ""}`}
                      onClick={onClose}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Admin link */}
        {profile.role === "admin" && (
          <div>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-violet-400/40">
              Admin
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/admin"
                  className={`nav-item ${pathname.startsWith("/admin") ? "is-active" : ""}`}
                  onClick={onClose}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Logout */}
        <div>
          <button
            className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-40"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogoutIcon />
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </nav>

      {/* Upgrade banner */}
      {!profile.is_pro && (
        <div className="p-3 mt-auto">
          <div className="rounded-xl p-4 bg-gradient-to-br from-violet-600/20 to-pink-600/10 border border-violet-500/20">
            <p className="text-xs font-bold text-white/90 mb-1">
              🚀 Sube a Elite
            </p>
            <p className="text-[11px] text-white/50 mb-3">
              Desbloquea mentores en vivo y todos los simulacros
            </p>
            <Link
              href="/suscribirse"
              className="block text-center text-xs font-bold py-1.5 px-3 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:opacity-90 transition-opacity"
            >
              Ver planes
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
