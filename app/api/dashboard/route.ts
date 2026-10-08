import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [user, recentSessions, vocabDueCount, streaks] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, currentScore: true, targetScore: true } }),
    prisma.testSession.findMany({
      where: { userId, finishedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, type: true, part: true, correctCount: true, totalQuestions: true, score: true, createdAt: true },
    }),
    prisma.vocabCard.count({
      where: { userId, nextReviewAt: { lte: new Date() } },
    }),
    prisma.studyStreak.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    }),
  ]);

  // Calculate streak
  let streak = 0;
  const todayStr = today.toISOString().split('T')[0];
  const streakDates = streaks.map((s) => s.date);
  
  let checkDate = new Date(today);
  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (streakDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0 && dateStr !== todayStr) {
      // today hasn't been studied yet, skip to yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Accuracy by part
  const partStats = await prisma.$queryRaw<{ part: number; total: number; correct: number }[]>`
    SELECT q.part, COUNT(*) as total, SUM(CASE WHEN a.isCorrect = 1 THEN 1 ELSE 0 END) as correct
    FROM Answer a
    JOIN Question q ON a.questionId = q.id
    JOIN TestSession ts ON a.sessionId = ts.id
    WHERE ts.userId = ${userId}
    GROUP BY q.part
    ORDER BY q.part
  `;

  return NextResponse.json({
    user,
    streak,
    recentSessions,
    vocabDueCount,
    partStats: partStats.map((p) => ({
      part: Number(p.part),
      accuracy: p.total > 0 ? Math.round((Number(p.correct) / Number(p.total)) * 100) : 0,
      total: Number(p.total),
    })),
  });
}
