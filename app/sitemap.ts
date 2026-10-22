import type { MetadataRoute } from "next";
import { getCourses, getTests } from "@/lib/db";
import { CANONICAL_SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = CANONICAL_SITE_URL;
  const now = new Date();

  let courseUrls: MetadataRoute.Sitemap = [];
  let testUrls: MetadataRoute.Sitemap = [];

  try {
    const [courses, tests] = await Promise.all([getCourses(), getTests()]);
    courseUrls = courses.map((c) => ({
      url: `${site}/courses/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
    testUrls = tests.map((t) => ({
      url: `${site}/tests/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    // If DB is offline during build/sitemap query, fallback static pages still generate
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${site}/courses`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${site}/tests`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${site}/materials`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${site}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticRoutes, ...courseUrls, ...testUrls];
}
