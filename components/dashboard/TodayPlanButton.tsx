'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface TodayPlanButtonProps {
  locale: string;
  vocabDueCount: number;
}

export function TodayPlanButton({ locale, vocabDueCount }: TodayPlanButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartToday = async () => {
    setLoading(true);
    try {
      if (vocabDueCount > 0) {
        router.push(`/${locale}/vocab/review`);
      } else {
        // Start 10 questions of Part 5 practice
        const res = await fetch('/api/quiz/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ part: 5, type: 'PART_PRACTICE', count: 10 }),
        });
        const data = await res.json();
        if (data.sessionId) {
          router.push(`/${locale}/quiz/${data.sessionId}`);
        } else {
          router.push(`/${locale}/quiz`);
        }
      }
    } catch (err) {
      console.error(err);
      router.push(`/${locale}/quiz`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleStartToday}
      disabled={loading}
      className="w-full sm:w-auto font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5 text-yellow-300" />
      )}
      <span>{locale === 'th' ? 'เริ่มแผนเรียนวันนี้ (20-30 นาที)' : "Start Today's Plan (20-30m)"}</span>
      <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
  );
}
