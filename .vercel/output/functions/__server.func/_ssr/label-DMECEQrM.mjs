import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-DzenR1kc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-DMECEQrM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("flex h-11 w-full border border-border bg-surface px-3 text-sm text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent", className),
	...props
}));
Input.displayName = "Input";
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium uppercase tracking-[0.16em] text-muted", className),
		...props
	});
}
//#endregion
export { Label as n, Input as t };
