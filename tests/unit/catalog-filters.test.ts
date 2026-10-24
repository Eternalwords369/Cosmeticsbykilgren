import { describe, expect, it } from "vitest";
import { parseShopFilters, shopHref } from "@/lib/schemas/catalog";

describe("parseShopFilters", () => {
  it("defaults to name sort without filters", () => {
    expect(parseShopFilters({})).toEqual({
      kategori: undefined,
      producent: undefined,
      sortera: "name",
    });
  });

  it("reads valid params and takes the first of repeated params", () => {
    expect(
      parseShopFilters({
        kategori: ["fisk", "mejeri-ost"],
        producent: "vanerfisk",
        sortera: "price-asc",
      }),
    ).toEqual({ kategori: "fisk", producent: "vanerfisk", sortera: "price-asc" });
  });

  it("drops invalid values instead of throwing", () => {
    expect(parseShopFilters({ kategori: "<script>", producent: "ÅÄÖ", sortera: "random" })).toEqual(
      { kategori: undefined, producent: undefined, sortera: "name" },
    );
  });
});

describe("shopHref", () => {
  it("omits defaults", () => {
    expect(shopHref({ sortera: "name" })).toBe("/butik");
  });

  it("builds a stable query string", () => {
    expect(shopHref({ kategori: "fisk", producent: "vanerfisk", sortera: "newest" })).toBe(
      "/butik?kategori=fisk&producent=vanerfisk&sortera=newest",
    );
  });
});
