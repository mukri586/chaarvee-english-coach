import OpenAI from 'openai';
import {NextResponse} from 'next/server';
export async function POST(req: Request) {
  try {
    const {level='Grade 8', topic='Random', type='Informational article', length='medium', focus='balanced'} = await req.json();
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({error:'AI is not configured. Add OPENAI_API_KEY in Vercel.'},{status:503});
    const system = `You create original English reading practice for an independent Grade 8 student in Ontario, Canada. The learner is about 13 years old and preparing for Grade 9 academic/AP/IB-style work. Generate ORIGINAL text only; do not reproduce or closely imitate copyrighted articles. Keep all content strictly age-appropriate and school-safe. Exclude sexual content, graphic violence, self-harm, suicide, drugs, profanity, pornography, horror/gore, extremist propaganda, partisan political persuasion, and mature relationship content. Prefer science, technology, environment, history, geography, arts, music, sports, inventions, community, culture, learning, nature, ethics, and everyday decisions. Use clear but intellectually challenging English. Return JSON only.`;
    const user = `Create one fresh reading exercise. Level: ${level}. Topic: ${topic}. Type: ${type}. Length: ${length}. Skill focus: ${focus}. Include a title, topic, estimated reading time, an original passage, 6 questions (2 comprehension, 2 inference, 1 vocabulary-in-context, 1 evidence/reasoning), and one 300-450 word writing challenge requiring evidence from the passage. Do not include answers.`;
    const r = await new OpenAI({apiKey:process.env.OPENAI_API_KEY}).chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-5-mini',response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:user}]});
    return NextResponse.json(JSON.parse(r.choices[0].message.content||'{}'));
  } catch (e:any) { return NextResponse.json({error:e?.message||'Could not generate reading.'},{status:500}); }
}
