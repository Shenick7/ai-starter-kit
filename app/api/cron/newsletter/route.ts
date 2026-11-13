// Weekly newsletter sender. Called by Vercel Cron every Monday at 03:30 UTC
// (09:00 IST) — see vercel.json — and can also be triggered manually with
// curl -H "Authorization: Bearer $CRON_SECRET" https://aikitstart.com/api/cron/newsletter
//
// Protection: the route only runs when the request carries
// "Authorization: Bearer <CRON_SECRET>". Vercel Cron sends that header
// automatically when CRON_SECRET is set in the project. Without CRON_SECRET
// nothing is ever sent.
//
// Sending uses the Resend Broadcasts API (create a broadcast for the
// audience, then send it), so the unsubscribe link in the template is
// filled in by Resend exactly as in the manual Broadcast flow. The manual
// path (render an issue with scripts/render-issue.ts and paste it into a
// Resend Broadcast) is unchanged and still works.
//
// Safety: an issue number is only ever sent once — sends are recorded in
// newsletter_sends, and the route refuses to re-send a recorded issue.
// Needs in Vercel: CRON_SECRET, RESEND_API_KEY, RESEND_AUDIENCE_ID
// (the audience that holds the "AI Starter Kit" segment), DATABASE_URL.
// NEWSLETTER_FROM is optional (defaults to NOTIFY_FROM, then onboarding@resend.dev).
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError, activeSponsor } from "@/lib/db";
import { renderIssue } from "@/newsletter/template";
import { latestIssue } from "@/newsletter/issues";
import { SITE_URL } from "@/lib/util";

export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) return false;
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!got) return false;
  const a = Buffer.from(secret), b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) return NextResponse.json({ error: "newsletter cron not configured (CRON_SECRET missing)" }, { status: 503 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: "database not configured" }, { status: 503 });
  const key = process.env.RESEND_API_KEY, audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) return NextResponse.json({ error: "newsletter cron not configured (RESEND_API_KEY or RESEND_AUDIENCE_ID missing)" }, { status: 503 });
  try {
    await ready();
    const issue = latestIssue();
    const sent = await sql()`select id from newsletter_sends where issue_number=${issue.number}`;
    if (sent.length > 0) return NextResponse.json({ ok: true, skipped: "already-sent", issue: issue.number });
    const [{ n }] = await sql()`select count(*)::int as n from signups`;
    if (n === 0) return NextResponse.json({ ok: true, skipped: "no-subscribers", issue: issue.number });
    const sponsor = await activeSponsor("newsletter");
    const out = renderIssue({
      ...issue,
      siteUrl: SITE_URL,
      sponsor: sponsor ? { name: sponsor.sponsor_name, goSlug: sponsor.go_slug, line: sponsor.headline || "" } : null,
    });
    const from = process.env.NEWSLETTER_FROM || process.env.NOTIFY_FROM || "AI Starter Kit <onboarding@resend.dev>";
    const created = await fetch("https://api.resend.com/broadcasts", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ audience_id: audience, from, subject: out.subject, html: out.html, text: out.text }),
    });
    const createdBody = await created.json().catch(() => ({}));
    if (!created.ok || !createdBody.id) {
      await logError("cron_newsletter_create", `${created.status} ${JSON.stringify(createdBody).slice(0, 300)}`);
      return NextResponse.json({ error: "could not create the broadcast" }, { status: 502 });
    }
    const sentRes = await fetch(`https://api.resend.com/broadcasts/${createdBody.id}/send`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!sentRes.ok) {
      const b = await sentRes.json().catch(() => ({}));
      await logError("cron_newsletter_send", `${sentRes.status} ${JSON.stringify(b).slice(0, 300)}`);
      return NextResponse.json({ error: "broadcast created but could not be sent", broadcast_id: createdBody.id }, { status: 502 });
    }
    await sql()`insert into newsletter_sends (issue_number, broadcast_id, recipients) values (${issue.number}, ${createdBody.id}, ${n})`;
    return NextResponse.json({ ok: true, issue: issue.number, broadcast_id: createdBody.id, recipients: n });
  } catch (e) {
    await logError("cron_newsletter", e);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}
