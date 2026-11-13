import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/tools";
import { COMPARISONS, getComparison } from "@/lib/compare";
import { getEntry } from "@/lib/db";
import ToolCard, { VerdictPill } from "@/components/ToolCard";
import FaqBlock from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";

export const revalidate = 300;
export function generateStaticParams() { return COMPARISONS.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparison((await params).slug);
  if (!c) return {};
  return {
    title: `${c.title}: which is best for beginners?`,
    description: `${c.title}, compared side by side: free plans, what each is best for, and which one to start with.`,
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();
  const tools = (await Promise.all(c.tools.map((s) => getEntry(s)))).filter((t): t is NonNullable<typeof t> => Boolean(t));
  if (tools.length === 0) notFound();
  const catOf = (t: (typeof tools)[number]) => CATEGORIES.find((x) => x.slug === t.categories[0]);
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Compare", url: `${SITE_URL}/compare` },
    { name: c.title, url: `${SITE_URL}/compare/${c.slug}` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd(tools.map((t) => ({ name: t.name, url: `${SITE_URL}/tools/${t.slug}` })))} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <p className="crumbs"><Link href="/">Home</Link> / <Link href="/compare">Compare</Link> / {c.title}</p>
      <div className="prose">
        <h1>{c.title}</h1>
        <p className="muted">{c.intro}</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="tbl">
          <thead><tr><th></th>{tools.map((t) => <th key={t.slug}>{t.name}</th>)}</tr></thead>
          <tbody>
            <tr><th>Free plan enough?</th>{tools.map((t) => <td key={t.slug}><VerdictPill v={t.verdict} /><br />{t.verdictNote}</td>)}</tr>
            <tr><th>What the free plan includes</th>{tools.map((t) => <td key={t.slug}>{t.freePlan}</td>)}</tr>
            <tr><th>Best for</th>{tools.map((t) => <td key={t.slug}>{catOf(t)?.label ?? "—"}</td>)}</tr>
            <tr><th>How to start</th>{tools.map((t) => <td key={t.slug}>{t.start[0]}</td>)}</tr>
            <tr><th></th>{tools.map((t) => <td key={t.slug}><a className="btn" href={`/go/${t.slug}`} rel="noopener">Open {t.name} ↗</a></td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className="prose">
        <h2>Our take</h2>
        <p>{c.bottomLine}</p>
      </div>
      <div className="grid">{tools.map((t) => <ToolCard key={t.slug} t={t} />)}</div>
      <div className="prose"><FaqBlock faqs={c.faqs} /></div>
      <p className="muted" style={{ marginTop: 20 }}>Free-plan details change often — each tool page links to the tool's own pricing page, checked Nov 2026.</p>
    </>
  );
}
