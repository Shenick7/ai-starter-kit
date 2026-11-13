import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError } from "@/lib/db";
import { checkEmail } from "@/lib/email";
import { clean, ipHash, isHttpUrl } from "@/lib/util";
import { verifyTurnstile } from "@/lib/turnstile";
import { CATEGORIES } from "@/lib/tools";
import { tooMany } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const j = await req.json().catch(() => ({}));
  if (clean(j.website)) return NextResponse.json({ ok: true });
  const ts = await verifyTurnstile(req, j["cf-turnstile-response"]);
  if (!ts.ok) return NextResponse.json({ error: ts.reason }, { status: 400 });
  const name = clean(j.name, 80), url = clean(j.url, 300), category = clean(j.category, 40), tagline = clean(j.tagline, 160), free = clean(j.free_plan, 600);
  if (!name || !isHttpUrl(url) || !tagline) return NextResponse.json({ error: "Please fill in the name, a valid https:// link and a one-line description." }, { status: 400 });
  if (!CATEGORIES.some((c) => c.slug === category)) return NextResponse.json({ error: "Please choose a task." }, { status: 400 });
  const chk = await checkEmail(clean(j.email, 254));
  if (!chk.ok) return NextResponse.json({ error: chk.reason }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ error: "Submissions open very soon." }, { status: 503 });
  try {
    await ready();
    const ip = ipHash(req);
    if (await tooMany("submissions", ip, 5)) return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
    await sql()`insert into submissions (name,url,category,tagline,free_plan,submitter_email,ip_hash) values (${name},${url},${category},${tagline},${free},${chk.email},${ip})`;
    return NextResponse.json({ ok: true, message: "Thanks! Your tool is in the review queue. We check every submission by hand." });
  } catch (e) { await logError("submit", e); return NextResponse.json({ error: "Something went wrong." }, { status: 500 }); }
}
