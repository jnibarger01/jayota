import { H as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-C0Pg4xvM.js
var import_jsx_runtime = require_jsx_runtime();
function MaintenancePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Maintenance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: "This site does not invent maintenance intervals, fluid specifications, or service prices. Use Toyota’s official owner tools for your VIN, then request a visit here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Toyota Owners" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted",
							children: "Manuals, maintenance schedules, and warranty information for your VIN."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "mt-3 inline-block underline",
							href: "https://www.toyota.com/owners/",
							target: "_blank",
							rel: "noreferrer",
							children: "toyota.com/owners"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Safety recalls" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted",
							children: "Look up open campaigns by VIN on NHTSA or Toyota. We will not list recall names we cannot verify against your vehicle."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "mt-3 inline-block underline",
							href: "https://www.nhtsa.gov/recalls",
							target: "_blank",
							rel: "noreferrer",
							children: "nhtsa.gov/recalls"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/owners/service",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Request a service visit" })
				})
			})
		]
	}) });
}
//#endregion
export { MaintenancePage as component };
