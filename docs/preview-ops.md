# Preview ops runbook

Operator guide for the live preview (`:8080`), the built-output QA preview
(`:8081`), hibernate/revive, and PGlite recovery after a crash. You do not need
to read `.grok/references` to run these steps.

## Ports

| Port | Role | How it starts | Stop / restart |
| ---- | ---- | ------------- | -------------- |
| `8080` | **Live preview** (dev server; what the preview proxy shows) | `npm run dev` or `sh startup.sh` | Kill the Vite/`npm run dev` process, then start again via `startup.sh` / `npm run dev` |
| `8081` | **Built-output QA only** (`vite preview`) | `npm run preview:restart` | `npm run preview:stop` / `npm run preview:restart` |

Never treat `:8081` as the live preview. A revive must not leave a stale built
preview answering there.

## Hibernate / revive

When the sandbox hibernates and comes back, the platform re-runs `startup.sh` if
it exists. Leave that file able to bring `:8080` up on its own every turn.

Session shapes:

- **Fresh workspace** — scaffold the app, then write `startup.sh`.
- **Hibernate / revive** — source is restored; `startup.sh` must restart the
  live preview if nothing answers on `:8080`.
- **Reboot / recreate** — app files may reset to the template; re-scaffold and
  restore `startup.sh` before verifying the preview.

A revive with no working `startup.sh` leaves nothing on `:8080` (empty preview).

### Minimal `startup.sh`

```sh
#!/bin/sh
set -eu
cd /workspace
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
```

Rules of thumb:

- Keep the script idempotent: probe `:8080`, exit 0 if already up.
- Bind on `0.0.0.0:8080` via `npm run dev` (do not invoke `vite` directly).
- Free `:8081` on revive so QA leftovers do not confuse the next turn.
- After edits, Vite HMR usually refreshes the live preview; restart the **dev**
  server only for `vite.config` / dependency changes — and update `startup.sh`
  in the same turn if the start command changed.

## Built-output preview (`preview:stop` / `preview:restart`)

`scripts/preview.mjs` owns `:8081`. Prefer the npm scripts over bare
`npm run preview`: `vite preview` is `strictPort`, so a leftover process both
fails the next start and keeps serving an old build.

```bash
npm run build                 # when you need fresh output
npm run preview:restart       # frees :8081, serves build at http://127.0.0.1:8081/
# … run QA / smoke …
npm run preview:stop          # frees :8081 when done
```

| Script | What it does |
| ------ | ------------ |
| `npm run preview:restart` | Stop whoever holds `:8081`, start `npm run preview` in the background, wait until `http://127.0.0.1:8081/` answers |
| `npm run preview:stop` | Signal the preview owner(s) and clear `.grok/preview.pid` when the port is free |

Logs: `.grok/preview.log`. Ready timeout: `PREVIEW_READY_TIMEOUT_MS` (default
`60000`). These scripts expect Linux `/proc` (sandbox); they are not for macOS
desktop-only workflows.

If `preview:restart` fails because the port is stuck:

1. `npm run preview:stop`
2. Confirm nothing listens: `curl -sf http://127.0.0.1:8081/` should fail
3. Retry `npm run preview:restart`

## Recover PGlite after a crashed preview

Showroom tables use embedded **PGlite** when `DATABASE_URL` is unset (see
[`README.md`](../README.md#pglite-persistence--backup) and issue #4).

| Mode | After a crash / hard kill |
| ---- | ------------------------- |
| Default (in-memory) | Process memory is gone. Restarting the server boots a fresh empty DB (migrations re-apply via `ensureDbReady`). Prior in-memory rows are not recoverable unless you exported a backup earlier from an FS-backed instance. |
| `PGLITE_DATA_DIR` set (e.g. `.pglite-data`) | On-disk PGDATA usually survives. Stop servers, optionally restore from a tarball if the dir looks corrupt, then start again. |
| `DATABASE_URL` (Neon) | Managed Postgres — crash recovery is on the provider; local preview scripts do not apply. |

### Safe restart sequence (FS-backed)

```bash
# 1) Free QA preview if it was running
npm run preview:stop || true

# 2) Stop the live preview (:8080) if it is wedged (find/kill the npm/vite
#    process, or reboot the sandbox and rely on startup.sh)

# 3) Optional: restore the last good dump if .pglite-data looks bad
#    (never commit .pglite-data/ or backups/)
PGLITE_DATA_DIR=.pglite-data npm run db:restore -- backups/pglite-….tgz

# 4) Bring live preview back
sh startup.sh
# or: npm run dev

# 5) If you still need built-output QA
npm run build && npm run preview:restart
```

### Take a backup before risky restarts

```bash
PGLITE_DATA_DIR=.pglite-data npm run db:backup   # → backups/pglite-*.tgz
```

In-memory preview DBs cannot be dumped by `db:backup`. Enable
`PGLITE_DATA_DIR=.pglite-data` when you care about surviving crashes.

### Symptoms → actions

| Symptom | Likely cause | Action |
| ------- | ------------ | ------ |
| Empty preview pane after revive | No listener on `:8080` / missing `startup.sh` | Fix `startup.sh`, run `sh startup.sh` |
| `preview:restart` fails / stale QA | Something still holds `:8081` | `npm run preview:stop`, then restart |
| Showroom data missing after crash | In-memory PGlite wiped | Accept empty DB, or restore from `backups/` if you used FS + export |
| Corrupt / lock errors on FS PGlite | Hard kill mid-write | Stop servers → `db:restore` from last tarball → start `startup.sh` |

## Related

- Persistence overview: [`README.md`](../README.md#pglite-persistence--backup)
- Integrations / env: [`INTEGRATIONS.md`](INTEGRATIONS.md)
- Scripts: `package.json` → `preview:restart`, `preview:stop`, `db:backup`, `db:restore`
