import Link from "next/link";
import type { Metadata } from "next";
import { COMPARISONS } from "@/lib/compare";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";

export const metadata: Metadata = {
  title: "Compare AI tools for beginners",
  description: "Side-by-side comparisons of the AI tools beginners ask about most — free plans, what each is best for, and which one to start with.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndex() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: SITE_URL }, { name: "Compare", url: `${SITE_URL}/compare` }])} />
      <div className="prose">
        <p className="crumbs"><Link href="/">Home</Link> / Compare</p>
        <h1>Compare AI tools</h1>
        <p className="muted">Side-by-side comparisons of the tools beginners ask about most. Every fact here comes from the tool's own page — free plans, what each is best for, and how to start in 5 minutes.</p>
      </div>
      <div className="grid" style={{ marginTop: 18 }}>
        {COMPARISONS.map((c) => (
          <article className="card" key={c.slug}>
            <h3><Link href={`/compare/${c.slug}`}>{c.title}</Link></h3>
            <p>{c.intro}</p>
            <div className="row"><Link href={`/compare/${c.slug}`}>Compare →</Link></div>
          </article>
        ))}
      </div>
    </>
  );
}
