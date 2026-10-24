import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { ShopFilters } from "@/lib/schemas/catalog";

const productSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  story: true,
  priceOre: true,
  vatRate: true,
  unit: true,
  stock: true,
  images: true,
  isSeasonal: true,
  weightGrams: true,
  updatedAt: true,
  category: { select: { slug: true, name: true } },
  producer: { select: { slug: true, name: true, shortDescription: true, heroImageUrl: true } },
} satisfies Prisma.ProductSelect;

export type CatalogProduct = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

const activeProduct = {
  isActive: true,
  producer: { isActive: true },
} satisfies Prisma.ProductWhereInput;

const orderBy: Record<ShopFilters["sortera"], Prisma.ProductOrderByWithRelationInput[]> = {
  name: [{ name: "asc" }],
  "price-asc": [{ priceOre: "asc" }, { name: "asc" }],
  "price-desc": [{ priceOre: "desc" }, { name: "asc" }],
  newest: [{ createdAt: "desc" }, { name: "asc" }],
};

export async function getProducts(filters: ShopFilters): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: {
      ...activeProduct,
      ...(filters.kategori ? { category: { slug: filters.kategori } } : {}),
      ...(filters.producent ? { producer: { slug: filters.producent, isActive: true } } : {}),
    },
    orderBy: orderBy[filters.sortera],
    select: productSelect,
  });
}

export async function getFeaturedProducts(limit = 4): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: { ...activeProduct, stock: { gt: 0 } },
    orderBy: [{ isSeasonal: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: productSelect,
  });
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  return db.product.findFirst({ where: { ...activeProduct, slug }, select: productSelect });
}

export async function getRelatedProducts(
  producerSlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: { ...activeProduct, producer: { slug: producerSlug }, slug: { not: excludeSlug } },
    orderBy: [{ stock: "desc" }, { name: "asc" }],
    take: limit,
    select: productSelect,
  });
}

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  return db.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });
}

const producerSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  longStory: true,
  heroImageUrl: true,
  galleryImages: true,
  address: true,
  latitude: true,
  longitude: true,
  website: true,
  email: true,
  phone: true,
  isSkordefestStation: true,
  stationNumber: true,
  updatedAt: true,
  _count: { select: { products: { where: { isActive: true } } } },
} satisfies Prisma.ProducerSelect;

export type CatalogProducer = Prisma.ProducerGetPayload<{ select: typeof producerSelect }>;

export async function getProducers(): Promise<CatalogProducer[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("producers");

  return db.producer.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: producerSelect,
  });
}

export async function getProducerBySlug(slug: string): Promise<CatalogProducer | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("producers", `producer:${slug}`);

  return db.producer.findFirst({ where: { slug, isActive: true }, select: producerSelect });
}

export async function getProductSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({ where: activeProduct, select: { slug: true, updatedAt: true } });
}

export async function getProducerSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("producers");

  return db.producer.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
}
