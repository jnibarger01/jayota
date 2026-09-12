import type { MediaAsset, MediaManifest, Vehicle, Vehicle3DConfig, VehicleSummary } from "../types/vehicle";
import { VEHICLES, getVehicleBySlug } from "../data/vehicles";
import { toVehicleSummary } from "../types/vehicle";
import { ApiError } from "./errors";
import { paginateAndFilter, type Pagination, type PagedResult, type VehicleFilters } from "./query";

/**
 * Catalog access. The previous GitHub Pages export fetched `/catalog/v1/*.json`.
 * Here the catalog is compiled in, so reads are in-process and identical for SSR + client.
 */

const basePath =
  typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
    ? String(import.meta.env.BASE_URL).replace(/\/$/, "")
    : "";

export function pageUrl(segment: string = ""): string {
  const routes: Record<string, string> = {
    "": "/",
    explore: "/vehicles",
    garage: "/owners/saved",
    compare: "/vehicles/compare",
  };
  if (segment in routes) return routes[segment];
  return `/vehicles/${segment}`;
}

function withBasePath(url: string): string {
  if (!url) return url;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return url.startsWith("/") ? `${basePath}${url}` : url;
}

function normalizeAsset(asset: MediaAsset): MediaAsset {
  return { ...asset, url: withBasePath(asset.url) };
}

function normalizeMedia(media: MediaManifest): MediaManifest {
  return {
    hero: normalizeAsset(media.hero),
    gallery: media.gallery.map(normalizeAsset),
    thumbnails: media.thumbnails.map(normalizeAsset),
    videos: media.videos.map(normalizeAsset),
    environmentMaps: media.environmentMaps.map(normalizeAsset),
  };
}

function normalizeThreeDConfig(config: Vehicle3DConfig): Vehicle3DConfig {
  return {
    ...config,
    ...(config.modelUrl ? { modelUrl: withBasePath(config.modelUrl) } : {}),
    ...(config.wheelAndTireAssets
      ? {
          wheelAndTireAssets: {
            ...config.wheelAndTireAssets,
            wheelUrl: withBasePath(config.wheelAndTireAssets.wheelUrl),
            tireUrl: withBasePath(config.wheelAndTireAssets.tireUrl),
          },
        }
      : {}),
  };
}

export function normalizeVehicle(vehicle: Vehicle): Vehicle {
  return { ...vehicle, media: normalizeMedia(vehicle.media), threeDConfig: normalizeThreeDConfig(vehicle.threeDConfig) };
}

function normalizeSummary(summary: VehicleSummary): VehicleSummary {
  return { ...summary, thumbnail: normalizeAsset(summary.thumbnail) };
}

export function listAllVehicles(): Vehicle[] {
  return VEHICLES.map(normalizeVehicle);
}

export async function listVehicles(
  filters: VehicleFilters = {},
  pagination: Pagination = { page: 1, pageSize: 12 },
): Promise<PagedResult<VehicleSummary>> {
  const all = VEHICLES.map((vehicle) => normalizeSummary(toVehicleSummary(vehicle)));
  return paginateAndFilter(all, filters, pagination);
}

export async function getVehicle(slug: string): Promise<Vehicle> {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) throw new ApiError(404, "not_found", `No vehicle found for "${slug}".`);
  return normalizeVehicle(vehicle);
}

export async function getVehicleMedia(slug: string): Promise<{ media: MediaManifest; threeDConfig: Vehicle3DConfig }> {
  const vehicle = await getVehicle(slug);
  return { media: vehicle.media, threeDConfig: vehicle.threeDConfig };
}

export const MIN_COMPARE = 2;
export const MAX_COMPARE = 4;

export async function compareVehicles(slugs: string[]): Promise<Vehicle[]> {
  if (slugs.length < MIN_COMPARE || slugs.length > MAX_COMPARE) {
    throw new ApiError(
      400,
      "invalid_query",
      `compareVehicles accepts ${MIN_COMPARE}-${MAX_COMPARE} slugs, got ${slugs.length}`,
    );
  }
  return Promise.all(slugs.map((slug) => getVehicle(slug)));
}

export async function checkHealth(): Promise<{
  status: string;
  schemaVersion: string;
  vehicleCount: number;
  timestamp: string;
}> {
  return {
    status: "ok",
    schemaVersion: "1.0.0",
    vehicleCount: VEHICLES.length,
    timestamp: new Date().toISOString(),
  };
}
