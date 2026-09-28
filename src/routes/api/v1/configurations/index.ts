import { createFileRoute } from "@tanstack/react-router";
import { getConfigurationRepository } from "@/showroom/server/configurationRepository";
import { priceConfiguration, validateCreateConfiguration } from "@/showroom/validation/configuration";
import { CUSTOMIZATION_SCHEMA_VERSION } from "@/showroom/types/customization";
import { enforceConfigWriteRateLimit } from "@/showroom/server/rateLimit";
import { errorResponse, jsonResponse } from "@/showroom/server/apiResponse";
import { readJsonBody } from "@/showroom/server/readJsonBody";

export const Route = createFileRoute("/api/v1/configurations/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await enforceConfigWriteRateLimit(request);
          const input = validateCreateConfiguration(await readJsonBody(request));
          const { configuration, ownerToken } = await getConfigurationRepository().create(input);
          return jsonResponse(
            {
              schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
              data: configuration,
              ownerToken,
              pricing: {
                optionsTotal: priceConfiguration(
                  configuration.vehicleId,
                  configuration.selections,
                  configuration.paintStudio,
                ),
              },
            },
            {
              status: 201,
              headers: {
                Location: `/api/v1/configurations/${configuration.configurationId}`,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          return errorResponse(err);
        }
      },
    },
  },
});
