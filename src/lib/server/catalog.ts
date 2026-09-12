import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  loadCatalog,
  loadInventoryState,
  loadOffersState,
  loadSiteSearch,
  loadVehicleDetail,
} from "@/lib/catalog-data";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  return loadCatalog();
});

export const getVehicleDetail = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    return loadVehicleDetail(data.slug);
  });

export const searchSite = createServerFn({ method: "GET" })
  .validator((input: { q: string }) => z.object({ q: z.string().trim().max(80) }).parse(input))
  .handler(async ({ data }) => {
    return loadSiteSearch(data.q);
  });

export const getInventoryState = createServerFn({ method: "GET" }).handler(async () => {
  return loadInventoryState();
});

export const getOffersState = createServerFn({ method: "GET" }).handler(async () => {
  return loadOffersState();
});
