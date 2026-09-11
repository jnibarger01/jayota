import { createServerFn } from "@tanstack/react-start";
import { VEHICLES, getVehicleBySlug } from "@/showroom/data/vehicles";
import { toVehicleSummary } from "@/showroom/types/vehicle";
import { getOptionsForVehicle } from "@/showroom/data/options";
import { getInventoryProvider } from "@/lib/providers/inventory";
import { getOffersProvider } from "@/lib/providers/offers";
import { LINEUP } from "@/lib/lineup";
import { z } from "zod";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  return VEHICLES.map(toVehicleSummary);
});

export const getVehicleDetail = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const vehicle = getVehicleBySlug(data.slug);
    if (!vehicle) return null;
    return { vehicle, options: getOptionsForVehicle(data.slug) };
  });

export const searchSite = createServerFn({ method: "GET" })
  .validator((input: { q: string }) => z.object({ q: z.string().trim().max(80) }).parse(input))
  .handler(async ({ data }) => {
    const q = data.q.toLowerCase();
    if (!q) {
      return {
        vehicles: [],
        lineup: [] as Array<{ slug: string; name: string; tagline: string }>,
        resources: [] as Array<{ href: string; title: string; blurb: string }>,
      };
    }
    const vehicles = VEHICLES.filter(
      (v) =>
        v.model.toLowerCase().includes(q) ||
        v.slug.includes(q) ||
        v.categories.some((c) => c.includes(q)) ||
        v.bodyStyle.includes(q),
    ).map(toVehicleSummary);
    const catalogSlugs = new Set(vehicles.map((v) => v.slug));
    const lineup = LINEUP.filter((item) => {
      if (catalogSlugs.has(item.slug) || VEHICLES.some((v) => v.slug === item.slug)) return false;
      return (
        item.name.toLowerCase().includes(q) ||
        item.slug.includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.tabs.some((tab) => tab.includes(q))
      );
    }).map((item) => ({ slug: item.slug, name: item.name, tagline: item.tagline }));
    const resources = [
      { href: "/owners", title: "Owners hub", blurb: "Service, maintenance, and saved vehicles" },
      { href: "/owners/service", title: "Schedule service", blurb: "Request a service visit" },
      { href: "/owners/maintenance", title: "Maintenance", blurb: "Owner maintenance resources" },
      { href: "/shop", title: "Shop", blurb: "Inventory, finance, trade-in, test drive, offers" },
      { href: "/shop/finance", title: "Payment estimator", blurb: "Estimate a monthly payment" },
      { href: "/shop/trade-in", title: "Trade-in", blurb: "Start a trade-in appraisal request" },
      { href: "/dealership", title: "Find us", blurb: "Hours, address, directions" },
    ].filter((r) => `${r.title} ${r.blurb}`.toLowerCase().includes(q));
    return { vehicles, lineup, resources };
  });

export const getInventoryState = createServerFn({ method: "GET" }).handler(async () => {
  const provider = getInventoryProvider();
  return { status: provider.status(), provider: provider.name, vehicles: await provider.search({}) };
});

export const getOffersState = createServerFn({ method: "GET" }).handler(async () => {
  const provider = getOffersProvider();
  return { status: provider.status(), provider: provider.name, offers: await provider.listActive(new Date()) };
});
