import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { guard } from "@/lib/admin";
import { revalidatePath } from "next/cache";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

// POST { id, action: "approve" | "reject", overrides?: { slug, tagline, what, start[], free_plan, verdict, verdict_note, source_url, categories[] } }
export async function POST(req: NextRequest) {
  const g = await guard(req); if (g) return g;
  const j = await req.json().catch(() => ({}));
  const id = Number(j.id), action = j.action;
  if (!id || !["approve", "reject"].includes(action)) return NextResponse.json({ error: "need id and action approve|reject" }, { status: 400 });
  const db = sql();
  const [s] = await db`select * from submissions where id=${id}`;
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (action === "reject") {
    await db`update submissions set status='rejected', reviewed_at=now() where id=${id}`;
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  const o = j.overrides || {};
  const slug = slugify(o.slug || s.name);
  const [e] = await db`insert into entries (slug,name,url,categories,tagline,what,start,free_plan,verdict,verdict_note,source_url)
    values (${slug}, ${o.name || s.name}, ${s.url}, ${o.categories || [s.category]}, ${o.tagline || s.tagline}, ${o.what || s.tagline},
      ${db.json(o.start || [])}, ${o.free_plan || s.free_plan || "Check the tool's website for current plans."}, ${o.verdict || "mostly"},
      ${o.verdict_note || "Free-plan details supplied by the maker; verify on their site."}, ${o.source_url || s.url})
    on conflict (slug) do nothing returning slug`;
  if (!e) return NextResponse.json({ error: `an entry with slug "${slug}" already exists; pass overrides.slug` }, { status: 409 });
  await db`update submissions set status='approved', reviewed_at=now() where id=${id}`;
  try { revalidatePath("/", "layout"); } catch {}
  return NextResponse.json({ ok: true, status: "approved", slug });
}
