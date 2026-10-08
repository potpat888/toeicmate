'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Sparkles, BookOpen, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const GRAMMAR_TOPICS = [
  {
    topic: 'tense',
    titleTh: '1. Tense & Verb Forms (กาลและรูปกริยา)',
    titleEn: 'Tense & Verb Forms',
    descTh: 'เจาะลึก Past Perfect, Present Perfect, Future Continuous และ Subject-Verb Agreement ที่มักสร้างความสับสนใน Part 5',
    count: 10,
    timeMins: 7,
    keyPoints: ['by the time + Simple Past -> Past Perfect', 'Present Continuous vs Simple Present (กิจวัตร vs ชั่วคราว)', 'Passive Voice ในประธานไม่มีชีวิต'],
  },
  {
    topic: 'preposition',
    titleTh: '2. Prepositions & Collocations (คำบุพบทและคำคู่)',
    titleEn: 'Prepositions & Collocations',
    descTh: 'เน้น Fixed Expressions เช่น in effect, by reservation only, pursuant to, beyond expectations',
    count: 10,
    timeMins: 7,
    keyPoints: ['Preposition of Time (in, on, at, by, within)', 'Preposition of Manner (via, through, by)', 'Idiomatic business phrases'],
  },
  {
    topic: 'word_form',
    titleTh: '3. Word Form & Part of Speech (ชนิดของคำ)',
    titleEn: 'Word Form & Derivations',
    descTh: 'วิเคราะห์โครงสร้างประโยค หาตำแหน่ง Noun, Verb, Adjective, Adverb จากคำลงท้าย (Suffix)',
    count: 10,
    timeMins: 7,
    keyPoints: ['Subject position ต้องการ Noun/Gerund', 'Adjective ขยาย Noun / Adverb ขยาย Verb & Adj', '-tion, -ment, -ance, -al, -ly'],
  },
  {
    topic: 'conjunction',
    titleTh: '4. Conjunctions & Transitions (คำเชื่อม)',
    titleEn: 'Conjunctions & Transition Words',
    descTh: 'แยกแยะ Conjunction vs Preposition (although vs despite, because vs because of, provided that, once)',
    count: 10,
    timeMins: 7,
    keyPoints: ['Conjunction + Subject + Verb', 'Preposition + Noun / Noun Phrase', 'Correlative Conjunctions (whether...or, either...or)'],
  },
];

export default function GrammarDrillsPage() {
  const locale = useLocale();
  const router = useRouter();
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);

  const startTopic = async (topic: string) => {
    setLoadingTopic(topic);
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'GRAMMAR_DRILL', count: 10 }),
      });
      const data = await res.json();
      if (data.sessionId) {
        router.push(`/${locale}/quiz/${data.sessionId}`);
      } else {
        alert(data.error || 'ไม่พบข้อสอบในหมวดนี้');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเริ่มทำข้อสอบ');
    } finally {
      setLoadingTopic(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-amber-500" />
          <span>{locale === 'th' ? 'Grammar Drill — เจาะจุดออกสอบบ่อยใน Part 5' : 'Part 5 Grammar Drills'}</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {locale === 'th'
            ? 'เลือกฝึกไวยากรณ์เฉพาะจุดที่มักเสียคะแนน พร้อมกฎสรุปสั้นและเฉลยวิเคราะห์เหตุผลข้อผิด'
            : 'Targeted drills on grammar points frequently tested in TOEIC Part 5.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GRAMMAR_TOPICS.map((g) => (
          <Card key={g.topic} className="flex flex-col justify-between hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-semibold uppercase text-amber-600 border-amber-300">
                  {g.topic}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {g.timeMins} นาที
                </span>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2">
                {locale === 'th' ? g.titleTh : g.titleEn}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {g.descTh}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1.5">
                <span className="font-semibold text-foreground text-[11px] block">🎯 สรุปจุดสำคัญ:</span>
                {g.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="text-amber-500">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => startTopic(g.topic)}
                disabled={loadingTopic === g.topic}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 font-medium"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loadingTopic === g.topic ? 'กำลังสร้างชุดฝึก...' : locale === 'th' ? 'เริ่มฝึกหมวดนี้ (10 ข้อ)' : 'Start Drill (10 Qs)'}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
