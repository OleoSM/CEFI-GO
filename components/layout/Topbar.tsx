"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils/initials";
import { useProfile } from "@/components/providers/ProfileProvider";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const profile = useProfile();
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  const initials  = getInitials(profile.full_name);
  const firstName = profile.full_name.split(" ")[0];

  return (
    <header className="topbar">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="lg:hidden flex flex-col gap-1.5 p-1.5 rounded-md hover:bg-white/8 transition-colors shrink-0"
      >
        <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
        <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
        <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/40 text-sm cursor-text">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Buscar...</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            aria-label="Notificaciones"
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-white/6 transition-colors text-white/50 hover:text-white"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F43F5E] rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl bg-[#1a0f2e] border border-white/10 shadow-2xl shadow-black/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <p className="text-sm font-semibold">Notificaciones</p>
                <span className="text-[10px] text-white/35 bg-white/5 px-2 py-0.5 rounded-full">0 nuevas</span>
              </div>
              <div className="py-10 text-center">
                <p className="text-sm text-white/35">Sin notificaciones</p>
                <p className="text-xs text-white/20 mt-1">Te avisaremos cuando haya novedades</p>
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 ml-1 border-l border-white/8 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white select-none shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white/80 leading-none">{firstName}</p>
              {profile.role === "admin" && (
                <p className="text-[10px] text-violet-400 leading-none mt-0.5">Admin</p>
              )}
            </div>
            <svg className="hidden sm:block w-3 h-3 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl bg-[#1a0f2e] border border-white/10 shadow-2xl shadow-black/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{profile.full_name}</p>
                    <p className="text-xs text-white/40 truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {profile.is_pro ? (
                    <span className="badge badge--violet text-[10px]">Pro</span>
                  ) : (
                    <span className="text-[10px] text-white/30">Plan gratuito</span>
                  )}
                </div>
              </div>

              <div className="py-1">
                {[
                  { href: "/profile",  label: "Mi perfil" },
                  { href: "/settings", label: "Configuración" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/4 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {profile.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-300 hover:bg-violet-500/10 transition-colors"
                  >
                    Panel Admin
                  </Link>
                )}

                <div className="border-t border-white/8 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-colors disabled:opacity-40"
                  >
                    {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
