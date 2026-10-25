import type { MetadataRoute } from "next";
import { getProducerSlugs, getProductSlugs } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, producers] = await Promise.all([getProductSlugs(), getProducerSlugs()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/butik"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/producenter"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/salj-hos-oss"), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...producers.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(`/producenter/${slug}`),
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(`/produkt/${slug}`),
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
