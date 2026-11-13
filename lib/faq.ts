// FAQs for tool and category pages. Hand-written answers are only used
// where they restate what the tool's own page (already in lib/tools.ts)
// says; everything else is built from the tool data, so no claim here can
// drift from the tool page itself.
import { CATEGORIES, type Tool } from "./tools";

export type Faq = { q: string; a: string };

// Hand-written FAQs for the most-visited tools. Each answer restates the
// tool's own pricing/help page, as already recorded in lib/tools.ts.
const HANDWRITTEN: Record<string, Faq[]> = {
  chatgpt: [
    { q: "Is ChatGPT free?", a: "Yes. OpenAI says the free version of ChatGPT is available to everyone. Paid plans (Go, Plus, Pro) add more messages, uploads, image creation and newer models — but for everyday writing and questions the free version is plenty." },
    { q: "Do I need the ChatGPT app?", a: "No. ChatGPT works in the browser at chatgpt.com, and there is also an app for your phone, including voice mode so you can talk instead of typing." },
    { q: "Is ChatGPT good for writing emails?", a: "Yes — that is one of its best beginner uses. Type your task in plain words, for example \"Write a polite email asking my landlord to fix the tap\", then reply with changes like \"shorter\" or \"more friendly\" until it fits. Always read the result before you send it." },
  ],
  gemini: [
    { q: "Is Gemini free?", a: "Yes. Gemini is free with any Google account — if you already use Gmail, you already have an account. The free plan includes image generation and editing, Deep Research, Gemini Live, Canvas and Gems, plus 15 GB of Google storage." },
    { q: "What is Gemini Deep Research?", a: "Deep Research is Gemini's way of researching a topic properly: ask it to compare a few options (for example, \"Compare 3 budget phones under ₹20,000\") and it reads many sources and writes you a report." },
    { q: "Does Gemini work with my Gmail and Google Docs?", a: "Yes — that is its biggest advantage. Because it is Google's assistant, it fits naturally with Gmail, Google Docs and Drive, and you sign in with the Google account you already have." },
  ],
  claude: [
    { q: "Is Claude free?", a: "Yes, with limits. The free plan lets you chat on web, desktop and mobile, with limited usage every 5 hours and every week. Web search, file creation, memory, Artifacts and connectors are included. Pro is $20/month billed monthly ($17/month billed annually)." },
    { q: "What is Claude best for?", a: "Long documents and careful writing. Claude is especially good at summarising long articles, rewriting messages so they sound calm and professional, and explaining things clearly." },
    { q: "Can Claude read my PDFs?", a: "Yes. Upload a PDF or paste a long article and ask, for example, \"Summarise this in 5 bullet points\" — then ask follow-up questions about it." },
  ],
};

/** FAQs for a tool page: hand-written where available, otherwise built from the tool's own data. */
export function toolFaqs(t: Tool): Faq[] {
  const hw = HANDWRITTEN[t.slug];
  if (hw) return hw;
  return [
    { q: `Is ${t.name} free?`, a: `${t.verdictNote} ${t.freePlan}` },
    { q: `How do I start with ${t.name}?`, a: t.start[0] },
    { q: `Where can I check ${t.name}'s current pricing?`, a: `On ${t.name}'s own pricing page, linked from this page. Plans change often, so always confirm before you pay.` },
  ];
}

/** FAQs for a category page, built from the category and its tools. */
export function categoryFaqs(slug: string, tools: Tool[]): Faq[] {
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) return [];
  const pick = tools.find((t) => t.pick && t.categories[0] === slug) || tools[0];
  const free = tools.filter((t) => t.verdict === "yes" || t.verdict === "mostly").length;
  return [
    { q: `Which AI tool is best to ${c.label.toLowerCase()} as a beginner?`, a: pick ? `Start with ${pick.name} — ${pick.tagline}` : `Start with the first tool on this page.` },
    { q: "Are these AI tools free?", a: `${free} of the ${tools.length} tools on this page have a free plan that is enough to start with. Every tool page says plainly whether the free plan is enough — look for the green or amber label.` },
    { q: "How do I choose one?", a: "Try the top pick on this page with one real task from your own day. If it does the job, keep it. Only pay when you hit a limit of the free plan — and check the tool's own pricing page before you pay." },
  ];
}
