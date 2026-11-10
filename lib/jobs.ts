import { CATEGORIES, TOOLS } from "./tools";

// Everyday jobs a beginner would say, each pointing at a tool already in lib/tools.ts.
export type Job = {
  phrase: string;
  tool: string;
  keywords: string[];
};

export const JOBS: Job[] = [
  { phrase: "Write a polite email to my boss", tool: "chatgpt", keywords: ["email", "boss", "write"] },
  { phrase: "Make my resume look better", tool: "claude", keywords: ["resume", "cv", "rewrite"] },
  { phrase: "Fix my grammar", tool: "grammarly", keywords: ["grammar", "spelling", "proofread"] },
  { phrase: "Summarize a long PDF", tool: "gemini-notebook", keywords: ["pdf", "summarize", "summarise", "summary"] },
  { phrase: "Turn my notes into slides", tool: "gamma", keywords: ["slides", "presentation", "powerpoint", "notes"] },
  { phrase: "Turn a paragraph into a diagram", tool: "napkin", keywords: ["diagram", "flowchart", "infographic"] },
  { phrase: "Make a short video for Instagram", tool: "capcut", keywords: ["instagram", "reel", "reels", "short video"] },
  { phrase: "Explain a topic for my exam", tool: "perplexity", keywords: ["exam", "explain", "study", "homework"] },
  { phrase: "Plan a trip", tool: "copilot", keywords: ["trip", "travel", "itinerary"] },
  { phrase: "Turn a voice note into a to-do list", tool: "otter", keywords: ["voice note", "transcribe", "to-do", "todo", "action items"] },
  { phrase: "Make a logo", tool: "ideogram", keywords: ["logo"] },
  { phrase: "Make a song", tool: "suno", keywords: ["song", "music", "lyrics"] },
];

const KNOWN = new Set(TOOLS.map((t) => t.slug));
for (const job of JOBS) {
  if (!KNOWN.has(job.tool)) throw new Error(`Job links to unknown tool: ${job.tool}`);
}

export function toolName(slug: string) {
  return TOOLS.find((t) => t.slug === slug)?.name || slug;
}

function fold(s: string) {
  return s.toLowerCase().replace(/summaris(e|ed|ing)/g, "summariz$1");
}

function jobText(slug: string) {
  return JOBS.filter((j) => j.tool === slug).map((j) => `${j.phrase} ${j.keywords.join(" ")}`).join(" ");
}

function haystack(e: { slug: string; name: string; tagline: string; what: string; categories: readonly string[] }) {
  const cats = e.categories.map((c) => {
    const cat = CATEGORIES.find((x) => x.slug === c);
    return cat ? `${cat.label} ${cat.blurb}` : c;
  }).join(" ");
  return fold(`${e.name} ${e.tagline} ${e.what} ${cats} ${jobText(e.slug)}`);
}

export function searchEntries<T extends { slug: string; name: string; tagline: string; what: string; categories: readonly string[] }>(entries: T[], q: string): T[] {
  const terms = fold(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return entries
    .map((e, i) => {
      const hay = haystack(e);
      if (!terms.every((t) => hay.includes(t))) return null;
      const jobs = fold(jobText(e.slug));
      const jobHit = Boolean(jobs) && terms.every((t) => jobs.includes(t));
      return { e, i, s: jobHit ? 2 : 1 };
    })
    .filter((x): x is { e: T; i: number; s: number } => x !== null)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.e);
}
