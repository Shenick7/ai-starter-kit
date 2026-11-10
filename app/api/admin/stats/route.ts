import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
import { getStats } from "@/lib/stats";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const db = sql();
  const [counts] = await db`select
    (select count(*)::int from submissions where status='pending') as pending_submissions,
    (select count(*)::int from sponsor_inquiries) as sponsor_inquiries,
    (select count(*)::int from errors where created_at > now() - interval '7 days') as errors_7d,
    (select count(*)::int from pageviews where created_at > now() - interval '1 day') as pageviews_24h,
    (select count(*)::int from signups where created_at > now() - interval '7 days') as signups_7d`;
  const topPages = await db`select path, count(*)::int as views from pageviews where created_at > now() - interval '30 days' group by path order by views desc limit 20`;
  const topClicks = await db`select slug, count(*)::int as clicks from sponsor_clicks where created_at > now() - interval '30 days' group by slug order by clicks desc limit 20`;
  const recentErrors = await db`select location, message, created_at from errors order by created_at desc limit 10`;
  return NextResponse.json({ ...(await getStats()), ...counts, topPages, topClicks, recentErrors });
}
