import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/tools";
import { getEntries, getEntry } from "@/lib/db";
import { VerdictPill } from "@/components/ToolCard";
import ToolCard from "@/components/ToolCard";

export const revalidate = 300;
export async function generateStaticParams() { return (await getEntries()).map((e) => ({ slug: e.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getEntry((await params).slug);
  if (!t) return {};
  return { title: `${t.name}: what it is, how to start, is it free?`, description: `${t.tagline} How to start in 5 minutes and whether ${t.name}'s free plan is enough.`, alternates: { canonical: `/tools/${t.slug}` } };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getEntry(slug);
  if (!t) notFound();
  const cat = CATEGORIES.find((c) => c.slug === t.categories[0]);
  const related = (await getEntries()).filter((e) => e.slug !== t.slug && e.categories.includes(t.categories[0])).slice(0, 3);
  return (
    <div className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / {cat && <Link href={`/category/${cat.slug}`}>{cat.label}</Link>}</p>
      <h1>{t.name}</h1>
      <p className="muted" style={{ fontSize: 19 }}>{t.tagline}</p>
      <div className="row"><VerdictPill v={t.verdict} /><a className="btn" href={`/go/${t.slug}`} rel="noopener">Open {t.name} ↗</a></div>
      <h2>What it is</h2><p>{t.what}</p>
      <h2>How to start in 5 minutes</h2><ol>{t.start.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <h2>Is the free plan enough?</h2>
      <div className="box"><p><b>{t.verdictNote}</b></p><p>{t.freePlan}</p>
        <p className="muted" style={{ fontSize: 14 }}>Source: <a href={t.sourceUrl} rel="nofollow noopener" target="_blank">{t.name}'s own pricing page</a>, checked Nov 2026. Plans change; confirm before you pay.</p></div>
      {related.length > 0 && <><h2>Similar tools</h2><div className="grid">{related.map((r) => <ToolCard key={r.slug} t={r} />)}</div></>}
    </div>
  );
}
