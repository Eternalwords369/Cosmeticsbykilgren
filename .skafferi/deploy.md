# Publicering (Vercel + Supabase)

## Status

- [x] Supabase-projekt `varmlandsnas-skafferi` (ref `ppfgrvkrssozqconoqme`, eu-north-1, Stockholm)
- [x] Migreringar `init` + `enable_rls` körda och registrerade i `_prisma_migrations`
- [x] Katalogdata (kategorier, producenter, produkter, upphämtningsställen, lådor, kampanj, rabattkod) — inlagd 2026-10-24
- [ ] Admin-konto (kör `npm run db:seed` med `DATABASE_URL` + `SEED_ADMIN_*`)
- [ ] Vercel-projekt + produktionsdeploy (användaren importerar repot i Vercels gränssnitt, team AKXA STUDIO)

## Behövs i miljön (cloud-miljöns inställningar → Edit)

| Variabel              | Var den finns                                                                 |
| --------------------- | ----------------------------------------------------------------------------- |
| `VERCEL_TOKEN`        | vercel.com → Account Settings → Tokens                                        |
| `DATABASE_URL`        | Supabase → projektet → Connect → **Session pooler** (port 5432), med lösenord |
| `SEED_ADMIN_EMAIL`    | Din admin-e-post                                                              |
| `SEED_ADMIN_PASSWORD` | Ett starkt lösenord (minst 16 tecken)                                         |

## Steg för nästa session

1. `npm ci` (kör `prisma generate`)
2. `npx prisma migrate status` — ska säga att databasen är i synk
3. `npm run db:seed`
4. `npx vercel@latest link --yes --token "$VERCEL_TOKEN" --project varmlandsnas-skafferi`
5. Sätt env i Vercel (production + preview): `DATABASE_URL`, `NEXTAUTH_SECRET` (`openssl rand -base64 32`),
   `NEXT_PUBLIC_SITE_NAME`
6. `npx vercel@latest deploy --prod --token "$VERCEL_TOKEN"`
7. Sätt `NEXT_PUBLIC_SITE_URL` och `NEXTAUTH_URL` till produktions-URL:en och deploya igen (canonical, sitemap, OG)
8. Röktest mot produktions-URL: Playwright med `PLAYWRIGHT_BASE_URL` (läs-tester: smoke + catalog)

## Noter

- Bygget förrenderar sidor och behöver därför `DATABASE_URL` även vid build.
- `vercel-build` kör `prisma migrate deploy` före `next build`; nya migreringar går ut automatiskt.
- Region `arn1` (Stockholm) ligger nära databasen.
