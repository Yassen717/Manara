# Manara Architecture

```
Citizen  →  apps/web (Next.js)  →  apps/api (Nest.js)  →  [mock providers → real ministry APIs later]
```

## Apps

- **apps/api** (`:24020`, prefix `/api/v1`, Swagger at `/api/docs`) — 12 feature modules under `src/modules/`:
  - `auth` — national-ID + phone OTP login (mock; dev code `123456`). Sessions via `src/data/sessions.store.ts`.
  - `citizens` — profile read/update + `/reference/municipalities|regions`.
  - `services` — service catalog (~24 bilingual services) + applications workflow (`/services/applications` routes are registered BEFORE `/:slug` so they aren't captured).
  - `documents` — issued digital documents with verification payloads.
  - `requests` — citizen problem reports (power/water/waste/road/telecom) with ticket lifecycle.
  - `notifications` — notification feed.
  - `status` — national service status board + outage schedules.
  - `wallet` — balance + unified transaction ledger (`src/data/transactions.store.ts` shared with utilities).
  - `entitlements` — salary/pension/family-grant/subsidy entitlements + payment history.
  - `utilities` — bills + pay endpoint (writes to the shared transaction ledger).
  - `health` — facilities, medicine availability, appointments.
  - `education` — certificates, exam results by seat, scholarship status.

- **apps/web** (`:24021`) — Next.js App Router. `src/lib` holds the typed API client (`api.ts`), i18n provider (EN/AR + RTL), auth context, shared types and formatting helpers. `src/components/ui` is the design system; `src/components/layout` is navbar/footer. All pages are client components fetching from `lib/api.ts`.

## The integration seam (for real APIs later)

Each module's `*.service.ts` reads/writes module-local `data.ts` mock stores. To integrate a real ministry system:

1. Implement a provider class with the same method signatures (e.g., `RealPassportService implements ServicesService`).
2. Swap the provider binding in `*.module.ts` — controllers and the API contract stay unchanged.
3. Auth: replace `AuthGuard`/`SessionsStore` in `src/common/` with JWT verification against the real identity provider — the `CitizenProfile` shape stays stable.
4. Data: `src/common/types.ts` and `web/src/lib/types.ts` mirror `docs/API_CONTRACT.md`; real integrations must keep these shapes (or version the API).

## Mock identities

- Seed citizen: Ahmed Al-Mansouri, NIN `119880123456` (`src/data/seed.ts`). Any NIN works at login — unknown NINs create a fresh unverified citizen.
