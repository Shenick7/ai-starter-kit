import { createHash, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export const SITE_NAME = "AI Starter Kit";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")).replace(/\/$/, "");
export const FEATURED_PRICE_USD = 29;
export const FEATURED_PRICE_INR = 2700; // approx $29 at ~93.9 INR/USD on 2026-11-10, rounded
export const FEATURED_PRICE_LABEL = "$29/month (about ₹2,700)";
export const OWNER_EMAIL = "jainshenick@gmail.com"; // the only address the site may ever notify

export function ipHash(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  // Salt for the IP hashes used in rate limiting. Set IP_HASH_SALT in Vercel
  // (Project Settings → Environment Variables) to a long random string, and
  // keep it the same across deploys: changing it changes every IP hash, so
  // all rate-limit counters reset. It falls back to ADMIN_TOKEN, then to the
  // literal "salt", only so the site keeps working before the variable is
  // set — that fallback is not private, so set IP_HASH_SALT.
  const salt = process.env.IP_HASH_SALT || process.env.ADMIN_TOKEN || "salt";
  return createHash("sha256").update(ip + salt).digest("hex").slice(0, 32);
}

export function isAdmin(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN || "";
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token || !got) return false;
  const a = Buffer.from(token), b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function clean(v: unknown, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function isHttpUrl(v: string) {
  try { const u = new URL(v); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; }
}
