const KEY = "htm-consent";

export type ConsentValue = "necessary" | "all";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(KEY);
  return value === "all" || value === "necessary" ? value : null;
}

export function writeConsent(value: ConsentValue): void {
  window.localStorage.setItem(KEY, value);
  window.dispatchEvent(new CustomEvent("htm-consent", { detail: value }));
}

/** Analytics is opt-in. Unset consent means necessary-only (no tracking). */
export function analyticsAllowed(): boolean {
  return readConsent() === "all";
}
