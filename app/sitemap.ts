import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { getEntries } from "@/lib/db";
import { SITE_URL } from "@/lib/util";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed = ["", "/learn", "/search", "/submit", "/sponsor"].map((p) => ({ url: SITE_URL + p, lastModified: now }));
  const cats = CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: now }));
  const guides = GUIDES.map((g) => ({ url: `${SITE_URL}/learn/${g.slug}`, lastModified: now }));
  const tools = (await getEntries()).map((t) => ({ url: `${SITE_URL}/tools/${t.slug}`, lastModified: now }));
  return [...fixed, ...cats, ...guides, ...tools];
}
