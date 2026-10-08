'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, BookOpen, Headphones, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface PartInfo {
  part: number;
  type: 'Listening' | 'Reading';
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  count: number;
  timeMins: number;
  icon: typeof Headphones | typeof BookOpen;
}

const PARTS: PartInfo[] = [
  {
    part: 1,
    type: 'Listening',
    titleTh: 'Part 1: รูปภาพ (Photographs)',
    titleEn: 'Part 1: Photographs',
    descTh: 'ฟังประโยค 4 ตัวเลือก แล้วเลือกข้อความที่อธิบายภาพได้ถูกต้องที่สุด',
    descEn: 'Listen to four statements and select the one that best describes the image.',
    count: 10,
    timeMins: 8,
    icon: Headphones,
  },
  {
    part: 2,
    type: 'Listening',
    titleTh: 'Part 2: ถาม-ตอบ (Question-Response)',
    titleEn: 'Part 2: Question-Response',
    descTh: 'ฟังคำถามและคำตอบ 3 ตัวเลือก เลือกคำตอบที่ตอบรับได้อย่างเป็นธรรมชาติ',
    descEn: 'Listen to a question or statement and three responses, then pick the best reply.',
    count: 10,
    timeMins: 8,
    icon: Headphones,
  },
  {
    part: 3,
    type: 'Listening',
    titleTh: 'Part 3: บทสนทนา (Conversations)',
    titleEn: 'Part 3: Conversations',
    descTh: 'ฟังบทสนทนาระหว่าง 2–3 คน แล้วตอบคำถาม 3 ข้อต่อหนึ่งบทสนทนา',
    descEn: 'Listen to dialogues between two or more people and answer questions.',
    count: 10,
    timeMins: 9,
    icon: Headphones,
  },
  {
    part: 4,
    type: 'Listening',
    titleTh: 'Part 4: บรรยายเดี่ยว (Talks)',
    titleEn: 'Part 4: Talks',
    descTh: 'ฟังประกาศ บรรยาย รายงานข่าว หรือข้อความเสียงสั้นๆ',
    descEn: 'Listen to short monologue announcements, reports, or speeches.',
    count: 10,
    timeMins: 9,
    icon: Headphones,
  },
  {
    part: 5,
    type: 'Reading',
    titleTh: 'Part 5: เติมคำในประโยค (Incomplete Sentences)',
    titleEn: 'Part 5: Incomplete Sentences',
    descTh: 'ทดสอบไวยากรณ์ (Grammar) และคำศัพท์ (Vocabulary) ชุดละ 10 ข้อ จับเวลา 7 นาที',
    descEn: 'Test grammar, word forms, tenses, prepositions and vocabulary.',
    count: 10,
    timeMins: 7,
    icon: BookOpen,
  },
  {
    part: 6,
    type: 'Reading',
    titleTh: 'Part 6: เติมคำในย่อหน้า (Text Completion)',
    titleEn: 'Part 6: Text Completion',
    descTh: 'เติมคำหรือประโยคที่ขาดหายไปในเอกสารทางธุรกิจ เช่น อีเมล หรือจดหมาย',
    descEn: 'Fill missing words or sentences in business texts and notices.',
    count: 10,
    timeMins: 8,
    icon: BookOpen,
  },
  {
    part: 7,
    type: 'Reading',
    titleTh: 'Part 7: อ่านบทความ (Reading Comprehension)',
    titleEn: 'Part 7: Reading Comprehension',
    descTh: 'อ่านเอกสารเดี่ยวและเอกสารคู่/สามชุด เช่น อีเมล, ตาราง, ประกาศ',
    descEn: 'Single, double, and triple passage reading comprehension.',
    count: 10,
    timeMins: 12,
    icon: BookOpen,
  },
];

export default function QuizOverviewPage() {
  const locale = useLocale();
  const router = useRouter();
  const [loadingPart, setLoadingPart] = useState<number | null>(null);

  const startQuiz = async (part: number) => {
    setLoadingPart(part);
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part, type: 'PART_PRACTICE', count: 10 }),
      });
      const data = await res.json();
      if (data.sessionId) {
        router.push(`/${locale}/quiz/${data.sessionId}`);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการสร้างข้อสอบ');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoadingPart(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {locale === 'th' ? 'คลังข้อสอบแยกตาม Part 1–7' : 'Practice Questions by Part (1–7)'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {locale === 'th'
            ? 'ฝึกฝนทีละชุด ชุดละ 10 ข้อ มีระบบจับเวลาเสมือนจริง และเฉลยพร้อมเหตุผลว่าทำไมข้ออื่นผิด'
            : 'Select a part to practice with 10 timed questions and complete explanations.'}
        </p>
      </div>

      {/* Recommended Quick Drill */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              {locale === 'th' ? 'แนะนำสำหรับวันนี้' : 'Recommended'}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 7 นาที
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {locale === 'th' ? 'Part 5: Grammar Drill (10 ข้อ)' : 'Part 5: Grammar Drill (10 Qs)'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'th'
              ? 'ข้อสอบเน้น Tense, Preposition, Word Form และ Conjunction ที่ออกสอบบ่อยที่สุด'
              : 'Targeted drill on tenses, prepositions, word forms, and conjunctions.'}
          </p>
        </div>
        <Button
          onClick={() => startQuiz(5)}
          disabled={loadingPart === 5}
          className="shrink-0 bg-primary hover:bg-primary/90 gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loadingPart === 5 ? 'กำลังเตรียม...' : locale === 'th' ? 'เริ่มทำทันที' : 'Start Drill'}</span>
        </Button>
      </div>

      {/* Part Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PARTS.map((p) => {
          const Icon = p.icon;
          const isListening = p.type === 'Listening';
          return (
            <Card key={p.part} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={isListening ? 'secondary' : 'default'} className="text-xs font-medium">
                    {p.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{p.timeMins} {locale === 'th' ? 'นาที' : 'mins'}</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold mt-2 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{locale === 'th' ? p.titleTh : p.titleEn}</span>
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {locale === 'th' ? p.descTh : p.descEn}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-0">
                <Button
                  onClick={() => startQuiz(p.part)}
                  disabled={loadingPart === p.part}
                  variant="outline"
                  className="w-full text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{loadingPart === p.part ? 'กำลังโหลด...' : locale === 'th' ? 'เริ่มชุด 10 ข้อ' : 'Start 10 Qs'}</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
