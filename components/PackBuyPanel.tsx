"use client";
import { useState } from "react";

// Buy panel for one category's 1,000-prompt pack (₹999).
// Paid prompt text is never shown here — only a few locked titles as a
// preview. Payment is by UPI; the buyer sends the payment screenshot on
// WhatsApp and Shenick shares the pack file there.
const UPI_ID = "9566977211@upi";
const UPI_LINK = "upi://pay?pa=9566977211@upi&pn=Shenick%20Jain&am=999&cu=INR";
const WHATSAPP_NUMBER = "919566977211";

export default function PackBuyPanel({
  label,
  previewTitles,
}: {
  label: string;
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
        Pay only ₹999 for this pack. No bundles, no subscription.
      </p>
    </section>
  );
}
