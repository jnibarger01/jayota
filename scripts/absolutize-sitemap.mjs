#!/usr/bin/env node
/**
 * Rewrites sitemap.xml <loc> entries and the robots.txt Sitemap line in a static build output
 * directory to absolute URLs under SITE_URL (default: the GitHub Pages site). See issue #33.
 * Usage: node --experimental-strip-types scripts/absolutize-sitemap.mjs <static-dir>
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_PAGES_SITE_URL,
  absolutizeRobots,
  absolutizeSitemap,
  sitemapLocs,
} from "../src/lib/sitemap-urls.ts";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: absolutize-sitemap.mjs <static-dir>");
  process.exit(2);
}
const siteUrl = process.env.SITE_URL || DEFAULT_PAGES_SITE_URL;
if (!/^https?:\/\//.test(siteUrl)) {
  console.error(`SITE_URL must be an absolute http(s) URL, got ${JSON.stringify(siteUrl)}`);
  process.exit(2);
}

const sitemapPath = join(dir, "sitemap.xml");
const robotsPath = join(dir, "robots.txt");
if (!existsSync(sitemapPath) || !existsSync(robotsPath)) {
  console.error(`missing sitemap.xml or robots.txt in ${dir}`);
  process.exit(1);
}

const sitemap = absolutizeSitemap(readFileSync(sitemapPath, "utf8"), siteUrl);
const relative = sitemapLocs(sitemap).filter((loc) => !/^https?:\/\//.test(loc));
if (relative.length) {
  console.error(`relative <loc> entries remain: ${relative.join(", ")}`);
  process.exit(1);
}
writeFileSync(sitemapPath, sitemap);
writeFileSync(robotsPath, absolutizeRobots(readFileSync(robotsPath, "utf8"), siteUrl));
console.log(`sitemap_absolute_ok ${sitemapLocs(sitemap).length} urls under ${siteUrl}`);
