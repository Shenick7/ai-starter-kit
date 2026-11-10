import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError } from "@/lib/db";
import { checkEmail } from "@/lib/email";
import { clean, ipHash, OWNER_EMAIL } from "@/lib/util";
import { tooMany } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const j = await req.json().catch(() => ({}));
  if (clean(j.website)) return NextResponse.json({ ok: true });
  const name = clean(j.name, 100), company = clean(j.company, 120), toolUrl = clean(j.tool_url, 300), slot = clean(j.slot, 30), message = clean(j.message, 2000);
  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  const chk = await checkEmail(clean(j.email, 254));
  if (!chk.ok) return NextResponse.json({ error: chk.reason }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ error: "Please try again shortly." }, { status: 503 });
  try {
    await ready();
    const ip = ipHash(req);
    if (await tooMany("sponsor_inquiries", ip, 5)) return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
    await sql()`insert into sponsor_inquiries (name,email,company,tool_url,slot,message,ip_hash) values (${name},${chk.email},${company},${toolUrl},${slot},${message},${ip})`;
    // Optional owner notification. Off unless NOTIFY_OWNER=1. Recipient is hard-coded to the owner only.
    if (process.env.NOTIFY_OWNER === "1" && process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: process.env.NOTIFY_FROM || "AI Starter Kit <onboarding@resend.dev>", to: [OWNER_EMAIL],
          subject: `New sponsor inquiry: ${company || name}`, text: `Name: ${name}\nEmail: ${chk.email}\nCompany: ${company}\nTool: ${toolUrl}\nSlot: ${slot}\n\n${message}` }),
      }).catch((e) => logError("notify_owner", e));
    }
    return NextResponse.json({ ok: true, message: "Thanks! We'll reply by email within 2 working days." });
  } catch (e) { await logError("inquiry", e); return NextResponse.json({ error: "Something went wrong." }, { status: 500 }); }
}
