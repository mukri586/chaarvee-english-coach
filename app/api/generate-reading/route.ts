import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

function normalizeQuestions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((q) => {
      if (typeof q === 'string') return q.trim();
      if (q && typeof q === 'object') {
        const item = q as Record<string, unknown>;
        return String(item.question ?? item.prompt ?? item.text ?? '').trim();
      }
      return '';
    })
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeReading(data: Record<string, unknown>) {
  const body = String(data.body ?? data.passage ?? data.article ?? data.text ?? '').trim();
  const questions = normalizeQuestions(data.questions);
  const title = String(data.title ?? 'Fresh Reading Challenge').trim();
  const topic = String(data.topic ?? 'General').trim();
  const minutes = Number(data.minutes ?? data.estimated_reading_minutes ?? 8) || 8;
  const writingChallenge = String(
    data.writingChallenge ?? data.writing_challenge ?? ''
  ).trim();

  if (!body || questions.length < 4 || !writingChallenge) {
    throw new Error('The AI returned an incomplete reading exercise. Please try again.');
  }

  return { title, topic, minutes, body, questions, writingChallenge };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      level = 'Grade 8',
      topic = 'Random',
      type = 'Informational article',
      length = 'medium',
      focus = 'balanced',
    } = body ?? {};

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI is not configured. Add OPENAI_API_KEY in Vercel.' },
        { status: 503 }
      );
    }

    const system = `You create original English reading practice for an independent Grade 8 student in Ontario, Canada. The learner is about 13 years old and preparing for Grade 9 academic/AP/IB-style work.
Generate ORIGINAL text only; do not reproduce or closely imitate copyrighted articles.
Keep all content strictly age-appropriate and school-safe. Exclude sexual content, graphic violence, self-harm, suicide, drugs, profanity, pornography, horror/gore, extremist propaganda, partisan political persuasion, and mature relationship content.
Prefer science, technology, environment, history, geography, arts, music, sports, inventions, community, culture, learning, nature, ethics, and everyday decisions.
Use clear but intellectually challenging English.
Return a JSON object with EXACTLY these keys:
title (string), topic (string), minutes (number), body (string), questions (array of exactly 6 strings), writingChallenge (string).
Do not put objects inside questions. Do not include answers.`;

    const user = `Create one fresh reading exercise.
Level: ${String(level)}
Topic: ${String(topic)}
Type: ${String(type)}
Length: ${String(length)}
Skill focus: ${String(focus)}

The passage should be appropriate for a strong Grade 8 student and slightly stretch her reading ability when the selected level is Grade 8+ or higher.
Include exactly 6 questions: 2 comprehension, 2 inference, 1 vocabulary-in-context, and 1 evidence/reasoning question.
Include one 300–450 word writing challenge that requires evidence from the passage.
Do not include the answers.`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('The AI returned an empty response. Please try again.');

    const result = normalizeReading(JSON.parse(content));
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not generate reading.';
    console.error('generate-reading failed:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
