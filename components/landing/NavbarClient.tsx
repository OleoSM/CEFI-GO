"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="CEFI GO inicio">
      <Image src="/logos/ICO-mini.png" alt="" width={32} height={32} className="rounded-lg shrink-0" priority />
      <span className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        CEFI <span className="gradient-text">GO</span>
      </span>
    </Link>
  );
}

const NAV_LINKS = [
  { href: "#cursos",          label: "Cursos" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#planes",          label: "Planes" },
  { href: "#testimonios",     label: "Testimonios" },
  { href: "#faq",             label: "Preguntas" },
];

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-64px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B0617]/80 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
        <NavLogo />

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV_LINKS.map(({ href, label }) => {
            const id = href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                className={`relative px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white hover:bg-white/6"
                }`}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/6 transition-all"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/30"
          >
            Empezar gratis
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
