import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";

// POST { table, ids: number[] } — remove specific rows (e.g. test data). Seeded entries can't be deleted here.
const ALLOWED = ["submissions", "sponsor_inquiries", "signups", "pageviews", "sponsor_clicks", "zero_result_searches", "sponsor_weeks", "errors"] as const;

export async function POST(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const j = await req.json().catch(() => ({}));
  const table = j.table as (typeof ALLOWED)[number];
  const ids = Array.isArray(j.ids) ? j.ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0).slice(0, 500) : [];
  if (!ALLOWED.includes(table) || ids.length === 0) return NextResponse.json({ error: `need table (${ALLOWED.join("|")}) and ids[]` }, { status: 400 });
  const rows = await sql().unsafe(`delete from ${table} where id = any($1::bigint[]) returning id`, [ids]);
  return NextResponse.json({ ok: true, table, deleted: rows.map((r: any) => r.id) });
}
