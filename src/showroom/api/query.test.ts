import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesFilters, paginateAndFilter } from "./query.ts";
import type { VehicleQueryFacts } from "../types/vehicle.ts";

const base: VehicleQueryFacts = {
  bodyStyle: "suv",
  categories: ["suv", "off-road"],
  availability: "in_production",
  drivetrains: ["4wd"],
  powertrainTypes: ["gas"],
  maxSeating: 5,
  maxTowingLbs: 5000,
  startingMsrp: 40000,
};

test("matchesFilters accepts and rejects body style", () => {
  assert.equal(matchesFilters(base, { bodyStyle: ["suv"] }), true);
  assert.equal(matchesFilters(base, { bodyStyle: ["sedan"] }), false);
});

test("paginateAndFilter clamps page and reports totals", () => {
  const items = [base, { ...base, startingMsrp: 50000 }, { ...base, startingMsrp: 60000 }];
  const result = paginateAndFilter(items, { minPrice: 45000 }, { page: 1, pageSize: 1 });
  assert.equal(result.totalItems, 2);
  assert.equal(result.data.length, 1);
});
