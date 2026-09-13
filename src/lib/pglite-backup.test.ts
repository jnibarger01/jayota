import assert from "node:assert/strict";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import {
  exportPgliteBackupBytes,
  importPgliteBackupBytes,
} from "./pglite-backup.ts";

/** Minimal showroom configuration shape matching migrations/0002_showroom.sql. */
const SHOWROOM_DDL = `
create table if not exists configurations (
  id text primary key,
  user_id text,
  vehicle_id text not null,
  model_year integer not null,
  model text not null,
  grade_id text not null,
  owner_token_hash text not null,
  selections text not null,
  camera_state text,
  paint_studio text,
  revision integer not null default 1,
  schema_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
`;

test("PGlite export → import restores a saved showroom configuration", async () => {
  const source = new PGlite();
  await source.waitReady;
  await source.exec(SHOWROOM_DDL);

  const saved = {
    id: "cfg_roundtrip_demo",
    vehicle_id: "toyota-rav4-2026",
    model_year: 2026,
    model: "RAV4",
    grade_id: "xle",
    owner_token_hash: "hash_test_only",
    selections: JSON.stringify({ exterior: "supersonic-red", wheels: "18-alloy" }),
    schema_version: "1",
    revision: 2,
  };

  await source.query(
    `insert into configurations (
      id, vehicle_id, model_year, model, grade_id, owner_token_hash,
      selections, revision, schema_version
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      saved.id,
      saved.vehicle_id,
      saved.model_year,
      saved.model,
      saved.grade_id,
      saved.owner_token_hash,
      saved.selections,
      saved.revision,
      saved.schema_version,
    ],
  );

  const before = await source.query<{ id: string; model: string; selections: string }>(
    "select id, model, selections from configurations where id = $1",
    [saved.id],
  );
  assert.equal(before.rows.length, 1);
  assert.equal(before.rows[0]?.model, "RAV4");

  const dump = await exportPgliteBackupBytes(source, "gzip");
  assert.ok(dump.byteLength > 0);
  await source.close();

  const restored = await importPgliteBackupBytes(dump);
  try {
    const after = await restored.query<{
      id: string;
      vehicle_id: string;
      model: string;
      grade_id: string;
      selections: string;
      revision: number;
    }>("select id, vehicle_id, model, grade_id, selections, revision from configurations where id = $1", [
      saved.id,
    ]);
    assert.equal(after.rows.length, 1);
    const row = after.rows[0]!;
    assert.equal(row.id, saved.id);
    assert.equal(row.vehicle_id, saved.vehicle_id);
    assert.equal(row.model, saved.model);
    assert.equal(row.grade_id, saved.grade_id);
    assert.equal(row.selections, saved.selections);
    assert.equal(Number(row.revision), saved.revision);
  } finally {
    await restored.close();
  }
});
