#!/usr/bin/env node
/**
 * Fetch smoke for the GitHub Pages base path (/jayota/).
 *
 * Expects vite preview (see vite.pages-preview.config.mjs) to already be
 * serving `.vercel/output/static` under base `/jayota/` after `npm run build:pages`.
 * PR CI: build:pages → vite preview --config vite.pages-preview.config.mjs → this script.
 *
 * Wrong Vite/Pages `base` → index or linked JS/CSS missing / wrong Content-Type under
 * /jayota/ (SPA fallback HTML) → exit 1.
 */
import { checkedUrl } from "./browser-guard.mjs";

const PAGES_BASE = "/jayota/";
const urlArg = process.argv[2] || "http://127.0.0.1:4175/jayota/";
const originUrl = checkedUrl(urlArg);
const timeoutMs = Number(process.env.PAGES_BASE_SMOKE_TIMEOUT_MS || 15000);

function fail(message, extra) {
  console.error(JSON.stringify({ ok: false, error: message, ...extra }, null, 2));
  process.exit(1);
}

async function fetchRes(url) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: "manual", signal: ac.signal });
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err), { url });
  } finally {
    clearTimeout(timer);
  }
}

function contentType(res) {
  return (res.headers.get("content-type") || "").toLowerCase();
}

function expectType(url, res, kind) {
  if (res.status < 200 || res.status >= 300) {
    fail(`expected 200 for ${url}`, { status: res.status, kind });
  }
  const ct = contentType(res);
  const ok =
    kind === "html"
      ? ct.includes("text/html")
      : kind === "js"
        ? ct.includes("javascript") || ct.includes("ecmascript")
        : kind === "css"
          ? ct.includes("text/css")
          : kind === "svg"
            ? ct.includes("svg") || ct.includes("image/")
            : false;
  if (!ok) {
    fail(`unexpected Content-Type for ${kind}`, { url, contentType: ct, status: res.status });
  }
}

const indexUrl = new URL(originUrl);
const pathNorm = indexUrl.pathname.replace(/\/$/, "") || "/";
if (!pathNorm.endsWith("/jayota")) {
  fail(`smoke URL must target the Pages base ${PAGES_BASE}`, { url: originUrl, path: indexUrl.pathname });
}
if (!indexUrl.pathname.endsWith("/")) {
  indexUrl.pathname += "/";
}

const indexRes = await fetchRes(indexUrl.href);
expectType(indexUrl.href, indexRes, "html");
const html = await indexRes.text();
if (!/<html|<!doctype/i.test(html)) {
  fail("index did not look like HTML", { snippet: html.slice(0, 120) });
}

const refs = [];
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const ref = match[1];
  if (/\.(?:js|css)(?:\?|$)/i.test(ref) || /favicon\.svg(?:\?|$)/i.test(ref)) {
    refs.push(ref);
  }
}

const jsRefs = refs.filter((r) => /\.js(?:\?|$)/i.test(r));
const cssRefs = refs.filter((r) => /\.css(?:\?|$)/i.test(r));
if (jsRefs.length === 0) fail("index has no JS asset under src/href");
if (cssRefs.length === 0) fail("index has no CSS asset under src/href");

const checked = [];
for (const ref of refs) {
  if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:")) {
    continue;
  }
  if (!ref.startsWith(PAGES_BASE)) {
    fail(`asset ref is not under Pages base ${PAGES_BASE}`, { ref });
  }
  const abs = new URL(ref, indexUrl).href;
  const kind = /\.js(?:\?|$)/i.test(ref)
    ? "js"
    : /\.css(?:\?|$)/i.test(ref)
      ? "css"
      : "svg";
  const res = await fetchRes(abs);
  expectType(abs, res, kind);
  checked.push({ ref, contentType: contentType(res) });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      base: PAGES_BASE,
      index: indexUrl.href,
      checked,
      js: jsRefs.length,
      css: cssRefs.length,
    },
    null,
    2,
  ),
);
