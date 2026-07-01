import type { MetadataRoute } from "next";

import { defaultSiteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/free-analysis",
          "/guides/applicant",
          "/guides/hr",
          "/guides/hiring-manager",
          "/guides/company-admin",
        ],
        disallow: [
          "/applicant/login",
          "/applicant/portal",
          "/applicant/setup",
          "/employer/",
          "/agency/",
          "/hr/",
          "/hiring_manager/",
          "/platform/",
          "/ui",
          "/backend/",
        ],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: defaultSiteUrl,
  };
}
