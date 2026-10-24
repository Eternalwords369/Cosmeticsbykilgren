import Link from "next/link";
import { CatalogImage } from "@/components/catalog/catalog-image";
import { Badge } from "@/components/ui/badge";
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
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-sm">
          {producer.stationNumber ? (
            <Badge variant="secondary">{sv.producers.station(producer.stationNumber)}</Badge>
          ) : null}
          <span className="text-muted-foreground">
            {sv.producers.productCount(producer._count.products)}
          </span>
        </div>
      </div>
    </article>
  );
}
