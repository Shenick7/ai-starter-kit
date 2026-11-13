import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The plain-English terms for using AI Starter Kit: free to read, check prices before you pay, and don't paste passwords or personal IDs into AI tools.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <article className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / Terms of use</p>
      <h1>Terms of use</h1>
      <p className="muted">Last updated: 13 November 2026. Written in plain English.</p>

      <h2>Using the site</h2>
      <p>
        AI Starter Kit is free to read. You do not need an account. You may share links to our
        pages, and you may use our guides to learn and to teach others.
      </p>

      <h2>Our tool information can go out of date</h2>
      <p>
        For every tool we check its own pricing page before we write about it, and we mark when
        we checked. But AI tools change their prices and free plans often. Always confirm the
        price and the free plan on the tool&rsquo;s own pricing page before you pay for anything.
        We are not responsible if a price has changed since we checked.
      </p>

      <h2>Links to other sites</h2>
      <p>
        When you click through to an AI tool, you leave this site. That tool&rsquo;s website,
        terms and privacy policy apply — not ours. We are not responsible for what those tools
        do, what they charge, or what they do with your data.
      </p>

      <h2>AI answers are not always right</h2>
      <p>
        AI tools can state wrong facts confidently. Do not rely on an AI answer for health,
        money, legal or exam-critical decisions without checking a trusted source. Always read
        what an AI tool wrote before you send it under your name.
      </p>

      <h2>Stay safe</h2>
      <p>
        Never paste passwords, OTPs, Aadhaar numbers, bank details or other personal IDs into
        an AI chatbot, into our forms, or into any tool you find here. Our forms ask only for
        the details needed to reply to you — nothing more.
      </p>

      <h2>Using our forms</h2>
      <p>
        Do not use our submit, contact, newsletter or sponsorship forms to send spam, abusive
        content, or someone else&rsquo;s personal details. We may ignore or delete submissions
        that do.
      </p>

      <h2>Sponsored listings</h2>
      <p>
        A company can pay to be featured on this site. Featured listings are always clearly
        labelled. A payment cannot buy a recommendation and cannot change a free-plan verdict.
        See the <Link href="/sponsor">Sponsor</Link> page for details.
      </p>

      <h2>Changes</h2>
      <p>
        We may change these terms, or change or remove listings and pages on this site, at any
        time. Questions? Email us at{" "}
        <a href="mailto:jainshenick@gmail.com">jainshenick@gmail.com</a> or use the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </article>
  );
}
