import type { InventoryVehicle } from "./providers/inventory.ts";

export type MatchTier = "exact" | "close" | "same-model" | "none";

export interface ConfigMatchQuery {
  model: string;
  trim?: string | null;
  powertrain?: string | null;
  drivetrain?: string | null;
  color?: string | null;
}

export interface RankedMatch {
  vehicle: InventoryVehicle;
  tier: MatchTier;
  score: number;
  reasons: string[];
}

export function rankInventoryMatches(stock: InventoryVehicle[], query: ConfigMatchQuery): RankedMatch[] {
  const model = query.model.trim().toLowerCase();
  if (!model) return [];
  return stock
    .map((vehicle) => {
      const reasons: string[] = [];
      let score = 0;
      if (vehicle.model.toLowerCase() !== model && !vehicle.model.toLowerCase().includes(model)) {
        return { vehicle, tier: "none" as const, score: -1, reasons };
      }
      score += 10;
      reasons.push("Same model");
      const trimOk = Boolean(query.trim && vehicle.trim && vehicle.trim.toLowerCase() === query.trim.toLowerCase());
      if (trimOk) {
        score += 8;
        reasons.push("Exact trim");
      }
      const driveOk = Boolean(
        query.drivetrain && vehicle.drivetrain && vehicle.drivetrain.toLowerCase() === query.drivetrain.toLowerCase(),
      );
      if (driveOk) {
        score += 4;
        reasons.push("Matching drivetrain");
      }
      const colorOk = Boolean(
        query.color && vehicle.exteriorColor && vehicle.exteriorColor.toLowerCase() === query.color.toLowerCase(),
      );
      if (colorOk) {
        score += 3;
        reasons.push("Matching exterior color");
      }
      let tier: MatchTier = "same-model";
      if (trimOk && (driveOk || !query.drivetrain) && (colorOk || !query.color)) tier = "exact";
      else if (trimOk || driveOk || colorOk) tier = "close";
      return { vehicle, tier, score, reasons };
    })
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score);
}

export interface InventoryFilters {
  model?: string;
  body?: string;
  trim?: string;
  drivetrain?: string;
  powertrain?: string;
  color?: string;
  interior?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "match";
}

export function filtersToSearch(filters: InventoryFilters): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === "") continue;
    out[key] = String(value);
  }
  return out;
}

export function applyInventoryFilters(stock: InventoryVehicle[], filters: InventoryFilters): InventoryVehicle[] {
  const next = stock.filter((vehicle) => {
    if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.trim && vehicle.trim.toLowerCase() !== filters.trim.toLowerCase()) return false;
    if (filters.drivetrain && (vehicle.drivetrain ?? "").toLowerCase() !== filters.drivetrain.toLowerCase()) return false;
    if (filters.color && (vehicle.exteriorColor ?? "").toLowerCase() !== filters.color.toLowerCase()) return false;
    if (filters.status && vehicle.status !== filters.status) return false;
    if (filters.minPrice != null && vehicle.price != null && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice != null && vehicle.price != null && vehicle.price > filters.maxPrice) return false;
    return true;
  });
  if (filters.sort === "price-asc") {
    return [...next].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
  }
  if (filters.sort === "price-desc") {
    return [...next].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  }
  if (filters.sort === "newest") {
    return [...next].sort((a, b) => b.year - a.year);
  }
  return next;
}

export function watchDiff(previousVins: string[], currentVins: string[]) {
  const prev = new Set(previousVins);
  const curr = new Set(currentVins);
  return {
    added: currentVins.filter((vin) => !prev.has(vin)),
    removed: previousVins.filter((vin) => !curr.has(vin)),
  };
}
