import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateMonthlyPayment, leadSchema, tradeInSchema } from "./forms.ts";

test("amortizing payment with 0% APR is principal / term", () => {
  assert.equal(estimateMonthlyPayment(12000, 0, 12), 1000);
});

test("amortizing payment is stable for a known 6.9% / 60 month case", () => {
  const monthly = estimateMonthlyPayment(30000, 6.9, 60);
  assert.ok(monthly > 590 && monthly < 600, `got ${monthly}`);
});

test("lead schema rejects empty message", () => {
  const result = leadSchema.safeParse({
    kind: "contact",
    name: "Alex",
    email: "alex@example.com",
    message: "",
  });
  assert.equal(result.success, false);
});

test("trade-in VIN must be 17 characters when provided", () => {
  const bad = tradeInSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    condition: "good",
    vin: "SHORT",
  });
  assert.equal(bad.success, false);
});
