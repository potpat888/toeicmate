import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateNextReview } from '@/lib/srs';
import { z } from 'zod';

const schema = z.object({
  cardId: z.string(),
  quality: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { cardId, quality } = parsed.data;

  const card = await prisma.vocabCard.findFirst({
    where: { id: cardId, userId: session.user.id },
  });
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  const result = calculateNextReview(
    { interval: card.interval, easeFactor: card.easeFactor, repetitions: card.repetitions },
    quality
  );

  const updated = await prisma.vocabCard.update({
    where: { id: cardId },
    data: {
      interval: result.interval,
      easeFactor: result.easeFactor,
      repetitions: result.repetitions,
      nextReviewAt: result.nextReviewAt,
    },
  });

  // Record study streak
  const today = new Date().toISOString().split('T')[0];
  await prisma.studyStreak.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    create: { userId: session.user.id, date: today, minutesStudied: 5 },
    update: { minutesStudied: { increment: 1 } },
  });

  return NextResponse.json({ updated, nextReviewAt: result.nextReviewAt });
}
