import { createFileRoute } from "@tanstack/react-router";
import { forbidden, invalidBody, notFound } from "@/showroom/api/errors";
import { getConfigurationRepository } from "@/showroom/server/configurationRepository";
import { priceConfiguration, validatePatchConfiguration } from "@/showroom/validation/configuration";
import { CUSTOMIZATION_SCHEMA_VERSION } from "@/showroom/types/customization";
import { enforceConfigWriteRateLimit } from "@/showroom/server/rateLimit";
import { errorResponse, jsonResponse } from "@/showroom/server/apiResponse";

const OWNER_HEADER = "x-owner-token";

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw invalidBody("Request body must be valid JSON.");
  }
}

export const Route = createFileRoute("/api/v1/configurations/$configurationId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const configuration = await getConfigurationRepository().get(params.configurationId);
          if (!configuration) throw notFound(`No configuration found with id "${params.configurationId}".`);
          return jsonResponse(
            {
              schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
              data: configuration,
              pricing: {
                optionsTotal: priceConfiguration(
                  configuration.vehicleId,
                  configuration.selections,
                  configuration.paintStudio,
                ),
              },
            },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch (err) {
          return errorResponse(err);
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          await enforceConfigWriteRateLimit(request);
          const token = request.headers.get(OWNER_HEADER);
          if (!token) throw forbidden("Owner token required.");
          const existing = await getConfigurationRepository().get(params.configurationId);
          if (!existing) throw notFound(`No configuration found with id "${params.configurationId}".`);
          const patch = validatePatchConfiguration(await readJson(request), {
            vehicleId: existing.vehicleId,
            gradeId: existing.gradeId,
            selections: existing.selections,
          });
          const configuration = await getConfigurationRepository().update(params.configurationId, patch, token);
          return jsonResponse(
            { schemaVersion: CUSTOMIZATION_SCHEMA_VERSION, data: configuration },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch (err) {
          return errorResponse(err);
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          await enforceConfigWriteRateLimit(request);
          const token = request.headers.get(OWNER_HEADER);
          if (!token) throw forbidden("Owner token required.");
          const deleted = await getConfigurationRepository().delete(params.configurationId, token);
          if (!deleted) throw notFound(`No configuration found with id "${params.configurationId}".`);
          return new Response(null, { status: 204 });
        } catch (err) {
          return errorResponse(err);
        }
      },
    },
  },
});
