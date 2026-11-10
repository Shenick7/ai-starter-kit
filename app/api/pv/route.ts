import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!hasDb()) return new NextResponse(null, { status: 204 });
  try {
    const ua = req.headers.get("user-agent") || "";
    if (/bot|crawl|spider|headless|preview|lighthouse/i.test(ua)) return new NextResponse(null, { status: 204 });
    const j = await req.json().catch(() => ({}));
    const path = typeof j.path === "string" && j.path.startsWith("/") ? j.path.slice(0, 200) : null;
    if (!path) return new NextResponse(null, { status: 204 });
    const ref = typeof j.ref === "string" ? j.ref.slice(0, 300) : null;
    await ready();
    await sql()`insert into pageviews (path, referrer) values (${path}, ${ref})`;
  } catch (e) { await logError("pv", e); }
  return new NextResponse(null, { status: 204 });
}
