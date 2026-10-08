import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET: Load session + questions
export async function GET(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await params;
  const testSession = await prisma.testSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    include: { answers: { include: { question: true } } },
  });

  if (!testSession) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(testSession);
}

// PATCH: Save progress (resume state)
export async function PATCH(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await params;
  const body = await req.json();
  const schema = z.object({
    currentIndex: z.number(),
    answers: z.record(z.number()),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const updated = await prisma.testSession.updateMany({
    where: { id: sessionId, userId: session.user.id, finishedAt: null },
    data: { resumeState: JSON.stringify(parsed.data) },
  });

  if (updated.count === 0) return NextResponse.json({ error: 'Not found or already finished' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
