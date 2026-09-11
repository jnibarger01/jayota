import { enforceLimit, clientKeyFromRequest, LIMITS } from "@/lib/http/rate-limit";

export async function enforceConfigWriteRateLimit(request: Request): Promise<void> {
  enforceLimit(
    `cfg-write:${clientKeyFromRequest(request)}`,
    LIMITS.configWrite,
    "Too many configuration writes from this client. Please slow down and retry shortly.",
  );
}

export async function enforceCatalogReadRateLimit(request: Request): Promise<void> {
  enforceLimit(
    `catalog:${clientKeyFromRequest(request)}`,
    LIMITS.catalogRead,
    "Too many catalog requests from this client. Please retry shortly.",
  );
}

export const RATE_LIMIT_RETRY_AFTER_SECONDS = 60;
