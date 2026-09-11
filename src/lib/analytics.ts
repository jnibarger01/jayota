/**
 * Typed analytics facade. The vendor is swappable; nothing in UI imports a pixel SDK.
 * Payloads must never include names, emails, phones, VINs entered by the user, or free-text notes.
 * Events are dropped until the visitor allows analytics via the consent banner.
 */
import { analyticsAllowed } from "./consent";

export type AnalyticsEventName =
  | "vehicle_view"
  | "trim_selected"
  | "color_selected"
  | "configuration_saved"
  | "inventory_viewed"
  | "inventory_filtered"
  | "finance_started"
  | "trade_in_started"
  | "lead_submitted"
  | "test_drive_requested"
  | "service_started"
  | "service_submitted"
  | "search_performed"
  | "compare_opened";

export type AnalyticsPayload = Record<string, string | number | boolean | null>;

export interface AnalyticsProvider {
  track(name: AnalyticsEventName, payload?: AnalyticsPayload): void;
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
    if (typeof window === "undefined") return;
    if (!analyticsAllowed()) return;
    if (import.meta.env.DEV) {
      console.debug("[analytics]", name, payload);
    }
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: name, ...payload, ts: Date.now() });
  }
}

let provider: AnalyticsProvider = new ConsoleAnalyticsProvider();

export function setAnalyticsProvider(next: AnalyticsProvider): void {
  provider = next;
}

export function track(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  try {
    provider.track(name, payload);
  } catch {
    /* analytics must never break the product */
  }
}
