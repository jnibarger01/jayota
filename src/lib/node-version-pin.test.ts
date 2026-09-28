import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Keeps the Node major pinned consistently across .nvmrc, package.json
// engines, and every `node-version:` in the GitHub workflows (issue #25).
const root = process.cwd();

function major(spec: string): string {
  const match = /(\d+)/.exec(spec);
  assert.ok(match, `no numeric major in ${JSON.stringify(spec)}`);
  return match[1];
}

test(".nvmrc, engines.node, and workflow node-version pins agree on the major", () => {
  const nvmrc = readFileSync(join(root, ".nvmrc"), "utf8").trim();
  assert.match(nvmrc, /^\d+$/, ".nvmrc should contain a bare major, e.g. 24");

  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    engines?: { node?: string };
  };
  assert.ok(pkg.engines?.node, "package.json must declare engines.node");
  assert.equal(major(pkg.engines.node), nvmrc, "engines.node minimum major must match .nvmrc");

  const workflowsDir = join(root, ".github", "workflows");
  const pins: string[] = [];
  for (const file of readdirSync(workflowsDir)) {
    if (!/\.ya?ml$/.test(file)) continue;
    const text = readFileSync(join(workflowsDir, file), "utf8");
    for (const m of text.matchAll(/node-version:\s*["']?([^"'\s#]+)/g)) {
      pins.push(`${file}:${m[1]}`);
      assert.equal(major(m[1]), nvmrc, `${file} pins node-version ${m[1]}, expected ${nvmrc}`);
    }
  }
  assert.ok(pins.length > 0, "expected at least one workflow node-version pin");
});
