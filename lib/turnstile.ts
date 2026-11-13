// Cloudflare Turnstile verification for the submit and subscribe forms.
//
// Graceful fallback by design: if TURNSTILE_SECRET_KEY is not set in
// Vercel, verification is skipped and the forms work exactly as before.
// Set TURNSTILE_SITE_KEY (public, NEXT_PUBLIC_ so the browser widget can
// read it) and TURNSTILE_SECRET_KEY in Vercel to switch the check on.
// Keys come from the free Cloudflare Turnstile dashboard; never hardcode
// a key here.
import type { NextRequest } from "next/server";

export type TurnstileResult = { ok: true; skipped: boolean } | { ok: false; reason: string };

export async function verifyTurnstile(req: NextRequest, token: unknown): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (typeof token !== "string" || !token) return { ok: false, reason: "Please complete the human check and try again." };
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = await r.json().catch(() => ({}));
    if (j.success) return { ok: true, skipped: false };
    return { ok: false, reason: "Please complete the human check and try again." };
  } catch {
    return { ok: false, reason: "The human check could not be verified. Please try again." };
  }
}
