import { NextRequest, NextResponse } from "next/server";
import { hasDb, ready, sql, logError } from "@/lib/db";
import { checkEmail } from "@/lib/email";
import { clean, ipHash, OWNER_EMAIL } from "@/lib/util";
import { tooMany } from "@/lib/ratelimit";

const hits = new Map<string, number[]>();
const HOUR = 60 * 60 * 1000;

// Used only when the database limiter can't run. Production uses tooMany() on messages.
function tooManyMemory(ip: string, max = 5) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < HOUR);
  if (recent.length >= max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function sendToOwner(name: string, email: string, message: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    await logError("contact_email", "RESEND_API_KEY not set");
    return "Couldn't send just now. Please email me directly.";
  }
  const from = process.env.NOTIFY_FROM || "AI Starter Kit <onboarding@resend.dev>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [OWNER_EMAIL],
      reply_to: [email],
      subject: `New message on AI Starter Kit from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    await logError("contact_email", `${r.status} ${body.slice(0, 300)}`);
    return "Couldn't send just now. Please email me directly.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  const j = await req.json().catch(() => ({}));
  if (clean(j.website)) return NextResponse.json({ ok: true, message: "Thanks! Your message is on its way. I'll reply by email." });
  const name = typeof j.name === "string" ? j.name.trim() : "";
  const message = typeof j.message === "string" ? j.message.trim() : "";
  if (!name || name.length > 100) return NextResponse.json({ error: "Please add your name (100 characters or fewer)." }, { status: 400 });
  if (message.length < 5 || message.length > 5000) return NextResponse.json({ error: "Please write a message between 5 and 5000 characters." }, { status: 400 });
  const chk = await checkEmail(clean(j.email, 254));
  if (!chk.ok) return NextResponse.json({ error: chk.reason }, { status: 400 });
  try {
    const ip = ipHash(req);
    if (hasDb()) {
      await ready();
      if (await tooMany("messages", ip, 5)) return NextResponse.json({ error: "Too many messages. Try again in an hour." }, { status: 429 });
      await sql()`insert into messages (name, email, message, ip_hash) values (${name}, ${chk.email}, ${message}, ${ip})`;
    } else if (tooManyMemory(ip, 5)) {
      return NextResponse.json({ error: "Too many messages. Try again in an hour." }, { status: 429 });
    }
    const err = await sendToOwner(name, chk.email, message);
    if (err) return NextResponse.json({ error: err }, { status: 503 });
    return NextResponse.json({ ok: true, message: "Thanks! Your message is on its way. I'll reply by email." });
  } catch (e) {
    await logError("contact", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
