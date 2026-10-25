import type { Metadata } from "next";
import { EarningsCalculator } from "@/components/onboarding/earnings-calculator";
import { SignupForm } from "@/components/onboarding/signup-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";

const copy = sv.sell;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/salj-hos-oss" },
  openGraph: { title: copy.metaTitle, description: copy.metaDescription, url: "/salj-hos-oss" },
};

export default function SellPage() {
  return (
    <>
      <section className="border-b bg-secondary/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{copy.heroText}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a href="#anmalan">{copy.heroCta}</a>
              </Button>
              <span className="text-sm text-muted-foreground">{copy.heroNote}</span>
            </div>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{copy.stepsTitle}</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <p className="text-sm text-muted-foreground">
                {index + 1} · {step.time}
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
          {[
            { title: copy.weDoTitle, items: copy.weDo },
            { title: copy.youDoTitle, items: copy.youDo },
          ].map((column) => (
            <div key={column.title}>
              <h2 className="font-heading text-xl font-semibold">{column.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{copy.faqTitle}</h2>
          <Accordion type="single" collapsible className="mt-6">
            {copy.faq.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div id="anmalan" className="scroll-mt-24 rounded-xl border bg-card p-6">
          <h2 className="font-heading text-2xl font-semibold">{copy.form.title}</h2>
          <p className="mt-2 mb-6 text-muted-foreground">{copy.form.text}</p>
          <SignupForm />
        </div>
      </section>
    </>
  );
}
