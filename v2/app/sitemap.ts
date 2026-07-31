import type { MetadataRoute } from "next";
import { articles, areas, projects, categories } from "@/lib/content";

const SITE_BASE = "https://panamarealestateguide.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_BASE}/`, changeFrequency: "daily", priority: 1.0 },
    ...categories.map((c) => ({
      url: `${SITE_BASE}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_BASE}/${a.categorySlug}/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE_BASE}/areas/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_BASE}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...articleRoutes, ...areaRoutes, ...projectRoutes];
}
