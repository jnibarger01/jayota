import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// The "Skip to content" link must land on a focusable main landmark, and SiteShell pages must
// expose exactly one <main> (issue #31).
const root = process.cwd();
const shell = readFileSync(join(root, "src/components/layout/SiteShell.tsx"), "utf8");

test("SiteShell renders a focusable main#main that the skip link targets", () => {
  assert.match(shell, /href="#main"/);
  assert.match(shell, /<main\s+id="main"\s+tabIndex=\{-1\}/);
  assert.doesNotMatch(shell, /<div\s+id="main"/);
});

test("no SiteShell content renders its own <main>", () => {
  // Stand-alone screens that do not render inside SiteShell may own their <main>.
  const allowed = new Set([
    "src/components/layout/SiteShell.tsx",
    "src/components/showroom/BuilderApp.tsx",
    "src/lib/error-component.tsx",
  ]);
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".tsx")) {
        const rel = relative(root, full);
        if (!allowed.has(rel) && /<main[\s>]/.test(readFileSync(full, "utf8"))) offenders.push(rel);
      }
    }
  };
  walk(join(root, "src"));
  assert.deepEqual(offenders, []);
});
