import Link from "next/link";
import { VERDICT_LABEL, type Verdict } from "@/lib/tools";

export function VerdictPill({ v }: { v: Verdict }) {
  return <span className={`pill v-${v}`}>{VERDICT_LABEL[v]}</span>;
}

export default function ToolCard({ t }: { t: { slug: string; name: string; tagline: string; verdict: Verdict } }) {
  return (
    <article className="card">
      <h3><Link href={`/tools/${t.slug}`}>{t.name}</Link></h3>
      <p>{t.tagline}</p>
      <div className="row"><VerdictPill v={t.verdict} /></div>
      <div className="row"><Link href={`/tools/${t.slug}`}>How to start →</Link></div>
    </article>
  );
}
