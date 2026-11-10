import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { JOBS } from "@/lib/jobs";
import { GUIDES } from "@/lib/guides";
import { getEntries, activeSponsor } from "@/lib/db";
import ToolCard from "@/components/ToolCard";
import { SignupForm } from "@/components/Forms";
import { FEATURED_PRICE_LABEL } from "@/lib/util";

export const revalidate = 300;

export default async function Home() {
  const [entries, featured] = await Promise.all([getEntries(), activeSponsor("featured")]);
  const picks = CATEGORIES.map((c) => entries.find((e) => e.categories[0] === c.slug && e.pick) || entries.find((e) => e.categories.includes(c.slug))).filter(Boolean) as typeof entries;
  const featuredEntry = featured?.entry_slug ? entries.find((e) => e.slug === featured.entry_slug) : undefined;
  return (
    <>
      <section className="hero">
        <h1>What do you want AI to help with?</h1>
        <p>Pick a task. We'll show you the easiest AI tool for it, how to start in 5 minutes, and whether the free plan is enough.</p>
        <nav className="tasks" aria-label="Tasks">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="task"><span className="e" aria-hidden>{c.emoji}</span><b>{c.label}</b><small>{c.blurb}</small></Link>
          ))}
          <Link href="/learn" className="task"><span className="e" aria-hidden>💡</span><b>New to AI?</b><small>Start with our 5-minute beginner guides.</small></Link>
        </nav>
        <h2 className="sec">I want to…</h2>
        <nav className="tasks jobs" aria-label="I want to">
          {JOBS.map((j) => {
            const name = entries.find((e) => e.slug === j.tool)?.name || TOOLS.find((t) => t.slug === j.tool)?.name;
            if (!name) return null;
            return (
              <Link key={j.phrase} href={`/tools/${j.tool}`} className="task">
                <b>{j.phrase}</b>
                <small>Try {name} →</small>
              </Link>
            );
          })}
        </nav>
        <form className="search" action="/search" role="search">
          <input name="q" placeholder="Describe your task, e.g. “write an email to my boss”" aria-label="Describe your task" />
          <button className="btn">Search</button>
        </form>
      </section>

      <h2 className="sec">Best first tool for each task</h2>
      <div className="grid">
        {featured ? (
          <article className="card featured">
            <span className="pill">Featured</span>
            <h3><a href={`/go/${featured.go_slug}`} rel="sponsored noopener">{featured.sponsor_name}</a></h3>
            <p>{featured.headline || featuredEntry?.tagline}</p>
          </article>
        ) : (
          <article className="card featured">
            <span className="pill">Featured slot</span>
            <h3><Link href="/sponsor">Your AI tool here</Link></h3>
            <p>Reach beginners looking for their first AI tool. {FEATURED_PRICE_LABEL}.</p>
          </article>
        )}
        {picks.map((t) => <ToolCard key={t.slug} t={t} />)}
      </div>

      <section className="signup" aria-labelledby="nl">
        <h2 id="nl">One AI trick a week. 5 minutes.</h2>
        <p>Every week: one thing you can try with AI in 5 minutes, plus 5 tool picks in one line each. Free, unsubscribe anytime.</p>
        <SignupForm source="home" />
      </section>

      <h2 className="sec">Learn the basics</h2>
      <div className="grid">
        {GUIDES.map((g) => (
          <article key={g.slug} className="card"><h3><Link href={`/learn/${g.slug}`}>{g.title}</Link></h3><p>{g.description}</p><small className="muted">{g.minutes} min read</small></article>
        ))}
      </div>
    </>
  );
}
