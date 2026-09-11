import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { n as SiteShell, o as writeConsent } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-yz6SA_kf.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Privacy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: [DEALER.name, " collects only what you submit on this site: contact details, vehicle interest, service/test-drive/trade-in requests, and optional account data if you sign in. We do not sell that information. Analytics events do not include names, emails, phones, or VINs."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: "To request deletion of an account or a stored request, email or call the dealership and include the reference id from your confirmation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Official dealer privacy practices also apply on",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "underline",
						href: DEALER.website,
						target: "_blank",
						rel: "noreferrer",
						children: DEALER.website
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "cookies",
				className: "mt-10 border border-border bg-surface p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Analytics cookies"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Optional analytics stay off until you allow them. Essential cookies for sign-in do not require this."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => {
								writeConsent("necessary");
							},
							children: "Necessary only"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => {
								writeConsent("all");
							},
							children: "Allow analytics"
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { PrivacyPage as component };
