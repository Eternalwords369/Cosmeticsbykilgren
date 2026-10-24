import type { CatalogProducer, CatalogProduct } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { oreToKronor } from "@/lib/money";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** "Näsgården 1, 661 91 Säffle" → schema.org PostalAddress parts */
export function parseSwedishAddress(address: string) {
  const [street, rest = ""] = address.split(",").map((part) => part.trim());
  const match = rest.match(/^(\d{3}\s?\d{2})\s+(.+)$/);
  return {
    streetAddress: street,
    postalCode: match?.[1],
    addressLocality: match?.[2] ?? rest,
    addressCountry: "SE",
  };
}

export function productJsonLd(product: CatalogProduct) {
  const url = absoluteUrl(`/produkt/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map(absoluteUrl),
    url,
    sku: product.slug,
    category: product.category.name,
    brand: { "@type": "Brand", name: product.producer.name },
    ...(product.weightGrams
      ? {
          weight: { "@type": "QuantitativeValue", value: product.weightGrams, unitCode: "GRM" },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "SEK",
      price: oreToKronor(product.priceOre).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: sv.site.name, url: siteUrl },
    },
  };
}

export function producerJsonLd(producer: CatalogProducer) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl(`/producenter/${producer.slug}#business`),
    name: producer.name,
    description: producer.shortDescription,
    image: [producer.heroImageUrl, ...producer.galleryImages].map(absoluteUrl),
    url: absoluteUrl(`/producenter/${producer.slug}`),
    address: { "@type": "PostalAddress", ...parseSwedishAddress(producer.address) },
    geo: { "@type": "GeoCoordinates", latitude: producer.latitude, longitude: producer.longitude },
    ...(producer.website ? { sameAs: [producer.website] } : {}),
    ...(producer.email ? { email: producer.email } : {}),
    ...(producer.phone ? { telephone: producer.phone } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: sv.site.name,
    url: siteUrl,
    logo: absoluteUrl("/icons/icon-512.png"),
    description: sv.site.description,
  };
}
