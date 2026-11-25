import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "Refund policy for AI Starter Kit prompt packs: all sales are final — no refunds on digital prompt packs.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicy() {
  return (
    <article className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / Refund policy</p>
      <h1>Refund policy</h1>
      <p className="muted">Last updated: 26 November 2026.</p>

      <h2>Prompt packs</h2>
      <p>
        <b>All sales are final. We do not give refunds on prompt packs.</b> A prompt
        pack is a digital file (PDF) that we share with you on WhatsApp after you
        pay, and once you have the file we cannot take it back. Please try the
        free prompts and the free preview on the pack page before you pay, so you
        know exactly what you are buying.
      </p>
      <p>
        If you paid and did not receive your pack file on WhatsApp within 1 hour,
        message us on WhatsApp with your payment screenshot and we will send it
        to you. If we send you the wrong pack file by mistake, message us and we
        will send you the correct one.
      </p>

      <h2>If something goes wrong</h2>
      <p>
        WhatsApp us on{" "}
        <a href="https://wa.me/919566977211" target="_blank" rel="noopener noreferrer">
          +91 95669 77211
        </a>{" "}
        with your payment screenshot and the name of the pack.
      </p>
      <p>
        Questions? Email{" "}
        <a href="mailto:jainshenick@gmail.com">jainshenick@gmail.com</a> or use the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </article>
  );
}
