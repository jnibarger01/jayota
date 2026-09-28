import { test } from "node:test";
import assert from "node:assert/strict";
import { displayErrorMessage, FALLBACK_ERROR_MESSAGE } from "./error-message.ts";

test("production never shows the raw error message", () => {
  assert.equal(displayErrorMessage(new Error("relation \"users\" does not exist"), false), FALLBACK_ERROR_MESSAGE);
  assert.equal(displayErrorMessage("ECONNREFUSED 10.0.0.5:5432", false), FALLBACK_ERROR_MESSAGE);
});

test("dev shows the raw message when there is one", () => {
  assert.equal(displayErrorMessage(new Error("boom"), true), "boom");
  assert.equal(displayErrorMessage("plain string", true), "plain string");
});

test("dev falls back for empty or non-error values", () => {
  assert.equal(displayErrorMessage(new Error(""), true), FALLBACK_ERROR_MESSAGE);
  assert.equal(displayErrorMessage({ weird: true }, true), FALLBACK_ERROR_MESSAGE);
  assert.equal(displayErrorMessage(undefined, true), FALLBACK_ERROR_MESSAGE);
});

test("defaults to production behaviour outside a Vite dev build", () => {
  assert.equal(displayErrorMessage(new Error("secret")), FALLBACK_ERROR_MESSAGE);
});
