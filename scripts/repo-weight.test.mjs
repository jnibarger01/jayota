import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

/**
 * Keeps large binaries out of the git object database.
 *
 * Ported from `toyota-showroom/tests/repoWeight.test.ts`, which exists there because that repo
 * accumulated ~90 MB of Blender sources no build step ever read. This repo had the same problem in
 * a different costume: ~11 MB of QA screenshots, a 2.1 MB `.grok/card-raw.png`, and two opaque
 * `attachments/<UUID>` blobs — none of them read by the build, the tests, or the deploy, all of
 * them paid for by every clone and every CI run.
 *
 * Untracking them fixes today. This test fixes tomorrow: the mistake recurs when someone commits a
 * new capture, it looks fine locally, and it is permanently in history before anyone notices.
 */

/** Per-file ceiling for anything not named in ALLOWANCES. */
const MAX_TRACKED_BYTES = 512 * 1024;

/**
 * Directory prefixes allowed past the ceiling, for shipped assets where the whole directory has
 * one justification. Prefer a per-file ALLOWANCES entry; use this only when a per-file list would
 * be pure noise.
 */
const ALLOWED_PREFIXES = new Map([
  [
    "public/images/campaign/",
    // Shipped hero imagery for the vehicle lineup — the site renders these, so the repo carries
    // them. They are unoptimized JPEGs averaging ~450 KiB while public/images/lineup/ is already
    // WebP; converting the campaign set is a real, separate win worth taking.
    "Shipped vehicle campaign imagery rendered by the lineup and vehicle pages.",
  ],
]);

/**
 * Files allowed past the ceiling, each with the reason it earns the exception. An entry here is a
 * deliberate decision with a rationale attached, not a way to silence the test — adding one should
 * feel like it needs an argument, because it does.
 */
const ALLOWANCES = new Map([
  ["public/models/modsnation_7416_assets_assembled.glb", "Primary 4Runner vehicle asset; already optimized 28 MiB -> 1.2 MiB."],
  ["public/models/toyota-ae86-ivofficial.glb", "AE86 vehicle asset; smallest usable export (see src/showroom/data/options/ae86.ts)."],
  ["public/models/rav4-2024/rav4_2024_limited_decoded.glb", "RAV4 vehicle asset, Draco-decoded for runtime load."],
  ["public/models/4runner-2024/ModsNation_7416_tire.glb", "Wheel/tire swap asset referenced by the 4Runner scene map."],
  ["public/models/4runner-2024/ModsNation_7416_wheel_a.glb", "Wheel/tire swap asset referenced by the 4Runner scene map."],
  ["public/images/modsnation_7416_final_hero_tweaked.png", "Hero still used by the vehicle page and OG card."],
  ["public/draco/draco_decoder.js", "Vendored Draco decoder; must match draco_decoder.wasm exactly."],
  ["public/draco/draco_decoder.wasm", "Vendored Draco decoder binary."],
  ["public/draco/draco_wasm_wrapper.js", "Vendored Draco decoder glue."],
  ["public/renders/rav4-2024/cold_photography_studio_1k.hdr", "HDRI used by the showroom environment controller."],
  ["public/og.jpg", "Open Graph share card served from the site root."],
]);

function isAllowed(path) {
  if (ALLOWANCES.has(path)) return true;
  for (const prefix of ALLOWED_PREFIXES.keys()) {
    if (path.startsWith(prefix)) return true;
  }
  return false;
}

/** Files git is tracking, as `[path, blobByteSize]`. */
function trackedFileSizes() {
  // Reads the *index*, not HEAD, so a staged oversized file fails before the commit exists —
  // running this pre-commit should tell you what you are about to commit.
  const index = execFileSync("git", ["ls-files", "--stage"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  const entries = [];
  for (const line of index.split("\n")) {
    if (!line) continue;
    // <mode> SP <object> SP <stage> TAB <path>
    const [meta, path] = line.split("\t");
    const sha = meta.split(" ")[1];
    if (sha && path) entries.push({ sha, path });
  }
  if (entries.length === 0) return [];

  // Sizes come from the blob in the object database, not `stat` on the working tree — that is the
  // number that matters for clone weight, and it is what makes this correct under git-lfs, where a
  // tracked file is a ~130-byte pointer blob in git while being full-size on disk.
  const sizes = execFileSync("git", ["cat-file", "--batch-check=%(objectsize)"], {
    input: entries.map((e) => e.sha).join("\n"),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .trim()
    .split("\n");

  return entries.map((e, i) => [e.path, Number(sizes[i])]);
}

test("no tracked file exceeds the size ceiling without a documented allowance", () => {
  const oversized = trackedFileSizes()
    .filter(([path, size]) => size > MAX_TRACKED_BYTES && !isAllowed(path))
    .map(([path, size]) => `${path} (${(size / 1024).toFixed(0)} KiB)`)
    .sort();

  assert.deepEqual(
    oversized,
    [],
    `Tracked files over ${MAX_TRACKED_BYTES / 1024} KiB with no allowance.\n` +
      `Untrack them (git rm --cached + .gitignore), or add an ALLOWANCES entry saying why the ` +
      `repo should carry the weight:\n  ${oversized.join("\n  ")}`,
  );
});

test("every allowance still points at a tracked file", () => {
  // Otherwise allowances outlive their files and quietly become permission for a future,
  // unrelated file that happens to land on the same path.
  const tracked = new Set(trackedFileSizes().map(([path]) => path));
  const stale = [...ALLOWANCES.keys()].filter((path) => !tracked.has(path)).sort();
  assert.deepEqual(stale, [], "Remove allowances for files that are no longer tracked.");
});
