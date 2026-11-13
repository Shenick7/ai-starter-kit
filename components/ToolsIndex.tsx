"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import type { Entry } from "@/lib/db";
import type { Verdict } from "@/lib/tools";

type Category = { slug: string; label: string; emoji: string; blurb: string };

const VERDICT_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Any free plan" },
  { value: "yes", label: "Free plan is enough" },
  { value: "mostly", label: "Free plan works, with limits" },
  { value: "trial", label: "Free trial or credits only" },
  { value: "no", label: "No free plan" },
];

export default function ToolsIndex({ tools, categories }: { tools: Entry[]; categories: readonly Category[] }) {
  const [cat, setCat] = useState("all");
  const [verdict, setVerdict] = useState("all");

  const shown = useMemo(
    () =>
      tools.filter(
        (t) =>
          (cat === "all" || t.categories.includes(cat)) &&
          (verdict === "all" || t.verdict === (verdict as Verdict)),
      ),
    [tools, cat, verdict],
  );

  return (
    <div>
      <div className="chips" role="group" aria-label="Filter by task">
        <button className={`chip${cat === "all" ? " on" : ""}`} onClick={() => setCat("all")} aria-pressed={cat === "all"}>
          All tasks
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`chip${cat === c.slug ? " on" : ""}`}
            onClick={() => setCat(c.slug)}
            aria-pressed={cat === c.slug}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <div className="row" style={{ margin: "12px 0" }}>
        <label htmlFor="verdict-filter" style={{ fontWeight: 600, fontSize: 14 }}>
          Free plan:
        </label>
        <select
          id="verdict-filter"
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          style={{ font: "inherit", fontSize: 15, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 10, background: "#fff" }}
        >
          {VERDICT_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: 14 }}>
          Showing {shown.length} of {tools.length} tools
        </span>
      </div>
      {shown.length === 0 ? (
        <p>
          No tools match that combination yet. Try another task, or{" "}
          <Link href="/search">search for what you need</Link>.
        </p>
      ) : (
        <div className="grid">
          {shown.map((t) => (
            <ToolCard key={t.slug} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
