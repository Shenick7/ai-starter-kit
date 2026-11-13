// Comparison pages. Each comparison reuses the tool data in lib/tools.ts —
// nothing is claimed here that the tool pages don't already say.
import type { Faq } from "./faq";

export type Comparison = {
  slug: string;
  title: string;
  tools: string[]; // tool slugs, in display order
  intro: string;
  bottomLine: string;
  faqs: Faq[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "chatgpt-vs-gemini-vs-claude",
    title: "ChatGPT vs Gemini vs Claude",
    tools: ["chatgpt", "gemini", "claude"],
    intro: "The three AI chat assistants most beginners meet first. All three answer questions, draft emails and explain things in plain language — and all three have a free plan. The differences are small, but they matter once you use one every day.",
    bottomLine: "For most beginners, ChatGPT is the easiest first choice: the free version covers everyday writing and questions, and it works on the web and on your phone, including by voice. Pick Gemini if you already live in Google apps — it is free with any Google account and adds Deep Research and image generation. Pick Claude if you work with long documents: it is the most careful writer of the three, and its free plan is generous for daily use.",
    faqs: [
      { q: "Which is best for beginners: ChatGPT, Gemini or Claude?", a: "ChatGPT, for most people. Its free version covers everyday writing and questions, it works on the web and on your phone, and it is the one your friends and colleagues are most likely already using. Gemini is the best pick if you live in Gmail and Google Docs; Claude is the best pick for long documents." },
      { q: "Are ChatGPT, Gemini and Claude free?", a: "Yes, all three have free plans. ChatGPT's free version is available to everyone; Gemini is free with any Google account; Claude's free plan has limited usage every 5 hours and every week. Paid plans only add more usage and newer models." },
      { q: "Can I use more than one?", a: "Yes — and many beginners do. They are all free to try, so pick one as your daily tool and keep a second one for the jobs it does better: Gemini for research with sources, Claude for long documents." },
    ],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug);
}
