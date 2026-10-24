import Link from "next/link";
import { CatalogImage } from "@/components/catalog/catalog-image";
import type { CatalogProducer } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";

export function ProducerCard({ producer }: { producer: CatalogProducer }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-[3/2] bg-muted">
        <CatalogImage
          src={producer.heroImageUrl}
          alt=""
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-semibold">
          <Link href={`/producenter/${producer.slug}`} className="after:absolute after:inset-0">
            {producer.name}
          </Link>
        </h3>
        <p className="mt-2 text-muted-foreground">{producer.shortDescription}</p>
        <p className="mt-auto pt-4 text-sm text-muted-foreground">
          {producer.stationNumber ? `${sv.producers.station(producer.stationNumber)} · ` : null}
          {sv.producers.productCount(producer._count.products)}
        </p>
      </div>
    </article>
  );
}
