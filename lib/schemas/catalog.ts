import { z } from "zod";

export const sortOptions = ["name", "price-asc", "price-desc", "newest"] as const;
export type SortOption = (typeof sortOptions)[number];

const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .max(80);

/** Parses shop URL params. Invalid values fall back to "no filter" instead of erroring. */
export const shopFiltersSchema = z.object({
  kategori: slug.optional().catch(undefined),
  producent: slug.optional().catch(undefined),
  sortera: z.enum(sortOptions).catch("name").default("name"),
});

export type ShopFilters = z.infer<typeof shopFiltersSchema>;

export function parseShopFilters(params: Record<string, string | string[] | undefined>) {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  return shopFiltersSchema.parse({
    kategori: first(params.kategori),
    producent: first(params.producent),
    sortera: first(params.sortera),
  });
}

export function shopHref(filters: Partial<ShopFilters>) {
  const params = new URLSearchParams();
  if (filters.kategori) params.set("kategori", filters.kategori);
  if (filters.producent) params.set("producent", filters.producent);
  if (filters.sortera && filters.sortera !== "name") params.set("sortera", filters.sortera);
  const query = params.toString();
  return query ? `/butik?${query}` : "/butik";
}
