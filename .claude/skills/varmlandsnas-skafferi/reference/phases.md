# Faser — exakt vad som byggs i varje

Kör en fas per session. Quality gate i SKILL.md Steg 4 gäller efter varje.

> **UTKAST från Fas 0 punkt 7 och framåt.** Originaltexten klipptes av.
> Fas 0 punkt 1–6 är original. Resten är rekonstruerat ur `business.md`,
> `data-model.md` och `tech-stack.md`. Granska och ersätt med originalet om det finns.

## Fas 0 — Foundation
**Mål:** Ett tomt men fungerande Next.js-projekt med databas, auth, grundlayout.

1. Scaffold: `npx create-next-app@latest . --typescript --tailwind --app --eslint`
2. Installera shadcn/ui: `npx shadcn@latest init` — välj Neutral, CSS vars
3. Lägg till komponenter: button, input, card, dialog, form, select, textarea,
   toast, badge, sheet, tabs, accordion, table, dropdown-menu
4. Prisma: initiera, lägg in hela schemat från `data-model.md`,
   kör `npx prisma migrate dev --name init`
5. Skapa `prisma/seed.ts` enligt `seed-data.md`
6. Sätt upp NextAuth med Credentials provider för AdminUser
7. Grundlayout: header (logo, nav: Butik, Producenter, Hämta lokalt,
   Prenumeration, Om oss; cart-ikon), footer (villkor, fri retur, kontakt,
   nyhetsbrev-placeholder)
8. `lib/copy/sv.ts` med all UI-text, `lib/money.ts` (öre ↔ kr, `formatSek`)
9. Vitest + Playwright konfigurerat, ett röktest per verktyg
10. husky + lint-staged, `.env.example` med alla variabler från `tech-stack.md`

## Fas 1 — Katalog & producenter
- `/butik` med filtrering på kategori och producent, sortering
- `/produkt/[slug]` med bilder, pris inkl. moms, enhet, lagerstatus,
  producentkort och produktens berättelse
- `/producenter` och `/producenter/[slug]` med lång berättelse och galleri
- SEO: metadata, Open Graph, JSON-LD (Product, LocalBusiness), sitemap

## Fas 2 — Cart & checkout
- Zustand-cart med persistens, cart-sheet
- Checkout: kunduppgifter, välj frakt eller upphämtning
- Stripe Checkout Session (kort, Klarna, Swish), webhook → Order `PAID`
- Lagerreservation vid betalning, `productSnapshot` på OrderItem
- Orderbekräftelse via Resend + React Email
- Rabattkoder (`DiscountCode`)

## Fas 3 — Click & Collect + karta
- Leaflet-karta över producenter och upphämtningsställen
- Välj upphämtningsställe i checkout, öppettider, instruktioner
- Statusflöde `PREPARING` → `READY_FOR_PICKUP` → `COMPLETED`
- SMS-avisering "redo att hämta" (46elks/Twilio)

## Fas 4 — Admin
- Inloggning (NextAuth), roller ADMIN / PRODUCER
- CRUD för produkter, producenter, kategorier, upphämtningsställen
- Orderlista, statusbyte, återbetalning via Stripe
- PRODUCER ser och redigerar bara sina egna produkter och ordrar
- Bilduppladdning (Vercel Blob / Supabase Storage)

## Fas 5 — Prenumerationer
- `SubscriptionBox`-sidor, Stripe Subscriptions
- Webhooks för status (`ACTIVE`, `PAUSED`, `PAST_DUE`, `CANCELLED`)
- Kundens egen sida via Stripe Customer Portal (pausa, avsluta)
- Cron (skyddad med `CRON_SECRET`) för `nextDeliveryDate` och påminnelser

## Fas 6 — Kampanjer & Skördefesten
- `Campaign` med `CampaignProduct`, kampanjpris och maxantal
- `/skordefesten`: förbeställning (`PreOrder`) med hämtning på station,
  hanteringsavgift 39 kr, stationskarta
- Nedräkning, aktivering via `startsAt`/`endsAt`
- Nyhetsbrev med double opt-in (`NewsletterSubscriber`)

## Fas 7 — Lansering
- Plausible/Umami, Lighthouse ≥ 90 på alla kategorier
- Tillgänglighet WCAG 2.1 AA, E2E för hela köpflödet
- Juridiska sidor (köpvillkor, integritetspolicy, cookie-fri analys)
- Vercel-produktion, Stripe live-läge, domän, felövervakning
