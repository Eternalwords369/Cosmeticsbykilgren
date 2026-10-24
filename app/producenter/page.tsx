import type { Metadata } from "next";
import { ProducerCard } from "@/components/catalog/producer-card";
import { getProducers } from "@/lib/catalog";
import { sv } from "@/lib/copy/sv";

export const metadata: Metadata = {
  title: sv.producers.title,
  description: sv.producers.intro,
  alternates: { canonical: "/producenter" },
};

export default async function ProducersPage() {
  const producers = await getProducers();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{sv.producers.title}</h1>
        <p className="mt-3 text-muted-foreground">{sv.producers.intro}</p>
      </header>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {producers.map((producer) => (
          <li key={producer.id} className="flex">
            <ProducerCard producer={producer} />
          </li>
        ))}
      </ul>
    </section>
  );
}
