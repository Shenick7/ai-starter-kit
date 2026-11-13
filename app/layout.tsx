import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import SponsorBar from "@/components/SponsorBar";
import Pageview from "@/components/Pageview";
import { activeSponsor } from "@/lib/db";
import { SITE_NAME, SITE_URL, FEATURED_PRICE_LABEL } from "@/lib/util";

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: which AI tool should I use?`, template: `%s | ${SITE_NAME}` },
  description: "Beginner-friendly AI tools sorted by task, with plain-English how-to-start steps and honest answers on whether the free plan is enough.",
  authors: [{ name: "Shenick Jain", url: "https://x.com/Shenick_7" }],
  creator: "Shenick Jain",
  openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL },
  twitter: { card: "summary_large_image", creator: "@Shenick_7" },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#4f46e5" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await activeSponsor("bar");
  return (
    <html lang="en">
      <body>
        {s ? (
          <SponsorBar id={`s${s.id}`} label="Sponsored" text={s.headline || s.sponsor_name} href={`/go/${s.go_slug}`} />
        ) : (
          <SponsorBar id="house1" label="Makers" text={`Built an AI tool? Feature it here from ${FEATURED_PRICE_LABEL}.`} href="/sponsor" />
        )}
        <header className="top"><div className="wrap">
          <Link href="/" className="logo">AI Starter<span>Kit</span></Link>
          <nav className="main" aria-label="Main">
            <Link href="/search">Search</Link><Link href="/learn">Learn</Link><Link href="/submit">Submit a tool</Link><Link href="/sponsor">Sponsor</Link><Link href="/contact">Contact</Link>
          </nav>
        </div></header>
        <main className="wrap">{children}</main>
        <footer className="ft"><div className="wrap">
          <div>© {new Date().getFullYear()} {SITE_NAME}. Free-plan info is checked against each tool's own pricing page; plans change, so always confirm before paying.</div>
          <div className="row"><Link href="/learn">Learn</Link><Link href="/submit">Submit a tool</Link><Link href="/sponsor">Advertise</Link><Link href="/contact">Contact</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          <div style={{ flexBasis: "100%", fontSize: 13 }}>A Shenick Jain product · <a href="https://x.com/Shenick_7" target="_blank" rel="noopener me">X</a> · <a href="https://instagram.com/shenick7" target="_blank" rel="noopener me">Instagram</a></div>
        </div></footer>
        <Pageview />
      </body>
    </html>
  );
}
