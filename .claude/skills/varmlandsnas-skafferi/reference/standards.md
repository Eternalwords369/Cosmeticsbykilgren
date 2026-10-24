# Standarder, affärsregler och acceptance criteria

> **UTKAST.** Originaltexten saknades. Affärsreglerna följer `business.md`;
> siffror som inte står där är markerade *(antagande)*.

## Affärsregler
- **Pengar:** alltid heltal i öre. Aldrig float. Visning via `formatSek`.
- **Moms:** 12 % livsmedel, 25 % övrigt. Priser lagras inkl. moms;
  moms räknas ut som `pris − pris / (1 + sats)`, avrundat per rad.
- **Frakt:** fri över 395 kr (efter rabatt). Under: 79 kr *(antagande)*.
- **Upphämtning:** alltid gratis. Ingen straffavgift för ej uthämtat.
- **Skördefest-förbeställning:** hanteringsavgift 39 kr (`handlingFeeOre`).
- **Retur:** alltid fri. Ångerrätt 14 dagar (ej färskvaror enligt
  distansavtalslagen — ska framgå tydligt).
- **Ordernummer:** `VS-ÅÅÅÅ-NNNNN`, sekventiellt.
- **Lager:** dras först när webhook bekräftar betalning. Slutsålt → köp blockeras.

## Kodstil
- TypeScript strict, inga `any`, inga `@ts-ignore` utan kommentar
- Engelska namn i kod, svensk UI-text endast i `lib/copy/sv.ts`
- Server Actions/route handlers validerar med Zod, delade scheman i `lib/schemas/`
- Komponenter i PascalCase, en komponent per fil
- Inga hemligheter i `NEXT_PUBLIC_*`

## Acceptance criteria per fas
**Fas 0:** `npm run dev` startar; migrering + seed kör utan fel; admin kan
logga in; layout renderar på 375 px och 1280 px; `.env.example` komplett.

**Fas 1:** alla seedade produkter och producenter visas; filter fungerar
via URL-parametrar; slutsåld produkt markeras; sitemap och JSON-LD validerar.

**Fas 2:** testköp i Stripe testläge ger Order `PAID`, korrekt moms och
frakt, lager minskar, mejl skickas; webhook är idempotent; fri frakt slår
till exakt vid 395,00 kr.

**Fas 3:** kartan visar alla aktiva ställen utan API-nyckel; upphämtningsorder
får rätt status och SMS vid `READY_FOR_PICKUP`.

**Fas 4:** oinloggad når inte `/admin`; PRODUCER kan inte se andras data
(testat); återbetalning sätter `REFUNDED`.

**Fas 5:** prenumeration skapas, pausas och avslutas via Stripe och speglas i DB.

**Fas 6:** kampanj syns bara inom datumintervall; `maxQuantity` respekteras;
förbeställning inkluderar 39 kr; nyhetsbrev kräver bekräftelse.

**Fas 7:** Lighthouse ≥ 90; axe utan allvarliga fel; E2E grönt för
frakt- och upphämtningsflöde.
