import {
  enforceLimit,
  clientKeyFromRequest,
  rateLimitFor,
  rateLimitWindowMs,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
} from "../../lib/http/rate-limit.ts";

/**
 * Throws `tooManyRequests` once the caller exceeds the configuration-write ceiling.
 * Wired on every configuration-mutating handler (POST/PATCH/DELETE).
 */
export async function enforceConfigWriteRateLimit(request: Request): Promise<void> {
  enforceLimit(
    `cfg-write:${clientKeyFromRequest(request)}`,
    rateLimitFor("configWrite"),
    "Too many configuration writes from this client. Please slow down and retry shortly.",
    rateLimitWindowMs(),
  );
}

/**
 * Throws `tooManyRequests` when a client exceeds the catalog-read ceiling.
 * Catalog/query routes should call this before serialising vehicle data.
 */
export async function enforceCatalogReadRateLimit(request: Request): Promise<void> {
  enforceLimit(
    `catalog:${clientKeyFromRequest(request)}`,
    rateLimitFor("catalogRead"),
    "Too many catalog requests from this client. Please retry shortly.",
    rateLimitWindowMs(),
  );
}

/** Default `Retry-After` hint (seconds); matches `SHOWROOM_RATE_LIMIT_WINDOW_MS` default. */
export const RATE_LIMIT_RETRY_AFTER_SECONDS = Math.max(1, Math.ceil(DEFAULT_RATE_LIMIT_WINDOW_MS / 1000));
