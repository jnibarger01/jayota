import { useSyncExternalStore } from "react";

const KEY = "showroom-shopper-v1";

export interface RecentView {
  slug: string;
  at: number;
}
export interface SavedSearch {
  id: string;
  name: string;
  href: string;
  filters: Record<string, string>;
  snapshotVins: string[];
  savedAt: number;
}
export interface LocalBuild {
  id: string;
  slug: string;
  label: string;
  href: string;
  savedAt: number;
}
export interface DealWorkspace {
  slug: string | null;
  configurationHref: string | null;
  inventoryVin: string | null;
  tradeNote: string | null;
  scenarioId: string | null;
  testDriveHref: string | null;
}
export interface ShopperState {
  recent: RecentView[];
  favorites: string[];
  searches: SavedSearch[];
  builds: LocalBuild[];
  comparisons: string[][];
  recentQueries: string[];
  locale: "en" | "es";
  a11yMode: boolean;
  workspace: DealWorkspace;
  testDriveRequests: Array<{ id: string; slug: string; at: number; label: string }>;
}

const EMPTY: ShopperState = {
  recent: [],
  favorites: [],
  searches: [],
  builds: [],
  comparisons: [],
  recentQueries: [],
  locale: "en",
  a11yMode: false,
  workspace: {
    slug: null,
    configurationHref: null,
    inventoryVin: null,
    tradeNote: null,
    scenarioId: null,
    testDriveHref: null,
  },
  testDriveRequests: [],
};

const listeners = new Set<() => void>();
let cached: ShopperState = EMPTY;
let hydrated = false;

function parse(raw: string | null): ShopperState {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return {
      ...EMPTY,
      ...parsed,
      workspace: { ...EMPTY.workspace, ...(parsed.workspace ?? {}) },
    };
  } catch {
    return EMPTY;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  cached = parse(window.localStorage.getItem(KEY));
}

function write(next: ShopperState) {
  cached = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((fn) => fn());
}

function update(patch: (prev: ShopperState) => ShopperState) {
  hydrate();
  write(patch(cached));
}

export function getShopper(): ShopperState {
  hydrate();
  return cached;
}

export function subscribeShopper(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useShopper(): ShopperState {
  return useSyncExternalStore(subscribeShopper, getShopper, () => EMPTY);
}

export function rememberView(slug: string) {
  update((prev) => {
    const recent = [{ slug, at: Date.now() }, ...prev.recent.filter((item) => item.slug !== slug)].slice(0, 12);
    return { ...prev, recent };
  });
}

export function clearRecent() {
  update((prev) => ({ ...prev, recent: [] }));
}

export function removeRecent(slug: string) {
  update((prev) => ({ ...prev, recent: prev.recent.filter((item) => item.slug !== slug) }));
}

export function toggleLocalFavorite(slug: string) {
  update((prev) => {
    const favorites = prev.favorites.includes(slug)
      ? prev.favorites.filter((item) => item !== slug)
      : [...prev.favorites, slug];
    return { ...prev, favorites };
  });
}

export function rememberQuery(q: string) {
  const trimmed = q.trim();
  if (!trimmed) return;
  update((prev) => ({
    ...prev,
    recentQueries: [trimmed, ...prev.recentQueries.filter((item) => item !== trimmed)].slice(0, 8),
  }));
}

export function setLocale(locale: "en" | "es") {
  update((prev) => ({ ...prev, locale }));
}

export function setA11yMode(a11yMode: boolean) {
  update((prev) => ({ ...prev, a11yMode }));
}

export function saveSearch(entry: Omit<SavedSearch, "savedAt">) {
  update((prev) => ({
    ...prev,
    searches: [{ ...entry, savedAt: Date.now() }, ...prev.searches.filter((item) => item.id !== entry.id)].slice(0, 12),
  }));
}

export function removeSearch(id: string) {
  update((prev) => ({ ...prev, searches: prev.searches.filter((item) => item.id !== id) }));
}

export function saveBuild(entry: Omit<LocalBuild, "savedAt">) {
  update((prev) => ({
    ...prev,
    builds: [{ ...entry, savedAt: Date.now() }, ...prev.builds.filter((item) => item.id !== entry.id)].slice(0, 16),
  }));
}

export function removeBuild(id: string) {
  update((prev) => ({ ...prev, builds: prev.builds.filter((item) => item.id !== id) }));
}

export function rememberComparison(slugs: string[]) {
  if (slugs.length < 2) return;
  update((prev) => ({
    ...prev,
    comparisons: [slugs, ...prev.comparisons.filter((row) => row.join() !== slugs.join())].slice(0, 8),
  }));
}

export function patchWorkspace(patch: Partial<DealWorkspace>) {
  update((prev) => ({ ...prev, workspace: { ...prev.workspace, ...patch } }));
}

export function resetWorkspace() {
  update((prev) => ({ ...prev, workspace: EMPTY.workspace }));
}

export function rememberTestDrive(entry: { id: string; slug: string; label: string }) {
  update((prev) => ({
    ...prev,
    testDriveRequests: [{ ...entry, at: Date.now() }, ...prev.testDriveRequests].slice(0, 8),
  }));
}
