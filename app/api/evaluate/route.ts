import OpenAI from 'openai';
import {NextResponse} from 'next/server';
const rubric=['Ideas & Content','Argument & Reasoning','Evidence & Examples','Organization','Introduction & Conclusion','Vocabulary','Sentence Structure','Grammar & Mechanics'];
export async function POST(req:Request){
  const body=await req.json(); const {mode,passage,prompt,response,revision,priorEvaluation}=body;
  if(!response||response.trim().length<20)return NextResponse.json({error:'Please submit a fuller response.'},{status:400});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'AI is not configured. Add OPENAI_API_KEY in Vercel environment variables.'},{status:503});
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const system=`You are a rigorous but encouraging English writing coach for a Grade 8 student in Ontario, Canada. The student is an independent learner preparing for Grade 9 academic/AP/IB-style work. Never rewrite the student's work. Do not judge intelligence. Use age-appropriate language. Give specific, actionable coaching. Content must remain school-appropriate. Evaluate with these 8 categories, each 0-5: ${rubric.join(', ')}. For a reading response, also assess comprehension and evidence use. If this is a revision, compare it with the prior evaluation and identify measurable improvement. Return JSON only with keys: total, scores (object with the 8 categories), strengths (array of 2-3 strings), priorities (array of exactly 3 strings), grammar_examples (array of objects with original, issue, hint), revision_goal, coach_message, next_level. Do not provide replacement sentences unless the student explicitly asks for a model after revision.`;
  const user=`Mode: ${mode}\nPrompt: ${prompt||''}\nPassage: ${passage||''}\nStudent response: ${response}\nRevision: ${revision?'yes':'no'}\nPrior evaluation: ${JSON.stringify(priorEvaluation||null)}`;
  const r=await client.chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-5-mini',response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:user}]});
  return NextResponse.json(JSON.parse(r.choices[0].message.content||'{}'));
}
