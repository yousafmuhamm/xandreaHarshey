import type { MetadataRoute } from "next";
import { nav, site } from "@/data/content";

/** Auto-generated XML sitemap from the nav routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return nav.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
