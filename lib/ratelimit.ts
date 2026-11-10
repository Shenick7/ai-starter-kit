import { sql } from "./db";
// Very small DB-backed limiter: max N rows per ip_hash per hour in a table.
export async function tooMany(table: "submissions" | "signups" | "sponsor_inquiries", ip: string, max = 5) {
  const db = sql();
  const [r] = await db.unsafe(`select count(*)::int as n from ${table} where ip_hash=$1 and created_at > now() - interval '1 hour'`, [ip]);
  return r.n >= max;
}
