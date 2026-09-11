import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DzenR1kc.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatUsd(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(amount);
}
function formatUsdExact(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
function newRequestId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
//#endregion
export { newRequestId as i, formatUsd as n, formatUsdExact as r, cn as t };
