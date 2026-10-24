import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogImage } from "@/components/catalog/catalog-image";
import { ProductGrid } from "@/components/catalog/product-card";
import { StockBadge } from "@/components/catalog/stock-badge";
import { Story } from "@/components/content/story";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { formatSek } from "@/lib/money";
import { shopHref } from "@/lib/schemas/catalog";
import { absoluteUrl, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getProductSlugs();
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produkt/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} från ${product.producer.name}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/produkt/${product.slug}` },
    openGraph: {
      title,
      description: product.description,
      url: `/produkt/${product.slug}`,
      images: product.images.map((image) => absoluteUrl(image)),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/produkt/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.producer.slug, product.slug);
  const soldOut = product.stock <= 0;
  const crumbs = [
    { name: sv.breadcrumbs.home, href: "/" },
    { name: sv.shop.title, href: "/butik" },
    { name: product.category.name, href: shopHref({ kategori: product.category.slug }) },
    { name: product.name, href: `/produkt/${product.slug}` },
  ];

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <CatalogImage
            src={product.images[0] ?? "/placeholders/product.svg"}
            alt={product.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <Link
            href={`/producenter/${product.producer.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {sv.product.from} {product.producer.name}
          </Link>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StockBadge stock={product.stock} showInStock />
            {product.isSeasonal ? <Badge variant="outline">{sv.product.seasonal}</Badge> : null}
          </div>

          <p className="mt-6">
            <span className="text-3xl font-semibold" data-testid="product-price">
              {formatSek(product.priceOre)}
            </span>
            <span className="ml-2 text-muted-foreground">
              {product.unit} · {sv.product.inclVat}
            </span>
          </p>

          <p className="mt-6 text-lg leading-relaxed">{product.description}</p>

          <div className="mt-8">
            {/* TODO: real cart (Fas 2) */}
            <Button size="lg" className="w-full sm:w-auto" disabled>
              {soldOut ? sv.product.soldOut : sv.product.addToCart}
            </Button>
            {!soldOut ? (
              <p className="mt-2 text-sm text-muted-foreground">{sv.product.cartSoon}</p>
            ) : null}
          </div>

          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t pt-6 text-sm">
            <dt className="text-muted-foreground">{sv.product.unit}</dt>
            <dd>{product.unit}</dd>
            {product.weightGrams ? (
              <>
                <dt className="text-muted-foreground">{sv.product.weight}</dt>
                <dd>{sv.product.grams(product.weightGrams)}</dd>
              </>
            ) : null}
            <dt className="text-muted-foreground">{sv.product.category}</dt>
            <dd>
              <Link
                href={shopHref({ kategori: product.category.slug })}
                className="underline-offset-4 hover:underline"
              >
                {product.category.name}
              </Link>
            </dd>
            <dt className="text-muted-foreground">{sv.product.vat}</dt>
            <dd>{sv.product.percent(product.vatRate)}</dd>
          </dl>
        </div>
      </div>

      <section className="mt-16 grid gap-10 border-t pt-12 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-heading text-2xl font-semibold">
            {product.story
              ? sv.product.storyTitle
              : sv.product.aboutProducer(product.producer.name)}
          </h2>
          <div className="mt-4">
            <Story>{product.story ?? product.producer.shortDescription}</Story>
          </div>
        </div>
        <aside className="rounded-xl border bg-card p-5">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
            <CatalogImage
              src={product.producer.heroImageUrl}
              alt=""
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold">{product.producer.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.producer.shortDescription}</p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href={`/producenter/${product.producer.slug}`}>
              {sv.product.readProducerStory}
            </Link>
          </Button>
        </aside>
      </section>

      {related.length > 0 ? (
        <section className="mt-16 border-t pt-12">
          <h2 className="font-heading text-2xl font-semibold">
            {sv.product.moreFrom(product.producer.name)}
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
