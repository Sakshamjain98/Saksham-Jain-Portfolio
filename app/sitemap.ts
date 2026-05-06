import type { MetadataRoute } from "next";

import { getProjectSlugs } from "@/lib/cms/projects";
import { getPostSlugs } from "@/lib/cms/blog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sakshamjain.codes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
  ]);

  const now = new Date();

  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...projectSlugs.map((slug) => ({
      url: `${SITE}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...postSlugs.map((slug) => ({
      url: `${SITE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
