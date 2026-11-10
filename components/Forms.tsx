"use client";
import { useState } from "react";

type State = { kind: "idle" | "busy" | "ok" | "err"; msg?: string };

async function post(url: string, form: HTMLFormElement) {
  const data = Object.fromEntries(new FormData(form).entries());
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong. Please try again.");
  return j;
}

function useForm(url: string, okMsg: string) {
  const [s, set] = useState<State>({ kind: "idle" });
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    set({ kind: "busy" });
    try { const j = await post(url, form); set({ kind: "ok", msg: j.message || okMsg }); form.reset(); }
    catch (err: any) { set({ kind: "err", msg: err.message }); }
  };
  return { s, onSubmit };
}

const Hp = () => <label className="hp" aria-hidden="true">Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>;
const Status = ({ s }: { s: State }) => s.kind === "ok" ? <p className="note ok" role="status">{s.msg}</p> : s.kind === "err" ? <p className="note err" role="alert">{s.msg}</p> : null;

export function SignupForm({ source = "site" }: { source?: string }) {
  const { s, onSubmit } = useForm("/api/subscribe", "You're in! Look out for the next issue.");
  return (
    <>
      <form onSubmit={onSubmit} aria-label="Newsletter signup">
        <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
        <input type="hidden" name="source" value={source} />
        <Hp />
        <button className="btn" disabled={s.kind === "busy"}>{s.kind === "busy" ? "Adding…" : "Get the weekly trick"}</button>
      </form>
      <Status s={s} />
    </>
  );
}

export function SubmitToolForm({ categories }: { categories: { slug: string; label: string }[] }) {
  const { s, onSubmit } = useForm("/api/submit", "Thanks! Your tool is in the review queue.");
  return (
    <form className="f" onSubmit={onSubmit}>
      <label>Tool name<input name="name" required maxLength={80} /></label>
      <label>Website (https://…)<input name="url" type="url" required maxLength={300} /></label>
      <label>Best for<select name="category" required defaultValue="">
        <option value="" disabled>Choose a task</option>
        {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
      </select></label>
      <label>One-line description<input name="tagline" required maxLength={160} /></label>
      <label>What does the free plan include?<textarea name="free_plan" rows={3} maxLength={600} /></label>
      <label>Your email (so we can follow up)<input name="email" type="email" required maxLength={200} /></label>
      <Hp />
      <button className="btn" disabled={s.kind === "busy"}>{s.kind === "busy" ? "Sending…" : "Submit for review"}</button>
      <Status s={s} />
    </form>
  );
}

export function ContactForm() {
  const { s, onSubmit } = useForm("/api/contact", "Thanks! Your message is on its way. I'll reply by email.");
  return (
    <form className="f" onSubmit={onSubmit}>
      <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Message<textarea name="message" required minLength={5} maxLength={5000} rows={5} /></label>
      <Hp />
      <button className="btn" disabled={s.kind === "busy"}>{s.kind === "busy" ? "Sending…" : "Send message"}</button>
      <Status s={s} />
    </form>
  );
}

export function InquiryForm() {
  const { s, onSubmit } = useForm("/api/inquiry", "Thanks! We'll reply by email within 2 working days.");
  return (
    <form className="f" onSubmit={onSubmit}>
      <label>Your name<input name="name" required maxLength={100} /></label>
      <label>Work email<input name="email" type="email" required maxLength={200} /></label>
      <label>Company / tool name<input name="company" maxLength={120} /></label>
      <label>Tool website<input name="tool_url" type="url" maxLength={300} /></label>
      <label>Interested in<select name="slot" defaultValue="featured">
        <option value="featured">Featured tool slot: $29/month (about ₹2,700)</option>
        <option value="newsletter">Newsletter sponsor (coming soon)</option>
        <option value="other">Something else</option>
      </select></label>
      <label>Message<textarea name="message" rows={4} maxLength={2000} /></label>
      <Hp />
      <button className="btn" disabled={s.kind === "busy"}>{s.kind === "busy" ? "Sending…" : "Get in touch"}</button>
      <Status s={s} />
    </form>
  );
}
