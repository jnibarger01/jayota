import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAddress, formatHour, DEALER } from "./dealer.ts";

test("formatHour reports Closed when either bound is missing", () => {
  assert.equal(formatHour(null, "18:00"), "Closed");
  assert.equal(formatHour("09:00", null), "Closed");
});

test("formatHour converts 24h catalog hours to 12h display", () => {
  assert.equal(formatHour("09:00", "20:00"), "9 AM – 8 PM");
  assert.equal(formatHour("12:00", "18:00"), "12 PM – 6 PM");
});

test("dealership identity is the verified Merriam location", () => {
  assert.equal(DEALER.address.city, "Merriam");
  assert.equal(DEALER.address.zip, "66203");
  assert.match(formatAddress(), /9505 W\. 67th Street/);
});
