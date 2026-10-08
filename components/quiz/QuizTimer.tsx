'use client';
import { useEffect, useRef, useState } from 'react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  paused?: boolean;
}

export function QuizTimer({ totalSeconds, onTimeUp, paused = false }: QuizTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remaining]);

  const pct = remaining / totalSeconds;
  const isWarning = pct <= 0.25;
  const isDanger = pct <= 0.1;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1 font-mono text-sm font-semibold',
        isDanger && 'animate-pulse bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        isWarning && !isDanger && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        !isWarning && 'bg-muted text-muted-foreground',
      )}
    >
      <span>⏱</span>
      <span>{formatTime(remaining)}</span>
    </div>
  );
}
