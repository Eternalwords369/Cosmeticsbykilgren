import Link from "next/link";
import { CatalogImage } from "@/components/catalog/catalog-image";
import { StockBadge } from "@/components/catalog/stock-badge";
import { Badge } from "@/components/ui/badge";
import type { CatalogProduct } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { formatSek } from "@/lib/money";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const soldOut = product.stock <= 0;

  return (
    <article className="group relative flex w-full flex-col" data-testid="product-card">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <CatalogImage
          src={product.images[0] ?? "/placeholders/product.svg"}
          alt=""
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            "transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none",
            soldOut && "opacity-60",
          )}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <StockBadge stock={product.stock} />
          {product.isSeasonal ? (
            <Badge variant="outline" className="bg-background/90">
              {sv.product.seasonal}
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-muted-foreground">{product.producer.name}</p>
        <h3 className="mt-0.5 font-medium leading-snug">
          <Link href={`/produkt/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-2 text-sm">
          <span className="font-semibold">{formatSek(product.priceOre)}</span>
          <span className="text-muted-foreground"> · {product.unit}</span>
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
