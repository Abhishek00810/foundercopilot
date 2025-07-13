// lib/scraper/getFounderFromSerpAPI.ts
import axios from "axios";

type FounderInfo = {
  name: string;
  source: string;
  confidence: number;
  snippet?: string;
  link?: string;
};

const SERPAPI_KEY = process.env.SERPAPI_KEY!;

export async function getFounderFromSerpAPI(company: string): Promise<FounderInfo[]> {
    console.log("scrapoing started")
  try {
    const query = `"${company} founder" OR "${company} CEO"`;
    const serpApiUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;

    const response = await axios.get(serpApiUrl);
    const results = response.data.organic_results || [];

    const founders: FounderInfo[] = [];

    for (const result of results.slice(0, 5)) {
      const snippet = result.snippet || '';
      const link = result.link;

      // Try to extract a proper name from snippet using regex (basic)
      const nameMatch = snippet.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);

      if (nameMatch) {
        founders.push({
          name: nameMatch[1],
          source: 'serpapi_snippet',
          confidence: 0.7,
          snippet,
          link,
        });
      }
    }

    return founders;
  } catch (error) {
    console.error("Error fetching founder info:", error);
    return [];
  }
}
