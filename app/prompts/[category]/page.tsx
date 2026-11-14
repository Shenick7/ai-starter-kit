import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROMPT_CATEGORIES, getPromptCategory, promptsByCategory } from "@/lib/prompts";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";
import PromptCard from "@/components/PromptCard";

export function generateStaticParams() {
  return PROMPT_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = getPromptCategory(category);
  return c
    ? {
        title: `25 ${c.label} prompts that work in any AI`,
        description: `25 original ${c.label.toLowerCase()} prompts for beginners. ${c.blurb} Copy one and paste it into ChatGPT, Claude, Gemini or any AI tool. Free, no sign-up.`,
        alternates: { canonical: `/prompts/${c.slug}` },
        openGraph: { title: `25 ${c.label} prompts`, description: c.blurb },
      }
    : {};
}

const CATEGORY_NOTES: Record<string, string> = {
  legal: "These are starting drafts for everyday letters and documents, not legal advice. For anything important, check with a lawyer.",
  health: "These prompts give general information only, not medical advice. Always check with a doctor for health decisions.",
};

export default async function PromptCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getPromptCategory(category);
  if (!c) notFound();
  const prompts = promptsByCategory(c.slug);
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Prompts", url: `${SITE_URL}/prompts` },
    { name: c.label, url: `${SITE_URL}/prompts/${c.slug}` },
  ];
  return (
    <div>
      <JsonLd data={itemListJsonLd(prompts.map((p) => ({ name: p.title, url: `${SITE_URL}/prompts/${c.slug}` })))} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <p className="crumbs"><Link href="/">Home</Link> / <Link href="/prompts">Prompts</Link> / {c.label}</p>
      <div className="prose">
        <h1>{c.emoji} {c.label} prompts</h1>
        <p className="muted" style={{ fontSize: 19 }}>{c.blurb}</p>
        <p>
          These prompts work in any AI — ChatGPT, Claude, Gemini and others. Copy one, paste it into your favourite AI tool, and replace the [bracketed] parts with your own details.
        </p>
        {CATEGORY_NOTES[c.slug] && <p className="note ok">{CATEGORY_NOTES[c.slug]}</p>}
      </div>
      <div className="grid">
        {prompts.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
      <div className="prose">
        <h2>More prompts</h2>
        <p>
          <Link href="/prompts">Browse all 12 categories →</Link> · <Link href="/prompts/generator">Make your own prompt →</Link>
        </p>
      </div>
    </div>
  );
}
