import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { invalidBody, tooManyRequests } from "../api/errors.ts";
import { errorResponse, jsonResponse } from "./apiResponse.ts";

/**
 * Regression guard for a dead-module bug: `securityHeaders.ts` shipped in this tree but was
 * imported by nothing, so `jsonResponse` set three headers inline and the other two never reached
 * a response. The failure mode is silent — every route keeps returning 200 with correct JSON — so
 * it needs a test rather than a reviewer noticing.
 */
const BASELINE_HEADERS = [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
  "content-security-policy",
];

describe("jsonResponse", () => {
  it("attaches every baseline security header", () => {
    const response = jsonResponse({ ok: true });
    for (const header of BASELINE_HEADERS) {
      assert.ok(response.headers.get(header), `missing ${header}`);
    }
  });

  it("defaults content-type to JSON", () => {
    assert.equal(
      jsonResponse({ ok: true }).headers.get("content-type"),
      "application/json; charset=utf-8",
    );
  });

  it("lets a caller's own headers win over the baseline", () => {
    // Route-owned headers (Location on a 201, Cache-Control, Retry-After) must survive the merge,
    // otherwise adding security headers would silently break the create path's Location contract.
    const response = jsonResponse(
      { ok: true },
      { status: 201, headers: { Location: "/api/v1/configurations/abc", "Cache-Control": "no-store" } },
    );
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("location"), "/api/v1/configurations/abc");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.ok(response.headers.get("content-security-policy"));
  });

  it("serializes the body", async () => {
    assert.deepEqual(await jsonResponse({ a: 1 }).json(), { a: 1 });
  });
});

describe("errorResponse", () => {
  it("carries the baseline headers onto error paths too", () => {
    const response = errorResponse(invalidBody("nope"));
    assert.equal(response.status, 422);
    for (const header of BASELINE_HEADERS) {
      assert.ok(response.headers.get(header), `missing ${header}`);
    }
  });

  it("sets Retry-After on a 429", () => {
    const response = errorResponse(tooManyRequests("slow down"));
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get("retry-after")) > 0);
  });

  it("does not leak an unexpected error's message", async () => {
    const response = errorResponse(new Error("connection string postgres://user:pw@host/db"));
    assert.equal(response.status, 500);
    const body = (await response.json()) as { error: { message: string } };
    assert.ok(!body.error.message.includes("postgres://"));
  });
});
