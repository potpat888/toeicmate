import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

const schema = z.object({
  prompt: z.string(),
  userEmail: z.string().max(2000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { prompt, userEmail } = parsed.data;

  try {
    const interaction = await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: `You are an expert business English writing coach for Thai learners.

The writing task was: "${prompt}"

The learner wrote:
---
${userEmail}
---

Provide feedback in this EXACT JSON format:
{
  "overallScoreTh": "overall comment in Thai (2-3 sentences)",
  "issues": [
    { "type": "grammar|tone|vocabulary|structure", "original": "exact phrase from email", "issue": "explanation in Thai", "suggestion": "better English alternative" }
  ],
  "improvedVersion": "full improved email in English",
  "strengthsTh": "what the learner did well, in Thai"
}

Limit to max 4 issues. Be encouraging. Focus on the most impactful changes.`,
      store: false,
    });

    const text = interaction.output_text ?? '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Could not parse feedback' };

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
