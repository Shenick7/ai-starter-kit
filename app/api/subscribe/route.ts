import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError } from "@/lib/db";
import { checkEmail } from "@/lib/email";
import { clean, ipHash } from "@/lib/util";
import { verifyTurnstile } from "@/lib/turnstile";
import { tooMany } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const j = await req.json().catch(() => ({}));
  if (clean(j.website)) return NextResponse.json({ ok: true, message: "You're in!" }); // honeypot
  const ts = await verifyTurnstile(req, j["cf-turnstile-response"]);
  if (!ts.ok) return NextResponse.json({ error: ts.reason }, { status: 400 });
  const chk = await checkEmail(clean(j.email, 254));
  if (!chk.ok) return NextResponse.json({ error: chk.reason }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ error: "Signups open very soon. Please try again later." }, { status: 503 });
  try {
    await ready();
    const ip = ipHash(req);
    if (await tooMany("signups", ip, 5)) return NextResponse.json({ error: "Too many attempts. Try again in an hour." }, { status: 429 });
    const rows = await sql()`insert into signups (email, source, ip_hash) values (${chk.email}, ${clean(j.source, 60) || "site"}, ${ip})
      on conflict (email) do nothing returning id`;
    if (rows.length === 0) return NextResponse.json({ ok: true, message: "You're already subscribed. See you in the next issue!" });
    const key = process.env.RESEND_API_KEY, seg = process.env.RESEND_SEGMENT_ID;
    if (key && seg) {
      const r = await fetch("https://api.resend.com/contacts", {
        method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({ email: chk.email, unsubscribed: false, segments: [{ id: seg }] }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.ok && body.id) await sql()`update signups set resend_contact_id=${body.id} where id=${rows[0].id}`;
      else await logError("resend_contact", `${r.status} ${JSON.stringify(body).slice(0, 300)}`);
    }
    return NextResponse.json({ ok: true, message: "You're in! Look out for the next issue." });
  } catch (e) {
    await logError("subscribe", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
