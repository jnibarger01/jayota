import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accessibility-BJ2PUODF.js
var import_jsx_runtime = require_jsx_runtime();
function AccessibilityPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Accessibility"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: "This digital showroom targets WCAG 2.2 AA: semantic headings, keyboard access, visible focus, form error text, skip link, and a 3D fallback poster when WebGL/WebGPU is unavailable."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: [
					"If you find a barrier, contact ",
					DEALER.name,
					" at ",
					DEALER.phone.general,
					" and describe the page and assistive technology you were using."
				]
			})
		]
	}) });
}
//#endregion
export { AccessibilityPage as component };
