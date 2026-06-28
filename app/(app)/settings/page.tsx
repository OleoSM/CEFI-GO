"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
          checked ? "bg-violet-600" : "bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-1">
      <h2
        className="text-base font-black mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="divide-y divide-white/5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const [notif, setNotif] = useState({
    email: true,
    push: false,
    reminder: true,
    weekly: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    shareProgress: false,
  });

  const toggle = <K extends keyof typeof notif>(key: K) =>
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePrivacy = <K extends keyof typeof privacy>(key: K) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1
          className="text-3xl font-black gradient-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Configuración
        </h1>
        <p className="text-sm text-white/45 mt-1">
          Administra tus preferencias y cuenta
        </p>
      </header>

      {/* Notifications */}
      <SectionCard title="Notificaciones">
        <Toggle
          checked={notif.email}
          onChange={() => toggle("email")}
          label="Correo electrónico"
          description="Recibe actualizaciones y alertas por email"
        />
        <Toggle
          checked={notif.push}
          onChange={() => toggle("push")}
          label="Notificaciones push"
          description="Alertas en tiempo real en tu navegador"
        />
        <Toggle
          checked={notif.reminder}
          onChange={() => toggle("reminder")}
          label="Recordatorio diario"
          description="Aviso para cumplir tu meta de estudio"
        />
        <Toggle
          checked={notif.weekly}
          onChange={() => toggle("weekly")}
          label="Resumen semanal"
          description="Resumen de tu progreso cada domingo"
        />
      </SectionCard>

      {/* Privacy */}
      <SectionCard title="Privacidad">
        <Toggle
          checked={privacy.showProfile}
          onChange={() => togglePrivacy("showProfile")}
          label="Mostrar perfil públicamente"
          description="Otros estudiantes pueden ver tu perfil"
        />
        <Toggle
          checked={privacy.shareProgress}
          onChange={() => togglePrivacy("shareProgress")}
          label="Compartir progreso"
          description="Tu avance aparece en rankings de la comunidad"
        />
      </SectionCard>

      {/* Account */}
      <SectionCard title="Cuenta">
        <div className="py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Cambiar contraseña</p>
            <p className="text-xs text-white/40 mt-0.5">
              Actualiza tu contraseña de acceso
            </p>
          </div>
          <button
            className="btn btn--ghost text-sm opacity-50 cursor-not-allowed"
            disabled
            title="Próximamente"
          >
            Cambiar
            <span className="ml-1.5 text-[9px] bg-white/10 rounded px-1.5 py-0.5">
              Próximamente
            </span>
          </button>
        </div>
        <div className="py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-400">Cerrar sesión</p>
            <p className="text-xs text-white/40 mt-0.5">
              Sales de tu cuenta en este dispositivo
            </p>
          </div>
          <button
            className="btn text-sm px-4 py-2 rounded-lg font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            onClick={() => router.push("/login")}
          >
            Cerrar sesión
          </button>
        </div>
      </SectionCard>

      {/* Plan */}
      <SectionCard title="Plan actual">
        <div className="py-3 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-bold">Plan Pro</p>
              <span className="badge badge--violet text-[10px]">Activo</span>
            </div>
            <p className="text-xs text-white/40">$299 / mes · Renovación automática</p>
          </div>
          <Link
            href="/#planes"
            className="btn btn--primary text-sm"
          >
            Ver planes
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
