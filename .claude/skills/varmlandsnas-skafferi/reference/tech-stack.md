# Tech stack — exakta val

## Kärna
- **Framework:** Next.js 14+ (App Router), TypeScript strict
- **Styling:** Tailwind CSS + shadcn/ui
- **Databas:** PostgreSQL (Supabase eller Neon) + Prisma ORM
- **Auth:** NextAuth.js (endast admin i v1)
- **Betalning:** Stripe (Checkout Sessions) + Klarna + Swish via Stripe
- **E-post:** Resend + React Email
- **SMS:** 46elks eller Twilio (valfritt i v1, krävs i Fas 3)
- **Karta:** Leaflet + OpenStreetMap (inga API-nycklar)
- **Bilder:** Vercel Blob eller Supabase Storage
- **Hosting:** Vercel
- **Analytics:** Plausible eller Umami (cookie-fri)

## Dev-verktyg
- **Test:** Vitest + React Testing Library (unit), Playwright (E2E)
- **Lint:** ESLint + Prettier, pre-commit hooks via husky + lint-staged
- **Validering:** Zod
- **Formulär:** react-hook-form + zodResolver
- **State:** Zustand för cart, Server Components för allt annat
- **Datum:** date-fns med svensk locale
- **Markdown:** react-markdown + remark-gfm

## Miljövariabler

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=Värmlandsnäs Skafferi
CRON_SECRET=
SMS_API_KEY=            # valfri, Fas 3
SMS_API_USER=           # valfri, Fas 3
BLOB_READ_WRITE_TOKEN=
```

## Krav innan Fas 0
Användaren måste ha skapat:
1. PostgreSQL-databas (Supabase/Neon) och kopierat `DATABASE_URL`
2. Stripe-konto (testläge OK) med testnycklar
3. Resend-konto (gratis 3 000 mail/mån)

Saknar användaren något: be dem skaffa det först, eller använd
mock-läge i Fas 0 (kommentera koden med `// TODO: real <tjänst>`).

## Versionspolicy
- Lås major-versioner. Använd senaste stabila minor.
- `npm install` får inte introducera kända sårbarheter (audit = 0 high/critical).
- Inga beta- eller RC-paket i produktion.
