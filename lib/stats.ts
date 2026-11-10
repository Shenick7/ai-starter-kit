import { hasDb, ready, sql, logError } from "./db";

export type Stats = { pageviews30d: number; pageviewsAll: number; subscribers: number; tools: number; sponsorClicks30d: number; since: string | null };

export async function getStats(): Promise<Stats> {
  const empty: Stats = { pageviews30d: 0, pageviewsAll: 0, subscribers: 0, tools: 0, sponsorClicks30d: 0, since: null };
  if (!hasDb()) return empty;
  try {
    await ready();
    const [r] = await sql()`select
      (select count(*)::int from pageviews where created_at > now() - interval '30 days') as pv30,
      (select count(*)::int from pageviews) as pvall,
      (select count(*)::int from signups) as subs,
      (select count(*)::int from entries where status='published') as tools,
      (select count(*)::int from sponsor_clicks where created_at > now() - interval '30 days') as clicks30,
      (select min(created_at) from pageviews) as since`;
    return { pageviews30d: r.pv30, pageviewsAll: r.pvall, subscribers: r.subs, tools: r.tools, sponsorClicks30d: r.clicks30, since: r.since ? new Date(r.since).toISOString().slice(0, 10) : null };
  } catch (e) { await logError("getStats", e); return empty; }
}
