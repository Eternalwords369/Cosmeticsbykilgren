# Värmlandsnäs Skafferi

Hyperlokal e-handel för matproducenter på Värmlandsnäs. Byggs i faser, se
`.claude/skills/varmlandsnas-skafferi/` och `.skafferi/state.json`.

## Kom igång

```bash
cp .env.example .env        # fyll i DATABASE_URL, NEXTAUTH_SECRET, SEED_ADMIN_*
npm install
npx prisma migrate dev      # skapar tabeller
npm run db:seed             # fiktiva producenter + admin
npm run dev                 # http://localhost:3000
```

## Kontroller

```bash
npm run lint && npm run typecheck && npm run test && npm run build
npm run test:e2e            # kräver build + seedad databas
```

Admin: `/admin/login` med `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
