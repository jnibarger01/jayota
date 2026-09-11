import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as OFFERS_UNAVAILABLE, i as INVENTORY_UNAVAILABLE, r as FINANCE_DISCLAIMER, t as CATALOG_DISCLAIMER } from "./catalog-0lXXzwn9.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/disclosures-lCrwAbJc.js
var import_jsx_runtime = require_jsx_runtime();
function DisclosuresPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl px-4 py-16 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-5xl tracking-wide",
			children: "Disclosures"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 space-y-6 text-sm leading-relaxed text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: CATALOG_DISCLAIMER }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: FINANCE_DISCLAIMER }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: INVENTORY_UNAVAILABLE }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: OFFERS_UNAVAILABLE }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Toyota, the Toyota logo, and model names are trademarks of Toyota Motor Corporation. This independent dealership site is not toyota.com. 3D assets are project-packaged visualization models, not factory-certified configurators." })
			]
		})]
	}) });
}
//#endregion
export { DisclosuresPage as component };
