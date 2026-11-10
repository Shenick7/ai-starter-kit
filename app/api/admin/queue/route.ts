import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const status = req.nextUrl.searchParams.get("status") || "pending";
  const rows = await sql()`select * from submissions where status=${status} order by created_at asc limit 200`;
  return NextResponse.json({ count: rows.length, submissions: rows });
}
