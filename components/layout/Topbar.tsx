"use client";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="topbar">
      {/* Hamburger (mobile) */}
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
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/40 text-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Buscar...</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          aria-label="Notificaciones"
          className="relative p-2 rounded-xl hover:bg-white/6 transition-colors text-white/60 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F43F5E] rounded-full" />
        </button>

        {/* Messages */}
        <button
          aria-label="Mensajes"
          className="p-2 rounded-xl hover:bg-white/6 transition-colors text-white/60 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/8 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white select-none">
            AG
          </div>
          <span className="hidden sm:block text-sm font-medium text-white/80">
            Ana
          </span>
        </div>
      </div>
    </header>
  );
}
