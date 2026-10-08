'use client';
import { cn } from '@/lib/utils';

interface Choice {
  index: number;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  passage?: string | null;
  choices: Choice[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  passage,
  choices,
  selectedIndex,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  const choiceLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {passage && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">Passage</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{passage}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-muted-foreground mb-1">ข้อ {questionNumber}/{totalQuestions}</p>
        <p className="text-base font-medium leading-relaxed">{questionText}</p>
      </div>

      <div className="space-y-3">
        {choices.map((choice) => (
          <button
            key={choice.index}
            onClick={() => !disabled && onSelect(choice.index)}
            disabled={disabled}
            className={cn(
              'w-full flex items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all',
              'hover:border-primary/60 hover:bg-accent',
              selectedIndex === choice.index
                ? 'border-primary bg-primary/10 font-medium text-primary'
                : 'border-border bg-card',
              disabled && 'cursor-default',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                selectedIndex === choice.index
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40 text-muted-foreground',
              )}
            >
              {choiceLabels[choice.index]}
            </span>
            <span className="pt-0.5">{choice.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
