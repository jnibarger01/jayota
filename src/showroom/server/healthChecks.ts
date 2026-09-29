/**
 * Readiness checks for the `/api/health` endpoint.
 *
 * The health route used to report only static catalog facts (schema version, vehicle count).
 * That tells an operator the build is new, not that the app can serve. These checks answer
 * the operational questions: is the database reachable and fast enough, and which
 * fail-closed integrations are actually configured?
 *
 * Rules:
 * - Never leak secrets: provider checks report the adapter `name` and `status()` booleans
 *   only. No env values, no tokens, no URLs — the adapters' own interfaces expose exactly
 *   what is safe to say.
 * - The database ping is read-only (`select 1`) and time-boxed, so a wedged Neon pool
 *   degrades the health response instead of hanging the probe.
 * - `getSql()` is server-only by construction (it throws in the browser); this module is
 *   imported only from server handlers.
 */
import type { DbSource, Sql } from "../../lib/db.ts";
import { getEmailProvider } from "../../lib/providers/email.ts";
import { getInventoryProvider } from "../../lib/providers/inventory.ts";
import { getOffersProvider } from "../../lib/providers/offers.ts";

export type CheckStatus = "ok" | "error";

export interface DatabaseCheck {
  status: CheckStatus;
  /** Which backend answered: managed Neon when `DATABASE_URL` is set, embedded PGlite otherwise. */
  source: DbSource;
  /** Round-trip time of the `select 1` ping, whole milliseconds. */
  latencyMs: number;
  /** Present only when status is "error". Sanitized: driver message, never connection config. */
  error?: string;
}

export interface ProviderCheck {
  /** Adapter name, e.g. "unconfigured" — mirrors what the rest of the app reports in the UI. */
  provider: string;
  /** Adapter readiness, e.g. "unavailable" | "configured". */
  status: string;
}

export interface HealthChecks {
  database: DatabaseCheck;
  providers: {
    inventory: ProviderCheck;
    offers: ProviderCheck;
    email: ProviderCheck;
  };
}

export type HealthStatus = "ok" | "degraded";

/** Default ceiling for the database ping before the probe gives up and reports degraded. */
export const DEFAULT_DB_PING_TIMEOUT_MS = 3_000;

export interface DatabaseCheckDeps {
  /** Injectable for tests; defaults to the real `getSql()`. */
  getSqlImpl?: () => Promise<Sql>;
  /** Injectable for tests. */
  source?: DbSource;
  timeoutMs?: number;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, makeError: () => Error): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(makeError()), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

/** Read-only `select 1` ping against the active backend, time-boxed. */
export async function checkDatabase(deps: DatabaseCheckDeps = {}): Promise<DatabaseCheck> {
  const timeoutMs = deps.timeoutMs ?? DEFAULT_DB_PING_TIMEOUT_MS;
  if (deps.getSqlImpl && deps.source) {
    return ping(deps.getSqlImpl, deps.source, timeoutMs);
  }
  // Dynamic import: `lib/db` eagerly bootstraps PGlite at module load in Node. That is
  // correct for the server, but importing this module (e.g. in unit tests that inject
  // their own `getSqlImpl`) must not start a database as a side effect.
  const db = await import("../../lib/db.ts");
  return ping(db.getSql, db.dbSource, timeoutMs);
}

async function ping(
  getSqlImpl: () => Promise<Sql>,
  source: DbSource,
  timeoutMs: number,
): Promise<DatabaseCheck> {
  const started = Date.now();
  try {
    const sql = await withTimeout(getSqlImpl(), timeoutMs, () => {
      return new Error(`database ping timed out after ${timeoutMs}ms`);
    });
    await withTimeout(sql.query("select 1 as ok", []), timeoutMs, () => {
      return new Error(`database ping timed out after ${timeoutMs}ms`);
    });
    return { status: "ok", source, latencyMs: Date.now() - started };
  } catch (err) {
    return {
      status: "error",
      source,
      latencyMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Adapter readiness straight from each provider's own interface — no env sniffing. */
export function checkProviders(): HealthChecks["providers"] {
  const inventory = getInventoryProvider();
  const offers = getOffersProvider();
  const email = getEmailProvider();
  return {
    inventory: { provider: inventory.name, status: inventory.status() },
    offers: { provider: offers.name, status: offers.status() },
    // The email adapter's name is its readiness signal: "unconfigured" until a real
    // transactional provider lands (see the fail-closed contract in providers/email.ts).
    email: {
      provider: email.name,
      status: email.name === "unconfigured" ? "unavailable" : "configured",
    },
  };
}

export async function runHealthChecks(deps: DatabaseCheckDeps = {}): Promise<HealthChecks> {
  return {
    database: await checkDatabase(deps),
    providers: checkProviders(),
  };
}

/** "ok" only when every check passes — a dead database is degraded, never silently fine. */
export function overallHealthStatus(checks: HealthChecks): HealthStatus {
  return checks.database.status === "ok" ? "ok" : "degraded";
}
