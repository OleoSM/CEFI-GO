"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="auth-layout">
      {/* Left: form */}
      <section className="auth-panel">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>

          <h1
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bienvenido <span className="gradient-text">de vuelta</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Entra a tu cuenta para retomar tu preparación.
          </p>

          <form noValidate className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6l8 5 8-5M4 6v12h16V6M4 6a2 2 0 012-2h12a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-white/70">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l18 18M10.6 10.6A2 2 0 1013.4 13.4M6.7 6.7A12 12 0 002 12s3.5 7 10 7a11 11 0 005.2-1.3M17.8 17.8A11 11 0 0022 12s-3.5-7-10-7a11 11 0 00-3.2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded accent-violet-500"
                />
                <span className="text-sm text-white/55">Mantener sesión iniciada</span>
              </label>
              <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--full"
            >
              Iniciar sesión
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              <span className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-white/30">o continúa con</span>
              <span className="flex-1 h-px bg-white/8" />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:bg-white/8 hover:border-white/15 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continuar con Google
            </button>

            <p className="text-center text-sm text-white/40">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Right: hero panel */}
      <aside className="auth-hero" aria-hidden="true">
        <div className="w-full max-w-md text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 block">
            La plataforma de los que ya aprobaron
          </span>
          <h2
            className="text-3xl font-black mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            De 48 aciertos a pase directo.{" "}
            <span className="gradient-text">Tú sigues.</span>
          </h2>
          <p className="text-white/50 mb-10 text-sm leading-relaxed">
            Más de 85,000 estudiantes usan CEFITIPS cada ciclo para entrar a la carrera que quieren.
          </p>

          <dl className="flex justify-center gap-10 mb-10">
            {[
              { label: "Tasa de ingreso", value: "92%" },
              { label: "Simulacros", value: "+25K" },
              { label: "Mentores", value: "320" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-xs text-white/40 mb-1">{s.label}</dt>
                <dd className="text-2xl font-black gradient-text">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Testimonial */}
          <div className="card text-left">
            <p className="text-sm text-white/70 italic mb-4">
              &ldquo;Llegué al examen con la misma sensación de un simulacro de CEFITIPS. Cero sorpresas, puro control.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                XR
              </div>
              <div>
                <p className="text-sm font-bold">Ximena Ríos</p>
                <p className="text-xs text-white/40">Medicina · UNAM 2025</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
