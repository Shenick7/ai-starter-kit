import Link from "next/link";
import type { Metadata } from "next";
import { FREE_PROMPTS, PROMPT_CATEGORIES } from "@/lib/prompts";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/util";
import PromptsSearch from "@/components/PromptsSearch";

export const metadata: Metadata = {
  title: "300 free copy-ready AI prompts for beginners",
  description: "300 free original prompts in 12 categories — Art, Business, Design, Finance, HR, Health, Learning, Legal, Marketing, SEO, Social Media and Writing. Copy one, paste it into any AI tool, and get a useful answer. Free, no sign-up. Each category also has a 1,000-prompt pack for ₹999.",
  alternates: { canonical: "/prompts" },
  openGraph: {
    title: "300 free copy-ready AI prompts for beginners",
    description: "300 free original prompts in 12 categories. Copy one into any AI tool and go — plus 1,000-prompt packs for ₹999.",
    images: [{ url: "/opengraph-image", alt: "300 free AI prompts for beginners — copy one into any AI tool" }],
  },
};

// Bundle (all 12 packs). Price is still a TODO — the UPI link has no amount
// on purpose, so the buyer enters the amount only after Shenick confirms
// the price on WhatsApp.
const BUNDLE_UPI_LINK = "upi://pay?pa=9566977211@upi&pn=Shenick%20Jain&cu=INR";
const BUNDLE_WA_TEXT = encodeURIComponent("Hi Shenick, I want the bundle — all 12 prompt packs (12,000 prompts). What is the price? I will attach my payment screenshot.");

export default function PromptsPage() {
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Prompts", url: `${SITE_URL}/prompts` },
  ];
  return (
    <div>
      <JsonLd data={itemListJsonLd(PROMPT_CATEGORIES.map((c) => ({ name: `${c.label} prompts`, url: `${SITE_URL}/prompts/${c.slug}` })))} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <p className="crumbs"><Link href="/">Home</Link> / Prompts</p>
      <div className="prose">
        <h1>300 free prompts that work in any AI</h1>
        <p className="muted" style={{ fontSize: 19 }}>
          Copy a prompt, paste it into ChatGPT, Claude, Gemini or any other AI tool, and replace the [bracketed] parts with your own details. No sign-up, no payment — just useful words. Want more? Every category has a 1,000-prompt pack for ₹999.
        </p>
      </div>
      <PromptsSearch prompts={FREE_PROMPTS} />
      <h2 className="sec">Browse by category</h2>
      <div className="grid">
        {PROMPT_CATEGORIES.map((c) => (
          <article key={c.slug} className="card">
            <Link href={`/prompts/${c.slug}`} className="card-link">
              <h3>{c.emoji} {c.label}</h3>
              {c.caption ? <p className="muted" style={{ fontStyle: "italic" }}>{c.caption}</p> : null}
              <p>{c.blurb}</p>
              <small className="muted">25 free prompts →</small>
              <br />
              <small className="muted">1,000-prompt pack — ₹999</small>
            </Link>
          </article>
        ))}
        <article className="card featured">
          <Link href="/prompts/generator" className="card-link">
            <h3>Make your own prompt →</h3>
            <p>Pick a role and say what you want. The generator builds a ready-to-copy prompt for you — free, no sign-up.</p>
          </Link>
        </article>
      </div>
      <article className="card featured" style={{ marginTop: 16 }}>
        <h3>All 12 packs: 12,000 prompts</h3>
        <p>Every prompt pack in one bundle — 12,000 prompts across all 12 categories. One-time payment, no subscription.</p>
        <p><b>₹[TODO price]</b> <span className="muted" style={{ fontSize: 14 }}>TODO: set the bundle price.</span></p>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <a className="btn" href={BUNDLE_UPI_LINK}>Pay via UPI</a>
          <a className="btn ghost" href={`https://wa.me/919566977211?text=${BUNDLE_WA_TEXT}`} target="_blank" rel="noopener noreferrer">I’ve paid — send screenshot on WhatsApp</a>
        </p>
        <p className="muted" style={{ fontSize: 14 }}>
          Pay by UPI, then send your payment screenshot on WhatsApp and Shenick shares all 12 pack files with you. TODO: confirm the bundle price and delivery before selling. (A QR code will be added once the price is set.)
        </p>
      </article>
      <div className="prose">
        <h2>How to use these prompts</h2>
        <ul>
          <li><b>Copy</b> a prompt with the button under it.</li>
          <li><b>Paste</b> it into your favourite AI tool.</li>
          <li><b>Replace</b> anything in [square brackets] with your own details.</li>
          <li><b>Ask a follow-up</b> if the first answer is not quite right — “make it shorter”, “use Indian examples”, “explain it simply”.</li>
        </ul>
        <p>New to AI? Start with our <Link href="/learn">5-minute beginner guides</Link> first.</p>
      </div>
    </div>
  );
}
