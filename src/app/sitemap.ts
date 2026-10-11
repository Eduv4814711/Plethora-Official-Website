import type { MetadataRoute } from "next";
import { siteConfig } from "../lib/site-config.ts";
import { getPublishedArticles } from "../lib/blog.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/product",
    "/solutions",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-10-11"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Include published blog articles only — drafts are strictly excluded
  const publishedArticles = getPublishedArticles().map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...publishedArticles];
}
