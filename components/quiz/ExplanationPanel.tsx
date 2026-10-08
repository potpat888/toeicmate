import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface ReviewQuestion {
  id: string;
  questionText: string;
  choices: string[];
  answer: number;
  explanationTh: string;
  userChosen: number;
  isCorrect: boolean;
}

interface ExplanationPanelProps {
  questions: ReviewQuestion[];
  correctCount: number;
  total: number;
  estimatedScore: number;
}

const choiceLabels = ['A', 'B', 'C', 'D'];

export function ExplanationPanel({ questions, correctCount, total, estimatedScore }: ExplanationPanelProps) {
  const accuracy = Math.round((correctCount / total) * 100);

  return (
    <div className="space-y-8">
      {/* Score Summary */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 text-center">
        <p className="text-4xl font-bold text-primary">{correctCount}/{total}</p>
        <p className="text-muted-foreground mt-1">ตอบถูก {accuracy}%</p>
        <p className="text-sm mt-2">คะแนนประมาณ <span className="font-semibold text-foreground">{estimatedScore} คะแนน</span></p>
      </div>

      {/* Per Question Review */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className={cn(
            'rounded-xl border p-5 space-y-4',
            q.isCorrect ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
          )}>
            <div className="flex items-start gap-3">
              {q.isCorrect
                ? <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                : <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">ข้อ {idx + 1}</p>
                <p className="text-sm font-medium">{q.questionText}</p>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-2">
              {q.choices.map((choice, i) => (
                <div key={i} className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                  i === q.answer && 'bg-green-100 dark:bg-green-900/30 font-medium text-green-800 dark:text-green-200',
                  i === q.userChosen && !q.isCorrect && 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
                )}>
                  <span className="font-bold w-5">{choiceLabels[i]}.</span>
                  <span className="flex-1">{choice}</span>
                  {i === q.answer && <span className="text-xs">✓ ถูก</span>}
                  {i === q.userChosen && !q.isCorrect && <span className="text-xs">✗ คุณเลือก</span>}
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="rounded-lg bg-white/60 dark:bg-black/20 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">📖 คำอธิบาย</p>
              <p className="text-sm leading-relaxed whitespace-pre-line">{q.explanationTh}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
