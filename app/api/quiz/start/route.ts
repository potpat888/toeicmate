import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  part: z.number().min(1).max(7).optional(),
  topic: z.string().optional(),
  type: z.enum(['PART_PRACTICE', 'FULL_MOCK', 'GRAMMAR_DRILL']),
  count: z.number().min(5).max(200).default(10),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid params' }, { status: 400 });

  const { part, topic, type, count } = parsed.data;

  const where: Record<string, unknown> = {};
  if (part) where.part = part;
  if (topic) where.topic = topic;

  const questions = await prisma.question.findMany({
    where,
    take: count,
    orderBy: { id: 'asc' },
    select: { id: true, part: true, topic: true, difficulty: true, questionText: true, choices: true, passage: true, imageUrl: true, audioUrl: true },
  });

  if (questions.length === 0) {
    return NextResponse.json({ error: 'ไม่พบข้อสอบในหมวดนี้' }, { status: 404 });
  }

  // Shuffle
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, count);

  const testSession = await prisma.testSession.create({
    data: {
      userId: session.user.id,
      type,
      part: part ?? null,
      topic: topic ?? null,
      totalQuestions: shuffled.length,
      resumeState: JSON.stringify({ currentIndex: 0, answers: {} }),
    },
  });

  return NextResponse.json({
    sessionId: testSession.id,
    questions: shuffled,
  });
}
