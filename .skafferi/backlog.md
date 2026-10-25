# Backlog

## P0

## P1

- 2026-10-25 — Anslutning: godkänd lead → skapa `Producer` + första `Product` och en PRODUCER-inloggning (Fas 4); länk till Stripe Connect-onboarding i godkännandemejlet (Fas 2).
- 2026-10-25 — Anslutning: sätt `EMAIL_FROM` (verifierad domän i Resend), `EMAIL_REPLY_TO` (en bevakad inkorg), `ONBOARDING_SENDER_NAME` och `CRON_SECRET` i Vercel innan sidan marknadsförs.
- 2026-10-25 — Socialt bevis på /salj-hos-oss (antal riktiga producenter, citat med tillstånd) när de första är live. Inte innan.

- 2026-10-24 — Motorn (Fas 2): anropa `recordProducerOrders` från Stripe-webhooken; Stripe Connect Express-onboarding per producent (`stripeAccountId`); transfer per `Payout` → `PAID`.
- 2026-10-24 — Motorn (Fas 2/4): räkna `views`/`purchases`/`unitsSold` i `ProductDailyStat`; nattlig cron (`CRON_SECRET`) som kör prognos, påfyllnadsråd och planråd; sortering "Populärt" och "Passar ihop med" i butiken; avräkningar och planråd i producentens admin.
- 2026-10-24 — Låt revisor bekräfta momsrollen (förmedlare med Stripe Connect eller kommissionär) innan Stripe går live.

- 2026-10-24 — Lokal leveransrunda en fast veckodag i Säffle och Åmål (Fas 3, tillägg till Click & Collect): ny `FulfillmentType` `LOCAL_DELIVERY`, postnummerkontroll, en leveransdag i kassan, körlista för admin.
- 2026-10-24 — Byt lösenord i admin (Fas 4), så att det genererade adminlösenordet kan ersättas.

- 2026-10-24 — Byt fiktiva producenter i seed mot riktiga (med godkännande) före lansering.
- 2026-10-24 — Ersätt platshållarbilder (`public/placeholders/`) med riktiga foton. Lägg till `images.remotePatterns` för Blob/Storage i `next.config.ts`.

## P2

- 2026-10-24 — Offline-stöd för webbappen (service worker), om det efterfrågas.
- 2026-10-24 — Riktig 404 redan vid första besöket på okänd slug (existenskontroll i `proxy.ts`).
