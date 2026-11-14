import Link from "next/link";
import type { Metadata } from "next";
import { PROMPTS, PROMPT_CATEGORIES, promptsByCategory } from "@/lib/prompts";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";
import PromptsSearch from "@/components/PromptsSearch";

export const metadata: Metadata = {
  title: "300 copy-ready AI prompts for beginners",
  description: "300 original prompts in 12 categories — Art, Business, Design, Finance, HR, Health, Learning, Legal, Marketing, SEO, Social Media and Writing. Copy one, paste it into any AI tool, and get a useful answer. Free, no sign-up.",
  alternates: { canonical: "/prompts" },
};

export default function PromptsPage() {
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Prompts", url: `${SITE_URL}/prompts` },
  ];
  return (
    <div>
      <JsonLd data={itemListJsonLd(PROMPT_CATEGORIES.map((c) => ({ name: `${c.label} prompts`, url: `${SITE_URL}/prompts/${c.slug}` })))} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <p className="crumbs"><Link href="/">Home</Link> / Prompts</p>
      <div className="prose">
        <h1>300 prompts that work in any AI</h1>
        <p className="muted" style={{ fontSize: 19 }}>
          Copy a prompt, paste it into ChatGPT, Claude, Gemini or any other AI tool, and replace the [bracketed] parts with your own details. No sign-up, no payment — just useful words.
        </p>
      </div>
      <PromptsSearch prompts={PROMPTS} />
      <h2 className="sec">Browse by category</h2>
      <div className="grid">
        {PROMPT_CATEGORIES.map((c) => (
          <article key={c.slug} className="card">
            <h3><Link href={`/prompts/${c.slug}`}>{c.emoji} {c.label}</Link></h3>
            <p>{c.blurb}</p>
            <small className="muted">{promptsByCategory(c.slug).length} prompts →</small>
          </article>
        ))}
        <article className="card featured">
          <h3><Link href="/prompts/generator">Make your own prompt →</Link></h3>
          <p>Pick a role and say what you want. The generator builds a ready-to-copy prompt for you — free, no sign-up.</p>
        </article>
      </div>
      <div className="prose">
        <h2>How to use these prompts</h2>
        <ul>
          <li><b>Copy</b> a prompt with the button under it.</li>
          <li><b>Paste</b> it into your favourite AI tool.</li>
          <li><b>Replace</b> anything in [square brackets] with your own details.</li>
          <li><b>Ask a follow-up</b> if the first answer is not quite right — “make it shorter”, “use Indian examples”, “explain it simply”.</li>
        </ul>
        <p>New to AI? Start with our <Link href="/learn">5-minute beginner guides</Link> first.</p>
      </div>
    </div>
  );
}
