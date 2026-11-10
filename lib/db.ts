import postgres from "postgres";
import { TOOLS, type Tool, type Verdict } from "./tools";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const g = globalThis as unknown as { _sql?: ReturnType<typeof postgres>; _ready?: Promise<void> };

export const hasDb = () => Boolean(url);

export function sql() {
  if (!url) throw new Error("DATABASE_URL not set");
  if (!g._sql) g._sql = postgres(url, { max: Number(process.env.PG_MAX || 3), idle_timeout: 20, prepare: false, ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require" });
  return g._sql;
}

const SCHEMA = `
create table if not exists entries (
  id serial primary key, slug text unique not null, name text not null, url text not null,
  categories text[] not null default '{}', tagline text not null default '', what text not null default '',
  start jsonb not null default '[]', free_plan text not null default '', verdict text not null default 'mostly',
  verdict_note text not null default '', source_url text not null default '', affiliate_url text,
  pick boolean not null default false, status text not null default 'published', created_at timestamptz not null default now());
create table if not exists submissions (
  id serial primary key, name text not null, url text not null, category text, tagline text, free_plan text,
  submitter_email text, ip_hash text, status text not null default 'pending', created_at timestamptz not null default now(), reviewed_at timestamptz);
create table if not exists signups (
  id serial primary key, email text unique not null, source text, ip_hash text, resend_contact_id text, created_at timestamptz not null default now());
create table if not exists zero_result_searches (id serial primary key, query text not null, created_at timestamptz not null default now());
create table if not exists pageviews (id bigserial primary key, path text not null, referrer text, created_at timestamptz not null default now());
create index if not exists pageviews_created_idx on pageviews (created_at);
create table if not exists sponsor_weeks (
  id serial primary key, slot text not null default 'featured', sponsor_name text not null, entry_slug text, go_slug text unique,
  target_url text, headline text, week_start date not null, week_end date not null, price_inr integer not null default 2700,
  status text not null default 'booked', created_at timestamptz not null default now());
create table if not exists sponsor_clicks (id bigserial primary key, slug text not null, sponsor_week_id integer, referrer text, created_at timestamptz not null default now());
create table if not exists sponsor_inquiries (
  id serial primary key, name text not null, email text not null, company text, tool_url text, slot text, message text,
  ip_hash text, created_at timestamptz not null default now());
create table if not exists errors (id bigserial primary key, location text, message text, created_at timestamptz not null default now());
create table if not exists messages (
  id serial primary key, name text not null, email text not null, message text not null,
  ip_hash text, created_at timestamptz not null default now());
`;

export async function ready() {
  if (!hasDb()) return;
  if (!g._ready) {
    g._ready = (async () => {
      const db = sql();
      await db.unsafe(SCHEMA);
      const [{ n }] = await db`select count(*)::int as n from entries`;
      if (n === 0) await seedEntries();
    })().catch((e) => { g._ready = undefined; throw e; });
  }
  return g._ready;
}

export async function seedEntries() {
  const db = sql();
  for (const t of TOOLS) {
    await db`insert into entries (slug,name,url,categories,tagline,what,start,free_plan,verdict,verdict_note,source_url,pick)
      values (${t.slug},${t.name},${t.url},${t.categories},${t.tagline},${t.what},${db.json(t.start)},${t.freePlan},${t.verdict},${t.verdictNote},${t.sourceUrl},${!!t.pick})
      on conflict (slug) do nothing`;
  }
}

export type Entry = Tool & { affiliateUrl?: string | null };

function rowToEntry(r: any): Entry {
  return { slug: r.slug, name: r.name, url: r.url, categories: r.categories, tagline: r.tagline, what: r.what, start: r.start,
    freePlan: r.free_plan, verdict: r.verdict as Verdict, verdictNote: r.verdict_note, sourceUrl: r.source_url, pick: r.pick, affiliateUrl: r.affiliate_url };
}

export async function getEntries(): Promise<Entry[]> {
  if (!hasDb()) return TOOLS;
  try {
    await ready();
    const rows = await sql()`select * from entries where status='published' order by pick desc, name asc`;
    return rows.map(rowToEntry);
  } catch (e) { await logError("getEntries", e); return TOOLS; }
}

export async function getEntry(slug: string) {
  return (await getEntries()).find((e) => e.slug === slug);
}

export async function logError(location: string, e: unknown) {
  console.error(location, e);
  if (!hasDb()) return;
  try { await sql()`insert into errors (location, message) values (${location}, ${String((e as Error)?.message || e).slice(0, 2000)})`; } catch {}
}

export async function activeSponsor(slot: "featured" | "newsletter" | "bar") {
  if (!hasDb()) return null;
  try {
    await ready();
    const rows = await sql()`select * from sponsor_weeks where slot=${slot} and status in ('booked','live')
      and week_start <= current_date and week_end >= current_date order by week_start desc limit 1`;
    return rows[0] || null;
  } catch (e) { await logError("activeSponsor", e); return null; }
}
