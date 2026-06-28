"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TypewriterTestimonial, type TestimonialItem } from "@/components/ui/typewriter-testimonial";

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z" />
  </svg>
);

const TYPEWRITER_TESTIMONIALS: TestimonialItem[] = [
  {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    text: "Empecé con 48 aciertos y terminé con 112 en el examen real. Los simulacros de CEFI GO son idénticos al formato UNAM.",
    name: "Ximena Ríos",
    jobtitle: "Medicina · UNAM 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a6dd7228f2d?w=200&h=200&fit=crop&crop=face",
    text: "El plan personalizado me salvó. Trabajo medio tiempo y la app acomodaba mis sesiones en los huecos libres. Entré al IPN.",
    name: "Diego Hernández",
    jobtitle: "Ing. Mecatrónica · IPN 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=200&h=200&fit=crop&crop=face",
    text: "Mi mentora también entró a la UAM hace dos años. Saber que alguien ya recorrió el camino cambió todo.",
    name: "Valeria Márquez",
    jobtitle: "Diseño · UAM Xochimilco 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    text: "En 45 días subí 30 puntos en matemáticas. Los videos son cortos y directos. Sin relleno, solo lo que entra.",
    name: "Carlos Mendoza",
    jobtitle: "Actuaría · UNAM 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
    text: "Hice 8 simulacros completos antes del examen. Cuando llegué al COMIPEMS, era como si ya lo hubiera presentado.",
    name: "Luis Torres",
    jobtitle: "CCH Oriente · COMIPEMS 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face",
    text: "La analítica de progreso es increíble. Veía mi probabilidad de ingreso subir semana a semana. Súper motivante.",
    name: "Andrés Castillo",
    jobtitle: "Economía · UAM 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    text: "La racha de 30 días me hizo el hábito de estudiar. Cuando me di cuenta, ya había terminado todos los módulos de química.",
    name: "Marco Pérez",
    jobtitle: "QFB · IPN 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face",
    text: "No soy buena en matemáticas, pero con el plan de IA me fue perfecto. Subí de 55 a 89 puntos en álgebra.",
    name: "Sofía Ramírez",
    jobtitle: "Psicología · UNAM 2025",
  },
];

const FEATURED_TESTIMONIALS = [
  {
    quote: "Empecé con 48 aciertos en el diagnóstico y terminé con 112 en el examen real. Los simulacros de CEFI GO son idénticos al formato UNAM. No hay otra plataforma que se acerque.",
    name: "Ximena Ríos",
    role: "Medicina · UNAM 2025",
    initials: "XR",
    gradient: "from-violet-600 to-pink-500",
    featured: true,
  },
  {
    quote: "El plan personalizado me salvó. Trabajo medio tiempo y no tenía horario fijo para estudiar. La app acomodaba mis sesiones en los huecos libres.",
    name: "Diego Hernández",
    role: "Ing. Mecatrónica · IPN 2025",
    initials: "DH",
    gradient: "from-cyan-500 to-violet-600",
    featured: false,
  },
  {
    quote: "Mi mentora también entró a la UAM hace dos años. Saber que alguien ya recorrió el camino cambió mi manera de estudiar por completo.",
    name: "Valeria Márquez",
    role: "Diseño · UAM Xochimilco 2025",
    initials: "VM",
    gradient: "from-pink-500 to-amber-500",
    featured: false,
  },
  {
    quote: "En 45 días subí 30 puntos en matemáticas. Los videos son cortos y directos. Sin relleno.",
    name: "Carlos Mendoza",
    role: "Actuaría · UNAM 2025",
    initials: "CM",
    gradient: "from-emerald-500 to-cyan-500",
    featured: false,
  },
];

export default function TestimonialsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const featured = FEATURED_TESTIMONIALS.find((t) => t.featured)!;
  const rest     = FEATURED_TESTIMONIALS.filter((t) => !t.featured);

  return (
    <section id="testimonios" ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">
            Historias reales
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Miles ya entraron.{" "}
            <span className="gradient-text">Tú también puedes.</span>
          </h2>
          <p className="text-white/40 text-sm">Pasa el cursor sobre cada alumno para leer su historia</p>
        </motion.div>

        {/* Typewriter avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-14 px-4"
        >
          <TypewriterTestimonial testimonials={TYPEWRITER_TESTIMONIALS} />
        </motion.div>

        {/* Featured testimonial cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:row-span-2 rounded-2xl bg-white/[0.03] border border-white/10 p-7 flex flex-col gap-5 hover:border-violet-500/25 hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="flex gap-1" aria-label="5 de 5 estrellas">
              {Array(5).fill(0).map((_, i) => <StarIcon key={i} />)}
            </div>
            <blockquote className="text-white/80 text-lg leading-relaxed flex-1 font-medium">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <div className="rounded-xl bg-white/4 border border-white/8 p-4 flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-white/35 mb-1">Diagnóstico</p>
                <p className="text-3xl font-black text-white/50">48</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-violet-500 to-white/10" />
              <div className="text-center">
                <p className="text-xs text-white/35 mb-1">Examen real</p>
                <p className="text-3xl font-black gradient-text">112</p>
              </div>
            </div>
            <figcaption className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${featured.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                {featured.initials}
              </div>
              <div>
                <p className="font-bold">{featured.name}</p>
                <p className="text-sm text-white/40">{featured.role}</p>
              </div>
            </figcaption>
          </motion.figure>

          {rest.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 flex flex-col gap-4 hover:border-white/16 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex gap-1" aria-label="5 de 5 estrellas">
                {Array(5).fill(0).map((_, j) => <StarIcon key={j} />)}
              </div>
              <blockquote className="text-white/65 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
