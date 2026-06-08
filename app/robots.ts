import type { MetadataRoute } from "next";
import { site } from "@/data/content";

/**
 * robots.txt for Xandrea Harshey Services Inc.
 *
 * Rules applied:
 * - All public pages allowed for standard crawlers and AI search crawlers.
 * - AI search/citation crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
 *   PerplexityBot, Google-Extended) are explicitly granted full access so
 *   the site appears in AI Overviews, ChatGPT Browse, Perplexity, and
 *   Bing Copilot citations.
 * - CCBot (Common Crawl / training data harvester) is blocked — this blocks
 *   bulk training ingestion without affecting AI search visibility.
 * - API routes are disallowed for all crawlers: they return JSON, not HTML;
 *   indexing them wastes crawl budget and exposes internal endpoints.
 * - Sitemap declaration uses the live production URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // --- AI Search & Citation Crawlers (allow all public content) ---
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: "/api/",
      },
      // --- Bulk Training Harvesters (block — does not affect AI search) ---
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      // --- Default: allow all public pages, block API routes ---
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
