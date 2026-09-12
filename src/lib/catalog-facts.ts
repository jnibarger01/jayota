import { electrifiedLabel, getLineupBySlug, type LineupModel } from "./lineup.ts";
import { getVehicleBySlug } from "../showroom/data/vehicles/index.ts";
import type { DrivetrainType, PowertrainSpec, Vehicle } from "../showroom/types/vehicle.ts";

export interface CatalogFacts {
  slug: string;
  name: string;
  year: number;
  body: string;
  electrifiedLabel: string;
  startingMsrp: number | null;
  hasCatalog: boolean;
  has3d: boolean;
  seating: number | null;
  cargoCuFt: number | null;
  towingLbs: number | null;
  mpgCombined: number | null;
  electricRangeMi: number | null;
  drivetrains: DrivetrainType[];
  powertrainTypes: string[];
  powertrains: PowertrainSpec[];
  gradeCount: number;
  vehicle: Vehicle | null;
  lineup: LineupModel | null;
}

export function getCatalogFacts(slug: string): CatalogFacts {
  const lineup = getLineupBySlug(slug) ?? null;
  const vehicle = getVehicleBySlug(slug) ?? null;
  const powertrains = vehicle ? Object.values(vehicle.powertrains) : [];
  const cargo = vehicle?.specs.find((s) => s.key === "cargo_volume_cu_ft");
  const towing = powertrains
    .map((p) => p.towingCapacityLbs)
    .filter((n): n is number => typeof n === "number");
  const mpg = powertrains.map((p) => p.fuelEconomy.combined);
  const range = powertrains
    .map((p) => p.electricRangeMi)
    .filter((n): n is number => typeof n === "number");
  const seating = vehicle?.grades.map((g) => g.seating) ?? [];

  return {
    slug,
    name: lineup?.name ?? (vehicle ? vehicle.model : slug),
    year: lineup?.year ?? vehicle?.year ?? 0,
    body: lineup?.body ?? vehicle?.bodyStyle ?? "unknown",
    electrifiedLabel: electrifiedLabel(lineup?.electrified ?? null) ?? (powertrains.some((p) => p.type !== "gas") ? "Electrified" : "Gas"),
    startingMsrp: lineup?.startingMsrp ?? (vehicle ? vehicle.pricing.baseMsrp : null),
    hasCatalog: Boolean(vehicle),
    has3d: Boolean(lineup?.has3d ?? vehicle?.threeDConfig.hasModel),
    seating: seating.length ? Math.max(...seating) : null,
    cargoCuFt: typeof cargo?.value === "number" ? cargo.value : null,
    towingLbs: towing.length ? Math.max(...towing) : null,
    mpgCombined: mpg.length ? Math.max(...mpg) : null,
    electricRangeMi: range.length ? Math.max(...range) : null,
    drivetrains: [...new Set(powertrains.map((p) => p.drivetrain))],
    powertrainTypes: [...new Set(powertrains.map((p) => p.type))],
    powertrains,
    gradeCount: vehicle?.grades.length ?? 0,
    vehicle,
    lineup,
  };
}
