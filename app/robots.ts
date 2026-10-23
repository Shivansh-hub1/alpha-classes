import type { MetadataRoute } from "next";
import { siteBaseUrlHttps } from "@/lib/seo";

export const dynamic = "force-dynamic";

const DISALLOWED_ROUTES = ["/api/", "/dashboard", "/admin", "/_next/"];

const ALLOWED_ROUTES = [
  "/",
  "/courses",
  "/courses/*",
  "/tests",
  "/tests/*",
  "/materials",
  "/blog",
  "/blog/*",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
];

export default function robots(): MetadataRoute.Robots {
  const site = siteBaseUrlHttps();
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ALLOWED_ROUTES,
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: "*",
        allow: ALLOWED_ROUTES,
        disallow: DISALLOWED_ROUTES,
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
