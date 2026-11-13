import Link from "next/link";
import type { Metadata } from "next";
import { getEntries } from "@/lib/db";
import { CATEGORIES } from "@/lib/tools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";
import ToolsIndex from "@/components/ToolsIndex";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All AI tools for beginners",
  description: "Browse every AI tool on AI Starter Kit — filter by task or by free plan, and see whether the free plan is enough before you start.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage() {
  const entries = await getEntries();
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "All tools", url: `${SITE_URL}/tools` },
  ];
  return (
    <div>
      <JsonLd data={itemListJsonLd(entries.map((e) => ({ name: e.name, url: `${SITE_URL}/tools/${e.slug}` })))} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <p className="crumbs"><Link href="/">Home</Link> / All tools</p>
      <div className="prose">
        <h1>All tools</h1>
        <p className="muted" style={{ fontSize: 19 }}>
          Every tool on the site, in one place. Pick a task, or show only the tools whose free plan is enough to start.
        </p>
      </div>
      <ToolsIndex tools={entries} categories={CATEGORIES} />
    </div>
  );
}
