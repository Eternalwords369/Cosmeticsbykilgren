import Link from "next/link";
import { ProducerCard } from "@/components/catalog/producer-card";
import { ProductGrid } from "@/components/catalog/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts, getProducers } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";
import { organizationJsonLd } from "@/lib/seo";

export default async function HomePage() {
  const [featured, producers] = await Promise.all([getFeaturedProducts(4), getProducers()]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <section className="border-b bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {sv.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{sv.home.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/butik">{sv.home.heroCta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/producenter">{sv.home.heroSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {sv.home.featuredTitle}
          </h2>
          <Link href="/butik" className="shrink-0 text-sm underline-offset-4 hover:underline">
            {sv.home.featuredLink}
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {sv.home.pillars.map((pillar) => (
            <div key={pillar.title}>
              <h2 className="font-heading text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-2 text-muted-foreground">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            {sv.home.producersTitle}
          </h2>
          <Link href="/producenter" className="shrink-0 text-sm underline-offset-4 hover:underline">
            {sv.home.producersLink}
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {producers.slice(0, 3).map((producer) => (
            <li key={producer.id} className="flex">
              <ProducerCard producer={producer} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
