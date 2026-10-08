import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  sessionId: z.string(),
  answers: z.record(z.object({
    chosen: z.number(),
    timeSpentMs: z.number().optional(),
  })),
  questionIds: z.array(z.string()),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { sessionId, answers, questionIds } = parsed.data;

  // Verify session belongs to user
  const testSession = await prisma.testSession.findFirst({
    where: { id: sessionId, userId: session.user.id, finishedAt: null },
  });
  if (!testSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  // Load questions to grade
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Grade and create answers
  let correctCount = 0;
  const answerRecords = [];

  for (const qId of questionIds) {
    const q = questionMap.get(qId);
    if (!q) continue;
    const userAnswer = answers[qId];
    if (!userAnswer) continue;
    const isCorrect = userAnswer.chosen === q.answer;
    if (isCorrect) correctCount++;

    answerRecords.push({
      sessionId,
      questionId: qId,
      chosen: userAnswer.chosen,
      isCorrect,
      timeSpentMs: userAnswer.timeSpentMs ?? 0,
    });
  }

  await prisma.answer.createMany({ data: answerRecords });

  // Estimate score
  const accuracy = correctCount / questionIds.length;
  const estimatedScore = Math.round(accuracy * 990 / 5) * 5;

  // Update session
  await prisma.testSession.update({
    where: { id: sessionId },
    data: {
      finishedAt: new Date(),
      correctCount,
      score: estimatedScore,
      resumeState: null,
    },
  });

  // Update user's currentScore if better
  await prisma.user.update({
    where: { id: session.user.id },
    data: { currentScore: { set: Math.max(estimatedScore) } },
  });

  // Record study streak
  const today = new Date().toISOString().split('T')[0];
  await prisma.studyStreak.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    create: { userId: session.user.id, date: today, minutesStudied: 15 },
    update: { minutesStudied: { increment: 5 } },
  });

  // Return questions with correct answers and explanations for review
  const reviewData = questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    choices: JSON.parse(q.choices),
    answer: q.answer,
    explanationTh: q.explanationTh,
    userChosen: answers[q.id]?.chosen ?? -1,
    isCorrect: answers[q.id]?.chosen === q.answer,
  }));

  return NextResponse.json({
    correctCount,
    total: questionIds.length,
    estimatedScore,
    reviewData,
  });
}
