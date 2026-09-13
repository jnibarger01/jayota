import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  takeToken,
  enforceLimit,
  rateLimitFor,
  rateLimitWindowMs,
  resetRateLimitBuckets,
  DEFAULT_RATE_LIMITS,
  clientKeyFromRequest,
} from "./rate-limit.ts";
import { enforceConfigWriteRateLimit } from "../../showroom/server/rateLimit.ts";
import { errorResponse } from "../../showroom/server/apiResponse.ts";
import { ApiError } from "../../showroom/api/errors.ts";

const ENV_KEYS = [
  "SHOWROOM_RATE_LIMIT_CONFIG_WRITE",
  "SHOWROOM_RATE_LIMIT_CATALOG_READ",
  "SHOWROOM_RATE_LIMIT_LEAD_WRITE",
  "SHOWROOM_RATE_LIMIT_SEARCH",
  "SHOWROOM_RATE_LIMIT_WINDOW_MS",
] as const;

const savedEnv = new Map<string, string | undefined>();

beforeEach(() => {
  savedEnv.clear();
  for (const key of ENV_KEYS) {
    savedEnv.set(key, process.env[key]);
    delete process.env[key];
  }
  resetRateLimitBuckets();
});

afterEach(() => {
  resetRateLimitBuckets();
  for (const key of ENV_KEYS) {
    const prev = savedEnv.get(key);
    if (prev === undefined) delete process.env[key];
    else process.env[key] = prev;
  }
  savedEnv.clear();
});

test("rate limiter rejects after the window fills", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  assert.equal(takeToken(key, 2, 60_000).success, true);
  assert.equal(takeToken(key, 2, 60_000).success, true);
  assert.equal(takeToken(key, 2, 60_000).success, false);
});

test("default knobs match documented ceilings", () => {
  assert.equal(rateLimitFor("configWrite"), DEFAULT_RATE_LIMITS.configWrite);
  assert.equal(rateLimitFor("catalogRead"), DEFAULT_RATE_LIMITS.catalogRead);
  assert.equal(rateLimitFor("leadWrite"), DEFAULT_RATE_LIMITS.leadWrite);
  assert.equal(rateLimitFor("search"), DEFAULT_RATE_LIMITS.search);
  assert.equal(rateLimitWindowMs(), 60_000);
});

test("env knobs override defaults", () => {
  process.env.SHOWROOM_RATE_LIMIT_CONFIG_WRITE = "5";
  process.env.SHOWROOM_RATE_LIMIT_WINDOW_MS = "120000";
  assert.equal(rateLimitFor("configWrite"), 5);
  assert.equal(rateLimitWindowMs(), 120_000);
});

test("invalid env knobs fall back to defaults", () => {
  process.env.SHOWROOM_RATE_LIMIT_CONFIG_WRITE = "0";
  process.env.SHOWROOM_RATE_LIMIT_WINDOW_MS = "nope";
  assert.equal(rateLimitFor("configWrite"), DEFAULT_RATE_LIMITS.configWrite);
  assert.equal(rateLimitWindowMs(), 60_000);
});

test("burst client cannot unbounded-write: enforceLimit throws structured 429", () => {
  process.env.SHOWROOM_RATE_LIMIT_CONFIG_WRITE = "3";
  const key = `burst-${Date.now()}-${Math.random()}`;
  const limit = rateLimitFor("configWrite");
  enforceLimit(key, limit, "slow down");
  enforceLimit(key, limit, "slow down");
  enforceLimit(key, limit, "slow down");
  assert.throws(
    () => enforceLimit(key, limit, "slow down"),
    (err: unknown) => {
      assert.ok(err instanceof ApiError);
      assert.equal(err.status, 429);
      assert.equal(err.code, "rate_limited");
      assert.equal(err.message, "slow down");
      assert.ok(typeof err.retryAfterSeconds === "number" && err.retryAfterSeconds >= 1);
      return true;
    },
  );
});

test("enforceConfigWriteRateLimit burst → 429 with Retry-After body shape", async () => {
  process.env.SHOWROOM_RATE_LIMIT_CONFIG_WRITE = "2";
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
  const request = new Request("https://example.com/api/v1/configurations", {
    method: "POST",
    headers: { "cf-connecting-ip": ip, "user-agent": "rate-limit-test" },
  });

  await enforceConfigWriteRateLimit(request);
  await enforceConfigWriteRateLimit(request);

  let caught: unknown;
  try {
    await enforceConfigWriteRateLimit(request);
  } catch (err) {
    caught = err;
  }
  assert.ok(caught instanceof ApiError);
  assert.equal(caught.status, 429);
  assert.equal(caught.code, "rate_limited");

  const response = errorResponse(caught);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), String(caught.retryAfterSeconds ?? 60));
  const body = (await response.json()) as {
    error: { code: string; status: number; message: string };
  };
  assert.equal(body.error.code, "rate_limited");
  assert.equal(body.error.status, 429);
  assert.ok(typeof body.error.message === "string" && body.error.message.length > 0);
});

test("client key prefers cf-connecting-ip over spoofable forwarding headers", () => {
  const request = new Request("https://example.com/", {
    headers: {
      "cf-connecting-ip": "198.51.100.10",
      "x-forwarded-for": "1.1.1.1",
      "user-agent": "rate-limit-test",
    },
  });
  assert.equal(clientKeyFromRequest(request), "ip:198.51.100.10");
});
