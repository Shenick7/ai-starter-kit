import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
import { isHttpUrl } from "@/lib/util";
import { SPONSOR_DEFAULT_PRICE_INR } from "@/lib/prices";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const db = sql();
  const weeks = await db`select w.*, (select count(*)::int from sponsor_clicks c where c.sponsor_week_id=w.id) as clicks from sponsor_weeks w order by week_start desc limit 100`;
  const inquiries = await db`select * from sponsor_inquiries order by created_at desc limit 100`;
  return NextResponse.json({ sponsorWeeks: weeks, inquiries });
}

// POST { slot: featured|bar|newsletter, sponsor_name, go_slug, target_url, headline?, entry_slug?, week_start: YYYY-MM-DD, week_end, price_inr?, status? }
export async function POST(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const j = await req.json().catch(() => ({}));
  if (!["featured", "bar", "newsletter"].includes(j.slot) || !j.sponsor_name || !/^[a-z0-9-]{2,60}$/.test(j.go_slug || "") || !isHttpUrl(j.target_url || "") || !j.week_start || !j.week_end)
    return NextResponse.json({ error: "need slot, sponsor_name, go_slug (a-z0-9-), target_url, week_start, week_end" }, { status: 400 });
  const [row] = await sql()`insert into sponsor_weeks (slot,sponsor_name,go_slug,target_url,headline,entry_slug,week_start,week_end,price_inr,status)
    values (${j.slot},${j.sponsor_name},${j.go_slug},${j.target_url},${j.headline || null},${j.entry_slug || null},${j.week_start},${j.week_end},${Number(j.price_inr) || SPONSOR_DEFAULT_PRICE_INR[j.slot] || 2700},${j.status || "booked"}) returning *`;
  return NextResponse.json({ ok: true, sponsorWeek: row });
}
