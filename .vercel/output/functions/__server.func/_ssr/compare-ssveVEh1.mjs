import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as electrifiedLabel, c as getLineupBySlug, d as getVehicleBySlug, p as lineupConfigure, t as LINEUP } from "./lineup-m5PRC25T.mjs";
import { n as formatUsd } from "./utils-DzenR1kc.mjs";
import { t as CATALOG_DISCLAIMER } from "./catalog-0lXXzwn9.mjs";
import { p as Route$5 } from "./router-BebVFJVp.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-ssveVEh1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComparePage() {
	const { vehicles: raw } = Route$5.useSearch();
	const selected = (0, import_react.useMemo)(() => Array.from(new Set((raw ?? "").split(",").map((s) => s.trim()).filter(Boolean))).slice(0, 4), [raw]);
	const models = selected.map((slug) => getLineupBySlug(slug)).filter((item) => Boolean(item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-12 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-semibold tracking-tight",
				children: "Compare"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Choose ",
					2,
					"–",
					4,
					" models. Starting MSRP is a Toyota.com catalog figure. Specs only appear when this showroom has a catalog record — we do not invent horsepower or trims."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: LINEUP.map((model) => {
					const on = selected.includes(model.slug);
					const next = on ? selected.filter((s) => s !== model.slug) : [...selected, model.slug].slice(0, 4);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/compare",
						search: { vehicles: next.join(",") },
						className: `min-h-11 px-4 text-sm ${on ? "bg-fg text-bg" : "border border-border"}`,
						children: model.name
					}, model.slug);
				})
			}),
			models.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: "Select at least two vehicles to compare."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 font-medium text-muted",
							children: " "
						}), models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-xl font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/vehicles/$slug",
								params: { slug: model.slug },
								children: model.name
							})
						}, model.slug))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "Year"
							}), models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: model.year
							}, model.slug))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "Body"
							}), models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 capitalize",
								children: model.body
							}, model.slug))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "Electrified"
							}), models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: electrifiedLabel(model.electrified) ?? "Gas"
							}, model.slug))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "Starting MSRP*"
							}), models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: model.startingMsrp ? formatUsd(model.startingMsrp) : "—"
							}, model.slug))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "3D / configure"
							}), models.map((model) => {
								const cta = lineupConfigure(model);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: cta.kind === "none" ? "Merchandising only" : cta.label
								}, model.slug);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-muted",
								children: "Catalog record"
							}), models.map((model) => {
								const vehicle = getVehicleBySlug(model.slug);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: vehicle ? `${vehicle.year} ${vehicle.model} project catalog` : "Not in this catalog"
								}, model.slug);
							})]
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-8",
				children: CATALOG_DISCLAIMER
			})
		]
	}) });
}
//#endregion
export { ComparePage as component };
