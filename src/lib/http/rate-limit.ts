/**
 * In-process sliding-window rate limiter.
 *
 * Production at the Cloudflare edge used Workers Rate Limiting bindings. This sandbox / Vercel
 * deploy has no such binding, so we meter in-memory per isolate. That is fail-closed within a
 * single instance and resets on cold start — still enough to stop naive form floods. A shared
 * Redis/Upstash limiter is the remaining production upgrade (documented in remaining blockers).
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
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
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
    retryAfterSeconds: 60,
  };
}

export function enforceLimit(key: string, limit: number, message: string, windowMs?: number): void {
  const result = takeToken(key, limit, windowMs);
  if (!result.success) throw tooManyRequests(message);
}

export const LIMITS = {
  catalogRead: 300,
  configWrite: 30,
  leadWrite: 8,
  search: 60,
} as const;
