import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What AI Starter Kit collects (emails, hashed IP addresses, referrers and pageviews), why, and how to ask for your data to be deleted.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <article className="prose">
      <p className="crumbs"><Link href="/">Home</Link> / Privacy policy</p>
      <h1>Privacy policy</h1>
      <p className="muted">Last updated: 13 November 2026. Plain English first — if anything here is unclear, email us and ask.</p>

      <h2>What we collect</h2>
      <p>AI Starter Kit collects only what it needs to run the site:</p>
      <ul>
        <li><b>Email addresses</b> — only when you type one in: to join the newsletter, send a message through the contact form, submit a tool, or enquire about sponsorship.</li>
        <li><b>Hashed IP addresses</b> — when you use a form, we store a one-way hash of your IP address (not the address itself). We use it only to limit spam, for example to stop one address submitting a form dozens of times an hour.</li>
        <li><b>Referrers and pageviews</b> — when you visit a page, we count the visit and note which page sent you here (the referrer), if your browser shares it. These counts are approximate and are used to see which pages people read. We do not track you across other websites.</li>
        <li><b>Messages you send us</b> — the text of contact messages, tool submissions and sponsorship enquiries, so we can read and reply to them.</li>
      </ul>

      <h2>What we do not collect</h2>
      <p>
        We do not use Google Analytics or any other third-party tracker. We do not collect your
        name, location, or device details beyond what is listed above. We do not sell your data
        to anyone, and we do not share it with advertisers.
      </p>
      <p>
        The only thing stored in your own browser is a small setting that remembers whether you
        dismissed the sponsor bar at the top of the page. That stays on your device and is never
        sent to us.
      </p>

      <h2>Where your data is stored</h2>
      <p>
        Form messages and newsletter signups are stored in our database (Postgres, hosted by
        Neon). If you join the newsletter, your email is also added to our email list (Resend)
        so we can send you the weekly issue. Every newsletter email has an unsubscribe link.
      </p>

      <h2>How to ask for deletion</h2>
      <p>
        To ask us to delete your email address, a message, or a form submission, email the owner
        at <a href="mailto:jainshenick@gmail.com">jainshenick@gmail.com</a> from the same email
        address you used on the site, and say what you want deleted. We will delete it and reply
        to confirm. You can also unsubscribe from the newsletter at any time using the link in
        any issue.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This site links to AI tools and their pricing pages. When you click through, you are on
        that tool&rsquo;s website, under its own privacy policy. We are not responsible for what
        those sites collect.
      </p>

      <h2>Changes</h2>
      <p>
        If we change what we collect or how we use it, we will update this page and change the
        date above. Questions about this policy? Email us at{" "}
        <a href="mailto:jainshenick@gmail.com">jainshenick@gmail.com</a>.
      </p>
    </article>
  );
}
