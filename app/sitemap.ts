import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/tools";
import { COMPARISONS } from "@/lib/compare";
import { GUIDES } from "@/lib/guides";
import { PROMPT_CATEGORIES } from "@/lib/prompts";
import { getEntries } from "@/lib/db";
import { SITE_URL } from "@/lib/util";

export const revalidate = 3600;

// lastModified only changes when a page's content changes. Existing pages
// date from the launch (10 Nov 2026); pages added or changed in Phase 1
// (About, Privacy, Terms, and the new guides) use 13 Nov 2026. Never use
// the current date here — claiming every page changed at once teaches
// crawlers to ignore the signal.
const LAUNCH = new Date("2026-11-10T00:00:00.000Z");
const PHASE_1 = new Date("2026-11-13T00:00:00.000Z");
const PHASE_2 = new Date("2026-11-13T00:00:00.000Z");
const PHASE_3 = new Date("2026-11-14T00:00:00.000Z");
const PHASE_5 = new Date("2026-11-14T00:00:00.000Z");

const FIXED: [string, Date][] = [
  ["", LAUNCH],
  ["/learn", PHASE_1],
  ["/search", LAUNCH],
  ["/submit", PHASE_3],
  ["/sponsor", PHASE_3],
  ["/contact", LAUNCH],
  ["/about", PHASE_1],
  ["/privacy", PHASE_1],
  ["/terms", PHASE_1],
  ["/tools", PHASE_2],
  ["/compare", PHASE_3],
  ["/prompts", PHASE_5],
  ["/prompts/generator", PHASE_5],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = FIXED.map(([p, lastModified]) => ({ url: SITE_URL + p, lastModified }));
  const cats = CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: PHASE_3 }));
  const guides = GUIDES.map((g) => ({ url: `${SITE_URL}/learn/${g.slug}`, lastModified: g.updated ? new Date(g.updated) : LAUNCH }));
  const tools = (await getEntries()).map((t) => ({ url: `${SITE_URL}/tools/${t.slug}`, lastModified: PHASE_3 }));
  const compares = COMPARISONS.map((c) => ({ url: `${SITE_URL}/compare/${c.slug}`, lastModified: PHASE_3 }));
  const promptCats = PROMPT_CATEGORIES.map((c) => ({ url: `${SITE_URL}/prompts/${c.slug}`, lastModified: PHASE_5 }));
  return [...fixed, ...cats, ...guides, ...tools, ...compares, ...promptCats];
}
