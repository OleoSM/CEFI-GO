'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;   // e.g. "85,000+" or "92%"
  className?: string;
}

function parseTarget(raw: string): { num: number; prefix: string; suffix: string } {
  const clean = raw.replace(/,/g, '');
  const match = clean.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
  if (!match) return { num: 0, prefix: '', suffix: raw };
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] };
}

function format(n: number, original: string): string {
  if (original.includes(',')) {
    return Math.round(n).toLocaleString('en-US');
  }
  return String(Math.round(n));
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const { num, prefix, suffix } = parseTarget(value);
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out-expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplay(format(eased * num, value));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
