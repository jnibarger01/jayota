import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as OFFERS_UNAVAILABLE, n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { h as Route$9 } from "./router-BebVFJVp.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offers-BYTOuHa3.js
var import_jsx_runtime = require_jsx_runtime();
function OffersPage() {
	const state = Route$9.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Offers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: OFFERS_UNAVAILABLE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Provider status: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: state.status
					}),
					". ",
					state.offers.length,
					" active offers loaded."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: DEALER.website,
					target: "_blank",
					rel: "noreferrer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "See current programs on the dealer site" })
				})
			})
		]
	}) });
}
//#endregion
export { OffersPage as component };
