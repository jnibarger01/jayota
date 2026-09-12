/**
 * Route loaders: full-stack (dev/Vercel) uses createServerFn handlers;
 * static GitHub Pages builds use client-safe catalog data.
 * Pages-only env is set by scripts/build-github-pages.sh (VITE_STATIC_PAGES=1).
 */
import {
  loadInventoryState as loadInventoryData,
  loadOffersState as loadOffersData,
} from "@/lib/catalog-data";
import { getInventoryState, getOffersState } from "@/lib/server/catalog";

function isStaticPagesBuild(): boolean {
  try {
    const v = import.meta.env?.VITE_STATIC_PAGES;
    if (v === "1" || v === "true") return true;
  } catch {
    /* ignore */
  }
  if (typeof process !== "undefined" && process.env?.GITHUB_PAGES === "1") return true;
  return false;
}

export function loadInventoryState() {
  if (isStaticPagesBuild()) return loadInventoryData();
  return getInventoryState();
}

export function loadOffersState() {
  if (isStaticPagesBuild()) return loadOffersData();
  return getOffersState();
}
