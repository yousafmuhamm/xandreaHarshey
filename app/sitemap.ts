import type { MetadataRoute } from "next";
import { site } from "@/data/content";

/**
 * Sitemap for Xandrea Harshey Services Inc.
 *
 * Rules applied:
 * - changeFrequency and priority are omitted — both are explicitly ignored by
 *   Google (confirmed in Google I/O 2023 + Search Central docs). Keeping them
 *   adds noise without any crawl benefit.
 * - lastModified uses real, stable dates rather than `new Date()` (runtime
 *   "now"). A lastmod that changes on every build/request is treated as
 *   unreliable by Google and may cause unnecessary re-crawls.
 * - Homepage URL is explicitly https://www.xandreaharshey.com (no trailing
 *   slash) to match the canonical declared in layout.tsx and the metadataBase.
 * - API routes (/api/*) are excluded — they are not indexable pages.
 * - /not-found is excluded — it returns a 404 and must never appear in a sitemap.
 */

type SitemapEntry = {
  url: string;
  lastModified: string;
};

const pages: SitemapEntry[] = [
  // Homepage — core brand destination, updated most frequently
  { url: site.url, lastModified: "2026-06-06" },

  // Core section pages — ordered by crawl priority / topical importance
  { url: `${site.url}/about`,      lastModified: "2026-06-01" },
  { url: `${site.url}/companies`,  lastModified: "2026-06-01" },
  { url: `${site.url}/leadership`, lastModified: "2026-06-01" },
  { url: `${site.url}/services`,   lastModified: "2026-06-01" },
  { url: `${site.url}/projects`,   lastModified: "2026-06-01" },
  { url: `${site.url}/safety`,     lastModified: "2026-06-01" },
  { url: `${site.url}/careers`,    lastModified: "2026-06-01" },
  { url: `${site.url}/contact`,    lastModified: "2026-06-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ url, lastModified }) => ({
    url,
    lastModified,
  }));
}
