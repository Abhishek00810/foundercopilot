import { mock } from "node:test";

type FounderInfo = {
    name: string;
    source: string;
    confidence: number;
    snippet?: string;
    link?: string;
  };
  
  export function scraper_dev(): any {
    const mockData: Record<string, FounderInfo[]> = {
      Notion: [
        {
          name: "Ivan Zhao",
          source: "serpapi_snippet",
          confidence: 0.9,
          snippet: "Ivan Zhao is the co-founder and CEO of Notion, a productivity platform...",
          link: "https://www.notion.so",
        },
      ],
    };
  
    return mockData
  }
  