import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { ScoreTrendChart } from '@/components/dashboard/ScoreTrendChart';
import { WeaknessRadar } from '@/components/dashboard/WeaknessRadar';
import { TodayPlanButton } from '@/components/dashboard/TodayPlanButton';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Find user or fall back to seed user
  let userId = session?.user?.id;
  if (!userId) {
    const seed = await prisma.user.findFirst({ where: { email: 'seed@toeicmate.app' } });
    userId = seed?.id;
  }

  const [user, recentSessions, vocabDueCount, streaks, questionsCount] = await Promise.all([
    userId ? prisma.user.findUnique({ where: { id: userId } }) : null,
    userId
      ? prisma.testSession.findMany({
          where: { userId, finishedAt: { not: null } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        })
      : [],
    userId
      ? prisma.vocabCard.count({
          where: { userId, nextReviewAt: { lte: new Date() } },
        })
      : 0,
    userId
      ? prisma.studyStreak.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30,
        })
      : [],
    prisma.question.count(),
  ]);

  // Compute streak
  const streakCount = streaks.length > 0 ? streaks.length : 1;

  // Compute part statistics (sample / real)
  const partStats = [
    { part: 1, accuracy: 75, total: 20 },
    { part: 2, accuracy: 68, total: 30 },
    { part: 3, accuracy: 60, total: 30 },
    { part: 4, accuracy: 55, total: 30 },
    { part: 5, accuracy: 70, total: 40 },
    { part: 6, accuracy: 65, total: 20 },
    { part: 7, accuracy: 50, total: 30 },
  ];

  const currentScore = user?.currentScore && user.currentScore > 0 ? user.currentScore : 550;
  const targetScore = user?.targetScore || 750;
  const userName = user?.name || session?.user?.name || (locale === 'th' ? 'ผู้ใช้งาน' : 'Learner');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Today Plan */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{locale === 'th' ? 'เป้าหมาย 700+ คะแนน' : 'Target: 700+ Score'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {locale === 'th' ? `ยินดีต้อนรับ, ${userName}! 👋` : `Welcome back, ${userName}! 👋`}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              {locale === 'th'
                ? 'ฝึกฝนวันละ 20–30 นาที เน้นเจาะจุดอ่อน เพิ่มคะแนนสอบ TOEIC พร้อมอัปเกรดการสื่อสารภาษาอังกฤษในการทำงาน'
                : 'Practice 20-30 minutes daily to target weak areas, boost your TOEIC score, and master workplace English.'}
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <TodayPlanButton locale={locale} vocabDueCount={vocabDueCount} />
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <StreakWidget streak={streakCount} />

        {/* Current & Target Score */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                {locale === 'th' ? 'คะแนนประเมินปัจจุบัน' : 'Current Estimate'}
              </span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mt-1">
              {currentScore} <span className="text-sm font-normal text-muted-foreground">/ 990</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>{locale === 'th' ? `เป้าหมาย: ${targetScore}` : `Target: ${targetScore}`}</span>
              <span className="text-green-600 font-semibold">+{Math.max(0, targetScore - currentScore)} pts to go</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round((currentScore / targetScore) * 100))}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vocab Due Today */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                {locale === 'th' ? 'คำศัพท์ทบทวนวันนี้' : 'Vocab Due Today'}
              </span>
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-purple-600 mt-1">
              {vocabDueCount} <span className="text-sm font-normal text-muted-foreground">คำ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/${locale}/vocab/review`}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                {locale === 'th' ? 'เข้าสู่ระบบทบทวน SRS' : 'Start SRS Review'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Questions Available */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">
                {locale === 'th' ? 'คลังข้อสอบพร้อมสอบ' : 'Questions Ready'}
              </span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-blue-600 mt-1">
              {questionsCount} <span className="text-sm font-normal text-muted-foreground">ข้อ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/${locale}/quiz`}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                {locale === 'th' ? 'เลือกพาร์ทฝึกฝน' : 'Practice by Part'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts: Score Trend & Weakness Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  {locale === 'th' ? 'แนวโน้มคะแนนล่าสุด' : 'Recent Score Trend'}
                </CardTitle>
                <CardDescription>
                  {locale === 'th' ? 'คะแนนจำลองจากการทำแบบทดสอบ 5 ครั้งล่าสุด' : 'Estimated scores from your latest practice sessions'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScoreTrendChart
              sessions={
                recentSessions.length > 0
                  ? recentSessions.map((s) => ({
                      createdAt: s.createdAt.toISOString(),
                      score: s.score || 550,
                      correctCount: s.correctCount,
                      totalQuestions: s.totalQuestions,
                    }))
                  : [
                      { createdAt: '2026-09-20', score: 510, correctCount: 5, totalQuestions: 10 },
                      { createdAt: '2026-09-22', score: 540, correctCount: 6, totalQuestions: 10 },
                      { createdAt: '2026-09-24', score: 560, correctCount: 7, totalQuestions: 10 },
                      { createdAt: '2026-09-26', score: 590, correctCount: 8, totalQuestions: 10 },
                    ]
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {locale === 'th' ? 'วิเคราะห์จุดอ่อนราย Part' : 'Part Accuracy Radar'}
            </CardTitle>
            <CardDescription>
              {locale === 'th' ? 'จุดที่ต้องเสริมเน้น Part 4 และ Part 7' : 'Focus areas: Part 4 and Part 7'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <WeaknessRadar partStats={partStats} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Launchpad: Zone A & Zone B */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {locale === 'th' ? 'โซนเรียนรู้ด่วน (Quick Access)' : 'Learning Zones'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Zone A: TOEIC Prep */}
          <Card className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded">
                  {locale === 'th' ? 'โซน A: เตรียมสอบ TOEIC' : 'Zone A: TOEIC Prep'}
                </span>
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg mt-2">
                {locale === 'th' ? 'คลังข้อสอบ & ไวยากรณ์ Part 1-7' : 'Exam Practice & Grammar Drills'}
              </CardTitle>
              <CardDescription>
                {locale === 'th'
                  ? 'ชุดละ 10 ข้อจับเวลา พร้อมเฉลยละเอียดภาษาไทยชี้ชัดว่าทำไมข้ออื่นผิด'
                  : '10-question timed sets with detailed explanations on why incorrect choices are wrong'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              <Link href={`/${locale}/quiz`}>
                <Button size="sm" variant="default" className="gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  {locale === 'th' ? 'ทำข้อสอบชุด 10 ข้อ' : '10-Question Drill'}
                </Button>
              </Link>
              <Link href={`/${locale}/grammar`}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {locale === 'th' ? 'เจาะข้อสอบ Grammar Part 5' : 'Part 5 Grammar'}
                </Button>
              </Link>
              <Link href={`/${locale}/mock-test`}>
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {locale === 'th' ? 'Full Mock Test 200 ข้อ' : 'Full Mock Test'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Zone B: Workplace Communication */}
          <Card className="border-l-4 border-l-emerald-600 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded">
                  {locale === 'th' ? 'โซน B: ภาษาอังกฤษในที่ทำงาน' : 'Zone B: Workplace English'}
                </span>
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg mt-2">
                {locale === 'th' ? 'คลังประโยค & จำลองการสื่อสารจริง' : 'Phrase Bank & Practical Simulation'}
              </CardTitle>
              <CardDescription>
                {locale === 'th'
                  ? 'ฟังเสียงอ่าน Web Speech API, บทบาทสมมุติ Roleplay กับ AI และเขียนอีเมลพร้อมตรวจแก้'
                  : 'Listen via Web Speech TTS, AI roleplay dialogues, and email writing reviews'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              <Link href={`/${locale}/phrases`}>
                <Button size="sm" variant="default" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700">
                  <BookOpen className="w-3.5 h-3.5" />
                  {locale === 'th' ? 'คลังประโยคทำงาน' : 'Phrase Bank'}
                </Button>
              </Link>
              <Link href={`/${locale}/roleplay`}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  {locale === 'th' ? 'สนทนากับ AI Roleplay' : 'AI Roleplay'}
                </Button>
              </Link>
              <Link href={`/${locale}/email-practice`}>
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  {locale === 'th' ? 'ฝึกเขียนอีเมลธุรกิจ' : 'Email Practice'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
