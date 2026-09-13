/**
 * PGlite backup helpers for showroom/preview data.
 *
 * Preview uses an embedded PGlite instance (`src/lib/db.ts`). By default it is
 * in-memory (process lifetime only). Set `PGLITE_DATA_DIR` (recommended:
 * `.pglite-data`) for filesystem persistence across restarts. Use these helpers
 * (or `scripts/pglite-backup.mjs`) to export/import a dump — never commit live
 * DB directories or backup tarballs.
 */
import type { PGlite } from "@electric-sql/pglite";

/** Recommended on-disk location when `PGLITE_DATA_DIR` is enabled (gitignored). */
export const DEFAULT_PGLITE_DATA_DIR = ".pglite-data";

export type BackupCompression = "gzip" | "none" | "auto";

export const DEFAULT_BACKUP_COMPRESSION: BackupCompression = "gzip";

export type ImportPgliteBackupOptions = {
  /** Persist the restored DB under this path (Node/Bun/Deno). */
  dataDir?: string;
};

/**
 * Dump PGDATA from a live PGlite instance to a tarball (gzip by default).
 * Same surface as `pg.dumpDataDir`, kept here so call sites share one contract.
 */
export async function exportPgliteBackup(
  pg: PGlite,
  compression: BackupCompression = DEFAULT_BACKUP_COMPRESSION,
): Promise<File | Blob> {
  return pg.dumpDataDir(compression);
}

/** Serialize a dump to bytes (for tests / writing files). */
export async function exportPgliteBackupBytes(
  pg: PGlite,
  compression: BackupCompression = DEFAULT_BACKUP_COMPRESSION,
): Promise<Uint8Array> {
  const dump = await exportPgliteBackup(pg, compression);
  return new Uint8Array(await dump.arrayBuffer());
}

/**
 * Open a fresh PGlite from a dump produced by {@link exportPgliteBackup}.
 * Caller owns `close()` when finished.
 */
export async function importPgliteBackup(
  backup: Blob | File,
  options: ImportPgliteBackupOptions = {},
): Promise<PGlite> {
  const { PGlite: PGliteCtor } = await import("@electric-sql/pglite");
  const pg = new PGliteCtor({
    loadDataDir: backup,
    ...(options.dataDir ? { dataDir: options.dataDir } : {}),
  });
  await pg.waitReady;
  return pg;
}

/** Restore from raw dump bytes. */
export async function importPgliteBackupBytes(
  bytes: Uint8Array,
  options: ImportPgliteBackupOptions = {},
): Promise<PGlite> {
  // Copy into a fresh ArrayBuffer so Blob sees a clean BufferSource (not a view).
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return importPgliteBackup(new Blob([copy]), options);
}
