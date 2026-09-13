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

Always start Vite through the npm scripts above. Invoking `vite` directly skips
`scripts/with-app-env.mjs`, so `VITE_AUTH_ENABLED` can diverge between the live
dev server and the next build (sign-in present in one, absent in the other).
`npm run check:auth` compares them when the dev server is up.

## GitHub Pages

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

- Site: **https://jnibarger01.github.io/jayota/**
- Vite `base` / router basepath: `/jayota/` when `GITHUB_PAGES=1`
- Local Pages build: `npm run build:pages` → `.vercel/output/static`

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

## More docs

- Integrations & env vars: [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md)
- Sandbox / auth / data contract: [`AGENTS.md`](AGENTS.md)
