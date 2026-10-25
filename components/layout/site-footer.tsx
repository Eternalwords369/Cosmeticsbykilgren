import Link from "next/link";
import { CopyrightYear } from "@/components/layout/copyright-year";
import { sv } from "@/lib/copy/sv";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <h2 className="font-heading text-base font-semibold">{sv.footer.promisesTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {sv.footer.promises.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold">{sv.footer.infoTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/kopvillkor" className="text-muted-foreground hover:text-foreground">
                {sv.footer.terms}
              </Link>
            </li>
            <li>
              <Link href="/integritet" className="text-muted-foreground hover:text-foreground">
                {sv.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/salj-hos-oss" className="text-muted-foreground hover:text-foreground">
                {sv.sell.nav}
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="text-muted-foreground hover:text-foreground">
                {sv.footer.contact}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold">{sv.footer.newsletterTitle}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{sv.footer.newsletterText}</p>
          {/* TODO: real newsletter signup (Fas 6) */}
          <p className="mt-2 text-sm italic text-muted-foreground">{sv.footer.newsletterSoon}</p>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          <CopyrightYear />
        </p>
      </div>
    </footer>
  );
}
