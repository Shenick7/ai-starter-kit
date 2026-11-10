import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
export const dynamic = "force-dynamic";
// GET ?table=pageviews|sponsor_clicks|signups|zero_result_searches|errors&limit=50 — newest rows, to find ids for cleanup.
const ALLOWED = ["pageviews", "sponsor_clicks", "signups", "zero_result_searches", "errors"];
export async function GET(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const table = req.nextUrl.searchParams.get("table") || "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 500);
  if (!ALLOWED.includes(table)) return NextResponse.json({ error: `table must be one of ${ALLOWED.join("|")}` }, { status: 400 });
  const rows = await sql().unsafe(`select * from ${table} order by id desc limit $1`, [limit]);
  return NextResponse.json({ table, rows });
}
