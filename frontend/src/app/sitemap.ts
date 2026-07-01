import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: siteUrl("/free-analysis"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: siteUrl("/guides/applicant"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: siteUrl("/guides/hr"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: siteUrl("/guides/hiring-manager"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: siteUrl("/guides/company-admin"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
