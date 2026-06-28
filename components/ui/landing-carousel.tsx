'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LandingCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function LandingCarousel({ children, className, itemClassName }: LandingCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const childCount = el.children.length;
    setTotal(childCount);
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cardWidth = (el.children[0] as HTMLElement)?.offsetWidth ?? 1;
    setActiveIndex(Math.round(el.scrollLeft / (cardWidth + 24)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setTotal(el.children.length);
    sync();
  }, [sync]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = (el.children[0] as HTMLElement)?.offsetWidth ?? el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'right' ? cardWidth + 24 : -(cardWidth + 24), behavior: 'smooth' });
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = (el.children[0] as HTMLElement)?.offsetWidth ?? 0;
    el.scrollTo({ left: i * (cardWidth + 24), behavior: 'smooth' });
  };

  return (
    <div className={cn('relative', className)}>
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={sync}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.isArray(children)
          ? (children as React.ReactNode[]).map((child, i) => (
              <div
                key={i}
                className={cn(
                  'snap-start shrink-0 w-[calc(100%-1.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]',
                  itemClassName,
                )}
              >
                {child}
              </div>
            ))
          : <div className={cn('snap-start shrink-0 w-full', itemClassName)}>{children}</div>
        }
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => scroll('left')}
          disabled={!canLeft}
          aria-label="Anterior"
          className="w-9 h-9 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-25 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir a ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-6 bg-violet-400'
                  : 'w-1.5 bg-white/20 hover:bg-white/40',
              )}
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          disabled={!canRight}
          aria-label="Siguiente"
          className="w-9 h-9 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-25 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
