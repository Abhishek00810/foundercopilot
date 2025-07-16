import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, founder } = body;
    console.log({company, founder})
    const messages = [
      {
        role: 'system',
        content: `You are a cold email expert helping a startup founder write a short and effective cold email to another founder or investor.
    
    Your job is to generate a concise, clear, and authentic email based on the target founder and their company. Avoid fluff and don’t sound like a sales email.
    
    Instead, write like a thoughtful founder or builder who respects the target's work and is reaching out with a genuine interest or insight.
    
    Guidelines:
    - Keep it under 120 words.
    - Be specific and real — avoid vague praise.
    - Include 1 sentence showing you understand their work.
    - Offer a brief idea, value insight, or suggestion.
    - End with a soft CTA like “open to a quick chat?” or “would love to hear your thoughts.”
    
    Return the email only — no formatting, no markdown, no JSON.
    `
      },
      {
        role: 'user',
        content: `Founder: ${founder}\nCompany: ${company}`
      }
    ];
    

    const llmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'yourdomain.com', // <-- update to your real domain
        'X-Title': 'FounderCopilot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages,
      }),
    });

    const data = await llmResponse.json();
    console.log(data.choices[0].message.content)
    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error('❌ Error in /api/coldmail:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
