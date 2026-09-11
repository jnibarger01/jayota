//#region node_modules/.nitro/vite/services/ssr/assets/rate-limit-Bmx5kPmD.js
/** Structured API errors (goal 15). Every non-2xx response body matches ApiErrorBody. */
var ApiError = class extends Error {
	status;
	code;
	constructor(status, code, message, options) {
		super(message, options);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
};
function toErrorBody(err) {
	return { error: {
		code: err.code,
		status: err.status,
		message: err.message
	} };
}
function notFound(message) {
	return new ApiError(404, "not_found", message);
}
/** Malformed or semantically invalid request body (unknown option id, bad grade/year combination). */
function invalidBody(message) {
	return new ApiError(422, "invalid_body", message);
}
/** The client's `expectedRevision` no longer matches the stored record. */
function revisionConflict(message) {
	return new ApiError(409, "revision_conflict", message);
}
/** Missing or non-matching owner token on a write to a configuration the caller doesn't own. */
function forbidden(message) {
	return new ApiError(403, "forbidden", message);
}
/** The caller exceeded the configuration-write rate limit (lib/server/rateLimit.ts). */
function tooManyRequests(message) {
	return new ApiError(429, "rate_limited", message);
}
/**
* In-process sliding-window rate limiter.
*
* Production at the Cloudflare edge used Workers Rate Limiting bindings. This sandbox / Vercel
* deploy has no such binding, so we meter in-memory per isolate. That is fail-closed within a
* single instance and resets on cold start — still enough to stop naive form floods. A shared
* Redis/Upstash limiter is the remaining production upgrade (documented in remaining blockers).
*/
var buckets = /* @__PURE__ */ new Map();
function clientKeyFromRequest(request) {
	const cf = request.headers.get("cf-connecting-ip");
	if (cf) return `ip:${cf}`;
	const ua = request.headers.get("user-agent") ?? "unknown";
	let hash = 0;
	for (let i = 0; i < ua.length; i += 1) hash = hash * 31 + ua.charCodeAt(i) | 0;
	return `ua:${hash}`;
}
function takeToken(key, limit, windowMs = 6e4) {
	const now = Date.now();
	const bucket = buckets.get(key) ?? { timestamps: [] };
	bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);
	if (bucket.timestamps.length >= limit) {
		buckets.set(key, bucket);
		const oldest = bucket.timestamps[0] ?? now;
		return {
			success: false,
			remaining: 0,
			retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1e3))
		};
	}
	bucket.timestamps.push(now);
	buckets.set(key, bucket);
	return {
		success: true,
		remaining: Math.max(0, limit - bucket.timestamps.length),
		retryAfterSeconds: 60
	};
}
function enforceLimit(key, limit, message, windowMs) {
	if (!takeToken(key, limit, windowMs).success) throw tooManyRequests(message);
}
var LIMITS = {
	catalogRead: 300,
	configWrite: 30,
	leadWrite: 8,
	search: 60
};
//#endregion
export { forbidden as a, revisionConflict as c, enforceLimit as i, toErrorBody as l, LIMITS as n, invalidBody as o, clientKeyFromRequest as r, notFound as s, ApiError as t };
