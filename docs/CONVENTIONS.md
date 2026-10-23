# Manara Engineering Conventions

Project: **Manara** (منارة — "lighthouse") — a Government-as-a-Service citizen portal for Libya. Next.js 15 (App Router) + Nest.js 11. All data is currently MOCK data served by Nest modules; the architecture must allow swapping mock providers for real ministry APIs later without changing controllers or the frontend.

## Directory map

```
apps/api        Nest.js backend (port 24020, prefix /api/v1, swagger /api/docs)
apps/web        Next.js frontend (port 24021)
docs/           API_CONTRACT.md (authoritative), this file
libya-problems.json / libya-research-summary.md   research dataset driving features
```

## Non-negotiable rules for subagents

1. **Own only your assigned paths.** Never touch: `package.json`, lockfiles, `tsconfig*`, `nest-cli.json`, `next.config.*`, `tailwind.config.*`, `globals.css`, `app.module.ts`, `main.ts`, `src/lib/*`, `src/components/ui/*`, `src/components/layout/*`, `src/app/layout.tsx`, another module's/route's files, `docs/`.
2. **Do NOT install packages.** Everything needed is already installed. If you think you need a dependency, implement without it.
3. **Do NOT start dev servers.** Ports are reserved. Verify with `npm run build` (backend: `cd apps/api && npm run build`; frontend: `cd apps/web && npm run build`) and fix your own errors.
4. **No new top-level folders** outside your ownership list.
5. Follow `docs/API_CONTRACT.md` exactly — same paths, same response shapes, same type names.

## Backend patterns (Nest.js)

- One Nest feature module per folder under `src/modules/<name>/`: `<name>.module.ts` (class name `<Name>Module` — DO NOT rename; AppModule already imports it), `<name>.controller.ts`, `<name>.service.ts`, `dto/`, and `data.ts` for mock seed data.
- Mock data lives in module-local `data.ts` (exported typed arrays/objects). Services read/write these in-memory structures. Wrap access so a real provider can replace it later (service methods are the seam — never let controllers touch data.ts directly).
- DTOs use `class-validator` decorators for request bodies.
- Protected routes use `AuthGuard` from `src/common/auth.guard.ts` via `@UseGuards(AuthGuard)`; get the citizen via `@CurrentCitizen() citizen: CitizenProfile` (decorator in `src/common/current-citizen.decorator.ts`). The mock guard accepts any token issued by AuthService and resolves the citizen from `src/data/seed.ts`.
- Swagger: decorate with `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`, `@ApiResponse` — keep tags = module name.
- Arabic fields: for every user-facing string field add the `Ar`-suffixed twin (nameAr etc.). Arabic text should be real Arabic, not transliteration.

## Frontend patterns (Next.js App Router, TypeScript, Tailwind)

- Pages: `src/app/<route>/page.tsx`. Feature components: `src/components/<domain>/*.tsx`. NEVER create files in `components/ui/` or `components/layout/` or `lib/` — use what's there.
- Data fetching: call `lib/api.ts` typed methods inside `'use client'` components with `useEffect`+state (this is a mock-data SPA-style portal — client components everywhere is intended). Guard against missing backend: api helpers already handle errors; show `EmptyState`/skeletons on failure.
- Shared UI: `components/ui/` exports `Button`, `Card`, `Badge`, `StatusPill`, `Input`, `Select`, `Stat`, `SectionTitle`, `PageHeader`, `Skeleton`, `EmptyState`, `Tabs`, `Modal`, `FieldLabel`, `Spinner`. USE these — do not rebuild primitives.
- i18n: `useLanguage()` from `lib/i18n.tsx` gives `{ lang, setLang, t, isRtl }`. Chrome strings come from `t('key')`. Page-specific text: inline `lang === 'ar' ? 'نص عربي' : 'English text'` or the `pick(lang, en, ar)` helper. Always render Arabic fields as `nameAr` when lang==='ar', else `name`.
- Auth: `useAuth()` from `lib/auth.tsx` gives `{ token, citizen, login, logout, ready }`. Pages needing auth should redirect to `/login` when `ready && !token`. Token lives in localStorage key `manara_token`.
- Brand: colors via Tailwind tokens (`primary`, `sand`, `gold`, `ink`); font via `font-sans` (Cairo handles both Latin+Arabic). RTL is automatic via `dir` on `<html>` — use logical spacing utilities where directional (ms-/me-, ps-/pe- preferred over ml-/mr-).
- Icons: inline SVGs only (no icon libs installed). `components/ui/icons.tsx` has a set of brand icons — use/add nothing there; define page-local SVG components inside your own domain components if you need more.

## Commit discipline

The parent agent commits. Agents do not run git commands.
