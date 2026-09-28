import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Every page route declares its own head so titles are unique (WCAG 2.4.2), and the root no
// longer marks every page as a duplicate of "/" via a sitewide canonical (issue #32).
const ROUTES = join(process.cwd(), "src", "routes");

function pageRoutes(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROUTES, full);
    if (statSync(full).isDirectory()) {
      if (rel === "api") continue;
      pageRoutes(full, out);
    } else if (entry.endsWith(".tsx") && entry !== "__root.tsx") {
      out.push(full);
    }
  }
  return out;
}

test("every page route declares a head", () => {
  const routes = pageRoutes(ROUTES);
  assert.ok(routes.length > 20, `expected the full route tree, found ${routes.length}`);
  const missing = routes
    .filter((file) => {
      const src = readFileSync(file, "utf8");
      return src.includes("createFileRoute(") && !/\bhead:\s*\(/.test(src);
    })
    .map((file) => relative(process.cwd(), file));
  assert.deepEqual(missing, [], "add head: () => pageHead(title, description)");
});

test("the root route does not emit a sitewide canonical", () => {
  const root = readFileSync(join(ROUTES, "__root.tsx"), "utf8");
  assert.doesNotMatch(root, /rel:\s*["']canonical["']/);
});
