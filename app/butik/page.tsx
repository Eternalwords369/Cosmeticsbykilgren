import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/catalog/product-card";
import { ShopSortFilter } from "@/components/catalog/shop-sort-filter";
import { Button } from "@/components/ui/button";
import { getCategories, getProducers, getProducts } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { parseShopFilters, shopHref } from "@/lib/schemas/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: sv.shop.title,
  description: sv.shop.intro,
  alternates: { canonical: "/butik" },
};

export default function ShopPage({ searchParams }: PageProps<"/butik">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{sv.shop.title}</h1>
        <p className="mt-3 text-muted-foreground">{sv.shop.intro}</p>
      </header>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function ShopContent({ searchParams }: Pick<PageProps<"/butik">, "searchParams">) {
  const filters = parseShopFilters(await searchParams);
  const [products, categories, producers] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getProducers(),
  ]);

  return (
    <>
      <nav aria-label={sv.shop.categoryLabel} className="-mx-4 mt-8 overflow-x-auto px-4">
        <ul className="flex gap-2 pb-1">
          {[{ slug: undefined, name: sv.shop.allCategories }, ...categories].map((category) => {
            const active = filters.kategori === category.slug;
            return (
              <li key={category.slug ?? "all"} className="shrink-0">
                <Link
                  href={shopHref({ ...filters, kategori: category.slug })}
                  aria-current={active ? "page" : undefined}
                  scroll={false}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <ShopSortFilter
          filters={filters}
          producers={producers.map(({ slug, name }) => ({ slug, name }))}
        />
        <p className="text-sm text-muted-foreground" aria-live="polite" data-testid="result-count">
          {sv.shop.resultCount(products.length)}
        </p>
      </div>

      <div className="mt-8">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center">
            <h2 className="font-heading text-xl font-semibold">{sv.shop.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">{sv.shop.emptyText}</p>
            <Button asChild className="mt-6">
              <Link href="/butik">{sv.shop.clearFilters}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="mt-8" aria-busy="true">
      <span className="sr-only">{sv.shop.loading}</span>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 border-t pt-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-square animate-pulse rounded-lg bg-muted" />
            <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
