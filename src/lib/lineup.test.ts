import assert from "node:assert/strict";
import test from "node:test";
import {
  LINEUP,
  featuredLineup,
  filterLineup,
  getLineupBySlug,
  lineupConfigure,
} from "./lineup.ts";

test("lineup covers current US nameplates without duplicate slugs", () => {
  const slugs = LINEUP.map((item) => item.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.length >= 20);
  for (const required of ["rav4", "camry", "corolla", "tacoma", "tundra", "sienna", "4runner", "bz", "highlander"]) {
    assert.ok(slugs.includes(required), `missing ${required}`);
  }
});

test("featured hero is multi-model", () => {
  const featured = featuredLineup();
  assert.ok(featured.length >= 4);
  assert.equal(featured[0]?.slug, "rav4");
  assert.ok(featured.some((item) => item.slug === "camry"));
  assert.ok(featured.some((item) => item.slug === "tacoma"));
});

test("category filters", () => {
  assert.ok(filterLineup("truck").every((item) => item.body === "truck"));
  assert.ok(filterLineup("minivan").every((item) => item.body === "minivan"));
  assert.ok(filterLineup("electric").every((item) => item.tabs.includes("electric")));
  assert.ok(filterLineup("hybrid").length > 5);
});

test("3d configure only on packaged models", () => {
  assert.equal(lineupConfigure(getLineupBySlug("rav4")!).kind, "3d");
  assert.equal(lineupConfigure(getLineupBySlug("4runner")!).kind, "3d");
  assert.equal(lineupConfigure(getLineupBySlug("camry")!).kind, "build");
  assert.equal(lineupConfigure(getLineupBySlug("sienna")!).kind, "none");
});

test("bz4x alias maps to current bZ nameplate", () => {
  assert.equal(getLineupBySlug("bz4x")?.slug, "bz");
});

test("every merchandising MSRP has a source", () => {
  for (const item of LINEUP) {
    if (item.startingMsrp != null) {
      assert.ok(item.msrpSource, item.slug);
    }
  }
});
