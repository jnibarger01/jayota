import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-DzenR1kc.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { o as createSsrRpc } from "./catalog-0lXXzwn9.mjs";
import { a as tradeInSchema, i as testDriveSchema, n as leadSchema, r as serviceSchema } from "./forms-CRxgzuAc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intakes-PHMCk5t9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-28 w-full border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent", className),
	...props
}));
Textarea.displayName = "Textarea";
var submitLead = createServerFn({ method: "POST" }).validator((input) => leadSchema.parse(input)).handler(createSsrRpc("f8cffb7c51575256f424ff721e38c97c34004c3356f13492a492c543b79127c8"));
var submitTestDrive = createServerFn({ method: "POST" }).validator((input) => testDriveSchema.parse(input)).handler(createSsrRpc("106f2f0e7f2a4fe86d20e675a84afeaef52fd262aaec54e874df29001c856af3"));
var submitTradeIn = createServerFn({ method: "POST" }).validator((input) => tradeInSchema.parse(input)).handler(createSsrRpc("25f6a082eaa6caf33ce20b2ab4c995e5dcbe1983da19b66e2f438c7bd44f0638"));
var submitServiceRequest = createServerFn({ method: "POST" }).validator((input) => serviceSchema.parse(input)).handler(createSsrRpc("31b09b957647a74c79f4e160e47d750e4b0339c4faacbcb23228b5d78525bd3d"));
//#endregion
export { submitTradeIn as a, submitTestDrive as i, submitLead as n, submitServiceRequest as r, Textarea as t };
