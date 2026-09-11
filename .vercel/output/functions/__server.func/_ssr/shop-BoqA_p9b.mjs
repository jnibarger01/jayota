import { H as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { n as SHOP_TOOLS } from "./content-rDeSieue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-BoqA_p9b.js
var import_jsx_runtime = require_jsx_runtime();
function ShopHub() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-5xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Shop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl tracking-wide",
				children: "Shopping tools"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Every tool either talks to a live provider or tells you plainly that the provider is not connected. No invented inventory, APR, or trade values."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-10 grid gap-4 md:grid-cols-2",
				children: SHOP_TOOLS.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tool.to,
					className: "flex min-h-32 flex-col justify-between border border-border bg-surface p-6 hover:bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: tool.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: tool.body
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em]",
						children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 14 })]
					})]
				}) }, tool.to))
			})
		]
	}) });
}
//#endregion
export { ShopHub as component };
