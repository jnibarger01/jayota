import { d as getVehicleBySlug, h as toVehicleSummary, r as VEHICLES, t as LINEUP, u as getOptionsForVehicle } from "./lineup-m5PRC25T.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DVU569eT.js
var UnconfiguredInventoryProvider = class {
	name = "unconfigured";
	status() {
		return "unavailable";
	}
	async search() {
		return [];
	}
	async getByVin() {
		return null;
	}
};
/**
* Optional live feed. Set INVENTORY_FEED_URL (server-only) plus INVENTORY_FEED_TOKEN when a
* documented dealer inventory contract exists. Until then this stays unconfigured.
*/
function fromEnv() {
	const url = typeof process !== "undefined" ? process.env.INVENTORY_FEED_URL : void 0;
	if (!url || !url.trim()) return new UnconfiguredInventoryProvider();
	return new UnconfiguredInventoryProvider();
}
var singleton$1 = null;
function getInventoryProvider() {
	singleton$1 ??= fromEnv();
	return singleton$1;
}
var UnconfiguredOffersProvider = class {
	name = "unconfigured";
	status() {
		return "unavailable";
	}
	async listActive() {
		return [];
	}
};
var singleton = null;
function getOffersProvider() {
	singleton ??= new UnconfiguredOffersProvider();
	return singleton;
}
var getCatalog_createServerFn_handler = createServerRpc({
	id: "ce378d12d327ce498bfc01e15c9ffec2dd60dbd60d4ff247260c098a929233ef",
	name: "getCatalog",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).handler(getCatalog_createServerFn_handler, async () => {
	return VEHICLES.map(toVehicleSummary);
});
var getVehicleDetail_createServerFn_handler = createServerRpc({
	id: "52641cd014b404ebb7da25f2ab45f12592e0e8365e7b83365d725c50bf72245f",
	name: "getVehicleDetail",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getVehicleDetail.__executeServer(opts));
var getVehicleDetail = createServerFn({ method: "GET" }).validator((input) => object({ slug: string() }).parse(input)).handler(getVehicleDetail_createServerFn_handler, async ({ data }) => {
	const vehicle = getVehicleBySlug(data.slug);
	if (!vehicle) return null;
	return {
		vehicle,
		options: getOptionsForVehicle(data.slug)
	};
});
var searchSite_createServerFn_handler = createServerRpc({
	id: "97170a1dee98c5afeb0b424d6192c16a32242cba0bfbf4536fbd689f201cff4a",
	name: "searchSite",
	filename: "src/lib/server/catalog.ts"
}, (opts) => searchSite.__executeServer(opts));
var searchSite = createServerFn({ method: "GET" }).validator((input) => object({ q: string().trim().max(80) }).parse(input)).handler(searchSite_createServerFn_handler, async ({ data }) => {
	const q = data.q.toLowerCase();
	if (!q) return {
		vehicles: [],
		lineup: [],
		resources: []
	};
	const vehicles = VEHICLES.filter((v) => v.model.toLowerCase().includes(q) || v.slug.includes(q) || v.categories.some((c) => c.includes(q)) || v.bodyStyle.includes(q)).map(toVehicleSummary);
	const catalogSlugs = new Set(vehicles.map((v) => v.slug));
	return {
		vehicles,
		lineup: LINEUP.filter((item) => {
			if (catalogSlugs.has(item.slug) || VEHICLES.some((v) => v.slug === item.slug)) return false;
			return item.name.toLowerCase().includes(q) || item.slug.includes(q) || item.tagline.toLowerCase().includes(q) || item.tabs.some((tab) => tab.includes(q));
		}).map((item) => ({
			slug: item.slug,
			name: item.name,
			tagline: item.tagline
		})),
		resources: [
			{
				href: "/owners",
				title: "Owners hub",
				blurb: "Service, maintenance, and saved vehicles"
			},
			{
				href: "/owners/service",
				title: "Schedule service",
				blurb: "Request a service visit"
			},
			{
				href: "/owners/maintenance",
				title: "Maintenance",
				blurb: "Owner maintenance resources"
			},
			{
				href: "/shop",
				title: "Shop",
				blurb: "Inventory, finance, trade-in, test drive, offers"
			},
			{
				href: "/shop/finance",
				title: "Payment estimator",
				blurb: "Estimate a monthly payment"
			},
			{
				href: "/shop/trade-in",
				title: "Trade-in",
				blurb: "Start a trade-in appraisal request"
			},
			{
				href: "/dealership",
				title: "Find us",
				blurb: "Hours, address, directions"
			}
		].filter((r) => `${r.title} ${r.blurb}`.toLowerCase().includes(q))
	};
});
var getInventoryState_createServerFn_handler = createServerRpc({
	id: "e98fd230fc2bdceac680c5b4f01ed2e4312ab70a7e60561a46632186273b76c1",
	name: "getInventoryState",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getInventoryState.__executeServer(opts));
var getInventoryState = createServerFn({ method: "GET" }).handler(getInventoryState_createServerFn_handler, async () => {
	const provider = getInventoryProvider();
	return {
		status: provider.status(),
		provider: provider.name,
		vehicles: await provider.search({})
	};
});
var getOffersState_createServerFn_handler = createServerRpc({
	id: "24f56f854d39be8ca8dcecf1958adc6147871741e6b963faee5470a32cdfaf1f",
	name: "getOffersState",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getOffersState.__executeServer(opts));
var getOffersState = createServerFn({ method: "GET" }).handler(getOffersState_createServerFn_handler, async () => {
	const provider = getOffersProvider();
	return {
		status: provider.status(),
		provider: provider.name,
		offers: await provider.listActive(/* @__PURE__ */ new Date())
	};
});
//#endregion
export { getCatalog_createServerFn_handler, getInventoryState_createServerFn_handler, getOffersState_createServerFn_handler, getVehicleDetail_createServerFn_handler, searchSite_createServerFn_handler };
