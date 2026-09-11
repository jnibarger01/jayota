import { test } from "node:test";
import assert from "node:assert/strict";
import { takeToken } from "./rate-limit.ts";

test("rate limiter rejects after the window fills", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  assert.equal(takeToken(key, 2, 60_000).success, true);
  assert.equal(takeToken(key, 2, 60_000).success, true);
  assert.equal(takeToken(key, 2, 60_000).success, false);
});
