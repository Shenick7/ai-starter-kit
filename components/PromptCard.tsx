"use client";
import { useState } from "react";
import type { Prompt } from "@/lib/prompts";

// One prompt with a Copy button. Copies the full prompt text so the
// visitor can paste it into any AI chat tool. Works without sign-up.
export function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopy(text),
    );
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    const ok = await copyText(prompt.text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <article className="card">
      <h3>{prompt.title}</h3>
      <p className="prompt">{prompt.text}</p>
      <button type="button" className="btn ghost copybtn" onClick={onCopy} aria-label={`Copy prompt: ${prompt.title}`}>
        {copied ? "Copied ✓" : "Copy prompt"}
      </button>
    </article>
  );
}
