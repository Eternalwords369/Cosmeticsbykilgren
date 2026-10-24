import { sv } from "@/lib/copy/sv";

export const mainNav = [
  { href: "/butik", label: sv.nav.shop },
  { href: "/producenter", label: sv.nav.producers },
  { href: "/hamta-lokalt", label: sv.nav.pickup },
  { href: "/prenumeration", label: sv.nav.subscription },
  { href: "/om-oss", label: sv.nav.about },
] as const;
