'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { FlashCard } from '@/components/vocab/FlashCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QUALITY_LABELS } from '@/lib/srs';
import {
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Home,
} from 'lucide-react';
import Link from 'next/link';

interface VocabCardItem {
  id: string;
  term: string;
  phonetic?: string | null;
  meaningTh: string;
  exampleEn?: string | null;
  exampleTh?: string | null;
  category: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: string;
}

export default function VocabReviewPage() {
  const locale = useLocale();
  const [cards, setCards] = useState<VocabCardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        const res = await fetch('/api/vocab/due');
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          setCards(data.cards);
        } else {
          // If no cards due, fetch all cards or initial batch
          const allRes = await fetch('/api/vocab/due');
          const allData = await allRes.json();
          setCards(allData.cards || []);
        }
      } catch (err) {
        console.error('Error loading cards', err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const handleRate = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (ratingLoading || cards.length === 0) return;
    setRatingLoading(true);

    const currentCard = cards[currentIndex];
    try {
      await fetch('/api/vocab/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: currentCard.id, quality }),
      });

      setReviewedCount((prev) => prev + 1);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsDone(true);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setRatingLoading(false);
    }
  };

  const filteredCards =
    activeCategory === 'ALL'
      ? cards
      : cards.filter((c) => c.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const currentCard = filteredCards[currentIndex] || cards[currentIndex];
  const progressPercent = cards.length > 0 ? Math.round(((currentIndex) / cards.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-muted-foreground text-sm">
          {locale === 'th' ? 'กำลังดึงคำศัพท์ตามรอบอัลกอริทึม SM-2...' : 'Loading vocab cards...'}
        </p>
      </div>
    );
  }

  if (isDone || cards.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'th' ? 'ทบทวนคำศัพท์เสร็จสิ้นแล้ว! 🎉' : 'All Cards Reviewed! 🎉'}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {locale === 'th'
              ? `คุณได้ทบทวนคำศัพท์ไปแล้ว ${reviewedCount || cards.length} คำ ระบบได้คำนวณวันทบทวนรอบถัดไปตามอัลกอริทึม SM-2 เรียบร้อยแล้ว`
              : `You reviewed ${reviewedCount || cards.length} words. Next review dates are scheduled via SM-2 algorithm.`}
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link href={`/${locale}/dashboard`}>
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              <span>{locale === 'th' ? 'กลับแดชบอร์ด' : 'Go to Dashboard'}</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex(0);
              setIsDone(false);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {locale === 'th' ? 'ทบทวนใหม่อีกรอบ' : 'Review Again'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span>{locale === 'th' ? 'ทบทวนคำศัพท์ (Spaced Repetition)' : 'Vocabulary SRS Review'}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {locale === 'th'
              ? 'ระบบ SM-2 คำนวณช่วงเวลาทบทวนอัตโนมัติ ช่วยจำศัพท์ธุรกิจแม่นยำขึ้น'
              : 'SuperMemo-2 adaptive spacing for long-term retention.'}
          </p>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-2.5 font-semibold">
          {currentIndex + 1} / {cards.length}
        </Badge>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-1.5" />

      {/* Interactive 3D Flip Flashcard */}
      <FlashCard
        term={currentCard.term}
        phonetic={currentCard.phonetic}
        meaningTh={currentCard.meaningTh}
        exampleEn={currentCard.exampleEn}
        exampleTh={currentCard.exampleTh}
        category={currentCard.category}
      />

      {/* Quality Rating Section */}
      <div className="space-y-3 pt-2">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {locale === 'th' ? 'ประเมินความแม่นยำเพื่อตั้งเวลารอบถัดไป' : 'Rate how well you recalled this word'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUALITY_LABELS.map((item) => (
            <Button
              key={item.quality}
              variant={item.color as any}
              disabled={ratingLoading}
              onClick={() => handleRate(item.quality)}
              className="flex flex-col h-14 justify-center gap-0.5 border"
            >
              <span className="text-sm font-bold">
                {locale === 'th' ? item.labelTh : item.labelEn}
              </span>
              <span className="text-[10px] opacity-75 font-normal">
                {item.quality === 0 && (locale === 'th' ? 'เริ่มใหม่พรุ่งนี้' : 'Reset')}
                {item.quality === 3 && (locale === 'th' ? 'ทบทวนซ้ำเร็วขึ้น' : 'Hard')}
                {item.quality === 4 && (locale === 'th' ? 'จำได้ปกติ' : 'Good')}
                {item.quality === 5 && (locale === 'th' ? 'เว้นช่วงนานขึ้น' : 'Easy')}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Metadata info */}
      <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>
            {locale === 'th' ? 'ระยะทบทวนปัจจุบัน:' : 'Current interval:'}{' '}
            <strong className="text-foreground">{currentCard.interval} วัน</strong>
          </span>
        </div>
        <div>
          <span>
            {locale === 'th' ? 'ความถี่ที่จำได้:' : 'Repetitions:'}{' '}
            <strong className="text-foreground">{currentCard.repetitions} ครั้ง</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
