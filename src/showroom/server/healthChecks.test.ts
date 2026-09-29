import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  checkDatabase,
  checkProviders,
  overallHealthStatus,
  runHealthChecks,
  type HealthChecks,
} from "./healthChecks.ts";
import type { Sql } from "../../lib/db.ts";

const okSql = {
  query: async () => [{ ok: 1 }],
} as unknown as Sql;

const failingSql = {
  query: async () => {
    throw new Error("connection refused");
  },
} as unknown as Sql;

const hangingSql = {
  query: () => new Promise<never>(() => {}),
} as unknown as Sql;

describe("checkProviders", () => {
  it("reports the fail-closed adapters as unconfigured with no live feeds", () => {
    const providers = checkProviders();
    assert.deepEqual(providers, {
      inventory: { provider: "unconfigured", status: "unavailable" },
      offers: { provider: "unconfigured", status: "unavailable" },
      email: { provider: "unconfigured", status: "unavailable" },
    });
  });

  it("never exposes env values or URLs in the provider payload", () => {
    const payload = JSON.stringify(checkProviders());
    assert.ok(!payload.includes("INVENTORY_FEED"), "env var name leaked");
    assert.ok(!payload.includes("http"), "URL leaked");
  });
});

describe("checkDatabase", () => {
  it("reports ok with the injected source and a non-negative latency", async () => {
    const check = await checkDatabase({
      getSqlImpl: async () => okSql,
      source: "pglite",
    });
    assert.equal(check.status, "ok");
    assert.equal(check.source, "pglite");
    assert.ok(check.latencyMs >= 0, `latencyMs was ${check.latencyMs}`);
    assert.equal(check.error, undefined);
  });

  it("reports error instead of throwing when the database is unreachable", async () => {
    const check = await checkDatabase({
      getSqlImpl: async () => failingSql,
      source: "neon",
    });
    assert.equal(check.status, "error");
    assert.equal(check.source, "neon");
    assert.match(check.error ?? "", /connection refused/);
  });

  it("time-boxes a hung query instead of hanging the probe", async () => {
    const check = await checkDatabase({
      getSqlImpl: async () => hangingSql,
      source: "neon",
      timeoutMs: 50,
    });
    assert.equal(check.status, "error");
    assert.match(check.error ?? "", /timed out after 50ms/);
  });

  it("time-boxes a hung connection acquisition", async () => {
    const check = await checkDatabase({
      getSqlImpl: () => new Promise<never>(() => {}),
      source: "neon",
      timeoutMs: 50,
    });
    assert.equal(check.status, "error");
    assert.match(check.error ?? "", /timed out after 50ms/);
  });
});

describe("overallHealthStatus", () => {
  const base: HealthChecks = {
    database: { status: "ok", source: "pglite", latencyMs: 3 },
    providers: {
      inventory: { provider: "unconfigured", status: "unavailable" },
      offers: { provider: "unconfigured", status: "unavailable" },
      email: { provider: "unconfigured", status: "unavailable" },
    },
  };

  it("is ok when the database answers", () => {
    assert.equal(overallHealthStatus(base), "ok");
  });

  it("is degraded — never silently fine — when the database check fails", () => {
    assert.equal(
      overallHealthStatus({
        ...base,
        database: { status: "error", source: "neon", latencyMs: 3050, error: "boom" },
      }),
      "degraded",
    );
  });
});

describe("runHealthChecks", () => {
  it("aggregates database and provider checks in one payload", async () => {
    const checks = await runHealthChecks({ getSqlImpl: async () => okSql, source: "pglite" });
    assert.equal(checks.database.status, "ok");
    assert.equal(checks.providers.inventory.provider, "unconfigured");
  });
});
