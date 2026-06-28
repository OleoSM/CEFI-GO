"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TestimonialItem = {
  image: string;
  text: string;
  name: string;
  jobtitle: string;
};

type Props = { testimonials: TestimonialItem[] };

export const TypewriterTestimonial: React.FC<Props> = ({ testimonials }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean[]>(
    new Array(testimonials.length).fill(false)
  );
  const [typedText, setTypedText] = useState("");
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTypewriter = useCallback((text: string) => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setTypedText("");
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i));
        i++;
        typewriterRef.current = setTimeout(type, 28);
      }
    };
    type();
  }, []);

  const stopTypewriter = useCallback(() => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setTypedText("");
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    setHasBeenHovered((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    startTypewriter(testimonials[index].text);
  }, [testimonials, startTypewriter]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    stopTypewriter();
  }, [stopTypewriter]);

  return (
    <div className="flex justify-center items-center gap-6 flex-wrap py-4">
      {testimonials.map((t, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={t.image}
            alt={t.name}
            className="w-16 h-16 rounded-full object-cover border-3 border-white/20"
            animate={{ borderColor: (hoveredIndex === index || hasBeenHovered[index]) ? "#A78BFA" : "rgba(255,255,255,0.15)" }}
            transition={{ duration: 0.3 }}
            style={{ borderWidth: 3 }}
          />
          {/* Glow ring when hovered/visited */}
          {(hoveredIndex === index || hasBeenHovered[index]) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 20px #A78BFA66", pointerEvents: "none" }}
            />
          )}

          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -12 }}
                exit={{ opacity: 0, scale: 0.85, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-20 z-50 bg-[#0E0A18]/95 backdrop-blur-xl border border-violet-500/30 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl shadow-violet-900/40 w-60"
                style={{ boxShadow: "0 8px 40px #7C3AED33, 0 0 0 1px #7C3AED44" }}
              >
                {/* Speech bubble arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 overflow-hidden">
                  <div className="w-3 h-3 bg-[#0E0A18] border-r border-b border-violet-500/30 rotate-45 translate-y-[-50%] mx-auto" />
                </div>

                <div className="min-h-[72px] text-white/80 leading-relaxed">
                  {typedText}
                  <span className="animate-pulse text-violet-400 font-bold">|</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/8">
                  <p className="font-bold text-white text-right text-[11px]">{t.name}</p>
                  <p className="text-white/40 text-right text-[10px]">{t.jobtitle}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
