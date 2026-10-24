import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold">{sv.notFound.title}</h1>
      <p className="mt-4 text-muted-foreground">{sv.notFound.text}</p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/">{sv.comingSoon.back}</Link>
      </Button>
    </section>
  );
}
