"use client";

import { useState } from "react";

interface Course { id: string; label: string }

interface Props {
  courses: Course[];
  selected: Course;
  onChange: (c: Course) => void;
}

export default function CourseDropdown({ courses, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:bg-white/8 transition-all"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          {selected.label}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#1a1033] border border-white/10 shadow-xl overflow-hidden"
        >
          {courses.map((c) => (
            <li key={c.id}>
              <button
                role="option"
                aria-selected={c.id === selected.id}
                onClick={() => { onChange(c); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                  c.id === selected.id
                    ? "bg-violet-600/20 text-violet-300 font-semibold"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
