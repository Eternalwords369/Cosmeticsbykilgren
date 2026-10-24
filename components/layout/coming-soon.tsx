import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";

export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">{title}</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold">{sv.comingSoon.title}</h1>
      <p className="mt-4 text-muted-foreground">{sv.comingSoon.text}</p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/">{sv.comingSoon.back}</Link>
      </Button>
    </section>
  );
}
