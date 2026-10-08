'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

interface FlashCardProps {
  term: string;
  phonetic?: string | null;
  meaningTh: string;
  exampleEn?: string | null;
  exampleTh?: string | null;
  category: string;
}

export function FlashCard({ term, phonetic, meaningTh, exampleEn, exampleTh, category }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="relative h-72 w-full cursor-pointer perspective-1000"
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500',
          'transform-gpu',
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-card p-8 shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{category}</span>
          <h2 className="text-3xl font-bold text-center mb-2">{term}</h2>
          {phonetic && <p className="text-muted-foreground text-sm">{phonetic}</p>}
          <button
            onClick={speak}
            className="mt-4 flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Volume2 className="h-4 w-4" />
            ฟังเสียง
          </button>
          <p className="mt-6 text-xs text-muted-foreground">แตะเพื่อดูความหมาย</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-card dark:from-green-950/20 dark:border-green-800 p-8 shadow-lg space-y-4"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ความหมาย</p>
            <p className="text-xl font-semibold mt-1">{meaningTh}</p>
          </div>
          {exampleEn && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ตัวอย่าง</p>
              <p className="mt-1 text-sm italic">&ldquo;{exampleEn}&rdquo;</p>
              {exampleTh && <p className="text-xs text-muted-foreground mt-1">{exampleTh}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
