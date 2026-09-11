import { useSyncExternalStore } from "react";
import { MAX_COMPARE } from "@/showroom/api/client";

const KEY = "showroom-compare";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cached: string[] = EMPTY;
let hydrated = false;

function parse(raw: string | null): string[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    const slugs = parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_COMPARE);
    return slugs.length === 0 ? EMPTY : slugs;
  } catch {
    return EMPTY;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  cached = parse(window.localStorage.getItem(KEY));
}

function write(slugs: string[]) {
  cached = slugs.length === 0 ? EMPTY : slugs.slice(0, MAX_COMPARE);
  window.localStorage.setItem(KEY, JSON.stringify(cached));
  listeners.forEach((listener) => listener());
}

export function getCompareSlugs(): string[] {
  hydrate();
  return cached;
}

export function toggleCompareSlug(slug: string): string[] {
  hydrate();
  const next = cached.includes(slug)
    ? cached.filter((item) => item !== slug)
    : cached.length >= MAX_COMPARE
      ? cached
      : [...cached, slug];
  write(next);
  return cached;
}

export function clearCompare(): void {
  write([]);
}

export function subscribeCompare(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function useCompareSlugs(): string[] {
  return useSyncExternalStore(subscribeCompare, getCompareSlugs, () => EMPTY);
}

export { MAX_COMPARE };
