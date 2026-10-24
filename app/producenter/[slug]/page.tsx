import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogImage } from "@/components/catalog/catalog-image";
import { ProductGrid } from "@/components/catalog/product-card";
import { Story } from "@/components/content/story";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProducerBySlug, getProducerSlugs, getProducts } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { absoluteUrl, breadcrumbJsonLd, producerJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const producers = await getProducerSlugs();
  return producers.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/producenter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const producer = await getProducerBySlug(slug);
  if (!producer) return {};

  return {
    title: producer.name,
    description: producer.shortDescription,
    alternates: { canonical: `/producenter/${producer.slug}` },
    openGraph: {
      title: producer.name,
      description: producer.shortDescription,
      url: `/producenter/${producer.slug}`,
      images: [absoluteUrl(producer.heroImageUrl)],
    },
  };
}

export default async function ProducerPage({ params }: PageProps<"/producenter/[slug]">) {
  const { slug } = await params;
  const producer = await getProducerBySlug(slug);
  if (!producer) notFound();

  const products = await getProducts({ producent: producer.slug, sortera: "name" });
  const crumbs = [
    { name: sv.breadcrumbs.home, href: "/" },
    { name: sv.producers.title, href: "/producenter" },
    { name: producer.name, href: `/producenter/${producer.slug}` },
  ];

  return (
    <article className="pb-16">
      <JsonLd data={producerJsonLd(producer)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <div className="relative h-56 bg-muted sm:h-80">
        <CatalogImage src={producer.heroImageUrl} alt="" sizes="100vw" priority />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6">
          <Breadcrumbs items={crumbs} />
        </div>

        <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">{producer.name}</h1>
            <p className="mt-3 text-xl text-muted-foreground">{producer.shortDescription}</p>
            {producer.stationNumber ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {sv.producers.station(producer.stationNumber)}
              </p>
            ) : null}
            <div className="mt-8">
              <Story>{producer.longStory}</Story>
            </div>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-5 text-sm">
            <h2 className="font-heading text-lg font-semibold">{sv.producers.contactTitle}</h2>
            <address className="mt-2 not-italic text-muted-foreground">{producer.address}</address>
            <dl className="mt-4 space-y-2">
              {producer.website ? (
                <div>
                  <dt className="text-muted-foreground">{sv.producers.website}</dt>
                  <dd>
                    <a
                      href={producer.website}
                      className="underline underline-offset-4"
                      rel="noopener"
                    >
                      {producer.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              {producer.email ? (
                <div>
                  <dt className="text-muted-foreground">{sv.producers.email}</dt>
                  <dd>
                    <a href={`mailto:${producer.email}`} className="underline underline-offset-4">
                      {producer.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {producer.phone ? (
                <div>
                  <dt className="text-muted-foreground">{sv.producers.phone}</dt>
                  <dd>
                    <a href={`tel:${producer.phone}`} className="underline underline-offset-4">
                      {producer.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>

        {producer.galleryImages.length > 0 ? (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {producer.galleryImages.map((image, index) => (
              <li
                key={`${image}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
              >
                <CatalogImage src={image} alt="" sizes="(min-width: 640px) 33vw, 50vw" />
              </li>
            ))}
          </ul>
        ) : null}

        <section className="mt-16 border-t pt-12">
          <h2 className="font-heading text-2xl font-semibold">
            {sv.producers.productsTitle(producer.name)}
          </h2>
          <div className="mt-6">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <p className="text-muted-foreground">{sv.producers.noProducts}</p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
