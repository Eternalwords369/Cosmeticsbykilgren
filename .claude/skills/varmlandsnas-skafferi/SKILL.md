---
name: varmlandsnas-skafferi
description: Bygger och vidareutvecklar e-handelsplattformen Värmlandsnäs Skafferi — en hyperlokal e-handel för lokala matproducenter i Säffle/Värmlandsnäs-regionen, positionerad mot breda aktörer som Rekoshoppen. Använd denna skill när användaren vill starta bygget, fortsätta en pågående fas, lägga till funktioner (produkter, prenumerationer, Click & Collect, kampanjer som Skördefesten, admin, karta), eller felsöka/reviewa befintlig kod i projektet. Triggas av "Värmlandsnäs Skafferi", "skafferi", "rekoshoppen-konkurrent", "skördefesten", "bygg e-handeln", "fortsätt fasen", "next phase".
---

# Värmlandsnäs Skafferi — Build Orchestrator

Du är lead engineer för ett produktionsklart e-handelsprojekt. Projektet byggs
i **faser** med **hårda quality gates** mellan varje fas. Hela kontexten finns
i `reference/` — läs bara det du behöver för aktuell fas.

## Steg 1 — Detektera state

Kör följande innan du gör något annat:

1. Läs `.skafferi/state.json` i projektets rot om den finns.
2. Om den **inte** finns: detta är ett nytt projekt → gå till Steg 2.
3. Om den **finns**: läs `currentPhase` och `completedPhases`. Gå till Steg 3.

Format på `.skafferi/state.json`:

```json
{
  "currentPhase": 0,
  "completedPhases": [],
  "decisions": [],
  "lastUpdated": "2026-01-15T10:00:00Z"
}
```

## Steg 2 — Nytt projekt

Om inget state finns:

1. Bekräfta med användaren: "Inget befintligt projekt hittades. Jag startar
   Fas 0 (Foundation) i en tom katalog. OK?"
2. Läs `templates/new-project-init.md` och följ den exakt.
3. Läs `reference/tech-stack.md` innan du installerar något.
4. När Fas 0 är klar: skriv `.skafferi/state.json` med `currentPhase: 1`,
   `completedPhases: [0]` och committa med `git commit -m "phase-0: foundation"`.

## Steg 3 — Fortsätt befintligt projekt

1. Läs `currentPhase` från state-filen.
2. Läs `reference/phases.md` för att se vad nästa fas ska bygga.
3. Läs relevanta reference-filer (se Reference-map nedan).
4. Kör `git status` — om det finns ocommittade ändringar, varna användaren
   och fråga om de vill committa, stash:a eller fortsätta.
5. Verifiera att föregående fas fortfarande fungerar:
   `npm run lint && npm run build && npm run test`.
6. Om verifieringen misslyckas: felsök innan du går vidare.
7. Bygg nästa fas enligt `reference/phases.md`.
8. Quality gate — se Steg 4.

## Steg 4 — Quality gate (obligatorisk mellan varje fas)

Innan en fas kan markeras klar MÅSTE alla dessa passera:

- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run build` — lyckas utan varningar
- [ ] `npm run test` — alla tester gröna
- [ ] Alla acceptance criteria för fasen i `reference/standards.md`
- [ ] Manuellt röktest av det som byggdes (beskriv stegen för användaren)
- [ ] `git commit -m "phase-N: <kort beskrivning>"` skapad

Om något misslyckas: stoppa. Rapportera exakt vad som gick fel och vad
du föreslår. Fortsätt inte förrän användaren godkänner.

Vid godkänd gate, uppdatera `.skafferi/state.json`:

```json
{
  "currentPhase": "N+1",
  "completedPhases": [0, 1, "...", "N"],
  "decisions": ["...behåll befintliga..."],
  "lastUpdated": "<nu>"
}
```

## Steg 5 — Session-avslut

Avsluta ALLTID varje session med:

1. **Vad som byggdes** — kort punktlista.
2. **Exakta kommandon för att testa** — kopieringsbara.
3. **Nya env-variabler** (om några).
4. **Nästa fas** — en mening om vad som kommer.
5. **Kända issues / TODOs** — transparent.
6. Fråga: "Ska jag fortsätta med Fas N+1 nu, eller vill du testa först?"

## Reference-map (läs vid behov, inte allt på en gång)

| Behöver du veta… | Läs |
|---|---|
| Affärsidé, konkurrenter, målgrupp, ton | `reference/business.md` |
| Paket, versioner, bibliotek, deployment | `reference/tech-stack.md` |
| Prisma-schema, modeller, relationer | `reference/data-model.md` |
| Vad varje fas ska bygga — exakt | `reference/phases.md` |
| Seed-innehåll (producenter, produkter) | `reference/seed-data.md` |
| Affärsregler (moms, frakt, retur), kodstil, acceptance criteria per fas | `reference/standards.md` |

## Grundprinciper (gäller alltid)

1. **Svenska i UI, engelska i kod.** All användartext via `lib/copy/sv.ts`.
   Inga hårdkodade svenska strängar i komponenter.
2. **Server Components som default.** Client Components bara vid behov
   (formulär, cart, interaktiva widgets).
3. **Inga hemligheter på klientsidan.** Alla Stripe-anrop server-side.
4. **Zod-validering på alla mutations.** Dela scheman mellan klient och server.
5. **Ångra aldrig en fungerande fas.** Lägg nya funktioner bakom feature
   flags om de kan bryta befintligt.
6. **Dokumentera beslut.** Varje icke-trivialt val läggs i
   `.skafferi/state.json` under `decisions[]` med motivering.
7. **Fråga innan du gissar** om något oklart påverkar arkitekturen.
   Gissa bara på detaljnivå.

## Om användaren ber om något utanför faserna

1. Klassificera: hör det hemma i en befintlig fas (tidigare eller kommande),
   eller är det nytt scope?
2. Tidigare, redan klar fas: bygg som "fas N.1"-patch, kör quality gate, committa.
3. Kommande fas: förklara vilken fas det tillhör och fråga om användaren vill
   hoppa dit eller lägga det i backlog.
4. Helt nytt scope: lägg det i `.skafferi/backlog.md` med prioritet (P0/P1/P2)
   och datum. Bygg det INTE nu om det inte uppenbart hör till aktuell fas.

## Om något går sönder

1. Kör `git log --oneline -5` för att se senaste commits.
2. Fel i senaste fasen och liten fix: rätta och committa som
   `phase-N: fix <beskrivning>`.
3. Strukturellt fel (t.ex. fel datamodell): fråga användaren om
   `git reset --hard <senaste fungerande commit>` är OK innan du fortsätter.
