import { SITE_NAME, SITE_URL } from "./util";
import type { Guide } from "./guides";

export type BreadcrumbItem = { name: string; url: string };

function context(data: Record<string, unknown>): Record<string, unknown> {
  return { "@context": "https://schema.org", ...data };
}

/** WebSite with a search action, for the homepage. */
export function websiteJsonLd() {
  return context({
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Beginner-friendly AI tools sorted by task, with plain-English how-to-start steps and honest answers on whether the free plan is enough.",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
}

/** ItemList of tools, for the homepage picks and category pages. */
export function itemListJsonLd(items: { name: string; url: string }[]) {
  return context({
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  });
}

/** Breadcrumb trail, for tool, category and guide pages. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return context({
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  });
}

export type ToolJsonLdInput = {
  slug: string;
  name: string;
  tagline: string;
  url: string;
  categories: readonly string[];
  verdict: string;
};

/**
 * SoftwareApplication for a tool page. A free-plan offer is only included
 * when the tool actually has a free plan (verdict "yes" or "mostly");
 * no price is ever invented.
 */
export function softwareApplicationJsonLd(
  t: ToolJsonLdInput,
  categoryLabel: string,
) {
  const hasFreePlan = t.verdict === "yes" || t.verdict === "mostly";
  return context({
    "@type": "SoftwareApplication",
    name: t.name,
    description: t.tagline,
    url: `${SITE_URL}/tools/${t.slug}`,
    applicationCategory: categoryLabel,
    operatingSystem: "Web",
    sameAs: t.url,
    isAccessibleForFree: hasFreePlan,
    ...(hasFreePlan
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } }
      : {}),
  });
}

/** Article for a Learn guide page. */
export function articleJsonLd(g: Guide) {
  return context({
    "@type": "Article",
    headline: g.title,
    description: g.description,
    author: { "@type": "Person", name: "Shenick Jain", url: "https://x.com/Shenick_7" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    datePublished: g.updated ?? "2026-11-10",
    mainEntityOfPage: `${SITE_URL}/learn/${g.slug}`,
  });
}
