import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_PAGES_SITE_URL,
  absoluteUrl,
  absolutizeRobots,
  absolutizeSitemap,
  sitemapLocs,
} from "./sitemap-urls.ts";

const SITE = DEFAULT_PAGES_SITE_URL;

test("absoluteUrl joins root-relative paths under the site base", () => {
  assert.equal(absoluteUrl("/", SITE), "https://jnibarger01.github.io/jayota/");
  assert.equal(absoluteUrl("/vehicles/camry", SITE), "https://jnibarger01.github.io/jayota/vehicles/camry");
  assert.equal(absoluteUrl("/vehicles", `${SITE}/`), "https://jnibarger01.github.io/jayota/vehicles");
  assert.equal(absoluteUrl("https://example.com/x", SITE), "https://example.com/x");
});

test("absolutizeSitemap rewrites every loc and is idempotent", () => {
  const xml = "<urlset><url><loc>/</loc></url><url><loc>/shop/offers</loc></url></urlset>";
  const once = absolutizeSitemap(xml, SITE);
  assert.deepEqual(sitemapLocs(once), [
    "https://jnibarger01.github.io/jayota/",
    "https://jnibarger01.github.io/jayota/shop/offers",
  ]);
  assert.equal(absolutizeSitemap(once, SITE), once);
});

test("absolutizeRobots rewrites the Sitemap line only", () => {
  const robots = "User-agent: *\nDisallow: /api/\n\nSitemap: /sitemap.xml\n";
  const out = absolutizeRobots(robots, SITE);
  assert.match(out, /^Sitemap: https:\/\/jnibarger01\.github\.io\/jayota\/sitemap\.xml$/m);
  assert.match(out, /^Disallow: \/api\/$/m);
  assert.equal(absolutizeRobots(out, SITE), out);
});

test("the checked-in sitemap keeps its path list and absolutizes cleanly", () => {
  const xml = readFileSync(join(process.cwd(), "public/sitemap.xml"), "utf8");
  const before = sitemapLocs(xml);
  assert.equal(before.length, 42);
  const after = sitemapLocs(absolutizeSitemap(xml, SITE));
  assert.equal(after.length, before.length);
  for (const loc of after) assert.ok(loc.startsWith(`${SITE}/`), loc);
});
