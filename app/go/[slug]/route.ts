import { NextRequest, NextResponse } from "next/server";
import { getEntry, hasDb, ready, sql, logError } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase().slice(0, 80);
  let target: string | null = null;
  let sponsorWeekId: number | null = null;
  try {
    if (hasDb()) {
      await ready();
      const [sw] = await sql()`select id, target_url, entry_slug from sponsor_weeks where (go_slug=${slug} or entry_slug=${slug})
        and status in ('booked','live') and week_start <= current_date and week_end >= current_date order by week_start desc limit 1`;
      if (sw) { sponsorWeekId = sw.id; target = sw.target_url || null; }
    }
    if (!target) { const e = await getEntry(slug); if (e) target = e.affiliateUrl || e.url; }
    if (!target) return NextResponse.redirect(new URL("/search?q=" + encodeURIComponent(slug), req.url), 302);
    if (hasDb()) {
      const ua = req.headers.get("user-agent") || "";
      if (!/bot|crawl|spider|preview|slurp/i.test(ua))
        await sql()`insert into sponsor_clicks (slug, sponsor_week_id, referrer) values (${slug}, ${sponsorWeekId}, ${(req.headers.get("referer") || "").slice(0, 300)})`;
    }
  } catch (e) { await logError("go", e); }
  if (!target) return NextResponse.redirect(new URL("/", req.url), 302);
  const res = NextResponse.redirect(target, 302);
  res.headers.set("x-robots-tag", "noindex");
  return res;
}
