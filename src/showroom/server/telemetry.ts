/** No-op telemetry shim. Cloudflare Workers analytics are not available in this runtime. */
export function recordServerEvent(name: string, fields: Record<string, string | number | boolean> = {}): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.debug("[telemetry]", name, fields);
  }
}
