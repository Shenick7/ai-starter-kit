import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready } from "./db";
import { isAdmin } from "./util";

export async function guard(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: "database not configured" }, { status: 503 });
  await ready();
  return null;
}
