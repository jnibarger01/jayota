# Jayota

Hendrick Toyota Merriam dealer showroom — Vite + React + TanStack, with
**PGlite** for local/preview data and typed adapters for inventory, offers, and
leads. See [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md) for external providers
and fail-closed fallbacks.

## Prerequisites

- **Node.js 24** (matches `.github/workflows/pages.yml`)
- npm (lockfile is `package-lock.json`)

## Quick start

```bash
npm ci
npm run dev
```

Dev server: `http://127.0.0.1:8080/` (bound to `0.0.0.0:8080`).

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Vite dev server via `scripts/with-app-env.mjs` |
| `npm run build` | Production build, copy PGlite assets, run DB migrations |
| `npm test` | Unit tests (`node --test`) |
| `npm run build:pages` | Static GitHub Pages artifact (base `/jayota/`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:auth` | Auth invariant vs a live `npm run dev` server |
| `npm run preview` | Preview the production build |
| `npm run test:mobile-nav` | Mobile tab bar Playwright smoke (needs a live server) |
| `npm run preview:pages` | Vite preview of `build:pages` static output at `/jayota/` |
| `npm run test:pages-base` | Fetch smoke: index + JS/CSS under Pages base return 200 |

Always start Vite through the npm scripts above. Invoking `vite` directly skips
`scripts/with-app-env.mjs`, so `VITE_AUTH_ENABLED` can diverge between the live
dev server and the next build (sign-in present in one, absent in the other).
`npm run check:auth` compares them when the dev server is up.

## GitHub Pages

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

- Site: **https://jnibarger01.github.io/jayota/**
- Vite `base` / router basepath: `/jayota/` when `GITHUB_PAGES=1`
- Local Pages build: `npm run build:pages` → `.vercel/output/static`

### Pages base-path asset smoke

Fetch check that the static Pages artifact resolves under `/jayota/` (wrong Vite
`base` → JS/CSS 404 → CI fails). Uses a Nitro-free Vite preview config so the
server mirrors GitHub Pages subpath hosting.

| Context | How |
| ------- | --- |
| Local | `npm run build:pages`, then `npm run preview:pages`, then `npm run test:pages-base` |
| PR CI | [`.github/workflows/pr-ci.yml`](.github/workflows/pr-ci.yml) runs `build:pages`, starts preview on `:4175` with [`vite.pages-preview.config.mjs`](vite.pages-preview.config.mjs), then [`scripts/pages-base-asset-smoke.mjs`](scripts/pages-base-asset-smoke.mjs) |

PR CI does **not** deploy Pages; deploy stays on push to `main` via `pages.yml`.

## PGlite persistence & backup

Without `DATABASE_URL`, the app uses embedded **PGlite** for showroom tables
(configurations, leads, etc. — see `migrations/0002_showroom.sql`).

| Mode | Location | Survives process restart? |
| ---- | -------- | ------------------------- |
| Default (preview/dev) | In-memory WASM PGDATA | No — refresh/restart wipes data |
| Optional FS | Directory from `PGLITE_DATA_DIR` (recommended: `.pglite-data`) | Yes |
| Production | Neon via `DATABASE_URL` | Yes (managed Postgres) |

**Export / import** (round-trip via `dumpDataDir` / `loadDataDir`):

```bash
# Helpers: src/lib/pglite-backup.ts (unit-tested)

# Optional CLI against a filesystem data dir (never commit these files):
PGLITE_DATA_DIR=.pglite-data npm run db:backup            # → backups/pglite-*.tgz
PGLITE_DATA_DIR=.pglite-data npm run db:restore -- backups/pglite-….tgz
```

`.pglite-data/`, `backups/`, and `*.pglite.tgz` are gitignored. Do not commit live
DBs or dump tarballs.

## Showroom API rate limits

Configuration writes (`POST`/`PATCH`/`DELETE` `/api/v1/configurations`) and related
showroom/intake surfaces share an in-process sliding-window limiter
(`src/lib/http/rate-limit.ts`). Defaults stop a burst client from unbounded-writing
showroom rows; cold starts reset the buckets (single-isolate only — not a shared edge
limiter).

| Knob | Default | Applies to |
| ---- | ------- | ---------- |
| `SHOWROOM_RATE_LIMIT_CONFIG_WRITE` | `30` | Configuration create/update/delete |
| `SHOWROOM_RATE_LIMIT_CATALOG_READ` | `300` | Catalog/query reads (when wired) |
| `SHOWROOM_RATE_LIMIT_LEAD_WRITE` | `8` | Lead / appointment intakes |
| `SHOWROOM_RATE_LIMIT_SEARCH` | `60` | Search-style endpoints |
| `SHOWROOM_RATE_LIMIT_WINDOW_MS` | `60000` | Sliding window length (ms) |

Exceeded requests return HTTP **429** with structured JSON and a `Retry-After` header:

```json
{ "error": { "code": "rate_limited", "status": 429, "message": "…" } }
```

Helpers: `enforceConfigWriteRateLimit` / `enforceCatalogReadRateLimit` in
`src/showroom/server/rateLimit.ts`. Unit coverage: `src/lib/http/rate-limit.test.ts`
(burst → 429).

## Mobile-nav smoke

Interactive Playwright check for the mobile tab bar (`scripts/mobile-nav-smoke.mjs`).

| Context | How |
| ------- | --- |
| Local (dev) | `npm run dev`, then `npm run test:mobile-nav` (hits `http://127.0.0.1:8080/`) |
| Local (preview) | `npm run build && npm run preview`, then `node scripts/mobile-nav-smoke.mjs http://127.0.0.1:8081/` |
| PR CI | [`.github/workflows/pr-ci.yml`](.github/workflows/pr-ci.yml) builds, starts `vite preview` on `:8081`, runs the smoke |

A broken mobile-nav selector fails that CI job (non-zero exit from the smoke).

### Refreshing selectors

Keep these three places in sync when the tab bar markup changes:

1. **DOM hooks** in [`src/components/layout/MobileTabBar.tsx`](src/components/layout/MobileTabBar.tsx) — `data-mobile-tabbar="true"`, `data-mobile-more-search="true"`, tab `href`s / `aria-label`s, and the More sheet heading/link names the smoke clicks.
2. **Contract constants** in [`src/lib/mobile-nav.ts`](src/lib/mobile-nav.ts) — `MOBILE_TABBAR_SELECTOR`, `MOBILE_TABS` / `MOBILE_TAB_HREFS`, `MOBILE_MORE_LINKS` (unit-tested by `src/lib/mobile-nav.test.ts`).
3. **Smoke locators** in [`scripts/mobile-nav-smoke.mjs`](scripts/mobile-nav-smoke.mjs) — `TABS`, `[data-mobile-tabbar="true"]`, `[data-mobile-more-search]`, and role/name queries (`More`, `Garage`, search placeholder).

After editing, re-run the unit test (`npm test` covers `mobile-nav.test.ts`) and the smoke against a live server.

## Images & generated art

| Location | Tracked? | Purpose |
| -------- | -------- | ------- |
| `public/images/`, `public/renders/`, `public/models/` | Yes | Small committed set the app ships (campaign, lineup, 3D assets) |
| `artifacts/imagine_images/` | No (gitignored) | Local Imagine / agent image dumps — do not commit |
| `artifacts/.tmp/` | No (gitignored) | Scratch MCP / tool output |

New imagine dumps belong under `artifacts/imagine_images/` only. Copy any asset the product must ship into `public/` and reference it from there. History is not rewritten; previously committed dumps are removed from the index only (`git rm --cached`).

## More docs

- Integrations & env vars: [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md)
- Sandbox / auth / data contract: [`AGENTS.md`](AGENTS.md)
