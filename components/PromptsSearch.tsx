"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Prompt } from "@/lib/prompts";
import { getPromptCategory } from "@/lib/prompts";
import PromptCard from "@/components/PromptCard";

// Live search across all 300 prompts (title, text and category). Results
// only appear once the visitor types at least 2 characters, so the index
// page stays light until they search.
export default function PromptsSearch({ prompts }: { prompts: Prompt[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = useMemo(() => {
    if (query.length < 2) return [];
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.text.toLowerCase().includes(query) ||
        (getPromptCategory(p.category)?.label.toLowerCase().includes(query) ?? false),
    );
  }, [prompts, query]);

  return (
    <div>
      <form
        className="search"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 300 prompts, e.g. “job email” or “Diwali poster”"
          aria-label="Search prompts"
        />
      </form>
      {query.length >= 2 && (
        <>
          <p className="muted" style={{ fontSize: 14 }}>
            Showing {shown.length} of {prompts.length} prompts
          </p>
          {shown.length === 0 ? (
            <p>
              No prompts match that yet. Try another word, or browse a category below.
            </p>
          ) : (
            <div className="grid">
              {shown.map((p) => (
                <div key={p.id}>
                  <PromptCard prompt={p} />
                  <p style={{ fontSize: 13, margin: "6px 0 0" }}>
                    <Link href={`/prompts/${p.category}`}>{getPromptCategory(p.category)?.label}</Link>
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
