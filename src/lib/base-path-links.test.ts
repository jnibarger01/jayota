import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// GitHub Pages serves the app under /jayota/. Raw root-absolute internal URLs
// bypass the router basepath and escape the site (issue #27). Internal links
// should use <Link to=…>, useNavigate(), or publicUrl().
const SRC = join(process.cwd(), "src");

const RULES: Array<{ name: string; pattern: RegExp }> = [
  { name: 'JSX href="/…" literal', pattern: /\bhref=\{?\s*["'`]\// },
  { name: 'location.assign/replace("/…") literal', pattern: /location\.(?:assign|replace)\(\s*["'`]\// },
  { name: 'location.href = "/…" literal', pattern: /location\.href\s*=\s*["'`]\// },
  { name: "location.assign(pageUrl(…)) without publicUrl", pattern: /location\.(?:assign|replace)\(\s*pageUrl\(/ },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) && !entry.endsWith(".gen.ts")) out.push(full);
  }
  return out;
}

test("no raw root-absolute internal navigation in src", () => {
  const offenders: string[] = [];
  for (const file of walk(SRC)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        if (rule.pattern.test(line)) offenders.push(`${relative(process.cwd(), file)}:${i + 1} ${rule.name}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `use <Link>, useNavigate(), or publicUrl():\n${offenders.join("\n")}`);
});

test("the guard rules catch the patterns they target", () => {
  const samples = [
    '<a href="/privacy#cookies">',
    "window.location.assign(\"/account\");",
    "window.location.assign(`/shop/inventory?${q}`);",
    'window.location.href = "/login";',
    'window.location.assign(pageUrl("garage"))',
  ];
  for (const sample of samples) {
    assert.ok(RULES.some((r) => r.pattern.test(sample)), `expected a rule to match ${sample}`);
  }
  assert.ok(!RULES.some((r) => r.pattern.test('window.location.assign(publicUrl("/account"))')));
  assert.ok(!RULES.some((r) => r.pattern.test('<a href="https://www.toyota.com/">')));
});
