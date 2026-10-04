import type { MetadataRoute } from "next";
import { getCourses, getTests } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-classes.vercel.app";

  let courseUrls: MetadataRoute.Sitemap = [];
  let testUrls: MetadataRoute.Sitemap = [];
  try {
    const [courses, tests] = await Promise.all([getCourses(), getTests()]);
    courseUrls = courses.map((c) => ({ url: `${site}/courses/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }));
    testUrls = tests.map((t) => ({ url: `${site}/tests/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.6 }));
  } catch {
    // database not reachable at generation time — static URLs still ship
  }

  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/tests`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/materials`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ...courseUrls,
    ...testUrls,
  ];
}
