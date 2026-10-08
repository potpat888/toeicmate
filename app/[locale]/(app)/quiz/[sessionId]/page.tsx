'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ExplanationPanel } from '@/components/quiz/ExplanationPanel';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Volume2, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

interface QuestionItem {
  id: string;
  part: number;
  topic?: string;
  difficulty?: string;
  questionText: string;
  choices: string[];
  passage?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
}

interface ReviewQuestion {
  id: string;
  questionText: string;
  choices: string[];
  answer: number;
  explanationTh: string;
  userChosen: number;
  isCorrect: boolean;
}

export default function QuizSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const locale = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // Completed results
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [estimatedScore, setEstimatedScore] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewQuestion[]>([]);

  // Load session or questions
  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz/${sessionId}`);
        if (!res.ok) {
          throw new Error('ไม่พบชุดข้อสอบนี้ หรือเซสชันหมดอายุแล้ว');
        }
        const data = await res.json();

        // If session was already completed
        if (data.finishedAt && data.answers?.length > 0) {
          const revs: ReviewQuestion[] = data.answers.map((a: any) => ({
            id: a.question.id,
            questionText: a.question.questionText,
            choices: JSON.parse(a.question.choices),
            answer: a.question.answer,
            explanationTh: a.question.explanationTh,
            userChosen: a.chosen,
            isCorrect: a.isCorrect,
          }));
          setReviewData(revs);
          setCorrectCount(data.correctCount);
          setEstimatedScore(data.score || 0);
          setSubmitted(true);
          setLoading(false);
          return;
        }

        // Restore resumeState if available
        let restoredIndex = 0;
        let restoredAnswers: Record<string, number> = {};
        if (data.resumeState) {
          try {
            const parsed = JSON.parse(data.resumeState);
            restoredIndex = parsed.currentIndex || 0;
            restoredAnswers = parsed.answers || {};
          } catch (e) {
            console.error(e);
          }
        }

        // Fetch questions for this session
        // If not in session payload, fetch from API or question records
        const qRes = await fetch(`/api/quiz/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ part: data.part || 5, type: data.type || 'PART_PRACTICE', count: 10 }),
        });
        const qData = await qRes.json();
        if (qData.questions) {
          const formatted = qData.questions.map((q: any) => ({
            ...q,
            choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices,
          }));
          setQuestions(formatted);
          setCurrentIndex(restoredIndex);
          setAnswers(restoredAnswers);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อสอบ');
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  // Save resume state periodically or upon answer
  const saveProgress = useCallback(
    async (idx: number, ans: Record<string, number>) => {
      if (submitted) return;
      try {
        await fetch(`/api/quiz/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentIndex: idx, answers: ans }),
        });
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    },
    [sessionId, submitted]
  );

  const handleSelectChoice = (choiceIndex: number) => {
    if (submitted || questions.length === 0) return;
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: choiceIndex };
    setAnswers(newAnswers);
    saveProgress(currentIndex, newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      saveProgress(nextIdx, answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      saveProgress(prevIdx, answers);
    }
  };

  const handleSubmit = async () => {
    if (submitting || submitted || questions.length === 0) return;
    setSubmitting(true);
    try {
      const payloadAnswers: Record<string, { chosen: number }> = {};
      questions.forEach((q) => {
        payloadAnswers[q.id] = { chosen: answers[q.id] !== undefined ? answers[q.id] : -1 };
      });

      const res = await fetch(`/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: payloadAnswers,
          questionIds: questions.map((q) => q.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ส่งข้อสอบไม่สำเร็จ');
      }

      setCorrectCount(data.correctCount);
      setEstimatedScore(data.estimatedScore);
      setReviewData(data.reviewData || []);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'เกิดข้อผิดพลาดในการส่งคำตอบ');
    } finally {
      setSubmitting(false);
    }
  };

  // Text-to-Speech via Web Speech API
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          {locale === 'th' ? 'กำลังโหลดข้อสอบและเตรียมห้องสอบ...' : 'Loading exam questions...'}
        </p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-destructive font-medium">{error || 'ไม่พบชุดข้อสอบ'}</p>
        <Link href={`/${locale}/quiz`}>
          <Button variant="outline">{locale === 'th' ? 'กลับไปเลือกชุดข้อสอบ' : 'Back to Quiz selection'}</Button>
        </Link>
      </div>
    );
  }

  // Review & Explanation Mode (after submission)
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {locale === 'th' ? 'สรุปผลคะแนนและเฉลยละเอียด' : 'Score Summary & Explanations'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {locale === 'th'
                ? 'อ่านคำอธิบายภาษาไทยเพื่อทำความเข้าใจว่าทำไมคำตอบนี้จึงถูก และทำไมตัวเลือกอื่นจึงผิด'
                : 'Review explanations and rationale for each question.'}
            </p>
          </div>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span>{locale === 'th' ? 'กลับแดชบอร์ด' : 'Dashboard'}</span>
            </Button>
          </Link>
        </div>

        <ExplanationPanel
          questions={reviewData}
          correctCount={correctCount}
          total={reviewData.length || questions.length}
          estimatedScore={estimatedScore}
        />

        <div className="flex items-center justify-center gap-4 pt-6 border-t">
          <Link href={`/${locale}/quiz`}>
            <Button className="gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>{locale === 'th' ? 'ทำข้อสอบชุดอื่น' : 'Practice Another Set'}</span>
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline">
              {locale === 'th' ? 'ดูความก้าวหน้า' : 'View Progress'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Active Quiz Focus Mode
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top Bar: Minimal distraction (Timer, Question progress, Audio) */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur py-3 border-b flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-foreground">
            {locale === 'th' ? `ข้อ ${currentIndex + 1} / ${questions.length}` : `Q ${currentIndex + 1} of ${questions.length}`}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            (ตอบแล้ว {totalAnswered}/{questions.length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Read aloud button via Web Speech API */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => speakText(currentQ.questionText)}
            title="อ่านออกเสียงโจทย์"
            className="text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">ฟังโจทย์</span>
          </Button>

          {/* Countdown timer: 7 minutes for 10 questions */}
          <QuizTimer totalSeconds={7 * 60} onTimeUp={handleSubmit} />
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-1.5" />

      {/* Question Card */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          questionText={currentQ.questionText}
          passage={currentQ.passage}
          choices={currentQ.choices.map((text, index) => ({ index, text }))}
          selectedIndex={answers[currentQ.id]}
          onSelect={handleSelectChoice}
          disabled={submitting}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0 || submitting}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'th' ? 'ข้อก่อนหน้า' : 'Previous'}</span>
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 font-medium px-6"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{locale === 'th' ? 'ส่งคำตอบตรวจผล' : 'Submit & Review'}</span>
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={submitting}
            className="gap-1.5"
          >
            <span>{locale === 'th' ? 'ข้อถัดไป' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Question Grid Dots for jumping */}
      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground mb-2 text-center">
          {locale === 'th' ? 'ไปยังข้อที่ต้องการ' : 'Jump to question'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  saveProgress(idx, answers);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground'
                    : isAnswered
                    ? 'bg-primary/20 text-primary font-bold'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
