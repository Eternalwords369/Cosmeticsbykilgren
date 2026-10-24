import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { sv } from "@/lib/copy/sv";
import { mainNav } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <MobileNav />
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight"
          aria-label={sv.nav.home}
        >
          <Image src="/logo.svg" alt="" width={28} height={28} unoptimized />
          {sv.site.name}
        </Link>
        <nav className="ml-6 hidden items-center gap-6 md:flex" aria-label={sv.nav.menu}>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <Button asChild variant="ghost" size="icon" aria-label={sv.nav.cart}>
            <Link href="/varukorg">
              <ShoppingBasket className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
