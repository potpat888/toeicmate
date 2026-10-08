import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

const schema = z.object({
  scenario: z.string(),
  message: z.string().max(500),
  previousInteractionId: z.string().optional(),
  requestFeedback: z.boolean().optional(),
});

const SCENARIOS: Record<string, string> = {
  job_interview: 'a job interview for a marketing manager position',
  client_meeting: 'a business meeting with a new client',
  team_briefing: 'a team briefing about a quarterly report',
  phone_inquiry: 'a phone call to inquire about an order status',
  performance_review: 'a performance review discussion with your manager',
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { scenario, message, previousInteractionId, requestFeedback } = parsed.data;
  const scenarioDesc = SCENARIOS[scenario] ?? scenario;

  try {
    if (requestFeedback) {
      // Ask for grammar/naturalness feedback
      const interaction = await client.interactions.create({
        model: 'gemini-3.8-flash',
        input: `You just had a roleplay conversation about: ${scenarioDesc}.

The learner's last message was: "${message}"

Provide feedback in this JSON format:
{
  "grammarScore": 1-5,
  "naturalScore": 1-5,
  "grammarIssues": ["issue 1", "issue 2"],
  "betterAlternatives": ["alternative phrase 1"],
  "overallFeedbackTh": "overall feedback in Thai"
}

Be encouraging and constructive. Focus on the most important 1-2 issues only.`,
        store: false,
      });
      const text = interaction.output_text ?? '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      return NextResponse.json({ feedback });
    }

    const systemInstruction = `You are an English conversation partner helping a Thai office worker practice business English. 
You are roleplaying as: ${scenarioDesc}.
Keep responses concise (2-4 sentences). Be professional and realistic.
If the learner makes a small grammar error, gently continue without correcting (corrections come in feedback phase).
Respond ONLY in English.`;

    const interactionConfig: any = {
      model: 'gemini-3.8-flash',
      input: message,
      system_instruction: systemInstruction,
      store: false,
    };
    if (previousInteractionId) {
      interactionConfig.previous_interaction_id = previousInteractionId;
    }

    const interaction = await client.interactions.create(interactionConfig);

    return NextResponse.json({
      reply: interaction.output_text,
      interactionId: interaction.id,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
