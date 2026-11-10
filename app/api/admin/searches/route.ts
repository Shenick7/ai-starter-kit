import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const rows = await sql()`select query, count(*)::int as times, max(created_at) as last_seen from zero_result_searches
    where created_at > now() - interval '90 days' group by query order by times desc, last_seen desc limit 100`;
  return NextResponse.json({ zeroResultSearches: rows });
}
