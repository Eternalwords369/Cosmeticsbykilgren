import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "@/lib/catalog";
import { parseSwedishAddress, productJsonLd } from "@/lib/seo";
import { stockStatus } from "@/lib/stock";

const product: CatalogProduct = {
  id: "p1",
  slug: "lagrad-ost",
  name: "Lagrad gårdsost",
  description: "Nötig och kristallig.",
  story: null,
  priceOre: 11900,
  vatRate: 12,
  unit: "ca 300 g",
  stock: 0,
  images: ["/placeholders/product.svg"],
  isSeasonal: false,
  weightGrams: 300,
  updatedAt: new Date("2026-10-01"),
  category: { slug: "mejeri-ost", name: "Mejeri & ost" },
  producer: {
    slug: "lillnas-mejeri",
    name: "Lillnäs Mejeri",
    shortDescription: "Gårdsost.",
    heroImageUrl: "/placeholders/producer.svg",
  },
};

describe("parseSwedishAddress", () => {
  it("splits street, postal code and town", () => {
    expect(parseSwedishAddress("Lillnäs 4, 661 92 Säffle")).toEqual({
      streetAddress: "Lillnäs 4",
      postalCode: "661 92",
      addressLocality: "Säffle",
      addressCountry: "SE",
    });
  });
});

describe("productJsonLd", () => {
  it("describes price in SEK and availability", () => {
    const data = productJsonLd(product);
    expect(data["@type"]).toBe("Product");
    expect(data.offers.price).toBe("119.00");
    expect(data.offers.priceCurrency).toBe("SEK");
    expect(data.offers.availability).toBe("https://schema.org/OutOfStock");
    expect(data.image[0]).toMatch(/^https?:\/\/.+\/placeholders\/product\.svg$/);
  });
});

describe("stockStatus", () => {
  it("classifies stock levels", () => {
    expect(stockStatus(0)).toBe("sold-out");
    expect(stockStatus(5)).toBe("low");
    expect(stockStatus(6)).toBe("in-stock");
  });
});
