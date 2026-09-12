/**
 * Client-safe catalog loaders for static/GitHub Pages deploys.
 * Server handlers in catalog.ts re-export the same implementations.
 */
import { VEHICLES, getVehicleBySlug } from "@/showroom/data/vehicles";
import { toVehicleSummary } from "@/showroom/types/vehicle";
import { getOptionsForVehicle } from "@/showroom/data/options";
import { getInventoryProvider } from "@/lib/providers/inventory";
import { getOffersProvider } from "@/lib/providers/offers";
import { LINEUP } from "@/lib/lineup";
import { searchShowroom } from "@/lib/search-engine";

export async function loadCatalog() {
  return VEHICLES.map(toVehicleSummary);
}

export async function loadVehicleDetail(slug: string) {
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return null;
  return { vehicle, options: getOptionsForVehicle(slug) };
}

export async function loadSiteSearch(qRaw: string) {
  const q = qRaw.trim().toLowerCase();
  if (!q) {
    return {
      vehicles: [] as ReturnType<typeof toVehicleSummary>[],
      lineup: [] as Array<{ slug: string; name: string; tagline: string }>,
      resources: [] as Array<{ href: string; title: string; blurb: string }>,
    };
  }
  const ranked = searchShowroom(qRaw);
  const vehicles = VEHICLES.filter(
    (v) =>
      ranked.vehicles.some((hit) => hit.href.endsWith(`/${v.slug}`)) ||
      v.model.toLowerCase().includes(q) ||
      v.slug.includes(q) ||
      v.categories.some((c) => c.includes(q)) ||
      v.bodyStyle.includes(q),
  ).map(toVehicleSummary);
  const catalogSlugs = new Set(vehicles.map((v) => v.slug));
  const lineup = ranked.vehicles
    .filter((hit) => !catalogSlugs.has(hit.href.split("/").pop() ?? ""))
    .map((hit) => {
      const slug = hit.href.split("/").pop() ?? "";
      const item = LINEUP.find((row) => row.slug === slug);
      return item
        ? { slug: item.slug, name: item.name, tagline: item.tagline }
        : { slug, name: hit.title, tagline: hit.blurb };
    });
  const resources = ranked.destinations.map((hit) => ({
    href: hit.href,
    title: hit.title,
    blurb: hit.blurb,
  }));
  return { vehicles, lineup, resources };
}

export async function loadInventoryState() {
  const provider = getInventoryProvider();
  return {
    status: provider.status(),
    provider: provider.name,
    vehicles: await provider.search({}),
  };
}

export async function loadOffersState() {
  const provider = getOffersProvider();
  return {
    status: provider.status(),
    provider: provider.name,
    offers: await provider.listActive(new Date()),
  };
}
