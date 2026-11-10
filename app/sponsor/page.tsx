import type { Metadata } from "next";
import { getStats } from "@/lib/stats";
import { InquiryForm } from "@/components/Forms";
import { FEATURED_PRICE_INR } from "@/lib/util";

export const metadata: Metadata = { title: "Sponsor AI Starter Kit", description: `Put your AI tool in front of beginners choosing their first AI tool. Featured slot from ₹${FEATURED_PRICE_INR}/month.`, alternates: { canonical: "/sponsor" } };
export const dynamic = "force-dynamic";

export default async function Sponsor() {
  const s = await getStats();
  const fmt = (n: number) => n.toLocaleString("en-IN");
  return (
    <div>
      <div className="prose">
        <h1>Sponsor AI Starter Kit</h1>
        <p className="muted">Our readers are beginners actively choosing which AI tool to try. These numbers come straight from our database and update live. We're new, so they're small and honest.</p>
      </div>
      <div className="stats">
        <div className="stat"><b>{fmt(s.pageviews30d)}</b><span>page views, last 30 days</span></div>
        <div className="stat"><b>{fmt(s.subscribers)}</b><span>newsletter subscribers</span></div>
        <div className="stat"><b>{fmt(s.tools)}</b><span>tools listed</span></div>
        <div className="stat"><b>{fmt(s.sponsorClicks30d)}</b><span>outbound clicks, last 30 days</span></div>
      </div>
      <p className="muted" style={{ fontSize: 14 }}>Page views are counted by our own first-party counter{s.since ? ` since ${s.since}` : ""}. No bots filtering beyond basics, so treat as approximate.</p>
      <div className="grid" style={{ marginTop: 18 }}>
        <article className="card featured"><span className="pill">Available now</span><h3>Featured tool slot</h3>
          <p>Your tool at the top of the home page picks and in the site-wide bar for a month, clearly labelled "Featured". All clicks go through a tracked link and we share the click count.</p><p><b>₹{FEATURED_PRICE_INR} / month</b></p></article>
        <article className="card"><span className="pill">Coming soon</span><h3>Newsletter sponsor</h3><p>A "Sponsored by" line in the weekly email. Opens once the list passes a few hundred readers. Join the waitlist below.</p></article>
        <article className="card"><span className="pill">Always free</span><h3>Regular listing</h3><p>Listings are free and editorial: we only list tools that are beginner-friendly, and we never sell a "free plan is enough" verdict.</p></article>
      </div>
      <div className="prose"><h2>Get in touch</h2><p className="muted">No payment here. Tell us about your tool and we'll reply by email with available dates.</p></div>
      <InquiryForm />
    </div>
  );
}
