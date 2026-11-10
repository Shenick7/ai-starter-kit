import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/tools";
import { searchEntries } from "@/lib/jobs";
import { getEntries, hasDb, sql, ready, logError } from "@/lib/db";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = { title: "Search AI tools", description: "Search beginner-friendly AI tools by task or name.", alternates: { canonical: "/search" } };
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q || "").trim().slice(0, 100);
  const entries = await getEntries();
  const results = q ? searchEntries(entries, q) : [];
  if (q && results.length === 0 && hasDb()) {
    try { await ready(); await sql()`insert into zero_result_searches (query) values (${q.toLowerCase()})`; } catch (e) { await logError("zero_search", e); }
  }
  return (
    <>
      <div className="prose"><h1>Search tools</h1></div>
      <form className="search" action="/search" role="search"><input name="q" defaultValue={q} placeholder="Describe your task, e.g. “write an email to my boss”" aria-label="Describe your task" autoFocus /><button className="btn">Search</button></form>
      {q && <p className="muted">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
      {q && results.length === 0 && <p>No match yet. We log searches like this to decide which tools to add next. Try a task instead: {CATEGORIES.map((c, i) => <span key={c.slug}>{i ? ", " : ""}<Link href={`/category/${c.slug}`}>{c.label}</Link></span>)}.</p>}
      <div className="grid">{(q ? results : entries).map((t) => <ToolCard key={t.slug} t={t} />)}</div>
    </>
  );
}
