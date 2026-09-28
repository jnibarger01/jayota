import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Card, list, and gallery images lazy-load so they don't compete with the LCP hero; the hero
// stays eager with high fetch priority (issue #34).
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

/** Returns the source of each <img …/> element (tags may span lines). */
function imgTags(src: string): string[] {
  return [...src.matchAll(/<img\b[\s\S]*?\/>/g)].map((m) => m[0]);
}

const LAZY_FILES = [
  "src/components/vehicles/VehicleCard.tsx",
  "src/components/vehicles/LineupCard.tsx",
  "src/components/vehicles/ExplorerCard.tsx",
  "src/components/vehicles/QuickView.tsx",
  "src/components/home/RecentlyViewed.tsx",
  "src/routes/quiz.tsx",
  "src/routes/owners/saved.tsx",
];

test("card and list images lazy-load and decode async", () => {
  for (const file of LAZY_FILES) {
    const tags = imgTags(read(file));
    assert.ok(tags.length > 0, `${file} has no <img>`);
    for (const tag of tags) {
      assert.match(tag, /loading="lazy"/, `${file}: ${tag.slice(0, 80)}`);
      assert.match(tag, /decoding="async"/, `${file}: ${tag.slice(0, 80)}`);
    }
  }
});

test("vehicle gallery thumbnails lazy-load but the detail hero does not", () => {
  const tags = imgTags(read("src/routes/vehicles/$slug/index.tsx"));
  const thumbs = tags.filter((t) => t.includes("src={asset.url}"));
  assert.ok(thumbs.length > 0);
  for (const t of thumbs) assert.match(t, /loading="lazy"/);
  for (const t of tags.filter((x) => x.includes("max-h-[520px]"))) assert.doesNotMatch(t, /loading="lazy"/);
});

test("the home hero stays eager with high fetch priority", () => {
  const tags = imgTags(read("src/components/home/HeroCarousel.tsx"));
  assert.ok(tags.length > 0);
  for (const t of tags) {
    assert.doesNotMatch(t, /loading="lazy"/);
    assert.match(t, /fetchPriority="high"/);
  }
});
