import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The mobile-nav smoke must wait for the committed route before interacting, because every route
// renders its own SiteShell and the tab bar is replaced on commit (issue #45).
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

test("MobileTabBar exposes the router status the smoke waits on", () => {
  assert.match(read("src/components/layout/MobileTabBar.tsx"), /data-router-status=\{routerStatus\}/);
});

test("mobile-nav smoke waits for an idle router and avoids force clicks and fixed sleeps", () => {
  const smoke = read("scripts/mobile-nav-smoke.mjs");
  assert.match(smoke, /data-router-status="idle"/);
  assert.doesNotMatch(smoke, /force:\s*true/);
  assert.doesNotMatch(smoke, /waitForTimeout\(/);
});
