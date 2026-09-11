/**
 * InventoryProvider — adapter over a dealer inventory feed.
 *
 * No Toyota / CDK / DealerSocket / vAuto credentials are present in this environment.
 * Production MUST fail closed: never return fabricated VINs or stock.
 */
export type InventoryStatus = "unavailable" | "configured";

export interface InventoryVehicle {
  vin: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  drivetrain: string | null;
  exteriorColor: string | null;
  mileage: number | null;
  status: "in_stock" | "in_transit" | "sold";
  price: number | null;
  priceProvenance: string | null;
  imageUrl: string | null;
  location: string;
}

export interface InventoryQuery {
  model?: string;
  trim?: string;
  status?: InventoryVehicle["status"];
}

export interface InventoryProvider {
  readonly name: string;
  status(): InventoryStatus;
  search(query: InventoryQuery): Promise<InventoryVehicle[]>;
  getByVin(vin: string): Promise<InventoryVehicle | null>;
}

class UnconfiguredInventoryProvider implements InventoryProvider {
  readonly name = "unconfigured";
  status(): InventoryStatus {
    return "unavailable";
  }
  async search(): Promise<InventoryVehicle[]> {
    return [];
  }
  async getByVin(): Promise<InventoryVehicle | null> {
    return null;
  }
}

/**
 * Optional live feed. Set INVENTORY_FEED_URL (server-only) plus INVENTORY_FEED_TOKEN when a
 * documented dealer inventory contract exists. Until then this stays unconfigured.
 */
function fromEnv(): InventoryProvider {
  const url = typeof process !== "undefined" ? process.env.INVENTORY_FEED_URL : undefined;
  if (!url || !url.trim()) return new UnconfiguredInventoryProvider();
  // A URL without a documented adapter is still unconfigured — we do not guess the payload.
  return new UnconfiguredInventoryProvider();
}

let singleton: InventoryProvider | null = null;

export function getInventoryProvider(): InventoryProvider {
  singleton ??= fromEnv();
  return singleton;
}
