import OpenAI from 'openai';
import {NextResponse} from 'next/server';
export async function POST(req: Request) {
  try {
    const {level='Grade 8', type='Argumentative', topic='Random', focus='balanced', history=[]} = await req.json();
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({error:'AI is not configured. Add OPENAI_API_KEY in Vercel.'},{status:503});
    const system = `You are a curriculum designer for a Grade 8 English writing coach in Ontario, Canada. Create ORIGINAL writing assignments for an independent 13-year-old student preparing for Grade 9 academic/AP/IB-style writing. Keep prompts strictly age-appropriate and school-safe. Exclude sexual content, graphic violence, self-harm, suicide, drugs, profanity, pornography, horror/gore, extremist propaganda, partisan political persuasion, and mature relationship themes. Prefer school, science, technology, environment, history, arts, music, community, culture, sports, inventions, ethics, and everyday decisions. Do not write a model answer. Return JSON only.`;
    const user = `Generate one fresh ${type} writing prompt. Level: ${level}. Topic: ${topic}. Target skill: ${focus}. Recent performance data: ${JSON.stringify(history.slice(0,8))}. The prompt should be specific, interesting, and answerable from general knowledge without research unless explicitly labeled research. Include title, type, level, target word count (250-550), instruction, success criteria (4 bullets), and a self-check question.`;
    const r = await new OpenAI({apiKey:process.env.OPENAI_API_KEY}).chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-5-mini',response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:user}]});
    return NextResponse.json(JSON.parse(r.choices[0].message.content||'{}'));
  } catch (e:any) { return NextResponse.json({error:e?.message||'Could not generate writing prompt.'},{status:500}); }
}
