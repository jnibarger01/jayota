import { d as getVehicleBySlug, r as VEHICLES } from "./lineup-m5PRC25T.mjs";
import { t as ApiError } from "./rate-limit-Bmx5kPmD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-BzQaeYA7.js
/**
* Catalog access. The previous GitHub Pages export fetched `/catalog/v1/*.json`.
* Here the catalog is compiled in, so reads are in-process and identical for SSR + client.
*/
var basePath = typeof import.meta !== "undefined" && "/" ? String("/").replace(/\/$/, "") : "";
function pageUrl(segment = "") {
	const routes = {
		"": "/",
		explore: "/vehicles",
		garage: "/owners/saved",
		compare: "/vehicles/compare"
	};
	if (segment in routes) return routes[segment];
	return `/vehicles/${segment}`;
}
function withBasePath(url) {
	return url.startsWith("/") ? `${basePath}${url}` : url;
}
function normalizeAsset(asset) {
	return {
		...asset,
		url: withBasePath(asset.url)
	};
}
function normalizeMedia(media) {
	return {
		hero: normalizeAsset(media.hero),
		gallery: media.gallery.map(normalizeAsset),
		thumbnails: media.thumbnails.map(normalizeAsset),
		videos: media.videos.map(normalizeAsset),
		environmentMaps: media.environmentMaps.map(normalizeAsset)
	};
}
function normalizeThreeDConfig(config) {
	return {
		...config,
		...config.modelUrl ? { modelUrl: withBasePath(config.modelUrl) } : {},
		...config.wheelAndTireAssets ? { wheelAndTireAssets: {
			...config.wheelAndTireAssets,
			wheelUrl: withBasePath(config.wheelAndTireAssets.wheelUrl),
			tireUrl: withBasePath(config.wheelAndTireAssets.tireUrl)
		} } : {}
	};
}
function normalizeVehicle(vehicle) {
	return {
		...vehicle,
		media: normalizeMedia(vehicle.media),
		threeDConfig: normalizeThreeDConfig(vehicle.threeDConfig)
	};
}
function listAllVehicles() {
	return VEHICLES.map(normalizeVehicle);
}
async function getVehicle(slug) {
	const vehicle = getVehicleBySlug(slug);
	if (!vehicle) throw new ApiError(404, "not_found", `No vehicle found for "${slug}".`);
	return normalizeVehicle(vehicle);
}
//#endregion
export { listAllVehicles as n, pageUrl as r, getVehicle as t };
