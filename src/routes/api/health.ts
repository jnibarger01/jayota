import { createFileRoute } from "@tanstack/react-router";
import { VEHICLES } from "@/showroom/data/vehicles";
import { VEHICLE_SCHEMA_VERSION } from "@/showroom/types/vehicle";
import { jsonResponse } from "@/showroom/server/apiResponse";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () =>
        jsonResponse({
          status: "ok",
          schemaVersion: VEHICLE_SCHEMA_VERSION,
          vehicleCount: VEHICLES.length,
          timestamp: new Date().toISOString(),
        }),
    },
  },
});
