# Vendored: `toyota-showroom/lib`

Everything under `src/showroom/` is a **vendored snapshot** of the showroom core library
from [`jnibarger01/toyota-showroom`](https://github.com/jnibarger01/toyota-showroom),
not code that originated here.

| | |
| --- | --- |
| Upstream repo | `jnibarger01/toyota-showroom` |
| Upstream path | `lib/` |
| Snapshot taken at | `46b934c` ("test: correct post-Supra visual baselines") |
| Last reconciled | 2026-09-15 |

## Why this file exists

The snapshot was taken without provenance, and both copies kept moving. As of the date
above, of the 65 files present in both trees:

- **34 are byte-identical** to upstream,
- **31 have diverged**, and
- **32 files exist upstream with no counterpart here.**

Nothing detected that. A reader of `src/showroom/three/cameraController.ts` had no way to
know it was a fork, which upstream commit it forked from, or that upstream had since grown
XR support and a GPU timer. This file is the minimum fix: it makes the relationship legible.

## Rules for this directory

1. **Do not edit files here to add features.** New behavior belongs upstream, then comes
   back through a re-sync. A local edit is a merge conflict you have scheduled for later.
2. **Host adaptations are the exception, and must be marked.** Where jayota's runtime
   genuinely differs from upstream's (Cloudflare Worker + D1 there, PGlite/Neon here), the
   adaptation stays, but the file gets a `VENDOR-DIVERGENCE:` comment at the top saying
   what changed and why. Current known-intentional divergences:
   - `server/rateLimit.ts` — reimplemented over `src/lib/http/rate-limit.ts`; upstream
     binds to Cloudflare's rate-limit bindings, which do not exist in this runtime.
   - `server/pgConfigurationRepository.ts` — replaces upstream's
     `d1ConfigurationRepository.ts`.
   - `server/apiResponse.ts` — upstream wraps handlers in `withRouteTelemetry` (Next/Cloudflare
     specific); this copy keeps a plain `jsonResponse`/`errorResponse` pair. Both attach the same
     baseline headers via `withSecurityHeaders`.
   - `server/apiResponse.test.ts` — added here, no upstream counterpart. Upstream covers this
     through its route tests; this tree has none, and the header wiring is exactly the kind of
     thing that fails silently.
   - Import specifiers throughout — upstream uses relative paths, this tree uses the `@/`
     alias. Files inside this directory also use explicit `.ts` extensions so `node --test
     --experimental-strip-types` resolves them.
3. **Do not import host code from inside this directory**, beyond what rule 2 already
   covers. `server/rateLimit.ts` reaching out to `src/lib/http/rate-limit.ts` is the one
   existing puncture of that boundary and it is why that file is listed above.

## Known gaps versus upstream

Present upstream, absent here. None of these are bugs on their own — they are the shape of
the drift, recorded so a re-sync is a diff and not an archaeology project:

- **3D / viewer**: `three/xrSession.ts`, `three/xrCapability.ts`, `three/gpuTimer.ts`,
  `three/qualityPreference.ts`, `three/prefetch.ts`, `three/viewerControlEvents.ts`
- **Showroom features**: `showroom/openGraph.ts`, `showroom/compareDeepLink.ts`,
  `showroom/paintStudioHistory.ts`, `showroom/configJson.ts`,
  `showroom/builderShortcuts.ts`, `showroom/tourAnnouncement.ts`,
  `showroom/selectionAnnouncement.ts`
- **Server**: `server/botFriction.ts` (Turnstile), `server/crmWebhook.ts`,
  `server/leadRepository.ts`
- **Other**: `observability/funnelTelemetry.ts`, `dealerInventory/`, `pwa/`, `data/wheels.ts`,
  `data/*/gr-supra.ts`, `api/leads.ts`, `api/dealerInventory.ts`

## Re-syncing

```bash
git clone https://github.com/jnibarger01/toyota-showroom /tmp/showroom
diff -rq src/showroom /tmp/showroom/lib
```

Reconcile file by file, then update the "Snapshot taken at" and "Last reconciled" rows
above. Reconciling is cheap today and gets more expensive every week it is deferred.

## The real fix

This file documents a problem; it does not solve it. The durable options are to extract
the shared core into a package both repos depend on, or to collapse the two repos into one.
Until one of those happens, this directory is a fork with a note on it.
