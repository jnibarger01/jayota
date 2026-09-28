/**
 * The sitemap protocol requires absolute URLs. `public/sitemap.xml` keeps the canonical list of
 * root-relative paths; deploy builds rewrite them under the site origin + base path (issue #33).
 */
export const DEFAULT_PAGES_SITE_URL = "https://jnibarger01.github.io/jayota";

function trimSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "");
}

/** `/vehicles` -> `https://host/base/vehicles`; absolute URLs are returned unchanged. */
export function absoluteUrl(path: string, siteUrl: string): string {
  const value = path.trim();
  if (/^https?:\/\//i.test(value)) return value;
  const site = trimSiteUrl(siteUrl);
  if (value === "" || value === "/") return `${site}/`;
  return `${site}${value.startsWith("/") ? value : `/${value}`}`;
}

/** Rewrites every `<loc>` in a sitemap to an absolute URL. Idempotent. */
export function absolutizeSitemap(xml: string, siteUrl: string): string {
  return xml.replace(/<loc>([^<]*)<\/loc>/g, (_match, loc: string) => `<loc>${absoluteUrl(loc, siteUrl)}</loc>`);
}

/** Rewrites `Sitemap:` lines in robots.txt to absolute URLs. Idempotent. */
export function absolutizeRobots(robots: string, siteUrl: string): string {
  return robots.replace(/^(Sitemap:\s*)(\S+)\s*$/gim, (_match, prefix: string, url: string) => `${prefix}${absoluteUrl(url, siteUrl)}`);
}

export function sitemapLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
}
