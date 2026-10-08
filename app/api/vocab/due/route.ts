import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cards = await prisma.vocabCard.findMany({
    where: {
      userId: session.user.id,
      nextReviewAt: { lte: new Date() },
    },
    orderBy: { nextReviewAt: 'asc' },
    take: 30,
  });

  return NextResponse.json({ cards, count: cards.length });
}
