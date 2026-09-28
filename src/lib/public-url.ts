/**
 * Prefix root-absolute public assets with Vite BASE_URL (e.g. `/jayota` on GitHub Pages).
 * Leaves absolute http(s)/data/blob URLs and already-prefixed paths alone.
 */
export function publicUrl(path: string | undefined | null): string {
  const raw =
    typeof import.meta !== "undefined" && typeof import.meta.env?.BASE_URL === "string"
      ? import.meta.env.BASE_URL
      : "/";
  return withBase(path, raw);
}

/** Pure form of {@link publicUrl} with an explicit base (e.g. `/` or `/jayota/`). */
export function withBase(path: string | undefined | null, rawBase: string): string {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (!path.startsWith("/")) return path;

  const base = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");
  if (!base) return path;
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}
