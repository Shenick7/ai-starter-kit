import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/tools";
import { getEntries } from "@/lib/db";
import ToolCard from "@/components/ToolCard";

export const revalidate = 300;
export function generateStaticParams() { return CATEGORIES.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `Best AI tools to ${c.label.toLowerCase()} for beginners`, description: `${c.blurb} Beginner-friendly AI tools, how to start, and whether the free plan is enough.`, alternates: { canonical: `/category/${c.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) notFound();
  const list = (await getEntries()).filter((e) => e.categories.includes(slug)).sort((a, b) => Number(!!b.pick && b.categories[0] === slug) - Number(!!a.pick && a.categories[0] === slug));
  return (
    <>
      <p className="crumbs"><Link href="/">Home</Link> / {c.label}</p>
      <div className="prose"><h1>{c.emoji} AI tools to {c.label.toLowerCase()}</h1><p className="muted">{c.blurb} Start with the first one: it's our top beginner pick.</p></div>
      <div className="grid">{list.map((t) => <ToolCard key={t.slug} t={t} />)}</div>
      <p className="muted" style={{ marginTop: 20 }}>Missing a tool? <Link href="/submit">Submit it for review</Link>.</p>
    </>
  );
}
