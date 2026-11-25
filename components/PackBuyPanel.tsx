"use client";
import { useState } from "react";
import Link from "next/link";

// Buy panel for one category's 1,000-prompt pack (₹999).
// Paid prompt text is never shown here — only a few locked titles as a
// preview. Payment is by UPI; the buyer sends the payment screenshot on
// WhatsApp and Shenick shares the pack file there.
const UPI_ID = "9566977211@upi";
const UPI_LINK = "upi://pay?pa=9566977211@upi&pn=Shenick%20Jain&am=999&cu=INR";
const WHATSAPP_NUMBER = "919566977211";

// TODO (Shenick): replace these with 3 real prompts from each pack.
// Each sample shows in full on that pack's page as a free preview.
const PREVIEW_SAMPLES: Record<string, { title: string; text: string }[]> = {
  art: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Art pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Art pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Art pack here." },
  ],
  business: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Business pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Business pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Business pack here." },
  ],
  design: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Design pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Design pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Design pack here." },
  ],
  finance: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Finance pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Finance pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Finance pack here." },
  ],
  hr: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the HR pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the HR pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the HR pack here." },
  ],
  health: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Health pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Health pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Health pack here." },
  ],
  learning: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Learning pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Learning pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Learning pack here." },
  ],
  legal: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Legal pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Legal pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Legal pack here." },
  ],
  marketing: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Marketing pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Marketing pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Marketing pack here." },
  ],
  seo: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the SEO pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the SEO pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the SEO pack here." },
  ],
  "social-media": [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Social Media pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Social Media pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Social Media pack here." },
  ],
  writing: [
    { title: "TODO: sample prompt 1", text: "TODO: paste a real prompt from the Writing pack here." },
    { title: "TODO: sample prompt 2", text: "TODO: paste a real prompt from the Writing pack here." },
    { title: "TODO: sample prompt 3", text: "TODO: paste a real prompt from the Writing pack here." },
  ],
};

// Buyer reviews. The "What buyers say" section stays hidden until at least
// one review is added here.
// TODO (Shenick): add your first buyer review to show the section.
const PACK_REVIEWS: { name: string; text: string }[] = [];

export default function PackBuyPanel({
  label,
  slug,
  previewTitles,
}: {
  label: string;
  slug: string;
  previewTitles: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the ID is shown as plain text to copy by hand.
    }
  }

  const waText = encodeURIComponent(
    `Hi Shenick, I paid ₹999 for the ${label} prompt pack (1,000 prompts). My payment reference (UTR): [paste it here]. I am attaching the payment screenshot.`
  );

  return (
    <section className="card featured" style={{ marginTop: 28 }}>
      <h2 style={{ marginTop: 0 }}>Get all 1,000 {label} prompts — ₹999</h2>
      <p>
        The 25 prompts above are free. The full pack has 1,000 {label.toLowerCase()} prompts —
        every one written for beginners, ready to copy into any AI tool.
      </p>
      {previewTitles.length > 0 && (
        <div>
          <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
            A peek inside the pack (locked — full text comes with the pack):
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            {previewTitles.map((t) => (
              <li key={t} className="muted" style={{ padding: "4px 0" }}>
                🔒 {t}
              </li>
            ))}
            <li className="muted" style={{ padding: "4px 0" }}>🔒 …and 995 more</li>
          </ul>
        </div>
      )}
      <h3 style={{ marginBottom: 6 }}>Free preview</h3>
      <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>
        Three full prompts from this pack — try them free before you buy.
      </p>
      {(PREVIEW_SAMPLES[slug] ?? []).map((s) => (
        <article key={s.title} className="card">
          <h3>{s.title}</h3>
          <p className="prompt">{s.text}</p>
        </article>
      ))}
      <div className="box">
        <h3 style={{ marginTop: 0 }}>What you get</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>1,000 prompts — one-time payment, no subscription.</li>
          <li>Format: PDF (TODO: confirm).</li>
          <li>Delivery: on WhatsApp within [X hours] after payment is checked (TODO: confirm).</li>
          <li>Works in ChatGPT, Claude, Gemini and other AI tools.</li>
          <li>25 free prompts included? TODO: confirm.</li>
        </ul>
      </div>
      <h3 style={{ marginBottom: 6 }}>How to buy</h3>
      <ol style={{ marginTop: 0 }}>
        <li>
          <b>Pay ₹999 via UPI</b> — tap the button below (opens your UPI app), scan the QR code,
          or copy the UPI ID <code>{UPI_ID}</code>{" "}
          <button type="button" className="chip" onClick={copyUpi}>
            {copied ? "Copied ✓" : "Copy UPI ID"}
          </button>
        </li>
        <li>
          <b>Send your payment screenshot on WhatsApp</b> — tap the WhatsApp button and attach
          the screenshot of your payment there.
        </li>
        <li>
          <b>Shenick shares the full 1,000-prompt pack file with you on WhatsApp</b> after
          checking your payment.
        </li>
      </ol>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <a className="btn" href={UPI_LINK}>
          Pay ₹999 via UPI
        </a>
        <a
          className="btn ghost"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          I&apos;ve paid — send screenshot on WhatsApp
        </a>
      </p>
      <p style={{ margin: "4px 0 0" }}>
        <img
          src="/upi-qr-999.svg"
          alt="QR code to pay ₹999 via UPI for the prompt pack"
          width={180}
          height={180}
        />
      </p>
      <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>
        Pay only ₹999 for this pack. One-time payment, no subscription. Refunds: see our{" "}
        <Link href="/refund-policy">Refund policy</Link>.
      </p>
      <section className="faq" aria-label="Common questions">
        <h2>Common questions</h2>
        <details>
          <summary>How do I pay?</summary>
          <p>Pay ₹999 with UPI — tap “Pay ₹999 via UPI” above, scan the QR code, or copy the UPI ID into your UPI app. We don’t take card payments on this site.</p>
        </details>
        <details>
          <summary>When do I get it?</summary>
          <p>After we check your payment, Shenick shares the pack file with you on WhatsApp. TODO: confirm how quickly — usually within [X hours].</p>
        </details>
        <details>
          <summary>What format?</summary>
          <p>PDF. TODO: confirm the format.</p>
        </details>
        <details>
          <summary>Can I get a refund?</summary>
          <p>See our <Link href="/refund-policy">Refund policy</Link>.</p>
        </details>
        <details>
          <summary>Can I use these for my business?</summary>
          <p>Yes. You can use the prompts for your own personal and business work. You can’t resell the pack, share the pack file, or publish the prompts as your own. See the <Link href="/terms">Terms</Link> for the full licence.</p>
        </details>
      </section>
      {PACK_REVIEWS.length > 0 && (
        <section aria-label="What buyers say">
          <h2>What buyers say</h2>
          {PACK_REVIEWS.map((r) => (
            <blockquote key={r.name}>
              <p>{r.text}</p>
              <p className="muted">— {r.name}</p>
            </blockquote>
          ))}
        </section>
      )}
    </section>
  );
}
