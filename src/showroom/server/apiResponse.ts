import { ApiError, toErrorBody } from "../api/errors.ts";
import { RATE_LIMIT_RETRY_AFTER_SECONDS } from "./rateLimit.ts";
import { withSecurityHeaders } from "./securityHeaders.ts";

/**
 * Single exit point for every `/api/v1/**` response, so the baseline security headers are attached
 * once here rather than per route — instrumenting handlers by hand guarantees the next one is
 * forgotten, and a missing header is invisible in the code review that adds the route.
 *
 * This previously set three of those headers inline while `securityHeaders.ts` sat unimported, so
 * `Permissions-Policy` and `Content-Security-Policy` reached no response at all. Routing through
 * `withSecurityHeaders` closes that gap and removes the duplicate list.
 */
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  // Caller-supplied headers win over the baseline (see `withSecurityHeaders`), so a route's own
  // Location / Cache-Control / Retry-After survive unchanged.
  const headers = withSecurityHeaders(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function errorResponse(err: unknown): Response {
  if (err instanceof ApiError) {
    const headers: Record<string, string> = {};
    if (err.status === 429) {
      headers["Retry-After"] = String(err.retryAfterSeconds ?? RATE_LIMIT_RETRY_AFTER_SECONDS);
    }
    return jsonResponse(toErrorBody(err), { status: err.status, headers });
  }
  const requestId = crypto.randomUUID();
  console.error("[api]", requestId, err instanceof Error ? err.message : "unknown_error");
  return jsonResponse(
    { error: { code: "internal_error", status: 500, message: "Something went wrong. Please retry." } },
    { status: 500, headers: { "x-request-id": requestId } },
  );
}
