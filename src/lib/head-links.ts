import { publicUrl, withBase } from "./public-url.ts";

/**
 * Same-origin icon/manifest head links, prefixed with the deploy base so they resolve under
 * `/jayota/` on GitHub Pages and stay root-absolute locally. Pass `base` to override (tests).
 */
export function appIconLinks(base?: string) {
  const url = (path: string) => (base === undefined ? publicUrl(path) : withBase(path, base));
  return [
    { rel: "icon", type: "image/svg+xml", href: url("/favicon.svg") },
    { rel: "manifest", href: url("/__grok/manifest.webmanifest") },
    { rel: "apple-touch-icon", href: url("/__grok/icon-180.png") },
  ];
}
