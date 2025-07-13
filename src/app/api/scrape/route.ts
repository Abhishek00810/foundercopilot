import { NextResponse } from 'next/server';
import { getFounderFromSerpAPI } from '@/app/lib/scraper';
import { scraper_dev } from '@/app/lib/scraper_dev';

export async function POST(req: Request) {
  try {
    const company = 'Notion';
    if (!company) {
      return NextResponse.json({ error: 'Missing company' }, { status: 400 });
    }

  //  const founder_data = await getFounderFromSerpAPI(company);
  const founder_data = await scraper_dev();
    console.log(founder_data);

    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant tasked with identifying the most relevant founder to contact for a cold outreach email.

The user is seeking a remote job and wants to reach out to the most appropriate founder or CEO of a company.

You will be given multiple scraped results, some from LinkedIn, company websites, Crunchbase, or blogs. These may include noise, outdated links, or unrelated entries.

🎯 Your responsibilities:
- Pick the **most relevant and official founder** from the data.
- Only use results that match the company name.
- Strongly prefer trustworthy sources like **linkedin.com**, **company.com**, or **crunchbase.com**.
- If there are multiple founders, pick the one with the highest title: CEO > CTO > others.
- Discard any low-confidence or mismatched entries.
- If none are reliable, say: "No reliable founder match found from this data."
- I don't want any other comments, just JSON

Return a single JSON like this:
{
  "name": "Full Name",
  "title": "Title",
  "link": "Official Profile URL",
  "source": "Domain (e.g. linkedin.com)",
  "twitter_or_linkedin": "Wherever they are more active",
  "confidence_reasoning": "Explain why this was the most suitable result."
}`
      },
      {
        role: 'user',
        content: `This is the data that i have: ${JSON.stringify(founder_data)}`
      }
    ];

    const llmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'yourdomain.com',
        'X-Title': 'FounderCopilot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages,
      }),
    });

    const json = await llmResponse.json();
    const answer = json?.choices?.[0]?.message?.content;

    let parsed: any = null;
    try {
      const cleaned = (answer || '')
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      parsed = { raw: answer };
    }

    console.log('🔍 Parsed Founder:', parsed);

    // ✅ This was missing
    return NextResponse.json({
      company,
      founder_data,
      best_pick: parsed,
    });

  } catch (err: any) {
    console.error('❌ Error in /api/scrape:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
