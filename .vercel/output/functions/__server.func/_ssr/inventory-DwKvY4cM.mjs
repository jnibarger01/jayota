import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as INVENTORY_UNAVAILABLE, n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { g as Route$10 } from "./router-BebVFJVp.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DwKvY4cM.js
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const state = Route$10.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Shop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl tracking-wide",
				children: "Inventory"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: INVENTORY_UNAVAILABLE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Provider status: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: state.status
					}),
					" (",
					state.provider,
					").",
					state.vehicles.length === 0 ? " No vehicles returned." : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: DEALER.website,
					target: "_blank",
					rel: "noreferrer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Check the official dealer site" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `tel:${DEALER.phone.generalTel}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						children: ["Call ", DEALER.phone.general]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-8",
				children: "Required to go live: a documented inventory feed URL, auth token, and VIN-level contract. Until those exist, this page stays empty on purpose."
			})
		]
	}) });
}
//#endregion
export { InventoryPage as component };
