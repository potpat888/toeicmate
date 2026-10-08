'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, GraduationCap, Headphones, BookOpen, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export default function MockTestPage() {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startMock = async (count: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'FULL_MOCK', count }),
      });
      const data = await res.json();
      if (data.sessionId) {
        router.push(`/${locale}/quiz/${data.sessionId}`);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเริ่มการสอบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span>{locale === 'th' ? 'Full Mock Test — สอบจำลองเสมือนจริง' : 'Full Mock Exam Simulation'}</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {locale === 'th'
            ? 'จับเวลาเสมือนจริง พร้อมระบบแปลงผลเป็นคะแนนโดยประมาณแยก Listening / Reading'
            : 'Simulated exam environment with estimated scaled score conversions.'}
        </p>
      </div>

      {/* Structure Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-card dark:from-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="text-xs">Section 1</Badge>
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~45 นาที
              </span>
            </div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 mt-2">
              <Headphones className="w-5 h-5 text-blue-600" />
              <span>Listening Comprehension (100 ข้อ)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Part 1 (Photographs) 6 ข้อ • Part 2 (Q&A) 25 ข้อ • Part 3 (Conversations) 39 ข้อ • Part 4 (Talks) 30 ข้อ
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• คะแนนประเมิน: 5 – 495 คะแนน</p>
            <p>• อ่านโจทย์ล่วงหน้าขณะฟังคำสั่งเพื่อจับใจความสำคัญ</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-card dark:from-indigo-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="text-xs">Section 2</Badge>
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 75 นาที
              </span>
            </div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 mt-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Reading Comprehension (100 ข้อ)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Part 5 (Fill-in) 30 ข้อ • Part 6 (Text Completion) 16 ข้อ • Part 7 (Passages) 54 ข้อ
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• คะแนนประเมิน: 5 – 495 คะแนน</p>
            <p>• บริหารเวลา Part 5–6 ให้จบภายใน 20 นาที เพื่อเหลือ 55 นาทีสำหรับ Part 7</p>
          </CardContent>
        </Card>
      </div>

      {/* Rules & Guidance */}
      <div className="rounded-xl border bg-muted/40 p-5 space-y-3 text-xs leading-relaxed text-muted-foreground">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>คำแนะนำก่อนเริ่มการสอบจำลอง:</span>
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>บรรยากาศเงียบสงบ:</strong> นั่งทำในที่ไม่มีสิ่งรบกวน ใช้หูฟังสำหรับการฟังเสียง</li>
          <li><strong>บันทึกสถานะอัตโนมัติ:</strong> หากเน็ตหลุดหรือปิดแท็บ สามารถเปิดกลับมาทำต่อจากจุดเดิมได้ทันที</li>
          <li><strong>ข้อสอบสร้างขึ้นใหม่:</strong> ข้อสอบในระบบจัดทำขึ้นตามแนวข้อสอบจริง โดยไม่มีการละเมิดลิขสิทธิ์ของ ETS</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Button
          size="lg"
          onClick={() => startMock(20)}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-medium px-8"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{locale === 'th' ? 'เริ่ม Mini Mock (20 ข้อ — แนะนำ)' : 'Start Mini Mock (20 Qs)'}</span>
        </Button>
      </div>
    </div>
  );
}
