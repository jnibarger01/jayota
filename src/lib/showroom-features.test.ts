import { test } from "node:test";
import assert from "node:assert/strict";
import { breakdown, defaultScenarios, modeledIllustration } from "./finance-lab.ts";
import { decodeVinLocal } from "./vin.ts";
import { departmentStatus } from "./hours.ts";
import { whatChanges } from "./trim-diff.ts";
import { applyInventoryFilters, rankInventoryMatches, watchDiff } from "./inventory-match.ts";
import { upcomingSalesSlots } from "./test-drive-slots.ts";
import type { Vehicle } from "../showroom/types/vehicle.ts";

test("finance lab computes interest and cash scenario", () => {
  const [a, , cash] = defaultScenarios(40000);
  const fin = breakdown(a!);
  assert.ok(fin.monthly > 0);
  assert.ok(fin.totalInterest >= 0);
  const c = breakdown(cash!);
  assert.equal(c.monthly, 0);
  assert.equal(c.amountFinanced, 0);
  const modeled = modeledIllustration(30000);
  assert.equal(modeled.apr, 6.9);
});

test("VIN decode is format-only and never a valuation", () => {
  const bad = decodeVinLocal("ABC");
  assert.equal(bad.valid, false);
  const sample = decodeVinLocal("4T1B11HK5RU123456");
  assert.equal(sample.valid, true);
  assert.match(sample.note, /not a trade-in offer/i);
});

test("sales hours status is derived from dealer catalog hours", () => {
  const mondayOpen = departmentStatus("sales", new Date("2026-09-14T16:00:00-05:00"));
  assert.equal(mondayOpen.open, true);
  const sundayNight = departmentStatus("sales", new Date("2026-09-13T23:30:00-05:00"));
  assert.equal(sundayNight.open, false);
});

test("trim diff only uses provided catalog features", () => {
  const vehicle = {
    grades: [
      { id: "le", name: "LE", msrp: 29000, standardFeatures: ["AWD"] },
      { id: "xle", name: "XLE", msrp: 31300, standardFeatures: ["AWD", "Power liftgate"] },
    ],
  } as unknown as Vehicle;
  const diff = whatChanges(vehicle, "le", "xle");
  assert.ok(diff);
  assert.equal(diff.priceDelta, 2300);
  assert.deepEqual(diff.added, ["Power liftgate"]);
});

test("empty model query does not treat every VIN as a same-model match", () => {
  const ranked = rankInventoryMatches(
    [
      {
        vin: "X".repeat(17),
        stockNumber: "1",
        year: 2026,
        make: "Toyota",
        model: "RAV4",
        trim: "LE",
        drivetrain: "awd",
        exteriorColor: "White",
        mileage: 12,
        status: "in_stock",
        price: 32000,
        priceProvenance: null,
        imageUrl: null,
        location: "Merriam",
      },
    ],
    { model: "  " },
  );
  assert.equal(ranked.length, 0);
});

test("inventory filters sort price low to high and watch diffs snapshots", () => {
  const cheap = {
    vin: "A".repeat(17),
    stockNumber: "1",
    year: 2025,
    make: "Toyota",
    model: "Camry",
    trim: "LE",
    drivetrain: "fwd",
    exteriorColor: "White",
    mileage: 10,
    status: "in_stock" as const,
    price: 30000,
    priceProvenance: null,
    imageUrl: null,
    location: "Merriam",
  };
  const expensive = { ...cheap, vin: "B".repeat(17), stockNumber: "2", price: 40000, year: 2026 };
  const sorted = applyInventoryFilters([expensive, cheap], { sort: "price-asc" });
  assert.equal(sorted[0]?.price, 30000);
  const diff = watchDiff(["A".repeat(17)], ["A".repeat(17), "B".repeat(17)]);
  assert.deepEqual(diff.added, ["B".repeat(17)]);
  assert.deepEqual(diff.removed, []);
});

test("inventory matcher ranks exact trim over same model", () => {
  const ranked = rankInventoryMatches(
    [
      {
        vin: "X".repeat(17),
        stockNumber: "1",
        year: 2026,
        make: "Toyota",
        model: "RAV4",
        trim: "LE",
        drivetrain: "awd",
        exteriorColor: "White",
        mileage: 12,
        status: "in_stock",
        price: null,
        priceProvenance: null,
        imageUrl: null,
        location: "Merriam",
      },
    ],
    { model: "RAV4", trim: "LE", drivetrain: "awd", color: "White" },
  );
  assert.equal(ranked[0]?.tier, "exact");
});

test("test-drive slots are labeled as Central Time", () => {
  const slots = upcomingSalesSlots(7, new Date("2026-09-11T12:00:00-05:00"));
  assert.ok(slots.length > 0);
  assert.ok(slots.every((s) => s.label.includes("CT")));
});
