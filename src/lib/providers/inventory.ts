/**
 * InventoryProvider — adapter over a dealer inventory feed.
 *
 * No Toyota / CDK / DealerSocket / vAuto credentials are present in this environment.
 * Production MUST fail closed: never return fabricated VINs or stock.
 *
 * Feed contract is frozen by `inventoryFeedResponseSchema` (see docs/INTEGRATIONS.md).
 */
import { z } from "zod";

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

/** VIN characters exclude I, O, Q (ISO 3779). */
export const inventoryVinSchema = z
  .string()
  .regex(
    /^[A-HJ-NPR-Z0-9]{17}$/,
    "VIN must be exactly 17 characters using A–H, J–N, P–R, Z, and 0–9 (no I, O, or Q)",
  );

/**
 * Frozen per-lot shape for dealer inventory feeds.
 * Field names map 1:1 to `InventoryVehicle`.
 */
export const inventoryFeedLotSchema = z.object({
  vin: inventoryVinSchema,
  stockNumber: z.string().min(1, "stockNumber is required"),
  year: z.number().int().min(1980).max(2100),
  make: z.string().min(1, "make is required"),
  model: z.string().min(1, "model is required"),
  trim: z.string().min(1, "trim is required"),
  drivetrain: z.string().nullable(),
  exteriorColor: z.string().nullable(),
  mileage: z.number().int().nonnegative().nullable(),
  status: z.enum(["in_stock", "in_transit", "sold"]),
  price: z.number().nonnegative().nullable(),
  priceProvenance: z.string().nullable(),
  imageUrl: z.string().nullable(),
  location: z.string().min(1, "location is required"),
});

/**
 * Top-level feed envelope. `lots` is required (may be an empty array when the lot is empty).
 */
export const inventoryFeedResponseSchema = z.object({
  lots: z.array(inventoryFeedLotSchema),
});

export type InventoryFeedResponse = z.infer<typeof inventoryFeedResponseSchema>;
export type InventoryFeedLot = z.infer<typeof inventoryFeedLotSchema>;

export class InventoryFeedContractError extends Error {
  readonly issues: z.core.$ZodIssue[];

  constructor(message: string, issues: z.core.$ZodIssue[]) {
    super(message);
    this.name = "InventoryFeedContractError";
    this.issues = issues;
  }
}

/**
 * Validate a raw dealer-feed JSON payload against the frozen contract.
 * Throws InventoryFeedContractError with a clear assertion message on failure.
 */
export function parseInventoryFeedResponse(payload: unknown): InventoryFeedResponse {
  const result = inventoryFeedResponseSchema.safeParse(payload);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new InventoryFeedContractError(
      `Inventory feed contract violation: ${detail}`,
      result.error.issues,
    );
  }
  return result.data;
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
