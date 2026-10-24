import { expect, test } from "@playwright/test";
import { sv } from "../lib/copy/sv";

const SEEDED_PRODUCTS = 26;
const SEEDED_PRODUCERS = 6;

function jsonLdOfType(blocks: string[], type: string) {
  return blocks.map((block) => JSON.parse(block)).find((data) => data["@type"] === type);
}

test("shop lists every seeded product", async ({ page }) => {
  await page.goto("/butik");
  await expect(page.getByTestId("product-card")).toHaveCount(SEEDED_PRODUCTS);
  await expect(page.getByTestId("result-count")).toHaveText(sv.shop.resultCount(SEEDED_PRODUCTS));
});

test("filters live in the URL", async ({ page }) => {
  await page.goto("/butik?kategori=fisk");
  await expect(page.getByTestId("product-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Fisk" })).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "Mejeri & ost" }).click();
  await expect(page).toHaveURL(/kategori=mejeri-ost/);
  await expect(page.getByTestId("product-card")).toHaveCount(4);

  await page.getByLabel(sv.shop.sortLabel).click();
  await page.getByRole("option", { name: sv.shop.sort["price-asc"] }).click();
  await expect(page).toHaveURL(/kategori=mejeri-ost&sortera=price-asc/);
  await expect(page.getByTestId("product-card").first()).toContainText("Gårdsfil");
});

test("empty filter combination offers a way back", async ({ page }) => {
  await page.goto("/butik?kategori=fisk&producent=lillnas-mejeri");
  await expect(page.getByText(sv.shop.emptyTitle)).toBeVisible();
  await page.getByRole("link", { name: sv.shop.clearFilters }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(SEEDED_PRODUCTS);
});

test("sold-out product is marked and cannot be bought", async ({ page }) => {
  await page.goto("/produkt/nasgarden-entrecote");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Entrecôte");
  await expect(page.getByRole("button", { name: sv.product.soldOut })).toBeDisabled();
});

test("product page has valid Product and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto("/produkt/lillnas-lagrad-gardsost");
  await expect(page.getByTestId("product-price")).toHaveText("119 kr");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const product = jsonLdOfType(blocks, "Product");
  expect(product.offers.price).toBe("119.00");
  expect(product.offers.availability).toBe("https://schema.org/InStock");
  expect(product.brand.name).toBe("Lillnäs Mejeri");
  expect(jsonLdOfType(blocks, "BreadcrumbList").itemListElement).toHaveLength(4);
});

test("producers page and detail page with LocalBusiness JSON-LD", async ({ page }) => {
  await page.goto("/producenter");
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(SEEDED_PRODUCERS);

  await page.getByRole("link", { name: "Vänerfisk" }).click();
  await expect(page).toHaveURL(/\/producenter\/vanerfisk$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vänerfisk");
  await expect(page.getByTestId("product-card")).toHaveCount(3);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const business = jsonLdOfType(blocks, "LocalBusiness");
  expect(business.address.postalCode).toBe("661 96");
  expect(business.geo.latitude).toBeCloseTo(59.22);
});

test("unknown product shows not-found and is never indexable", async ({ page }) => {
  // With Partial Prefetching, the first visit to an unlisted slug streams the App Shell (200)
  // and Next.js injects noindex; later visits get a real 404 from the ISR cache.
  const response = await page.goto(`/produkt/finns-inte-${test.info().project.name}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(sv.notFound.title);
  if (response?.status() !== 404) {
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
  }
});

test("sitemap, robots and web app manifest", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/\/produkt\//g)).toHaveLength(SEEDED_PRODUCTS);
  expect(sitemap.match(/\/producenter\/[a-z]/g)).toHaveLength(SEEDED_PRODUCERS);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");

  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain("512x512");
});
