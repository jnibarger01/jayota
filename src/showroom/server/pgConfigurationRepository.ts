import { getSql } from "@/lib/db";
import { CUSTOMIZATION_SCHEMA_VERSION, type VehicleConfiguration } from "../types/customization";
import type { ValidatedConfigurationInput, ValidatedPatch } from "../validation/configuration";
import { forbidden, notFound, revisionConflict } from "../api/errors";
import { generateOwnerToken, hashOwnerToken, verifyOwnerToken } from "../shared/ownerToken";
import { newId } from "../shared/id";
import type { ConfigurationRepository } from "./configurationRepository";

interface ConfigurationRow {
  id: string;
  user_id: string | null;
  vehicle_id: string;
  model_year: number;
  model: string;
  grade_id: string;
  owner_token_hash: string;
  selections: string;
  camera_state: string | null;
  paint_studio: string | null;
  revision: number;
  schema_version: string;
  created_at: string;
  updated_at: string;
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toConfiguration(row: ConfigurationRow): VehicleConfiguration {
  return {
    configurationId: row.id,
    vehicleId: row.vehicle_id,
    modelYear: Number(row.model_year),
    model: row.model,
    gradeId: row.grade_id,
    selections: parseJson(row.selections, {}),
    cameraState: parseJson(row.camera_state, undefined),
    paintStudio: parseJson(row.paint_studio, undefined),
    revision: Number(row.revision),
    schemaVersion: row.schema_version,
    createdAt: typeof row.created_at === "string" ? row.created_at : new Date(row.created_at).toISOString(),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString(),
  };
}

export class PostgresConfigurationRepository implements ConfigurationRepository {
  async create(input: ValidatedConfigurationInput): Promise<{ configuration: VehicleConfiguration; ownerToken: string }> {
    const sql = await getSql();
    const id = newId("cfg");
    const now = new Date().toISOString();
    const ownerToken = generateOwnerToken();
    const ownerTokenHash = await hashOwnerToken(ownerToken);
    const configuration: VehicleConfiguration = {
      configurationId: id,
      vehicleId: input.vehicleId,
      modelYear: input.modelYear,
      model: input.model,
      gradeId: input.gradeId,
      selections: input.selections,
      cameraState: input.cameraState,
      paintStudio: input.paintStudio,
      revision: 1,
      schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
    };
    await sql`
      insert into configurations (
        id, vehicle_id, model_year, model, grade_id, owner_token_hash,
        selections, camera_state, paint_studio, revision, schema_version, created_at, updated_at
      ) values (
        ${id}, ${input.vehicleId}, ${input.modelYear}, ${input.model}, ${input.gradeId}, ${ownerTokenHash},
        ${JSON.stringify(input.selections)}, ${input.cameraState ? JSON.stringify(input.cameraState) : null},
        ${input.paintStudio ? JSON.stringify(input.paintStudio) : null},
        ${1}, ${CUSTOMIZATION_SCHEMA_VERSION}, ${now}, ${now}
      )
    `;
    await sql`
      insert into configuration_revisions (id, configuration_id, revision, selections, camera_state, paint_studio, created_at)
      values (${newId("rev")}, ${id}, ${1}, ${JSON.stringify(input.selections)},
        ${input.cameraState ? JSON.stringify(input.cameraState) : null},
        ${input.paintStudio ? JSON.stringify(input.paintStudio) : null}, ${now})
    `;
    return { configuration, ownerToken };
  }

  async get(configurationId: string): Promise<VehicleConfiguration | null> {
    const sql = await getSql();
    const rows = await sql<ConfigurationRow>`select * from configurations where id = ${configurationId} limit 1`;
    return rows[0] ? toConfiguration(rows[0]) : null;
  }

  async requireOwner(configurationId: string, ownerToken: string): Promise<void> {
    const sql = await getSql();
    const rows = await sql<{ owner_token_hash: string }>`
      select owner_token_hash from configurations where id = ${configurationId} limit 1
    `;
    if (!rows[0]) throw notFound(`No configuration found with id "${configurationId}".`);
    if (!(await verifyOwnerToken(ownerToken, rows[0].owner_token_hash))) {
      throw forbidden(`Owner token missing or does not match for configuration "${configurationId}".`);
    }
  }

  async update(configurationId: string, patch: ValidatedPatch, ownerToken: string): Promise<VehicleConfiguration> {
    await this.requireOwner(configurationId, ownerToken);
    const existing = await this.get(configurationId);
    if (!existing) throw notFound(`No configuration found with id "${configurationId}".`);
    if (patch.expectedRevision !== undefined && patch.expectedRevision !== existing.revision) {
      throw revisionConflict(
        `Configuration "${configurationId}" is at revision ${existing.revision}, not ${patch.expectedRevision}. Reload before retrying.`,
      );
    }
    const next: VehicleConfiguration = {
      ...existing,
      selections: patch.selections ?? existing.selections,
      cameraState: patch.cameraState ?? existing.cameraState,
      paintStudio: patch.paintStudio ?? existing.paintStudio,
      revision: existing.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    const sql = await getSql();
    await sql`
      update configurations set
        selections = ${JSON.stringify(next.selections)},
        camera_state = ${next.cameraState ? JSON.stringify(next.cameraState) : null},
        paint_studio = ${next.paintStudio ? JSON.stringify(next.paintStudio) : null},
        revision = ${next.revision},
        updated_at = ${next.updatedAt}
      where id = ${configurationId}
    `;
    await sql`
      insert into configuration_revisions (id, configuration_id, revision, selections, camera_state, paint_studio, created_at)
      values (${newId("rev")}, ${configurationId}, ${next.revision}, ${JSON.stringify(next.selections)},
        ${next.cameraState ? JSON.stringify(next.cameraState) : null},
        ${next.paintStudio ? JSON.stringify(next.paintStudio) : null}, ${next.updatedAt})
    `;
    return next;
  }

  async delete(configurationId: string, ownerToken: string): Promise<boolean> {
    const existing = await this.get(configurationId);
    if (!existing) return false;
    await this.requireOwner(configurationId, ownerToken);
    const sql = await getSql();
    await sql`delete from configuration_revisions where configuration_id = ${configurationId}`;
    await sql`delete from configurations where id = ${configurationId}`;
    return true;
  }

  async listRevisions(configurationId: string): Promise<VehicleConfiguration[]> {
    const current = await this.get(configurationId);
    if (!current) return [];
    const sql = await getSql();
    const rows = await sql<{
      revision: number;
      selections: string;
      camera_state: string | null;
      paint_studio: string | null;
      created_at: string;
    }>`
      select revision, selections, camera_state, paint_studio, created_at
      from configuration_revisions
      where configuration_id = ${configurationId}
      order by revision asc
    `;
    return rows.map((row) => ({
      ...current,
      selections: parseJson(row.selections, {}),
      cameraState: parseJson(row.camera_state, undefined),
      paintStudio: parseJson(row.paint_studio, undefined),
      revision: Number(row.revision),
      updatedAt: typeof row.created_at === "string" ? row.created_at : new Date(row.created_at).toISOString(),
    }));
  }
}

let pgSingleton: PostgresConfigurationRepository | null = null;

export function getPostgresConfigurationRepository(): PostgresConfigurationRepository {
  pgSingleton ??= new PostgresConfigurationRepository();
  return pgSingleton;
}
