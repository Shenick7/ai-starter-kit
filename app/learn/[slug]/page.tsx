import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES } from "@/lib/guides";
import { SignupForm } from "@/components/Forms";
import JsonLd from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";

export function generateStaticParams() { return GUIDES.map((g) => ({ slug: g.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  return g ? { title: g.title, description: g.description, alternates: { canonical: `/learn/${g.slug}` }, openGraph: { type: "article", title: g.title, description: g.description } } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();
  return (
    <article className="prose">
      <JsonLd data={articleJsonLd(g)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: SITE_URL }, { name: "Learn", url: `${SITE_URL}/learn` }, { name: g.title, url: `${SITE_URL}/learn/${g.slug}` }])} />
      <p className="crumbs"><Link href="/">Home</Link> / <Link href="/learn">Learn</Link></p>
      <h1>{g.title}</h1><p className="muted">{g.minutes} min read</p>
      {g.body.map((b, i) => b.h ? <h2 key={i}>{b.h}</h2> : b.list ? <ul key={i}>{b.list.map((l, j) => <li key={j}>{l}</li>)}</ul> : <p key={i}>{b.p}</p>)}
      <p><Link href="/">Find the right AI tool for your task →</Link></p>
      <section className="signup"><h2>Get one AI trick a week</h2><p>5 minutes, every week. Free.</p><SignupForm source={`guide:${g.slug}`} /></section>
    </article>
  );
}
