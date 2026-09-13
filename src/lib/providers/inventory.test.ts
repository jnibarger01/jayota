import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getInventoryProvider } from "./inventory.ts";
import {
  InventoryFeedContractError,
  parseInventoryFeedResponse,
} from "./inventory.ts";
import { getOffersProvider } from "./offers.ts";
import { getEmailProvider } from "./email.ts";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function loadFixture(name: string): unknown {
  return JSON.parse(readFileSync(join(fixturesDir, name), "utf8")) as unknown;
}

test("inventory adapter fails closed with no credentials", async () => {
  const provider = getInventoryProvider();
  assert.equal(provider.status(), "unavailable");
  assert.equal((await provider.search({})).length, 0);
  assert.equal(await provider.getByVin("AAAAAAAAAAAAAAAAA"), null);
});

test("offers adapter fails closed with no credentials", async () => {
  const provider = getOffersProvider();
  assert.equal(provider.status(), "unavailable");
  assert.equal((await provider.listActive(new Date())).length, 0);
});

test("email adapter never claims delivery when unconfigured", async () => {
  const result = await getEmailProvider().send({
    kind: "lead_confirmation",
    to: "owner@example.com",
    subject: "test",
    text: "test",
  });
  assert.equal(result.accepted, false);
});

test("valid inventory feed fixture parses to typed lots", () => {
  const payload = loadFixture("inventory-valid.json");
  const parsed = parseInventoryFeedResponse(payload);
  assert.equal(parsed.lots.length, 1);
  assert.equal(parsed.lots[0]?.vin, "4T1BF1FK5EU123456");
  assert.equal(parsed.lots[0]?.status, "in_stock");
});

test("missing lots field fails with a clear contract assertion", () => {
  const payload = loadFixture("inventory-missing-lots.json");
  assert.throws(
    () => parseInventoryFeedResponse(payload),
    (err: unknown) => {
      assert.ok(err instanceof InventoryFeedContractError);
      assert.match(err.message, /Inventory feed contract violation/);
      assert.match(err.message, /lots/);
      assert.ok(err.issues.length >= 1);
      return true;
    },
  );
});

test("short VIN fails with a clear contract assertion", () => {
  const payload = loadFixture("inventory-bad-vin.json");
  assert.throws(
    () => parseInventoryFeedResponse(payload),
    (err: unknown) => {
      assert.ok(err instanceof InventoryFeedContractError);
      assert.match(err.message, /Inventory feed contract violation/);
      assert.match(err.message, /VIN must be exactly 17 characters/);
      assert.equal(err.issues[0]?.path.join("."), "lots.0.vin");
      return true;
    },
  );
});

test("VIN with illegal I/O/Q characters fails with a clear contract assertion", () => {
  const payload = loadFixture("inventory-invalid-vin-chars.json");
  assert.throws(
    () => parseInventoryFeedResponse(payload),
    (err: unknown) => {
      assert.ok(err instanceof InventoryFeedContractError);
      assert.match(err.message, /Inventory feed contract violation/);
      assert.match(err.message, /VIN must be exactly 17 characters/);
      return true;
    },
  );
});

test("empty lots array is a valid (empty) inventory payload", () => {
  const parsed = parseInventoryFeedResponse({ lots: [] });
  assert.deepEqual(parsed.lots, []);
});
