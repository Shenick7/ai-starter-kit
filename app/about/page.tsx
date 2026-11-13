import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AI Starter Kit",
  description: "AI Starter Kit is a small, independent guide to AI tools for complete beginners, run by Shenick Jain from Ambur, Tamil Nadu.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <article className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / About</p>
      <h1>About AI Starter Kit</h1>
      <p className="muted">A small, independent guide to AI tools for complete beginners.</p>

      <h2>Who runs it</h2>
      <p>
        AI Starter Kit is run by Shenick Jain from Ambur, Tamil Nadu, India. Shenick also runs
        SJ Tours and Travels and the family auto-parts shop, Arihant Auto Parts. He built this
        site because he kept getting the same question from friends, family and customers:
        &ldquo;Which AI tool should I use — and where do I start?&rdquo;
      </p>

      <h2>Why it exists</h2>
      <p>
        There are hundreds of AI tools now, and most of them are explained in technical language
        for people who already know the field. This site is for everyone else. For each task —
        writing an email, making slides, editing a video, studying for an exam — we show the
        easiest tool for a beginner, how to start with it in 5 minutes, and whether the free
        plan is enough. No jargon, no coding, no sign-up needed to read.
      </p>

      <h2>How tools are chosen</h2>
      <p>
        We only list tools that a complete beginner can start using for free, in a few minutes,
        on a phone or a basic laptop. For every tool we check its own pricing page before we
        write about it, and we say plainly what the free plan covers and where it stops.
      </p>
      <p>
        Our free-plan verdicts are editorial — they are never sold. A company can pay to be
        featured on the site (see the <Link href="/sponsor">Sponsor</Link> page), but a featured
        listing is always clearly labelled, and no payment can change a free-plan verdict or
        buy a recommendation. Regular listings are free.
      </p>
      <p>
        Some &ldquo;Open&rdquo; buttons are affiliate links: if you sign up or pay through one,
        we may earn a commission at no extra cost to you. Every affiliate link is labelled
        on the tool&rsquo;s page, and it never affects the free-plan verdict or the order
        tools are shown in. Most tools here have no affiliate link at all.
      </p>

      <h2>What this site is not</h2>
      <p>
        AI Starter Kit is not an AI tool itself, and it does not sell AI tools. When you click
        through to a tool, you leave this site and use that tool&rsquo;s own website, under its
        own terms and privacy policy. We are not responsible for what those tools do, what they
        charge, or what they do with your data — always check their pricing page before you pay.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections or a tool to suggest? Use the <Link href="/contact">contact page</Link> or
        the <Link href="/submit">submit a tool</Link> form. If you spot a price or a free-plan detail
        that has changed, please tell us — keeping that information honest is the whole point of
        this site.
      </p>
    </article>
  );
}
