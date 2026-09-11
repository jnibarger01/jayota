import { H as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources-BAK5VV5B.js
var import_jsx_runtime = require_jsx_runtime();
function ResourcesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Owner resources"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Official sources only. Internal copies of manuals or warranty text are not hosted here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-3",
				children: [[
					{
						href: "https://www.toyota.com/owners/",
						title: "Toyota Owners portal",
						blurb: "Manuals, apps, and VIN tools."
					},
					{
						href: "https://www.nhtsa.gov/recalls",
						title: "NHTSA recall lookup",
						blurb: "Federal safety campaigns by VIN."
					},
					{
						href: "https://www.toyota.com/usa/connected-services/",
						title: "Connected Services",
						blurb: "Official Toyota connected-services information."
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						target: "_blank",
						rel: "noreferrer",
						className: "font-medium",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: item.blurb
					})]
				}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/owners/saved",
						className: "font-medium",
						children: "Saved vehicles & builds"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Sign in to keep favorites across devices."
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { ResourcesPage as component };
