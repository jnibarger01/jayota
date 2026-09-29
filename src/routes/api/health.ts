import { createFileRoute } from "@tanstack/react-router";
import { VEHICLES } from "@/showroom/data/vehicles";
import { VEHICLE_SCHEMA_VERSION } from "@/showroom/types/vehicle";
import { jsonResponse } from "@/showroom/server/apiResponse";
import { overallHealthStatus, runHealthChecks } from "@/showroom/server/healthChecks";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const checks = await runHealthChecks();
        return jsonResponse(
          {
            status: overallHealthStatus(checks),
            schemaVersion: VEHICLE_SCHEMA_VERSION,
            vehicleCount: VEHICLES.length,
            checks,
            timestamp: new Date().toISOString(),
          },
          {
            // Health is a live probe, never cacheable.
            headers: { "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});
