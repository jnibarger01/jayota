#!/usr/bin/env node
/**
 * Optional PGlite backup/restore for the filesystem data directory.
 *
 *   PGLITE_DATA_DIR=.pglite-data node scripts/pglite-backup.mjs export [out.tgz]
 *   PGLITE_DATA_DIR=.pglite-data node scripts/pglite-backup.mjs import <in.tgz>
 *
 * Defaults: data dir `.pglite-data`, export path `backups/pglite-<timestamp>.tgz`.
 * Never commit `.pglite-data/` or backup tarballs (see .gitignore).
 *
 * In-memory preview DBs (no PGLITE_DATA_DIR) cannot be dumped by this script —
 * use the `exportPgliteBackup` helper against a live `getPglite()` instance, or
 * enable filesystem persistence first.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DATA_DIR = ".pglite-data";

function dataDirPath() {
  const raw = process.env.PGLITE_DATA_DIR?.trim() || DEFAULT_DATA_DIR;
  return resolve(ROOT, raw);
}

function defaultExportPath() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return join(ROOT, "backups", `pglite-${stamp}.tgz`);
}

async function cmdExport(outArg) {
  const dataDir = dataDirPath();
  const outPath = resolve(ROOT, outArg ?? defaultExportPath());
  const pg = new PGlite({ dataDir });
  await pg.waitReady;
  try {
    const dump = await pg.dumpDataDir("gzip");
    const bytes = new Uint8Array(await dump.arrayBuffer());
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, bytes);
    console.log(`[pglite-backup] exported ${bytes.byteLength} bytes → ${outPath}`);
  } finally {
    await pg.close();
  }
}

async function cmdImport(inArg) {
  if (!inArg) {
    console.error("usage: node scripts/pglite-backup.mjs import <backup.tgz>");
    process.exit(1);
  }
  const dataDir = dataDirPath();
  const inPath = resolve(ROOT, inArg);
  const bytes = await readFile(inPath);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const pg = new PGlite({ dataDir, loadDataDir: new Blob([copy]) });
  await pg.waitReady;
  try {
    const probe = await pg.query(
      "select to_regclass('public.configurations')::text as configurations",
    );
    console.log(
      `[pglite-backup] imported ${inPath} → ${dataDir}` +
        ` (configurations=${probe.rows[0]?.configurations ?? "null"})`,
    );
  } finally {
    await pg.close();
  }
}

async function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === "export") return cmdExport(arg);
  if (cmd === "import") return cmdImport(arg);
  console.error(`usage:
  node scripts/pglite-backup.mjs export [out.tgz]
  node scripts/pglite-backup.mjs import <in.tgz>

Env: PGLITE_DATA_DIR (default ${DEFAULT_DATA_DIR})`);
  process.exit(cmd ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error("[pglite-backup] failed:", err?.message || err);
    process.exit(1);
  });
}
