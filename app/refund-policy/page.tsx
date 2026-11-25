import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "Refund policy for AI Starter Kit prompt packs: when you can get a refund and how to ask for one.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicy() {
  return (
    <article className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / Refund policy</p>
      <h1>Refund policy</h1>
      <p className="muted">Last updated: 25 November 2026.</p>
      <p>
        <b>TODO — DRAFT: this policy is a placeholder for Shenick to review and approve.
        Nothing below is final yet.</b>
      </p>

      <h2>Prompt packs</h2>
      <p>
        TODO: confirm the refund rules. Draft: if you paid for a prompt pack and did not
        receive the pack file on WhatsApp, message us on WhatsApp with your payment
        screenshot and we will send the pack or refund you.
      </p>
      <p>
        TODO: confirm whether refunds are possible after the pack file has been shared.
        Draft: because the pack is a digital file, once it has been shared we cannot take
        it back, so please check the free preview before you pay.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        WhatsApp us on{" "}
        <a href="https://wa.me/919566977211" target="_blank" rel="noopener noreferrer">
          +91 95669 77211
        </a>{" "}
        with your payment screenshot and the name of the pack. TODO: confirm the refund
        window (for example, within 7 days of payment).
      </p>
      <p>
        Questions? Email{" "}
        <a href="mailto:jainshenick@gmail.com">jainshenick@gmail.com</a> or use the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </article>
  );
}
