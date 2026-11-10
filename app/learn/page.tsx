import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = { title: "Learn AI: short beginner guides", description: "Short, plain-English guides to understand AI and start using it today.", alternates: { canonical: "/learn" } };

export default function Learn() {
  return (
    <>
      <div className="prose"><h1>Learn AI, the simple way</h1><p className="muted">Short guides for complete beginners. No jargon, no coding.</p></div>
      <div className="grid">{GUIDES.map((g) => <article key={g.slug} className="card"><h3><Link href={`/learn/${g.slug}`}>{g.title}</Link></h3><p>{g.description}</p><small className="muted">{g.minutes} min read</small></article>)}</div>
    </>
  );
}
