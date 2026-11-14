"use client";
import { useState } from "react";
import Link from "next/link";
import { copyText } from "@/components/PromptCard";

// Free prompt generator. Everything runs in the browser: no API calls,
// no sign-up, nothing is sent anywhere. It turns two short inputs into
// a ready-to-copy prompt that works in any AI tool.
const ROLE_IDEAS = ["copywriter", "patient teacher", "friendly accountant", "travel planner", "fitness coach", "job interview coach"];
const TASK_IDEAS = [
  "write a birthday message for my best friend",
  "plan a 3-day family trip to Ooty under ₹15,000",
  "explain GST to a small shop owner in simple words",
];

function buildPrompt(role: string, task: string): string {
  return `You are a ${role}. ${task}.\n\nPlease answer in simple, plain English. Use bullet points where they help, and give Indian examples where it makes sense. If anything is unclear, ask me one question first before answering.`;
}

export default function PromptGeneratorPage() {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const r = role.trim() || "helpful expert";
    const t = task.trim();
    if (!t) return;
    setResult(buildPrompt(r, t));
    setCopied(false);
  }

  async function onCopy() {
    if (!result) return;
    if (await copyText(result)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <p className="crumbs"><Link href="/">Home</Link> / <Link href="/prompts">Prompts</Link> / Generator</p>
      <div className="prose">
        <h1>Make your own prompt</h1>
        <p className="muted" style={{ fontSize: 19 }}>
          Tell the AI who to be and what you want. We build a ready-to-copy prompt for you — free, no sign-up, and it works in any AI tool.
        </p>
      </div>
      <form
        className="f"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <label>
          Act as…
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. copywriter, teacher, travel planner"
            aria-label="Act as"
          />
        </label>
        <div className="row" aria-label="Role ideas">
          {ROLE_IDEAS.map((r) => (
            <button key={r} type="button" className="chip" onClick={() => setRole(r)}>
              {r}
            </button>
          ))}
        </div>
        <label>
          I want a prompt for…
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. write a birthday message for my best friend"
            rows={3}
            aria-label="I want a prompt for"
          />
        </label>
        <div className="row" aria-label="Task ideas">
          {TASK_IDEAS.map((t) => (
            <button key={t} type="button" className="chip" onClick={() => setTask(t)}>
              {t}
            </button>
          ))}
        </div>
        <button type="submit" className="btn" disabled={!task.trim()}>
          Generate prompt
        </button>
      </form>
      {result && (
        <div className="box" style={{ maxWidth: 720 }}>
          <h2 style={{ marginTop: 0 }}>Your prompt</h2>
          <p className="prompt">{result}</p>
          <p>
            <button type="button" className="btn" onClick={onCopy}>
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
          </p>
          <p className="muted" style={{ fontSize: 14 }}>
            Paste it into ChatGPT, Claude, Gemini or any AI tool. Change any word to match your situation.
          </p>
        </div>
      )}
      <div className="prose">
        <h2>Want ready-made prompts?</h2>
        <p>
          <Link href="/prompts">Browse all 300 prompts →</Link>
        </p>
      </div>
    </div>
  );
}
