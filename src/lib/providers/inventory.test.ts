import { test } from "node:test";
import assert from "node:assert/strict";
import { getInventoryProvider } from "./inventory.ts";
import { getOffersProvider } from "./offers.ts";
import { getEmailProvider } from "./email.ts";

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
