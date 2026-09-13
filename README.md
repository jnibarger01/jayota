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

## More docs

- Integrations & env vars: [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md)
- Sandbox / auth / data contract: [`AGENTS.md`](AGENTS.md)
