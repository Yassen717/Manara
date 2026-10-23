# Manara — منارة

**Government-as-a-Service (GaaS) citizen portal for Libya.** One digital front-door for identity, documents, payments, utilities, health, and education services — designed from research on the 99 documented pain points Libyan citizens face (see `libya-problems.json` / `libya-research-summary.md`).

## Stack

- `apps/web` — Next.js 15 + TypeScript + Tailwind (bilingual EN/AR, RTL-aware)
- `apps/api` — Nest.js 11 REST API with Swagger docs and mock data providers (swap-in seams for real ministry systems)

## Run locally

```bash
npm run install:all        # installs both apps
cd apps/api && copy .env.example .env
cd ../web  && copy .env.example .env.local
npm run dev:api            # backend on http://localhost:24020 (docs: /api/docs)
npm run dev:web            # frontend on http://localhost:24021
```

Demo login: any national ID number + `123456` as OTP.

## Docs

- `docs/API_CONTRACT.md` — the API contract (authoritative)
- `docs/CONVENTIONS.md` — engineering conventions
- `docs/ARCHITECTURE.md` — module map and how to integrate real APIs
