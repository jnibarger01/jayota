/**
 * In-process sliding-window rate limiter.
 *
 * Production at the Cloudflare edge used Workers Rate Limiting bindings. This sandbox / Vercel
 * deploy has no such binding, so we meter in-memory per isolate. That is fail-closed within a
 * single instance and resets on cold start — still enough to stop naive form floods. A shared
 * Redis/Upstash limiter is the remaining production upgrade (documented in remaining blockers).
 *
 * Defaults and env knobs are documented in the root README ("Showroom API rate limits").
 */
import { tooManyRequests } from "../../showroom/api/errors.ts";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** Documented defaults (per sliding window). Override with SHOWROOM_RATE_LIMIT_* env vars. */
export const DEFAULT_RATE_LIMITS = {
  catalogRead: 300,
  configWrite: 30,
  leadWrite: 8,
  search: 60,
} as const;

export type RateLimitKind = keyof typeof DEFAULT_RATE_LIMITS;

export const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;

const ENV_KEYS: Record<RateLimitKind, string> = {
  catalogRead: "SHOWROOM_RATE_LIMIT_CATALOG_READ",
  configWrite: "SHOWROOM_RATE_LIMIT_CONFIG_WRITE",
  leadWrite: "SHOWROOM_RATE_LIMIT_LEAD_WRITE",
  search: "SHOWROOM_RATE_LIMIT_SEARCH",
};

function envValue(key: string): string | undefined {
  return typeof process !== "undefined" ? process.env[key]?.trim() : undefined;
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

/** Resolved per-minute (per-window) ceiling for a limit kind. */
export function rateLimitFor(kind: RateLimitKind): number {
  return parsePositiveInt(envValue(ENV_KEYS[kind]), DEFAULT_RATE_LIMITS[kind]);
}

/** Sliding window length in ms (`SHOWROOM_RATE_LIMIT_WINDOW_MS`, default 60000). */
export function rateLimitWindowMs(): number {
  return parsePositiveInt(envValue("SHOWROOM_RATE_LIMIT_WINDOW_MS"), DEFAULT_RATE_LIMIT_WINDOW_MS);
}

/**
 * Live limits (env-overridable). Existing call sites that read `LIMITS.configWrite` etc. pick up
 * knobs without further changes.
 */
export const LIMITS = {
  get catalogRead() {
    return rateLimitFor("catalogRead");
  },
  get configWrite() {
    return rateLimitFor("configWrite");
  },
  get leadWrite() {
    return rateLimitFor("leadWrite");
  },
  get search() {
    return rateLimitFor("search");
  },
};

export function clientKeyFromRequest(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return `ip:${cf}`;
  // Do not key on spoofable x-forwarded-for. Fall back to a coarse UA hash so honest
  // browsers are not collapsed into one global bucket.
  const ua = request.headers.get("user-agent") ?? "unknown";
  let hash = 0;
  for (let i = 0; i < ua.length; i += 1) hash = (hash * 31 + ua.charCodeAt(i)) | 0;
  return `ua:${hash}`;
}

export function takeToken(
  key: string,
  limit: number,
  windowMs: number = rateLimitWindowMs(),
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
  const windowRetry = Math.max(1, Math.ceil(windowMs / 1000));
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { success: false, remaining: 0, retryAfterSeconds };
  }
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    success: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSeconds: windowRetry,
  };
}

export function enforceLimit(
  key: string,
  limit: number,
  message: string,
  windowMs: number = rateLimitWindowMs(),
): void {
  const result = takeToken(key, limit, windowMs);
  if (!result.success) throw tooManyRequests(message, result.retryAfterSeconds);
}

/** Test helper: drop in-memory buckets (does not clear env knobs). */
export function resetRateLimitBuckets(): void {
  buckets.clear();
}
