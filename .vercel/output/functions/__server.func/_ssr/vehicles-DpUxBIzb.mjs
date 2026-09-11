import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as filterLineup } from "./lineup-m5PRC25T.mjs";
import { t as CATALOG_DISCLAIMER } from "./catalog-0lXXzwn9.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { a as useCompareSlugs, i as QuickView, n as LineupCard, r as LineupTabs, t as CompareTray } from "./QuickView-C4g42viH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vehicles-DpUxBIzb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VehiclesPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const [quick, setQuick] = (0, import_react.useState)(null);
	const compare = useCompareSlugs();
	const featured = filterLineup(tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-3xl px-4 pb-24 pt-4 md:max-w-7xl md:px-6 md:pb-24 md:pt-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-semibold tracking-tight md:text-5xl",
					children: "Vehicles"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "Find the Toyota that fits your life."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 md:mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupTabs, {
						value: tab,
						onChange: setTab
					})
				}),
				featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-sm text-muted",
					children: "No vehicles in this category yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3 md:hidden",
					children: featured.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
						model,
						variant: "overlay",
						selected: compare.includes(model.slug),
						onOpen: setQuick
					}, model.slug))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 hidden gap-6 sm:grid-cols-2 md:grid lg:grid-cols-4 xl:grid-cols-5",
					children: featured.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
						model,
						variant: "caption",
						selected: compare.includes(model.slug),
						onOpen: setQuick
					}, model.slug))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "price-note mt-8 hidden md:block",
					children: CATALOG_DISCLAIMER
				})
			]
		}),
		quick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {
			model: quick,
			comparing: compare.includes(quick.slug),
			compareCount: compare.length,
			onClose: () => setQuick(null)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareTray, { slugs: compare })
	] });
}
//#endregion
export { VehiclesPage as component };
