import { test } from "node:test";
import assert from "node:assert/strict";
import { appIconLinks } from "./head-links.ts";
import { withBase } from "./public-url.ts";

test("icon links stay root-absolute with base /", () => {
  assert.deepEqual(
    appIconLinks("/").map((l) => l.href),
    ["/favicon.svg", "/__grok/manifest.webmanifest", "/__grok/icon-180.png"],
  );
});

test("icon links are prefixed under the GitHub Pages base", () => {
  assert.deepEqual(
    appIconLinks("/jayota/").map((l) => l.href),
    ["/jayota/favicon.svg", "/jayota/__grok/manifest.webmanifest", "/jayota/__grok/icon-180.png"],
  );
  assert.deepEqual(
    appIconLinks("/jayota/").map((l) => l.rel),
    ["icon", "manifest", "apple-touch-icon"],
  );
});

test("withBase leaves external, relative, and already-prefixed paths alone", () => {
  assert.equal(withBase("https://example.com/x.png", "/jayota/"), "https://example.com/x.png");
  assert.equal(withBase("data:image/png;base64,AA", "/jayota/"), "data:image/png;base64,AA");
  assert.equal(withBase("images/a.png", "/jayota/"), "images/a.png");
  assert.equal(withBase("/jayota/og.jpg", "/jayota/"), "/jayota/og.jpg");
  assert.equal(withBase("/og.jpg", "/jayota"), "/jayota/og.jpg");
  assert.equal(withBase(null, "/jayota/"), "");
});
