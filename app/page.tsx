import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sv } from "@/lib/copy/sv";

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-muted/30">
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
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {sv.home.pillars.map((pillar) => (
          <Card key={pillar.title}>
            <CardHeader>
              <CardTitle className="font-heading text-xl">{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{pillar.text}</CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
