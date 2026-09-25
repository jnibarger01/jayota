# Contributing

## Setup

Node 24 (matches `.github/workflows/pages.yml`; CI installs with `npm ci`).

```bash
npm ci
npm run dev
```

Dev server: `http://127.0.0.1:8080/`.

**Always start Vite through the npm scripts.** Invoking `vite` directly skips
`scripts/with-app-env.mjs`, so `VITE_AUTH_ENABLED` can diverge between the live dev server and the
next build — sign-in present in one, absent in the other. `npm run check:auth` compares them while
the dev server is up.

## Before opening a PR

`.github/workflows/pr-ci.yml` runs these against every PR. Run them locally first, in this order,
so CI isn't the first place a failure shows up:

```bash
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm test             # node --test over src/**/*.test.ts
npm run build        # production build + PGlite assets + migrations
```

If the change touches routing, the mobile tab bar, or anything that affects the static export, also
run the two smoke checks CI runs — they catch failures unit tests structurally cannot:

```bash
npm run preview & npm run test:mobile-nav
npm run build:pages && npm run preview:pages & npm run test:pages-base
```

`test:pages-base` is the one that catches a wrong Vite `base`. That failure mode is silent locally
and total in production: every JS and CSS asset 404s under `/jayota/` while the page still returns
200.

## Testing conventions

- **Unit tests are discovered by glob** (`src/**/*.test.ts`), not by a hand-maintained list. Add a
  `*.test.ts` next to the module it covers and it runs. It was a list until the list and the
  directory started disagreeing about what "the test suite" meant.
- **Tests run on `node --test` with `--experimental-strip-types`.** No vitest, no jsdom. Import with
  explicit `.ts` extensions inside `src/showroom/` — that tree is vendored (see below) and keeps
  upstream's resolution style.
- **`scripts/**/*.test.mjs` run separately** via `npm run test:scripts`, and are **not currently in
  CI** — 13 assertions across 4 files still encode the pristine Grok template's state (generic
  `og:title`, auth off, an empty `migrations/`) and read live repo files instead of fixtures, so
  they fail against this repo's real content. The scripts they cover are fine; the tests need
  fixtures. Fix those before wiring `npm run test:all` into the workflow.
- **`scripts/repo-weight.test.mjs` guards clone weight.** It reads the git *index*, so it fails on a
  staged oversized file before the commit exists. If it flags something you meant to add, untrack it
  — or add an `ALLOWANCES` entry stating why the repo should carry the weight.

## `src/showroom/` is vendored

That whole directory is a snapshot of `toyota-showroom`'s `lib/`. **Read
[`src/showroom/VENDORED.md`](src/showroom/VENDORED.md) before editing anything under it.** New
showroom behavior belongs upstream; a local edit here is a merge conflict scheduled for later.

## Commit and PR conventions

Conventional-commit subjects (`feat:`, `fix:`, `ci:`, `docs:`, `chore:`, `test:`), one logical
change per commit, issue number in the subject where one exists — matching the existing history.

Comments explain **intent**, not syntax: why a constraint exists, what breaks without it, which
issue forced it. That habit is the most valuable thing in this codebase; please keep it.
