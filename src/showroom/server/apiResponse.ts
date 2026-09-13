import { ApiError, toErrorBody } from "../api/errors.ts";
import { RATE_LIMIT_RETRY_AFTER_SECONDS } from "./rateLimit.ts";

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
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
