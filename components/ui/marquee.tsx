'use client';

import { cn } from '@/lib/utils';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  speed = 'normal',
}: MarqueeProps) {
  const duration = speed === 'slow' ? '50s' : speed === 'fast' ? '20s' : '35s';

  return (
    <div
      className={cn('group flex overflow-hidden', className)}
      style={{ '--marquee-duration': duration } as React.CSSProperties}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 items-center gap-12 marquee-track',
            reverse && 'marquee-track--reverse',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
