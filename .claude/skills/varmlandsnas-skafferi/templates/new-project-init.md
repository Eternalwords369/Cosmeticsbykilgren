# Init av nytt projekt (Fas 0)

> **UTKAST.** Originaltexten saknades. Rekonstruerad ur SKILL.md och phases.md.

1. Kontrollera att katalogen är tom (utom `.git`). Är den inte det: fråga.
2. Kontrollera Node ≥ 20 och npm (`node -v`, `npm -v`).
3. Fråga efter `DATABASE_URL`, Stripe-testnycklar och `RESEND_API_KEY`.
   Saknas något: kör mock-läge och markera med `// TODO: real <tjänst>`.
4. Följ Fas 0 i `reference/phases.md` punkt för punkt.
5. Skapa `.skafferi/state.json`:
   ```json
   { "currentPhase": 0, "completedPhases": [], "decisions": [], "lastUpdated": "<nu>" }
   ```
6. Skapa `.skafferi/backlog.md` med rubrikerna `## P0`, `## P1`, `## P2`.
7. Lägg till i `.gitignore`: `.env*` (utom `.env.example`), `node_modules`, `.next`.
8. Logga första besluten i `decisions[]` (val av databasleverantör, mock-lägen).
9. Kör quality gate (SKILL.md Steg 4), sätt `currentPhase: 1`,
   `completedPhases: [0]`, committa `phase-0: foundation`.
